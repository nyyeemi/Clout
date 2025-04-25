from uuid import UUID
from pydantic import HttpUrl
from sqlalchemy.orm import Session

from app.models.post import Post
from app.schemas.posts import PostCreate, PostUpdate


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
