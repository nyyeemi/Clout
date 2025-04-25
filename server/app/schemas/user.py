import uuid
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: str
    # first_name: str | None
    # last_name: str | None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    is_active: bool = True
    is_superuser: bool = False


# Properties to receive via API on update
class UserUpdateMe(BaseModel):
    username: str | None = Field(default=None, max_length=40)
    email: EmailStr | None = Field(default=None, max_length=128)
    first_name: str | None = Field(default=None, max_length=40)
    last_name: str | None = Field(default=None, max_length=40)
    bio: str | None = Field(default=None, max_length=500)
    profile_picture_url: str | None = Field(default=None, max_length=500)


class UserUpdate(UserUpdateMe):
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UpdatePassword(BaseModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    first_name: str | None = Field(default=None, max_length=40)
    last_name: str | None = Field(default=None, max_length=40)
    bio: str | None = Field(default=None, max_length=500)
    profile_picture_url: str | None = Field(default=None, max_length=500)

    class Config:
        from_attributes = True


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


# Generic message
class Message(BaseModel):
    message: str


# For returning user details
class UserInfoBasic(BaseModel):
    id: uuid.UUID
    username: str

    class Config:
        from_attributes = True
