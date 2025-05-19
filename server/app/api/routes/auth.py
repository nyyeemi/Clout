from datetime import timedelta
from typing import Annotated, Any
from app.core import security
from app.core.config import settings


from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import CurrentUser, SessionDep
from app.schemas.utils import Token
from app.services.user_crud import authenticate
from app.schemas.user import UserCreate, UserPublic
from app.services import user_crud as crud
from sqlalchemy.exc import IntegrityError


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login/access-token")
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    refresh_token = security.create_refresh_token(
        user.id, expires_delta=refresh_token_expires
    )

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/signup", response_model=UserPublic)
def register_user(user_in: UserCreate, session: SessionDep) -> Any:
    """
    Create a new user without the need to be logged in.
    """
    try:
        user = crud.create_user(session=session, user_create=user_in)
        return user
    except IntegrityError:
        session.rollback()
        user = crud.get_user_by_email(session=session, email=user_in.email)
        if user:
            raise HTTPException(
                status_code=409,
                detail="The user with this email already exists in the system.",
            )

        user = crud.get_user_by_username(session=session, email=user_in.username)
        if user:
            raise HTTPException(
                status_code=409,
                detail="The user with this username already exists in the system.",
            )
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Try again later.",
        )


@router.post("/refresh", response_model=Token)
def refresh_access_token(refresh_token: Annotated[str, Body(embed=True)]) -> Token:
    user_id = security.verify_refresh_token(refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = security.create_access_token(
        user_id, expires_delta=access_token_expires
    )

    return Token(access_token=new_access_token, refresh_token=refresh_token)
