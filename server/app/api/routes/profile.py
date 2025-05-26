from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import and_, select
from app.api.deps import SessionDep, CurrentUser
from app.models import User
from app.schemas.user import (
    ProfileFollowerUser,
    ProfileFollowerUsers,
    UserPublicProfile,
)
from app.services import user_crud as crud
from app.services import post_crud
from app.services import follower_crud
from app.schemas.posts import (
    PostsPublic,
    ProfilePostsPublic,
)
from app.models.post import Post
# from app.schemas.image import ImagePublic  # You will need this


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/{username}", response_model=UserPublicProfile)
def get_public_profile(
    username: str, current_user: CurrentUser, session: SessionDep
) -> UserPublicProfile:
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
            "num_posts": len(user.posts),
        }
    )


"""
MAKE HERE ROUTER FOR POSTS
"""


@router.get("/{username}/posts", response_model=ProfilePostsPublic)
def get_user_posts(
    username: str,
    session: SessionDep,
    current_user: CurrentUser,
    last_post_created_at: datetime | None = None,
    limit: Annotated[int, Query(gt=0, le=100)] = 18,
) -> PostsPublic:
    """
    Get posts for a user by username
    """
    user = crud.get_user_by_username(session=session, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    base_filter = user.id == Post.owner_id
    if last_post_created_at:
        base_filter = and_(base_filter, Post.created_at < last_post_created_at)

    if user.id != current_user.id:
        base_filter = and_(base_filter, Post.is_visible)

    statement = (
        select(Post).where(base_filter).order_by(Post.created_at.desc()).limit(limit)
    )

    posts = session.scalars(statement).all()

    posts_data = post_crud.populate_is_liked_by_current_user(
        session=session, current_user=current_user, posts=posts
    )

    count = len(posts_data)

    return ProfilePostsPublic(data=posts_data, count=count)


@router.get("/{username}/followers", response_model=ProfileFollowerUsers)
def get_user_followers(
    username: str,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(15, ge=1, le=100),
) -> ProfileFollowerUsers:
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
        ProfileFollowerUser(
            id=u.id,
            username=u.username,
            first_name=u.first_name,
            last_name=u.last_name,
            profile_picture_url=u.profile_picture_url,
            is_followed_by_current_user=u.id in current_user_following_ids,
        )
        for u in followers
    ]

    count = len(followers)
    return ProfileFollowerUsers(data=response_users, count=count)


@router.get("/{username}/following", response_model=ProfileFollowerUsers)
def get_user_following(
    username: str,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(15, ge=1, le=100),
) -> ProfileFollowerUsers:
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
        ProfileFollowerUser(
            id=u.id,
            username=u.username,
            first_name=u.first_name,
            last_name=u.last_name,
            profile_picture_url=u.profile_picture_url,
            is_followed_by_current_user=u.id in current_user_following_ids,
        )
        for u in following_users
    ]

    count = len(following_users)
    return ProfileFollowerUsers(data=response_users, count=count)
