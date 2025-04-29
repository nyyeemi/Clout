import uuid
from sqlalchemy import select, join
from sqlalchemy.orm import Session
from app.models import User, Follower
from typing import List


def get_followers_for_user(
    session: Session,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 15,
) -> List[User]:
    follower_join = join(User, Follower, User.id == Follower.user_id1)

    stmt = (
        select(User)
        .select_from(follower_join)
        .where(Follower.user_id2 == user_id)
        .offset(skip)
        .limit(limit)
    )

    followers = session.scalars(stmt).all()

    return followers


def get_followings_for_user(
    session: Session,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 15,
) -> List[User]:
    following_join = join(User, Follower, User.id == Follower.user_id2)

    stmt = (
        select(User)
        .select_from(following_join)
        .where(Follower.user_id1 == user_id)
        .offset(skip)
        .limit(limit)
    )

    user_followings = session.scalars(stmt).all()

    return user_followings
