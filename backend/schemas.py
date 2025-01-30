from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TaskType(str, Enum):
    SPEAKING = "speaking"
    WRITING = "writing"
    PRACTICE = "practice"

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SpeakingAttemptCreate(BaseModel):
    task_name: str
    audio_url: str
    transcript: str
    duration: int
    keywords_used: List[str]

class SpeakingAttempt(SpeakingAttemptCreate):
    id: int
    user_id: int
    score: float
    feedback: str
    created_at: datetime

    class Config:
        orm_mode = True

class WritingAttemptCreate(BaseModel):
    task_name: str
    essay: str
    word_count: int
    keywords_used: List[str]

class WritingAttempt(WritingAttemptCreate):
    id: int
    user_id: int
    score: float
    feedback: str
    created_at: datetime

    class Config:
        orm_mode = True

class PracticeAttemptCreate(BaseModel):
    task_name: str
    task_type: TaskType
    response: str
    audio_url: Optional[str] = None

class PracticeAttempt(PracticeAttemptCreate):
    id: int
    user_id: int
    score: float
    feedback: str
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserSessionCreate(BaseModel):
    username: str
    text: str
