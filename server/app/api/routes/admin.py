from typing import Annotated, Any, Literal
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select

from app.api.deps import (
    SessionDep,
    get_capturing_competition,
    get_competition_by_status,
    get_current_active_superuser,
    get_voting_competition,
)
from app.models.competition_entry import CompetitionEntry

from app.schemas.competition import (
    CompetitionEntriesAdmin,
    CompetitionReadAdmin,
    CompetitionsReadAdmin,
)
from app.models.competition import Competition, CompetitionStatus


router = APIRouter(prefix="/admin", tags=["admin"])


class EntryFilterParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(100, gt=0)
    sort_by: Literal["mu", "upvotes", "downvotes", "sigma", "comparisons"] = "mu"
    sort_order: Literal["asc", "desc"] = "desc"


@router.get(
    "/competition/{competition_id}/entries",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionEntriesAdmin,
)
def read_entries(
    competition_id: uuid.UUID,
    session: SessionDep,
    filters: Annotated[EntryFilterParams, Query()],
) -> CompetitionEntriesAdmin:
    """
    Read all entries from specific competition
    """

    competition = session.get(Competition, competition_id)

    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")

    sort_column = getattr(CompetitionEntry, filters.sort_by)

    if filters.sort_order == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    statement = (
        select(CompetitionEntry)
        .where(CompetitionEntry.competition_id == competition_id)
        .order_by(sort_column)
        .offset(filters.skip)
        .limit(filters.limit)
    )

    entries = session.execute(statement).scalars().all()

    return CompetitionEntriesAdmin(data=entries, count=len(entries))


class CompetitionFilterParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(100, gt=0)
    sort_order: Literal["asc", "desc"] = "desc"


@router.get(
    "/competition",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionsReadAdmin,
)
def read_competitions(
    session: SessionDep,
    filters: Annotated[CompetitionFilterParams, Depends()],
) -> Any:
    """
    Read all finished competitions.
    """
    order_column = (
        Competition.created_at.asc()
        if filters.sort_order == "asc"
        else Competition.created_at.desc()
    )

    statement = (
        select(Competition)
        .order_by(order_column)
        .offset(filters.skip)
        .limit(filters.limit)
    )
    competitions = session.scalars(statement).all()
    return CompetitionsReadAdmin(data=competitions, count=len(competitions))


'''
@router.get(
    "/current",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionReadAdmin,
)
def read_current_competition(session: SessionDep) -> CompetitionsReadAdmin:
    """
    Read current competition (status should be capturing or voting)
    """
    competition = get_competition_by_status(session=session)

    capturing_competition = get_capturing_competition(session=session)
    voting_competition = get_voting_competition(session=session)

    competitions = [c for c in [capturing_competition,voting_competition] if c is not None]

    return competition
'''
