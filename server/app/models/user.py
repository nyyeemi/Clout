import uuid
from typing import List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base
from sqlalchemy import Boolean, String
from sqlalchemy.ext.hybrid import hybrid_property

from app.models import Follower, Post, Comment, Like


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    first_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    username: Mapped[str] = mapped_column(
        String(128), unique=True, nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    bio: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    profile_picture_url: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True
    )

    # Relationships
    likes: Mapped[List["Like"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

    posts: Mapped[List["Post"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

    comments: Mapped[List["Comment"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

    followers: Mapped[List["Follower"]] = relationship(
        back_populates="followed",
        foreign_keys="[Follower.user_id2]",
        cascade="all, delete-orphan",
    )

    following: Mapped[List["Follower"]] = relationship(
        back_populates="follower",
        foreign_keys="[Follower.user_id1]",
        cascade="all, delete-orphan",
    )
