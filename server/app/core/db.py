import json
import logging
import os
from pathlib import Path
import random
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import delete, func, select

from app.services.user_crud import create_user
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from app.models.post import Post
from app.models.follower import Follower
from app.models.comment import Comment
from app.models.like import Like

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# engine = create_engine(settings.POSTGRES_URL)


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)
    if settings.ENVIRONMENT == "local":
        logger.info("Populating db with mock data.")
        base_dir = Path(__file__).resolve().parent.parent / "mock-data"
        clear_all_data(session)
        create_mock_users(session, base_dir)
        create_mock_posts(session, base_dir)
        create_mock_comments(session, base_dir)
        create_mock_likes(session)
        create_mock_follower_relations(session)
        session.commit()
        logger.info("Finished populating db with mock data.")

    if not user_exists_by_email(settings.FIRST_SUPERUSER, session):
        user_in = UserCreate(
            username=settings.FIRST_SUPERUSER,
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        create_user(session=session, user_create=user_in)


def clear_all_data(session):
    logger.info("Clearing existing data...")

    session.execute(delete(Follower))
    session.execute(delete(Comment))
    session.execute(delete(Like))
    session.execute(delete(Post))
    session.execute(delete(User))
    session.commit()

    logger.info("All data cleared.")


def user_exists_by_email(email: str, current_session) -> bool:
    user = current_session.execute(select(User).where(User.email == email)).first()
    return user


def create_mock_users(session, base_dir):
    hashed_pw = get_password_hash("salasana")
    users_json_path = base_dir / "users.json"
    with open(users_json_path) as f:
        user_data = json.load(f)

    users_to_add = [
        User(**data, hashed_password=hashed_pw)
        for data in user_data
        if not user_exists_by_email(data["email"], session)
    ]

    if users_to_add:
        session.add_all(users_to_add)
        session.flush()
        logger.info(f"Added {len(users_to_add)} new users to the session.")
    else:
        logger.info("No new users to add from users.json.")


def create_mock_posts(session, base_dir):
    all_users = session.execute(select(User)).scalars().all()

    test_user = next((user for user in all_users if user.username == "rubyf"), None)

    if not all_users:
        logger.warning("No users available to assign posts to.")
    else:
        posts_json_path = base_dir / "posts.json"
        with open(posts_json_path) as f:
            posts_data = json.load(f)

        posts_to_add = []
        for idx, post_data in enumerate(posts_data):
            assigned_user = all_users[idx % len(all_users)]
            posts_to_add.append(Post(**post_data, owner_id=assigned_user.id))

        if test_user:
            for post_data in posts_data:
                posts_to_add.append(Post(**post_data, owner_id=test_user.id))

        if posts_to_add:
            session.add_all(posts_to_add)
            logger.info(f"Added {len(posts_to_add)} new posts to the session.")
        else:
            logger.info("No new posts to add from posts.json.")


def create_mock_follower_relations(session, max_relations_per_user: int = 10):
    users = session.execute(select(User)).scalars().all()
    user_ids = [user.id for user in users]
    created_relations = set()
    followers_to_add = []

    for follower_id in user_ids:
        possible_followees = [uid for uid in user_ids if uid != follower_id]
        num_to_follow = random.randint(
            1, min(max_relations_per_user, len(possible_followees))
        )
        followees = random.sample(possible_followees, num_to_follow)

        for followed_id in followees:
            key = (follower_id, followed_id)
            if key not in created_relations:
                followers_to_add.append(
                    Follower(user_id1=follower_id, user_id2=followed_id)
                )
                created_relations.add(key)

    session.add_all(followers_to_add)
    session.commit()
    logger.info(f"Created {len(followers_to_add)} follower relationships.")


def create_mock_comments(session, base_dir, max_comments: int = 5):
    comments_json_path = base_dir / "comments.json"
    with open(comments_json_path) as f:
        comment_data = json.load(f)

    comment_list = [data["content"] for data in comment_data]
    all_posts = session.execute(select(Post)).scalars().all()

    users = session.execute(select(User)).scalars().all()
    user_ids = [user.id for user in users]

    all_comments_to_add = []
    for post in all_posts:
        num_comments = random.randint(0, max_comments)
        if num_comments == 0:
            continue

        comment_owner_ids = random.sample(user_ids, num_comments)
        comments_to_add = random.sample(comment_list, num_comments)
        for i in range(num_comments):
            all_comments_to_add.append(
                Comment(
                    content=comments_to_add[i],
                    post_id=post.id,
                    owner_id=comment_owner_ids[i],
                )
            )
        post.num_comments += num_comments
        session.commit()
        session.refresh(post)

    session.add_all(all_comments_to_add)
    session.commit()
    logger.info(f"Created {len(all_comments_to_add)} comments.")


def create_mock_likes(session):
    users = session.execute(select(User)).scalars().all()
    posts = session.execute(select(Post)).scalars().all()
    user_ids = [user.id for user in users]

    all_likes_to_add = []
    for post in posts:
        num_likes = random.randint(0, len(users))
        if num_likes == 0:
            continue

        like_owner_ids = random.sample(user_ids, num_likes)
        for i in range(num_likes):
            owner_id = like_owner_ids[i]
            all_likes_to_add.append(Like(post_id=post.id, owner_id=owner_id))

        post.num_likes += num_likes
        session.commit()
        session.refresh(post)

    session.add_all(all_likes_to_add)
    session.commit()
    logger.info(f"Created {len(all_likes_to_add)} likes.")
