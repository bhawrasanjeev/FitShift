import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Trash2 } from 'lucide-react';

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onClearChat,
  hasMessages,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-md p-2.5 sm:p-3 transition-all focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about workouts, Indian food staples, supplements, or your schedule..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-2.5 py-1 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none min-h-[36px] max-h-[120px] leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                className="text-[11px] font-medium text-zinc-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
            <span className="text-[10px] text-zinc-400 hidden md:inline">
              Press <kbd className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[9px] border">Enter</kbd> to send, <kbd className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[9px] border">Shift+Enter</kbd> for newline
            </span>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send question"
            className="w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
