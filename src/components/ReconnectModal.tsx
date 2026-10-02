import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Server,
  Radio,
  Wifi,
  Terminal,
} from 'lucide-react';

interface ReconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraName: string;
  onSuccess?: () => void;
}

export const ReconnectModal: React.FC<ReconnectModalProps> = ({
  isOpen,
  onClose,
  cameraName,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLogs([
        `[00:00.12] Initiating edge handshake protocol for "${cameraName}"...`,
        `[00:00.34] Ping probe sent to node IP 192.168.4.11 via VLAN 40 (Security)...`,
      ]);
      setIsCompleted(false);

      const timer1 = setTimeout(() => {
        setStep(2);
        setLogs((prev) => [
          ...prev,
          `[00:01.05] ICMP Response received (14.2ms). Hardware online.`,
          `[00:01.42] Triggering PoE 802.3at power reset on Switch SW-MUC-02 Port 11...`,
        ]);
      }, 1200);

      const timer2 = setTimeout(() => {
        setStep(3);
        setLogs((prev) => [
          ...prev,
          `[00:02.18] Port reset completed. Waiting for ONVIF daemon initialization...`,
          `[00:02.85] Negotiating RTSP H.264 stream profile (1080p @ 30fps)...`,
        ]);
      }, 2600);

      const timer3 = setTimeout(() => {
        setStep(4);
        setIsCompleted(true);
        setLogs((prev) => [
          ...prev,
          `[00:03.45] Stream handshake SUCCESS. 30 fps keyframe received.`,
          `[00:03.50] NEVRIXA perception pipeline synchronized. Camera online.`,
        ]);
        if (onSuccess) onSuccess();
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, cameraName, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
              <RefreshCw className={`w-4 h-4 ${!isCompleted ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="font-semibold text-sm text-neutral-900">
                Reconnecting {cameraName}
              </div>
              <div className="text-[11px] font-mono text-neutral-500">
                CAM-11 · RTSP Edge Reconnect Sequence
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps Progress */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded border ${step >= 1 ? 'border-[#016D5D] bg-[#E6F4F1] text-[#016D5D] font-medium' : 'border-neutral-200 text-neutral-400'}`}>
              1. Edge Probe
            </div>
            <div className={`p-2 rounded border ${step >= 2 ? 'border-[#016D5D] bg-[#E6F4F1] text-[#016D5D] font-medium' : 'border-neutral-200 text-neutral-400'}`}>
              2. PoE Cycle
            </div>
            <div className={`p-2 rounded border ${step >= 3 ? 'border-[#016D5D] bg-[#E6F4F1] text-[#016D5D] font-medium' : 'border-neutral-200 text-neutral-400'}`}>
              3. RTSP Sync
            </div>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="p-4 bg-neutral-950 font-mono text-xs text-neutral-300 space-y-1.5 h-44 overflow-y-auto">
          <div className="flex items-center gap-2 text-neutral-500 pb-1 border-b border-neutral-800 text-[10px]">
            <Terminal className="w-3 h-3 text-[#00E9C9]" />
            <span>NEVRIXA EDGE DIAGNOSTIC TERMINAL</span>
          </div>
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed text-[11px] ${
                log.includes('SUCCESS')
                  ? 'text-[#00E9C9] font-bold'
                  : log.includes('Initiating')
                  ? 'text-neutral-400'
                  : 'text-neutral-200'
              }`}
            >
              {log}
            </div>
          ))}
          {!isCompleted && (
            <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9]" />
              <span>Executing diagnostics...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-mono">
            {isCompleted ? (
              <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Coverage Restored
              </span>
            ) : (
              <span>Handshake in progress...</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#016D5D] text-white hover:bg-[#01584b] transition-colors cursor-pointer"
          >
            {isCompleted ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
