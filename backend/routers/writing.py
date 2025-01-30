from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db
from auth import get_current_user
import openai
from datetime import datetime

router = APIRouter()

@router.post("/submit", response_model=schemas.WritingAttempt)
async def submit_writing_attempt(
    attempt: schemas.WritingAttemptCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generate score and feedback
    score = await calculate_writing_score(attempt.essay)
    feedback = await generate_writing_feedback(attempt.essay)
    
    # Create database entry
    db_attempt = models.WritingAttempt(
        user_id=current_user.id,
        task_name=attempt.task_name,
        essay=attempt.essay,
        word_count=len(attempt.essay.split()),
        score=score,
        feedback=feedback
    )
    
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    return db_attempt

@router.get("/history", response_model=List[schemas.WritingAttempt])
async def get_writing_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.WritingAttempt)\
        .filter(models.WritingAttempt.user_id == current_user.id)\
        .order_by(models.WritingAttempt.created_at.desc())\
        .all()

async def calculate_writing_score(essay: str) -> float:
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an IELTS writing examiner. Score this essay from 0-100 based on Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range."},
            {"role": "user", "content": essay}
        ]
    )
    try:
        return float(response.choices[0].message.content.strip())
    except:
        return 70.0

async def generate_writing_feedback(essay: str) -> str:
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an IELTS writing examiner. Provide detailed feedback on Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range."},
            {"role": "user", "content": essay}
        ]
    )
    return response.choices[0].message.content.strip() 