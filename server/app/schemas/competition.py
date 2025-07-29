from datetime import datetime
from typing import Literal
import uuid
from pydantic import BaseModel, EmailStr, Field, HttpUrl

from app.models.competition import CompetitionStatus


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


### ADMIN SCHEMAS ###
class CompetitionEntryAdmin(BaseModel):
    id: uuid.UUID
    competition_id: uuid.UUID
    post_id: uuid.UUID
    owner_id: uuid.UUID
    mu: float
    sigma: float
    upvotes: int
    downvotes: int
    comparisons: int

    class Config:
        # orm_mode = True
        from_attributes = True


class CompetitionEntriesAdmin(BaseModel):
    data: list[CompetitionEntryAdmin]
    count: int


class CompetitionReadAdmin(BaseModel):
    id: uuid.UUID
    category: str
    description: str
    created_at: datetime
    status: CompetitionStatus
    start_time: datetime
    vote_start_time: datetime
    end_time: datetime
    competition_number: int

    class Config:
        from_attributes = True


class CompetitionsReadAdmin(BaseModel):
    data: list[CompetitionReadAdmin]
    count: int


class PairwiseVoteReadAdmin(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    competition_id: uuid.UUID
    winner_entry_id: uuid.UUID
    loser_entry_id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True


class PairwiseVotesReadAdmin(BaseModel):
    data: list[PairwiseVoteReadAdmin]
    count: int


class CompetitionCreate(BaseModel):
    category: str
    description: str
    start_time: datetime
    vote_start_time: datetime
    end_time: datetime
