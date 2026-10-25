import React, { useState } from 'react';
import { Info, TrendingDown, Sparkles } from 'lucide-react';

export function ImpactChart({ timeframe = '7d' }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeMetric, setActiveMetric] = useState('carbon'); // 'carbon' or 'cost'

  // Daily datasets: Baseline vs Optimized
  const data7Days = [
    { day: 'Mon', date: 'Oct 19', baselineG: 3400, optimizedG: 1650, costBaseline: 42, costOptimized: 26 },
    { day: 'Tue', date: 'Oct 20', baselineG: 4100, optimizedG: 1980, costBaseline: 55, costOptimized: 31 },
    { day: 'Wed', date: 'Oct 21', baselineG: 3800, optimizedG: 1720, costBaseline: 48, costOptimized: 28 },
    { day: 'Thu', date: 'Oct 22', baselineG: 5200, optimizedG: 2100, costBaseline: 68, costOptimized: 34 },
    { day: 'Fri', date: 'Oct 23', baselineG: 4600, optimizedG: 1890, costBaseline: 59, costOptimized: 30 },
    { day: 'Sat', date: 'Oct 24', baselineG: 2900, optimizedG: 920, costBaseline: 35, costOptimized: 14 },
    { day: 'Sun', date: 'Oct 25', baselineG: 3100, optimizedG: 1040, costBaseline: 38, costOptimized: 16 },
  ];

  const currentData = data7Days;
  const maxVal = Math.max(...currentData.map((d) => (activeMetric === 'carbon' ? d.baselineG : d.costBaseline)));

  // Totals
  const totalBaseline = currentData.reduce((acc, d) => acc + (activeMetric === 'carbon' ? d.baselineG : d.costBaseline), 0);
  const totalOptimized = currentData.reduce((acc, d) => acc + (activeMetric === 'carbon' ? d.optimizedG : d.costOptimized), 0);
  const totalSaved = totalBaseline - totalOptimized;
  const percentSaved = Math.round((totalSaved / totalBaseline) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Baseline vs. CarbonShield Optimized</h3>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              -{percentSaved}% Emissions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulated comparison between unoptimized peak on-demand execution vs green-window scheduled runs.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('carbon')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'carbon' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emissions (gCO₂e)
          </button>
          <button
            onClick={() => setActiveMetric('cost')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'cost' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cost ($ USD)
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Unoptimized Baseline</div>
          <div className="text-base sm:text-lg font-bold text-slate-700 mt-0.5">
            {activeMetric === 'carbon' ? `${(totalBaseline / 1000).toFixed(1)} kg` : `$${totalBaseline}`}
          </div>
        </div>
        <div className="border-x border-slate-200">
          <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Optimized Runs</div>
          <div className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5">
            {activeMetric === 'carbon' ? `${(totalOptimized / 1000).toFixed(1)} kg` : `$${totalOptimized}`}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-teal-700 uppercase tracking-wider">Net Avoided</div>
          <div className="text-base sm:text-lg font-bold text-teal-800 mt-0.5 flex items-center justify-center gap-1">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            {activeMetric === 'carbon' ? `${(totalSaved / 1000).toFixed(1)} kg` : `$${totalSaved}`}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" />
            <span className="text-slate-600 font-medium">Standard Peak Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
            <span className="text-emerald-800 font-bold">CarbonShield Optimized</span>
          </div>
        </div>
        <span className="hidden sm:inline text-[11px] text-slate-400">Hover bar for daily breakdown</span>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative pt-2 pb-2">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 px-2">
          {currentData.map((item, idx) => {
            const bVal = activeMetric === 'carbon' ? item.baselineG : item.costBaseline;
            const oVal = activeMetric === 'carbon' ? item.optimizedG : item.costOptimized;
            const bHeight = Math.max(12, (bVal / maxVal) * 100);
            const oHeight = Math.max(8, (oVal / maxVal) * 100);
            const isHovered = selectedDay === idx;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setSelectedDay(idx)}
                onMouseLeave={() => setSelectedDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-lg pointer-events-none whitespace-nowrap animate-fadeIn">
                    <div className="font-bold text-emerald-400">{item.day} · {item.date}</div>
                    <div className="text-[11px] text-slate-300">
                      Baseline: {activeMetric === 'carbon' ? `${item.baselineG} g` : `$${item.costBaseline}`}
                    </div>
                    <div className="text-[11px] text-emerald-300 font-semibold">
                      Optimized: {activeMetric === 'carbon' ? `${item.optimizedG} g` : `$${item.costOptimized}`} (
                      -{Math.round(((bVal - oVal) / bVal) * 100)}%)
                    </div>
                  </div>
                )}

                {/* Bars comparison group */}
                <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-44">
                  {/* Baseline Bar */}
                  <div
                    style={{ height: `${bHeight}%` }}
                    className={`w-1/2 rounded-t-md transition-all duration-300 ${
                      isHovered ? 'bg-slate-400' : 'bg-slate-200'
                    }`}
                  />
                  {/* Optimized Bar */}
                  <div
                    style={{ height: `${oHeight}%` }}
                    className={`w-1/2 rounded-t-md transition-all duration-300 relative ${
                      isHovered ? 'bg-emerald-500 shadow-md' : 'bg-emerald-600'
                    }`}
                  >
                    {/* Glow dot on top of optimized bar */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  </div>
                </div>

                {/* X Axis Label */}
                <div className="mt-3 text-center">
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isHovered ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {item.day}
                  </span>
                  <div className="text-[10px] text-slate-400">{item.date.split(' ')[1]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Average reduction: <strong>58.4% gCO₂e</strong> per AI batch job</span>
        </div>
        <span className="text-[11px] text-slate-400">Marginal Grid Model</span>
      </div>
    </div>
  );
}
