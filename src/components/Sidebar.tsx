import React, { useState } from 'react';
import {
  ShieldAlert,
  LayoutGrid,
  Radio,
  Bell,
  Camera,
  CheckSquare,
  Cpu,
  Workflow,
  FileCheck2,
  BarChart3,
  Server,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedSite: string;
  onSelectSite: (site: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedSite,
  onSelectSite,
  collapsed,
  onToggleCollapse,
  unreadAlertCount = 4,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  const sites = [
    { id: 'all', name: 'Global Operations (All Sites)', count: '142 Cams' },
    { id: 'chennai', name: 'Chennai Facility', count: '48 Cams' },
    { id: 'munich', name: 'Munich Facility', count: '36 Cams' },
    { id: 'singapore', name: 'Singapore Hub', count: '32 Cams' },
    { id: 'dallas', name: 'Dallas Logistics', count: '26 Cams' },
  ];

  const primaryNav = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'findings', label: 'Finding', icon: ShieldAlert, badge: '8' },
    { id: 'live-wall', label: 'Live Wall', icon: Radio, pulse: true },
    { id: 'alerts', label: 'Alerts', icon: Bell, alertCount: unreadAlertCount },
    { id: 'cameras', label: 'Cameras & Sites', icon: Camera },
    { id: 'review', label: 'Review', icon: CheckSquare },
  ];

  const operationalNav = [
    { id: 'detectors', label: 'Detectors', icon: Cpu },
    { id: 'automations', label: 'Automations', icon: Workflow },
    { id: 'evidence', label: 'Evidence', icon: FileCheck2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeSiteObj = sites.find((s) => s.id === selectedSite) || sites[0];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 
        BRAND HEADER:
        NEVRIXA logo MUST remain visible both expanded and collapsed!
      */}
      <div className={`h-16 border-b border-[#E5E7EB] flex items-center ${collapsed ? 'justify-center px-1' : 'justify-between px-4'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Nevrixa Modern Geometric Emblem - ALWAYS VISIBLE */}
          <div 
            onClick={collapsed ? onToggleCollapse : undefined}
            className="w-8 h-8 rounded-md bg-[#016D5D] flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
            title="NEVRIXA AI Video Intelligence"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19L12 4L20 19" stroke="#00E9C9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12H16" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="12" cy="11.5" r="2.2" fill="#00E9C9" />
            </svg>
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-[#000000]">NEVRIXA</span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-[#E6F4F1] text-[#016D5D] font-medium rounded-xs">
                  CORE
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 truncate leading-none mt-0.5">
                AI Video & Operational Intel
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand Button for Collapsed Mode */}
      {collapsed && (
        <div className="py-2 flex justify-center border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-neutral-500 hover:text-[#016D5D] hover:bg-[#E6F4F1] transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Workspace / Site Selector */}
      <div className="p-3 border-b border-[#E5E7EB] relative">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="w-10 h-10 mx-auto rounded-md bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            title={activeSiteObj.name}
          >
            <Building2 className="w-4 h-4 text-[#016D5D]" />
          </button>
        ) : (
          <div>
            <div className="text-[10px] font-medium text-neutral-600 mb-1">
              Active Workspace
            </div>
            <button
              type="button"
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-white transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#00E9C9] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    {activeSiteObj.name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-600">
                    {activeSiteObj.count} · AI Active
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${siteDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {siteDropdownOpen && (
              <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-50 py-1">
                {sites.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSite(s.id);
                      setSiteDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedSite === s.id
                        ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] font-mono text-neutral-600">{s.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Primary Operational Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-medium text-neutral-500 tracking-wider">
              OPERATIONS
            </div>
          )}
          <nav className="space-y-0.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#016D5D] rounded-r" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#8FF2E2]/40 text-[#016D5D] font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && item.alertCount !== undefined && item.alertCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-neutral-900 text-white font-semibold">
                      {item.alertCount}
                    </span>
                  )}
                  {!collapsed && item.pulse && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Platform & Governance Group */}
        <div>
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-medium text-neutral-500 tracking-wider">
              INTELLIGENCE & CONFIG
            </div>
          )}
          <nav className="space-y-0.5">
            {operationalNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area: User Account */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#FAFAFA]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                AK
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 truncate">Arun Kumar</div>
                <div className="text-[10px] text-neutral-500 truncate">SecOps Lead · Admin</div>
              </div>
            </div>
            <button
              type="button"
              className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              title="Account Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-[10px] font-semibold">
              AK
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
