# LearnLens AI — API Reference

All API routes are served under the `/api` prefix.

## 1. System
- `GET /api/health` — Service healthcheck, AI provider state, and uptime telemetry.

## 2. Authentication
- `POST /api/auth/register` — Create student or teacher account (bcrypt hashed, returns JWT).
- `POST /api/auth/login` — Sign in with email and password.
- `GET /api/auth/me` — Retrieve active user record (Requires `Authorization: Bearer <token>`).
- `PATCH /api/profile` — Update learning preferences, grade level, and language.

## 3. Doubt Submission & Lessons
- `POST /api/questions` — Submit doubt (text, image, or audio). Generates structured lesson explanation.
- `GET /api/questions/history` — List authenticated user's doubts.
- `GET /api/questions/{id}` — Get doubt record and its generated lesson.
- `GET /api/lessons/{id}` — Get lesson explanation details.
- `POST /api/lessons/{id}/explain-again` — Switch explanation mode (simple, step-by-step, visual, exam_prep, etc.).
- `POST /api/questions/upload` — OCR and vision extraction for uploaded images.
- `POST /api/audio/transcribe` — Speech recognition endpoint.
- `POST /api/tts` — Spoken text-to-speech audio synthesis.

## 4. Tutor Chat
- `POST /api/tutor/chat` — Contextual follow-up conversation tied to active lesson.

## 5. Adaptive Quizzes
- `POST /api/quizzes/generate` — Generate conceptual quiz questions for a lesson or topic.
- `POST /api/quizzes/{id}/submit` — Submit answers, receive detailed scientific rationale, and update mastery.

## 6. Progress & Saved Lessons
- `GET /api/progress/overview` — Get overall mastery, streak days, subject charts, and weak topic alerts.
- `GET /api/saved-lessons` — List bookmarked lessons.
- `POST /api/saved-lessons` — Bookmark a lesson.
- `DELETE /api/saved-lessons/{id}` — Remove bookmark.
- `GET /api/teacher/overview` — Aggregated class metrics, student roster, and detected misconceptions.
