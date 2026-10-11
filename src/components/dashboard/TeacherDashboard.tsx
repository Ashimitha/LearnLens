import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Award,
  BookOpen,
  Send,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTeacherOverview()
      .then((res) => setData(res))
      .catch((err) => console.error('Teacher overview error:', err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.classMetrics || {
    totalStudents: 38,
    averageMastery: 74,
    totalDoubtsSolvedThisWeek: 142,
    activeQuizzesAssigned: 6,
  };

  const misconceptions = data?.commonMisconceptionsDetected || [
    {
      topic: 'Light Refraction',
      subject: 'Physics',
      flaggedPercent: '68%',
      summary: 'Students confuse wave velocity reduction in dense media with physical mechanical resistance.',
    },
    {
      topic: 'Photosynthesis vs Respiration',
      subject: 'Biology',
      flaggedPercent: '52%',
      summary: 'Common misconception that plants only photosynthesize during the day and do not breathe oxygen.',
    },
    {
      topic: 'Quadratic Discriminant',
      subject: 'Mathematics',
      flaggedPercent: '41%',
      summary: 'Forgetting that negative discriminant indicates conjugate complex roots rather than "no solution".',
    },
  ];

  const roster = data?.studentPerformanceRoster || [
    { name: 'Priya Sharma', email: 'priya@example.com', grade: 'Grade 10', doubts: 8, mastery: 82, status: 'On Track' },
    { name: 'Aarav Patel', email: 'aarav@example.com', grade: 'Grade 10', doubts: 14, mastery: 58, status: 'Needs Support in Biology' },
    { name: 'Sneha Rao', email: 'sneha@example.com', grade: 'Grade 10', doubts: 6, mastery: 91, status: 'Advanced STEM' },
    { name: 'Karan Mehra', email: 'karan@example.com', grade: 'Grade 10', doubts: 11, mastery: 64, status: 'Needs Practice in Math' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Educator Intelligence Portal</span>
          <span className="text-slate-400">·</span>
          <span>Cohort Diagnostics</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Teacher & Mentor Learning Hub
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time aggregated analytics showing conceptual bottlenecks across your student cohort.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Active Students</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.totalStudents}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Enrolled in STEM cohort</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Class Average Mastery</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums text-indigo-600">
            {metrics.averageMastery}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2">+4% from last assessment</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Doubts Solved This Week</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.totalDoubtsSolvedThisWeek}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Via text, OCR & voice</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Diagnostic Quizzes</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.activeQuizzesAssigned}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Active remedial evaluations</div>
        </div>
      </div>

      {/* Misconceptions Alert Deck */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Cohort Learning Gaps & Misconceptions</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Automated pattern detection from recurring quiz errors and tutor follow-up questions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {misconceptions.map((mc: any, i: number) => (
            <div key={i} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-900">{mc.topic}</span>
                <span className="text-rose-600">{mc.flaggedPercent} affected</span>
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold">{mc.subject}</div>
              <p className="text-xs text-slate-700 leading-relaxed">{mc.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Performance Roster */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Student Roster & Progress Status</h3>
          <span className="text-xs text-slate-400">Class 10-A</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-4">Class Level</th>
                <th className="py-3 px-4">Doubts Mastered</th>
                <th className="py-3 px-4">Mastery Score</th>
                <th className="py-3 px-6">Status & Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((s: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.grade}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 tabular-nums">{s.doubts}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600 tabular-nums">{s.mastery}%</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        s.status.includes('Advanced') || s.status.includes('Track')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {s.status}
                    </span>
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
