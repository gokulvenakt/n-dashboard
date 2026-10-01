import React, { useState } from 'react';
import { Radio, Maximize2, Shield, Eye, RefreshCw, Volume2, Grid, Layers } from 'lucide-react';
import { Finding } from '../types/findings';
import { CCTVPlayer } from './CCTVPlayer';

interface LiveWallViewProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

export const LiveWallView: React.FC<LiveWallViewProps> = ({ findings, onSelectFinding }) => {
  const [layout, setLayout] = useState<'2x2' | '3x2'>('3x2');

  const liveFeeds = findings.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Live Wall Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-neutral-200">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span>Operational Live Video Wall</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-semibold">
                6 STREAMS ACTIVE
              </span>
            </h2>
            <p className="text-xs text-neutral-500">
              Real-time multi-camera edge inference and object tracking matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-neutral-100 p-0.5 rounded border border-neutral-200">
            <button
              type="button"
              onClick={() => setLayout('2x2')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                layout === '2x2' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'
              }`}
            >
              2 × 2
            </button>
            <button
              type="button"
              onClick={() => setLayout('3x2')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                layout === '3x2' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'
              }`}
            >
              3 × 2
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Live CCTV Players */}
      <div className={`grid gap-3 ${layout === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {liveFeeds.map((finding) => (
          <div
            key={finding.id}
            onClick={() => onSelectFinding(finding)}
            className="cursor-pointer group relative bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 hover:border-[#016D5D] transition-all shadow-sm"
          >
            <CCTVPlayer finding={finding} autoPlay={true} compact={true} />
            <div className="p-2.5 bg-neutral-900 text-white flex items-center justify-between text-xs border-t border-neutral-800">
              <div>
                <span className="font-semibold text-neutral-200 block truncate">{finding.camera.id} · {finding.camera.name}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{finding.site} · {finding.severity}</span>
              </div>
              <button
                type="button"
                className="px-2 py-1 text-[10px] font-semibold text-[#00E9C9] bg-neutral-800 rounded group-hover:bg-[#016D5D] group-hover:text-white transition-colors"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
