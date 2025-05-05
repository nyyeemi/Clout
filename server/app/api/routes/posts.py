"""
├── /posts/         # Posts (Images)
│   ├── POST /      (Authenticated: Create a new post)
│   ├── GET /       (Authenticated: Get feed - e.g., posts from followed users, pagination)
│   ├── GET /{post_id} (Public/Authenticated: Get details of a specific post)
│   ├── PATCH /{post_id} (Authenticated: Update own post - owner only)
│   ├── DELETE /{post_id} (Authenticated: Delete own post - owner or admin)
│   │
│   ├── GET /{post_id}/comments (Public/Authenticated: List comments on a post, pagination)
│   ├── POST /{post_id}/comments (Authenticated: Create a comment on a post)
│   │
│   ├── GET /{post_id}/likes (Public/Authenticated: List users who liked a post, pagination)
│   ├── POST /{post_id}/likes (Authenticated: Like a post)
│   └── DELETE /{post_id}/likes (Authenticated: Unlike a post) # Or DELETE /posts/{post_id}/likes/me
"""

from datetime import datetime
from typing import Annotated, Any, Literal
import uuid
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import and_, func, select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import NoResultFound

from app.schemas.posts import (
    CommentCreate,
    CommentPublic,
    CommentsPublic,
    LikePublic,
    PostCreate,
    PostPublic,
    PostUpdate,
    PostsPublic,
    LikesPublic,
)
from app.schemas.user import Message
from app.services import post_crud as crud
from app.api.deps import CurrentUser, SessionDep
from app.models import Post, Comment, Like


router = APIRouter(prefix="/posts", tags=["posts"])


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)


# TODO: visibility checks
@router.get("/", response_model=PostsPublic)
def read_posts_feed(
    session: SessionDep,
    current_user: CurrentUser,
    last_post_created_at: datetime | None = None,
    limit: Annotated[int, Query(gt=0, le=100)] = 40,
) -> Any:
    """
    Retrieve feed posts for own user.
    """
    followed_user_ids = [f.user_id2 for f in current_user.following]
    followed_user_ids.append(current_user.id)
    base_filter = Post.owner_id.in_(followed_user_ids)
    if last_post_created_at:
        base_filter = and_(base_filter, Post.created_at < last_post_created_at)

    statement = (
        select(Post).where(base_filter).order_by(Post.created_at.desc()).limit(limit)
    )
    posts = session.scalars(statement).all()

    return PostsPublic(data=posts, count=len(posts))


@router.post("/", response_model=PostPublic)
def create_post_me(
    session: SessionDep,
    current_user: CurrentUser,
    post_in: PostCreate,
) -> Any:
    """
    Create a post for own user.
    """
    post = crud.create_post(session=session, post_in=post_in, owner_id=current_user.id)
    return post


# TODO: public/private posts (for followers / everyone)
# can_edit / is_owner return field for settings of post in frontend?
@router.get("/{post_id}", response_model=PostPublic)
def read_post_by_id(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get details from a post.
    """
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_visible and (post.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="This post is not visible to you")

    return post


@router.patch("/{post_id}", response_model=PostPublic)
def update_post(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    post_in: PostUpdate,
) -> Any:
    """
    Update own post.
    """
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not current_user.is_superuser and (post.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    post = crud.update_post(session=session, db_post=post, post_in=post_in)

    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete own post.
    """
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not current_user.is_superuser and (post.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(post)
    session.commit()

    return Message(message="Post deleted succesfully")


@router.get("/{post_id}/comments", response_model=CommentsPublic)
def read_post_comments(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    last_comment_created_at: datetime | None = None,
    limit: Annotated[int, Query(gt=0, le=100)] = 20,
    order_by: Literal[
        "created_at", "likes"
    ] = "created_at",  # likes only if if we add likes to comments
) -> Any:
    """
    Retrieve comments for a post. Pagination by comment.created_at
    """
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_visible and (post.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="This post is not visible to you")

    base_filter = Comment.post_id == post.id
    if last_comment_created_at:
        base_filter = and_(base_filter, Comment.created_at < last_comment_created_at)

    statement = (
        select(Comment)
        .where(base_filter)
        .options(selectinload(Comment.owner))
        .limit(limit)
    )

    if order_by == "created_at":
        statement = statement.order_by(Comment.created_at.desc())
    else:
        statement = statement.order_by(Comment.num_likes.desc())

    comments = session.scalars(statement).all()

    return CommentsPublic(data=comments, count=len(comments))


@router.post("/{post_id}/comments", response_model=CommentPublic)
def create_post_comment(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    comment_in: CommentCreate,
) -> Any:
    """
    Create a comment for post.
    """
    try:
        post = session.execute(
            select(Post).where(Post.id == post_id).with_for_update()
        ).scalar_one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = crud.create_post_comment(
        session=session,
        comment_in=comment_in,
        owner_id=current_user.id,
        post_id=post_id,
    )

    post.num_comments += 1
    session.commit()
    session.refresh(post)

    return comment


@router.delete("/{post_id}/comments/{comment_id}")
def delete_post_comment(
    comment_id: uuid.UUID,
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete own comment.
    """
    try:
        post = session.execute(
            select(Post).where(Post.id == post_id).with_for_update()
        ).scalar_one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if not current_user.is_superuser and (comment.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(comment)
    post.num_comments -= 1
    session.commit()
    session.refresh(post)

    return Message(message="Comment deleted succesfully")


"""
│   ├── GET /{post_id}/likes (Public/Authenticated: List users who liked a post, pagination)
│   ├── POST /{post_id}/likes (Authenticated: Like a post)
│   └── DELETE /{post_id}/likes (Authenticated: Unlike a post) # Or DELETE /posts/{post_id}/likes/me
"""


@router.get("/{post_id}/likes", response_model=LikesPublic)
def read_post_likes(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    last_like_created_at: datetime | None = None,
    limit: Annotated[int, Query(gt=0, le=100)] = 20,
) -> Any:
    """
    Retrieve likes for a post.
    """
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_visible and (post.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="This post is not visible to you")

    base_filter = Like.post_id == post.id
    if last_like_created_at:
        base_filter = and_(base_filter, Like.created_at < last_like_created_at)

    statement = (
        select(Like).where(base_filter).options(selectinload(Like.owner)).limit(limit)
    )

    statement = statement.order_by(Like.created_at.desc())
    likes = session.scalars(statement).all()

    return LikesPublic(data=likes, count=len(likes))


@router.post("/{post_id}/likes", response_model=LikePublic)
def create_like(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Like a post.
    """
    try:
        post = session.execute(
            select(Post).where(Post.id == post_id).with_for_update()
        ).scalar_one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Post not found")

    like = crud.create_post_like(
        session=session,
        owner_id=current_user.id,
        post_id=post_id,
    )

    post.num_likes += 1
    session.commit()
    session.refresh(post)

    return like


@router.delete("/{post_id}/likes/")
def delete_like(
    post_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete own like.
    """
    try:
        post = session.execute(
            select(Post).where(Post.id == post_id).with_for_update()
        ).scalar_one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Post not found")

    like = session.execute(
        select(Like).where(Like.owner_id == current_user.id, Like.post_id == post_id)
    ).scalar_one_or_none()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    if not current_user.is_superuser and (like.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(like)
    post.num_likes -= 1
    session.commit()
    session.refresh(post)

    return Message(message="Like deleted succesfully")
