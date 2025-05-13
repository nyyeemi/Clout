from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

DEFAULT_PASSWORD = "salasana"


def create_user(*, session: Session, user_create: UserCreate) -> User:
    hashed_pw = get_password_hash(DEFAULT_PASSWORD)
    db_obj = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_pw,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        bio=user_create.bio,
        profile_picture_url=user_create.profile_picture_url,
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj
