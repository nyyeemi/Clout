from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from app.schemas.user import (
    Message,
    UpdatePassword,
    UserCreate,
    UserPublic,
    UserUpdate,
    UserUpdateMe,
    UsersPublic,
)
from app.services import user_crud as crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import User
from app.core.security import get_password_hash, verify_password
from app.models.follower import Follower

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


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    try:
        user = crud.create_user(session=session, user_create=user_in)
        # TODO: email confirmation as in the template
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


@router.patch("/me", response_model=UserPublic)
def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user: username or email
    """
    # TODO: implement more graceful exception handling ?
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
        current_user.email = user_in.email

    if user_in.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_in.username
        )
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this username already exists"
            )
        current_user.username = user_in.username

    user = crud.update_user_me(session=session, db_user=current_user, user_in=user_in)

    return user


@router.patch("/me/password", response_model=Message)
def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password
    """
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    session.commit()
    return Message(message="Password updated succesfully")


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.delete("/me")
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")


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


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(
    *,
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """

    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    if user_in.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_in.username
        )
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this username already exists"
            )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message,
)
def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """
    Delete a user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    # statement = delete(Item).where(col(Item.owner_id) == user_id)
    # session.exec(statement)  # type: ignore
    session.delete(user)
    session.commit()
    return Message(message="User deleted successfully")


@router.post("/{user_id}/followers", status_code=201, response_model=Message)
def follow_user(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Message:
    """
    Follow another user.
    """
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself.")

    user_to_follow = session.get(User, user_id)
    if not user_to_follow:
        raise HTTPException(status_code=404, detail="User not found.")

    already_following = crud.get_follower(
        session=session, follower=current_user, followed=user_to_follow
    )
    if already_following:
        raise HTTPException(status_code=409, detail="Already following this user.")

    follow = Follower(user_id1=current_user.id, user_id2=user_id)
    session.add(follow)
    session.commit()

    return Message(message="Successfully followed the user.")


@router.delete("/{user_id}/followers", response_model=Message)
def unfollow_user(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Message:
    """
    Unfollow a user.
    """

    user_to_unfollow = session.get(User, user_id)
    if not user_to_unfollow:
        raise HTTPException(status_code=404, detail="User not found.")

    follow = crud.get_follower(
        session=session, follower=current_user, followed=user_to_unfollow
    )

    if not follow:
        raise HTTPException(status_code=404, detail="You are not following this user.")

    session.delete(follow)
    session.commit()
    return Message(message="Unfollowed user.")
