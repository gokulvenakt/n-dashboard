import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { FilterState } from '../types/findings';

interface CommandFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResultsCount: number;
}

export const CommandFilterBar: React.FC<CommandFilterBarProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      site: 'all',
      camera: 'all',
      detectionType: 'all',
      severity: 'all',
      status: 'all',
      statusCategory: 'ALL',
      dateRange: 'today',
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.site !== 'all' ||
    filters.camera !== 'all' ||
    filters.detectionType !== 'all' ||
    filters.severity !== 'all' ||
    filters.status !== 'all' ||
    filters.statusCategory !== 'ALL' ||
    filters.dateRange !== 'today';

  const sites = [
    { id: 'all', label: 'All Sites' },
    { id: 'Chennai Facility', label: 'Chennai Facility' },
    { id: 'Munich Facility', label: 'Munich Facility' },
    { id: 'Singapore Hub', label: 'Singapore Hub' },
    { id: 'Dallas Logistics', label: 'Dallas Logistics' },
  ];

  const cameras = [
    { id: 'all', label: 'All Cameras' },
    { id: 'CAM-08', label: 'CAM-08 (Assembly Hall)' },
    { id: 'CAM-04', label: 'CAM-04 (Breakout Lounge)' },
    { id: 'CAM-12', label: 'CAM-12 (Corridor 3)' },
    { id: 'CAM-02', label: 'CAM-02 (Server Vault)' },
    { id: 'CAM-19', label: 'CAM-19 (Battery Room)' },
    { id: 'CAM-06', label: 'CAM-06 (Loading Bay 2)' },
    { id: 'CAM-14', label: 'CAM-14 (Waste Staging)' },
    { id: 'CAM-01', label: 'CAM-01 (Lobby Ramp)' },
  ];

  const detectionTypes = [
    { id: 'all', label: 'All Detections' },
    { id: 'TOO_MANY_PEOPLE', label: 'Too Many People' },
    { id: 'MOBILE_THEFT', label: 'Mobile Theft' },
    { id: 'PERSON_FALLEN', label: 'Person Fallen' },
    { id: 'UNAUTHORIZED_ENTRY', label: 'Unauthorized Entry' },
    { id: 'FIRE_DETECTED', label: 'Fire Detected' },
    { id: 'PERSON_FIGHTING', label: 'Person Fighting' },
    { id: 'BIN_MOVEMENT', label: 'Bin Movement' },
    { id: 'CHILD_SAFETY', label: 'Child Safety' },
  ];

  const severities = [
    { id: 'all', label: 'All Severities' },
    { id: 'CRITICAL', label: 'Critical' },
    { id: 'HIGH', label: 'High' },
    { id: 'MEDIUM', label: 'Medium' },
    { id: 'LOW', label: 'Low' },
  ];

  const dateRanges = [
    { id: 'today', label: 'Today (24h)' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-2.5">
      {/* Search Input without ⌘ K */}
      <div className="relative flex items-center bg-white border border-[#D1D5DB] rounded-lg shadow-2xs focus-within:border-[#016D5D] focus-within:ring-2 focus-within:ring-[#016D5D]/20 transition-all">
        <div className="pl-3.5 pr-2 py-2.5 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-4 h-4 text-[#016D5D]" />
        </div>

        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search findings (e.g., 'Unauthorized Entry', 'Too Many People', 'Mobile Theft', 'Fire')..."
          className="w-full py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
        />

        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
            className="p-1 mr-2 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Site Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'site' ? null : 'site')}
            className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.site !== 'all'
                ? 'bg-[#E6F4F1] border-[#016D5D] text-[#016D5D] font-semibold'
                : 'bg-white border-[#D1D5DB] text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className="text-neutral-400 text-[11px]">Site:</span>
            <span>{sites.find((s) => s.id === filters.site)?.label || 'All'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
          {activeDropdown === 'site' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-40 py-1">
              {sites.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, site: s.id });
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    filters.site === s.id ? 'font-semibold text-[#016D5D] bg-[#E6F4F1]/50' : 'text-neutral-700'
                  }`}
                >
                  <span>{s.label}</span>
                  {filters.site === s.id && <Check className="w-3 h-3 text-[#016D5D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Camera Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'camera' ? null : 'camera')}
            className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.camera !== 'all'
                ? 'bg-[#E6F4F1] border-[#016D5D] text-[#016D5D] font-semibold'
                : 'bg-white border-[#D1D5DB] text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className="text-neutral-400 text-[11px]">Camera:</span>
            <span>{cameras.find((c) => c.id === filters.camera)?.label || 'All'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
          {activeDropdown === 'camera' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-200 rounded-md shadow-lg z-40 py-1">
              {cameras.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, camera: c.id });
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    filters.camera === c.id ? 'font-semibold text-[#016D5D] bg-[#E6F4F1]/50' : 'text-neutral-700'
                  }`}
                >
                  <span>{c.label}</span>
                  {filters.camera === c.id && <Check className="w-3 h-3 text-[#016D5D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detection Type Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
            className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.detectionType !== 'all'
                ? 'bg-[#E6F4F1] border-[#016D5D] text-[#016D5D] font-semibold'
                : 'bg-white border-[#D1D5DB] text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className="text-neutral-400 text-[11px]">Detection:</span>
            <span>{detectionTypes.find((d) => d.id === filters.detectionType)?.label || 'All'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
          {activeDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-200 rounded-md shadow-lg z-40 py-1 max-h-64 overflow-y-auto">
              {detectionTypes.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, detectionType: d.id });
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    filters.detectionType === d.id ? 'font-semibold text-[#016D5D] bg-[#E6F4F1]/50' : 'text-neutral-700'
                  }`}
                >
                  <span>{d.label}</span>
                  {filters.detectionType === d.id && <Check className="w-3 h-3 text-[#016D5D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Severity Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'severity' ? null : 'severity')}
            className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.severity !== 'all'
                ? 'bg-[#E6F4F1] border-[#016D5D] text-[#016D5D] font-semibold'
                : 'bg-white border-[#D1D5DB] text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className="text-neutral-400 text-[11px]">Severity:</span>
            <span>{severities.find((s) => s.id === filters.severity)?.label || 'All'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
          {activeDropdown === 'severity' && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-neutral-200 rounded-md shadow-lg z-40 py-1">
              {severities.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, severity: s.id });
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    filters.severity === s.id ? 'font-semibold text-[#016D5D] bg-[#E6F4F1]/50' : 'text-neutral-700'
                  }`}
                >
                  <span>{s.label}</span>
                  {filters.severity === s.id && <Check className="w-3 h-3 text-[#016D5D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
            className={`px-2.5 py-1.5 text-xs rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filters.dateRange !== 'today'
                ? 'bg-[#E6F4F1] border-[#016D5D] text-[#016D5D] font-semibold'
                : 'bg-white border-[#D1D5DB] text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{dateRanges.find((d) => d.id === filters.dateRange)?.label || 'Today'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
          {activeDropdown === 'date' && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-neutral-200 rounded-md shadow-lg z-40 py-1">
              {dateRanges.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onFilterChange({ ...filters, dateRange: d.id as any });
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    filters.dateRange === d.id ? 'font-semibold text-[#016D5D] bg-[#E6F4F1]/50' : 'text-neutral-700'
                  }`}
                >
                  <span>{d.label}</span>
                  {filters.dateRange === d.id && <Check className="w-3 h-3 text-[#016D5D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
