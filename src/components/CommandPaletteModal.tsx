import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Camera,
  ShieldAlert,
  ArrowRight,
  X,
  Zap,
  Radio,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Finding } from '../types/findings';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFinding: (finding: Finding) => void;
  onNavigateTab: (tab: string) => void;
  findings: Finding[];
  initialQuery?: string;
  onTriggerReconnect?: (cameraName: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectFinding,
  onNavigateTab,
  findings,
  initialQuery = '',
  onTriggerReconnect,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: 'Show critical findings', action: () => { onNavigateTab('alerts'); onClose(); } },
    { label: 'Show offline cameras', action: () => { onNavigateTab('cameras'); onClose(); } },
    { label: 'Summarize today', action: () => { setQuery('Summarize today\'s findings'); } },
    { label: 'Open Godown', action: () => { setQuery('Godown'); } },
    { label: 'Show security findings', action: () => { setQuery('Security'); } },
    { label: 'Reconnect Corridor Area', action: () => { if (onTriggerReconnect) onTriggerReconnect('Corridor Area'); onClose(); } },
  ];

  const filteredFindings = findings.filter((f) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.subtitle.toLowerCase().includes(q) ||
      f.camera.name.toLowerCase().includes(q) ||
      f.site.toLowerCase().includes(q) ||
      f.detectionLabel.toLowerCase().includes(q)
    );
  });

  // AI-generated answer mock if the user asks a natural question
  const getAiAnswer = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('phone') || lower.includes('phone use')) {
      return {
        title: 'Phone Use Analysis',
        summary: '9 phone use findings recorded today (0 yesterday). Primarily observed in Office Hot Desks and Godown. All 9 instances were logged to the daily operational summary without requiring intervention.',
        actionLabel: 'Review Phone Use findings',
        action: () => {
          const f = findings.find((x) => x.title.toLowerCase().includes('phone'));
          if (f) onSelectFinding(f);
          onClose();
        },
      };
    }
    if (lower.includes('offline') || lower.includes('dark') || lower.includes('corridor')) {
      return {
        title: 'Camera Coverage Alert',
        summary: 'Corridor Area CAM-11 has been offline for 740 hours. In addition, Godown CAM-02 has experienced 9 transient stream timeouts today running at 4.5× yesterday\'s frequency.',
        actionLabel: 'Initiate Reconnect for Corridor Area',
        action: () => {
          if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
          onClose();
        },
      };
    }
    if (lower.includes('critical') || lower.includes('threat')) {
      return {
        title: 'Critical Findings Summary',
        summary: '2 critical findings appeared this period: Server Vault unauthorized tripwire breach (FND-1039) and Crowd Density limit exceeded (FND-1042). Both have been assigned for supervisor review.',
        actionLabel: 'Inspect Critical Findings',
        action: () => {
          const f = findings.find((x) => x.severity === 'CRITICAL');
          if (f) onSelectFinding(f);
          onClose();
        },
      };
    }
    if (lower.includes('summar') || lower.includes('today')) {
      return {
        title: 'Today\'s Executive AI Summary',
        summary: '20 things happened across 3 sites and 15 cameras. 6 handled autonomously by Nevrixa, 14 reviewed by operations personnel. Zero urgent unhandled actions remaining.',
        actionLabel: 'View Overview Briefing',
        action: () => {
          onNavigateTab('overview');
          onClose();
        },
      };
    }
    return null;
  };

  const aiAnswer = query.trim().length > 3 ? getAiAnswer(query) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-3.5 border-b border-[#E5E7EB] flex items-center gap-3 bg-[#F9FAFB]">
          <Sparkles className="w-5 h-5 text-[#016D5D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Nevrixa about your cameras, findings or sites..."
            className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="px-2 py-0.5 rounded bg-white border border-[#E5E7EB] text-[10px] font-mono text-neutral-500">
            ESC to close
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* AI Response Card if matched */}
          {aiAnswer && (
            <div className="p-3.5 rounded-lg bg-[#E6F4F1] border border-[#016D5D]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#016D5D] font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00E9C9]" />
                <span>{aiAnswer.title}</span>
              </div>
              <p className="text-neutral-700 leading-relaxed text-xs">
                {aiAnswer.summary}
              </p>
              <button
                type="button"
                onClick={aiAnswer.action}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#016D5D] text-white rounded-md font-semibold text-[11px] hover:bg-[#01584b] transition-colors cursor-pointer"
              >
                <span>{aiAnswer.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Suggested Commands */}
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-600 mb-2 tracking-wider">
              Quick AI Operating Commands
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickCommands.map((cmd) => (
                <button
                  key={cmd.label}
                  type="button"
                  onClick={cmd.action}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#E5E7EB] hover:border-[#016D5D]/50 hover:bg-[#F4F4F4] text-left text-neutral-700 hover:text-neutral-900 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Zap className="w-3.5 h-3.5 text-[#016D5D] shrink-0" />
                    <span className="truncate">{cmd.label}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-[#016D5D] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Search Results from Findings */}
          {filteredFindings.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-neutral-600 mb-2 tracking-wider">
                Matching Findings & Events ({filteredFindings.length})
              </div>
              <div className="space-y-1.5">
                {filteredFindings.slice(0, 5).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      onSelectFinding(f);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#016D5D]/40 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          f.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-900 truncate">
                          {f.title} · <span className="font-normal text-neutral-500">{f.camera.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {f.operationalInsight}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-600 shrink-0 ml-2">
                      {f.timestamp}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Camera Shortcuts */}
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-600 mb-2 tracking-wider">
              Monitored Camera Feeds (15 Online)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Parking Area', 'Godown', 'Corridor Area', 'Warehouse', 'Counter', 'Shop Floor'].map((cam) => (
                <button
                  key={cam}
                  type="button"
                  onClick={() => setQuery(cam)}
                  className="flex items-center gap-2 p-2 rounded-md bg-[#F4F4F4] hover:bg-[#EBEBEB] text-neutral-700 text-left transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate">{cam}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Dismiss</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#016D5D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9]" />
            <span>NEVRIXA AI Operating Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
