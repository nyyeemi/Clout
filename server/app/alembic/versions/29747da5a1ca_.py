"""Add ondelete CASCADE to relevant foreign keys

Revision ID: 29747da5a1ca
Revises: 653c4a6149a1
Create Date: 2025-07-28 15:24:20.455257
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "29747da5a1ca"
down_revision: Union[str, None] = "653c4a6149a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop and recreate competition_entries.post_id with ON DELETE CASCADE
    op.drop_constraint(
        "competition_entries_post_id_fkey", "competition_entries", type_="foreignkey"
    )
    op.create_foreign_key(
        None, "competition_entries", "posts", ["post_id"], ["id"], ondelete="CASCADE"
    )

    # Drop and recreate competition_entries.competition_id with ON DELETE CASCADE
    op.drop_constraint(
        "competition_entries_competition_id_fkey",
        "competition_entries",
        type_="foreignkey",
    )
    op.create_foreign_key(
        None,
        "competition_entries",
        "competitions",
        ["competition_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Drop and recreate pairwise_votes.competition_id with ON DELETE CASCADE
    op.drop_constraint(
        "pairwise_votes_competition_id_fkey", "pairwise_votes", type_="foreignkey"
    )
    op.create_foreign_key(
        None,
        "pairwise_votes",
        "competitions",
        ["competition_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Drop and recreate pairwise_votes.winner_entry_id with ON DELETE CASCADE
    op.drop_constraint(
        "pairwise_votes_winner_entry_id_fkey", "pairwise_votes", type_="foreignkey"
    )
    op.create_foreign_key(
        None,
        "pairwise_votes",
        "competition_entries",
        ["winner_entry_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Drop and recreate pairwise_votes.loser_entry_id with ON DELETE CASCADE
    op.drop_constraint(
        "pairwise_votes_loser_entry_id_fkey", "pairwise_votes", type_="foreignkey"
    )
    op.create_foreign_key(
        None,
        "pairwise_votes",
        "competition_entries",
        ["loser_entry_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Add missing enum values to competition_status
    op.execute("ALTER TYPE competition_status ADD VALUE IF NOT EXISTS 'PENDING'")


def downgrade() -> None:
    """Downgrade schema."""
    # Revert changes in reverse order

    op.drop_constraint(None, "pairwise_votes", type_="foreignkey")
    op.create_foreign_key(
        "pairwise_votes_loser_entry_id_fkey",
        "pairwise_votes",
        "competition_entries",
        ["loser_entry_id"],
        ["id"],
    )

    op.drop_constraint(None, "pairwise_votes", type_="foreignkey")
    op.create_foreign_key(
        "pairwise_votes_winner_entry_id_fkey",
        "pairwise_votes",
        "competition_entries",
        ["winner_entry_id"],
        ["id"],
    )

    op.drop_constraint(None, "pairwise_votes", type_="foreignkey")
    op.create_foreign_key(
        "pairwise_votes_competition_id_fkey",
        "pairwise_votes",
        "competitions",
        ["competition_id"],
        ["id"],
    )

    op.drop_constraint(None, "competition_entries", type_="foreignkey")
    op.create_foreign_key(
        "competition_entries_competition_id_fkey",
        "competition_entries",
        "competitions",
        ["competition_id"],
        ["id"],
    )

    op.drop_constraint(None, "competition_entries", type_="foreignkey")
    op.create_foreign_key(
        "competition_entries_post_id_fkey",
        "competition_entries",
        "posts",
        ["post_id"],
        ["id"],
    )
