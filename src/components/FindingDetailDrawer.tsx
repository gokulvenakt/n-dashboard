import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldX,
  AlertOctagon,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { Finding, FindingStatus } from '../types/findings';
import { CCTVPlayer } from './CCTVPlayer';
import { HorizontalTimeline } from './HorizontalTimeline';

interface FindingDetailDrawerProps {
  finding: Finding | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: FindingStatus) => void;
  onAddNote?: (findingId: string, noteText: string) => void;
  onCreateAutomation?: (finding: Finding) => void;
  onEscalate: (finding: Finding) => void;
}

export const FindingDetailDrawer: React.FC<FindingDetailDrawerProps> = ({
  finding,
  onClose,
  onUpdateStatus,
  onAddNote,
  onCreateAutomation,
  onEscalate,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<{
    title: string;
    time: string;
    date?: string;
    timeSec: number;
    location?: string;
  } | null>(null);

  // Close on Escape keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!finding) return null;

  const isCritical = finding.severity === 'CRITICAL' || finding.statusCategory === 'CRITICAL';
  const isHigh = finding.severity === 'HIGH' || finding.statusCategory === 'ATTENTION';

  const severityBadgeClass = isCritical
    ? 'text-red-700 bg-red-50 border-red-300 font-bold'
    : isHigh
    ? 'text-amber-800 bg-amber-50 border-amber-300 font-semibold'
    : 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/25 font-semibold';

  const handleCopyId = () => {
    navigator.clipboard?.writeText(finding.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  return (
    <>
      {/* 
        SOLID DARK BACKDROP OVERLAY
        Completely covers background and prevents any visual data merging, bleed-through, or interaction
      */}
      <div 
        className="fixed inset-0 bg-neutral-950/70 z-50 transition-opacity cursor-pointer animate-in fade-in duration-200"
        onClick={onClose}
        title="Click backdrop to close"
        aria-hidden="true"
      />

      {/* 
        ISOLATED SLIDE-IN INVESTIGATION DRAWER
        100% opaque solid white background (#ffffff), crisp borders, high contrast
      */}
      <div 
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[680px] md:w-[760px] lg:w-[860px] bg-white border-l border-neutral-300 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-text"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================
            1. DRAWER HEADER: Finding Title, Badges, Status & Close
           ======================================================== */}
        <div className="h-16 px-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Severity Pill */}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${severityBadgeClass}`}>
              {finding.severity}
            </span>

            {/* Finding ID with quick copy */}
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
              title="Click to copy Finding ID"
            >
              <span>{finding.id}</span>
              {copiedId ? <Check className="w-3 h-3 text-[#016D5D]" /> : <Copy className="w-3 h-3 text-neutral-400" />}
            </button>

            <span className="text-neutral-300">·</span>

            {/* Site & Camera Location */}
            <span className="text-xs font-semibold text-neutral-900 truncate">
              {finding.site}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Status Dropdown before close icon: Need Review, Under Review, Confirmed, Resolved, Dismissed */}
            <div className="relative">
              <select
                value={finding.status}
                onChange={(e) => onUpdateStatus(finding.id, e.target.value as FindingStatus)}
                className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg bg-[#E6F4F1] text-[#016D5D] border border-[#016D5D]/30 shadow-2xs hover:border-[#016D5D] focus:outline-none focus:ring-1 focus:ring-[#016D5D] cursor-pointer transition-colors"
                title="Change incident status"
              >
                <option value="NEEDS_REVIEW">Need Review</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
              title="Close panel (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            VERTICAL SCROLLER IN SLIDER
           ======================================================== */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
          {/* ========================================================
              1. CCTV VIDEO PLAYER VIEWPORT: Real Video with Person Movement
              Includes control bar: play, pause, timeline, speed, zoom, clip
             ======================================================== */}
          <div className="bg-neutral-950 p-3 sm:p-4 border-b border-neutral-300">
            <CCTVPlayer 
              finding={finding} 
              autoPlay={true}
              seekTime={seekTime}
              activeMilestone={activeMilestone}
            />
          </div>

          {/* ========================================================
              2. INCIDENT HORIZONTAL TIMELINE (Directly Beneath CCTV Video)
              Displays 4 chronological milestones:
              - Where Detected with Time (14:27:39 UTC)
              - Confirmed the Detection with Time (14:28:09 UTC)
              - Altered from Whom with Time (14:28:24 UTC)
              - Clip Saved Data and Time (Oct 01, 2026 14:28:24 UTC)
             ======================================================== */}
          <div className="p-3 sm:p-4 bg-[#F4F4F4]">
            <HorizontalTimeline 
              finding={finding} 
              onSelectMilestone={(m) => {
                setActiveMilestone(m);
                setSeekTime(m.timeSec);
              }}
              onSeekTime={(t) => setSeekTime(t)}
            />
          </div>
        </div>

        {/* ========================================================
            3. DRAWER FOOTER ACTION BAR
            Confirm Finding, Escalate, Dismiss, Resolve (aligned on the same side, Create Rule removed)
           ======================================================== */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex flex-wrap items-center justify-end gap-2.5 shrink-0">
          {/* Confirm Finding */}
          <button
            type="button"
            onClick={() => onUpdateStatus(finding.id, 'CONFIRMED')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#00E9C9]" />
            <span>Confirm Finding</span>
          </button>

          {/* Escalate */}
          <button
            type="button"
            onClick={() => onEscalate(finding)}
            className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span>Escalate</span>
          </button>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => onUpdateStatus(finding.id, 'DISMISSED')}
            className="px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldX className="w-4 h-4 text-neutral-500" />
            <span>Dismiss</span>
          </button>

          {/* Resolve */}
          <button
            type="button"
            onClick={() => onUpdateStatus(finding.id, 'RESOLVED')}
            className="px-3.5 py-2 text-xs font-semibold text-[#016D5D] bg-[#E6F4F1] hover:bg-[#8FF2E2]/50 border border-[#016D5D]/20 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#016D5D]" />
            <span>Resolve</span>
          </button>
        </div>
      </div>
    </>
  );
};
