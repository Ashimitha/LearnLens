import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LessonExplanation } from '../../types';
import { Bookmark, ArrowRight, Trash2, BookOpen } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

interface SavedLessonsViewProps {
  onSelectLesson: (lessonId: string) => void;
  onAskDoubt: () => void;
}

export const SavedLessonsView: React.FC<SavedLessonsViewProps> = ({ onSelectLesson, onAskDoubt }) => {
  const [saved, setSaved] = useState<LessonExplanation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSavedLessons()
      .then((data) => {
        setSaved(data.savedLessons || []);
      })
      .catch((err) => {
        console.error('Failed to load saved:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRemove = async (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.removeBookmark(lessonId);
      setSaved((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-indigo-600" />
            <span>Saved Lessons & Bookmarks</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Quick Revision Library
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key lessons, visual breakdowns, and formulas saved for upcoming exams.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading saved lessons...</div>
      ) : saved.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Bookmarked Lessons Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any explanation to pin it here for rapid exam revision.
          </p>
          <button
            onClick={onAskDoubt}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Explore & Ask a Doubt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((les) => (
            <div
              key={les.id}
              onClick={() => onSelectLesson(les.id)}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span className="text-indigo-600">{les.subject}</span>
                  <button
                    onClick={(e) => handleRemove(les.id, e)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {les.topic}
                </h4>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  <MathRenderer content={les.shortAnswer} />
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Open Lesson Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
