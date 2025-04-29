from fastapi import APIRouter, HTTPException, Query
from app.api.deps import SessionDep
from app.models import User
from app.schemas.user import UserPublic, UsersPublic
from app.models.follower import Follower
from sqlalchemy import select, func
from app.services import user_crud as crud
from app.services import follower_crud
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
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    followers = follower_crud.get_followers_for_user(
        session=session, user_id=user.id, skip=skip, limit=limit
    )

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

    following_users = follower_crud.get_followings_for_user(
        session=session, user_id=user.id, skip=skip, limit=limit
    )

    count_stmt = (
        select(func.count()).select_from(Follower).where(Follower.user_id1 == user.id)
    )
    count = session.scalar(count_stmt)

    return UsersPublic(data=following_users, count=count)
