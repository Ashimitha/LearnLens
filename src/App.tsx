import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DoubtInputForm } from './components/workspace/DoubtInputForm';
import { ExplanationWorkspace } from './components/workspace/ExplanationWorkspace';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ProgressView } from './components/dashboard/ProgressView';
import { HistoryView } from './components/dashboard/HistoryView';
import { SavedLessonsView } from './components/dashboard/SavedLessonsView';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ProfileView } from './components/dashboard/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { LessonExplanation } from './types';
import { api } from './services/api';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

function MainApp() {
  const { user, loading, quickDemoLogin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeLesson, setActiveLesson] = useState<LessonExplanation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [loadingInitialLesson, setLoadingInitialLesson] = useState(false);

  // When user logs in, default to dashboard
  useEffect(() => {
    if (user && currentTab === 'landing') {
      setCurrentTab('dashboard');
    }
  }, [user]);

  // Load sample initial optics lesson so user can explore an explanation immediately
  const handleLoadSampleLesson = async () => {
    setLoadingInitialLesson(true);
    try {
      const res = await api.getLesson('les-seed-optics');
      setActiveLesson(res.lesson);
      setCurrentTab('workspace');
    } catch {
      // If not yet seeded in memory or error
      setCurrentTab('workspace');
    } finally {
      setLoadingInitialLesson(false);
    }
  };

  const handleSelectTopicFromDashboard = async (topic: string, subject: string) => {
    // Generate or load lesson on that topic
    setLoadingInitialLesson(true);
    try {
      const res = await api.submitQuestion({
        text: `Explain ${topic} in ${subject} step by step with fundamental mechanisms.`,
        subject: subject as any,
      });
      setActiveLesson(res.lesson);
      setCurrentTab('workspace');
    } catch {
      setCurrentTab('workspace');
    } finally {
      setLoadingInitialLesson(false);
    }
  };

  const handleSelectPastLesson = async (lessonId: string) => {
    setLoadingInitialLesson(true);
    try {
      const res = await api.getLesson(lessonId);
      setActiveLesson(res.lesson);
      setCurrentTab('workspace');
    } catch {
      setCurrentTab('workspace');
    } finally {
      setLoadingInitialLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Initializing LearnLens AI Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Strict 3-Zone Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'workspace' && !activeLesson) {
            // Stay in workspace input mode
          }
          setCurrentTab(tab);
        }}
        onOpenAuthModal={() => {
          setAuthModalMode('login');
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loadingInitialLesson ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Retrieving Conceptual Walkthrough</h3>
            <p className="text-xs text-slate-500 mt-1">Preparing formulas, steps, and visual simulation stages...</p>
          </div>
        ) : (
          <>
            {/* View 1: Public Landing Page */}
            {currentTab === 'landing' && (
              <LandingPage
                onGetStarted={() => {
                  if (user) {
                    setCurrentTab('dashboard');
                  } else {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }
                }}
                onOpenDemo={async (role) => {
                  await quickDemoLogin(role);
                  setCurrentTab(role === 'teacher' ? 'teacher' : 'dashboard');
                }}
              />
            )}

            {/* View 2: Ask a Doubt & Explanation Workspace */}
            {currentTab === 'workspace' && (
              <div className="space-y-6">
                {activeLesson ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setActiveLesson(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ask Another Doubt</span>
                    </button>
                    <ExplanationWorkspace
                      lesson={activeLesson}
                      onLessonUpdated={(updated) => setActiveLesson(updated)}
                      onAskNewDoubt={() => setActiveLesson(null)}
                    />
                  </div>
                ) : (
                  <DoubtInputForm
                    onLessonGenerated={(lesson) => {
                      setActiveLesson(lesson);
                    }}
                  />
                )}
              </div>
            )}

            {/* View 3: Student Dashboard */}
            {currentTab === 'dashboard' && (
              <StudentDashboard
                onAskDoubt={() => {
                  setActiveLesson(null);
                  setCurrentTab('workspace');
                }}
                onSelectTopic={handleSelectTopicFromDashboard}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {/* View 4: Progress Mastery Matrix */}
            {currentTab === 'progress' && (
              <ProgressView onSelectTopic={handleSelectTopicFromDashboard} />
            )}

            {/* View 5: Learning History */}
            {currentTab === 'history' && (
              <HistoryView
                onSelectLesson={handleSelectPastLesson}
                onAskDoubt={() => {
                  setActiveLesson(null);
                  setCurrentTab('workspace');
                }}
              />
            )}

            {/* View 6: Saved Lessons */}
            {currentTab === 'saved' && (
              <SavedLessonsView
                onSelectLesson={handleSelectPastLesson}
                onAskDoubt={() => {
                  setActiveLesson(null);
                  setCurrentTab('workspace');
                }}
              />
            )}

            {/* View 7: Teacher Hub */}
            {currentTab === 'teacher' && <TeacherDashboard />}

            {/* View 8: Student Profile Settings */}
            {currentTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Global Footer adhering to Anti-Slop Guidelines (Quiet, functional links, no fake tickers) */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">LearnLens AI</span>
            <span>·</span>
            <span>Understand More. Learn Smarter.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('workspace')} className="hover:text-slate-900">
              Ask a Doubt
            </button>
            <button onClick={() => setCurrentTab('progress')} className="hover:text-slate-900">
              Topic Mastery
            </button>
            <button
              onClick={() => {
                if (!user) {
                  quickDemoLogin('student');
                  setCurrentTab('dashboard');
                } else {
                  setCurrentTab('profile');
                }
              }}
              className="hover:text-slate-900"
            >
              Demo Profile
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
