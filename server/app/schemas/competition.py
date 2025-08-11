from datetime import datetime, timezone
import uuid
from pydantic import BaseModel, HttpUrl, field_validator

from app.models.competition import CompetitionStatus


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


class CreateVotePair(BaseModel):
    winner_id: uuid.UUID
    loser_id: uuid.UUID


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
    entry_id_1: uuid.UUID
    entry_id_2: uuid.UUID
    winner_entry_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class PairwiseVotesReadAdmin(BaseModel):
    data: list[PairwiseVoteReadAdmin]
    count: int


class CompetitionCreate(BaseModel):
    category: str
    description: str
    start_time: datetime
    vote_start_time: datetime
    end_time: datetime

    @field_validator("start_time", "vote_start_time", "end_time")
    @classmethod
    def ensure_timezone(cls, v: datetime) -> datetime:
        if v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v


class CompetitionUpdate(BaseModel):
    category: str | None = None
    description: str | None = None
    status: CompetitionStatus | None = None
    start_time: datetime | None = None
    vote_start_time: datetime | None = None
    end_time: datetime | None = None


class EntryAdmin(BaseModel):
    id: uuid.UUID
    post: PostData
    mu: float
    sigma: float
    downvotes: int
    upvotes: int
    comparisons: int

    class Config:
        from_attributes = True


class VotePairAdminResponse(BaseModel):
    entry_1: EntryAdmin
    entry_2: EntryAdmin
