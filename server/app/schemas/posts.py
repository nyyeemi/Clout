from datetime import datetime
import uuid
from pydantic import BaseModel, Field, HttpUrl

from app.schemas.user import UserInfoBasic


class PostBase(BaseModel):
    image_url: HttpUrl
    thumbnail_url: HttpUrl | None = None
    caption: str | None = None
    is_visible: bool = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    image_url: HttpUrl | None = None
    thumbnail_url: HttpUrl | None = None
    caption: str | None = None
    is_visible: bool | None = None


class PostPublic(PostBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    owner: UserInfoBasic
    created_at: datetime
    num_likes: int = 0
    num_comments: int = 0

    class Config:
        from_attributes = True


class PostsPublic(BaseModel):
    data: list[PostPublic]
    # count: int
