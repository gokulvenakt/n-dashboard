import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Camera,
  Cpu,
  Wifi,
  Sliders,
  ShieldCheck,
  Maximize2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CameraStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraName: string;
  onOpenFindings?: (cameraName: string) => void;
}

export const CameraStreamModal: React.FC<CameraStreamModalProps> = ({
  isOpen,
  onClose,
  cameraName,
  onOpenFindings,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  // Determine site & zone based on camera name
  const isMunich = cameraName.includes('Corridor') || cameraName.includes('Second');
  const isSingapore = cameraName.includes('Loading') || cameraName.includes('Counter');
  const site = isMunich ? 'Munich Facility (MUC-02)' : isSingapore ? 'Singapore Hub (SIN-03)' : 'Chennai Facility (CHN-01)';
  const zone = cameraName.includes('Parking') ? 'Exterior Perimeter Zone' : cameraName.includes('Warehouse') ? 'Main Logistics Bay' : 'Facility Interior';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-neutral-900">{cameraName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="text-[11px] font-mono text-neutral-500">
                {site} · {zone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-[#0F172A] flex items-center justify-center overflow-hidden">
          {/* Subtle Scanlines & Noise */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

          {/* SVG Camera Background */}
          <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
            {/* Background wall & floor */}
            <rect width="640" height="180" fill="#1E293B" />
            <polygon points="0,180 640,180 640,360 0,360" fill="#334155" />
            {/* Perspective grid lines */}
            <line x1="80" y1="180" x2="0" y2="360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="200" y1="180" x2="140" y2="360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="320" y1="180" x2="320" y2="360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="440" y1="180" x2="500" y2="360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="560" y1="180" x2="640" y2="360" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

            {/* Simulated Persons / Objects */}
            <g transform="translate(260, 150)">
              {/* Person Silhouette */}
              <ellipse cx="25" cy="18" rx="8" ry="9" fill="#64748B" />
              <path d="M 12 30 Q 25 24 38 30 L 40 85 L 10 85 Z" fill="#475569" />
              {/* AI Bounding Box */}
              <rect x="5" y="5" width="40" height="85" fill="none" stroke="#00E9C9" strokeWidth="1.5" strokeDasharray="6 2" />
              <rect x="5" y="-10" width="70" height="14" fill="#016D5D" rx="2" />
              <text x="8" y="0" fill="#fff" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">
                PERSON 98.4%
              </text>
            </g>
          </svg>

          {/* OSD Top-Left: Camera ID & Live Timestamp */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{cameraName.toUpperCase()}</span>
            <span className="text-white/40">|</span>
            <span className="text-neutral-300">{currentTime || '2026-10-02 12:08:00 UTC'}</span>
          </div>

          {/* OSD Top-Right: Resolution & Framerate */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[11px] font-mono border border-white/10 flex items-center gap-2">
            <span className="text-white">1080P</span>
            <span className="text-white/40">·</span>
            <span>30 FPS</span>
            <span className="text-white/40">·</span>
            <span>4.2 Mbps</span>
          </div>

          {/* OSD Bottom-Left: Active AI Detectors */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className="bg-[#016D5D]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-[#00E9C9]/30 font-medium">
              OCCUPANCY
            </span>
            <span className="bg-[#016D5D]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20 font-medium">
              TRIPWIRE ACTIVE
            </span>
            <span className="bg-black/60 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
              12.4ms Latency
            </span>
          </div>
        </div>

        {/* Telemetry & Controls Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-600">
            <div>
              <span className="text-neutral-400">Stream: </span>
              <span className="font-semibold text-neutral-800">rtsp://edge-02.internal/h264</span>
            </div>
            <div>
              <span className="text-neutral-400">Uptime: </span>
              <span className="font-semibold text-emerald-700">99.98%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenFindings) onOpenFindings(cameraName);
                onClose();
              }}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#E5E7EB] rounded text-xs font-medium transition-colors cursor-pointer"
            >
              Filter Findings for Camera
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#016D5D] hover:bg-[#01584b] text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
