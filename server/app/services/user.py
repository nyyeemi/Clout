import uuid
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.get(User, user_id)


def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pw = hash_password(user_in.password)
    user = User(
        username=user_in.username, email=user_in.email, hashed_password=hashed_pw
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
