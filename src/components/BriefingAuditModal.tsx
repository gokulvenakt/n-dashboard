import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Camera,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Finding } from '../types/findings';

interface BriefingAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

export const BriefingAuditModal: React.FC<BriefingAuditModalProps> = ({
  isOpen,
  onClose,
  findings,
  onSelectFinding,
}) => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'human' | 'critical'>('all');

  if (!isOpen) return null;

  // 20 items representing today's events
  const auditEvents = [
    {
      id: 'EVT-01',
      time: '12:08 PM',
      camera: 'Office Hot Desks',
      site: 'Chennai Facility',
      title: 'Phone use detected for 5 seconds',
      reviewType: 'AI reviewed',
      classification: 'Autonomous Daily Summary Log',
      reviewer: 'Nevrixa Core Agent',
      isCritical: false,
    },
    {
      id: 'EVT-02',
      time: '11:42 AM',
      camera: 'Godown Storage Bay 4',
      site: 'Chennai Facility',
      title: 'Camera offline heartbeat drop (14s)',
      reviewType: 'AI reviewed',
      classification: 'Transient Switch Buffer Reset',
      reviewer: 'Nevrixa Edge Health Monitor',
      isCritical: false,
    },
    {
      id: 'EVT-03',
      time: '11:15 AM',
      camera: 'Office Breakout Area',
      site: 'Munich Facility',
      title: 'Phone interaction logged',
      reviewType: 'Human reviewed',
      classification: 'Approved Break Period',
      reviewer: 'Arun Kumar (SecOps Lead)',
      isCritical: false,
    },
    {
      id: 'EVT-04',
      time: '10:48 AM',
      camera: 'Main Assembly Hall South',
      site: 'Chennai Facility',
      title: 'Crowd density reached 14 (limit 8)',
      reviewType: 'Human reviewed',
      classification: 'Safety Protocol Choke Alert',
      reviewer: 'Arun Kumar (SecOps Lead)',
      isCritical: true,
    },
    {
      id: 'EVT-05',
      time: '10:42 AM',
      camera: 'Breakout West Seating',
      site: 'Munich Facility',
      title: 'Unattended mobile phone lifted from desk',
      reviewType: 'Human reviewed',
      classification: 'Theft Investigation Opened',
      reviewer: 'Marcus Weber (Site Security)',
      isCritical: true,
    },
    {
      id: 'EVT-06',
      time: '10:35 AM',
      camera: 'Warehouse Corridor 3 East',
      site: 'Chennai Facility',
      title: 'Person fallen onto floor (immobile 35s)',
      reviewType: 'Human reviewed',
      classification: 'Medical Dispatch Cleared',
      reviewer: 'First Responder Team',
      isCritical: true,
    },
    {
      id: 'EVT-07',
      time: '10:15 AM',
      camera: 'Server Vault Entrance Door',
      site: 'Chennai Facility',
      title: 'Perimeter tripwire crossed without card',
      reviewType: 'Human reviewed',
      classification: 'Unbadged Entry Verified',
      reviewer: 'SecOps Gate Lead',
      isCritical: true,
    },
    {
      id: 'EVT-08',
      time: '09:58 AM',
      camera: 'Battery Room Overhead East',
      site: 'Singapore Hub',
      title: 'Optical flame chromatic oscillation',
      reviewType: 'Human reviewed',
      classification: 'Thermal Calibration Check',
      reviewer: 'Tan Wei (Facility Ops)',
      isCritical: true,
    },
    {
      id: 'EVT-09',
      time: '09:44 AM',
      camera: 'Loading Bay 2 External Gate',
      site: 'Dallas Logistics',
      title: 'Physical altercation and struggle',
      reviewType: 'Human reviewed',
      classification: 'Security Intercom Addressed',
      reviewer: 'Patrol Dispatch',
      isCritical: false,
    },
    {
      id: 'EVT-10',
      time: '09:20 AM',
      camera: 'Hazardous Waste Staging Bay',
      site: 'Munich Facility',
      title: 'Bin displaced 3.8m outside yellow line',
      reviewType: 'AI reviewed',
      classification: 'Custodial Work Order Logged',
      reviewer: 'Nevrixa Compliance Agent',
      isCritical: false,
    },
    {
      id: 'EVT-11',
      time: '09:05 AM',
      camera: 'Ground Floor Grand Lobby Ramp',
      site: 'Chennai Facility',
      title: 'Unattended toddler near forklift ramp',
      reviewType: 'Human reviewed',
      classification: 'Guardian Located at Turnstile',
      reviewer: 'Lobby Attendant',
      isCritical: false,
    },
    {
      id: 'EVT-12',
      time: '08:50 AM',
      camera: 'Godown Storage Bay 4',
      site: 'Chennai Facility',
      title: 'Phone use at packaging line',
      reviewType: 'AI reviewed',
      classification: 'Autonomous Daily Summary Log',
      reviewer: 'Nevrixa Core Agent',
      isCritical: false,
    },
    {
      id: 'EVT-13',
      time: '08:30 AM',
      camera: 'Test Camera Node 01',
      site: 'Chennai Facility',
      title: 'Phone interaction logged',
      reviewType: 'AI reviewed',
      classification: 'Autonomous Daily Summary Log',
      reviewer: 'Nevrixa Core Agent',
      isCritical: false,
    },
    {
      id: 'EVT-14',
      time: '08:15 AM',
      camera: 'Godown Storage Bay 4',
      site: 'Chennai Facility',
      title: 'Camera offline transient ping timeout',
      reviewType: 'AI reviewed',
      classification: 'Reviewed, classified & logged',
      reviewer: 'Nevrixa Edge Health Monitor',
      isCritical: false,
    },
    {
      id: 'EVT-15',
      time: '07:45 AM',
      camera: 'Childcare Room 1',
      site: 'Singapore Hub',
      title: 'Staff phone interaction logged',
      reviewType: 'Human reviewed',
      classification: 'Operational Shift Check',
      reviewer: 'Sarah Jenkins',
      isCritical: false,
    },
    {
      id: 'EVT-16',
      time: '07:15 AM',
      camera: 'Childcare Room 2',
      site: 'Singapore Hub',
      title: 'Staff phone interaction logged',
      reviewType: 'Human reviewed',
      classification: 'Operational Shift Check',
      reviewer: 'Sarah Jenkins',
      isCritical: false,
    },
    {
      id: 'EVT-17',
      time: '06:40 AM',
      camera: 'Godown Storage Bay 4',
      site: 'Chennai Facility',
      title: 'Camera offline momentary drop',
      reviewType: 'AI reviewed',
      classification: 'Reviewed, classified & logged',
      reviewer: 'Nevrixa Edge Health Monitor',
      isCritical: false,
    },
    {
      id: 'EVT-18',
      time: '05:30 AM',
      camera: 'Parking Area North',
      site: 'Munich Facility',
      title: 'Perimeter vehicle entry outside shift',
      reviewType: 'Human reviewed',
      classification: 'Scheduled Delivery Matched',
      reviewer: 'Night Desk Guard',
      isCritical: false,
    },
    {
      id: 'EVT-19',
      time: '03:15 AM',
      camera: 'Counter Reception East',
      site: 'Chennai Facility',
      title: 'Cleaning crew motion detected',
      reviewType: 'Human reviewed',
      classification: 'Contractor Badge Logged',
      reviewer: 'Automated Shift Gate',
      isCritical: false,
    },
    {
      id: 'EVT-20',
      time: '01:05 AM',
      camera: 'Loading Bay 1',
      site: 'Munich Facility',
      title: 'Exterior illumination drop',
      reviewType: 'Human reviewed',
      classification: 'Scheduled Night Dimming',
      reviewer: 'Facilities Lead',
      isCritical: false,
    },
  ];

  const filteredEvents = auditEvents.filter((evt) => {
    if (filter === 'ai') return evt.reviewType === 'AI reviewed';
    if (filter === 'human') return evt.reviewType === 'Human reviewed';
    if (filter === 'critical') return evt.isCritical;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-neutral-900">
                  Today's Operational Review Audit
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#E6F4F1] text-[#016D5D] font-semibold border border-[#016D5D]/20">
                  20 of 20 Reviewed
                </span>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                Friday, October 2 · Autonomous Perception & Human Governance Stream
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-[#E5E7EB] bg-white flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Events (20)
            </button>
            <button
              type="button"
              onClick={() => setFilter('ai')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'ai' ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Handled by Nevrixa (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('human')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'human' ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Reviewed by Person (14)
            </button>
            <button
              type="button"
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'critical' ? 'bg-red-600 text-white font-semibold' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Critical Only (2)
            </button>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 hidden sm:block">
            Showing {filteredEvents.length} events
          </div>
        </div>

        {/* Chronological Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-[#F0F0F0]">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="pt-2 pb-2 flex items-center justify-between gap-4 hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-semibold text-neutral-600 w-16 shrink-0">
                  {evt.time}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 truncate">
                      {evt.title}
                    </span>
                    {evt.isCritical && (
                      <span className="text-[9px] font-mono uppercase bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                        Critical
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {evt.camera} · {evt.site}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium border ${
                      evt.reviewType === 'AI reviewed'
                        ? 'bg-[#E6F4F1] text-[#016D5D] border-[#016D5D]/20'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {evt.reviewType}
                  </span>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {evt.reviewer}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const matchedFinding = findings.find(
                      (f) =>
                        f.title.toLowerCase().includes(evt.title.toLowerCase().substring(0, 10)) ||
                        f.camera.name.toLowerCase().includes(evt.camera.toLowerCase().substring(0, 8))
                    ) || findings[0];
                    onSelectFinding(matchedFinding);
                    onClose();
                  }}
                  className="p-1 text-neutral-400 hover:text-[#016D5D] hover:bg-[#E6F4F1] rounded transition-colors cursor-pointer"
                  title="Inspect finding evidence"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-1.5 text-[#016D5D]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All 20 events verified and indexed</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#016D5D] hover:bg-[#01584b] text-white rounded font-semibold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
