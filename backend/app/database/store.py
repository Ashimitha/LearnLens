from datetime import datetime
from typing import Dict, Any, List, Optional
import uuid
from backend.app.core.security import hash_password

class Store:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.questions: Dict[str, Dict[str, Any]] = {}
        self.lessons: Dict[str, Dict[str, Any]] = {}
        self.quizzes: Dict[str, Dict[str, Any]] = {}
        self.quiz_attempts: Dict[str, List[Dict[str, Any]]] = {}
        self.topic_mastery: Dict[str, Dict[str, Any]] = {}  # user_id -> topic -> data
        self.saved_lessons: Dict[str, set] = {}

        self._seed_demo_data()

    def _seed_demo_data(self):
        student_id = "usr-student-01"
        self.users[student_id] = {
            "id": student_id,
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "password_hash": hash_password("demo123"),
            "role": "student",
            "education_level": "high_school",
            "preferred_language": "English",
            "preferred_style": "step_by_step",
            "subjects_of_interest": ["Physics", "Mathematics", "Biology"],
            "target_goals": "Master foundational physics & ace STEM board exams",
            "created_at": datetime.utcnow().isoformat(),
        }

        teacher_id = "usr-teacher-01"
        self.users[teacher_id] = {
            "id": teacher_id,
            "name": "Prof. Rajesh Verma",
            "email": "teacher@example.com",
            "password_hash": hash_password("demo123"),
            "role": "teacher",
            "education_level": "senior_secondary",
            "preferred_language": "English",
            "preferred_style": "visual",
            "subjects_of_interest": ["Physics", "Chemistry", "Mathematics"],
            "target_goals": "Identify student learning gaps and guide remedial lessons",
            "created_at": datetime.utcnow().isoformat(),
        }

        # Seed initial topic mastery
        self.topic_mastery[student_id] = {
            "Light Refraction & Snell Law": {
                "topic": "Light Refraction & Snell Law",
                "subject": "Physics",
                "score": 85,
                "questions_attempted": 6,
                "quizzes_taken": 3,
                "accuracy": 88,
                "status": "Mastered",
                "last_studied": datetime.utcnow().isoformat(),
            },
            "Quadratic Equations & Roots": {
                "topic": "Quadratic Equations & Roots",
                "subject": "Mathematics",
                "score": 72,
                "questions_attempted": 4,
                "quizzes_taken": 2,
                "accuracy": 75,
                "status": "Practicing",
                "last_studied": datetime.utcnow().isoformat(),
            },
            "Photosynthesis & Cellular Energy": {
                "topic": "Photosynthesis & Cellular Energy",
                "subject": "Biology",
                "score": 42,
                "questions_attempted": 5,
                "quizzes_taken": 2,
                "accuracy": 45,
                "status": "Needs Revision",
                "last_studied": datetime.utcnow().isoformat(),
            },
        }

        # Seed sample lesson
        seed_lesson_id = "les-seed-optics"
        seed_question_id = "q-seed-optics"
        self.questions[seed_question_id] = {
            "id": seed_question_id,
            "user_id": student_id,
            "original_text": "Why does a pencil appear bent when placed in a glass of water?",
            "input_type": "text",
            "subject": "Physics",
            "topic": "Light Refraction & Snell Law",
            "subtopic": "Refraction of Light at Media Interfaces",
            "difficulty": "Intermediate",
            "created_at": datetime.utcnow().isoformat(),
            "lesson_id": seed_lesson_id,
        }

        self.lessons[seed_lesson_id] = {
            "id": seed_lesson_id,
            "question_id": seed_question_id,
            "user_id": student_id,
            "subject": "Physics",
            "topic": "Light Refraction & Snell Law",
            "subtopic": "Refraction of Light at Media Interfaces",
            "difficulty": "Intermediate",
            "active_mode": "step_by_step",
            "short_answer": "The pencil appears bent because light waves change speed and bend (refract) when transitioning from water (optically denser) into air (optically rarer).",
            "core_concept": "Refraction is the bending of light caused by a change in its velocity as it travels from one transparent medium to another with a different refractive index.",
            "steps": [
                {
                    "stepNumber": 1,
                    "title": "Light Trajectory in Water",
                    "description": "Light rays reflect off the submerged pencil and travel upwards through water at approximately 2.25 x 10^8 m/s.",
                    "formula": "v = c / n",
                },
                {
                    "stepNumber": 2,
                    "title": "Crossing the Boundary",
                    "description": "When entering air, the light accelerates to 3.00 x 10^8 m/s, bending away from the normal line.",
                    "formula": "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)",
                },
            ],
            "examples": [
                {
                    "title": "Spearfishing Fisherman Illusion",
                    "scenario": "A fisherman aiming directly at where a fish looks to be in clear water will miss because the fish is actually deeper.",
                    "takeaway": "Always aim slightly beneath the apparent image.",
                }
            ],
            "common_misconceptions": [
                {
                    "myth": "The water physically warps the pencil.",
                    "reality": "The pencil remains straight; only the light ray paths reaching your eyes are bent.",
                }
            ],
            "key_formulas": ["n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)", "n = c / v"],
            "recap_points": ["Refraction is velocity change", "Moving denser -> rarer bends away from normal"],
            "suggested_questions": ["What happens at 90 degrees incidence?", "What is total internal reflection?"],
            "visual_scenes": [
                {
                    "id": 1,
                    "title": "Scene 1: Introduction",
                    "narration": "Observe the pencil submerged in water.",
                    "diagramType": "optics",
                    "bulletPoints": ["Air: n=1.0", "Water: n=1.33"],
                    "formula": "n_1 = 1.0, n_2 = 1.33",
                }
            ],
            "created_at": datetime.utcnow().isoformat(),
        }

        self.saved_lessons[student_id] = {seed_lesson_id}

db = Store()
