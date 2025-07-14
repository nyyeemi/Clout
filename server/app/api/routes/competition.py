from typing import Any
import uuid
from fastapi import APIRouter, Depends

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
    get_current_user,
)


router = APIRouter(prefix="/competition", tags=["competitions"])


@router.get(
    "/", dependencies=[Depends(get_current_user)], response_model=CompetitionsPublic
)
def read_competitions(session: SessionDep) -> Any:
    """
    Read all competitions.
    """


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


@router.get(
    "/current",
    dependencies=[Depends(get_current_user)],
    response_model=CompetitionPublic,
)
def read_current_competition(
    session: SessionDep, status: CompetitionStatus = "capturing"
) -> Any:
    """
    Read current competition (status should be capturing or voting)
    """


@router.get("/latest", dependencies=[Depends(get_current_user)], response_model=...)
def read_latest_competition(session: SessionDep) -> Any:
    """
    Read results from latest competition. Leaderboard
    """


@router.get("/vote", dependencies=[Depends(get_current_user)], response_model=...)
def read_entries_me(session: SessionDep) -> Any:
    """
    Get (NUMBER OF PAIRS) pairs of entries for voting.
    """


@router.post("/vote", response_model=...)
def create_vote(
    session: SessionDep,
    currentUser: CurrentUser,
    competition_pair_in: tuple[CompetitionEntry, CompetitionEntry],
) -> Any:
    """
    Vote between one pair of posts.
    """
    # get entries from db to orm objects
    update_rating(
        session=session,
    )
    # update pairwise vote table (create pairwise_vote)
    return Message()
