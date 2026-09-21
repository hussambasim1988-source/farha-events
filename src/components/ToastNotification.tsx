import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Info, 
  X, 
  PartyPopper, 
  ExternalLink,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type ToastType = 'celebration' | 'success' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: string;
  bookingId?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number; // duration in ms, default 5000
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      className="fixed top-4 left-4 right-4 sm:right-auto sm:left-6 z-[9999] flex flex-col gap-3 max-w-md pointer-events-none"
      dir="rtl"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const SingleToast: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5500;

  useEffect(() => {
    // If it's a celebration toast (e.g. status changed from pending to confirmed), fire celebratory confetti!
    if (toast.type === 'celebration') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.3, x: 0.5 },
          colors: ['#059669', '#10b981', '#f59e0b', '#e11d48', '#3b82f6'],
        });
      } catch (e) {
        console.log('Confetti effect executed', e);
      }
    }

    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onDismiss(toast.id);
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss, toast.type]);

  const config = {
    celebration: {
      bg: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-emerald-500/50',
      badgeBg: 'bg-emerald-500 text-white',
      icon: PartyPopper,
      iconColor: 'text-emerald-400',
      progressBar: 'bg-gradient-to-r from-emerald-400 to-amber-400',
      accentTag: '🎉 تأكيد فوري للحجز',
    },
    success: {
      bg: 'bg-slate-900 text-white border-emerald-500/40',
      badgeBg: 'bg-emerald-500 text-white',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      progressBar: 'bg-emerald-500',
      accentTag: '✅ تحديث الحالة',
    },
    warning: {
      bg: 'bg-slate-900 text-white border-amber-500/40',
      badgeBg: 'bg-amber-500 text-slate-950',
      icon: AlertCircle,
      iconColor: 'text-amber-400',
      progressBar: 'bg-amber-500',
      accentTag: '⚠️ تنبيه',
    },
    info: {
      bg: 'bg-slate-900 text-white border-blue-500/40',
      badgeBg: 'bg-blue-500 text-white',
      icon: Info,
      iconColor: 'text-blue-400',
      progressBar: 'bg-blue-500',
      accentTag: 'ℹ️ إشعار جديد',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto w-full rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4 overflow-hidden relative ${config.bg}`}
    >
      {/* Top Accent Pill */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/10">
            {config.accentTag}
          </span>
          {toast.bookingId && (
            <span className="text-[10px] font-mono font-bold text-slate-400">
              #{toast.bookingId}
            </span>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title="إغلاق الإشعار"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Toast Content */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-black text-white leading-tight">
            {toast.title}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {toast.message}
          </p>

          {/* Action button if provided */}
          {toast.actionLabel && toast.onAction && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-white/20"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>{toast.actionLabel}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Expiration Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div 
          className={`h-full transition-all duration-75 ${config.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
