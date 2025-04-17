import uuid
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    is_superuser: bool = False
    # first_name: str | None
    # last_name: str | None


class UserCreate(UserBase):
    username: str
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


class User(UserBase):
    id: uuid.UUID
    hashed_password: str
    username: str
