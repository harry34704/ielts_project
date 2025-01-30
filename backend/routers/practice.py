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

@router.post("/submit", response_model=schemas.PracticeAttempt)
async def submit_practice_attempt(
    task_name: str = Form(...),
    task_type: schemas.TaskType = Form(...),
    response: str = Form(...),
    audio_file: UploadFile = File(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audio_url = None
    transcript = response

    # Handle audio file if provided
    if audio_file:
        file_path = f"uploads/practice/{current_user.id}_{datetime.now().timestamp()}.wav"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await audio_file.read()
            buffer.write(content)
        
        audio_url = file_path
        
        # Transcribe audio if it's a speaking task
        if task_type == schemas.TaskType.SPEAKING:
            with open(file_path, "rb") as audio:
                transcript_response = openai.Audio.transcribe("whisper-1", audio)
                transcript = transcript_response.text

    # Generate score and feedback
    score = await calculate_practice_score(transcript, task_type)
    feedback = await generate_practice_feedback(transcript, task_type)
    
    # Create database entry
    db_attempt = models.PracticeAttempt(
        user_id=current_user.id,
        task_name=task_name,
        task_type=task_type,
        response=transcript,
        audio_url=audio_url,
        score=score,
        feedback=feedback
    )
    
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    return db_attempt

@router.get("/history", response_model=List[schemas.PracticeAttempt])
async def get_practice_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.PracticeAttempt)\
        .filter(models.PracticeAttempt.user_id == current_user.id)\
        .order_by(models.PracticeAttempt.created_at.desc())\
        .all()

async def calculate_practice_score(response: str, task_type: schemas.TaskType) -> float:
    task_prompts = {
        schemas.TaskType.SPEAKING: "Score this speaking response based on fluency, pronunciation, and coherence.",
        schemas.TaskType.WRITING: "Score this writing response based on task achievement, coherence, and grammar.",
        schemas.TaskType.PRACTICE: "Score this practice response based on accuracy and appropriateness."
    }
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are an IELTS {task_type} examiner. {task_prompts[task_type]} Score from 0-100."},
            {"role": "user", "content": response}
        ]
    )
    try:
        return float(response.choices[0].message.content.strip())
    except:
        return 70.0

async def generate_practice_feedback(response: str, task_type: schemas.TaskType) -> str:
    task_prompts = {
        schemas.TaskType.SPEAKING: "Provide feedback on fluency, pronunciation, and coherence.",
        schemas.TaskType.WRITING: "Provide feedback on task achievement, coherence, and grammar.",
        schemas.TaskType.PRACTICE: "Provide feedback on accuracy and appropriateness."
    }
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are an IELTS {task_type} examiner. {task_prompts[task_type]}"},
            {"role": "user", "content": response}
        ]
    )
    return response.choices[0].message.content.strip() 