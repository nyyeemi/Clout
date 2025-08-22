from datetime import datetime, timezone
from typing import Annotated, Literal
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import delete, func, or_, select, update

from app.api.deps import (
    CurrentUser,
    CurrentVotingCompetition,
    SessionDep,
    get_current_active_superuser,
)
from app.models.competition_entry import CompetitionEntry

from app.schemas.competition import (
    CompetitionCreate,
    CompetitionEntriesAdmin,
    CompetitionReadAdmin,
    CompetitionUpdate,
    CompetitionsReadAdmin,
    PairwiseVotesReadAdmin,
    VotePairAdminResponse,
)
from app.models.competition import Competition, CompetitionStatus
from app.models.pairwise_vote import PairwiseVote
from app.schemas.posts import PostCreate, PostPublic
from app.services import post_crud as crud
from app.schemas.utils import Message
from app.services.rating import sample_pair
from app.schemas.user import UserAdmin, UsersAdminResponse
from app.models.user import User
from app.services import follower_crud


router = APIRouter(prefix="/admin", tags=["admin"])


class CompetitionFilterParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(100, gt=0)
    sort_order: Literal["asc", "desc"] = "desc"


@router.get(
    "/competitions",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionsReadAdmin,
)
def read_competitions(
    session: SessionDep,
    filters: Annotated[CompetitionFilterParams, Depends()],
) -> CompetitionsReadAdmin:
    """
    Read all competitions.
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


@router.get(
    "/competitions/current",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionsReadAdmin,
)
def read_current_competition(session: SessionDep) -> CompetitionsReadAdmin:
    """
    Read current competition (capturing and voting)
    """

    statement = select(Competition).where(
        or_(
            Competition.status == CompetitionStatus.VOTING,
            Competition.status == CompetitionStatus.CAPTURING,
        )
    )
    competitions = session.scalars(statement).all()

    return CompetitionsReadAdmin(data=competitions, count=len(competitions))


class EntryFilterParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(100, gt=0)
    sort_by: Literal["mu", "upvotes", "downvotes", "sigma", "comparisons"] = "mu"
    sort_order: Literal["asc", "desc"] = "desc"


@router.get(
    "/competitions/{competition_id}/entries",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionEntriesAdmin,
)
def read_entries(
    competition_id: uuid.UUID,
    session: SessionDep,
    filters: Annotated[EntryFilterParams, Depends()],
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


@router.patch(
    "/competitions/current/entries",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message,
)
def reset_entries(session: SessionDep, current_competition: CurrentVotingCompetition):
    """
    Reset state for all entries from current competition
    """
    stmt = (
        update(CompetitionEntry)
        .where(CompetitionEntry.competition_id == current_competition.id)
        .values(
            mu=25,
            sigma=8.333,
            upvotes=0,
            downvotes=0,
            comparisons=0,
        )
    )
    session.execute(delete(PairwiseVote))
    session.execute(stmt)
    session.commit()

    return Message(message="Entry states restored to default succesfully.")


class VoteFilterParams(BaseModel):
    skip: int = Query(0, ge=0)
    limit: int = Query(100, gt=0)
    sort_order: Literal["asc", "desc"] = "desc"


@router.get(
    "/competitions/{competition_id}/votes",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=PairwiseVotesReadAdmin,
)
def get_pairwise_votes_by_competition_id(
    competition_id: uuid.UUID,
    session: SessionDep,
    filters: Annotated[VoteFilterParams, Depends()],
) -> PairwiseVotesReadAdmin:
    """
    Read pairwise votes by competition id
    """

    order = (
        PairwiseVote.created_at.asc()
        if filters.sort_order == "asc"
        else PairwiseVote.created_at.desc()
    )

    statement = (
        select(PairwiseVote)
        .where(PairwiseVote.competition_id == competition_id)
        .order_by(order)
        .offset(filters.skip)
        .limit(filters.limit)
    )

    votes = session.execute(statement).scalars().all()

    return PairwiseVotesReadAdmin(data=votes, count=len(votes))


@router.post(
    "/competitions",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionReadAdmin,
)
def create_competition(
    session: SessionDep, competition_in: CompetitionCreate
) -> CompetitionReadAdmin:
    """
    Create new competition
    """
    now = datetime.now(timezone.utc)

    if now < competition_in.start_time:
        status = CompetitionStatus.PENDING
    elif competition_in.start_time <= now < competition_in.vote_start_time:
        status = CompetitionStatus.CAPTURING
    elif competition_in.vote_start_time <= now < competition_in.end_time:
        status = CompetitionStatus.VOTING
    else:
        status = CompetitionStatus.FINISHED

    new_competition = Competition(
        category=competition_in.category,
        description=competition_in.description,
        start_time=competition_in.start_time,
        vote_start_time=competition_in.vote_start_time,
        end_time=competition_in.end_time,
        status=status,
    )

    session.add(new_competition)
    session.commit()
    session.refresh(new_competition)

    return new_competition


@router.delete(
    "/competitions/{competition_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message,
)
def delete_competition(
    competition_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Message:
    """
    Delete competition
    """
    competition = session.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")

    session.delete(competition)
    session.commit()

    return Message(message="Deleted successfully.")


@router.post(
    "/posts",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=PostPublic,
)
def create_post_for_voting(
    session: SessionDep,
    current_user: CurrentUser,
    current_competition: CurrentVotingCompetition,
    post_in: PostCreate,
) -> PostPublic:
    """
    Create post and competition entry.
    """
    post = crud.create_post(session=session, post_in=post_in, owner_id=current_user.id)
    competition_entry = CompetitionEntry(
        competition_id=current_competition.id,
        owner_id=current_user.id,
        post_id=post.id,
    )
    session.add(competition_entry)
    session.commit()

    return post


@router.delete(
    "/entries/{entry_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message,
)
def delete_competition_entry(
    entry_id: uuid.UUID,
    session: SessionDep,
) -> Message:
    """
    Delete specific competition entry
    """
    entry = session.get(CompetitionEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Competition entry not found")

    session.delete(entry)
    session.commit()

    return Message(message="Deleted successfully.")


@router.get(
    "/votepair",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=VotePairAdminResponse,
)
def read_entries_me(
    session: SessionDep,
    current_competition: CurrentVotingCompetition,
    current_user: CurrentUser,
) -> VotePairAdminResponse:
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

    return VotePairAdminResponse(entry_1=entry1, entry_2=entry2)


@router.delete(
    "/votes/{vote_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message,
)
def delete_pairwise_vote(
    vote_id: uuid.UUID,
    session: SessionDep,
) -> Message:
    """
    Delete a specific pairwise vote.
    """
    vote = session.get(PairwiseVote, vote_id)
    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    session.delete(vote)
    session.commit()

    return Message(message="Deleted successfully.")


@router.patch(
    "/competitions/{competition_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CompetitionReadAdmin,
)
def update_competition(
    competition_id: uuid.UUID,
    competition_in: CompetitionUpdate,
    session: SessionDep,
) -> CompetitionReadAdmin:
    """
    Update competition
    """
    competition = session.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")

    for field, value in competition_in.model_dump(exclude_unset=True).items():
        setattr(competition, field, value)

    session.commit()
    session.refresh(competition)

    return competition


class UserFilterParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(100, gt=0)


@router.get(
    "/users",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersAdminResponse,
)
def read_users(
    session: SessionDep,
    filters: Annotated[UserFilterParams, Depends()],
) -> UsersAdminResponse:
    """
    Retrieve users.
    """
    statement = select(User).offset(filters.skip).limit(filters.limit)
    users = session.scalars(statement).all()

    updated_user_list = []
    for user in users:
        follower_count = follower_crud.get_follower_count(
            session=session, user_id=user.id
        )
        following_count = follower_crud.get_following_count(
            session=session, user_id=user.id
        )

        account = UserAdmin.model_validate(user).model_copy(
            update={
                "num_followers": follower_count,
                "num_following": following_count,
                "num_posts": len(user.posts),
            }
        )
        updated_user_list.append(account)

    return UsersAdminResponse(data=updated_user_list, count=len(updated_user_list))


class StatsResponse(BaseModel):
    num_combinations: int
    votes_count: int


@router.get(
    "/competitions/current/stats",
    dependencies=[Depends(get_current_active_superuser)],
)
def read_current_competition_stats(
    session: SessionDep,
    current_competition: CurrentVotingCompetition,
    current_user: CurrentUser,
) -> StatsResponse:
    count_stmt = (
        select(func.count())
        .select_from(CompetitionEntry)
        .where(CompetitionEntry.competition_id == current_competition.id)
    )
    count = session.execute(count_stmt).scalar_one()
    num_combinations = count * (count - 1) / 2

    votes_count_stmt = (
        select(func.count())
        .select_from(PairwiseVote)
        .where(
            PairwiseVote.competition_id == current_competition.id,
            PairwiseVote.user_id == current_user.id,
        )
    )
    votes_count = session.execute(votes_count_stmt).scalar_one()
    return StatsResponse(num_combinations=num_combinations, votes_count=votes_count)
