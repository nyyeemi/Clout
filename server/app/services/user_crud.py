from typing import Any
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.models.follower import Follower


def create_user(*, session: Session, user_create: UserCreate) -> User:
    hashed_pw = get_password_hash(user_create.password)
    db_obj = User(
        username=user_create.username,
        email=user_create.email,
        is_superuser=user_create.is_superuser,
        hashed_password=hashed_pw,
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)

    if "password" in user_data:
        password = user_data.pop("password")
        user_data["hashed_password"] = get_password_hash(password)

    for field, value in user_data.items():
        setattr(db_user, field, value)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def update_user_me(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)

    for field, value in user_data.items():
        setattr(db_user, field, value)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.scalars(statement).first()
    return session_user


def get_user_by_username(*, session: Session, username: str) -> User | None:
    statement = select(User).where(User.username == username)
    session_user = session.scalars(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def get_follower(
    *, session: Session, follower: User, followed: User
) -> Follower | None:
    stmt = select(Follower).where(
        Follower.user_id1 == follower.id,
        Follower.user_id2 == followed.id,
    )
    return session.scalar(stmt)
