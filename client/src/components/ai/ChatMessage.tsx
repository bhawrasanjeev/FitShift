import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { Button } from '../ui/Button';
import { FollowUpSuggestions } from './FollowUpSuggestions';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PlanTab } from '../layout/AppSidebar';

export interface ChatMessageProps {
  message: ChatMessageType;
  onSelectFollowUp?: (suggestion: string) => void;
  onNavigateSection?: (tab: PlanTab) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectFollowUp,
  onNavigateSection,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to render markdown-like content cleanly
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];

    const flushTable = (keyPrefix: number) => {
      if (tableBuffer.length === 0) return null;
      const rows = tableBuffer.map((line) =>
        line
          .split('|')
          .map((c) => c.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1)
      );
      tableBuffer = [];

      if (rows.length < 2) return null;

      const headers = rows[0];
      const dataRows = rows.slice(2); // Skip separator row

      return (
        <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                {headers.map((h, hi) => (
                  <th key={hi} className="p-2.5 font-bold text-zinc-900">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {dataRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-zinc-50/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2.5 text-zinc-700">
                      {cell.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    lines.forEach((line, idx) => {
      // Check if line is part of a table
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        tableBuffer.push(line.trim());
        return;
      } else if (tableBuffer.length > 0) {
        elements.push(flushTable(idx));
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm sm:text-base font-bold text-zinc-950 mt-3 mb-1 tracking-tight">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }
      if (line.startsWith('#### ')) {
        elements.push(
          <h5 key={idx} className="text-xs sm:text-sm font-bold text-zinc-900 mt-2.5 mb-1">
            {line.replace('#### ', '')}
          </h5>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 text-xs sm:text-sm leading-relaxed text-zinc-700 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
            <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
          </div>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          elements.push(
            <div key={idx} className="flex items-start gap-2 my-1 text-xs sm:text-sm leading-relaxed text-zinc-700 pl-1">
              <span className="font-bold text-emerald-800 text-xs shrink-0 mt-0.5 w-4">
                {numMatch[1]}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
          return;
        }
      }

      // Empty line / paragraph break
      if (!line.trim()) {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p
          key={idx}
          className="text-xs sm:text-sm leading-relaxed text-zinc-700 my-1"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    });

    if (tableBuffer.length > 0) {
      elements.push(flushTable(lines.length));
    }

    return elements;
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-600">$1</em>');
  };

  if (isUser) {
    return (
      <div className="flex justify-end animate-in fade-in duration-200">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-zinc-900 text-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 mb-1.5">
            <span className="font-semibold text-zinc-300">You</span>
            <span>{message.timestamp}</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-in fade-in duration-200">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
        <Sparkles className="w-4 h-4 text-emerald-700" />
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[95%] sm:max-w-[85%] bg-white rounded-2xl rounded-tl-sm border border-zinc-200/90 p-4 sm:p-5 shadow-2xs">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900">FitShift Assistant</span>
            {message.contextUsed && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 hidden sm:inline-block">
                Plan Context Applied
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span>{message.timestamp}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Copy answer"
              aria-label="Copy answer"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Formatted body */}
        <div className="space-y-1">
          {renderFormattedContent(message.content)}
        </div>

        {/* Action Link button to in-app sections */}
        {message.actionLink && onNavigateSection && (
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct Plan Link
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateSection(message.actionLink!.tab as PlanTab)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-semibold py-1.5"
            >
              {message.actionLink.label}
            </Button>
          </div>
        )}

        {/* Follow up suggestions */}
        {message.followUps && message.followUps.length > 0 && onSelectFollowUp && (
          <FollowUpSuggestions
            suggestions={message.followUps}
            onSelect={onSelectFollowUp}
          />
        )}
      </div>
    </div>
  );
};
