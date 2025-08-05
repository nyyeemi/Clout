import random
from trueskill import Rating, rate_1vs1
from app.models.competition_entry import CompetitionEntry
from app.api.deps import SessionDep


def compute_ucb(entry: CompetitionEntry, k=1.0):
    return entry.mu + k * entry.sigma


def sample_pair(
    *,
    all_entries: list[CompetitionEntry],
) -> tuple[CompetitionEntry, CompetitionEntry]:
    if len(all_entries) < 2:
        raise ValueError("Need at least two entries.")

    samples = [(entry, random.gauss(entry.mu, entry.sigma)) for entry in all_entries]
    top_two = sorted(samples, key=lambda x: x[1], reverse=True)[:2]
    return top_two[0][0], top_two[1][0]


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
