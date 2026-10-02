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


};
