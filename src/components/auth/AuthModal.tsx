import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, X, User, Lock, Mail, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [educationLevel, setEducationLevel] = useState('high_school');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          educationLevel,
          preferredLanguage: 'English',
          preferredStyle: 'step_by_step',
          subjectsOfInterest: ['Physics', 'Mathematics'],
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole: 'student' | 'teacher') => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isLogin ? 'Sign In to LearnLens AI' : 'Create Student Account'}
              </h3>
              <p className="text-[11px] text-slate-500">Understand More. Learn Smarter.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Demo Logins Strip */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
              Instant 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                disabled={loading}
                className="py-2 px-3 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors text-center shadow-2xs"
              >
                Priya (Student)
              </button>
              <button
                type="button"
                onClick={() => handleDemo('teacher')}
                disabled={loading}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors text-center shadow-2xs"
              >
                Prof. Verma (Teacher)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="high_school">High School (Gr 9-10)</option>
                    <option value="senior_secondary">Senior Secondary (Gr 11-12)</option>
                    <option value="undergraduate">College / University</option>
                    <option value="middle_school">Middle School (Gr 6-8)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {isLogin ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
