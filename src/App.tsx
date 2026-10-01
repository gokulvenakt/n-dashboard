/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatusCards } from './components/StatusCards';
import { AiInsightStrip } from './components/AiInsightStrip';
import { CommandFilterBar } from './components/CommandFilterBar';
import { FindingsFeed } from './components/FindingsFeed';
import { FindingDetailDrawer } from './components/FindingDetailDrawer';
import { ExportModal } from './components/ExportModal';
import { AutomationModal } from './components/AutomationModal';
import { EscalateModal } from './components/EscalateModal';
import { LiveWallView } from './components/LiveWallView';
import { OverviewView } from './components/OverviewView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { INITIAL_FINDINGS } from './data/mockFindings';
import {
  Finding,
  FilterState,
  ViewMode,
  GroupByOption,
  FindingStatus,
} from './types/findings';

export default function App() {
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('findings');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  
  // Initial default view = Grid View
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [groupBy, setGroupBy] = useState<GroupByOption>('date');

  // Modals state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [automationModalOpen, setAutomationModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filtering state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    site: 'all',
    camera: 'all',
    detectionType: 'all',
    severity: 'all',
    status: 'all',
    statusCategory: 'ALL',
    dateRange: 'today',
  });

  const addToast = (type: 'success' | 'alert' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedFinding) setSelectedFinding(null);
        if (exportModalOpen) setExportModalOpen(false);
        if (automationModalOpen) setAutomationModalOpen(false);
        if (escalateModalOpen) setEscalateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFinding, exportModalOpen, automationModalOpen, escalateModalOpen]);

  const handleSiteSelectFromSidebar = (siteId: string) => {
    setSelectedSite(siteId);
    if (siteId === 'all') {
      setFilters((prev) => ({ ...prev, site: 'all' }));
    } else if (siteId === 'chennai') {
      setFilters((prev) => ({ ...prev, site: 'Chennai Facility' }));
    } else if (siteId === 'munich') {
      setFilters((prev) => ({ ...prev, site: 'Munich Facility' }));
    } else if (siteId === 'singapore') {
      setFilters((prev) => ({ ...prev, site: 'Singapore Hub' }));
    } else if (siteId === 'dallas') {
      setFilters((prev) => ({ ...prev, site: 'Dallas Logistics' }));
    }
  };

  // Filter evaluation logic
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      // Status Category Card Filter (Attention | Critical | Resolved)
      if (filters.statusCategory !== 'ALL') {
        if (f.statusCategory !== filters.statusCategory) return false;
      }

      // Text search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesText =
          f.title.toLowerCase().includes(query) ||
          f.subtitle.toLowerCase().includes(query) ||
          f.site.toLowerCase().includes(query) ||
          f.camera.id.toLowerCase().includes(query) ||
          f.camera.name.toLowerCase().includes(query) ||
          f.aiInterpretation.toLowerCase().includes(query) ||
          f.operationalInsight.toLowerCase().includes(query) ||
          f.detectionLabel.toLowerCase().includes(query);

        if (!matchesText) return false;
      }

      // Discrete filters
      if (filters.site !== 'all' && f.site !== filters.site) return false;
      if (filters.camera !== 'all' && f.camera.id !== filters.camera) return false;
      if (filters.detectionType !== 'all' && f.detectionType !== filters.detectionType) return false;
      if (filters.severity !== 'all' && f.severity !== filters.severity) return false;
      if (filters.status !== 'all' && f.status !== filters.status) return false;

      if (filters.dateRange === 'today' && f.dateGroup !== 'TODAY') return false;

      return true;
    });
  }, [findings, filters]);

  const handleUpdateStatus = (id: string, newStatus: FindingStatus) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const category =
            newStatus === 'RESOLVED'
              ? 'RESOLVED'
              : f.severity === 'CRITICAL'
              ? 'CRITICAL'
              : 'ATTENTION';
          return { ...f, status: newStatus, statusCategory: category };
        }
        return f;
      })
    );
    if (selectedFinding && selectedFinding.id === id) {
      setSelectedFinding((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    addToast(
      'success',
      `Finding ${id} updated to ${newStatus.replace('_', ' ')}`,
      'Synchronized with central security operations log.'
    );
  };

  const handleAddNote = (findingId: string, noteText: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Arun Kumar',
      role: 'SecOps Lead',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: noteText,
    };

    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          return { ...f, notes: [newNote, ...f.notes] };
        }
        return f;
      })
    );

    if (selectedFinding && selectedFinding.id === findingId) {
      setSelectedFinding((prev) =>
        prev ? { ...prev, notes: [newNote, ...prev.notes] } : null
      );
    }

    addToast('info', 'Operator Note Added', 'Recorded to incident evidence audit log.');
  };

  const handleRuleCreated = (ruleName: string) => {
    if (!selectedFinding) return;
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === selectedFinding.id) {
          return {
            ...f,
            automationsTriggered: [ruleName, ...f.automationsTriggered],
          };
        }
        return f;
      })
    );
    addToast('success', 'Automation Rule Activated', ruleName);
  };

  const handleEscalateConfirm = (findingId: string, level: string, comment: string) => {
    handleUpdateStatus(findingId, 'UNDER_REVIEW');
    handleAddNote(findingId, `[ESCALATION ${level.toUpperCase()}] ${comment}`);
    addToast('alert', 'Incident Escalated', 'Immediate dispatch sent to Security Operations Desk.');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#000000] flex font-sans">
      {/* Persistent Left Navigation Sidebar (NEVRIXA logo always visible) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'alerts') {
            setFilters((prev) => ({ ...prev, statusCategory: 'CRITICAL' }));
          }
        }}
        selectedSite={selectedSite}
        onSelectSite={handleSiteSelectFromSidebar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadAlertCount={findings.filter((f) => f.statusCategory === 'CRITICAL' && f.status !== 'RESOLVED').length}
      />

      {/* Main Workspace Canvas */}
      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Contextual Top Bar */}
        <header className="h-14 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-900">NEVRIXA Operations</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-500 font-medium capitalize">
              {currentTab === 'findings' ? 'Finding' : currentTab.replace('-', ' ')}
            </span>
            {selectedSite !== 'all' && (
              <>
                <span className="text-neutral-300">/</span>
                <span className="text-[#016D5D] font-semibold bg-[#E6F4F1] px-1.5 py-0.5 rounded text-[11px]">
                  {filters.site}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Content Viewport Area */}
        <div className="flex-1 p-4 sm:p-6 max-w-[1680px] w-full mx-auto space-y-5">
          {currentTab === 'overview' ? (
            <OverviewView
              findings={findings}
              onNavigateToFindings={() => setCurrentTab('findings')}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />
          ) : currentTab === 'live-wall' ? (
            <LiveWallView
              findings={findings}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />
          ) : (
            <div className="space-y-4">
              
              {/* 
                STEP 1: FINDING TITLE + SUBHEADING 
                With full-width line below text using primary color (#016D5D)
              */}
              <div className="pb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000] font-sans">
                    Finding
                  </h1>
                  <p className="text-xs text-neutral-600 mt-1 font-medium">
                    AI-detected events and operational insights across your sites.
                  </p>
                </div>
                {/* Full-width line below the text fully using NEVRIXA primary color #016D5D */}
                <div className="w-full h-[2px] bg-[#016D5D] mt-3.5" />
              </div>

              {/* 
                STEP 2: RETAINED AI SUGGEST BOX (NEVRIXA INTELLIGENCE)
              */}
              <AiInsightStrip />

              {/* 
                STEP 3: ATTENTION, CRITICAL AND RESOLVED JUST BELOW AI SUGGESTION PART
              */}
              <StatusCards
                findings={findings}
                selectedCategory={filters.statusCategory}
                onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, statusCategory: cat }))}
              />

              {/* 
                STEP 4: FILTERS (Search without ⌘ K + discrete dropdowns)
              */}
              <CommandFilterBar
                filters={filters}
                onFilterChange={setFilters}
                totalResultsCount={filteredFindings.length}
              />

              {/* 
                STEP 5: FINDINGS FEED:
                - View toggle bar is below filters, aligned with camera cards
                - Simply icon only (NO "view text", NO "grid text", NO "list text")
                - Camera Cards in 1 X 3 GRID layout
                - Rich card details restored from previous version
                - Real video scenes with person movement
              */}
              <FindingsFeed
                findings={filteredFindings}
                selectedFindingId={selectedFinding?.id}
                onSelectFinding={(f) => setSelectedFinding(f)}
                onUpdateStatus={handleUpdateStatus}
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
                onOpenExport={() => setExportModalOpen(true)}
                groupBy={groupBy}
                onResetFilters={() => {
                  setFilters({
                    searchQuery: '',
                    site: 'all',
                    camera: 'all',
                    detectionType: 'all',
                    severity: 'all',
                    status: 'all',
                    statusCategory: 'ALL',
                    dateRange: 'today',
                  });
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* 
        Right-Side Investigation Drawer
        With dark backdrop scrim preventing background merging or bleed-through!
      */}
      {selectedFinding && (
        <FindingDetailDrawer
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          onCreateAutomation={(f) => setAutomationModalOpen(true)}
          onEscalate={(f) => setEscalateModalOpen(true)}
        />
      )}

      {/* Export Evidence Packet Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        findings={filteredFindings}
        onExportComplete={(format, filename) => {
          addToast('success', `${format} Packet Downloaded`, filename);
        }}
      />

      {/* Create Automation Rule Modal */}
      <AutomationModal
        finding={selectedFinding}
        isOpen={automationModalOpen}
        onClose={() => setAutomationModalOpen(false)}
        onRuleCreated={handleRuleCreated}
      />

      {/* Escalate Security Alert Modal */}
      <EscalateModal
        finding={selectedFinding}
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        onEscalateConfirm={handleEscalateConfirm}
      />

      {/* Toast Notification Stack */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
