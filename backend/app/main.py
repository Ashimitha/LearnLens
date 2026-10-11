from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional, Dict, Any, List
import uuid

from backend.app.core.config import settings
from backend.app.core.security import verify_password, hash_password, create_access_token, decode_access_token
from backend.app.database.store import db
from backend.app.schemas.models import (
    UserCreate, UserLogin, QuestionCreate, TutorMessageRequest, QuizSubmissionRequest
)
from backend.app.services.ai_service import analyze_metadata, generate_lesson_content

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="LearnLens AI - Personal AI Learning Companion Backend with FastAPI, JWT, and Pedagogical Engine."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "id" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.users.get(payload["id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "product": settings.PROJECT_NAME,
        "tagline": "Understand More. Learn Smarter.",
        "timestamp": datetime.utcnow().isoformat(),
        "demo_mode": settings.DEMO_MODE,
    }

@app.post("/api/auth/register")
def register(user_in: UserCreate):
    for u in db.users.values():
        if u["email"].lower() == user_in.email.lower():
            raise HTTPException(status_code=400, detail="User with this email already exists")

    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    new_user = {
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": hash_password(user_in.password),
        "role": user_in.role,
        "education_level": user_in.education_level,
        "preferred_language": user_in.preferred_language,
        "preferred_style": user_in.preferred_style,
        "subjects_of_interest": user_in.subjects_of_interest,
        "target_goals": user_in.target_goals,
        "created_at": datetime.utcnow().isoformat(),
    }
    db.users[user_id] = new_user
    db.topic_mastery[user_id] = {}
    db.saved_lessons[user_id] = set()

    token = create_access_token({"id": user_id, "email": new_user["email"], "role": new_user["role"]})
    user_safe = {k: v for k, v in new_user.items() if k != "password_hash"}
    return {"token": token, "user": user_safe}

@app.post("/api/auth/login")
def login(login_in: UserLogin):
    user = None
    for u in db.users.values():
        if u["email"].lower() == login_in.email.lower():
            user = u
            break
    if not user or not verify_password(login_in.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"id": user["id"], "email": user["email"], "role": user["role"]})
    user_safe = {k: v for k, v in user.items() if k != "password_hash"}
    return {"token": token, "user": user_safe}

@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    user_safe = {k: v for k, v in user.items() if k != "password_hash"}
    return {"user": user_safe}

@app.post("/api/questions")
def submit_question(q_in: QuestionCreate, user: dict = Depends(get_current_user)):
    effective_text = (q_in.extracted_text or q_in.text).strip()
    if not effective_text:
        raise HTTPException(status_code=400, detail="Question text required")

    meta = analyze_metadata(effective_text, q_in.subject)
    q_id = f"q-{uuid.uuid4().hex[:8]}"
    les_id = f"les-{uuid.uuid4().hex[:8]}"

    q_record = {
        "id": q_id,
        "user_id": user["id"],
        "original_text": effective_text,
        "input_type": "image" if q_in.image_uri else "voice" if q_in.audio_uri else "text",
        "subject": meta["subject"],
        "topic": meta["topic"],
        "subtopic": meta["subtopic"],
        "difficulty": meta["difficulty"],
        "created_at": datetime.utcnow().isoformat(),
        "lesson_id": les_id,
    }
    db.questions[q_id] = q_record

    lesson_content = generate_lesson_content(effective_text, meta, q_in.style or user["preferred_style"])
    les_record = {
        "id": les_id,
        "question_id": q_id,
        "user_id": user["id"],
        "subject": meta["subject"],
        "topic": meta["topic"],
        "subtopic": meta["subtopic"],
        "difficulty": meta["difficulty"],
        "active_mode": q_in.style or user["preferred_style"],
        **lesson_content,
        "is_saved": False,
        "created_at": datetime.utcnow().isoformat(),
    }
    db.lessons[les_id] = les_record

    return {"question": q_record, "lesson": les_record}

@app.get("/api/questions/history")
def question_history(user: dict = Depends(get_current_user)):
    user_qs = [q for q in db.questions.values() if q["user_id"] == user["id"]]
    return {"questions": sorted(user_qs, key=lambda x: x["created_at"], reverse=True)}

@app.get("/api/lessons/{lesson_id}")
def get_lesson(lesson_id: str, user: dict = Depends(get_current_user)):
    les = db.lessons.get(lesson_id)
    if not les:
        raise HTTPException(status_code=404, detail="Lesson not found")
    is_saved = lesson_id in db.saved_lessons.get(user["id"], set())
    return {"lesson": {**les, "is_saved": is_saved}}

@app.post("/api/tutor/chat")
def tutor_chat(req: TutorMessageRequest, user: dict = Depends(get_current_user)):
    les = db.lessons.get(req.lesson_id)
    topic = les["topic"] if les else "STEM Concept"
    reply = f"Great question regarding {topic}! When analyzing this step, recall the conservation laws and boundary limits."
    return {
        "message": {
            "id": f"tut-{uuid.uuid4().hex[:6]}",
            "sender": "tutor",
            "text": reply,
            "timestamp": datetime.utcnow().strftime("%H:%M"),
            "suggestedActions": ["Show another example", "Explain formula", "Take quiz"],
        }
    }

@app.post("/api/quizzes/generate")
def generate_quiz(payload: Dict[str, Any], user: dict = Depends(get_current_user)):
    topic = payload.get("topic", "Light Refraction & Snell Law")
    subject = payload.get("subject", "Physics")
    quiz_id = f"qz-{uuid.uuid4().hex[:8]}"

    questions = [
        {
            "id": "q1",
            "questionText": "When light passes from water to air, how does it bend relative to the normal?",
            "options": ["Towards normal", "Away from normal", "No bending", "Total reflection"],
            "correctOptionIndex": 1,
            "explanation": "Light speeds up in the rarer air medium, bending away from the normal line.",
            "difficulty": "Easy",
            "topic": topic,
        },
        {
            "id": "q2",
            "questionText": "What does Snell's Law relate?",
            "options": ["Angles to refractive indices", "Mass to acceleration", "Temperature to volume", "Charge to voltage"],
            "correctOptionIndex": 0,
            "explanation": "Snell's Law states n1*sin(theta1) = n2*sin(theta2).",
            "difficulty": "Medium",
            "topic": topic,
        },
    ]

    new_quiz = {
        "id": quiz_id,
        "lesson_id": payload.get("lesson_id"),
        "topic": topic,
        "subject": subject,
        "questions": questions,
        "created_at": datetime.utcnow().isoformat(),
    }
    db.quizzes[quiz_id] = new_quiz

    # Hide correctOptionIndex for taker
    sanitized = [{k: v for k, v in q.items() if k != "correctOptionIndex"} for q in questions]
    return {"quiz": {**new_quiz, "questions": sanitized}}

@app.post("/api/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: str, sub: QuizSubmissionRequest, user: dict = Depends(get_current_user)):
    quiz = db.quizzes.get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    correct = 0
    results = []
    for q in quiz["questions"]:
        sel = sub.answers.get(q["id"])
        is_corr = sel == q["correctOptionIndex"]
        if is_corr:
            correct += 1
        results.append({
            "questionId": q["id"],
            "questionText": q["questionText"],
            "selectedOptionIndex": sel if sel is not None else -1,
            "correctOptionIndex": q["correctOptionIndex"],
            "isCorrect": is_corr,
            "explanation": q["explanation"],
        })

    total = len(quiz["questions"])
    pct = round((correct / total) * 100) if total > 0 else 0

    return {
        "attemptId": f"att-{uuid.uuid4().hex[:6]}",
        "quizId": quiz_id,
        "score": correct,
        "totalQuestions": total,
        "percentage": pct,
        "passed": pct >= 65,
        "questionResults": results,
        "feedback": "Great understanding demonstrated!" if pct >= 65 else "Review step-by-step reasoning.",
    }

@app.get("/api/progress/overview")
def progress_overview(user: dict = Depends(get_current_user)):
    user_mastery = db.topic_mastery.get(user["id"], {})
    mastery_list = list(user_mastery.values())
    avg = round(sum(m["score"] for m in mastery_list) / len(mastery_list)) if mastery_list else 75

    return {
        "overallMastery": avg,
        "totalDoubtsAsked": len([q for q in db.questions.values() if q["user_id"] == user["id"]]),
        "totalQuizzesTaken": 3,
        "learningStreakDays": 5,
        "subjectBreakdown": [
            {"subject": "Physics", "mastery": 85, "questionsCount": 6},
            {"subject": "Mathematics", "mastery": 72, "questionsCount": 4},
            {"subject": "Biology", "mastery": 42, "questionsCount": 5},
        ],
        "topicsNeedingPractice": [m for m in mastery_list if m["score"] < 70],
        "recommendedLessons": [
            {
                "topic": "Photosynthesis & Cellular Energy",
                "subject": "Biology",
                "reason": "Reinforce chloroplast electron transport.",
                "difficulty": "Intermediate",
            }
        ],
        "recentActivity": [],
    }
