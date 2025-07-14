from typing import TYPE_CHECKING
import uuid
from datetime import datetime

from sqlalchemy import (
    UUID,
    Integer,
    Sequence,
    String,
    DateTime,
    Boolean,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base

if TYPE_CHECKING:
    from .competition_entry import CompetitionEntry

import enum
from sqlalchemy import Enum


class CompetitionStatus(enum.Enum):
    CAPTURING = "capturing"
    VOTING = "voting"
    FINISHED = "finished"


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
    status: Mapped[CompetitionStatus] = mapped_column(
        Enum(CompetitionStatus, name="competition_status"),
        nullable=False,
        default=CompetitionStatus.CAPTURING,
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    vote_start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    competition_number: Mapped[int] = mapped_column(
        Integer,
        Sequence("competition_number_seq", start=1),  # PostgreSQL only
        unique=True,
        nullable=False,
    )

    entries: Mapped[list["CompetitionEntry"]] = relationship(
        "CompetitionEntry", back_populates="competition"
    )
