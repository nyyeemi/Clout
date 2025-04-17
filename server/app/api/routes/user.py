from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from app.schemas.user import UserCreate, UserOut, UsersPublic
from app.services.user import create_user, get_user_by_id
from app.api.deps import SessionDep, get_current_active_superuser
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.execute(count_statement).scalar_one()

    statement = select(User).offset(skip).limit(limit)
    users = session.scalars(statement).all()

    return UsersPublic(data=users, count=count)


@router.get(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserOut,
)
def read_user_by_id(user_id: uuid.UUID, db: SessionDep):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", response_model=UserOut)
def register_user(user_in: UserCreate, db: SessionDep):
    return create_user(db, user_in)
