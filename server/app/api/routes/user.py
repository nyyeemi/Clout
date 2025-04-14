import uuid
from fastapi import APIRouter, HTTPException

from app.schemas.user import UserCreate, UserOut
from app.services.user import create_user, get_user_by_id
from app.api.deps import SessionDep

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserOut)
def read_user_by_id(user_id: uuid.UUID, db: SessionDep):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", response_model=UserOut)
def register_user(user_in: UserCreate, db: SessionDep):
    return create_user(db, user_in)
