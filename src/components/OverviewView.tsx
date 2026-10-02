import React, { useState } from 'react';
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
  Server,
  MapPin,
  Gauge,
  Wifi,
  WifiOff,
  Video,
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
  const [cameraSearchTerm, setCameraSearchTerm] = useState('');

  // Detection Chart Options State
  const [chartTimeRange, setChartTimeRange] = useState<'today' | 'peak' | '7day'>('today');
  const [showYesterdayBaseline, setShowYesterdayBaseline] = useState(true);

  // Camera Live Stream Modal State
  const [cameraStreamModalOpen, setCameraStreamModalOpen] = useState(false);
  const [selectedCameraForStream, setSelectedCameraForStream] = useState<string>('');

  // Briefing Audit Modal State
  const [briefingAuditModalOpen, setBriefingAuditModalOpen] = useState(false);

  // Interactive timeline hover state
  const [hoveredTimelineHour, setHoveredTimelineHour] = useState<number | null>(6);

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
            'Phone use is newly active today with 9 verified findings across Office and Godown (0 yesterday). The average interaction duration was 5.2 seconds. Nevrixa automatically verified the posture signature and logged all 9 instances to the daily summary without requiring operator escalation.',
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

  // 12 Camera Coverage Items with Enhanced Edge Telemetry & Resolution
  const cameraCoverageList = [
    { name: 'Parking Area', status: 'Online', lastActive: '14d ago', isOnline: true, zone: 'Zone P1 · North', fps: '30 FPS', res: '1080p', site: 'Chennai Facility' },
    { name: 'Loading Area', status: 'Online', lastActive: '22d ago', isOnline: true, zone: 'Bay 01 · Dock', fps: '30 FPS', res: '1080p', site: 'Chennai Facility' },
    { name: 'Corridor Area', status: 'Offline', lastActive: '740h ago', isOnline: false, isWarning: true, zone: 'Transit Corridor B', fps: '0 FPS', res: 'No Signal', site: 'Munich Facility' },
    { name: 'Counter', status: 'Online', lastActive: '20d ago', isOnline: true, zone: 'Lobby · Reception', fps: '30 FPS', res: '1080p', site: 'Singapore Hub' },
    { name: 'Shop Floor', status: 'Offline', lastActive: '2d ago', isOnline: false, zone: 'Assembly Hall West', fps: '0 FPS', res: 'PoE Drop', site: 'Chennai Facility' },
    { name: 'Second Floor', status: 'Offline', lastActive: '2d ago', isOnline: false, zone: 'Level 2 Mezzanine', fps: '0 FPS', res: 'Timeout', site: 'Munich Facility' },
    { name: 'Ground Floor', status: 'Online', lastActive: '2d ago', isOnline: true, zone: 'Central Atrium', fps: '30 FPS', res: '4K UHD', site: 'Singapore Hub' },
    { name: 'Car Parking', status: 'Online', lastActive: '2d ago', isOnline: true, zone: 'South Lot B', fps: '30 FPS', res: '1080p', site: 'Chennai Facility' },
    { name: 'Warehouse', status: 'Online', lastActive: '14h ago', isOnline: true, zone: 'Racks 10-18', fps: '30 FPS', res: '1080p', site: 'Chennai Facility' },
    { name: 'Test', status: 'Online', lastActive: '14h ago', isOnline: true, zone: 'Lab Node 01', fps: '60 FPS', res: '1080p', site: 'Chennai Facility' },
    { name: 'Childcare Room 1', status: 'Online', lastActive: '14h ago', isOnline: true, zone: 'East Wing Nursery', fps: '30 FPS', res: '1080p', site: 'Munich Facility' },
    { name: 'Childcare Room 2', status: 'Online', lastActive: '14h ago', isOnline: true, zone: 'West Wing Nursery', fps: '30 FPS', res: '1080p', site: 'Munich Facility' },
  ];

  const filteredCameraCoverage = cameraCoverageList.filter((cam) => {
    if (coverageFilter === 'online' && !cam.isOnline) return false;
    if (coverageFilter === 'offline' && cam.isOnline) return false;
    if (cameraSearchTerm.trim() && !cam.name.toLowerCase().includes(cameraSearchTerm.toLowerCase()) && !cam.zone.toLowerCase().includes(cameraSearchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 24h Timeline Buckets for Detection Activity
  const timelineHours = [
    { hour: '00:00', x: 20, total: 0, critical: 0, attention: 0, info: 0, yesterday: 0, label: '00:00' },
    { hour: '02:00', x: 70, total: 0, critical: 0, attention: 0, info: 0, yesterday: 0, label: '02:00' },
    { hour: '04:00', x: 120, total: 0, critical: 0, attention: 0, info: 0, yesterday: 0, label: '04:00' },
    { hour: '06:00', x: 170, total: 1, critical: 0, attention: 0, info: 1, yesterday: 0, label: '06:00' },
    { hour: '08:00', x: 220, total: 2, critical: 0, attention: 1, info: 1, yesterday: 1, label: '08:00' },
    { hour: '09:00', x: 270, total: 3, critical: 0, attention: 2, info: 1, yesterday: 0, label: '09:00' },
    { hour: '10:00', x: 320, total: 4, critical: 2, attention: 1, info: 1, yesterday: 0, label: '10:00 (Peak)' },
    { hour: '11:00', x: 370, total: 2, critical: 0, attention: 1, info: 1, yesterday: 0, label: '11:00' },
    { hour: '12:00', x: 420, total: 3, critical: 0, attention: 1, info: 2, yesterday: 1, label: '12:00' },
    { hour: '14:00', x: 470, total: 1, critical: 0, attention: 1, info: 0, yesterday: 0, label: '14:00' },
    { hour: '16:00', x: 520, total: 1, critical: 0, attention: 1, info: 0, yesterday: 0, label: '16:00' },
    { hour: '18:00', x: 570, total: 0, critical: 0, attention: 0, info: 0, yesterday: 0, label: '18:00' },
    { hour: '20:00', x: 620, total: 1, critical: 0, attention: 1, info: 0, yesterday: 0, label: '20:00' },
    { hour: '22:00', x: 670, total: 2, critical: 0, attention: 1, info: 1, yesterday: 0, label: '22:00' },
    { hour: '23:59', x: 720, total: 0, critical: 0, attention: 0, info: 0, yesterday: 0, label: '23:59' },
  ];
  const currentHoveredData = hoveredTimelineHour !== null ? timelineHours[hoveredTimelineHour] : timelineHours[6];

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1580px] mx-auto">
      {/* 
        ==================================================
        SECTION 1: PAGE HEADER & SYSTEM STATUS BAR
        ==================================================
      */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="text-xs font-semibold text-[#016D5D] tracking-wide uppercase font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
            <span>NEVRIXA AI Operations Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000] mt-1">
            Good morning
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            Friday, October 2 · Autonomous video perception and continuous facility governance
          </p>

          {/* Compact Telemetry Status Line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-neutral-600 font-mono">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900 bg-[#E6F4F1] text-[#016D5D] px-2 py-0.5 rounded-md border border-[#016D5D]/20">
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
            className="px-4 py-2 bg-[#016D5D] hover:bg-[#01584b] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer group"
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
        (Modernized with eye-catching colored gradient surfaces)
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Large AI Briefing Card (8 Columns) - Eye-Catching Mint/Teal Gradient Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#E6F4F1]/70 via-white to-[#F0FAF8] border border-[#016D5D]/25 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Top highlight cyan bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#016D5D] via-[#00E9C9] to-[#016D5D]" />

          <div>
            {/* Header with AI Pill */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#016D5D] text-[#00E9C9] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#016D5D] uppercase tracking-wider font-mono">
                    Today's AI Briefing
                  </span>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Autonomous Perception & Synthesis
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#016D5D] bg-white border border-[#016D5D]/25 px-2.5 py-0.5 rounded-full font-semibold shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-pulse" />
                Live Continuous Synthesis
              </span>
            </div>

            {/* High-confidence bold statement */}
            <div className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight leading-snug">
              20 things happened.<br />
              <span className="text-[#016D5D] font-medium">All of them have been reviewed.</span>
            </div>

            {/* Chronological Activity Stream */}
            <div className="mt-5 space-y-2 border-t border-[#016D5D]/15 pt-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-2">
                <span>Recent Review Activity</span>
                <span className="text-neutral-500">Auto-classified stream</span>
              </div>

              {/* Item 1 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.title.toLowerCase().includes('phone'));
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 hover:bg-white border border-[#E5E7EB] hover:border-[#016D5D]/50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-neutral-700 shrink-0 w-12">12:08</span>
                  <span className="text-xs font-bold text-neutral-900 shrink-0 w-16">Office</span>
                  <span className="text-xs text-neutral-600 truncate font-medium">
                    Logged usage in the daily summary
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#016D5D] text-[#00E9C9] font-bold shadow-2xs">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 hover:bg-white border border-[#E5E7EB] hover:border-[#016D5D]/50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-neutral-700 shrink-0 w-12">23:45</span>
                  <span className="text-xs font-bold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate font-medium">
                    Reviewed, classified and logged automatically
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#016D5D] text-[#00E9C9] font-bold shadow-2xs">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 hover:bg-white border border-[#E5E7EB] hover:border-[#016D5D]/50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-neutral-700 shrink-0 w-12">22:21</span>
                  <span className="text-xs font-bold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate font-medium">
                    Reviewed, classified and logged automatically
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#016D5D] text-[#00E9C9] font-bold shadow-2xs">
                    AI reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                </div>
              </div>

              {/* Item 4 */}
              <div
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/90 hover:bg-white border border-[#E5E7EB] hover:border-[#016D5D]/50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-neutral-700 shrink-0 w-12">22:08</span>
                  <span className="text-xs font-bold text-neutral-900 shrink-0 w-16">Godown</span>
                  <span className="text-xs text-neutral-600 truncate font-medium">
                    Logged usage in the daily summary
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-white font-semibold shadow-2xs">
                    Human reviewed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions at bottom of briefing */}
          <div className="mt-5 pt-3.5 border-t border-[#016D5D]/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setBriefingAuditModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#016D5D] hover:bg-[#01584b] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <span>See what happened</span>
                <ArrowRight className="w-3 h-3 text-[#00E9C9]" />
              </button>

              <button
                type="button"
                onClick={() => handleAskCopilot('Summarize today\'s critical findings')}
                className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#E5E7EB] rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              >
                Ask a follow-up
              </button>
            </div>

            <div className="text-[11px] font-mono text-neutral-600 bg-white/80 px-2 py-0.5 rounded border border-[#E5E7EB]">
              Confidence baseline: <span className="font-bold text-[#016D5D]">96.8%</span>
            </div>
          </div>
        </div>

        {/* Right-Side Summary Card: Autonomy — Today (4 Columns) - Colored Modern Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-white via-[#F9FBFA] to-[#E6F4F1]/60 border border-[#016D5D]/25 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E9C9] animate-pulse" />
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                  Autonomy — Today
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#016D5D] font-bold bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                30% Autonomous
              </span>
            </div>

            {/* Circular Gauge / Donut Visualization */}
            <div className="flex items-center gap-5 my-2">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-neutral-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Handled by Nevrixa (30% -> 6/20) */}
                  <path
                    className="text-[#00E9C9]"
                    strokeDasharray="30, 100"
                    strokeWidth="4"
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
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-neutral-900 font-mono leading-none">20</span>
                  <span className="text-[10px] text-neutral-500 font-mono mt-0.5">findings</span>
                </div>
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs p-1.5 rounded bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00E9C9] shrink-0" />
                    <span className="text-neutral-700 truncate font-medium">Handled by Nevrixa</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 ml-1">6 (30%)</span>
                </div>

                <div className="flex items-center justify-between text-xs p-1.5 rounded bg-white border border-[#E5E7EB] shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#016D5D] shrink-0" />
                    <span className="text-neutral-700 truncate font-medium">Reviewed by person</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 ml-1">14 (70%)</span>
                </div>
              </div>
            </div>

            {/* Status Breakdown Indicators with distinct colored backgrounds */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#016D5D]/15 text-xs">
              <div className="py-2 px-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200">
                <div className="text-[10px] font-mono text-emerald-700 uppercase font-semibold">Action required</div>
                <div className="font-mono font-bold text-emerald-950 text-sm mt-0.5">
                  0 actions
                </div>
              </div>
              <div className="py-2 px-2.5 rounded-lg bg-amber-50/90 border border-amber-200">
                <div className="text-[10px] font-mono text-amber-700 uppercase font-semibold">Waiting on you</div>
                <div className="font-mono font-bold text-amber-950 text-sm mt-0.5">
                  8 waiting
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#016D5D]/15">
            <button
              type="button"
              onClick={onNavigateToFindings}
              className="text-xs font-bold text-[#016D5D] hover:text-[#01584b] flex items-center justify-between w-full group cursor-pointer"
            >
              <span>Automation audit log</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#016D5D] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 3: AI QUERY BAR (COPILOT INTERACTION AREA)
        (With vibrant focus glow and design formula)
        ==================================================
      */}
      <div className="bg-gradient-to-r from-white via-[#F9FAFB] to-[#F0FAF8] border border-[#016D5D]/25 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#016D5D]" />
            </div>
            <h2 className="text-sm font-bold text-[#000000]">
              Ask about your cameras or findings
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
            Natural Language Operating Layer
          </span>
        </div>

        {/* Input Form with Cyan Ring Focus */}
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
            placeholder="Ask Nevrixa anything about today's activity (e.g. Which camera needs attention?)"
            className="w-full h-11 pl-4 pr-24 bg-white border border-[#E5E7EB] focus:border-[#016D5D] focus:ring-4 focus:ring-[#00E9C9]/20 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-all font-sans shadow-2xs"
          />
          <button
            type="submit"
            disabled={!aiQueryInput.trim() || isCopilotThinking}
            className="absolute right-2 px-3.5 py-1.5 bg-[#016D5D] hover:bg-[#01584b] disabled:bg-neutral-300 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs"
          >
            {isCopilotThinking ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E9C9]" />
            ) : (
              <Send className="w-3.5 h-3.5 text-[#00E9C9]" />
            )}
            <span>Analyze</span>
          </button>
        </form>

        {/* Suggested Prompts Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-neutral-500 mr-1">Suggested questions:</span>
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleAskCopilot(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#E6F4F1] border border-[#E5E7EB] hover:border-[#016D5D] text-neutral-700 hover:text-[#016D5D] text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Active Copilot Response Pane */}
        {activeCopilotAnswer && (
          <div className="mt-3 p-4 bg-gradient-to-br from-[#E6F4F1] to-[#F0FAF8] border border-[#016D5D]/30 rounded-lg space-y-2.5 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-ping" />
                <span className="text-xs font-bold text-[#016D5D]">
                  Nevrixa Perception Response
                </span>
              </div>
              {activeCopilotAnswer.metric && (
                <span className="text-[11px] font-mono font-bold text-[#016D5D] bg-white px-2.5 py-0.5 rounded border border-[#016D5D]/25 shadow-2xs">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#016D5D] text-white rounded text-xs font-semibold hover:bg-[#01584b] transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{activeCopilotAnswer.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-[#00E9C9]" />
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
        SECTION 4: TODAY SNAPSHOT (EYE-CATCHING COLORED CARDS)
        Rich colored backgrounds, top accent lines, and modern area sparklines
        ==================================================
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical (Soft Crimson/Rose Tinted Background) */}
        <div className="bg-gradient-to-br from-red-500/10 via-rose-50/80 to-white border border-red-200/90 hover:border-red-400 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              Critical Threats
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-red-950 tracking-tight">2</span>
            <span className="text-xs text-neutral-500 font-medium">findings requiring action</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-red-750 font-bold bg-red-100/90 text-red-800 px-2 py-0.5 rounded-md border border-red-200/60">
              +2 vs yesterday
            </span>
            <span className="text-neutral-500 font-semibold">0 prior</span>
          </div>
          {/* Micro Area Sparkline */}
          <div className="mt-3 h-10 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="0,26 25,24 50,18 75,10 100,4 100,28 0,28" fill="url(#critGrad)" />
              <path
                d="M 0,26 Q 25,24 50,18 T 75,10 T 100,4"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Findings (Soft Brand Teal/Cyan Background) */}
        <div className="bg-gradient-to-br from-[#016D5D]/10 via-[#E6F4F1]/70 to-white border border-[#016D5D]/25 hover:border-[#016D5D]/60 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#016D5D] via-[#00E9C9] to-[#8FF2E2]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#016D5D] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-pulse" />
              Total Findings
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#016D5D] text-[#00E9C9] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-[#00E9C9]" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-neutral-950 tracking-tight">20</span>
            <span className="text-xs text-neutral-500 font-medium">events detected</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#016D5D] font-bold bg-[#8FF2E2]/50 px-2 py-0.5 rounded-md border border-[#016D5D]/20">
              +900% vs 24h
            </span>
            <span className="text-neutral-500 font-semibold">2 prior baseline</span>
          </div>
          {/* Micro Area Sparkline */}
          <div className="mt-3 h-10 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#016D5D" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00E9C9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="0,26 25,24 50,18 75,8 100,4 100,28 0,28" fill="url(#tealGrad)" />
              <path
                d="M 0,26 Q 25,24 50,18 T 75,8 T 100,4"
                fill="none"
                stroke="#016D5D"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Cameras online (Soft Emerald Tinted Background) */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-50/80 to-white border border-emerald-200/90 hover:border-emerald-400 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cameras Online
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-neutral-950 tracking-tight">15 / 15</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100/90 px-1.5 py-0.5 rounded">100% active</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200/60">
              12 primary nodes
            </span>
            <span className="text-neutral-500 font-semibold">0 stream drops</span>
          </div>
          {/* Steady green wave sparkline */}
          <div className="mt-3 h-10 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="0,14 25,12 50,14 75,12 100,14 100,28 0,28" fill="url(#emGrad)" />
              <path
                d="M 0,14 Q 25,12 50,14 T 75,12 T 100,14"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Edge Inference & Sites (Soft Indigo/Sky Tinted Background) */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-sky-50/80 to-white border border-indigo-200 hover:border-indigo-400 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Edge Inference Speed
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-indigo-700" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-neutral-950 tracking-tight">14.2</span>
            <span className="text-xs text-neutral-500 font-mono font-medium">ms / frame (60 FPS)</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-indigo-800 font-bold bg-indigo-100/90 px-2 py-0.5 rounded-md border border-indigo-200/60">
              3 Monitored Sites
            </span>
            <span className="text-neutral-500 font-semibold">99.98% uptime</span>
          </div>
          {/* Micro pulse wave indicator */}
          <div className="mt-3 flex items-center justify-between h-10 px-2 bg-indigo-50/50 rounded-lg border border-indigo-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-ping" />
              <span className="text-[11px] font-mono text-neutral-700 font-bold">Chennai · Munich · Singapore</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
              Edge Live
            </span>
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
        {/* Important Findings (7 Columns) - Colored Alert Cards */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#000000]">
                Nevrixa noticed
              </h2>
              <p className="text-xs text-neutral-500">
                Highest-value signals and operational anomalies
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#016D5D] bg-[#E6F4F1] px-2 py-0.5 rounded font-semibold">
              3 high-value signals
            </span>
          </div>

          <div className="space-y-3">
            {/* Row 1: Critical (Bold Rose Background) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-50/90 via-white to-red-50/40 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                    Critical
                  </span>
                  <span className="text-xs font-bold text-neutral-900">
                    Critical findings appeared this period
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  <span className="font-mono font-bold text-red-700">2 findings</span> · Server Vault door breach & Zone C crowd overflow
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = findings.find((x) => x.severity === 'CRITICAL');
                  if (f) onSelectFinding(f);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
              >
                See critical
              </button>
            </div>

            {/* Row 2: Attention Corridor Area (Warm Amber Background) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-bold">
                    Attention
                  </span>
                  <span className="text-xs font-bold text-neutral-900">
                    Corridor Area has gone dark
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  <span className="font-mono font-bold text-amber-800">740h</span> since last coverage · Munich Facility CAM-11
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
              >
                Reconnect
              </button>
            </div>

            {/* Row 3: Attention Godown (Yellow/Amber Tinted Card) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/70 via-white to-orange-50/30 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-bold">
                    Attention
                  </span>
                  <span className="text-xs font-bold text-neutral-900">
                    Camera offline in Godown
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600">
                  Running at <span className="font-mono font-bold text-amber-800">4.5× yesterday's rate</span> · Chennai Facility CAM-02
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = findings.find((x) => x.id === 'FND-1044');
                  if (f) onSelectFinding(f);
                }}
                className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
              >
                Review camera offline
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Actions (5 Columns) - Colored Action Cards */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#000000]">
              Recommended actions
            </h2>
            <p className="text-xs text-neutral-500">
              AI-generated operational dispatches
            </p>
          </div>

          <div className="space-y-3">
            {/* Recommendation 1 */}
            <div className="p-4 rounded-xl border border-[#016D5D]/25 bg-gradient-to-br from-[#F9FAFB] to-[#F0FAF8] space-y-2 transition-all shadow-2xs">
              <div className="text-[10px] font-mono text-[#016D5D] uppercase tracking-wider font-bold">
                Camera coverage issue
              </div>
              <div className="text-xs font-bold text-neutral-900">
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
                className="mt-2 text-xs font-bold text-[#016D5D] hover:text-[#01584b] flex items-center gap-1 cursor-pointer pt-2 border-t border-[#016D5D]/15 w-full justify-between"
              >
                <span>Reconnect camera stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recommendation 2 */}
            <div className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-[#F9FAFB] to-amber-50/40 space-y-2 transition-all shadow-2xs">
              <div className="text-[10px] font-mono text-amber-700 uppercase tracking-wider font-bold">
                Phone usage increased
              </div>
              <div className="text-xs font-bold text-neutral-900">
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
                className="mt-2 text-xs font-bold text-[#016D5D] hover:text-[#01584b] flex items-center gap-1 cursor-pointer pt-2 border-t border-amber-200/60 w-full justify-between"
              >
                <span>Review phone use events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 6: CAMERA COVERAGE
        "Coverage · Detection running" (12 Edge Nodes with Eye-Catching Colored Design Formula)
        ==================================================
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
                <Video className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-[#000000]">
                Coverage · Detection running
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E9C9] animate-pulse" />
              <span className="text-[11px] font-mono text-[#016D5D] bg-[#E6F4F1] px-2 py-0.5 rounded font-bold">
                12 Monitored Streams
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Real-time edge camera fleet health across 3 facilities · Click online nodes for live feed, offline nodes to trigger edge reconnect
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cameraSearchTerm}
                onChange={(e) => setCameraSearchTerm(e.target.value)}
                placeholder="Search camera or zone..."
                className="h-8 pl-8 pr-3 text-xs bg-[#F9FAFB] border border-[#E5E7EB] focus:border-[#016D5D] rounded-lg outline-none w-44 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-0.5 bg-[#F4F4F4] rounded-lg text-xs font-mono">
              <button
                type="button"
                onClick={() => setCoverageFilter('all')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  coverageFilter === 'all'
                    ? 'bg-[#016D5D] text-white font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All (12)
              </button>
              <button
                type="button"
                onClick={() => setCoverageFilter('online')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  coverageFilter === 'online'
                    ? 'bg-[#016D5D] text-white font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Online (9)
              </button>
              <button
                type="button"
                onClick={() => setCoverageFilter('offline')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  coverageFilter === 'offline'
                    ? 'bg-red-600 text-white font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Offline (3)
              </button>
            </div>
          </div>
        </div>

        {/* 12 Modern Edge Camera Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
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
              className={`rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-2xs hover:shadow-md hover:-translate-y-1 ${
                !cam.isOnline
                  ? 'bg-gradient-to-br from-red-500/10 via-white to-rose-50/70 border-red-200 hover:border-red-400'
                  : 'bg-gradient-to-br from-white via-[#F9FBFA] to-[#E6F4F1]/60 border-[#E5E7EB] hover:border-[#016D5D]'
              }`}
            >
              {/* Top micro-line */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  cam.isOnline ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-red-600 to-rose-400'
                }`}
              />

              <div>
                {/* Header row with Status & Telemetry tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cam.isOnline ? 'bg-emerald-500 animate-pulse' : cam.isWarning ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        cam.isOnline ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {cam.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded border border-neutral-200/60">
                    {cam.fps}
                  </span>
                </div>

                {/* Simulated Lens Viewport Thumbnail Bar */}
                <div
                  className={`w-full h-11 rounded-lg mb-2 flex items-center justify-between px-2.5 transition-colors ${
                    cam.isOnline
                      ? 'bg-neutral-900 text-neutral-300 pattern-grid group-hover:bg-neutral-950'
                      : 'bg-red-950/80 text-red-200 border border-red-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {cam.isOnline ? (
                      <Wifi className="w-3 h-3 text-[#00E9C9]" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-400 animate-pulse" />
                    )}
                    <span className="text-[9px] font-mono tracking-wider font-semibold uppercase">
                      {cam.isOnline ? cam.res : 'SIGNAL DROP'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {cam.isOnline ? 'LIVE' : cam.lastActive}
                  </span>
                </div>

                {/* Camera Name & Zone */}
                <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#016D5D] transition-colors">
                  {cam.name}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono truncate mt-0.5 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-neutral-400" />
                  <span className="truncate">{cam.zone}</span>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="text-[10px] font-mono mt-3 pt-2 border-t border-neutral-100/90 flex items-center justify-between">
                {cam.isOnline ? (
                  <span className="text-[#016D5D] font-bold flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3 h-3 text-[#016D5D]" /> Live Feed ↗
                  </span>
                ) : (
                  <span className="text-red-700 font-bold flex items-center gap-1 group-hover:underline">
                    <RefreshCw className="w-3 h-3 text-red-600 animate-spin" style={{ animationDuration: '4s' }} /> Reconnect Now
                  </span>
                )}
                <span className="text-[9px] text-neutral-400 truncate max-w-[65px]">
                  {cam.site.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 7: HANDLED BY NEVRIXA & DETECTION ACTIVITY
        (Modernized with curved Area Chart visualization)
        ==================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Handled by Nevrixa (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-[#000000]">
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
              className="text-xs text-[#016D5D] font-bold hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Activity Item 1 */}
            <div className="p-3 rounded-xl border border-[#E5E7EB] bg-gradient-to-r from-[#F9FAFB] to-white flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    Phone use for 5 seconds
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Office · 1m ago
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Logged the usage in the daily summary
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 font-bold">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Done</span>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="p-3 rounded-xl border border-[#E5E7EB] bg-gradient-to-r from-[#F9FAFB] to-white flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    Camera offline
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Godown · 12h ago
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Reviewed, classified and logged automatically
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 font-bold">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Done</span>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="p-3 rounded-xl border border-[#E5E7EB] bg-gradient-to-r from-[#F9FAFB] to-white flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-[#016D5D]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    Camera offline
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Godown · 13h ago
                  </div>
                  <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                    Reviewed, classified and logged automatically
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 font-bold">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Detection Activity — High-Impact Curved Area Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#016D5D] via-[#00E9C9] to-teal-400" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-[#000000]">
                  Detection Activity & Telemetry Surge
                </h2>
                <span className="font-bold text-[#016D5D] font-mono text-xs bg-[#E6F4F1] px-2 py-0.5 rounded border border-[#016D5D]/20">
                  20 findings today
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Hover along curve to inspect telemetry volume by hour vs yesterday's baseline
              </p>
            </div>

            {/* Time Window Tabs & Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-[#F4F4F4] rounded-lg text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setChartTimeRange('today')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    chartTimeRange === 'today'
                      ? 'bg-[#016D5D] text-white font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Today (24h)
                </button>
                <button
                  type="button"
                  onClick={() => setChartTimeRange('peak')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    chartTimeRange === 'peak'
                      ? 'bg-[#016D5D] text-white font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Peak (08-14)
                </button>
                <button
                  type="button"
                  onClick={() => setChartTimeRange('7day')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    chartTimeRange === '7day'
                      ? 'bg-[#016D5D] text-white font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  7D Trend
                </button>
              </div>

              {/* Baseline toggle button */}
              <button
                type="button"
                onClick={() => setShowYesterdayBaseline(!showYesterdayBaseline)}
                className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
                  showYesterdayBaseline
                    ? 'bg-[#E6F4F1] border-[#016D5D]/30 text-[#016D5D] font-bold'
                    : 'bg-white border-neutral-200 text-neutral-500'
                }`}
                title="Toggle yesterday reference curve"
              >
                Yesterday: {showYesterdayBaseline ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Interactive Modern SVG Area Chart */}
          <div className="pt-2">
            <div className="relative w-full h-48 bg-gradient-to-b from-[#F8FBFA] via-white to-[#F4F9F8] rounded-xl border border-neutral-100 p-2 overflow-hidden shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 740 145" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#016D5D" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#00E9C9" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00E9C9" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line x1="0" y1="35" x2="740" y2="35" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="740" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="740" y2="105" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Y-axis micro labels */}
                <text x="6" y="38" className="text-[9px] fill-neutral-400 font-mono">4</text>
                <text x="6" y="73" className="text-[9px] fill-neutral-400 font-mono">3</text>
                <text x="6" y="108" className="text-[9px] fill-neutral-400 font-mono">2</text>
                <text x="6" y="137" className="text-[9px] fill-neutral-400 font-mono">0</text>

                {/* Yesterday Ghost Comparison Line (Dashed) */}
                {showYesterdayBaseline && (
                  <path
                    d="M 0,135 C 70,135 120,135 170,135 C 220,115 250,135 270,135 C 290,135 320,135 370,135 C 420,115 450,135 470,135 C 520,135 570,135 620,135 C 670,135 720,135 740,135"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                )}

                {/* Today's Area Polygon Fill */}
                <polygon
                  points="0,135 20,135 70,135 120,135 170,110 220,90 270,60 320,30 370,85 420,60 470,110 520,110 570,135 620,110 670,90 720,135 740,135 740,145 0,145"
                  fill="url(#activityGradient)"
                />

                {/* Smooth Bezier Curve Path with Cyan Accent */}
                <path
                  d="M 0,135 C 70,135 120,135 170,110 C 220,90 250,75 270,60 C 290,45 305,30 320,30 C 345,30 355,80 370,85 C 390,90 405,65 420,60 C 445,55 455,105 470,110 C 495,115 505,110 520,110 C 545,110 555,135 570,135 C 595,135 605,115 620,110 C 645,105 655,95 670,90 C 695,85 705,135 720,135 L 740,135"
                  fill="none"
                  stroke="#016D5D"
                  strokeWidth="3.2"
                />

                {/* Pinned Peak Callout at 10:00 (x: 320, y: 30) */}
                <g className="cursor-pointer">
                  <line x1="320" y1="30" x2="320" y2="12" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect x="260" y="3" width="120" height="18" rx="4" fill="#DC2626" />
                  <text x="320" y="15" textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-bold font-mono">
                    PEAK: 10:00 (4 Events)
                  </text>
                </g>

                {/* Data Points on Curve */}
                {timelineHours.map((slot, index) => {
                  const y =
                    slot.total === 4
                      ? 30
                      : slot.total === 3
                      ? 60
                      : slot.total === 2
                      ? 90
                      : slot.total === 1
                      ? 110
                      : 135;
                  const isHovered = hoveredTimelineHour === index;

                  return (
                    <g key={slot.hour} className="cursor-pointer" onClick={() => setHoveredTimelineHour(index)}>
                      {isHovered && (
                        <circle cx={slot.x} cy={y} r="9" fill="#00E9C9" opacity="0.4" className="animate-ping" />
                      )}
                      <circle
                        cx={slot.x}
                        cy={y}
                        r={isHovered ? '6' : slot.total > 0 ? '4' : '2.5'}
                        fill={slot.critical > 0 ? '#DC2626' : slot.total > 0 ? '#016D5D' : '#CBD5E1'}
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Floating Dynamic Tooltip Card */}
              {currentHoveredData && (
                <div
                  className="absolute top-3 right-3 bg-neutral-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-neutral-700 text-xs font-mono space-y-1.5 pointer-events-none z-10 animate-in fade-in"
                >
                  <div className="flex items-center justify-between gap-4 text-[11px] text-[#00E9C9] font-bold border-b border-neutral-800 pb-1">
                    <span>{currentHoveredData.hour} Time Window</span>
                    <span className="bg-[#016D5D] px-2 py-0.5 rounded text-white">{currentHoveredData.total} findings</span>
                  </div>
                  <div className="text-[10px] text-neutral-300 flex items-center gap-3">
                    <span className="text-red-400 font-bold">{currentHoveredData.critical} critical</span>
                    <span className="text-amber-400">{currentHoveredData.attention} attention</span>
                    <span className="text-teal-300">{currentHoveredData.info} informational</span>
                  </div>
                  {showYesterdayBaseline && (
                    <div className="text-[9px] text-neutral-400 pt-0.5">
                      Yesterday at this hour: <span className="font-bold text-neutral-200">{currentHoveredData.yesterday} findings</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Time Reference Labels & Chart Metrics Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-600 mt-2 px-1">
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">00:00</span>
                <span>06:00 (1 Event)</span>
                <span className="font-bold text-[#016D5D] bg-[#E6F4F1] px-1.5 py-0.5 rounded">10:00 Peak (4)</span>
                <span>18:00 (Quiet)</span>
                <span className="text-neutral-500">23:59</span>
              </div>

              {/* Legend with Colored Badges */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>Critical (2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Attention (9)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#016D5D]" />
                  <span>Info (9)</span>
                </div>
                {showYesterdayBaseline && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 border-b-2 border-dashed border-neutral-400" />
                    <span className="text-neutral-400">Yesterday</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 7.5: MULTI-FACILITY OPERATIONAL MATRIX
        (Eye-catching colored status cards across Chennai, Munich, Singapore)
        ==================================================
      */}
      <div className="bg-gradient-to-r from-white via-[#F9FBFA] to-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-[#000000]">
                Facility Operations & Edge Telemetry Matrix
              </h2>
              <span className="text-[11px] font-mono text-[#016D5D] bg-[#E6F4F1] px-2 py-0.5 rounded font-bold">
                3 Synchronized Sites
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live edge cluster status, active finding volumes, and transmission latency across geographic zones
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 bg-[#F4F4F4] px-2.5 py-1 rounded-md">
            Edge sync: &lt;14.2ms
          </span>
        </div>

        {/* 3 Facility Cards Grid with Rich Colored Formula */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Site 1: Chennai Facility (70% Volume, High Activity) */}
          <div className="p-4 rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-900">Chennai Facility</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  70% Volume
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900">14</span>
                <span className="text-xs text-neutral-500">findings today</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px] font-mono text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Edge Latency:</span>
                  <span className="font-bold text-[#016D5D]">12.1 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Camera Nodes:</span>
                  <span className="font-bold text-neutral-800">8 online · 1 drop</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Primary Anomaly:</span>
                  <span className="font-bold text-amber-700 truncate max-w-[130px]">Godown CAM drops (9)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectSite ? onSelectSite('chennai') : onNavigateToFindings()}
              className="mt-3 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-amber-200/60 cursor-pointer"
            >
              <span>Filter Chennai findings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Site 2: Munich Facility (20% Volume, Dark Spot Attention) */}
          <div className="p-4 rounded-xl border border-red-200/90 bg-gradient-to-br from-red-50/70 via-white to-rose-50/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-900">Munich Facility</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  20% Volume
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900">4</span>
                <span className="text-xs text-neutral-500">findings today</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px] font-mono text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Edge Latency:</span>
                  <span className="font-bold text-[#016D5D]">15.8 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Camera Nodes:</span>
                  <span className="font-bold text-neutral-800">5 online · 1 dark</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Primary Anomaly:</span>
                  <span className="font-bold text-red-700 truncate max-w-[130px]">Corridor Area (740h)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectSite ? onSelectSite('munich') : onNavigateToFindings()}
              className="mt-3 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-red-200/60 cursor-pointer"
            >
              <span>Filter Munich findings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Site 3: Singapore Hub (10% Volume, 100% Nominal) */}
          <div className="p-4 rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-900">Singapore Hub</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  100% Nominal
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900">2</span>
                <span className="text-xs text-neutral-500">findings today</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px] font-mono text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Edge Latency:</span>
                  <span className="font-bold text-[#016D5D]">8.9 ms (Fastest)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Camera Nodes:</span>
                  <span className="font-bold text-neutral-800">2 / 2 online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Operational Health:</span>
                  <span className="font-bold text-emerald-700">Zero open alarms</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectSite ? onSelectSite('singapore') : onNavigateToFindings()}
              className="mt-3 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-emerald-200/60 cursor-pointer"
            >
              <span>Filter Singapore findings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        SECTION 8: SIGNALS TO WATCH
        (Colored intelligence cards with direct operational action triggers)
        ==================================================
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#000000]">
            Signals to watch
          </h2>
          <p className="text-xs text-neutral-500">
            AI-identified macro patterns and operational recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signal 1: Coverage (Soft Amber Card) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-200 hover:border-amber-400 transition-colors space-y-2 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                  Coverage Alert
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xs font-bold text-neutral-900 mt-2">
                Corridor Area offline for 740 hours
              </div>
              <div className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                Dispatch technician to check PoE switch on Hub 2. Persistent blindspot in secondary egress.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onTriggerReconnect) onTriggerReconnect('Corridor Area');
              }}
              className="mt-2 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-amber-200/80 cursor-pointer"
            >
              <span>Reconnect Switch Port</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Signal 2: Watch (Soft Teal Card) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#E6F4F1]/80 via-white to-[#F0FAF8] border border-[#016D5D]/25 hover:border-[#016D5D] transition-colors space-y-2 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#016D5D] text-[#00E9C9] font-bold uppercase">
                  Telemetry Watch
                </span>
                <Activity className="w-4 h-4 text-[#016D5D]" />
              </div>
              <div className="text-xs font-bold text-neutral-900 mt-2">
                Godown is your busiest camera
              </div>
              <div className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                Drove 55% of all findings today (11 of 20). Review sensitivity threshold on Godown CAM-02.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const f = findings.find((x) => x.id === 'FND-1044');
                if (f) onSelectFinding(f);
              }}
              className="mt-2 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-[#016D5D]/20 cursor-pointer"
            >
              <span>Inspect Godown CAM-02</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Signal 3: Pattern (Soft Blue Card) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/30 border border-blue-200 hover:border-blue-400 transition-colors space-y-2 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                  Pattern Anomaly
                </span>
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs font-bold text-neutral-900 mt-2">
                Camera offline is the most common finding
              </div>
              <div className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                Accounts for 45% of total detections. Run network diagnostics across Godown VLAN switch infrastructure.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onTriggerReconnect) onTriggerReconnect('Godown Storage');
              }}
              className="mt-2 text-xs font-bold text-[#016D5D] hover:underline flex items-center justify-between pt-2 border-t border-blue-200/80 cursor-pointer"
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
        {/* How it distributed (7 Columns) - With Stacked Color Distribution Bar */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#000000]">
                How it distributed
              </h2>
              <p className="text-xs text-neutral-500">
                Category proportion across today's 20 findings
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 bg-[#F4F4F4] px-2 py-0.5 rounded">
              20 Total Events
            </span>
          </div>

          {/* High-Impact Segmented Stack Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex shadow-2xs">
            <div className="h-full bg-amber-500 w-[45%]" title="Camera offline: 45%" />
            <div className="h-full bg-[#016D5D] w-[45%]" title="Phone use: 45%" />
            <div className="h-full bg-red-600 w-[5%]" title="Intrusion: 5%" />
            <div className="h-full bg-rose-800 w-[5%]" title="Too many people: 5%" />
          </div>

          <div className="space-y-3 pt-1">
            {/* Category 1: Camera offline */}
            <div className="p-3.5 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-500/15 via-amber-50/50 to-white shadow-2xs border-l-4 border-l-amber-500 space-y-2 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-bold text-neutral-900">Camera offline</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">45% of total</span>
                  <span className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">9 findings</span>
                  <span className="text-amber-800 text-[10px] bg-amber-100 px-2 py-0.5 rounded-md font-bold">+850%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                <div className="w-[45%] h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
              </div>
            </div>

            {/* Category 2: Phone use */}
            <div className="p-3.5 rounded-xl border border-[#016D5D]/30 bg-gradient-to-r from-[#016D5D]/15 via-[#E6F4F1]/60 to-white shadow-2xs border-l-4 border-l-[#016D5D] space-y-2 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E9C9] animate-pulse" />
                  <span className="font-bold text-neutral-900">Phone use</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">45% of total</span>
                  <span className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">9 findings</span>
                  <span className="text-[#016D5D] text-[10px] bg-[#8FF2E2]/40 px-2 py-0.5 rounded-md font-bold">New</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                <div className="w-[45%] h-full bg-gradient-to-r from-[#016D5D] to-[#00E9C9] rounded-full" />
              </div>
            </div>

            {/* Category 3: Intrusion */}
            <div className="p-3.5 rounded-xl border border-red-200/90 bg-gradient-to-r from-red-500/15 via-rose-50/50 to-white shadow-2xs border-l-4 border-l-red-600 space-y-2 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="font-bold text-neutral-900">Intrusion</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">5% of total</span>
                  <span className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">1 finding</span>
                  <span className="text-red-700 text-[10px] bg-red-100 px-2 py-0.5 rounded-md font-bold">Critical</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                <div className="w-[5%] h-full bg-red-600 rounded-full" />
              </div>
            </div>

            {/* Category 4: Too many people */}
            <div className="p-3.5 rounded-xl border border-purple-200/90 bg-gradient-to-r from-purple-500/15 via-purple-50/50 to-white shadow-2xs border-l-4 border-l-purple-600 space-y-2 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="font-bold text-neutral-900">Too many people</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neutral-500">5% of total</span>
                  <span className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">1 finding</span>
                  <span className="text-purple-700 text-[10px] bg-purple-100 px-2 py-0.5 rounded-md font-bold">Critical</span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                <div className="w-[5%] h-full bg-purple-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Trends & comparisons (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#000000]">
              Trends & comparisons
            </h2>
            <p className="text-xs text-neutral-500">
              Operational period deltas vs previous 24h
            </p>
          </div>

          <div className="space-y-3">
            {/* Trend 1: Phone use */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#E6F4F1] via-white to-teal-50/30 border border-[#016D5D]/25 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
              <div>
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E9C9]" />
                  Phone use newly active
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Detector deployed at 08:00 AM shift
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-[#016D5D]">0 → 9</div>
                <div className="text-[10px] text-neutral-500">findings</div>
              </div>
            </div>

            {/* Trend 2: Critical threats */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 via-white to-rose-50/40 border border-red-200 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
              <div>
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  Critical threats elevated
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Server vault & Zone C crowd breach
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-red-600">2 critical</div>
                <div className="text-[10px] text-neutral-500">vs 0 yesterday</div>
              </div>
            </div>

            {/* Trend 3: Camera concentration */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-white to-orange-50/40 border border-amber-200 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
              <div>
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Camera concentration
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Godown drove 55% of all findings
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-neutral-900">11 of 20</div>
                <div className="text-[10px] text-neutral-500">55% volume</div>
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
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#000000]">
                Findings by camera
              </h2>
              <p className="text-xs text-neutral-500">
                Detailed telemetry breakdown by stream source
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 bg-[#F4F4F4] px-2 py-0.5 rounded">
              6 cameras active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[10px] font-mono uppercase text-neutral-600">
                  <th className="pb-2 font-bold">Camera</th>
                  <th className="pb-2 font-bold">Total</th>
                  <th className="pb-2 font-bold">vs Prior</th>
                  <th className="pb-2 font-bold">Most Common</th>
                  <th className="pb-2 font-bold">Critical</th>
                  <th className="pb-2 font-bold">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {/* Godown */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Godown</td>
                  <td className="py-2.5 font-mono font-bold text-[#016D5D]">11</td>
                  <td className="py-2.5 font-mono text-amber-800 font-bold">+550%</td>
                  <td className="py-2.5 text-neutral-700">Camera offline</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">12m ago</td>
                </tr>

                {/* Test */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Test</td>
                  <td className="py-2.5 font-mono font-bold">4</td>
                  <td className="py-2.5 font-mono text-[#016D5D] font-bold">+100%</td>
                  <td className="py-2.5 text-neutral-700">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">45m ago</td>
                </tr>

                {/* Warehouse */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Warehouse</td>
                  <td className="py-2.5 font-mono font-bold">2</td>
                  <td className="py-2.5 font-mono text-neutral-500">-20%</td>
                  <td className="py-2.5 text-neutral-700">Intrusion</td>
                  <td className="py-2.5 font-mono text-red-600 font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">2h ago</td>
                </tr>

                {/* Childcare Room 3 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Childcare Room 3</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-[#016D5D] font-bold">new</td>
                  <td className="py-2.5 text-neutral-700">Too many people</td>
                  <td className="py-2.5 font-mono text-red-600 font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">3h ago</td>
                </tr>

                {/* Childcare Room 1 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Childcare Room 1</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">stable</td>
                  <td className="py-2.5 text-neutral-700">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">5h ago</td>
                </tr>

                {/* Childcare Room 2 */}
                <tr className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-2.5 font-bold text-neutral-900">Childcare Room 2</td>
                  <td className="py-2.5 font-mono font-bold">1</td>
                  <td className="py-2.5 font-mono text-neutral-500">stable</td>
                  <td className="py-2.5 text-neutral-700">Phone use</td>
                  <td className="py-2.5 font-mono text-neutral-400">0</td>
                  <td className="py-2.5 font-mono text-neutral-500">6h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detector Reliability (5 Columns) - Colored Neural Model Performance Cards */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#000000]">
                Detector reliability
              </h2>
              <p className="text-xs text-neutral-500">
                Inference confidence metrics by neural model
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#016D5D] bg-[#E6F4F1] px-2 py-0.5 rounded font-bold">
              4 Models Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Row 1: Camera offline */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/50 via-white to-orange-50/20 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Camera offline</span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">9 findings</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Confidence not recorded</span>
                <span className="text-neutral-700 font-semibold">Telemetry ping</span>
              </div>
            </div>

            {/* Row 2: Phone use */}
            <div className="p-3.5 rounded-xl border border-[#016D5D]/25 bg-gradient-to-r from-[#016D5D]/10 via-[#E6F4F1]/60 to-white space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Phone use</span>
                <span className="text-[10px] font-mono text-[#016D5D] bg-[#8FF2E2]/40 px-2 py-0.5 rounded font-bold">9 findings</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-800 font-bold">54% mean confidence</span>
                <span className="text-[#016D5D] font-bold">NV-PHONE-V1.2</span>
              </div>
              <div className="w-full h-2 bg-neutral-200/70 rounded-full overflow-hidden">
                <div className="w-[54%] h-full bg-gradient-to-r from-[#016D5D] to-[#00E9C9] rounded-full" />
              </div>
            </div>

            {/* Row 3: Intrusion */}
            <div className="p-3.5 rounded-xl border border-red-200/90 bg-gradient-to-r from-red-500/10 via-rose-50/60 to-white space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Intrusion</span>
                <span className="text-[10px] font-mono text-red-600 bg-red-100 px-2 py-0.5 rounded font-bold">1 finding · 1 critical</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 font-bold">89% confidence</span>
                <span className="text-neutral-600 font-semibold">NV-INTRUSION-V3.8</span>
              </div>
              <div className="w-full h-2 bg-neutral-200/70 rounded-full overflow-hidden">
                <div className="w-[89%] h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
              </div>
            </div>

            {/* Row 4: Too many people */}
            <div className="p-3.5 rounded-xl border border-purple-200/90 bg-gradient-to-r from-purple-500/10 via-purple-50/60 to-white space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Too many people</span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-100 px-2 py-0.5 rounded font-bold">1 finding · 1 critical</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-700 font-bold">100% confidence</span>
                <span className="text-neutral-600 font-semibold">NV-CROWD-V2.6</span>
              </div>
              <div className="w-full h-2 bg-neutral-200/70 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
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
