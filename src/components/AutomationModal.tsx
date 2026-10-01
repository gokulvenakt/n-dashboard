import React, { useState } from 'react';
import { X, Workflow, Shield, Check, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { Finding } from '../types/findings';

interface AutomationModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  onRuleCreated: (ruleName: string) => void;
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  finding,
  isOpen,
  onClose,
  onRuleCreated,
}) => {
  if (!isOpen || !finding) return null;

  const [ruleName, setRuleName] = useState(`Rule: Auto-isolate on ${finding.detectionType.replace('_', ' ')}`);
  const [minConfidence, setMinConfidence] = useState(90);
  const [actions, setActions] = useState({
    lockDoors: true,
    dispatchPatrol: true,
    pushPagerDuty: false,
    recordHighRes: true,
    soundIntercom: false,
  });

  const handleSave = () => {
    onRuleCreated(ruleName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Create Operational Automation
              </h3>
              <p className="text-[11px] text-neutral-500">
                Automate real-time response triggers based on Nevrixa AI detections.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Rule Name */}
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800">Rule Name</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-[#016D5D]"
            />
          </div>

          {/* Trigger Condition Block */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
            <span className="font-semibold text-neutral-800 block">TRIGGER CONDITION (IF)</span>
            <div className="space-y-1 text-neutral-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#016D5D]" />
                <span>Detection Type: <strong className="text-neutral-900 font-mono">{finding.detectionType}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#016D5D]" />
                <span>Camera Feed: <strong className="text-neutral-900 font-mono">{finding.camera.id} ({finding.camera.name})</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#016D5D]" />
                <span>Location: <strong className="text-neutral-900">{finding.site}</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-neutral-600 mb-1">
                <span>Minimum Confidence Threshold</span>
                <span className="font-mono font-bold text-[#016D5D]">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full accent-[#016D5D]"
              />
            </div>
          </div>

          {/* Automated Actions Block */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 block uppercase tracking-wider text-[11px]">
              OPERATIONAL ACTIONS (THEN)
            </label>

            <div className="space-y-2">
              {[
                { key: 'lockDoors', label: 'Lock Access Control Doors', sub: 'Engage electromagnetic fail-secure locks on zone doors' },
                { key: 'dispatchPatrol', label: 'Dispatch Nearest Security Guard', sub: 'Push real-time incident coordinates to duty officer tablet' },
                { key: 'pushPagerDuty', label: 'Trigger PagerDuty / Webhook', sub: 'Notify enterprise SecOps on-call escalation channel' },
                { key: 'recordHighRes', label: 'Retain 4K Forensic Video Evidence', sub: 'Archive clip with 90-day compliance retention' },
              ].map((act) => (
                <label key={act.key} className="flex items-start gap-2.5 p-2 rounded border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(actions as any)[act.key]}
                    onChange={(e) => setActions({ ...actions, [act.key]: e.target.checked })}
                    className="mt-0.5 rounded text-[#016D5D] focus:ring-[#016D5D]"
                  />
                  <div>
                    <span className="font-semibold text-neutral-900 block">{act.label}</span>
                    <span className="text-[10px] text-neutral-500">{act.sub}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors shadow-xs"
          >
            Save Automation Rule
          </button>
        </div>
      </div>
    </div>
  );
};
