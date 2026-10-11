# LearnLens AI — Architecture Documentation

## 1. System Overview
LearnLens AI is an AI-powered personalized learning companion designed for students of varying grade levels and learning styles. The platform moves beyond superficial chatbot answers by identifying learning gaps, decomposing STEM questions step-by-step, providing interactive visual stages, offering adaptive follow-up tutoring, and testing comprehension with diagnostic quizzes.

## 2. Architectural Blueprint

```
+-------------------------------------------------------------------------+
|                          CLIENT APPLICATION                             |
|  React 19 SPA + Vite + Tailwind CSS + Lucide Icons + Recharts + KaTeX  |
+--------------------+-------------------------------+--------------------+
                     |                               |
          HTTP / REST & JSON              Audio / Visual Streaming
                     |                               |
                     v                               v
+-------------------------------------------------------------------------+
|                          SERVER APPLICATION                             |
|             Node.js / Express 4 Full-Stack Runner (Port 3000)           |
|            + Python FastAPI Alternative Engine (Port 8000)              |
+--------------------+-------------------------------+--------------------+
                     |                               |
     +---------------+---------------+               |
     |                               |               |
     v                               v               v
+------------------+       +------------------+  +------------------------+
|  Authentication  |       | Pedagogical AI   |  | Persistence & Mastery   |
|  - JWT Tokens    |       | - 7 Teaching     |  | - Topic Mastery Scores |
|  - bcrypt Hashing|       |   Modes          |  | - Quizzes & Attempts   |
|  - RBAC (Student |       | - Misconceptions |  | - Questions History    |
|    & Teacher)    |       | - Step Reasoning |  | - Saved Lessons        |
+------------------+       +------------------+  +------------------------+
                                     |
                                     v
                       +---------------------------+
                       | External AI Providers     |
                       | - Gemini 3.8 Flash (STEM) |
                       | - Gemini 3.8 Flash TTS    |
                       | - Gemini 3.5 Transcribe   |
                       | - Fallback Demo Engine    |
                       +---------------------------+
```

## 3. Core Subsystems

### A. Multimodal Ingestion Layer
1. **Text Input:** Direct problem statements with subject, grade level, and language hints.
2. **Vision / OCR Input:** Accepts textbook page photos, handwritten notes, and scientific diagrams.
3. **Voice Input:** Web Speech Recognition / Gemini Audio Transcribe with real-time transcript verification.

### B. Pedagogical Intelligence Engine
- **Question Understanding:** Detects governing law, topic, subtopic, difficulty, and prerequisite concepts.
- **7 Explanation Modes:**
  1. `Step-by-Step`: Rigorous mathematical & scientific sequence with KaTeX formulas.
  2. `Simple`: Layman analogies with no cognitive overload.
  3. `Real-World Examples`: Everyday cases proving the principle.
  4. `Visual Breakdown`: Interactive vector graphics and scene storyboards.
  5. `Exam Prep`: Formulas, marking tips, and model questions.
  6. `Quick Revision`: Flashcard definitions and key recap points.
  7. `Deeper Dive`: Proofs, edge conditions, and historical discovery.

### C. Visual Learning Sandbox
- Dynamic interactive SVG visualizers for:
  - Optics & Snell's Law Refraction
  - Chloroplast Biochemical Photolysis & Calvin Cycle
  - Cartesian Parabola Coordinate Plotter & Discriminant Roots
  - Multistage storyboard player with play/pause, scrub, speed controller, and voice narration.

### D. Adaptive Quiz & Mastery Engine
- Quizzes generated strictly from lesson content.
- Answers scored securely on backend.
- Detailed rationale for why correct choices hold and distractors fail.
- Mathematical mastery score update:
  $$\text{Mastery}_{\text{new}} = \text{clamp}(10, 100, \text{Mastery}_{\text{prev}} + \Delta_{\text{accuracy}})$$
