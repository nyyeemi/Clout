from fastapi import APIRouter, HTTPException, Query
from app.api.deps import SessionDep
from app.models import User
from app.schemas.user import UserPublic, UsersPublic
from app.models.follower import Follower
from sqlalchemy import join, select, func
from app.services import user_crud as crud
# from app.schemas.image import ImagePublic  # You will need this


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/{username}", response_model=UserPublic)
def get_public_profile(username: str, session: SessionDep) -> User:
    """
    Get profile by username
    """
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


"""
MAKE HERE ROUTER FOR POSTS
"""


@router.get("/{username}/followers", response_model=UsersPublic)
def get_user_followers(
    username: str,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(15, ge=1, le=100),
) -> UsersPublic:
    """
    Get followers for user by username
    """
    # Find user
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Join User -> Follower
    follower_join = join(User, Follower, User.id == Follower.user_id1)

    # Fetch paginated followers
    # Select items which user table includes but from joined "table"
    # and only lines where user is followed by other users.
    # start with row number "skip" limits how many rows can be get from database.
    stmt = (
        select(User)
        .select_from(follower_join)
        .where(Follower.user_id2 == user.id)
        .offset(skip)
        .limit(limit)
    )
    followers = session.scalars(stmt).all()

    # Count total followers
    count_stmt = (
        select(func.count()).select_from(Follower).where(Follower.user_id2 == user.id)
    )
    count = session.scalar(count_stmt)

    return UsersPublic(data=followers, count=count)


@router.get("/{username}/following", response_model=UsersPublic)
def get_user_following(
    username: str,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(15, ge=1, le=100),
) -> UsersPublic:
    """
    Get users that this user is following
    """
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    following_join = join(User, Follower, User.id == Follower.user_id2)

    stmt = (
        select(User)
        .select_from(following_join)
        .where(Follower.user_id1 == user.id)
        .offset(skip)
        .limit(limit)
    )
    following_users = session.scalars(stmt).all()

    count_stmt = (
        select(func.count()).select_from(Follower).where(Follower.user_id1 == user.id)
    )
    count = session.scalar(count_stmt)

    return UsersPublic(data=following_users, count=count)
