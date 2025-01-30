from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from nltk.tokenize import word_tokenize
import language_tool_python
from database import get_db
from models import UserSession
from schemas import UserSessionCreate
from pydantic import BaseModel
from typing import List

scoring_router = APIRouter()
tool = language_tool_python.LanguageTool('en-US')

def evaluate_speaking(text):
    words = word_tokenize(text)
    fluency = len(words) / 10  # Simple metric for fluency
    matches = tool.check(text)
    grammar_score = max(0, 1 - (len(matches) / max(1, len(words))))  # Grammar evaluation
    unique_words = set(words)
    lexical_resource = min(1.0, len(unique_words) / len(words))  # Improved lexical resource metric
    return {
        "fluency": round(fluency, 2),
        "grammar": round(grammar_score, 2),
        "lexical_resource": round(lexical_resource, 2),
        "errors": [match.ruleIssueType for match in matches]
    }

class ScoreInput(BaseModel):
    text: str
    task_type: str  # e.g., "speaking", "writing"
    question_type: str  # e.g., "task1", "task2"

class ScoreResult(BaseModel):
    overall_score: float
    criteria_scores: dict  # e.g., {"fluency": 7.0, "grammar": 6.5, ...}
    feedback: str

@scoring_router.post("/")
async def save_session(session_data: UserSessionCreate, db: Session = Depends(get_db)):
    scores = evaluate_speaking(session_data.text)
    session_entry = UserSession(
        username=session_data.username,
        text=session_data.text,
        fluency=scores['fluency'],
        grammar=scores['grammar'],
        lexical_resource=scores['lexical_resource']
    )
    db.add(session_entry)
    db.commit()
    db.refresh(session_entry)
    return {"message": "Session saved", "session_id": session_entry.id, "scores": scores}

@scoring_router.get("/{username}")
async def get_sessions(username: str, db: Session = Depends(get_db)):
    sessions = db.query(UserSession).filter(UserSession.username == username).all()
    return {"sessions": sessions}

@scoring_router.post("/evaluate", response_model=ScoreResult)
async def evaluate_response(score_input: ScoreInput, db: Session = Depends(get_db)):
    try:
        # Placeholder scoring logic
        sample_result = ScoreResult(
            overall_score=6.5,
            criteria_scores={
                "fluency": 6.5,
                "vocabulary": 7.0,
                "grammar": 6.0,
                "coherence": 6.5
            },
            feedback="This is a placeholder feedback. Implement your scoring logic here."
        )
        
        return sample_result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error evaluating response: {str(e)}"
        )

@scoring_router.get("/history", response_model=List[ScoreResult])
async def get_scoring_history(db: Session = Depends(get_db)):
    try:
        # Sample history data
        return [
            ScoreResult(
                overall_score=6.5,
                criteria_scores={
                    "fluency": 6.5,
                    "vocabulary": 7.0,
                    "grammar": 6.0,
                    "coherence": 6.5
                },
                feedback="Sample historical feedback"
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving scoring history: {str(e)}"
        )
