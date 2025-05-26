from uuid import UUID
from pydantic import HttpUrl
from sqlalchemy import Sequence, select
from sqlalchemy.orm import Session

from app.models import Post, Comment, Like
from app.schemas.posts import CommentCreate, PostCreate, PostPublic, PostUpdate
from app.models.user import User


def create_post(*, session: Session, post_in: PostCreate, owner_id: UUID) -> Post:
    db_obj = Post(
        image_url=str(post_in.image_url),
        thumbnail_url=str(post_in.thumbnail_url) if post_in.thumbnail_url else None,
        caption=post_in.caption,
        owner_id=owner_id,
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_post(*, session: Session, db_post: Post, post_in: PostUpdate) -> Post:
    post_data = post_in.model_dump(exclude_unset=True)

    for field, value in post_data.items():
        if isinstance(value, HttpUrl):  # convert for sqlalchemy
            value = str(value)
        setattr(db_post, field, value)

    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return db_post


def create_post_comment(
    *, session: Session, comment_in: CommentCreate, owner_id: UUID, post_id: UUID
) -> Comment:
    db_obj = Comment(post_id=post_id, owner_id=owner_id, content=comment_in.content)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_post_comment(
    session: Session,
    db_obj: Comment,
    comment_in: CommentCreate,
) -> Comment:
    db_obj.content = comment_in.content
    session.commit()
    session.refresh(db_obj)
    return db_obj


def create_post_like(*, session: Session, owner_id: UUID, post_id: UUID) -> Like:
    db_obj = Like(post_id=post_id, owner_id=owner_id)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def populate_is_liked_by_current_user(
    session: Session,
    current_user: User,
    posts: Sequence[Post],
) -> Sequence[Post]:
    user_liked_post_ids_stmt = select(Like.post_id).where(
        Like.owner_id == current_user.id
    )
    user_liked_post_ids = set(session.scalars(user_liked_post_ids_stmt).all())

    posts_data = []

    for post in posts:
        is_liked_by_current_user = post.id in user_liked_post_ids
        base_data = PostPublic.model_validate(post, from_attributes=True)
        post_data = base_data.model_copy(
            update={"is_liked_by_current_user": is_liked_by_current_user}
        )
        posts_data.append(post_data)

    return posts_data
