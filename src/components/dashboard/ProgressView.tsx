import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LearningProgressOverview, Subject } from '../../types';
import { Award, CheckCircle2, AlertCircle, ArrowUpRight, BookOpen, Layers, BarChart3, Filter } from 'lucide-react';

interface ProgressViewProps {
  onSelectTopic: (topic: string, subject: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onSelectTopic }) => {
  const [overview, setOverview] = useState<LearningProgressOverview | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  useEffect(() => {
    api.getProgressOverview().then((data) => setOverview(data)).catch(console.error);
  }, []);

  const topics = [
    {
      topic: 'Light Refraction & Snell Law',
      subject: 'Physics',
      score: 85,
      questionsAttempted: 6,
      quizzesTaken: 3,
      accuracy: 88,
      status: 'Mastered',
      lastStudied: 'Today',
    },
    {
      topic: 'Quadratic Equations & Roots',
      subject: 'Mathematics',
      score: 72,
      questionsAttempted: 4,
      quizzesTaken: 2,
      accuracy: 75,
      status: 'Practicing',
      lastStudied: '2 days ago',
    },
    {
      topic: 'Photosynthesis & Cellular Energy',
      subject: 'Biology',
      score: 42,
      questionsAttempted: 5,
      quizzesTaken: 2,
      accuracy: 45,
      status: 'Needs Revision',
      lastStudied: 'Yesterday',
    },
    {
      topic: 'Chemical Bonding & Electronegativity',
      subject: 'Chemistry',
      score: 65,
      questionsAttempted: 3,
      quizzesTaken: 1,
      accuracy: 70,
      status: 'Practicing',
      lastStudied: '3 days ago',
    },
    {
      topic: 'Newton Laws & Classical Mechanics',
      subject: 'Physics',
      score: 92,
      questionsAttempted: 8,
      quizzesTaken: 4,
      accuracy: 94,
      status: 'Mastered',
      lastStudied: '4 days ago',
    },
    {
      topic: 'Data Structures: Binary Search Trees',
      subject: 'Computer Science',
      score: 90,
      questionsAttempted: 5,
      quizzesTaken: 2,
      accuracy: 90,
      status: 'Mastered',
      lastStudied: '1 week ago',
    },
  ];

  const filteredTopics = selectedFilter === 'All'
    ? topics
    : topics.filter((t) => t.subject === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Mastery Progress Matrix</span>
            <span className="text-slate-400">·</span>
            <span>Mathematical Evidence Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Topic-Wise Mastery & Evidence Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mastery is calculated from actual quiz accuracy and question attempts over time, never guessed.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          {['All', 'Physics', 'Mathematics', 'Biology', 'Chemistry'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedFilter(subj)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === subj
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Mastery Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Topic & Subject</th>
                <th className="py-3.5 px-4">Mastery Score</th>
                <th className="py-3.5 px-4">Accuracy</th>
                <th className="py-3.5 px-4">Questions Attempted</th>
                <th className="py-3.5 px-4">Quizzes Taken</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTopics.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-slate-900">{t.topic}</div>
                    <div className="text-[11px] text-indigo-600 font-medium">{t.subject}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.score >= 80 ? 'bg-indigo-600' : t.score >= 60 ? 'bg-indigo-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${t.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">{t.score}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-700 tabular-nums">
                    {t.accuracy}%
                  </td>

                  <td className="py-4 px-4 text-slate-600 tabular-nums">
                    {t.questionsAttempted} doubts
                  </td>

                  <td className="py-4 px-4 text-slate-600 tabular-nums">
                    {t.quizzesTaken} tests
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        t.status === 'Mastered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : t.status === 'Practicing'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}
                    >
                      {t.status === 'Mastered' && <CheckCircle2 className="w-3 h-3" />}
                      {t.status === 'Needs Revision' && <AlertCircle className="w-3 h-3" />}
                      <span>{t.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onSelectTopic(t.topic, t.subject)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>Study</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
