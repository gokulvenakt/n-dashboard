import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Radio } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-neutral-900 text-white rounded-lg p-3.5 shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-150"
        >
          {toast.type === 'alert' ? (
            <Radio className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#8FF2E2] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white">{toast.title}</h4>
            {toast.message && (
              <p className="text-[11px] text-neutral-300 mt-0.5">{toast.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
