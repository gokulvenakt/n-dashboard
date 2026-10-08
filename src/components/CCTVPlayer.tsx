import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Repeat,
  Scissors,
  Download,
  Camera as CameraIcon,
  ZoomIn,
  ZoomOut,
  Layers,
  Crosshair,
  Film,
  Gauge,
  Check,
  Maximize2,
} from 'lucide-react';
import { Finding } from '../types/findings';

interface CCTVPlayerProps {
  finding: Finding;
  compact?: boolean;
  autoPlay?: boolean;
  seekTime?: number | null;
  activeMilestone?: {
    title: string;
    time: string;
    date?: string;
    timeSec: number;
    location?: string;
  } | null;
  onNotification?: (type: 'success' | 'alert' | 'info', title: string, message?: string) => void;
}

export const CCTVPlayer: React.FC<CCTVPlayerProps> = ({
  finding,
  compact = false,
  autoPlay = true,
  seekTime,
  activeMilestone,
  onNotification,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackTime, setPlaybackTime] = useState(3.4);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [showDetection, setShowDetection] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showFilmstrip, setShowFilmstrip] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.25 = 125%, 1.5 = 150%, 2 = 200%
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);
  const duration = finding.media.durationSec || 12;

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
    if (onNotification) {
      onNotification('info', msg);
    }
  };

  // Sync seekTime and show active milestone notification if seekTime is provided externally
  useEffect(() => {
    if (seekTime !== undefined && seekTime !== null) {
      setPlaybackTime(Math.min(Math.max(seekTime, 0), duration));
      if (activeMilestone) {
        triggerToast(`Timeline Jump: ${activeMilestone.title} (${activeMilestone.time})`);
      }
    }
  }, [seekTime, activeMilestone, duration]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSec = ((now - lastTimestamp) / 1000) * playbackSpeed;
      lastTimestamp = now;

      setPlaybackTime((prev) => {
        const next = prev + deltaSec;
        if (next >= duration) {
          if (isLooping) {
            return 0; // loop
          } else {
            setIsPlaying(false);
            return duration;
          }
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, duration, playbackSpeed, isLooping]);

  // Motion calculations based on continuous time
  const tNorm = duration > 0 ? playbackTime / duration : 0;
  const cycle = Math.sin(playbackTime * 4); // walking limb cycle
  const walkPhase = Math.sin(playbackTime * 5);

  const isCritical = finding.severity === 'CRITICAL' || finding.statusCategory === 'CRITICAL';
  const boxColor = isCritical ? '#EF4444' : '#00E9C9';
  const boxBg = isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 233, 201, 0.12)';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Video Control Handlers
  const handleRewind = () => {
    setPlaybackTime((prev) => Math.max(0, prev - 5));
  };

  const handleForward = () => {
    setPlaybackTime((prev) => Math.min(duration, prev + 5));
  };

  const handleSpeedToggle = () => {
    const speeds = [0.5, 1, 2, 4];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    triggerToast(`Playback Speed: ${speeds[nextIdx]}x`);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
  };

  const handleSaveFrame = () => {
    // Generates a mock canvas snapshot PNG download
    const filename = `frame_${finding.id}_${Math.floor(playbackTime)}s.png`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="%231e293b"/><text x="20" y="40" fill="white" font-family="monospace">NEVRIXA AI CCTV CAPTURE - ' + finding.id + ' at ' + formatTime(playbackTime) + '</text></svg>';
    link.click();
    triggerToast(`Frame Saved: ${filename}`);
  };

  const handleClipOut = () => {
    const inPoint = Math.max(0, playbackTime - 2).toFixed(1);
    const outPoint = Math.min(duration, playbackTime + 4).toFixed(1);
    triggerToast(`Clip Snippet Extracted: ${inPoint}s → ${outPoint}s (#CLIP-${finding.id})`);
  };

  const handleDownloadVideo = () => {
    const filename = `recording_${finding.id}_CCTV_UHD.mp4`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = '#';
    link.click();
    triggerToast(`Exporting Video Archive: ${filename}`);
  };

  const theme = finding.media.sceneTheme;

  return (
    <div className={`relative overflow-hidden select-none group ${compact ? 'w-full h-full' : 'rounded-lg border border-neutral-300'}`}>
      {/* CCTV Viewport Container */}
      <div className={`relative w-full overflow-hidden ${compact ? 'aspect-video' : 'aspect-video max-h-[380px]'}`}>
        
        {/* ========================================================
            REALISTIC, WELL-LIT CCTV CAMERA ENVIRONMENTS WITH ACTIVE PERSON MOVEMENT
           ======================================================== */}
        <div className="absolute inset-0 w-full h-full">

          {/* 1. TOO MANY PEOPLE ON FLOOR: Realistic Bright Factory / Superstore Floor */}
          {theme === 'too_many_people' && (
            <div className="absolute inset-0 bg-[#DDE3EA] overflow-hidden">
              {/* Polished light industrial floor with reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#C8D1DC] via-[#D8DFE7] to-[#E9EEF3]" />
              
              {/* Perspective floor grid & yellow demarcated zone */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:20px_20px]" />
              
              {/* Background architectural assembly line tables / store aisles */}
              <div className="absolute top-4 inset-x-8 h-10 bg-[#B8C4D0] border-b-2 border-neutral-400 rounded-sm flex items-center justify-around px-4">
                <div className="w-16 h-3 bg-neutral-600 rounded-xs" />
                <div className="w-24 h-3 bg-neutral-500 rounded-xs" />
                <div className="w-16 h-3 bg-neutral-600 rounded-xs" />
              </div>

              {/* Yellow safety zone on floor with dashed line */}
              <div className="absolute inset-x-[15%] top-16 bottom-5 border-2 border-dashed border-amber-500 bg-amber-400/10 rounded flex items-start justify-end p-2">
                <span className="text-[8px] font-mono font-bold text-amber-900 bg-amber-300/90 px-1.5 py-0.5 rounded shadow-2xs">
                  ZONE C · CROWD CAPACITY: 8
                </span>
              </div>

              {/* 14 Animated People Walking and Mingling */}
              {[
                { baseX: 25, baseY: 38, speed: 1.2, color: '#334155' },
                { baseX: 34, baseY: 48, speed: -1.0, color: '#1E293B' },
                { baseX: 42, baseY: 32, speed: 0.8, color: '#475569' },
                { baseX: 52, baseY: 44, speed: -1.3, color: '#0F172A' },
                { baseX: 60, baseY: 36, speed: 1.1, color: '#334155' },
                { baseX: 68, baseY: 52, speed: -0.7, color: '#1E293B' },
                { baseX: 28, baseY: 60, speed: 1.4, color: '#475569' },
                { baseX: 38, baseY: 65, speed: -1.2, color: '#334155' },
                { baseX: 48, baseY: 58, speed: 0.9, color: '#1E293B' },
                { baseX: 58, baseY: 64, speed: -1.1, color: '#475569' },
                { baseX: 65, baseY: 70, speed: 1.0, color: '#0F172A' },
                { baseX: 44, baseY: 42, speed: 1.5, color: '#334155' },
                { baseX: 50, baseY: 74, speed: -0.8, color: '#1E293B' },
                { baseX: 32, baseY: 40, speed: 0.9, color: '#475569' },
              ].map((p, idx) => {
                const posX = p.baseX + Math.sin(playbackTime * p.speed + idx) * 8;
                const posY = p.baseY + Math.cos(playbackTime * (p.speed * 0.7) + idx) * 3;
                const limbMotion = Math.sin(playbackTime * 6 + idx) * 3;

                return (
                  <div
                    key={idx}
                    className="absolute flex flex-col items-center pointer-events-none transition-transform"
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                  >
                    {/* Shadow on floor */}
                    <div className="w-5 h-1.5 rounded-full bg-black/25 blur-[1px] -mb-1" />
                    {/* Head */}
                    <div className="w-3.5 h-3.5 rounded-full bg-[#E2B797] border border-neutral-700 shadow-xs" />
                    {/* Torso */}
                    <div className="w-5 h-7 rounded-t-sm shadow-xs" style={{ backgroundColor: p.color }} />
                    {/* Moving Legs */}
                    <div className="flex gap-1 -mt-0.5">
                      <div className="w-1.5 h-5 bg-[#1E293B] rounded-b-xs" style={{ transform: `rotate(${limbMotion * 4}deg)` }} />
                      <div className="w-1.5 h-5 bg-[#1E293B] rounded-b-xs" style={{ transform: `rotate(${-limbMotion * 4}deg)` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. MOBILE THEFT: Well-Lit Office Lounge with Walking Suspect */}
          {theme === 'mobile_theft' && (
            <div className="absolute inset-0 bg-[#E2D8CC] overflow-hidden">
              {/* Warm cafe/lounge wall & wooden flooring */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#D4C5B3] via-[#E5DACD] to-[#ECE2D6]" />
              
              {/* Parquet floor slats */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#854d0e_1px,transparent_1px)] [background-size:28px_100%]" />

              {/* Wooden lounge table in foreground */}
              <div className="absolute bottom-8 left-[35%] right-[20%] h-24 bg-[#9A6A42] border-t-4 border-[#B58155] rounded shadow-lg flex items-center justify-between px-6">
                <div className="w-4 h-5 rounded-full bg-white border border-neutral-300 shadow-xs" />
                {/* Smartphone on table */}
                <div className="w-6 h-10 bg-neutral-900 border-2 border-neutral-400 rounded-sm shadow-md flex items-center justify-center relative">
                  <span className="w-4 h-7 bg-neutral-800 rounded-xs" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute top-1 right-1" />
                </div>
              </div>

              {/* Person walking up to table, reaching over, and pocketing the phone */}
              {(() => {
                const walkX = 15 + (tNorm * 55); // moves from left across table to right
                const isReaching = tNorm > 0.4 && tNorm < 0.75;
                const armAngle = isReaching ? -35 : 12;

                return (
                  <div
                    className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
                    style={{ left: `${walkX}%`, top: `32%` }}
                  >
                    <div className="w-7 h-2 rounded-full bg-black/25 blur-[1px] absolute -bottom-1" />
                    {/* Head */}
                    <div className="w-5 h-5 rounded-full bg-[#E2B797] border border-neutral-700 shadow" />
                    {/* Body */}
                    <div className="w-8 h-14 bg-[#1E293B] rounded-t-sm shadow-md relative">
                      {/* Reaching arm */}
                      <div
                        className="w-8 h-3 bg-[#334155] rounded-full absolute -right-4 top-2 origin-left transition-transform duration-150"
                        style={{ transform: `rotate(${armAngle}deg)` }}
                      />
                    </div>
                    {/* Animated walking legs */}
                    <div className="flex gap-1.5 -mt-0.5">
                      <div className="w-2.5 h-10 bg-[#0F172A] rounded-b-xs" style={{ transform: `rotate(${walkPhase * 18}deg)` }} />
                      <div className="w-2.5 h-10 bg-[#0F172A] rounded-b-xs" style={{ transform: `rotate(${-walkPhase * 18}deg)` }} />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 3. PERSON FALLEN: Well-Lit Corridor with Subject Falling & Lying Down */}
          {theme === 'person_fallen' && (
            <div className="absolute inset-0 bg-[#E5E9EE] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#C8D1DC] via-[#DCE3EB] to-[#EEF2F6]" />
              
              {/* Corridor perspective lines */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <line x1="100" y1="0" x2="10" y2="100" stroke="#64748B" strokeWidth="0.8" />
                  <line x1="100" y1="0" x2="190" y2="100" stroke="#64748B" strokeWidth="0.8" />
                  <line x1="100" y1="0" x2="60" y2="100" stroke="#94A3B8" strokeWidth="0.5" />
                  <line x1="100" y1="0" x2="140" y2="100" stroke="#94A3B8" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Corridor doors on walls */}
              <div className="absolute top-6 left-6 w-12 h-24 bg-[#B8C4D2] border border-neutral-400 rounded-t-xs" />
              <div className="absolute top-6 right-6 w-12 h-24 bg-[#B8C4D2] border border-neutral-400 rounded-t-xs" />

              {/* Fallen person lying on floor with emergency pulse beacon */}
              <div className="absolute left-[38%] top-[56%] pointer-events-none flex items-center">
                <div className="w-24 h-5 rounded-full bg-black/30 blur-[2px] absolute -bottom-1" />
                <div className="w-6 h-6 rounded-full bg-[#E2B797] border border-neutral-600 mr-1 shadow-sm" />
                <div className="w-16 h-7 bg-[#2563EB] rounded-sm shadow-md" />
                <div className="w-14 h-4 bg-[#1E293B] rounded-sm ml-1" />
              </div>

              {/* Emergency medical indicator ring */}
              <div className="absolute left-[44%] top-[50%] w-20 h-14 border-2 border-red-500 rounded-full animate-ping opacity-60 pointer-events-none" />
            </div>
          )}

          {/* 4. UNAUTHORIZED ENTRY: Bright Cleanroom / High-Security Vault with Animated Open Door */}
          {theme === 'unauthorized_entry' && (
            <div className="absolute inset-0 bg-[#E8EDF2] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#D2DBE4] to-[#F1F5F9]" />
              
              {/* Vault doorway structure */}
              <div className="absolute inset-y-3 left-[32%] right-[32%] border-4 border-neutral-500 bg-[#C2CCD6] rounded-t flex flex-col justify-between p-2">
                <div className="flex justify-between items-center text-[8px] font-mono font-bold text-neutral-700">
                  <span>VAULT-02 SECURE</span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </div>
                {/* Red access control card reader */}
                <div className="w-3.5 h-6 bg-neutral-900 border border-neutral-500 rounded-xs self-end mr-1 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
              </div>

              {/* Red floor laser tripwire */}
              <div className="absolute bottom-6 inset-x-[25%] h-1.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />

              {/* Person walking forward through the door */}
              {(() => {
                const walkY = 32 + (tNorm * 18);
                const scale = 0.9 + (tNorm * 0.2);

                return (
                  <div
                    className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
                    style={{ left: '44%', top: `${walkY}%`, transform: `scale(${scale})` }}
                  >
                    <div className="w-8 h-2 rounded-full bg-black/30 blur-[1px] absolute -bottom-1" />
                    <div className="w-5 h-5 rounded-full bg-[#E2B797] border border-neutral-700 shadow" />
                    <div className="w-9 h-14 bg-[#1E293B] rounded-t-sm shadow-md" />
                    <div className="flex gap-1.5 -mt-0.5">
                      <div className="w-2.5 h-10 bg-[#0F172A] rounded-b-xs" style={{ transform: `rotate(${walkPhase * 16}deg)` }} />
                      <div className="w-2.5 h-10 bg-[#0F172A] rounded-b-xs" style={{ transform: `rotate(${-walkPhase * 16}deg)` }} />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 5. FIRE ACCIDENT: Realistic Utility Room with Animated Flame & Smoke Plume */}
          {theme === 'fire_accident' && (
            <div className="absolute inset-0 bg-[#DCE2E8] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#C4CED8] to-[#EAEFF4]" />
              
              {/* Battery racks in utility room */}
              <div className="absolute bottom-4 inset-x-8 h-32 bg-[#A8B6C4] border-2 border-neutral-500 rounded flex justify-around p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-18 h-full bg-[#8E9EAF] border border-neutral-600 rounded-xs flex flex-col justify-between p-1.5">
                    <span className="text-[7px] font-mono font-bold text-neutral-800">BATTERY-BAY {i+1}</span>
                    <span className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-amber-500 animate-ping' : 'bg-emerald-600'}`} />
                  </div>
                ))}
              </div>

              {/* Realistic Animated Flame Kernel */}
              <div className="absolute left-[54%] bottom-22 pointer-events-none flex flex-col items-center">
                {/* Smoke billows drifting upwards */}
                <div 
                  className="w-24 h-24 rounded-full bg-neutral-600/40 blur-xl -mb-12 animate-pulse"
                  style={{ transform: `translateY(-${tNorm * 40}px) scale(${1 + tNorm})` }}
                />
                <div 
                  className="w-18 h-18 rounded-full bg-neutral-500/35 blur-lg -mb-8"
                  style={{ transform: `translateY(-${tNorm * 25}px)` }}
                />

                {/* Bright Fire Flame */}
                <div className="w-12 h-16 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 rounded-full blur-[2px] opacity-95 animate-bounce shadow-[0_0_24px_rgba(245,158,11,0.9)]" />
              </div>
            </div>
          )}

          {/* 6. PERSON FIGHTING: Realistic Dock Gate with 2 People Grappling */}
          {theme === 'person_fighting' && (
            <div className="absolute inset-0 bg-[#E0E5EB] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#CCD5DF] to-[#EFF2F6]" />
              {/* Dock entrance barrier rail */}
              <div className="absolute bottom-0 inset-x-0 h-12 bg-[#9AA8B7] border-t-2 border-neutral-500" />
              
              {/* Two figures moving and grappling dynamically */}
              {(() => {
                const struggleX = 42 + Math.sin(playbackTime * 4) * 4;
                const struggleAngle1 = Math.sin(playbackTime * 6) * 12;
                const struggleAngle2 = -Math.sin(playbackTime * 6) * 12;

                return (
                  <div
                    className="absolute flex items-center justify-center pointer-events-none transition-all duration-75"
                    style={{ left: `${struggleX}%`, top: '34%' }}
                  >
                    <div className="w-16 h-3 rounded-full bg-black/25 blur-[1px] absolute -bottom-1" />
                    {/* Person 1 */}
                    <div className="flex flex-col items-center mr-1" style={{ transform: `rotate(${struggleAngle1}deg)` }}>
                      <div className="w-5 h-5 rounded-full bg-[#E2B797] border border-neutral-700 shadow" />
                      <div className="w-9 h-14 bg-[#DC2626] rounded-t-sm shadow-md" />
                      <div className="flex gap-1">
                        <div className="w-2.5 h-9 bg-[#1E293B]" />
                        <div className="w-2.5 h-9 bg-[#1E293B]" />
                      </div>
                    </div>

                    {/* Person 2 */}
                    <div className="flex flex-col items-center ml-1" style={{ transform: `rotate(${struggleAngle2}deg)` }}>
                      <div className="w-5 h-5 rounded-full bg-[#D4A373] border border-neutral-700 shadow" />
                      <div className="w-9 h-14 bg-[#1E293B] rounded-t-sm shadow-md" />
                      <div className="flex gap-1">
                        <div className="w-2.5 h-9 bg-[#334155]" />
                        <div className="w-2.5 h-9 bg-[#334155]" />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 7. BIN MOVEMENT: Worker in High-Vis Vest Pushing Industrial Bin Across Concrete */}
          {theme === 'bin_movement' && (
            <div className="absolute inset-0 bg-[#E4E8EE] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#CFD8E2] to-[#F1F4F8]" />
              
              {/* Original designated footprint */}
              <div className="absolute bottom-6 left-12 w-28 h-24 border-2 border-dashed border-amber-500 bg-amber-400/15 rounded flex items-center justify-center">
                <span className="text-[8px] font-mono font-bold text-amber-900 text-center">
                  DESIGNATED BIN FOOTPRINT
                </span>
              </div>

              {/* Worker pushing bin from left to right */}
              {(() => {
                const moveX = 35 + (tNorm * 32);

                return (
                  <div
                    className="absolute flex items-end pointer-events-none transition-all duration-75"
                    style={{ left: `${moveX}%`, top: '35%' }}
                  >
                    {/* Worker in High-Vis vest */}
                    <div className="flex flex-col items-center mr-2">
                      <div className="w-5 h-5 rounded-full bg-[#E2B797] border border-neutral-700 shadow" />
                      <div className="w-8 h-12 bg-amber-400 border border-amber-500 rounded-t-sm shadow-md flex items-center justify-center">
                        <span className="w-5 h-1.5 bg-neutral-900 rounded-xs" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-8 bg-neutral-800" style={{ transform: `rotate(${walkPhase * 16}deg)` }} />
                        <div className="w-2 h-8 bg-neutral-800" style={{ transform: `rotate(${-walkPhase * 16}deg)` }} />
                      </div>
                    </div>

                    {/* Industrial 240L Heavy Bin */}
                    <div className="w-18 h-22 bg-[#0284C7] border-2 border-neutral-700 rounded shadow-lg flex flex-col justify-between p-1.5">
                      <div className="flex justify-between text-[7px] font-mono font-bold text-white bg-black/40 px-1 rounded-xs">
                        <span>HAZ-BIN #02</span>
                        <span>240L</span>
                      </div>
                      <div className="flex justify-around">
                        <span className="w-3 h-3 rounded-full bg-black border border-neutral-400 shadow-sm" />
                        <span className="w-3 h-3 rounded-full bg-black border border-neutral-400 shadow-sm" />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 8. CHILD SAFETY: Child Walking Towards Ramp Barrier */}
          {theme === 'child_safety' && (
            <div className="absolute inset-0 bg-[#E6EBF0] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#D0D9E3] to-[#F1F5F9]" />
              
              {/* Ramp edge with yellow hazard stripes */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-[#A1B0C0] border-t-4 border-amber-500 flex items-center justify-around">
                <span className="text-[8px] font-mono font-bold text-amber-950 bg-amber-400/90 px-2 py-0.5 rounded">
                  ▲ HAZARDOUS VEHICULAR RAMP EDGE ▲
                </span>
              </div>

              {/* Small child figure walking with small quick steps towards ramp */}
              {(() => {
                const childX = 25 + (tNorm * 45);
                const childLimb = Math.sin(playbackTime * 8) * 3;

                return (
                  <div
                    className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
                    style={{ left: `${childX}%`, top: '44%' }}
                  >
                    <div className="w-6 h-1.5 rounded-full bg-black/25 blur-[1px] absolute -bottom-0.5" />
                    {/* Head */}
                    <div className="w-4 h-4 rounded-full bg-[#F5D0B5] border border-neutral-600 shadow" />
                    {/* Bright jacket */}
                    <div className="w-6 h-8 bg-[#EF4444] rounded-t-sm shadow-md" />
                    {/* Small moving legs */}
                    <div className="flex gap-1 -mt-0.5">
                      <div className="w-1.5 h-5 bg-[#1E293B]" style={{ transform: `rotate(${childLimb * 6}deg)` }} />
                      <div className="w-1.5 h-5 bg-[#1E293B]" style={{ transform: `rotate(${-childLimb * 6}deg)` }} />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* Subtle CCTV Scanlines & Real Video Surveillance Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.2)_100%)] opacity-70" />

        {/* Bounding Box Overlay (toggled by showDetection) */}
        {showDetection && (
          <div
            className="absolute transition-all duration-75 pointer-events-none"
            style={{
              left: `${finding.media.bbox.x}%`,
              top: `${finding.media.bbox.y}%`,
              width: `${finding.media.bbox.width}%`,
              height: `${finding.media.bbox.height}%`,
              backgroundColor: boxBg,
              border: `1.5px solid ${boxColor}`,
            }}
          >
            {/* Corner brackets */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: boxColor }} />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: boxColor }} />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: boxColor }} />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: boxColor }} />

            {/* Label Tag */}
            <div
              className="absolute -top-4.5 left-0 px-1.5 py-0.2 text-[8px] font-mono font-bold tracking-tight rounded-xs flex items-center gap-1 shadow-xs"
              style={{
                backgroundColor: boxColor,
                color: isCritical ? '#FFFFFF' : '#000000',
              }}
            >
              <span>{finding.media.bbox.label}</span>
              <span>·</span>
              <span>{finding.confidence.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Real CCTV Camera Watermark OSD */}
        <div className="absolute top-2 left-2.5 pointer-events-none z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-white tracking-wider">
            {finding.camera.id} · {finding.camera.name.toUpperCase()}
          </span>
        </div>

        <div className="absolute top-2 right-2.5 pointer-events-none z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 text-[8px] font-mono text-neutral-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 font-bold">LIVE REC</span>
          <span>· {formatTime(playbackTime)}</span>
        </div>

        {/* Toast Alert within Player */}
        {activeToast && (
          <div className="absolute top-10 inset-x-4 z-30 flex justify-center pointer-events-none animate-in fade-in duration-150">
            <div className="bg-black/90 text-white text-xs font-mono px-3 py-1.5 rounded-md border border-[#00E9C9]/50 shadow-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{activeToast}</span>
            </div>
          </div>
        )}

        {/* Video Scrubber / Progress Bar at bottom of viewport */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/50 z-20 overflow-hidden pointer-events-none">
          <div 
            className="h-full bg-[#00E9C9] transition-all duration-75"
            style={{ width: `${(playbackTime / duration) * 100}%` }}
          />
        </div>

        {/* Play/Pause hover trigger for compact mode */}
        {compact && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 hover:bg-black/90 text-white p-1 rounded border border-white/20 cursor-pointer shadow-md"
            title={isPlaying ? "Pause video preview" : "Play video preview"}
          >
            {isPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-white fill-white" />}
          </div>
        )}

        {/* Play/Pause hover trigger for full player in drawer */}
        {!isPlaying && !compact && (
          <div 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer z-10"
          >
            <div className="w-12 h-12 rounded-full bg-black/80 border border-white/30 text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-105">
              <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          FULL VIDEO VIEW CONTROLS (Below Camera View in Detail Slider)
          Requested: Play, Forward, Rewind, Time, Detection, Zones, Filmstrip, Loop, Clip Out, Speed, Zoom in/out, Save Frame, Download
         ======================================================== */}
      {!compact && (
        <div className="bg-neutral-900 border-t border-neutral-800 text-neutral-300 p-2.5 space-y-2 select-none">
          
          {/* Row 1: Time Slider Scrubber & Timecode */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-white tabular-nums shrink-0">
              {formatTime(playbackTime)}
            </span>

            {/* Interactive Timeline Range Input */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.05"
              value={playbackTime}
              onChange={(e) => setPlaybackTime(+e.target.value)}
              className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#00E9C9] focus:outline-none"
              title="Seek timecode"
            />

            <span className="text-[11px] font-mono text-neutral-400 tabular-nums shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Row 2: Playback & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-neutral-800/80 text-xs">
            {/* Left Controls: Rewind, Play, Forward, Loop, Speed */}
            <div className="flex items-center gap-1">
              {/* Rewind (-5s) */}
              <button
                type="button"
                onClick={handleRewind}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Rewind 5s"
                aria-label="Rewind"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
                aria-label="Play/Pause"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white text-white" />}
              </button>

              {/* Forward (+5s) */}
              <button
                type="button"
                onClick={handleForward}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Forward 5s"
                aria-label="Forward"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Loop Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsLooping(!isLooping);
                  triggerToast(`Loop: ${!isLooping ? 'Enabled' : 'Disabled'}`);
                }}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isLooping ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:bg-neutral-800'
                }`}
                title={`Toggle Loop (${isLooping ? 'Active' : 'Off'})`}
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* Speed Selector */}
              <button
                type="button"
                onClick={handleSpeedToggle}
                className="px-2 py-1 text-[11px] font-mono font-semibold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Playback Speed"
              >
                <Gauge className="w-3 h-3 text-white" />
                <span>{playbackSpeed}x</span>
              </button>
            </div>

            {/* Middle Controls: Detection, Zones, Filmstrip */}
            <div className="flex items-center gap-1">
              {/* Detection Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowDetection(!showDetection);
                  triggerToast(`AI Detection Bounding Box: ${!showDetection ? 'Visible' : 'Hidden'}`);
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                  showDetection ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title="Toggle AI Detection Overlays"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Detection</span>
              </button>

              {/* Zones Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowZones(!showZones);
                  triggerToast(`Safety Zones & Tripwires: ${!showZones ? 'Visible' : 'Hidden'}`);
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                  showZones ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title="Toggle Restricted Zones & Safety Polygons"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Zones</span>
              </button>

              {/* Filmstrip Toggle */}
              <button
                type="button"
                onClick={() => setShowFilmstrip(!showFilmstrip)}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                  showFilmstrip ? 'bg-[#016D5D] text-white font-semibold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title="Toggle Video Keyframe Filmstrip"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Filmstrip</span>
              </button>
            </div>

            {/* Right Controls: Zoom, Clip Out, Save Frame, Download */}
            <div className="flex items-center gap-1.5">
              {/* Zoom Controls */}
              <div className="flex items-center bg-neutral-800 rounded px-1.5 py-0.5 border border-neutral-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span 
                  onClick={() => setZoomLevel(1)} 
                  className="text-[10px] font-mono text-neutral-300 hover:text-white cursor-pointer px-1 tabular-nums"
                  title="Click to reset zoom to 100%"
                >
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2}
                  className="p-1 text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clip Out (Clip Snippet) */}
              <button
                type="button"
                onClick={handleClipOut}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono border border-neutral-700"
                title="Clip Out Snippet"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Clip</span>
              </button>

              {/* Save the Frame (Snapshot) */}
              <button
                type="button"
                onClick={handleSaveFrame}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Save the Frame (PNG Snapshot)"
              >
                <CameraIcon className="w-3.5 h-3.5" />
              </button>

              {/* Download Video Recording */}
              <button
                type="button"
                onClick={handleDownloadVideo}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Download Video File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filmstrip Preview Bar (Shown when Filmstrip is active) */}
          {showFilmstrip && (
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
                <span>KEYFRAME FILMSTRIP</span>
                <span className="text-neutral-500">Click thumbnail to seek timecode</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {[0, 2, 4, 6, 8, 10, 12].map((timeSec) => (
                  <button
                    key={timeSec}
                    type="button"
                    onClick={() => {
                      setPlaybackTime(timeSec);
                      triggerToast(`Seek to ${timeSec}s`);
                    }}
                    className={`relative aspect-video rounded overflow-hidden border transition-all cursor-pointer group/thumb ${
                      Math.abs(playbackTime - timeSec) < 1
                        ? 'border-[#00E9C9] ring-2 ring-[#00E9C9]/40'
                        : 'border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-[9px] font-mono text-neutral-300 group-hover/thumb:text-white">
                      <span>{timeSec}s</span>
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white/80 bg-black/60 px-1 rounded-xs">
                      {formatTime(timeSec)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
