from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select

from app.api.deps import (
    CurrentUser,
    CurrentVotingCompetition,
    SessionDep,
    get_competition_by_status,
    get_current_user,
)
from app.models.competition_entry import CompetitionEntry
from app.services.rating import normalize_pair, sample_pair, update_rating
from app.models.pairwise_vote import PairwiseVote

from app.schemas.utils import Message
from app.schemas.competition import (
    CompetitionPublic,
    CompetitionsPublic,
    CreateVotePair,
    CurrentCompetitionStats,
    LeaderboardEntry,
    LeaderboardPublic,
    VotePair,
)
from app.models.competition import Competition, CompetitionStatus
from app.models.user import User
from app.models.post import Post


router = APIRouter(prefix="/competitions", tags=["competitions"])


@router.get(
    "/", dependencies=[Depends(get_current_user)], response_model=CompetitionsPublic
)
def read_competitions(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Read all finished competitions.
    """
    statement = (
        select(Competition)
        .where(Competition.status == CompetitionStatus.FINISHED)
        .order_by(Competition.start_time.desc())
        .offset(skip)
        .limit(limit)
    )
    competitions = session.scalars(statement).all()
    return CompetitionsPublic(data=competitions, count=len(competitions))


# TODO: refactor and check performance, current implementation repeats queries for no reason
@router.get(
    "/{competition_id}/leaderboard",
    dependencies=[Depends(get_current_user)],
    response_model=LeaderboardPublic,
)
def read_leaderboard(
    session: SessionDep,
    competition_id: uuid.UUID,
    current_user: CurrentUser,
    top_n: int = 100,
) -> Any:
    """
    Read leaderboard data given competition start time. Returns a list of top_n leaderboard entries,
    and general information on the competition.
    """
    competition = session.get(Competition, competition_id)

    if competition is None:
        raise HTTPException(status_code=404, detail="Competition with id not found.")
    if competition.status != CompetitionStatus.FINISHED:
        raise HTTPException(
            status_code=404, detail="Competition status is not finished."
        )

    statement = (
        select(
            User.username,
            Post.image_url,
        )
        .select_from(CompetitionEntry)
        .join(CompetitionEntry.post)
        .join(Post.owner)
        .where(CompetitionEntry.competition_id == competition.id)
    )

    statement = statement.order_by(CompetitionEntry.mu.desc()).limit(top_n)

    rows = session.execute(statement).all()

    leaderboard = [
        LeaderboardEntry(username=username, image_url=image_url)
        for username, image_url in rows
    ]

    # num of participants
    statement = (
        select(func.count())
        .select_from(CompetitionEntry)
        .where(CompetitionEntry.competition_id == competition.id)
    )

    count = session.execute(statement).scalar()

    user_entry_stmt = (
        select(CompetitionEntry.mu)
        .select_from(CompetitionEntry)
        .where(CompetitionEntry.owner_id == current_user.id)
    )

    user_entry_mu = session.execute(user_entry_stmt).scalar()

    rank = None
    if user_entry_mu is not None:
        rank_stmt = (
            select(func.count())
            .select_from(CompetitionEntry)
            .where(
                CompetitionEntry.competition_id == competition.id,
                CompetitionEntry.mu > user_entry_mu,
            )
        )

        rank = session.execute(rank_stmt).scalar() + 1

    return LeaderboardPublic(
        competition=competition,
        leaderboard=leaderboard,
        participant_count=count,
        current_user_rank=rank,
    )


@router.get(
    "/current",
    dependencies=[Depends(get_current_user)],
    response_model=CurrentCompetitionStats,
)
def read_current_competition(
    session: SessionDep,
    current_user: CurrentUser,
    status: CompetitionStatus = CompetitionStatus.CAPTURING,
) -> CurrentCompetitionStats:
    """
    Read current competition with some statistics (status should be capturing or voting)
    """
    competition = get_competition_by_status(session=session, status=status)

    user_votes_count_stmt = (
        select(func.count())
        .select_from(PairwiseVote)
        .where(
            PairwiseVote.competition_id == competition.id,
            current_user.id == PairwiseVote.user_id,
        )
    )
    user_votes_count = session.execute(user_votes_count_stmt).scalar_one()

    all_votes_count_stmt = (
        select(func.count())
        .select_from(PairwiseVote)
        .where(
            PairwiseVote.competition_id == competition.id,
        )
    )

    all_votes_count = session.execute(all_votes_count_stmt).scalar_one()

    competitors_count_stmt = (
        select(func.count())
        .select_from(CompetitionEntry)
        .where(competition.id == CompetitionEntry.competition_id)
    )

    competitors_count = session.execute(competitors_count_stmt).scalar_one()

    return CurrentCompetitionStats(
        competition=competition,
        user_votes_count=user_votes_count,
        all_votes_count=all_votes_count,
        competitors_count=competitors_count,
    )


@router.get(
    "/latest",
    dependencies=[Depends(get_current_user)],
    response_model=CompetitionPublic,
)
def read_latest_competition(session: SessionDep) -> CompetitionPublic:
    """
    Read results from latest competition. Leaderboard
    """
    statement = (
        select(Competition)
        .where(Competition.status == CompetitionStatus.FINISHED)
        .order_by(Competition.created_at.desc())
    )
    competition = session.scalars(statement).first()
    if not competition:
        raise HTTPException(status_code=404, detail="No finished competitions found.")
    return competition


@router.get(
    "/votepair", dependencies=[Depends(get_current_user)], response_model=VotePair
)
def read_entries_me(
    session: SessionDep,
    current_competition: CurrentVotingCompetition,
    current_user: CurrentUser,
) -> VotePair:
    """
    Get (NUMBER OF PAIRS) one pair of entries for voting.
    """
    statement = select(CompetitionEntry).where(
        CompetitionEntry.competition_id == current_competition.id
    )
    all_entries = session.scalars(statement).all()

    entry1, entry2 = sample_pair(
        session=session, all_entries=all_entries, user_id=current_user.id
    )

    return VotePair(entry_1=entry1, entry_2=entry2)


@router.post("/vote", response_model=Message)
def create_vote(
    session: SessionDep,
    current_user: CurrentUser,
    current_competition: CurrentVotingCompetition,
    result_in: CreateVotePair,
) -> Any:
    """
    Create vote between one pair of posts.
    """
    # get entries from db to orm objects
    winner = session.get(CompetitionEntry, result_in.winner_id)
    if not winner:
        raise HTTPException(status_code=404, detail="Winner entry not found")

    loser = session.get(CompetitionEntry, result_in.loser_id)
    if not loser:
        raise HTTPException(status_code=404, detail="Loser entry not found")

    if winner.competition_id != loser.competition_id:
        raise HTTPException(status_code=400, detail="Photos not in same competetion")

    if winner.competition_id != current_competition.id:
        raise HTTPException(
            status_code=400, detail="Photos not in the current competition"
        )

    update_rating(
        session=session,
        winner=winner,
        loser=loser,
    )

    # update pairwise vote table (create pairwise_vote)
    competition_id = current_competition.id
    # avoids (A,B) vs (B,A) being treated as different
    entry_id_1, entry_id_2 = normalize_pair(result_in.winner_id, result_in.loser_id)

    db_obj = PairwiseVote(
        user_id=current_user.id,
        competition_id=competition_id,
        entry_id_1=entry_id_1,
        entry_id_2=entry_id_2,
        winner_entry_id=winner.id,
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)

    return Message(message="Vote successful.")


'''
@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionsPublic,
)
def read_competitions_for_superuser(session: SessionDep) -> Any:
    """
    Read all competitions and return more data for superuser
    """


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=...
)
def create_competition(session: SessionDep) -> Any:
    """
    Admin route for creating competitions.
    """


@router.patch(
    "/{competition_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=...,
)
def edit_competition(competition_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Admin route for editing competitions.
    """


@router.delete(
    "/{competition_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=...,
)
def delete_competition(competition_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Admin route for deleting competitions.
    """

'''
