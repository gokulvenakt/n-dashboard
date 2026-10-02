import React, { useState } from 'react';
import {
  LayoutGrid,
  Radio,
  Bell,
  Camera,
  ShieldAlert,
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
  AlertOctagon,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedSite: string;
  onSelectSite: (site: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertCount?: number;
  onSelectSubFinding?: (category: 'ALL' | 'CRITICAL' | 'ATTENTION' | 'INFORMATIONAL') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedSite,
  onSelectSite,
  collapsed,
  onToggleCollapse,
  unreadAlertCount = 2,
  onSelectSubFinding,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [findingsExpanded, setFindingsExpanded] = useState(true);
  const [detectorsExpanded, setDetectorsExpanded] = useState(false);

  const sites = [
    { id: 'all', name: 'Global Operations (All Sites)', count: '15 Cams' },
    { id: 'chennai', name: 'Chennai Facility', count: '8 Cams' },
    { id: 'munich', name: 'Munich Facility', count: '4 Cams' },
    { id: 'singapore', name: 'Singapore Hub', count: '3 Cams' },
  ];

  const activeSiteObj = sites.find((s) => s.id === selectedSite) || sites[0];

  const findingsSubItems = [
    { id: 'all-findings', label: 'All Findings', count: '20', category: 'ALL' as const },
    { id: 'critical-findings', label: 'Critical', count: '2', color: 'text-red-700 bg-red-50 border-red-200', category: 'CRITICAL' as const },
    { id: 'attention-findings', label: 'Attention', count: '8', color: 'text-amber-700 bg-amber-50 border-amber-200', category: 'ATTENTION' as const },
    { id: 'informational-findings', label: 'Informational', count: '10', color: 'text-neutral-600 bg-neutral-100 border-neutral-200', category: 'INFORMATIONAL' as const },
  ];

  const detectorsSubItems = [
    { id: 'safety', label: 'Safety', badge: 'Active' },
    { id: 'security', label: 'Security', badge: 'Active' },
    { id: 'efficiency', label: 'Efficiency', badge: 'Active' },
    { id: 'compliance', label: 'Compliance', badge: 'Active' },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 
        BRAND HEADER:
        NEVRIXA logo MUST remain visible both expanded and collapsed!
      */}
      <div className={`h-14 border-b border-[#E5E7EB] flex items-center ${collapsed ? 'justify-center px-1' : 'justify-between px-4'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Nevrixa Emblem */}
          <div
            onClick={collapsed ? onToggleCollapse : () => onSelectTab('overview')}
            className="w-8 h-8 rounded-lg bg-[#016D5D] flex items-center justify-center shrink-0 shadow-xs cursor-pointer group"
            title="NEVRIXA AI Video Intelligence"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19L12 4L20 19" stroke="#00E9C9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12H16" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="12" cy="11.5" r="2.2" fill="#00E9C9" />
            </svg>
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => onSelectTab('overview')}>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[#000000]">NEVRIXA</span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-[#E6F4F1] text-[#016D5D] font-semibold rounded-xs">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 truncate leading-none mt-0.5">
                Video Analytics & Ops
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
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

      {/* Expand button when collapsed */}
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

      {/* Workspace Selector (Top of sidebar body) */}
      <div className="p-2.5 border-b border-[#E5E7EB] relative">
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
            <div className="text-[10px] font-mono text-neutral-600 uppercase mb-1 tracking-wider">
              WORKSPACE
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
                    {activeSiteObj.count} · AI Monitored
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${siteDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {siteDropdownOpen && (
              <div className="absolute top-full left-2.5 right-2.5 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-1">
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
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] font-mono text-neutral-600 shrink-0 ml-2">{s.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* 1. Overview */}
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          title={collapsed ? 'Overview' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'overview'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'overview' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <LayoutGrid className={`w-4 h-4 shrink-0 ${currentTab === 'overview' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Overview</span>}
        </button>

        {/* 2. Cameras & Sites */}
        <button
          type="button"
          onClick={() => onSelectTab('cameras')}
          title={collapsed ? 'Cameras & Sites' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'cameras'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'cameras' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Camera className={`w-4 h-4 shrink-0 ${currentTab === 'cameras' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Cameras & Sites</span>
              <span className="text-[10px] font-mono text-neutral-600">15</span>
            </>
          )}
        </button>

        {/* 3. Live Wall */}
        <button
          type="button"
          onClick={() => onSelectTab('live-wall')}
          title={collapsed ? 'Live Wall' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'live-wall'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'live-wall' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Radio className={`w-4 h-4 shrink-0 ${currentTab === 'live-wall' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Live Wall</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-pulse" />
            </>
          )}
        </button>

        {/* 4. Alerts */}
        <button
          type="button"
          onClick={() => onSelectTab('alerts')}
          title={collapsed ? 'Alerts' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'alerts'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'alerts' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Bell className={`w-4 h-4 shrink-0 ${currentTab === 'alerts' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Alerts</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-white font-semibold">
                {unreadAlertCount}
              </span>
            </>
          )}
        </button>

        {/* 5. Findings (With sub-items: All Findings, Critical, Attention, Informational) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                onSelectTab('findings');
              } else {
                setFindingsExpanded(!findingsExpanded);
                onSelectTab('findings');
              }
            }}
            title={collapsed ? 'Findings' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
              currentTab === 'findings'
                ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
            }`}
          >
            {currentTab === 'findings' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
            )}
            <ShieldAlert className={`w-4 h-4 shrink-0 ${currentTab === 'findings' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
            {!collapsed && (
              <>
                <span className="truncate flex-1 text-left">Findings</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#8FF2E2]/50 text-[#016D5D] font-semibold">
                  20
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${findingsExpanded ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* Sub-items */}
          {!collapsed && findingsExpanded && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-[#E5E7EB] ml-4 mt-0.5">
              {findingsSubItems.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    onSelectTab('findings');
                    if (onSelectSubFinding) onSelectSubFinding(sub.category);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] text-neutral-600 hover:text-neutral-900 hover:bg-[#F4F4F4] rounded transition-colors text-left cursor-pointer"
                >
                  <span className="truncate">{sub.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${sub.color || 'text-neutral-600'}`}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. Detectors (With sub-items: Safety, Security, Efficiency, Compliance) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                onSelectTab('detectors');
              } else {
                setDetectorsExpanded(!detectorsExpanded);
                onSelectTab('detectors');
              }
            }}
            title={collapsed ? 'Detectors' : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
              currentTab === 'detectors'
                ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
            }`}
          >
            {currentTab === 'detectors' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
            )}
            <Cpu className={`w-4 h-4 shrink-0 ${currentTab === 'detectors' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
            {!collapsed && (
              <>
                <span className="truncate flex-1 text-left">Detectors</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${detectorsExpanded ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {!collapsed && detectorsExpanded && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-[#E5E7EB] ml-4 mt-0.5">
              {detectorsSubItems.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectTab('detectors')}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] text-neutral-600 hover:text-neutral-900 hover:bg-[#F4F4F4] rounded transition-colors text-left cursor-pointer"
                >
                  <span className="truncate">{sub.label}</span>
                  <span className="text-[9px] font-mono text-[#016D5D] bg-[#E6F4F1] px-1 rounded">
                    {sub.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 7. Automations */}
        <button
          type="button"
          onClick={() => onSelectTab('automations')}
          title={collapsed ? 'Automations' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'automations'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'automations' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Workflow className={`w-4 h-4 shrink-0 ${currentTab === 'automations' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Automations</span>}
        </button>

        {/* 8. Evidence */}
        <button
          type="button"
          onClick={() => onSelectTab('evidence')}
          title={collapsed ? 'Evidence' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'evidence'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'evidence' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <FileCheck2 className={`w-4 h-4 shrink-0 ${currentTab === 'evidence' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Evidence</span>}
        </button>

        {/* 9. Reports */}
        <button
          type="button"
          onClick={() => onSelectTab('reports')}
          title={collapsed ? 'Reports' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'reports'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'reports' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <BarChart3 className={`w-4 h-4 shrink-0 ${currentTab === 'reports' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Reports</span>}
        </button>

        {/* 10. Infrastructure */}
        <button
          type="button"
          onClick={() => onSelectTab('infrastructure')}
          title={collapsed ? 'Infrastructure' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'infrastructure'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'infrastructure' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Server className={`w-4 h-4 shrink-0 ${currentTab === 'infrastructure' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Infrastructure</span>}
        </button>

        {/* 11. Settings */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          title={collapsed ? 'Settings' : undefined}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#F9FAFB]'
          }`}
        >
          {currentTab === 'settings' && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
          )}
          <Settings className={`w-4 h-4 shrink-0 ${currentTab === 'settings' ? 'text-[#016D5D]' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
          {!collapsed && <span className="truncate flex-1 text-left">Settings</span>}
        </button>
      </div>

      {/* Bottom Area: User Profile, Workspace & System Status Indicator */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#FAFAFA] space-y-2.5">
        {/* System Status Indicator */}
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 px-1 py-1 rounded bg-white border border-[#E5E7EB]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
              <span className="text-[#016D5D] font-medium">All systems operational</span>
            </div>
            <span className="text-[10px] text-neutral-600">15/15 Online</span>
          </div>
        ) : (
          <div className="flex justify-center" title="All systems operational · 15/15 online">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E9C9] animate-pulse" />
          </div>
        )}

        {/* User Profile */}
        {!collapsed ? (
          <div className="flex items-center justify-between pt-1">
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
              onClick={() => onSelectTab('settings')}
              className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              title="Account Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-[10px] font-semibold">
              AK
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
