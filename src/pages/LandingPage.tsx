import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Camera,
  Mic,
  Award,
  Video,
  CheckCircle2,
  Users,
  Compass,
  GraduationCap,
  Layers,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';
import { MathRenderer } from '../components/common/MathRenderer';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenDemo: (role: 'student' | 'teacher') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenDemo }) => {
  const { quickDemoLogin } = useAuth();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto text-center px-4 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Final-Year Engineering Project · LearnLens AI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance max-w-4xl mx-auto">
          Understand More.{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
            Learn Smarter.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Your personal AI learning companion that does not just give you answers — it detects your learning gaps, breaks down STEM concepts step-by-step, provides interactive visual scenes, and verifies understanding through adaptive quizzes.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenDemo('student')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-indigo-500/25"
          >
            <span>Try Student Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenDemo('teacher')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors border border-slate-200 shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Teacher Portal Demo</span>
          </button>
        </div>

        {/* Input Modalities Kicker */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" /> Typed Text Doubts
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-indigo-600" /> Textbook & Diagram OCR
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-indigo-600" /> Spoken Voice Questions
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" /> Adaptive Mastery Loops
          </span>
        </div>
      </section>

      {/* The Core Problem & Solution Narrative */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                The Student Dilemma
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Why superficial AI answers fail true learning
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                When students copy answers directly from chatbots, they score marks on tonight's homework but fail on tomorrow's exam. They miss the root principles, cannot connect formulas to physical reality, and fall into predictable conceptual traps.
              </p>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl text-xs text-rose-900 space-y-1.5">
              <div className="font-bold">The Memorization Trap:</div>
              <p>
                <MathRenderer content="Memorizing $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ without knowing why the discriminant indicates root intersections leaves students helpless during conceptual application." />
              </p>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                The LearnLens AI Solution
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                An empathetic pedagogical teaching engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                LearnLens AI operates as an expert mentor. It detects prerequisite gaps, provides step-by-step reasoning tailored to your grade level, renders KaTeX math formulas, synthesizes audio narration, and validates mastery through adaptive tests.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-950 space-y-1.5">
              <div className="font-bold">Active Conceptual Mastery:</div>
              <p>Every explanation is followed by real-world analogies, common misconception corrections, animated visual walkthroughs, and diagnostic quizzes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature 8-Step Learning Journey */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Signature Learning Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A scientifically backed loop that transforms confusion into lasting STEM fluency
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              title: 'Multimodal Doubt',
              desc: 'Type text, upload a photo of your textbook, or speak your question aloud.',
            },
            {
              num: '02',
              title: 'Gap Diagnostics',
              desc: 'The engine parses the governing principle and assesses your prerequisite level.',
            },
            {
              num: '03',
              title: 'Tailored Explanation',
              desc: 'Receive simple, step-by-step, exam-focused, or deeper dive breakdowns with KaTeX math.',
            },
            {
              num: '04',
              title: 'Learn Visually',
              desc: 'Explore interactive animated diagrams and scene-by-scene storyboard visual lessons.',
            },
            {
              num: '05',
              title: 'Follow-Up Tutor',
              desc: 'Ask contextual follow-up inquiries like "Show another real-world example".',
            },
            {
              num: '06',
              title: 'Adaptive Quizzing',
              desc: 'Take diagnostic quizzes that evaluate conceptual understanding, not rote memory.',
            },
            {
              num: '07',
              title: 'Scientific Feedback',
              desc: 'Review per-question rationales showing why right answers are true and distractors fail.',
            },
            {
              num: '08',
              title: 'Progressive Mastery',
              desc: 'Topic mastery scores update dynamically with targeted recommendations for revision.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 block mb-1">
                  Step {item.num}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Impact & Inclusive Accessibility */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <HeartHandshake className="w-4 h-4" />
              <span>Inclusive Educational Impact</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              Built for every student, regardless of background
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Quality STEM tutoring shouldn't be a privilege limited to expensive coaching institutes. LearnLens AI is designed to support government-school students, low-income learners, and regional-language speakers through:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multilingual (Hindi, English, regional languages)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Low-bandwidth optimized UI with zero fluff</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Voice input for hands-free doubt asking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero expensive API barriers via Demo Engine</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenDemo('student')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Experience LearnLens AI Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
