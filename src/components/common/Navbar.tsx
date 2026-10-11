import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, LogOut, BookOpen, BarChart3, HelpCircle, Bookmark, Compass, Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuthModal }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'workspace', label: 'Ask Doubt' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'progress', label: 'My Progress' },
    { id: 'history', label: 'Past Doubts' },
    { id: 'saved', label: 'Saved Lessons' },
  ];

  if (user?.role === 'teacher') {
    navLinks.push({ id: 'teacher', label: 'Teacher Hub' });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            LearnLens AI
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pl-2 pr-3 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <span className="text-slate-400">▾</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-600 font-medium capitalize">
                      <GraduationCap className="w-3 h-3" />
                      <span>{user.role} · {user.educationLevel.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Learning Preferences
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('saved');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                    Saved Lessons
                  </button>

                  <div className="border-t border-slate-100 mt-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => quickDemoLogin('student')}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
              >
                Demo Student
              </button>
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === link.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 font-medium"
                >
                  Signed in as <span className="font-semibold">{user.name}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    quickDemoLogin('student');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg text-center"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg text-center"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
