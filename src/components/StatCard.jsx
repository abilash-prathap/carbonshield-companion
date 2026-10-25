import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export function StatCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs baseline',
  accentColor = 'emerald', // emerald, teal, sky, amber
  progress,
  badgeText,
  isSimulated = false,
  tooltip,
}) {
  const isTrendPositive = trend !== undefined && trend > 0;
  const isTrendNegative = trend !== undefined && trend < 0;

  const colorStyles = {
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      borderAccent: 'hover:border-emerald-300',
      progressFill: 'bg-emerald-600',
    },
    teal: {
      bgIcon: 'bg-teal-50 text-teal-700 border-teal-100',
      borderAccent: 'hover:border-teal-300',
      progressFill: 'bg-teal-600',
    },
    sky: {
      bgIcon: 'bg-sky-50 text-sky-700 border-sky-100',
      borderAccent: 'hover:border-sky-300',
      progressFill: 'bg-sky-600',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-700 border-amber-100',
      borderAccent: 'hover:border-amber-300',
      progressFill: 'bg-amber-500',
    },
  };

  const style = colorStyles[accentColor] || colorStyles.emerald;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group ${style.borderAccent}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-xl border ${style.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">{title}</span>
              {isSimulated && (
                <span className="text-[10px] px-1.5 py-0.2 font-medium bg-slate-100 text-slate-500 rounded border border-slate-200">
                  Simulated
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {badgeText && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
        </div>

        {/* Progress bar if present */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className="text-slate-800 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${style.progressFill}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Trend Indicator */}
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded ${
                isTrendNegative
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isTrendNegative ? (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
              )}
              {Math.abs(trend)}%
            </span>
            <span className="text-slate-400 font-medium">{trendLabel}</span>
          </div>
        )}
      </div>

      {tooltip && (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{tooltip}</span>
        </div>
      )}
    </div>
  );
}
