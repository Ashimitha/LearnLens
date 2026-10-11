from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"
    education_level: str = "high_school"
    preferred_language: str = "English"
    preferred_style: str = "step_by_step"
    subjects_of_interest: List[str] = ["Physics", "Mathematics"]
    target_goals: Optional[str] = ""

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class QuestionCreate(BaseModel):
    text: str
    subject: Optional[str] = None
    education_level: Optional[str] = None
    language: Optional[str] = "English"
    style: Optional[str] = "step_by_step"
    image_uri: Optional[str] = None
    extracted_text: Optional[str] = None
    audio_uri: Optional[str] = None

class QuestionResponse(BaseModel):
    id: str
    user_id: str
    original_text: str
    input_type: str
    subject: str
    topic: str
    subtopic: Optional[str] = None
    difficulty: str
    created_at: str
    lesson_id: Optional[str] = None

class StepItem(BaseModel):
    stepNumber: int
    title: str
    description: str
    formula: Optional[str] = None

class ExampleItem(BaseModel):
    title: str
    scenario: str
    takeaway: str

class MisconceptionItem(BaseModel):
    myth: str
    reality: str

class VisualSceneItem(BaseModel):
    id: int
    title: str
    narration: str
    diagramType: str
    bulletPoints: List[str]
    formula: Optional[str] = None

class LessonResponse(BaseModel):
    id: str
    question_id: str
    user_id: str
    subject: str
    topic: str
    subtopic: Optional[str] = None
    difficulty: str
    active_mode: str
    short_answer: str
    core_concept: str
    steps: List[StepItem]
    examples: List[ExampleItem]
    common_misconceptions: List[MisconceptionItem]
    key_formulas: List[str]
    recap_points: List[str]
    suggested_questions: List[str]
    visual_scenes: List[VisualSceneItem]
    is_saved: bool = False
    created_at: str

class TutorMessageRequest(BaseModel):
    lesson_id: str
    message: str
    conversation_history: Optional[List[Dict[str, Any]]] = []

class QuizSubmissionRequest(BaseModel):
    answers: Dict[str, int]
