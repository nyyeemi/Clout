from typing import TYPE_CHECKING
import uuid
from datetime import datetime

from sqlalchemy import (
    UUID,
    String,
    DateTime,
    Boolean,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from .competition_entry import CompetitionEntry


class Competition(Base):
    __tablename__ = "competitions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    category: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str] = mapped_column(String(1024), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # status: 'taking photos', 'voting', 'suspended'
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    # voting starts
    vote_start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    entries: Mapped[list["CompetitionEntry"]] = relationship(
        "CompetitionEntry", back_populates="competition"
    )
