import React, { useState } from 'react';
import {
  Check,
  Eye,
  ChevronDown,
  Copy,
} from 'lucide-react';
import { Finding, FindingStatus } from '../types/findings';
import { CCTVPlayer } from './CCTVPlayer';

interface FindingCardProps {
  finding: Finding;
  isSelected?: boolean;
  onSelect: (finding: Finding) => void;
  onUpdateStatus: (id: string, status: FindingStatus) => void;
  viewMode?: 'grid' | 'list';
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  isSelected = false,
  onSelect,
  onUpdateStatus,
  viewMode = 'grid',
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCritical = finding.severity === 'CRITICAL' || finding.statusCategory === 'CRITICAL';
  const isHigh = finding.severity === 'HIGH' || finding.statusCategory === 'ATTENTION';

  const severityBadgeClass = isCritical
    ? 'text-red-700 bg-red-50 border-red-300 font-bold'
    : isHigh
    ? 'text-amber-800 bg-amber-50 border-amber-300 font-semibold'
    : 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/25 font-semibold';

  const statusDisplay = {
    NEEDS_REVIEW: { label: 'Needs Review', color: 'text-amber-800 bg-amber-50 border-amber-300' },
    UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-800 bg-blue-50 border-blue-300' },
    CONFIRMED: { label: 'Confirmed', color: 'text-red-800 bg-red-50 border-red-300' },
    RESOLVED: { label: 'Resolved', color: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30 font-semibold' },
    DISMISSED: { label: 'Dismissed', color: 'text-neutral-600 bg-neutral-100 border-neutral-300' },
  }[finding.status];

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(finding.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // List View Rendering for dense scan lists
  if (viewMode === 'list') {
    return (
      <div
        className={`bg-white border rounded-lg p-3 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer group shadow-2xs select-none ${
          isSelected
            ? 'border-[#016D5D] ring-2 ring-[#016D5D]/20 bg-[#F9FBFA]'
            : 'border-[#E5E7EB] hover:border-neutral-300 hover:bg-neutral-50/50'
        }`}
        onClick={() => onSelect(finding)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Realistic CCTV-style video preview thumbnail */}
          <div className="w-32 aspect-video rounded overflow-hidden shrink-0 bg-neutral-900 border border-neutral-300 relative shadow-2xs">
            <CCTVPlayer finding={finding} compact autoPlay={true} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${severityBadgeClass}`}>
                {finding.severity}
              </span>
              <span className="text-xs font-mono font-bold text-neutral-800">{finding.id}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-[11px] font-mono text-neutral-500">{finding.site} · {finding.camera.id}</span>
            </div>

            <h3 className="text-sm font-bold text-neutral-900 truncate group-hover:text-[#016D5D] transition-colors">
              {finding.title}
            </h3>

            <p className="text-xs text-neutral-600 truncate mt-0.5 font-sans">
              {finding.aiInterpretation}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end text-right shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#016D5D]">
            <span>{finding.confidence.toFixed(1)}%</span>
            <span className="text-neutral-400 font-normal">match</span>
          </div>
          <span className="text-xs font-mono text-neutral-500 mt-0.5 tabular-nums">
            {finding.timestamp}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>

          <button
            type="button"
            onClick={() => onSelect(finding)}
            className="px-2.5 py-1 text-xs font-semibold text-[#016D5D] hover:text-[#015246] bg-[#E6F4F1] hover:bg-[#8FF2E2]/50 border border-[#016D5D]/20 rounded-md transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Detail View"
            aria-label="Detail View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail View</span>
          </button>
        </div>
      </div>
    );
  }

  // Strict 3-Column Grid Card: Clean Camera Card (No Timeline, Clean Detail View Footer)
  return (
    <div
      onClick={() => onSelect(finding)}
      className={`bg-white border rounded-lg overflow-hidden transition-all flex flex-col group cursor-pointer shadow-2xs select-none ${
        isSelected
          ? 'border-[#016D5D] ring-2 ring-[#016D5D]/25 shadow-sm'
          : 'border-[#E5E7EB] hover:border-neutral-400 hover:shadow-xs'
      }`}
    >
      {/* 
        1. REALISTIC CCTV-STYLE VIDEO PREVIEW
        Active surveillance video feed simulation with real person movement, OSD watermark, running timecode, and scrubber
      */}
      <div className="relative w-full aspect-video bg-[#0A0D0F] overflow-hidden border-b border-neutral-200">
        <CCTVPlayer finding={finding} compact autoPlay={true} />

        {/* Bottom Overlay: AI Detection Class & Match Confidence */}
        <div className="absolute bottom-2 inset-x-2.5 z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xs px-2 py-1 rounded border border-white/15 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] shrink-0" />
              <span className="text-[10px] font-semibold text-white truncate font-mono">
                {finding.detectionLabel}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-white tabular-nums shrink-0 ml-2">
              {finding.confidence.toFixed(1)}% match
            </span>
          </div>
        </div>
      </div>

      {/* 
        2. HIGH-DENSITY OPERATIONAL DATA
      */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Row: Severity Pill, Monospaced ID & Status */}
          <div className="flex items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${severityBadgeClass}`}>
                {finding.severity}
              </span>

              <button
                type="button"
                onClick={handleCopyId}
                className="text-[11px] font-mono font-bold text-neutral-800 hover:text-[#016D5D] bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.2 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Click to copy Finding ID"
              >
                <span>{finding.id}</span>
                {copied ? <Check className="w-2.5 h-2.5 text-[#016D5D]" /> : null}
              </button>
            </div>

            {/* Clickable Quick Status Selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded border flex items-center gap-1 transition-colors cursor-pointer ${statusDisplay.color}`}
                title="Quick status change"
              >
                <span>{statusDisplay.label}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-neutral-300 rounded-md shadow-xl z-30 py-1 text-xs">
                  {(['NEEDS_REVIEW', 'UNDER_REVIEW', 'CONFIRMED', 'RESOLVED', 'DISMISSED'] as FindingStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(finding.id, st);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 text-[11px] font-mono flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                        finding.status === st ? 'text-[#016D5D] font-bold bg-[#E6F4F1]' : 'text-neutral-700'
                      }`}
                    >
                      <span>{st.replace('_', ' ')}</span>
                      {finding.status === st && <Check className="w-3 h-3 text-[#016D5D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Finding Title & Subtitle */}
          <div className="mt-2">
            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#016D5D] transition-colors line-clamp-1">
              {finding.title}
            </h3>
            <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
              {finding.subtitle}
            </p>
          </div>

          {/* High-Density 4-Field Operational Telemetry Matrix */}
          <div className="mt-2.5 pt-2.5 border-t border-neutral-200 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {/* Field 1: Facility Site */}
            <div>
              <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Site</span>
              <span className="text-xs font-semibold text-neutral-900 truncate block mt-0.5">
                {finding.site}
              </span>
            </div>

            {/* Field 2: Camera Feed Channel */}
            <div>
              <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Camera Feed</span>
              <span className="text-xs font-mono font-medium text-neutral-900 truncate block mt-0.5">
                {finding.camera.id} / {finding.camera.name.split(' ')[0]}
              </span>
            </div>

            {/* Field 3: Detected Timestamp */}
            <div>
              <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Detected</span>
              <span className="text-xs font-mono text-neutral-800 tabular-nums block mt-0.5">
                {finding.timestamp} (48s dwell)
              </span>
            </div>

            {/* Field 4: Confidence Score with Meter */}
            <div>
              <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Confidence</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-mono font-bold text-[#016D5D] tabular-nums">
                  {finding.confidence.toFixed(1)}%
                </span>
                <div className="w-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-[#016D5D] rounded-full"
                    style={{ width: `${finding.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Operational AI Synthesis (High-value plain language briefing) */}
          <div className="mt-2.5 p-2 rounded bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 leading-snug">
            <span className="font-semibold text-neutral-900 font-mono text-[10px] uppercase block mb-0.5 text-[#016D5D]">
              AI Perception Assessment:
            </span>
            <span className="line-clamp-2">
              {finding.aiInterpretation}
            </span>
          </div>
        </div>

        {/* 
          Card Footer: Detail View Button Only
          Visually clean: AI Suggestion -> Detail View button (NO extra descriptive text between them)
        */}
        <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onSelect(finding)}
            className="px-3 py-1.5 text-xs font-semibold text-[#016D5D] hover:text-[#015246] bg-[#E6F4F1] hover:bg-[#8FF2E2]/50 border border-[#016D5D]/25 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs group/btn shrink-0"
            title="Open Detail View"
          >
            <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Detail View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
