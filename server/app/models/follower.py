from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Follower(Base):
    __tablename__ = "followers"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id1: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    user_id2: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    follower: Mapped["User"] = relationship(
        back_populates="following", foreign_keys=[user_id1]
    )

    followed: Mapped["User"] = relationship(
        back_populates="followers", foreign_keys=[user_id2]
    )
