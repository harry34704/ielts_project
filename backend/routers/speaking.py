from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db
from auth import get_current_user
import openai
import os
from datetime import datetime

router = APIRouter()

@router.post("/upload", response_model=schemas.SpeakingAttempt)
async def upload_speaking_attempt(
    file: UploadFile = File(...),
    task_name: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save audio file with a more reliable path
    filename = f"{current_user.id}_{datetime.now().timestamp()}.wav"
    file_path = f"uploads/speaking/{filename}"
    absolute_path = os.path.join(os.getcwd(), file_path)
    
    os.makedirs(os.path.dirname(absolute_path), exist_ok=True)
    
    with open(absolute_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Store the URL path instead of file system path
    audio_url = f"/uploads/speaking/{filename}"
    
    # Transcribe audio using OpenAI Whisper
    with open(absolute_path, "rb") as audio_file:
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
    
    # Generate score and feedback
    score = await calculate_speaking_score(transcript.text)
    feedback = await generate_speaking_feedback(transcript.text)
    
    # Create database entry
    db_attempt = models.SpeakingAttempt(
        user_id=current_user.id,
        task_name=task_name,
        audio_url=audio_url,  # Store the URL path
        transcript=transcript.text,
        score=score,
        feedback=feedback
    )
    
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    return db_attempt

@router.get("/history", response_model=List[schemas.SpeakingAttempt])
async def get_speaking_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.SpeakingAttempt)\
        .filter(models.SpeakingAttempt.user_id == current_user.id)\
        .order_by(models.SpeakingAttempt.created_at.desc())\
        .all()

async def calculate_speaking_score(transcript: str) -> float:
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an IELTS speaking examiner. Score this response from 0-100."},
            {"role": "user", "content": transcript}
        ]
    )
    try:
        return float(response.choices[0].message.content.strip())
    except:
        return 70.0

async def generate_speaking_feedback(transcript: str) -> str:
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an IELTS speaking examiner. Provide detailed feedback."},
            {"role": "user", "content": transcript}
        ]
    )
    return response.choices[0].message.content.strip() 