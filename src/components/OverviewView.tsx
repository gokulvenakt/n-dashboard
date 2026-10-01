import React from 'react';
import { Finding } from '../types/findings';
import {
  TrendingUp,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Activity,
  ArrowUpRight,
  Sparkles,
  Workflow,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface OverviewViewProps {
  findings: Finding[];
  onNavigateToFindings: () => void;
  onSelectFinding: (finding: Finding) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  findings,
  onNavigateToFindings,
  onSelectFinding,
}) => {
  return (
    <div className="space-y-5">
      {/* Perception -> Understanding -> Action Operational Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#016D5D]">
              <Sparkles className="w-3.5 h-3.5 text-[#00E9C9]" />
              NEVRIXA OPERATIONAL ARCHITECTURE
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mt-1">
              Perception → Understanding → Action
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
              Real-time video edge inference translating multi-camera telemetry into verified operational insights and automated facility response.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToFindings}
            className="self-start md:self-center px-4 py-2 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Open Findings Feed</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* The 3 Pillars Graphic Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-100 text-xs">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
              01 · PERCEPTION
            </span>
            <span className="font-semibold text-neutral-900 block mt-0.5">Edge Vision Backbone</span>
            <p className="text-[11px] text-neutral-600 mt-1">
              142 camera streams processed at 60 FPS with 14.2ms edge inference latency across 4 sites.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[10px] font-mono font-bold text-[#016D5D] uppercase block">
              02 · UNDERSTANDING
            </span>
            <span className="font-semibold text-neutral-900 block mt-0.5">Spatial & Context Fusion</span>
            <p className="text-[11px] text-neutral-600 mt-1">
              Fusing optical vector tracking with badge access logs, schedules, and restricted zones.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[10px] font-mono font-bold text-neutral-800 uppercase block">
              03 · ACTION
            </span>
            <span className="font-semibold text-neutral-900 block mt-0.5">Automated Workflows</span>
            <p className="text-[11px] text-neutral-600 mt-1">
              Instant physical interlock lockouts, security radio dispatch, and automated compliance retention.
            </p>
          </div>
        </div>
      </div>

      {/* KPI & Health Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
            Online Cameras
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-neutral-900">142</span>
            <span className="text-xs text-[#016D5D] font-mono font-semibold">/ 142 (100%)</span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Zero edge frame drops in 24h</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
            AI Precision Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#016D5D]">96.8%</span>
            <span className="text-xs text-[#016D5D] font-mono font-semibold">↑ +1.2%</span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Verified by operator confirmations</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
            Active Automations
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-neutral-900">18</span>
            <span className="text-xs text-neutral-500 font-mono">Rules</span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">4 triggered today</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
            Mean Response Time
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-neutral-900">42s</span>
            <span className="text-xs text-[#016D5D] font-mono font-semibold">Target &lt;60s</span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">From detection to guard response</span>
        </div>
      </div>

      {/* Recent Detections Preview */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Recent Critical Detections
          </h3>
          <button
            type="button"
            onClick={onNavigateToFindings}
            className="text-xs font-semibold text-[#016D5D] hover:underline"
          >
            View all {findings.length} findings →
          </button>
        </div>

        <div className="space-y-2">
          {findings.slice(0, 4).map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFinding(f)}
              className="p-3 rounded border border-neutral-200 hover:border-[#016D5D] hover:bg-neutral-50 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${f.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-[#016D5D]'}`} />
                <div className="min-w-0">
                  <span className="font-semibold text-neutral-900 block truncate">{f.title}</span>
                  <span className="text-[11px] text-neutral-500">{f.subtitle} · {f.site}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-right">
                <span className="font-mono text-neutral-700">{f.timestamp}</span>
                <span className="font-mono font-semibold text-[#016D5D]">{f.confidence.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
