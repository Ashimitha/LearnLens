export type UserRole = 'student' | 'teacher' | 'admin';

export type EducationLevel =
  | 'middle_school' // Grade 6-8
  | 'high_school'   // Grade 9-10
  | 'senior_secondary' // Grade 11-12
  | 'undergraduate' // College / University
  | 'self_learner';

export type ExplanationStyle =
  | 'simple'         // Simple / Analogies
  | 'step_by_step'   // Step-by-step reasoning
  | 'examples'       // Real-world examples
  | 'visual'         // Diagrammatic / Visual breakdown
  | 'exam_prep'      // Formulas, exam tips, key marks
  | 'quick_revision' // Flashcard summary
  | 'deep_dive';     // Advanced academic nuances

export type Subject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'General Science'
  | 'History & Social Studies';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  educationLevel: EducationLevel;
  preferredLanguage: string;
  preferredStyle: ExplanationStyle;
  subjectsOfInterest: Subject[];
  targetGoals?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuestionInput {
  text: string;
  subject?: Subject;
  educationLevel?: EducationLevel;
  language?: string;
  style?: ExplanationStyle;
  imageUri?: string;
  extractedText?: string;
  audioUri?: string;
}

export interface QuestionRecord {
  id: string;
  userId: string;
  originalText: string;
  extractedText?: string;
  inputType: 'text' | 'image' | 'voice';
  subject: Subject;
  topic: string;
  subtopic?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  lessonId?: string;
}

export interface VisualScene {
  id: number;
  title: string;
  narration: string;
  diagramType: 'optics' | 'photosynthesis' | 'geometry' | 'cell' | 'algorithm' | 'generic';
  bulletPoints: string[];
  formula?: string;
  activeHighlight?: string;
}

export interface LessonExplanation {
  id: string;
  questionId: string;
  userId: string;
  subject: Subject;
  topic: string;
  subtopic?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  activeMode: ExplanationStyle;
  shortAnswer: string;
  coreConcept: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    formula?: string;
  }[];
  examples: {
    title: string;
    scenario: string;
    takeaway: string;
  }[];
  commonMisconceptions: {
    myth: string;
    reality: string;
  }[];
  keyFormulas: string[];
  recapPoints: string[];
  suggestedQuestions: string[];
  visualScenes: VisualScene[];
  isSaved?: boolean;
  createdAt: string;
}

export interface TutorChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  // Correct answer index is hidden from client during quiz, but returned in results
  correctOptionIndex?: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  topic: string;
  subject: Subject;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  questionResults: {
    questionId: string;
    questionText: string;
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  masteryUpdate: {
    topic: string;
    previousScore: number;
    newScore: number;
    change: number;
  };
  feedback: string;
}

export interface TopicMastery {
  topic: string;
  subject: Subject;
  score: number; // 0 - 100
  questionsAttempted: number;
  quizzesTaken: number;
  accuracy: number; // percentage
  status: 'Mastered' | 'Practicing' | 'Needs Revision';
  lastStudied: string;
}

export interface LearningProgressOverview {
  overallMastery: number;
  totalDoubtsAsked: number;
  totalQuizzesTaken: number;
  learningStreakDays: number;
  subjectBreakdown: {
    subject: Subject;
    mastery: number;
    questionsCount: number;
  }[];
  topicsNeedingPractice: TopicMastery[];
  recommendedLessons: {
    topic: string;
    subject: Subject;
    reason: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
  recentActivity: {
    id: string;
    type: 'question' | 'quiz' | 'visual_lesson';
    title: string;
    subject: Subject;
    timestamp: string;
    score?: number;
  }[];
}
