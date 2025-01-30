# main.py - FastAPI Entry Point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, speaking, writing, practice
import models
from database import engine
import os
from dotenv import load_dotenv
import openai
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IELTS Practice API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.1.X:3000",  # Replace X with your local IP
        "http://your.domain.com",    # If you have a domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(speaking.router, prefix="/speaking", tags=["Speaking"])
app.include_router(writing.router, prefix="/writing", tags=["Writing"])
app.include_router(practice.router, prefix="/practice", tags=["Practice"])

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to IELTS Practice API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
