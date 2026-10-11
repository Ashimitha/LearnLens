import React, { useState, useRef } from 'react';
import { Subject, EducationLevel, ExplanationStyle, LessonExplanation } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Type,
  Image as ImageIcon,
  Mic,
  MicOff,
  Sparkles,
  UploadCloud,
  X,
  FileText,
  Loader2,
  Check,
  ChevronDown,
  Camera,
} from 'lucide-react';

interface DoubtInputFormProps {
  onLessonGenerated: (lesson: LessonExplanation) => void;
}

export const DoubtInputForm: React.FC<DoubtInputFormProps> = ({ onLessonGenerated }) => {
  const { user } = useAuth();

  const [inputMode, setInputMode] = useState<'text' | 'image' | 'voice'>('text');
  const [questionText, setQuestionText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    (user?.subjectsOfInterest?.[0] as Subject) || 'Physics'
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    user?.educationLevel || 'high_school'
  );
  const [language, setLanguage] = useState<string>(user?.preferredLanguage || 'English');
  const [preferredStyle, setPreferredStyle] = useState<ExplanationStyle>(
    user?.preferredStyle || 'step_by_step'
  );

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleQuestions = [
    {
      title: 'Optics: Refraction in Water',
      subject: 'Physics' as Subject,
      text: 'Why does a pencil appear bent or broken when submerged in a glass of water?',
    },
    {
      title: 'Biology: Photosynthesis Energy',
      subject: 'Biology' as Subject,
      text: 'How do chloroplasts convert sunlight into chemical energy during the light reactions?',
    },
    {
      title: 'Math: Quadratic Formula & Roots',
      subject: 'Mathematics' as Subject,
      text: 'Derive the quadratic formula and explain what happens when the discriminant is negative.',
    },
    {
      title: 'Chemistry: Density of Ice',
      subject: 'Chemistry' as Subject,
      text: 'Why does ice float on liquid water when most solids sink in their liquid state?',
    },
  ];

  // Handle Image Selection & OCR
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 10MB.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setImagePreview(dataUri);
      const rawBase64 = dataUri.split(',')[1];
      setImageBase64(rawBase64);

      // Perform automatic OCR & Vision extraction
      setOcrLoading(true);
      try {
        const res = await api.uploadQuestionImage(rawBase64);
        setExtractedOcrText(res.extractedText);
        setQuestionText(res.extractedText);
        if (res.detectedSubject) {
          setSelectedSubject(res.detectedSubject as Subject);
        }
      } catch {
        setQuestionText('Analyze and solve the problem shown in this uploaded textbook diagram.');
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setExtractedOcrText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Voice Recording using Web Speech Recognition API
  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Microphone Speech Recognition is not supported by your browser. Please type your doubt.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setVoiceTranscript(currentTranscript);
        setQuestionText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
      setErrorMessage('Could not start microphone recording.');
    }
  };

  // Submission
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveQuestion = (questionText || extractedOcrText || voiceTranscript).trim();

    if (!effectiveQuestion && !imageBase64) {
      setErrorMessage('Please type a question, upload an image, or speak your doubt.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.submitQuestion({
        text: effectiveQuestion,
        subject: selectedSubject,
        educationLevel,
        language,
        style: preferredStyle,
        imageUri: imagePreview || undefined,
        extractedText: extractedOcrText || undefined,
      });

      onLessonGenerated(res.lesson);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process doubt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Pedagogical Assistant</span>
            <span className="text-slate-400">·</span>
            <span>Multimodal Input</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Ask Any Doubt & Master the Core Concept
          </h2>
        </div>

        {/* Mode Selector Tabs (Text / Image / Voice) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              inputMode === 'text' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              inputMode === 'image' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              inputMode === 'voice' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmitDoubt} className="mt-5 space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
            <span>{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mode 1: Text Input */}
        {inputMode === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Type Your Doubt or Problem Statement:
            </label>
            <textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Why does light bend when entering water, and how do we calculate the angle using Snell's Law?"
              className="w-full text-sm p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        )}

        {/* Mode 2: Image Upload */}
        {inputMode === 'image' && (
          <div className="space-y-4">
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-8 text-center cursor-pointer transition-colors"
              >
                <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-800">
                  Upload textbook page, handwritten notes, or diagram
                </h4>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WebP up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded Doubt"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Uploaded Learning Material</div>
                      <p className="text-[11px] text-slate-500">Image successfully loaded</p>
                      {ocrLoading && (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 mt-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Extracting text & diagrams via Vision OCR...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Extracted text review & edit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Extracted Question Text (you can edit before submitting):
                  </label>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Extracted problem text appears here..."
                    className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: Voice Input */}
        {inputMode === 'voice' && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all shadow-md ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {isRecording ? 'Listening... Speak your doubt clearly' : 'Tap Microphone to Speak'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports questions in English, Hindi, and regional accents
              </p>
            </div>

            {/* Live Transcript Display */}
            <div className="text-left mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transcript (you can edit or confirm):
              </label>
              <textarea
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Spoken words will appear here in real time..."
                className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Learning Preferences Strip: Subject, Grade, Language, Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="General Science">General Science</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Education Level
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="middle_school">Middle School (Gr 6-8)</option>
              <option value="high_school">High School (Gr 9-10)</option>
              <option value="senior_secondary">Senior Secondary (Gr 11-12)</option>
              <option value="undergraduate">Undergraduate (College)</option>
              <option value="self_learner">Self Learner</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Teaching Style
            </label>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value as ExplanationStyle)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="step_by_step">Step-by-Step</option>
              <option value="simple">Simple & Intuitive</option>
              <option value="examples">Real-World Examples</option>
              <option value="visual">Visual Breakdown</option>
              <option value="exam_prep">Exam Preparation</option>
              <option value="quick_revision">Quick Revision</option>
            </select>
          </div>
        </div>

        {/* Quick Sample Doubts Strip */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">Or try a 1-click sample doubt:</div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuestionText(sq.text);
                  setSelectedSubject(sq.subject);
                }}
                className="text-left text-xs px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 rounded-lg transition-colors whitespace-nowrap"
              >
                {sq.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating Step-by-Step Lesson...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Teach Me This Concept</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
