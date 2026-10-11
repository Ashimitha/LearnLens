# LearnLens AI — Your Personal AI Learning Companion

> **"Understand More. Learn Smarter."**  
> A complete, production-minded final-year engineering project for personalized, multimodal STEM education.

---

## 1. Project Overview
**LearnLens AI** is an intelligent educational platform that helps students understand core principles rather than simply memorizing answers. By analyzing student questions across text, images, and voice, the system detects underlying learning gaps, provides step-by-step explanations in simple language with KaTeX mathematical formulas, presents interactive visual simulations, answers follow-up questions in an AI tutor, and tests comprehension through adaptive quizzes.

### Signature Learning Journey
$$\text{Ask a Doubt} \to \text{Detect Gap} \to \text{Personalized Explanation} \to \text{Visual Stage} \to \text{Follow-Up Tutor} \to \text{Adaptive Quiz} \to \text{Update Mastery}$$

---

## 2. Key Features

1. **Multimodal Doubt Ingestion**:
   - **Text:** Type questions with subject, education level, language, and teaching style selectors.
   - **Image OCR:** Upload photos of textbook diagrams, handwritten problems, and equations with editable transcription.
   - **Voice Input:** Real-time speech recognition for hands-free queries.

2. **AI-Powered Teaching Engine**:
   - 7 distinct explanation modes: *Step-by-Step, Simple/Intuitive, Real-World Examples, Visual Breakdown, Exam Preparation, Quick Revision, Deeper Dive*.
   - LaTeX mathematical equations rendered crisply via KaTeX ($n_1\sin\theta_1 = n_2\sin\theta_2$, $ax^2+bx+c=0$).
   - Text-to-speech audio narration with Play/Pause controls.
   - Clarification of common student misconceptions.

3. **Visual Learning & Interactive Scenes**:
   - Dynamic interactive simulation stages:
     - **Optics Tank:** Snell's law refraction with angle sliders and apparent depth ray tracing.
     - **Chloroplast Stage:** Photolysis of water, ATP/NADPH cycle, and Calvin cycle CO2 fixation.
     - **Coordinate Plane:** Parabola root intersections and discriminant analysis.
   - Multi-scene storyboard player with auto-playback and voice narration.

4. **Contextual AI Follow-Up Tutor**:
   - Conversational chat maintaining lesson context.
   - 1-click suggested prompts (*"Explain this more simply", "Give another real-world example", "Why did we use this formula?"*).

5. **Adaptive Quizzes & Topic Mastery Engine**:
   - Generates conceptual diagnostic questions tailored to the lesson.
   - Evaluates answers securely on the backend.
   - Explains the scientific rationale for every option.
   - Updates topic mastery scores (0% to 100%) and learning streak days.

6. **Student & Teacher Portals**:
   - **Student Dashboard:** KPI cards, Recharts subject mastery charts, diagnostic gap alerts, and recommended next lessons.
   - **Teacher Dashboard:** Cohort metrics, common misconception alerts, and student roster.

---

## 3. Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide Icons, Recharts, KaTeX, Canvas-Confetti
- **Full-Stack Server:** Node.js, Express 4, TypeScript, tsx, JWT, bcryptjs
- **Alternative Backend:** Python 3.10+, FastAPI, Pydantic, pytest
- **AI Integrations:** Google GenAI (`@google/genai` with `gemini-3.8-flash`, `gemini-3.8-flash-lite-tts`, `gemini-3.5-transcribe`) with fallback Pedagogical Demo Engine.

---

## 4. Quick Start & Execution

### Running the Full-Stack Application (Default Port 3000)

```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack application (Express + Vite Dev Middleware)
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Running the Python FastAPI Backend (Alternative Mode)

```bash
# 1. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install requirements
pip install -r backend/requirements.txt

# 3. Start the FastAPI backend
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# 4. Run automated tests
pytest backend/tests/
```

FastAPI interactive documentation is available at `http://127.0.0.1:8000/docs`.

---

## 5. Demo Credentials

The platform includes two preloaded accounts for instant testing:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `priya@example.com` | `demo123` | Grade 10 student (Physics, Math, Biology) |
| **Teacher** | `teacher@example.com` | `demo123` | Cohort mentor with class analytics access |

---

## 6. Environment Variables

Create a `.env` file from `.env.example`:

```env
# Optional Gemini API key for external LLM reasoning, TTS, and transcription.
# If omitted, LearnLens AI runs seamlessly in Pedagogical Demo Mode.
GEMINI_API_KEY="your_api_key_here"

# JWT Secret for authentication tokens
JWT_SECRET="learnlens-super-secret-key-2026"

# Port (default: 3000)
PORT=3000
```
