from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

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
    VotePair,
)
from app.models.competition import Competition, CompetitionStatus


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
        .order_by(Competition.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    competitions = session.scalars(statement).all()
    return CompetitionsPublic(data=competitions, count=len(competitions))


@router.get(
    "/current",
    dependencies=[Depends(get_current_user)],
    response_model=CompetitionPublic,
)
def read_current_competition(
    session: SessionDep, status: CompetitionStatus = "capturing"
) -> CompetitionPublic:
    """
    Read current competition (status should be capturing or voting)
    """
    competition = get_competition_by_status(session=session, status=status)
    return competition


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
