import React, { useState } from 'react';
import { X, AlertOctagon, ShieldAlert, PhoneCall, Radio, Send, Check } from 'lucide-react';
import { Finding } from '../types/findings';

interface EscalateModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  onEscalateConfirm: (findingId: string, level: string, comment: string) => void;
}

export const EscalateModal: React.FC<EscalateModalProps> = ({
  finding,
  isOpen,
  onClose,
  onEscalateConfirm,
}) => {
  if (!isOpen || !finding) return null;

  const [escalationLevel, setEscalationLevel] = useState<'tier1' | 'tier2' | 'executive'>('tier1');
  const [comment, setComment] = useState('Immediate dispatch required: physical breach confirmed on camera.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onEscalateConfirm(finding.id, escalationLevel, comment);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-red-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 bg-red-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Escalate Finding to Security Command
              </h3>
              <p className="text-[11px] text-neutral-500">
                Dispatches high-priority alert to on-duty response personnel.
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
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
            <div className="font-semibold text-neutral-900">{finding.title}</div>
            <div className="text-neutral-500">{finding.subtitle} · {finding.site} ({finding.camera.id})</div>
            <div className="text-[11px] font-mono text-neutral-600 pt-1">
              Detected at: {finding.detectedAt}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 block">
              Escalation Destination
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'tier1', title: 'On-Duty Security Patrol Unit (Field)', sub: 'Dispatches active radio alert & location pin to floor guards' },
                { id: 'tier2', title: 'Central SOC Operations Desk Lead', sub: 'Pushes high-priority queue item to console supervisor' },
                { id: 'executive', title: 'Facility Director & Incident Commander', sub: 'Urgent notification via SMS & push alert' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setEscalationLevel(tier.id as any)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    escalationLevel === tier.id
                      ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">{tier.title}</span>
                    {escalationLevel === tier.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </div>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-800">
              Escalation Brief / Instructions
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-red-500"
            />
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
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Escalation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
