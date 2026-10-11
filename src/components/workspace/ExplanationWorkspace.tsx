import React, { useState } from 'react';
import { LessonExplanation, ExplanationStyle } from '../../types';
import { api } from '../../services/api';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  Video,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Layers,
  ArrowRight,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { VisualLessonPlayer } from './VisualLessonPlayer';
import { AdaptiveQuizModal } from './AdaptiveQuizModal';
import { InteractiveTutorChat } from './InteractiveTutorChat';

interface ExplanationWorkspaceProps {
  lesson: LessonExplanation;
  onLessonUpdated: (updated: LessonExplanation) => void;
  onAskNewDoubt?: () => void;
}

export const ExplanationWorkspace: React.FC<ExplanationWorkspaceProps> = ({
  lesson,
  onLessonUpdated,
  onAskNewDoubt,
}) => {
  const [activeMode, setActiveMode] = useState<ExplanationStyle>(lesson.activeMode || 'step_by_step');
  const [modeLoading, setModeLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVisualPlayer, setShowVisualPlayer] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [isSaved, setIsSaved] = useState(lesson.isSaved || false);

  const styleTabs: { id: ExplanationStyle; label: string }[] = [
    { id: 'step_by_step', label: 'Step-by-Step' },
    { id: 'simple', label: 'Simple' },
    { id: 'examples', label: 'Real-World Examples' },
    { id: 'visual', label: 'Visual Breakdown' },
    { id: 'exam_prep', label: 'Exam Prep' },
    { id: 'quick_revision', label: 'Quick Revision' },
    { id: 'deep_dive', label: 'Deeper Dive' },
  ];

  const handleSwitchMode = async (mode: ExplanationStyle) => {
    if (mode === activeMode || modeLoading) return;
    setActiveMode(mode);
    setModeLoading(true);

    try {
      const res = await api.explainAgain(lesson.id, mode);
      onLessonUpdated(res.lesson);
    } catch (err) {
      console.error('Mode switch failed:', err);
    } finally {
      setModeLoading(false);
    }
  };

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToSpeak = `${lesson.shortAnswer}. Core concept: ${lesson.coreConcept}`;

    // Try HTML5 speech synthesis for low latency
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      if (isSaved) {
        await api.removeBookmark(lesson.id);
        setIsSaved(false);
      } else {
        await api.bookmarkLesson(lesson.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Question Context */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-indigo-600 font-bold">{lesson.subject}</span>
            <span>·</span>
            <span>{lesson.topic}</span>
            <span>·</span>
            <span>Difficulty: {lesson.difficulty}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isPlayingAudio
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Listen to spoken explanation"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg text-xs transition-colors ${
                isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Lesson Saved' : 'Save Lesson'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-indigo-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Short Answer & Core Concept */}
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
              Direct Solution & Short Answer
            </div>
            <p className="text-sm sm:text-base font-semibold text-indigo-950 leading-relaxed">
              <MathRenderer content={lesson.shortAnswer} />
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Foundational Concept Principle
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <MathRenderer content={lesson.coreConcept} />
            </p>
          </div>
        </div>

        {/* Action CTAs: Visual Walkthrough, Quiz, and Tutor */}
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowVisualPlayer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Learn Visually (Interactive Stage)</span>
          </button>

          <button
            onClick={() => setShowQuizModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Take Adaptive Quiz</span>
          </button>

          <button
            onClick={() => setShowTutorChat(!showTutorChat)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showTutorChat ? 'Hide Tutor Chat' : 'Ask Tutor Follow-up'}</span>
          </button>
        </div>
      </div>

      {/* Explanation Mode Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Personalized Teaching Style</h3>
            <p className="text-xs text-slate-500">Switch explanation mode anytime without losing your question</p>
          </div>

          {/* Interactive filter tabs / segmented controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {styleTabs.map((tab) => {
              const active = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchMode(tab.id)}
                  disabled={modeLoading}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {modeLoading && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs text-slate-500">Adapting lesson into {activeMode.replace('_', ' ')} format...</p>
          </div>
        )}

        {!modeLoading && (
          <div className="space-y-6">
            {/* Step-by-Step Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Step-by-Step Conceptual Reasoning
              </h4>
              <div className="space-y-3">
                {lesson.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {st.stepNumber}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h5 className="text-sm font-semibold text-slate-900">
                          <MathRenderer content={st.title} />
                        </h5>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          <MathRenderer content={st.description} />
                        </p>
                        {st.formula && (
                          <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs text-indigo-900">
                            <MathRenderer content={st.formula} block />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Formulas Section */}
            {lesson.keyFormulas && lesson.keyFormulas.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Governing Equations & Formulas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lesson.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white border border-slate-200/90 rounded-lg text-center text-xs font-mono text-indigo-950 shadow-2xs"
                    >
                      <MathRenderer content={f} block />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World Examples & Analogies */}
            {lesson.examples && lesson.examples.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Real-World Examples & Daily Analogies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-900">{ex.title}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <MathRenderer content={ex.scenario} />
                      </p>
                      <div className="text-[11px] text-indigo-700 font-medium border-t border-slate-200/70 pt-2">
                        <span className="font-bold">Key Insight: </span>
                        <MathRenderer content={ex.takeaway} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Misconceptions */}
            {lesson.commonMisconceptions && lesson.commonMisconceptions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Common Student Misconceptions
                </h4>
                <div className="space-y-3">
                  {lesson.commonMisconceptions.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Common Myth: </span>
                          <MathRenderer content={m.myth} />
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-emerald-900 ml-6">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Scientific Reality: </span>
                          <MathRenderer content={m.reality} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Follow-Up Inquiries */}
            {lesson.suggestedQuestions && lesson.suggestedQuestions.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Recommended Follow-Up Questions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.suggestedQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => setShowTutorChat(true)}
                      className="text-left text-xs font-medium px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span><MathRenderer content={sq} /></span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Embedded Tutor Chat Drawer */}
      {showTutorChat && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <InteractiveTutorChat lesson={lesson} />
        </div>
      )}

      {/* Visual Lesson Player Modal */}
      {showVisualPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <VisualLessonPlayer lesson={lesson} onClose={() => setShowVisualPlayer(false)} />
          </div>
        </div>
      )}

      {/* Adaptive Quiz Modal */}
      {showQuizModal && (
        <AdaptiveQuizModal
          lesson={lesson}
          onClose={() => setShowQuizModal(false)}
          onMasteryUpdated={() => {
            // refresh
          }}
        />
      )}
    </div>
  );
};
