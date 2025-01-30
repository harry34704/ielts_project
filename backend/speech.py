from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import speech_recognition as sr
from pydantic import BaseModel

# Create the router instance
speech_router = APIRouter()

class SpeechText(BaseModel):
    text: str

@speech_router.post("/transcribe")
async def transcribe_audio(audio_file: UploadFile = File(...)):
    try:
        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Read the uploaded audio file
        with sr.AudioFile(audio_file.file) as source:
            # Record audio from file
            audio = recognizer.record(source)
            
            # Perform speech recognition
            text = recognizer.recognize_google(audio)
            
            return SpeechText(text=text)
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing audio: {str(e)}"}
        )

@speech_router.get("/test")
async def test_endpoint():
    return {"message": "Speech router is working"}
