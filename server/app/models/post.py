import uuid
from datetime import datetime
from typing import TYPE_CHECKING  # , List

from sqlalchemy import (
    UUID,
    ForeignKey,
    String,
    Text,
    DateTime,
    Boolean,
    Integer,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from .user import User
    from .comment import Comment
    from .like import Like
    from .competition_entry import CompetitionEntry


# TODO: add is_in_comp etc
class Post(Base):
    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    is_visible: Mapped[bool] = mapped_column(
        Boolean, default=True, server_default="true", nullable=False
    )
    num_likes: Mapped[int] = mapped_column(
        Integer, default=0, server_default="0", nullable=False
    )
    num_comments: Mapped[int] = mapped_column(
        Integer, default=0, server_default="0", nullable=False
    )

    owner: Mapped["User"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", cascade="all, delete-orphan"
    )

    likes: Mapped[list["Like"]] = relationship("Like", cascade="all, delete-orphan")

    competition_entry: Mapped["CompetitionEntry"] = relationship(back_populates="post")
