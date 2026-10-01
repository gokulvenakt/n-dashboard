export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type FindingStatus = 'NEEDS_REVIEW' | 'UNDER_REVIEW' | 'CONFIRMED' | 'RESOLVED' | 'DISMISSED';

export type DetectionType = 
  | 'TOO_MANY_PEOPLE'
  | 'MOBILE_THEFT'
  | 'PERSON_FALLEN'
  | 'UNAUTHORIZED_ENTRY'
  | 'FIRE_DETECTED'
  | 'PERSON_FIGHTING'
  | 'BIN_MOVEMENT'
  | 'CHILD_SAFETY';

export interface DetectionSignal {
  id: string;
  label: string;
  category: 'visual' | 'spatial' | 'temporal' | 'contextual';
  detail: string;
  confidence: number;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  phase: 'entry' | 'zone_cross' | 'detection' | 'alert' | 'action';
}

export interface FindingNote {
  id: string;
  author: string;
  role: string;
  time: string;
  text: string;
}

export interface Finding {
  id: string;
  title: string;
  subtitle: string;
  site: string;
  siteCode: string;
  camera: {
    id: string;
    name: string;
    zone: string;
    streamUrl?: string;
    resolution: string;
    framerate: string;
  };
  timestamp: string;
  detectedAt: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'EARLIER';
  severity: Severity;
  status: FindingStatus;
  statusCategory: 'ATTENTION' | 'CRITICAL' | 'RESOLVED';
  detectionType: DetectionType;
  detectionLabel: string;
  confidence: number;
  aiInterpretation: string;
  operationalInsight: string;
  whyDetected: {
    signals: DetectionSignal[];
    evidenceCounts: {
      visual: number;
      contextual: number;
      spatial: number;
    };
    modelLatencyMs: number;
    fpsProcessed: number;
    modelVersion: string;
  };
  timeline: TimelineEvent[];
  media: {
    durationSec: number;
    cameraFeedType: 'color' | 'infrared' | 'night_vision';
    resolution: string;
    sceneTheme: 'too_many_people' | 'mobile_theft' | 'person_fallen' | 'unauthorized_entry' | 'fire_accident' | 'person_fighting' | 'bin_movement' | 'child_safety';
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
      label: string;
      confidence: number;
    };
    secondaryBbox?: {
      x: number;
      y: number;
      width: number;
      height: number;
      label: string;
      confidence: number;
    };
    restrictedZone?: Array<[number, number]>;
    overlayMetric?: string;
  };
  assignedTo?: string;
  notes: FindingNote[];
  automationsTriggered: string[];
}

export interface FilterState {
  searchQuery: string;
  site: string;
  camera: string;
  detectionType: string;
  severity: string;
  status: string;
  statusCategory: 'ALL' | 'ATTENTION' | 'CRITICAL' | 'RESOLVED';
  dateRange: 'today' | '24h' | '7d' | '30d' | 'all';
}

export type ViewMode = 'grid' | 'list';

export type GroupByOption = 'date' | 'site' | 'severity' | 'detectionType';
