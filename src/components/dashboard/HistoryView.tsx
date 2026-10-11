import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QuestionRecord, LessonExplanation } from '../../types';
import { BookOpen, Search, ArrowRight, Clock, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

interface HistoryViewProps {
  onSelectLesson: (lessonId: string) => void;
  onAskDoubt: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectLesson, onAskDoubt }) => {
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getQuestionHistory()
      .then((data) => {
        setQuestions(data.questions || []);
      })
      .catch((err) => {
        console.error('History load failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = questions.filter(
    (q) =>
      q.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Learning History</span>
            <span className="text-slate-400">·</span>
            <span>All Asked Doubts</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Your Questions & Solved Lessons
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keyword, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading your history...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Past Doubts Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Whenever you submit a question by typing, uploading an image, or speaking, your complete lesson is archived here.
          </p>
          <button
            onClick={onAskDoubt}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Ask Your First Doubt
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-indigo-600">{q.subject}</span>
                  <span>·</span>
                  <span>{q.topic}</span>
                  <span>·</span>
                  <span className="capitalize">{q.inputType} input</span>
                  <span>·</span>
                  <span className="text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  <MathRenderer content={q.originalText} />
                </h4>

                {q.subtopic && (
                  <p className="text-xs text-slate-500 font-medium">
                    Subtopic: {q.subtopic}
                  </p>
                )}
              </div>

              {q.lessonId && (
                <button
                  onClick={() => onSelectLesson(q.lessonId!)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <span>Revisit Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
