import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult, LessonExplanation } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, RotateCcw, X, HelpCircle, Loader2 } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

interface AdaptiveQuizModalProps {
  lesson: LessonExplanation;
  onClose: () => void;
  onMasteryUpdated?: () => void;
}

export const AdaptiveQuizModal: React.FC<AdaptiveQuizModalProps> = ({ lesson, onClose, onMasteryUpdated }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .generateQuiz(lesson.id, lesson.topic, lesson.subject)
      .then((res) => {
        if (isMounted) {
          setQuiz(res.quiz);
        }
      })
      .catch((err) => {
        console.error('Quiz generation failed:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lesson.id, lesson.topic, lesson.subject]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizResult) return; // Locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    try {
      const result = await api.submitQuiz(quiz.id, selectedAnswers);
      setQuizResult(result);

      if (result.percentage >= 65) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      if (onMasteryUpdated) {
        onMasteryUpdated();
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setQuizResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <h3 className="text-base font-bold text-slate-900">Generating Adaptive Diagnostic Quiz</h3>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing your explanation for {lesson.topic} to tailor questions to your understanding level...
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">Quiz Unavailable</h3>
          <p className="text-xs text-slate-500 my-2">Could not load diagnostic questions for this topic.</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
              <Award className="w-3.5 h-3.5" />
              <span>Adaptive Quiz Assessment</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{lesson.subject}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-md mt-0.5">
              {quiz.topic}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Content Body */}
        <div className="p-5 sm:p-6">
          {!quizResult ? (
            /* Taking Quiz Mode */
            <div>
              {/* Question Stepper */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Difficulty: {currentQ.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-900 leading-snug">
                  <MathRenderer content={currentQ.questionText} />
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex-1 mr-3">
                        <MathRenderer content={opt} />
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {quiz.questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-6 h-6 rounded-full text-[11px] font-semibold transition-colors ${
                        currentQuestionIndex === i
                          ? 'bg-indigo-600 text-white'
                          : selectedAnswers[quiz.questions[i].id] !== undefined
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!allAnswered || submitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-colors shadow-xs"
                  >
                    {submitting ? 'Scoring...' : 'Submit Answers'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Review Mode */
            <div className="space-y-6">
              {/* Score Header Banner */}
              <div
                className={`p-5 rounded-2xl border text-center ${
                  quizResult.passed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="text-3xl font-extrabold tracking-tight tabular-nums mb-1">
                  {quizResult.score} / {quizResult.totalQuestions}
                  <span className="text-base font-semibold text-slate-500 ml-2">({quizResult.percentage}%)</span>
                </div>
                <p className="text-xs font-semibold mt-1">{quizResult.feedback}</p>

                {quizResult.masteryUpdate && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-lg text-xs font-medium border border-slate-200/80">
                    <span>Topic Mastery:</span>
                    <span className="font-bold tabular-nums">{quizResult.masteryUpdate.newScore}%</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        quizResult.masteryUpdate.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      ({quizResult.masteryUpdate.change >= 0 ? `+${quizResult.masteryUpdate.change}%` : `${quizResult.masteryUpdate.change}%`})
                    </span>
                  </div>
                )}
              </div>

              {/* Per-Question Rationale Review */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Answer Key & Scientific Rationale
                </div>

                {quizResult.questionResults.map((qr, idx) => (
                  <div
                    key={qr.questionId}
                    className={`p-4 rounded-xl border text-xs ${
                      qr.isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {qr.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="font-semibold text-slate-900 leading-snug">
                        {idx + 1}. <MathRenderer content={qr.questionText} />
                      </div>
                    </div>

                    <div className="ml-6 space-y-1.5 text-slate-700">
                      <div>
                        <span className="font-medium text-slate-500">Your Answer: </span>
                        <span className={qr.isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                          {qr.selectedOptionIndex >= 0
                            ? quiz.questions[idx]?.options[qr.selectedOptionIndex]
                            : 'Unanswered'}
                        </span>
                      </div>

                      {!qr.isCorrect && (
                        <div>
                          <span className="font-medium text-slate-500">Correct Answer: </span>
                          <span className="text-emerald-700 font-semibold">
                            {quiz.questions[idx]?.options[qr.correctOptionIndex]}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-slate-200/70 text-slate-800 leading-relaxed">
                        <span className="font-bold text-slate-900">Why: </span>
                        <MathRenderer content={qr.explanation} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Back to Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
