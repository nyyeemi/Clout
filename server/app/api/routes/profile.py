from fastapi import APIRouter, HTTPException, Query
from app.api.deps import SessionDep, CurrentUser
from app.models import User
from app.schemas.user import UserPublic, UserPublicProfile, UsersPublic
from app.services import user_crud as crud
from app.services import post_crud
from app.services import follower_crud
from app.schemas.posts import PostsPublic, ProfilePostsPublic
# from app.schemas.image import ImagePublic  # You will need this


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/{username}", response_model=UserPublicProfile)
def get_public_profile(
    username: str, current_user: CurrentUser, session: SessionDep
) -> User:
    """
    Get profile by username
    """
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    follower_count = follower_crud.get_follower_count(session=session, user_id=user.id)

    following_count = follower_crud.get_following_count(
        session=session, user_id=user.id
    )

    current_user_following_ids = {f.user_id2 for f in current_user.following}

    return UserPublicProfile.model_validate(user).model_copy(
        update={
            "num_followers": follower_count,
            "num_following": following_count,
            "is_followed_by_current_user": user.id in current_user_following_ids,
        }
    )


"""
MAKE HERE ROUTER FOR POSTS
"""


@router.get("/{username}/posts", response_model=ProfilePostsPublic)
def get_user_posts(
    username: str,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(15, ge=1, le=100),
) -> PostsPublic:
    """
    Get posts for a user by username
    """
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    posts = post_crud.get_posts_by_user(  # sorted by date
        session=session, user_id=user.id, skip=skip, limit=limit
    )

    count = len(posts)

    return ProfilePostsPublic(data=posts, count=count)


@router.get("/{username}/followers", response_model=UsersPublic)
def get_user_followers(
    username: str,
    session: SessionDep,
    current_user: CurrentUser,
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

    current_user_following_ids = {f.user_id2 for f in current_user.following}

    response_users = [
        UserPublic(
            id=u.id,
            username=u.username,
            first_name=u.first_name,
            last_name=u.last_name,
            email=u.email,
            profile_picture_url=u.profile_picture_url,
            is_followed_by_current_user=u.id in current_user_following_ids,
        )
        for u in followers
    ]

    count = len(followers)
    return UsersPublic(data=response_users, count=count)


@router.get("/{username}/following", response_model=UsersPublic)
def get_user_following(
    username: str,
    session: SessionDep,
    current_user: CurrentUser,
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

    current_user_following_ids = {f.user_id2 for f in current_user.following}

    response_users = [
        UserPublic(
            id=u.id,
            username=u.username,
            first_name=u.first_name,
            last_name=u.last_name,
            email=u.email,
            profile_picture_url=u.profile_picture_url,
            is_followed_by_current_user=u.id in current_user_following_ids,
        )
        for u in following_users
    ]

    count = len(following_users)
    return UsersPublic(data=response_users, count=count)
