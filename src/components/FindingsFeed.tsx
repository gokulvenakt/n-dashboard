import React from 'react';
import { Finding, ViewMode, GroupByOption, FindingStatus } from '../types/findings';
import { FindingCard } from './FindingCard';
import { Inbox, LayoutGrid, LayoutList, Download } from 'lucide-react';

interface FindingsFeedProps {
  findings: Finding[];
  selectedFindingId?: string;
  onSelectFinding: (finding: Finding) => void;
  onUpdateStatus: (id: string, status: FindingStatus) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenExport: () => void;
  groupBy: GroupByOption;
  onResetFilters: () => void;
}

export const FindingsFeed: React.FC<FindingsFeedProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  onUpdateStatus,
  viewMode,
  onChangeViewMode,
  onOpenExport,
  groupBy,
  onResetFilters,
}) => {
  if (findings.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900">
          No findings match your filters
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs">
          Try clearing search terms or selecting another status card.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  // Helper to group findings
  const groupFindings = () => {
    const groups: { [key: string]: Finding[] } = {};

    findings.forEach((finding) => {
      let key = 'Other';
      if (groupBy === 'date') {
        key = finding.dateGroup === 'TODAY' ? 'TODAY' : finding.dateGroup === 'YESTERDAY' ? 'YESTERDAY' : 'EARLIER';
      } else if (groupBy === 'site') {
        key = finding.site;
      } else if (groupBy === 'severity') {
        key = `${finding.severity} SEVERITY`;
      } else if (groupBy === 'detectionType') {
        key = finding.detectionType.replace('_', ' ');
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(finding);
    });

    return groups;
  };

  const grouped = groupFindings();

  return (
    <div className="space-y-6 pt-1">
      {/* 
        VIEW TOGGLE BAR:
        - Positioned below filters, aligned with camera cards
        - Icon only (NO "view text", NO "grid text", NO "list text")
        - Clean stream count
      */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono tracking-wider text-neutral-900 uppercase">
            Findings
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-xs font-mono text-neutral-500">
            {findings.length} {findings.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Simply Icon Only Toggle (No text labels) */}
          <div className="flex items-center p-0.5 bg-white border border-[#D1D5DB] rounded-md shadow-2xs">
            <button
              type="button"
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#E6F4F1] text-[#016D5D] shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#E6F4F1] text-[#016D5D] shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="List View"
              aria-label="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-[#D1D5DB] hover:bg-neutral-50 rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Export Findings"
            aria-label="Export Findings"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Grouped findings sections */}
      {Object.entries(grouped).map(([groupTitle, groupItems]) => (
        <section key={groupTitle} className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>{groupTitle} · {groupItems.length}</span>
            {groupItems.some((i) => i.statusCategory === 'CRITICAL') && (
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {groupItems.filter((i) => i.statusCategory === 'CRITICAL').length} Critical
              </span>
            )}
          </div>

          {/* Cards Container */}
          {viewMode === 'list' ? (
            <div className="space-y-2">
              {groupItems.map((finding) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  isSelected={selectedFindingId === finding.id}
                  onSelect={onSelectFinding}
                  onUpdateStatus={onUpdateStatus}
                  viewMode="list"
                />
              ))}
            </div>
          ) : (
            /* 
              CAMERA CARDS: 1 X 3 GRID 
              (1 row of 3 cards on desktop!)
            */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groupItems.map((finding) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  isSelected={selectedFindingId === finding.id}
                  onSelect={onSelectFinding}
                  onUpdateStatus={onUpdateStatus}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
