import {
  AuthResponse,
  User,
  QuestionRecord,
  LessonExplanation,
  Quiz,
  QuizResult,
  LearningProgressOverview,
  TutorChatMessage,
  ExplanationStyle,
  Subject,
  EducationLevel,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('learnlens_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    educationLevel?: string;
    preferredLanguage?: string;
    preferredStyle?: string;
    subjectsOfInterest?: string[];
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error('Session expired');
    }
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  // Questions & Lessons
  async submitQuestion(data: {
    text: string;
    subject?: Subject;
    educationLevel?: EducationLevel;
    language?: string;
    style?: ExplanationStyle;
    imageUri?: string;
    extractedText?: string;
    audioUri?: string;
  }): Promise<{ question: QuestionRecord; lesson: LessonExplanation }> {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit question');
    }
    return res.json();
  },

  async getQuestionHistory(): Promise<{ questions: QuestionRecord[] }> {
    const res = await fetch(`${API_BASE}/questions/history`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load questions history');
    return res.json();
  },

  async getLesson(id: string): Promise<{ lesson: LessonExplanation }> {
    const res = await fetch(`${API_BASE}/lessons/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load lesson');
    return res.json();
  },

  async explainAgain(
    lessonId: string,
    style: ExplanationStyle,
    language?: string
  ): Promise<{ lesson: LessonExplanation }> {
    const res = await fetch(`${API_BASE}/lessons/${lessonId}/explain-again`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ style, language }),
    });
    if (!res.ok) throw new Error('Failed to re-explain lesson');
    return res.json();
  },

  async uploadQuestionImage(imageBase64: string): Promise<{ extractedText: string; detectedSubject: string }> {
    const res = await fetch(`${API_BASE}/questions/upload`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ imageBase64 }),
    });
    if (!res.ok) throw new Error('Image OCR analysis failed');
    return res.json();
  },

  async transcribeAudio(audioBase64: string): Promise<{ transcript: string }> {
    const res = await fetch(`${API_BASE}/audio/transcribe`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ audioBase64 }),
    });
    if (!res.ok) throw new Error('Audio transcription failed');
    return res.json();
  },

  async getSpeechAudio(text: string): Promise<{ audioBase64?: string; fallbackToWebSpeech?: boolean }> {
    const res = await fetch(`${API_BASE}/tts`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return { fallbackToWebSpeech: true };
    return res.json();
  },

  // Tutor Chat
  async sendTutorMessage(
    lessonId: string,
    message: string,
    conversationHistory: TutorChatMessage[]
  ): Promise<{ message: TutorChatMessage }> {
    const res = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ lessonId, message, conversationHistory }),
    });
    if (!res.ok) throw new Error('Failed to reach AI Tutor');
    return res.json();
  },

  // Quizzes
  async generateQuiz(lessonId?: string, topic?: string, subject?: string): Promise<{ quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quizzes/generate`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ lessonId, topic, subject }),
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return res.json();
  },

  async submitQuiz(quizId: string, answers: Record<string, number>): Promise<QuizResult> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  // Progress
  async getProgressOverview(): Promise<LearningProgressOverview> {
    const res = await fetch(`${API_BASE}/progress/overview`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load progress overview');
    return res.json();
  },

  // Saved Lessons
  async getSavedLessons(): Promise<{ savedLessons: LessonExplanation[] }> {
    const res = await fetch(`${API_BASE}/saved-lessons`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load saved lessons');
    return res.json();
  },

  async bookmarkLesson(lessonId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/saved-lessons`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ lessonId }),
    });
    if (!res.ok) throw new Error('Failed to bookmark lesson');
    return res.json();
  },

  async removeBookmark(lessonId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/saved-lessons/${lessonId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to remove bookmark');
    return res.json();
  },

  // Teacher Hub
  async getTeacherOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/teacher/overview`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Teacher authorization required');
    return res.json();
  },
};
