import React, { useState, useMemo } from 'react';
import { Finding } from '../types/findings';
import { CameraStreamModal } from './CameraStreamModal';
import { BriefingAuditModal } from './BriefingAuditModal';
import {
  Sparkles,
  Radio,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Camera,
  Cpu,
  Clock,
  ArrowRight,
  Search,
  Check,
  Send,
  ExternalLink,
  ChevronRight,
  Shield,
  ShieldAlert,
  Smartphone,
  Eye,
  Activity,
  Layers,
  Building2,
  RefreshCw,
  SlidersHorizontal,
  Info,
  Zap,
} from 'lucide-react';

interface OverviewViewProps {
  findings: Finding[];
  onNavigateToFindings: () => void;
  onSelectFinding: (finding: Finding) => void;
  selectedSite?: string;
  onSelectSite?: (siteId: string) => void;
  onOpenLiveWall?: () => void;
  onOpenCommandPalette?: (query?: string) => void;
  onTriggerReconnect?: (cameraName: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  findings,
  onNavigateToFindings,
  onSelectFinding,
  selectedSite = 'all',
  onSelectSite,
  onOpenLiveWall,
  onOpenCommandPalette,
  onTriggerReconnect,
}) => {
  // AI Copilot Query State
  const [aiQueryInput, setAiQueryInput] = useState('');
  const [activeCopilotAnswer, setActiveCopilotAnswer] = useState<{
    query: string;
    answer: string;
    metric?: string;
    actionLabel?: string;
    actionType?: 'critical' | 'phone' | 'camera' | 'site';
  } | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Camera Coverage Filter State
  const [coverageFilter, setCoverageFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Camera Live Stream Modal State
  const [cameraStreamModalOpen, setCameraStreamModalOpen] = useState(false);
  const [selectedCameraForStream, setSelectedCameraForStream] = useState<string>('');

  // Briefing Audit Modal State
  const [briefingAuditModalOpen, setBriefingAuditModalOpen] = useState(false);

  // Interactive timeline hover state
  const [hoveredTimelineHour, setHoveredTimelineHour] = useState<number | null>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    'Why is phone use increasing?',
    'Which camera needs attention?',
    'Summarize today\'s critical findings',
    'What changed since yesterday?',
    'Which site has the most issues?',
  ];

  // Copilot query handler
  const handleAskCopilot = (question: string) => {
    setAiQueryInput(question);
    setIsCopilotThinking(true);
    setActiveCopilotAnswer(null);

    setTimeout(() => {
      setIsCopilotThinking(false);
      const q = question.toLowerCase();

      if (q.includes('phone')) {
        setActiveCopilotAnswer({
          query: question,
          answer:
            'Phone use is newly active today with 9 verified findings across Office and Godown (0 yesterday). The average duration was 5.2 seconds. Nevrixa automatically verified the posture signature and logged all 9 instances to the daily summary without requiring operator escalation.',
          metric: '9 findings · 54% mean confidence',
          actionLabel: 'Review phone use findings',
          actionType: 'phone',
        });
      } else if (q.includes('camera') || q.includes('offline') || q.includes('attention')) {
        setActiveCopilotAnswer({
          query: question,
          answer:
            'Two cameras require immediate operational review: 1) Corridor Area has been dark for 740 hours (last frame at 16:24). 2) Godown CAM-02 has experienced 9 transient stream disconnects today, running at 4.5× yesterday\'s rate due to edge switch port buffer overrun.',
          metric: 'Corridor Area: 740h offline · Godown: 4.5× drop rate',
          actionLabel: 'Initiate Corridor Area Reconnect',
          actionType: 'camera',
        });
      } else if (q.includes('critical')) {
        setActiveCopilotAnswer({
          query: question,
          answer:
            '2 critical findings were registered today: 1) Server Vault unauthorized perimeter breach (FND-1039) where a person entered without card swipe. 2) Zone C crowd density threshold exceeded (FND-1042) reaching 14 persons against a safe limit of 8.',
          metric: '2 Critical Findings · 0 Unattended Breaches',
          actionLabel: 'Inspect Critical Findings',
          actionType: 'critical',
        });
      } else if (q.includes('changed') || q.includes('yesterday')) {
        setActiveCopilotAnswer({
          query: question,
          answer:
            'Compared to yesterday: 1) Findings increased from 2 to 20 (+900%) driven by new phone-use detector rollout (9 events) and Godown connection drops (9 events). 2) Critical threats rose from 0 to 2. 3) Autonomous handling increased to 30% without human intervention.',
          metric: '+900% finding volume · 6 handled by Nevrixa',
          actionLabel: 'View Findings Feed',
          actionType: 'phone',
        });
      } else {
        setActiveCopilotAnswer({
          query: question,
          answer:
            'Chennai Facility is currently generating the highest telemetry volume with 14 of 20 findings (70%), led by Godown CAM-02 (11 events). Munich Facility recorded 4 findings including the prolonged Corridor Area dark spot. Singapore Hub remains nominal with zero open alerts.',
          metric: 'Chennai: 14 findings · Munich: 4 · Singapore: 2',
          actionLabel: 'Filter by Chennai Facility',
          actionType: 'site',
        });
      }
    }, 450);
  };

  // 12 Camera Coverage Items
  const cameraCoverageList = [
    { name: 'Parking Area', status: 'Online', lastActive: '14d ago', isOnline: true },
    { name: 'Loading Area', status: 'Online', lastActive: '22d ago', isOnline: true },
    { name: 'Corridor Area', status: 'Offline', lastActive: '300d ago', isOnline: false, isWarning: true },
    { name: 'Counter', status: 'Online', lastActive: '20d ago', isOnline: true },
    { name: 'Shop Floor', status: 'Offline', lastActive: '2d ago', isOnline: false },
    { name: 'Second Floor', status: 'Offline', lastActive: '2d ago', isOnline: false },
    { name: 'Ground Floor', status: 'Online', lastActive: '2d ago', isOnline: true },
    { name: 'Car Parking', status: 'Online', lastActive: '2d ago', isOnline: true },
    { name: 'Warehouse', status: 'Online', lastActive: '14h ago', isOnline: true },
    { name: 'Test', status: 'Online', lastActive: '14h ago', isOnline: true },
    { name: 'Childcare Room 1', status: 'Online', lastActive: '14h ago', isOnline: true },
    { name: 'Childcare Room 2', status: 'Online', lastActive: '14h ago', isOnline: true },
  ];

  const filteredCameraCoverage = cameraCoverageList.filter((cam) => {
    if (coverageFilter === 'online') return cam.isOnline;
    if (coverageFilter === 'offline') return !cam.isOnline;
    return true;
  });

  // 24h Timeline Buckets for Detection Activity
  const timelineHours = [
    { hour: '00:00', total: 0, critical: 0, attention: 0, info: 0 },
    { hour: '02:00', total: 0, critical: 0, attention: 0, info: 0 },
    { hour: '04:00', total: 0, critical: 0, attention: 0, info: 0 },
    { hour: '06:00', total: 1, critical: 0, attention: 0, info: 1 },
    { hour: '08:00', total: 2, critical: 0, attention: 1, info: 1 },
    { hour: '09:00', total: 3, critical: 0, attention: 2, info: 1 },
    { hour: '10:00', total: 4, critical: 2, attention: 1, info: 1 },
    { hour: '11:00', total: 2, critical: 0, attention: 1, info: 1 },
    { hour: '12:00', total: 3, critical: 0, attention: 1, info: 2 },
    { hour: '14:00', total: 1, critical: 0, attention: 1, info: 0 },
    { hour: '16:00', total: 1, critical: 0, attention: 1, info: 0 },
    { hour: '18:00', total: 0, critical: 0, attention: 0, info: 0 },
    { hour: '20:00', total: 1, critical: 0, attention: 1, info: 0 },
    { hour: '22:00', total: 2, critical: 0, attention: 1, info: 1 },
    { hour: '23:00', total: 0, critical: 0, attention: 0, info: 0 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1580px] mx-auto">
      {/* 
        ==================================================
        SECTION 1: PAGE HEADER & SYSTEM STATUS BAR
        ==================================================
      */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <div className="text-xs font-semibold text-[#016D5D] tracking-wide uppercase font-mono">
            Command Center · Central Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#000000] mt-0.5">
            Good morning
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            Friday, October 2 · Autonomous video perception and operational intelligence
          </p>

          {/* Compact Telemetry Status Line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-neutral-600 font-mono">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
              <span>All systems operational</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-neutral-900">15 / 15</span> cameras online
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-neutral-900">3</span> sites monitored
            </div>
            <span className="text-neutral-300">|</span>
            <div className="text-neutral-500">
              Last sync: <span className="text-neutral-800 font-medium">12:08 PM</span>
            </div>
          </div>
        </div>

        {/* Global CTA Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCommandPalette ? onOpenCommandPalette() : handleAskCopilot('Summarize today\'s critical findings')}
            className="px-3.5 py-2 bg-[#016D5D] hover:bg-[#01584b] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00E9C9] group-hover:rotate-12 transition-transform" />
            <span>Ask Nevrixa</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenLiveWall ? onOpenLiveWall() : onNavigateToFindings()}
            className="px-3.5 py-2 bg-white hover:bg-[#F4F4F4] text-neutral-800 border border-[#E5E7EB] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#016D5D]" />
            <span>View live wall</span>
          </button>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 2: AI DAILY BRIEFING & AUTONOMY SUMMARY
        The most important area of the dashboard
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Large AI Briefing Card (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle brand tint glow top right */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#8FF2E2]/15 to-transparent pointer-events-none" />

          <div>
            {/* Header with AI Pill */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#016D5D]" />
                </div>
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                  Today's briefing
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#016D5D] bg-[#E6F4F1] border border-[#016D5D]/20 px-2 py-0.5 rounded-full font-medium">
                Autonomous Perception Active
              </span>
            </div>

            {/* High-confidence bold statement */}
            <div className="text-xl sm:text-2xl font-semibold text-[#000000] tracking-tight leading-snug">
              20 things happened.<br />
              <span className="text-neutral-500 font-normal">All of them have been reviewed.</span>
            </div>

            {/* Chronological Activity Stream */}
            <div className="mt-5 space-y-2 border-t border-[#F0F0F0] pt-4">
              <div className="text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-2">
                Chronological Review Stream
              </div>

              {/* Item 1 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.title.toLowerCase().includes('phone'));
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-600 shrink-0 w-12">12:08</span>
                  <span className="text-xs font-semibold text-neutral-900 shrink-0 w-16">Office</span>
                  <span className="text-xs text-neutral-600 truncate">
                    Logged usage in the daily summary
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#016D5D] font-medium border border-[#016D5D]/20">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-600 shrink-0 w-12">23:45</span>
                  <span className="text-xs font-semibold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate">
                    Reviewed, classified and logged automatically
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#016D5D] font-medium border border-[#016D5D]/20">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-600 shrink-0 w-12">22:21</span>
                  <span className="text-xs font-semibold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate">
                    Reviewed, classified and logged automatically
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#016D5D] font-medium border border-[#016D5D]/20">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              </div>

              {/* Item 4 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-600 shrink-0 w-12">22:08</span>
                  <span className="text-xs font-semibold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate">
                    Logged usage in the daily summary
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    Human reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions at bottom of briefing */}
          <div className="mt-5 pt-3.5 border-t border-[#F0F0F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBriefingAuditModalOpen(true)}
                className="px-3 py-1.5 bg-[#016D5D] hover:bg-[#01584b] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>See what happened</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => handleAskCopilot('Summarize today\'s critical findings')}
                className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#E5E7EB] rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                Ask a follow-up
              </button>
            </div>

            <div className="text-[11px] font-mono text-neutral-500">
              Confidence baseline: <span className="font-semibold text-neutral-800">96.8%</span>
            </div>
          </div>
        </div>

        {/* Right-Side Summary Card: Autonomy — Today (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
                Autonomy — Today
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00E9C9]" />
            </div>

            {/* Circular Gauge / Donut Visualization */}
            <div className="flex items-center gap-5 my-3">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-neutral-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Handled by Nevrixa (30% -> 6/20) */}
                  <path
                    className="text-[#00E9C9]"
                    strokeDasharray="30, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Reviewed by Human (70% -> 14/20) */}
                  <path
                    className="text-[#016D5D]"
                    strokeDasharray="70, 100"
                    strokeDashoffset="-30"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-neutral-900 font-mono leading-none">20</span>
                  <span className="text-[10px] text-neutral-500 font-mono mt-0.5">findings</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E9C9]" />
                    <span className="text-neutral-700">Handled by Nevrixa</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900">6</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#016D5D]" />
                    <span className="text-neutral-700">Reviewed by person</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900">14</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown Indicators */}
            <div className="space-y-2 mt-4 pt-3 border-t border-[#F0F0F0] text-xs">
              <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-neutral-600">Action required</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                  0 action required
                </span>
              </div>
              <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-neutral-600">Waiting on you</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                  8 waiting on you
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#F0F0F0]">
            <button
              type="button"
              onClick={onNavigateToFindings}
              className="text-xs font-semibold text-[#016D5D] hover:text-[#01584b] flex items-center justify-between w-full group cursor-pointer"
            >
              <span>Automation log</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 3: AI QUERY BAR (COPILOT INTERACTION AREA)
        ==================================================
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#016D5D]" />
            <h2 className="text-sm font-semibold text-[#000000]">
              Ask about your cameras or findings
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Powered by NEVRIXA Intelligence
          </span>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (aiQueryInput.trim()) handleAskCopilot(aiQueryInput.trim());
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={aiQueryInput}
            onChange={(e) => setAiQueryInput(e.target.value)}
            placeholder="Ask Nevrixa anything about today's activity..."
            className="w-full h-11 pl-4 pr-24 bg-[#F4F4F4] focus:bg-white border border-[#E5E7EB] focus:border-[#016D5D] rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!aiQueryInput.trim() || isCopilotThinking}
            className="absolute right-2 px-3 py-1.5 bg-[#016D5D] hover:bg-[#01584b] disabled:bg-neutral-300 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isCopilotThinking ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Analyze</span>
          </button>
        </form>

        {/* Suggested Prompts Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-neutral-600 mr-1">Suggested:</span>
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleAskCopilot(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#F4F4F4] hover:bg-[#E6F4F1] border border-[#E5E7EB] hover:border-[#016D5D]/40 text-neutral-700 hover:text-[#016D5D] text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Active Copilot Response Pane */}
        {activeCopilotAnswer && (
          <div className="mt-3 p-4 bg-[#E6F4F1] border border-[#016D5D]/25 rounded-lg space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E9C9]" />
                <span className="text-xs font-semibold text-[#016D5D]">
                  Nevrixa Perception Response
                </span>
              </div>
              {activeCopilotAnswer.metric && (
                <span className="text-[11px] font-mono text-[#016D5D] bg-white/70 px-2 py-0.5 rounded border border-[#016D5D]/20">
                  {activeCopilotAnswer.metric}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-800 leading-relaxed font-sans">
              {activeCopilotAnswer.answer}
            </p>

            <div className="flex items-center justify-between pt-1">
              {activeCopilotAnswer.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeCopilotAnswer.actionType === 'camera') {
                      if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
                    } else if (activeCopilotAnswer.actionType === 'critical') {
                      const f = findings.find((x) => x.severity === 'CRITICAL');
                      if (f) onSelectFinding(f);
                    } else if (activeCopilotAnswer.actionType === 'phone') {
                      const f = findings.find((x) => x.title.toLowerCase().includes('phone'));
                      if (f) onSelectFinding(f);
                    } else {
                      onNavigateToFindings();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#016D5D] text-white rounded text-xs font-semibold hover:bg-[#01584b] transition-colors cursor-pointer"
                >
                  <span>{activeCopilotAnswer.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveCopilotAnswer(null)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 
        ==================================================
        SECTION 4: TODAY SNAPSHOT (COMPACT METRICS ROW)
        ==================================================
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical */}
        <div className="bg-white border border-[#E5E7EB] hover:border-red-300 rounded-xl p-4 shadow-2xs transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-900 uppercase tracking-wider font-mono">
              Critical
            </span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900">2</span>
            <span className="text-xs text-neutral-500">findings</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-red-700 font-medium">+2 vs yesterday</span>
            <span className="text-neutral-400">0 prior</span>
          </div>
          {/* Micro sparkline */}
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path
                d="M 0,20 Q 25,18 50,14 T 75,8 T 100,2"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Findings */}
        <div className="bg-white border border-[#E5E7EB] hover:border-[#016D5D]/50 rounded-xl p-4 shadow-2xs transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#016D5D] uppercase tracking-wider font-mono">
              Findings
            </span>
            <Shield className="w-4 h-4 text-[#016D5D]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900">20</span>
            <span className="text-xs text-neutral-500">detected</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#016D5D] font-medium">+900% vs previous 24h</span>
            <span className="text-neutral-400">2 prior</span>
          </div>
          {/* Micro sparkline */}
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path
                d="M 0,22 Q 25,20 50,15 T 75,6 T 100,2"
                fill="none"
                stroke="#016D5D"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Cameras online */}
        <div className="bg-white border border-[#E5E7EB] hover:border-emerald-300 rounded-xl p-4 shadow-2xs transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider font-mono">
              Cameras Online
            </span>
            <Camera className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900">15 / 15</span>
            <span className="text-xs text-emerald-700 font-medium">100%</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-700 font-medium">100% operational</span>
            <span className="text-neutral-400">0 drops</span>
          </div>
          {/* Micro sparkline */}
          <div className="mt-3 h-8 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <line x1="0" y1="12" x2="100" y2="12" stroke="#10B981" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 4: Sites */}
        <div className="bg-white border border-[#E5E7EB] hover:border-slate-400 rounded-xl p-4 shadow-2xs transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-mono">
              Sites
            </span>
            <Building2 className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900">3</span>
            <span className="text-xs text-neutral-500">active</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-700 font-medium">All synchronized</span>
            <span className="text-neutral-400">&lt;14ms latency</span>
          </div>
          {/* Micro pulse indicator */}
          <div className="mt-3 flex items-center gap-1.5 h-8">
            <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-ping" />
            <span className="text-[11px] font-mono text-neutral-500">Live multi-site telemetry</span>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 5: IMPORTANT FINDINGS & RECOMMENDATIONS
        "Nevrixa noticed" + "Recommended actions"
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Important Findings (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#000000]">
                Nevrixa noticed
              </h2>
              <p className="text-xs text-neutral-500">
                Highest-value signals and operational anomalies
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">3 signals</span>
          </div>

          <div className="space-y-2.5">
            {/* Row 1: Critical */}
            <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600 text-white font-semibold">
                    Critical
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    Critical findings appeared this period
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  <span className="font-mono font-medium">2 findings</span> · Server Vault door breach & Zone C crowd overflow
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = findings.find((x) => x.severity === 'CRITICAL');
                  if (f) onSelectFinding(f);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer"
              >
                See critical
              </button>
            </div>

            {/* Row 2: Attention Corridor Area */}
            <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-semibold">
                    Attention
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    Corridor Area has gone dark
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  <span className="font-mono font-medium">740h</span> since last coverage · Munich Facility CAM-11
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer"
              >
                Reconnect
              </button>
            </div>

            {/* Row 3: Attention Godown */}
            <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-semibold">
                    Attention
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    Camera offline in Godown
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  Running at <span className="font-mono font-medium">4.5× yesterday's rate</span> · Chennai Facility CAM-02
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer"
              >
                Review camera offline
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Actions (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[#000000]">
              Recommended actions
            </h2>
            <p className="text-xs text-neutral-500">
              AI-generated operational dispatches
            </p>
          </div>

          <div className="space-y-3">
            {/* Recommendation 1 */}
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] hover:border-[#016D5D]/50 bg-[#F9FAFB] space-y-2 transition-all">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Camera coverage issue
              </div>
              <div className="text-xs font-semibold text-neutral-900">
                Corridor Area is offline
              </div>
              <div className="text-[11px] text-neutral-600">
                No coverage for 740h, since 16:24. Switch port handshake failed.
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
                }}
                className="mt-1 text-xs font-semibold text-[#016D5D] hover:text-[#01584b] flex items-center gap-1 cursor-pointer"
              >
                <span>Reconnect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recommendation 2 */}
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] hover:border-[#016D5D]/50 bg-[#F9FAFB] space-y-2 transition-all">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Phone usage increased
              </div>
              <div className="text-xs font-semibold text-neutral-900">
                Phone use is newly active
              </div>
              <div className="text-[11px] text-neutral-600">
                9 findings during this period. Screen interactions logged across Office.
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = findings.find((x) => x.title.toLowerCase().includes('phone'));
                  if (f) onSelectFinding(f);
                }}
                className="mt-1 text-xs font-semibold text-[#016D5D] hover:text-[#01584b] flex items-center gap-1 cursor-pointer"
              >
                <span>Review phone use</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 6: CAMERA COVERAGE
        "Coverage · Detection running" (12 Cards)
        ==================================================
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#000000]">
                Coverage · Detection running
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
            </div>
            <p className="text-xs text-neutral-500">
              Edge camera fleet health and streaming status
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F4F4] rounded-lg text-xs font-mono">
            <button
              type="button"
              onClick={() => setCoverageFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                coverageFilter === 'all' ? 'bg-white text-neutral-900 font-semibold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              All (12)
            </button>
            <button
              type="button"
              onClick={() => setCoverageFilter('online')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                coverageFilter === 'online' ? 'bg-white text-emerald-800 font-semibold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Online (9)
            </button>
            <button
              type="button"
              onClick={() => setCoverageFilter('offline')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                coverageFilter === 'offline' ? 'bg-white text-red-800 font-semibold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Offline (3)
            </button>
          </div>
        </div>

        {/* 12 Compact Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredCameraCoverage.map((cam) => (
            <div
              key={cam.name}
              onClick={() => {
                if (cam.isOnline) {
                  setSelectedCameraForStream(cam.name);
                  setCameraStreamModalOpen(true);
                } else if (onTriggerReconnect) {
                  onTriggerReconnect(cam.name);
                }
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                !cam.isOnline
                  ? 'bg-[#FEF2F2]/40 border-red-200 hover:border-red-400'
                  : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#016D5D]/50 hover:bg-[#E6F4F1]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    cam.isOnline ? 'bg-emerald-500' : cam.isWarning ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-[10px] font-mono text-neutral-600">
                  {cam.lastActive}
                </span>
              </div>
              <div className="text-xs font-semibold text-neutral-900 truncate">
                {cam.name}
              </div>
              <div className="text-[11px] font-mono mt-0.5 flex items-center justify-between">
                <span className={cam.isOnline ? 'text-emerald-700' : 'text-red-700 font-semibold'}>
                  {cam.status}
                </span>
                {!cam.isOnline && (
                  <span className="text-[10px] text-[#016D5D] hover:underline">
                    Reconnect
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 7: HANDLED BY NEVRIXA & DETECTION ACTIVITY
        "Handled without you" + 24h Timeline
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Handled by Nevrixa (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold text-[#000000]">
                  Handled without you
                </h2>
                <Check className="w-3.5 h-3.5 text-[#016D5D]" />
              </div>
              <p className="text-xs text-neutral-500">
                Autonomous actions executed without operator intervention
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBriefingAuditModalOpen(true)}
              className="text-xs text-[#016D5D] font-semibold hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Activity Item 1 */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Smartphone className="w-3.5 h-3.5 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    Phone use for 5 seconds
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Office · <span className="font-mono">1m ago</span>
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Logged the usage in the daily summary
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Done</span>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Camera className="w-3.5 h-3.5 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    Camera offline
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Godown · <span className="font-mono">12h ago</span>
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Reviewed, classified and logged automatically
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Done</span>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Camera className="w-3.5 h-3.5 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    Camera offline
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Godown · <span className="font-mono">13h ago</span>
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Reviewed, classified and logged automatically
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Activity (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#000000]">
                Detection activity
              </h2>
              <div className="text-xs text-neutral-500 mt-0.5">
                <span className="font-bold text-neutral-900 font-mono text-sm">20 findings, today</span> · Timeline distribution
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-600">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Attention</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#016D5D]" />
                <span>Informational</span>
              </div>
            </div>
          </div>

          {/* Timeline Visualizer with Vertical Bars */}
          <div className="pt-3">
            <div className="h-36 flex items-end justify-between gap-1.5 border-b border-[#E5E7EB] pb-2">
              {timelineHours.map((slot, index) => {
                const heightPct = slot.total > 0 ? (slot.total / 4) * 85 + 15 : 6;
                const isHovered = hoveredTimelineHour === index;

                return (
                  <div
                    key={slot.hour}
                    onMouseEnter={() => setHoveredTimelineHour(index)}
                    onMouseLeave={() => setHoveredTimelineHour(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  >
                    {/* Tooltip */}
                    {isHovered && slot.total > 0 && (
                      <div className="absolute bottom-full mb-2 bg-neutral-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                        {slot.hour}: {slot.total} findings ({slot.critical} crit)
                      </div>
                    )}

                    {/* Stacked Vertical Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[18px] rounded-t transition-all ${
                        slot.critical > 0
                          ? 'bg-red-500 hover:bg-red-600'
                          : slot.attention > 0
                          ? 'bg-amber-400 hover:bg-amber-500'
                          : slot.total > 0
                          ? 'bg-[#016D5D] hover:bg-[#01584b]'
                          : 'bg-neutral-100 hover:bg-neutral-200'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Time Labels */}
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600 mt-2">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 8: SIGNALS TO WATCH
        ==================================================
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-[#000000]">
            Signals to watch
          </h2>
          <p className="text-xs text-neutral-500">
            AI-identified macro patterns and operational recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signal 1 */}
          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#016D5D]/40 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold uppercase">
                  Coverage
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xs font-semibold text-neutral-900 mt-2">
                Corridor Area offline for 740 hours
              </div>
              <div className="text-[11px] text-neutral-600 mt-1">
                Dispatch technician to check PoE switch on Hub 2. Persistent blindspot in secondary egress.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
              }}
              className="mt-2 text-xs font-semibold text-[#016D5D] hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              <span>Reconnect Switch Port</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Signal 2 */}
          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#016D5D]/40 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E6F4F1] text-[#016D5D] font-semibold uppercase">
                  Watch
                </span>
                <Activity className="w-3.5 h-3.5 text-[#016D5D]" />
              </div>
              <div className="text-xs font-semibold text-neutral-900 mt-2">
                Godown is your busiest camera
              </div>
              <div className="text-[11px] text-neutral-600 mt-1">
                Drove 55% of all findings today (11 of 20). Review sensitivity threshold on Godown CAM-02.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const f = findings.find((x) => x.id === 'FND-1044');
                if (f) onSelectFinding(f);
              }}
              className="mt-2 text-xs font-semibold text-[#016D5D] hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              <span>Inspect Godown CAM-02</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Signal 3 */}
          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#016D5D]/40 transition-colors space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold uppercase">
                  Pattern
                </span>
                <Zap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xs font-semibold text-neutral-900 mt-2">
                Camera offline is the most common finding
              </div>
              <div className="text-[11px] text-neutral-600 mt-1">
                Accounts for 45% of total detections. Run network diagnostics across Godown VLAN switch infrastructure.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onTriggerReconnect) onTriggerReconnect('Godown Storage');
              }}
              className="mt-2 text-xs font-semibold text-[#016D5D] hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-neutral-200/60"
            >
              <span>Run Network Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 9: FINDINGS DISTRIBUTION & TRENDS
        "How it distributed" + "Trends & comparisons"
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* How it distributed (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#000000]">
                How it distributed
              </h2>
              <p className="text-xs text-neutral-500">
                Finding category breakdown across 20 events
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">4 Categories</span>
          </div>

          <div className="space-y-3">
            {/* Category 1: Camera offline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900">Camera offline</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">45% of findings</span>
                  <span className="font-bold text-neutral-900">9 findings</span>
                  <span className="text-amber-800 text-[10px] bg-amber-50 px-1.5 py-0.2 rounded font-medium">+850%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            {/* Category 2: Phone use */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900">Phone use</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">45% of findings</span>
                  <span className="font-bold text-neutral-900">9 findings</span>
                  <span className="text-[#016D5D] text-[10px] bg-[#E6F4F1] px-1.5 py-0.2 rounded font-medium">New</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-[#016D5D] rounded-full" />
              </div>
            </div>

            {/* Category 3: Intrusion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900">Intrusion</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">5% of findings</span>
                  <span className="font-bold text-neutral-900">1 finding</span>
                  <span className="text-red-700 text-[10px] bg-red-50 px-1.5 py-0.2 rounded font-medium">Critical</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-[5%] h-full bg-red-600 rounded-full" />
              </div>
            </div>

            {/* Category 4: Too many people */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-900">Too many people</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">5% of findings</span>
                  <span className="font-bold text-neutral-900">1 finding</span>
                  <span className="text-red-700 text-[10px] bg-red-50 px-1.5 py-0.2 rounded font-medium">Critical</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-[5%] h-full bg-red-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Trends & comparisons (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[#000000]">
              Trends & comparisons
            </h2>
            <p className="text-xs text-neutral-500">
              Operational period deltas vs previous 24h
            </p>
          </div>

          <div className="space-y-3">
            {/* Trend 1 */}
            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-900">
                  Phone use newly active
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Detector deployed at 08:00 AM
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-bold text-[#016D5D]">0 → 9</div>
                <div className="text-[10px] text-neutral-400">findings</div>
              </div>
            </div>

            {/* Trend 2 */}
            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-900">
                  Critical threats elevated
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Server vault & Zone C crowd breach
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-bold text-red-600">2 critical</div>
                <div className="text-[10px] text-neutral-400">vs 0 yesterday</div>
              </div>
            </div>

            {/* Trend 3 */}
            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-900">
                  Camera concentration
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Godown drove 55% of all findings
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-bold text-neutral-900">11 of 20</div>
                <div className="text-[10px] text-neutral-400">55% volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 10: FINDINGS BY CAMERA & DETECTOR RELIABILITY
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Findings by Camera Table (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#000000]">
                Findings by camera
              </h2>
              <p className="text-xs text-neutral-500">
                Detailed telemetry breakdown by stream source
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">6 cameras active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[10px] font-mono uppercase text-neutral-600">
                  <th className="pb-2 font-medium">Camera</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">vs Prior</th>
                  <th className="pb-2 font-medium">Most Common</th>
                  <th className="pb-2 font-medium">Critical</th>
                  <th className="pb-2 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {/* Godown */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Godown</td>
                  <td className="py-2.5 font-mono font-bold">11</td>
                  <td className="py-2.5 font-mono text-amber-800 font-medium">+550%</td>
                  <td className="py-2.5 text-neutral-600">Camera offline</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">12m ago</td>
                </tr>

                {/* Test */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Test</td>
                  <td className="py-2.5 font-mono font-bold">4</td>
                  <td className="py-2.5 font-mono text-[#016D5D] font-medium">+100%</td>
                  <td className="py-2.5 text-neutral-600">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">45m ago</td>
                </tr>

                {/* Warehouse */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Warehouse</td>
                  <td className="py-2.5 font-mono font-bold">2</td>
                  <td className="py-2.5 font-mono text-neutral-500">-20%</td>
                  <td className="py-2.5 text-neutral-600">Intrusion</td>
                  <td className="py-2.5 font-mono text-red-600 font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">2h ago</td>
                </tr>

                {/* Childcare Room 3 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Childcare Room 3</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-[#016D5D]">new</td>
                  <td className="py-2.5 text-neutral-600">Too many people</td>
                  <td className="py-2.5 font-mono text-red-600 font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">3h ago</td>
                </tr>

                {/* Childcare Room 1 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Childcare Room 1</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">stable</td>
                  <td className="py-2.5 text-neutral-600">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">5h ago</td>
                </tr>

                {/* Childcare Room 2 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-semibold text-neutral-900">Childcare Room 2</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">stable</td>
                  <td className="py-2.5 text-neutral-600">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">6h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detector Reliability (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[#000000]">
              Detector reliability
            </h2>
            <p className="text-xs text-neutral-500">
              Inference confidence metrics by neural model
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Row 1: Camera offline */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Camera offline</span>
                <span className="text-[10px] font-mono text-neutral-500">9 findings</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Confidence not recorded</span>
                <span>Telemetry check</span>
              </div>
            </div>

            {/* Row 2: Phone use */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Phone use</span>
                <span className="text-[10px] font-mono text-neutral-500">9 findings</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-700 font-semibold">54% confidence</span>
                <span className="text-[#016D5D]">NV-PHONE-V1.2</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="w-[54%] h-full bg-[#016D5D] rounded-full" />
              </div>
            </div>

            {/* Row 3: Intrusion */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Intrusion</span>
                <span className="text-[10px] font-mono text-red-600 font-bold">1 finding · 1 critical</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 font-semibold">89% confidence</span>
                <span className="text-neutral-500">NV-INTRUSION-V3.8</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="w-[89%] h-full bg-emerald-600 rounded-full" />
              </div>
            </div>

            {/* Row 4: Too many people */}
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Too many people</span>
                <span className="text-[10px] font-mono text-red-600 font-bold">1 finding · 1 critical</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 font-semibold">100% confidence</span>
                <span className="text-neutral-500">NV-CROWD-V2.6</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Live Stream & Telemetry Preview Modal */}
      <CameraStreamModal
        isOpen={cameraStreamModalOpen}
        onClose={() => setCameraStreamModalOpen(false)}
        cameraName={selectedCameraForStream}
        onOpenFindings={(camName) => {
          onNavigateToFindings();
        }}
      />

      {/* 20 Events Daily Briefing Audit Modal */}
      <BriefingAuditModal
        isOpen={briefingAuditModalOpen}
        onClose={() => setBriefingAuditModalOpen(false)}
        findings={findings}
        onSelectFinding={(f) => onSelectFinding(f)}
      />
    </div>
  );
};
