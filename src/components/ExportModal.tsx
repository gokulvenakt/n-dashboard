import React, { useState } from 'react';
import { X, Download, FileText, Table, FileCode, Video, CheckCircle2 } from 'lucide-react';
import { Finding } from '../types/findings';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  findings: Finding[];
  onExportComplete: (format: string, filename: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  findings,
  onExportComplete,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json' | 'video'>('pdf');
  const [includeVideoClips, setIncludeVideoClips] = useState(true);
  const [includeAiExplainability, setIncludeAiExplainability] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const filename = `nevrixa_findings_${selectedFormat}_${new Date().toISOString().slice(0, 10)}.${selectedFormat === 'video' ? 'zip' : selectedFormat}`;
      onExportComplete(selectedFormat.toUpperCase(), filename);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Export Findings & Evidence Packet
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Generate certified operational dossiers for compliance, security, and audits.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="text-xs text-neutral-600">
            Exporting <strong className="text-neutral-900 font-mono font-semibold">{findings.length}</strong> findings based on your active filters.
          </div>

          {/* Format Options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
              Select Output Format
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'pdf', title: 'Executive PDF Dossier', desc: 'Forensic incident summaries & still frames', icon: FileText },
                { id: 'csv', title: 'SIEM / CSV Table', desc: 'Normalized spreadsheet for data lake', icon: Table },
                { id: 'json', title: 'Raw JSON Telemetry', desc: 'Full bounding boxes & model vector coordinates', icon: FileCode },
                { id: 'video', title: 'Video Clip Bundle', desc: 'MP4 forensic clips with burnt-in HUD metadata', icon: Video },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-[#016D5D] bg-[#E6F4F1]/60 ring-1 ring-[#016D5D]'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#016D5D]' : 'text-neutral-500'}`} />
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#016D5D]" />}
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">{fmt.title}</span>
                    <span className="text-[10px] text-neutral-500 leading-tight">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Options */}
          <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAiExplainability}
                onChange={(e) => setIncludeAiExplainability(e.target.checked)}
                className="rounded text-[#016D5D] focus:ring-[#016D5D]"
              />
              <span className="text-neutral-700">Include &ldquo;Why detected&rdquo; AI explainability audit logs</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVideoClips}
                onChange={(e) => setIncludeVideoClips(e.target.checked)}
                className="rounded text-[#016D5D] focus:ring-[#016D5D]"
              />
              <span className="text-neutral-700">Attach cryptographic HMAC digital watermark & verification hash</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
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
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating Packet...' : 'Download Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
