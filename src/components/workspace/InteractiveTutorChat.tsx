import React, { useState, useRef, useEffect } from 'react';
import { TutorChatMessage, LessonExplanation } from '../../types';
import { api } from '../../services/api';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

interface InteractiveTutorChatProps {
  lesson: LessonExplanation;
}

export const InteractiveTutorChat: React.FC<InteractiveTutorChatProps> = ({ lesson }) => {
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: `Hello! I'm your interactive tutor for **${lesson.topic}**. What part of this explanation would you like to explore further?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Explain this more simply',
        'Show another real-world example',
        'Why did we use this formula?',
        'Test my understanding',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage: TutorChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.sendTutorMessage(lesson.id, trimmed, [...messages, userMessage]);
      setMessages((prev) => [...prev, res.message]);
    } catch {
      const fallbackMsg: TutorChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: 'I am here to guide you! Focus on the fundamental conservation laws and boundary conditions governing this problem.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Explain step 2 again', 'Show a numerical example', 'Take adaptive quiz'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Interactive AI Tutor</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-[11px] font-normal text-indigo-600">{lesson.subject}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-xs">{lesson.topic}</p>
          </div>
        </div>
        <span className="text-[11px] text-slate-500">Contextual Tutor</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-slate-100 text-slate-900 rounded-tl-sm border border-slate-200/60'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                <MathRenderer content={msg.text} />
              </div>

              <div className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </div>

              {/* Action suggestion chips from tutor */}
              {isTutor && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      className="text-left text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Tutor is formulating an intuitive explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up (e.g. 'Explain step 2 in simpler terms')..."
          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || loading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
