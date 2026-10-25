import React from 'react';
import { Clock, CheckCircle2, Play, AlertCircle, Sparkles, Zap, ShieldAlert } from 'lucide-react';

export function TaskStatusBadge({ status, size = 'sm' }) {
  const normalized = (status || '').toLowerCase();

  const configs = {
    running: {
      label: 'Running',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 animate-ping',
      solidDot: 'bg-emerald-500',
      icon: Play,
    },
    scheduled: {
      label: 'Scheduled',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: '',
      solidDot: 'bg-sky-500',
      icon: Clock,
    },
    deferred: {
      label: 'Deferred for Eco-Window',
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      dot: 'bg-teal-500 animate-pulse',
      solidDot: 'bg-teal-600',
      icon: Sparkles,
    },
    completed: {
      label: 'Completed',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: '',
      solidDot: 'bg-emerald-600',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: '',
      solidDot: 'bg-rose-500',
      icon: AlertCircle,
    },
  };

  const config = configs[normalized] || configs.scheduled;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${config.bg}`}
    >
      <span className="relative flex h-2 w-2">
        {config.dot && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.solidDot}`} />
      </span>
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const isUrgent = priority === 'urgent';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
        isUrgent
          ? 'bg-rose-100 text-rose-700 border border-rose-200'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      }`}
    >
      {isUrgent ? <Zap className="w-3 h-3 text-rose-600" /> : <Sparkles className="w-3 h-3 text-emerald-600" />}
      {isUrgent ? 'Urgent' : 'Flexible'}
    </span>
  );
}
