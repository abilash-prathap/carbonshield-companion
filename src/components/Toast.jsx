import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
        };

        const borderColors = {
          success: 'border-emerald-200 bg-white shadow-lg',
          error: 'border-rose-200 bg-white shadow-lg',
          info: 'border-teal-200 bg-white shadow-lg',
          warning: 'border-amber-200 bg-white shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 animate-slideUp ${
              borderColors[toast.type] || borderColors.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-slate-900 text-sm">{toast.title}</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
