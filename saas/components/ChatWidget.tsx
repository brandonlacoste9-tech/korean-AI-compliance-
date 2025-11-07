"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Globe, FileText, Calendar } from 'lucide-react';

type Language = 'ko' | 'en';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  riskScore?: number;
}

export default function ChatWidget({ riskScore = 0 }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: language === 'ko'
          ? '안녕하세요! 한국 AI 기본법 규정 준수에 대해 도와드리겠습니다. 무엇을 도와드릴까요?'
          : 'Hello! I\'m here to help with Korean AI Basic Act compliance. How can I assist you?',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          language,
          riskScore,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'ko'
          ? '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.'
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'risk-score') {
      setInput(language === 'ko' ? '제 AI 시스템 위험 점수가 뭐죠?' : 'What is my risk score?');
    } else if (action === 'documents') {
      setInput(language === 'ko' ? '어떤 문서가 필요한가요?' : 'What documents do I need?');
    } else if (action === 'compliance') {
      setInput(language === 'ko' ? '규정 준수 상태를 확인해주세요' : 'Check my compliance status');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {riskScore > 50 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">
            {language === 'ko' ? 'AI 규정 준수 도우미' : 'AI Compliance Assistant'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="hover:bg-blue-700 px-2 py-1 rounded text-sm flex items-center space-x-1"
            title="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ko' ? '🇰🇷' : '🇺🇸'}</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-700 p-1 rounded"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            {language === 'ko' ? '빠른 질문:' : 'Quick questions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction('risk-score')}
              className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
            >
              {language === 'ko' ? '위험 점수' : 'Risk Score'}
            </button>
            <button
              onClick={() => handleQuickAction('documents')}
              className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
            >
              {language === 'ko' ? '필요 문서' : 'Required Docs'}
            </button>
            <button
              onClick={() => handleQuickAction('compliance')}
              className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
            >
              {language === 'ko' ? '준수 상태' : 'Compliance Status'}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Buttons */}
      {riskScore > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center justify-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{language === 'ko' ? '데모 예약' : 'Book Demo'}</span>
          </button>
          <button className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center justify-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{language === 'ko' ? '문서 생성' : 'Generate Docs'}</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ko' ? '메시지를 입력하세요...' : 'Type a message...'}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
