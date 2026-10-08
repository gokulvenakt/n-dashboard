import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  UserCheck,
  FileCheck2,
  Clock,
  Calendar,
  Play,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { Finding } from '../types/findings';

export interface TimelineMilestone {
  id: number;
  title: string;
  time: string;
  date: string;
  timeSec: number;
  mainInfo: string;
  supportingContext: string;
  badge: string;
  badgeColor: string;
  markerBg: string;
  markerRing: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetry: {
    label: string;
    value: string;
  }[];
}

interface HorizontalTimelineProps {
  finding: Finding;
  onSelectMilestone?: (milestone: TimelineMilestone) => void;
  onSeekTime?: (timeSec: number) => void;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  finding,
  onSelectMilestone,
  onSeekTime,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number>(0);
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Exact 4 Chronological Timeline Milestones as specified:
  // EVENT 01 — WHERE DETECTED
  // EVENT 02 — CONFIRMED THE DETECTION
  // EVENT 03 — ALTERED FROM WHOM
  // EVENT 04 — CLIP SAVED
  const milestones: TimelineMilestone[] = [
    {
      id: 0,
      title: 'Where Detected with Time',
      time: '14:27:39 UTC',
      date: 'Oct 01, 2026',
      timeSec: 1.2,
      mainInfo: finding.camera.zone || 'Zone C — Assembly Line 02',
      supportingContext: 'Physical Facility · Camera Zone',
      badge: 'INITIAL AI DETECTION',
      badgeColor: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30',
      markerBg: 'bg-[#016D5D]',
      markerRing: 'ring-[#00E9C9]/50',
      icon: MapPin,
      telemetry: [
        { label: 'Physical Facility', value: finding.site },
        { label: 'Camera Zone', value: finding.camera.zone || 'Zone C — Assembly Line 02' },
        { label: 'Camera Stream', value: `${finding.camera.id} (${finding.camera.name})` },
        { label: 'Initial Detection Timecode', value: '14:27:39 UTC' },
      ],
    },
    {
      id: 1,
      title: 'Confirmed the Detection with Time',
      time: '14:28:09 UTC',
      date: 'Oct 01, 2026',
      timeSec: 4.8,
      mainInfo: finding.detectionLabel || 'Limit Exceeded',
      supportingContext: `AI Match: ${finding.confidence.toFixed(1)}% · Latency: ${finding.whyDetected?.modelLatencyMs || 142} ms`,
      badge: 'AI CONFIRMED',
      badgeColor: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30',
      markerBg: 'bg-[#016D5D]',
      markerRing: 'ring-[#00E9C9]/60',
      icon: Sparkles,
      telemetry: [
        { label: 'Verification Classification', value: finding.detectionLabel || 'Limit Exceeded' },
        { label: 'AI Match Confidence', value: `${finding.confidence.toFixed(1)}%` },
        { label: 'Inference Latency', value: `${finding.whyDetected?.modelLatencyMs || 142} ms` },
        { label: 'Verification Timestamp', value: '14:28:09 UTC' },
      ],
    },
    {
      id: 2,
      title: 'Altered from Whom with Time',
      time: '14:28:24 UTC',
      date: 'Oct 01, 2026',
      timeSec: 7.2,
      mainInfo: `Altered from: ${finding.assignedTo || 'SecOps Shift Lead'}`,
      supportingContext: 'Escalation: +45s · Supervisor Triage',
      badge: 'OPERATOR ESCALATION',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-300',
      markerBg: 'bg-amber-600',
      markerRing: 'ring-amber-400/50',
      icon: UserCheck,
      telemetry: [
        { label: 'Dispatch Authority / On-Duty', value: finding.assignedTo || 'SecOps Shift Lead' },
        { label: 'Escalation Timestamp', value: '14:28:24 UTC (+45s)' },
        { label: 'Personnel on Duty', value: 'Shift Marshal R. Varma' },
        { label: 'Dispatch Action', value: 'Incident Response SOP 04-B' },
      ],
    },
    {
      id: 3,
      title: 'Clip Saved Data and Time',
      time: '14:28:24 UTC',
      date: 'Oct 01, 2026 14:28:24 UTC',
      timeSec: 11.5,
      mainInfo: `Forensic Archive: #EV-${finding.id}`,
      supportingContext: 'SHA-256 Verified · Oct 01, 2026 14:28:24 UTC',
      badge: 'ARCHIVE SECURED',
      badgeColor: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30',
      markerBg: 'bg-[#016D5D]',
      markerRing: 'ring-[#016D5D]/40',
      icon: FileCheck2,
      telemetry: [
        { label: 'Forensic Archive Clip ID', value: `#EV-${finding.id}` },
        { label: 'Cryptographic Verification', value: 'SHA-256 Seal Verified' },
        { label: 'Exact Date & Time', value: 'Oct 01, 2026 14:28:24 UTC' },
        { label: 'Compliance Status', value: 'Evidence Vault Locked' },
      ],
    },
  ];

  const currentMilestone = milestones[selectedMilestoneId];

  const handleMilestoneClick = (milestone: TimelineMilestone) => {
    setSelectedMilestoneId(milestone.id);
    if (onSelectMilestone) {
      onSelectMilestone(milestone);
    }
    if (onSeekTime) {
      onSeekTime(milestone.timeSec);
    }
  };

  const handleDownloadClip = () => {
    setDownloadSuccess(true);
    const blob = new Blob([
      `NEVRIXA FORENSIC EVIDENCE RECORD\n` +
      `Incident ID: ${finding.id}\n` +
      `Milestone: ${currentMilestone.title}\n` +
      `Timestamp: ${currentMilestone.time}\n` +
      `Archive Date: ${currentMilestone.date}\n` +
      `Verification: SHA-256 Verified\n` +
      `Location: ${finding.site} - ${finding.camera.zone}\n` +
      `Camera: ${finding.camera.id} (${finding.camera.name})`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCE-#EV-${finding.id}-OCT01.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3.5 select-none">
      {/* Top Header Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#016D5D] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#016D5D]">
            INCIDENT HORIZONTAL TIMELINE
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] font-mono text-neutral-500">
            Interactive Chronological Investigation Track
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600 bg-[#F4F4F4] px-2 py-0.5 rounded border border-neutral-200">
          <Calendar className="w-3 h-3 text-[#016D5D]" />
          <span className="font-semibold text-neutral-800">Oct 01, 2026</span>
        </div>
      </div>

      {/* 
        Horizontal Connected Timeline Rail with 4 Milestones
        Structure: Where Detected ●━━━━━━━━━●━━━━━━━━━●━━━━━━━━━● Clip Saved
      */}
      <div className="relative pt-2 pb-1 overflow-x-auto">
        {/* Background Connecting Rail Line */}
        <div className="absolute top-[28px] left-10 right-10 h-[3px] bg-neutral-200 z-0 rounded-full" />
        
        {/* Active Connected Rail Line */}
        <div 
          className="absolute top-[28px] left-10 h-[3px] bg-[#016D5D] z-0 rounded-full transition-all duration-300"
          style={{ width: `${(selectedMilestoneId / (milestones.length - 1)) * 82}%` }}
        />

        <div className="grid grid-cols-4 gap-2.5 min-w-[620px] relative z-10">
          {milestones.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMilestoneId === m.id;
            const isHovered = hoveredMilestoneId === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMilestoneClick(m)}
                onMouseEnter={() => setHoveredMilestoneId(m.id)}
                onMouseLeave={() => setHoveredMilestoneId(null)}
                className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all cursor-pointer select-none group w-full ${
                  isSelected
                    ? 'border-[#016D5D] bg-[#E6F4F1]/40 shadow-xs ring-2 ring-[#016D5D]/25'
                    : isHovered
                    ? 'border-neutral-300 bg-neutral-50/80 shadow-2xs'
                    : 'border-transparent hover:border-neutral-200 hover:bg-[#F4F4F4]/60'
                }`}
                title={`Click to seek CCTV to ${m.title} (${m.time})`}
              >
                {/* Circular Event Marker with Connecting Relationship */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 shadow-xs transition-transform group-hover:scale-110 ring-4 ${m.markerBg} ${m.markerRing} ${
                    isSelected ? 'scale-110 ring-[#00E9C9]/70 ring-offset-1' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Event Title */}
                <span className="text-xs font-bold text-neutral-900 group-hover:text-[#016D5D] transition-colors leading-tight line-clamp-1">
                  {m.title}
                </span>

                {/* Timestamp Pill */}
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono font-bold text-neutral-800 bg-white px-1.5 py-0.5 rounded border border-neutral-200 shadow-2xs">
                  <Clock className="w-2.5 h-2.5 text-[#016D5D] shrink-0" />
                  <span>{m.time}</span>
                </div>

                {/* Primary Information */}
                <span className="mt-1.5 text-[11px] font-semibold text-neutral-900 leading-tight truncate w-full block" title={m.mainInfo}>
                  {m.mainInfo}
                </span>

                {/* Compact Supporting Information */}
                <span className="text-[10px] font-mono text-neutral-500 truncate w-full block mt-0.5" title={m.supportingContext}>
                  {m.supportingContext}
                </span>

                {/* Semantic Status Badge */}
                <span className={`mt-2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        Selected Milestone Detailed Information Panel
        Shows full event information, exact telemetry, and video seek control
      */}
      <div className="p-3.5 bg-[#F4F4F4] border border-[#016D5D]/25 rounded-xl space-y-2.5 animate-in fade-in duration-150">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#016D5D] shrink-0 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  {currentMilestone.title}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#016D5D] bg-[#E6F4F1] px-2 py-0.5 rounded border border-[#016D5D]/25">
                  {currentMilestone.time}
                </span>
                <span className="text-[10px] font-mono text-neutral-600 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                  {currentMilestone.mainInfo}
                </span>
              </div>
              <span className="text-xs text-neutral-600 mt-0.5 block">
                {currentMilestone.supportingContext}
              </span>
            </div>
          </div>

          {/* Quick Actions for Selected Milestone */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedMilestoneId === 3 ? (
              <button
                type="button"
                onClick={handleDownloadClip}
                className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-[#016D5D] text-white hover:bg-[#01584b] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Download verified incident evidence clip"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Evidence Archived!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download Archive #EV-{finding.id}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSeekTime && onSeekTime(currentMilestone.timeSec)}
                className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={`Seek CCTV player to ${currentMilestone.time}`}
              >
                <Play className="w-3 h-3 fill-white text-white" />
                <span>Seek CCTV to {currentMilestone.time}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Field Detailed Operational Telemetry for Selected Milestone */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
          {currentMilestone.telemetry.map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded-lg border border-neutral-200 shadow-2xs">
              <span className="text-[9px] font-mono text-neutral-500 uppercase block leading-tight">
                {item.label}
              </span>
              <span className="text-xs font-bold font-mono text-neutral-900 truncate block mt-0.5" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
