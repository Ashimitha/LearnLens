import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { LearningProgressOverview } from '../../types';
import {
  Sparkles,
  Flame,
  Award,
  HelpCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart2,
  Clock,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface StudentDashboardProps {
  onAskDoubt: () => void;
  onSelectTopic: (topicName: string, subject: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onAskDoubt,
  onSelectTopic,
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<LearningProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getProgressOverview()
      .then((data) => {
        if (isMounted) setOverview(data);
      })
      .catch((err) => {
        console.error('Failed to load overview:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = overview?.subjectBreakdown.map((s) => ({
    name: s.subject.replace(' & Social Studies', ''),
    mastery: s.mastery,
    doubts: s.questionsCount,
  })) || [
    { name: 'Physics', mastery: 85, doubts: 6 },
    { name: 'Math', mastery: 72, doubts: 4 },
    { name: 'Biology', mastery: 42, doubts: 5 },
    { name: 'Chemistry', mastery: 65, doubts: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
            <span>Welcome back, {user?.name || 'Student'}</span>
            <span>·</span>
            <span>{user?.educationLevel?.replace('_', ' ') || 'Grade 10'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Ready to understand your next concept?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            LearnLens AI breaks down complex STEM principles step-by-step, detects your learning gaps, and turns confusion into complete conceptual clarity.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAskDoubt}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask a Doubt Now</span>
            </button>

            <button
              onClick={() => onNavigateTab('progress')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-white/10"
            >
              View Topic Mastery
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall Mastery */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Overall STEM Mastery</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {overview?.overallMastery || 74}%
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${overview?.overallMastery || 74}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Weighted across 6 active topics</div>
        </div>

        {/* KPI 2: Learning Streak */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {overview?.learningStreakDays || 5} <span className="text-sm font-semibold text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active learning today</span>
          </div>
        </div>

        {/* KPI 3: Doubts Solved */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Doubts Mastered</span>
            <HelpCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {overview?.totalDoubtsAsked || 12}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Text, Vision OCR & Audio inputs</div>
        </div>

        {/* KPI 4: Quizzes Completed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Adaptive Quizzes</span>
            <BarChart2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {overview?.totalQuizzesTaken || 7}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Avg. accuracy: 78%</div>
        </div>
      </div>

      {/* Analytics Chart & Weak Areas Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Mastery Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject Mastery Breakdown</h3>
                <p className="text-xs text-slate-500">Real-time mastery evaluated through adaptive diagnostic quizzes</p>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Live Data
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Mastery']}
                  />
                  <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.mastery >= 75 ? '#4f46e5' : entry.mastery >= 50 ? '#818cf8' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> ≥75% Strong</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> 50-74% In Progress</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> &lt;50% Needs Practice</span>
          </div>
        </div>

        {/* Topics Needing Practice (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Learning Gap Diagnostics</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Topics identified from repeated quiz misses or low accuracy</p>

            <div className="space-y-3">
              {(overview?.topicsNeedingPractice && overview.topicsNeedingPractice.length > 0
                ? overview.topicsNeedingPractice
                : [
                    {
                      topic: 'Photosynthesis & Cellular Energy',
                      subject: 'Biology' as const,
                      score: 42,
                      accuracy: 45,
                      status: 'Needs Revision' as const,
                    },
                    {
                      topic: 'Quadratic Discriminant Nature of Roots',
                      subject: 'Mathematics' as const,
                      score: 58,
                      accuracy: 60,
                      status: 'Needs Revision' as const,
                    },
                  ]
              ).map((topicItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[11px] font-semibold text-rose-700">{topicItem.subject}</div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">{topicItem.topic}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Mastery: {topicItem.score}% · Accuracy: {topicItem.accuracy}%</div>
                  </div>

                  <button
                    onClick={() => onSelectTopic(topicItem.topic, topicItem.subject)}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
                  >
                    Revise
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateTab('progress')}
              className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View Full Topic Matrix →
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Next Lessons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recommended Next Concepts</h3>
            <p className="text-xs text-slate-500">Derived from your mastery scores and prerequisite learning path</p>
          </div>
          <span className="text-xs font-medium text-slate-400">Personalized AI Suggestions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(overview?.recommendedLessons || [
            {
              topic: 'Snell Law & Total Internal Reflection',
              subject: 'Physics',
              reason: 'Next prerequisite building upon basic water refraction.',
              difficulty: 'Intermediate',
            },
            {
              topic: 'Light-Dependent Electron Transport',
              subject: 'Biology',
              reason: 'Strengthen weak areas in photosynthesis.',
              difficulty: 'Intermediate',
            },
            {
              topic: 'Completing the Square & Derivation',
              subject: 'Mathematics',
              reason: 'Deepen algebraic fundamentals for quadratic roots.',
              difficulty: 'Beginner',
            },
          ]).map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 bg-white"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span className="text-indigo-600">{rec.subject}</span>
                  <span>{rec.difficulty}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{rec.topic}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{rec.reason}</p>
              </div>

              <button
                onClick={() => onSelectTopic(rec.topic, rec.subject)}
                className="flex items-center justify-between w-full pt-2 border-t border-slate-100 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
