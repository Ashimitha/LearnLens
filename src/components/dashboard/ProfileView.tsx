import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EducationLevel, ExplanationStyle, Subject } from '../../types';
import { User, Save, CheckCircle2, GraduationCap, Globe, BookOpen } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserPreferences } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    user?.educationLevel || 'high_school'
  );
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [preferredStyle, setPreferredStyle] = useState<ExplanationStyle>(
    user?.preferredStyle || 'step_by_step'
  );
  const [targetGoals, setTargetGoals] = useState(user?.targetGoals || '');
  const [subjects, setSubjects] = useState<Subject[]>(
    user?.subjectsOfInterest || ['Physics', 'Mathematics', 'Biology']
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const allSubjects: Subject[] = [
    'Physics',
    'Mathematics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'General Science',
  ];

  const handleToggleSubject = (s: Subject) => {
    if (subjects.includes(s)) {
      setSubjects(subjects.filter((sub) => sub !== s));
    } else {
      setSubjects([...subjects, s]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserPreferences({
        name,
        educationLevel,
        preferredLanguage,
        preferredStyle,
        targetGoals,
        subjectsOfInterest: subjects,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Student Account</span>
          <span className="text-slate-400">·</span>
          <span>Adaptive Personalization</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Learning Profile & Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          LearnLens AI adapts explanation complexity, examples, and terminology according to your profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Learning preferences successfully updated!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            >
              <option value="middle_school">Middle School (Grades 6–8)</option>
              <option value="high_school">High School (Grades 9–10)</option>
              <option value="senior_secondary">Senior Secondary (Grades 11–12)</option>
              <option value="undergraduate">Undergraduate / College</option>
              <option value="self_learner">Self Learner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Default Teaching Style</label>
          <select
            value={preferredStyle}
            onChange={(e) => setPreferredStyle(e.target.value as ExplanationStyle)}
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          >
            <option value="step_by_step">Step-by-Step (Clear progression with formulas)</option>
            <option value="simple">Simple & Intuitive (Everyday plain analogies)</option>
            <option value="examples">Real-World Examples (Case studies & applications)</option>
            <option value="visual">Visual Breakdown (Diagrammatic schematics)</option>
            <option value="exam_prep">Exam Preparation (Formulas, marking criteria, model question)</option>
            <option value="quick_revision">Quick Revision (Flashcard summaries)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subjects of Interest</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allSubjects.map((sub) => {
              const selected = subjects.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => handleToggleSubject(sub)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors flex items-center justify-between ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{sub}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Target or Exam Goals</label>
          <textarea
            rows={3}
            value={targetGoals}
            onChange={(e) => setTargetGoals(e.target.value)}
            placeholder="e.g. Master foundational physics & ace STEM board exams or competitive tests..."
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
