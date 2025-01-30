from typing import Dict, List, Tuple
import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class AIService:
    @staticmethod
    async def analyze_speaking(transcript: str) -> Tuple[float, str, Dict]:
        """Analyze speaking response using GPT-4"""
        try:
            # Get detailed analysis
            analysis = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": """
                     You are an IELTS speaking examiner. Analyze the response based on:
                     1. Fluency and Coherence
                     2. Lexical Resource
                     3. Grammatical Range
                     4. Pronunciation
                     Provide a score (0-100) and detailed feedback.
                     """},
                    {"role": "user", "content": transcript}
                ]
            )
            
            # Get specific scores for each criterion
            scores = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Provide scores (0-100) for: fluency, vocabulary, grammar, pronunciation. Format: JSON"},
                    {"role": "user", "content": transcript}
                ]
            )
            
            feedback = analysis.choices[0].message.content
            detailed_scores = eval(scores.choices[0].message.content)
            overall_score = sum(detailed_scores.values()) / 4
            
            return overall_score, feedback, detailed_scores
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return 70.0, "Error generating feedback", {
                "fluency": 70,
                "vocabulary": 70,
                "grammar": 70,
                "pronunciation": 70
            }

    @staticmethod
    async def analyze_writing(essay: str) -> Tuple[float, str, Dict]:
        """Analyze writing response using GPT-4"""
        try:
            # Get detailed analysis
            analysis = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": """
                     You are an IELTS writing examiner. Analyze the essay based on:
                     1. Task Achievement
                     2. Coherence and Cohesion
                     3. Lexical Resource
                     4. Grammatical Range and Accuracy
                     Provide a score (0-100) and detailed feedback.
                     """},
                    {"role": "user", "content": essay}
                ]
            )
            
            # Get specific scores for each criterion
            scores = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Provide scores (0-100) for: task_achievement, coherence, vocabulary, grammar. Format: JSON"},
                    {"role": "user", "content": essay}
                ]
            )
            
            feedback = analysis.choices[0].message.content
            detailed_scores = eval(scores.choices[0].message.content)
            overall_score = sum(detailed_scores.values()) / 4
            
            return overall_score, feedback, detailed_scores
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return 70.0, "Error generating feedback", {
                "task_achievement": 70,
                "coherence": 70,
                "vocabulary": 70,
                "grammar": 70
            }

    @staticmethod
    async def analyze_practice(response: str, task_type: str) -> Tuple[float, str, Dict]:
        """Analyze practice response using GPT-4"""
        try:
            criteria = {
                "speaking": ["fluency", "pronunciation", "vocabulary", "interaction"],
                "writing": ["content", "organization", "language", "accuracy"],
                "practice": ["understanding", "accuracy", "fluency", "appropriateness"]
            }
            
            current_criteria = criteria.get(task_type, criteria["practice"])
            
            analysis = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"""
                     You are an IELTS examiner. Analyze this {task_type} response based on:
                     {', '.join(current_criteria)}
                     Provide a score (0-100) and detailed feedback.
                     """},
                    {"role": "user", "content": response}
                ]
            )
            
            scores = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"Provide scores (0-100) for: {', '.join(current_criteria)}. Format: JSON"},
                    {"role": "user", "content": response}
                ]
            )
            
            feedback = analysis.choices[0].message.content
            detailed_scores = eval(scores.choices[0].message.content)
            overall_score = sum(detailed_scores.values()) / len(current_criteria)
            
            return overall_score, feedback, detailed_scores
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return 70.0, "Error generating feedback", {criterion: 70 for criterion in current_criteria} 