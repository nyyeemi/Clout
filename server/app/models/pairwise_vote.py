import datetime
import uuid

from sqlalchemy import (
    UUID,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class PairwiseVote(Base):
    __tablename__ = "pairwise_votes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    competition_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("competitions.id", ondelete="CASCADE"), nullable=False
    )

    entry_id_1: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("competition_entries.id", ondelete="CASCADE"), nullable=False
    )
    entry_id_2: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("competition_entries.id", ondelete="CASCADE"), nullable=False
    )

    winner_entry_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("competition_entries.id", ondelete="CASCADE"), nullable=False
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # db level guard for duplicates
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "competition_id",
            "entry_id_1",
            "entry_id_2",
            name="uq_user_pair_per_competition",
        ),
    )
