import React, { useState, useRef, useEffect } from 'react';
import { OnboardingData, ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedPrompts } from './SuggestedPrompts';
import { TypingIndicator } from './TypingIndicator';
import { ContextToggle } from './ContextToggle';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { generateAIResponse } from '../../services/aiAssistantService';
import {
  Sparkles,
  ShieldAlert,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { PlanTab } from '../layout/AppSidebar';

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
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usePlanContext, setUsePlanContext] = useState<boolean>(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(userText, usePlanContext, userProfile);
      const assistantMsg: ChatMessageType = {
        ...response,
        id: `assistant-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'I apologize, but I could not formulate that response right now. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfirmed = () => {
    setMessages([]);
    setIsClearModalOpen(false);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Your fitness questions, answered.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
            Get practical guidance on workouts, nutrition, recovery, and making fitness fit your routine.
          </p>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsClearModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            className="text-xs self-start sm:self-center"
          >
            New Conversation
          </Button>
        )}
      </div>

      {/* Context Aware Toggle Switch */}
      <ContextToggle
        usePlanContext={usePlanContext}
        onToggle={setUsePlanContext}
        userProfile={userProfile}
      />

      {/* Conversation Container */}
      <div className="bg-zinc-50/60 rounded-3xl border border-zinc-200/90 p-4 sm:p-6 min-h-[420px] flex flex-col justify-between space-y-6">
        {/* Messages or Empty State */}
        {messages.length === 0 ? (
          <div className="py-6 sm:py-10 space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                How can FitShift guide you today?
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Explore affordable Indian protein staples, workout exercise substitutes, recovery tips, or understand the logic behind your generated blueprint.
              </p>
            </div>

            {/* Suggested Question Categories */}
            <SuggestedPrompts onSelectPrompt={handleSendMessage} />
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectFollowUp={handleSendMessage}
                onNavigateSection={onNavigateToPlanTab}
              />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Field Bar */}
        <div className="pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={() => setIsClearModalOpen(true)}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>

      {/* Safety & Educational Disclaimer */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-500">
        <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Educational & lifestyle advisory:</strong> FitShift Assistant provides non-clinical fitness and whole-food nutritional information. It never prescribes medical diets, treatments, or extreme regimens. Always consult a licensed physician or registered dietitian for medical diagnosis or chronic health conditions.
        </p>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Start a new conversation?"
        description="This will clear your current questions and answers. Your saved workout and meal plan will not be affected."
        maxWidth="sm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearConfirmed}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear Conversation
            </Button>
          </div>
        }
      >
        <p className="text-xs text-zinc-600 leading-relaxed">
          Are you sure you want to clear this chat history? You will return to the suggested topics screen.
        </p>
      </Modal>
    </div>
  );
};
