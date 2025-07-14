from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.services import user_crud as crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
    get_current_user,
)
from app.models import User
from app.core.security import get_password_hash, verify_password
from app.models.follower import Follower


router = APIRouter(prefix="/competition", tags=["competitions"])


@router.get(
    "/", dependencies=[Depends(get_current_user)], response_model=CompetitionsPublic
)
def read_competitions(session: SessionDep) -> Any:
    """
    Read all competitions.
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
