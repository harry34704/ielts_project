from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
import uuid
import enum
from datetime import datetime

class TaskType(enum.Enum):
    SPEAKING = "speaking"
    WRITING = "writing"
    PRACTICE = "practice"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    speaking_attempts = relationship("SpeakingAttempt", back_populates="user")
    writing_attempts = relationship("WritingAttempt", back_populates="user")
    practice_attempts = relationship("PracticeAttempt", back_populates="user")

class UserSession(Base):
    __tablename__ = "user_sessions"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, index=True)
    text = Column(String)
    fluency = Column(Float)
    grammar = Column(Float)
    lexical_resource = Column(Float)

class SpeakingAttempt(Base):
    __tablename__ = "speaking_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_name = Column(String)
    audio_url = Column(String)
    transcript = Column(Text)
    score = Column(Float)
    duration = Column(Integer)  # in seconds
    feedback = Column(Text)
    keywords_used = Column(String)  # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="speaking_attempts")

class WritingAttempt(Base):
    __tablename__ = "writing_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_name = Column(String)
    essay = Column(Text)
    score = Column(Float)
    word_count = Column(Integer)
    feedback = Column(Text)
    keywords_used = Column(String)  # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="writing_attempts")

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_name = Column(String)
    task_type = Column(Enum(TaskType))
    score = Column(Float)
    response = Column(Text)
    audio_url = Column(String, nullable=True)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="practice_attempts")
