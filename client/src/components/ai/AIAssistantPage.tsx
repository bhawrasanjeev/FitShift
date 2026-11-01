import React, { useState, useEffect, useRef } from 'react';
import { OnboardingData, ChatMessage as ChatMessageType } from '../../types';
import { Button } from '../ui/Button';
import {
  Sparkles,
  ArrowLeft,
  BotOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { PlanTab } from '../layout/AppSidebar';
import { getAIStatus, AIStatusResponse } from '../../services/api';
import { generateAIResponse } from '../../services/aiAssistantService';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ContextToggle } from './ContextToggle';
import { SuggestedPrompts } from './SuggestedPrompts';
import { TypingIndicator } from './TypingIndicator';

export interface AIAssistantPageProps {
  userProfile?: OnboardingData;
  onNavigateToPlanTab?: (tab: PlanTab) => void;
  onBackToPlan?: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  userProfile,
  onNavigateToPlanTab,
  onBackToPlan,
}) => {
  const [status, setStatus] = useState<AIStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [usePlanContext, setUsePlanContext] = useState<boolean>(true);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkStatus = async () => {
    setIsLoadingStatus(true);
    setStatusError(null);
    try {
      const data = await getAIStatus();
      setStatus(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to AI service';
      setStatusError(msg);
      setStatus({
        configured: false,
        provider: null,
        message: msg,
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isGenerating]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    setChatError(null);
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const aiReply = await generateAIResponse(text, usePlanContext, userProfile);
      const assistantMsg: ChatMessageType = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextUsed: aiReply.contextUsed,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to generate response. Please try again.';
      setChatError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setChatError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          {onBackToPlan && (
            <button
              type="button"
              onClick={onBackToPlan}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Plan Dashboard</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              FitShift AI Assistant
            </h1>
            {status?.configured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Cpu className="w-3 h-3 text-emerald-700" />
                <span className="capitalize">{status.provider} Connected</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
            Intelligent conversational companion for routine-first fitness and Indian nutrition guidance.
          </p>
        </div>
      </div>

      {/* Loading AI Service State */}
      {isLoadingStatus && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-800">Checking AI service configuration...</p>
        </div>
      )}

      {/* State A: AI Service Not Configured */}
      {!isLoadingStatus && status && !status.configured && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
            <BotOff className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              AI Assistant is not configured yet
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Interactive chat connects to live AI models (Gemini / OpenAI). FitShift does not use simulated responses or fake chat fallback when an API key is not configured.
            </p>
          </div>

          {/* Configuration Setup Guide */}
          <div className="max-w-xl mx-auto text-left bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>How to Enable AI Assistant</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Add your API key to <code className="px-1.5 py-0.5 bg-zinc-200/70 rounded text-[11px] font-mono text-zinc-800">server/.env</code>:
            </p>
            <div className="p-3 bg-zinc-900 text-zinc-100 rounded-xl text-xs font-mono overflow-x-auto space-y-1">
              <div className="text-zinc-400"># Either Gemini (recommended) or OpenAI</div>
              <div>GEMINI_API_KEY=your_gemini_api_key_here</div>
              <div className="text-zinc-500"># OR</div>
              <div>OPENAI_API_KEY=your_openai_api_key_here</div>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                {statusError ? `Error: ${statusError}` : 'Once configured, restart the server or click retry below.'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={checkStatus}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Check Again
              </Button>
            </div>
          </div>

          {/* Real Active Systems Notice */}
          <div className="max-w-xl mx-auto text-left bg-emerald-50/50 rounded-2xl border border-emerald-200/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Currently Active Real-Data Systems</span>
            </div>
            <ul className="text-xs text-zinc-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Deterministic Workout Generator:</strong> Complete 7-day schedules mapped from 876 real exercises.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Core Nutrition Engine:</strong> Mifflin-St Jeor BMR, TDEE, and goal-adjusted macro targets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Budget Diet Optimizer:</strong> Real-time Indian whole-food staple allocation and meal planning.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            {onBackToPlan && (
              <Button
                variant="primary"
                size="md"
                onClick={onBackToPlan}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                View Active Plan Dashboard
              </Button>
            )}
            {onNavigateToPlanTab && (
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigateToPlanTab('diet')}
              >
                Go to Diet Tab
              </Button>
            )}
          </div>
        </div>
      )}

      {/* State B: AI Service Configured & Ready */}
      {!isLoadingStatus && status && status.configured && (
        <div className="space-y-4">
          {/* Context Toggle */}
          <ContextToggle
            usePlanContext={usePlanContext}
            onToggle={setUsePlanContext}
            userProfile={userProfile}
          />

          {/* Chat Messages Container */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-4 sm:p-6 shadow-xs min-h-[420px] max-h-[600px] overflow-y-auto flex flex-col justify-between space-y-4">
            {messages.length === 0 ? (
              <div className="py-8 text-center space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-base font-bold text-zinc-900">
                    Ask me anything about your routine
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Powered by live {status.provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} intelligence. Your saved profile constraints are automatically referenced.
                  </p>
                </div>

                <div className="text-left pt-2">
                  <SuggestedPrompts onSelectPrompt={handleSendMessage} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onSelectFollowUp={handleSendMessage}
                    onNavigateSection={onNavigateToPlanTab}
                  />
                ))}

                {isGenerating && <TypingIndicator />}

                {chatError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{chatError}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Interactive Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isGenerating}
            onClearChat={handleClearChat}
            hasMessages={messages.length > 0}
          />
        </div>
      )}
    </div>
  );
};
