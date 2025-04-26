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

from app.schemas.posts import PostCreate, PostPublic, PostUpdate, PostsPublic
from app.schemas.user import Message
from app.services import post_crud as crud
from app.api.deps import CurrentUser, SessionDep
from app.models.post import Post


router = APIRouter(prefix="/posts", tags=["posts"])


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)


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

    base_filter = Post.owner_id.in_(followed_user_ids)
    if last_post_created_at:
        base_filter = and_(base_filter, Post.created_at < last_post_created_at)

    statement = (
        select(Post).where(base_filter).order_by(Post.created_at.desc()).limit(limit)
    )
    posts = session.scalars(statement).all()

    return PostsPublic(data=posts)


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
