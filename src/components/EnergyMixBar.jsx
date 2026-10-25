import React from 'react';
import { Wind, Sun, Droplets, Atom, Flame, Factory } from 'lucide-react';

export function EnergyMixBar({ mix, renewablePercent }) {
  const getIcon = (source) => {
    switch (source.toLowerCase()) {
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-emerald-600" />;
      case 'solar':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'hydro':
        return <Droplets className="w-3.5 h-3.5 text-cyan-600" />;
      case 'nuclear':
        return <Atom className="w-3.5 h-3.5 text-violet-600" />;
      case 'natural gas':
        return <Flame className="w-3.5 h-3.5 text-slate-500" />;
      case 'coal':
      case 'coal/lignite':
        return <Factory className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Real-Time Generation Mix</h4>
          <p className="text-xs text-slate-500">Live energy sources powering active computing clusters</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {renewablePercent}% Clean Energy
          </span>
        </div>
      </div>

      {/* Stacked Percentage Bar */}
      <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5">
        {mix.map((item) => (
          <div
            key={item.source}
            style={{
              width: `${item.percent}%`,
              backgroundColor: item.color,
            }}
            title={`${item.source}: ${item.percent}%`}
            className="h-full rounded-sm transition-all duration-300 hover:opacity-85"
          />
        ))}
      </div>

      {/* Grid Legend with Percentages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100">
        {mix.map((item) => (
          <div key={item.source} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex items-center gap-1 min-w-0">
              {getIcon(item.source)}
              <span className="text-slate-600 truncate">{item.source}</span>
            </div>
            <span className="font-bold text-slate-900 ml-auto">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
