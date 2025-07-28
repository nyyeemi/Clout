from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, Field, HttpUrl


class Competition: ...


class CompetitionPublic(BaseModel):
    category: str
    description: str
    start_time: datetime
    end_time: datetime
    competition_number: int


class CompetitionsPublic(BaseModel):
    data: list[CompetitionPublic]
    count: int


class PostData(BaseModel):
    image_url: HttpUrl

    class Config:
        from_attributes = True


class PostMinimal(BaseModel):
    id: uuid.UUID
    post: PostData

    class Config:
        from_attributes = True


class VotePair(BaseModel):
    entry_1: PostMinimal
    entry_2: PostMinimal
