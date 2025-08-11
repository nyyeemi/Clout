import random
import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from trueskill import Rating, rate_1vs1
from app.models.competition_entry import CompetitionEntry
from app.api.deps import SessionDep
from app.models.pairwise_vote import PairwiseVote
import time


def compute_ucb(entry: CompetitionEntry, k=1.0):
    return entry.mu + k * entry.sigma


def normalize_pair(id1: uuid.UUID, id2: uuid.UUID) -> tuple[uuid.UUID, uuid.UUID]:
    return tuple(sorted((id1, id2)))


def get_user_viewed_pairs(session: Session, user_id: uuid.UUID):
    statement = select(PairwiseVote.entry_id_1, PairwiseVote.entry_id_2).where(
        PairwiseVote.user_id == user_id
    )
    pairs = session.execute(statement).all()
    pair_set = {tuple(row) for row in pairs}
    return pair_set


# Alpha controls vote balancing: lower values (e.g. 0.3) allow bigger vote count differences,
# while values closer to 1.0 enforce more equal exposure across entries.
def get_sampled_pair(all_entries: list[CompetitionEntry], alpha=0.7):
    samples = [
        (
            entry,
            random.gauss(entry.mu, entry.sigma) / (1 + entry.comparisons) ** alpha,
        )
        for entry in all_entries
    ]
    top_two = sorted(samples, key=lambda x: x[1], reverse=True)[:2]
    return top_two[0][0], top_two[1][0]


def sample_pair(
    *,
    session: Session,
    all_entries: list[CompetitionEntry],
    user_id: uuid.UUID,
) -> tuple[CompetitionEntry, CompetitionEntry]:
    if len(all_entries) < 2:
        raise ValueError("Need at least two entries.")

    viewed_pairs = get_user_viewed_pairs(session=session, user_id=user_id)
    max_attempts = 10000  # TODO: test and fix to be robust
    start = time.perf_counter()
    for i in range(max_attempts):
        entry1, entry2 = get_sampled_pair(all_entries)
        normalized_sampled_pair = normalize_pair(entry1.id, entry2.id)

        if normalized_sampled_pair not in viewed_pairs:
            end = time.perf_counter()
            print(f"Execution time: {end - start:.6f} seconds")
            print(f"INFO --- Found pair after {i} iterations.")
            return entry1, entry2

    raise ValueError(
        f"Could not find an unseen pair for user {user_id} after {max_attempts} attempts."
    )


def update_rating(
    *, session: SessionDep, winner: CompetitionEntry, loser: CompetitionEntry
):
    r1 = Rating(winner.mu, winner.sigma)
    r2 = Rating(loser.mu, loser.sigma)

    new_r1, new_r2 = rate_1vs1(r1, r2)

    winner.mu = new_r1.mu
    winner.sigma = new_r1.sigma
    winner.comparisons += 1
    winner.upvotes += 1

    loser.mu = new_r2.mu
    loser.sigma = new_r2.sigma
    loser.comparisons += 1
    loser.downvotes += 1

    session.commit()
