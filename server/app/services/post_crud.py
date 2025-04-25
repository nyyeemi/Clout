from uuid import UUID
from sqlalchemy.orm import Session

from app.models.post import Post
from app.schemas.posts import PostCreate


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
