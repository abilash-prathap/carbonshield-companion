import React, { useState } from 'react';
import { HOURLY_GRID_FORECAST } from '../services/mockData';
import { Sparkles, Sun, Wind, Clock, Info } from 'lucide-react';

export function GridForecastChart({ region, compact = false }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const forecast = HOURLY_GRID_FORECAST;
  const maxIntensity = 420;
  const minIntensity = 80;
  const range = maxIntensity - minIntensity;

  // Chart SVG dimensions
  const svgWidth = 720;
  const svgHeight = compact ? 120 : 180;
  const paddingX = 24;
  const paddingY = 20;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Compute points
  const points = forecast.map((d, i) => {
    const x = paddingX + (i / (forecast.length - 1)) * chartWidth;
    const normY = (d.intensity - minIntensity) / range;
    const y = svgHeight - paddingY - normY * chartHeight;
    return { ...d, x, y };
  });

  // Create SVG path
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Catmull-Rom or cubic spline
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  // Closed area path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${
    svgHeight - paddingY
  } Z`;

  // Find green window indices (e.g. 02:00 to 05:00)
  const greenStart = points[2]; // 02:00
  const greenEnd = points[5]; // 05:00

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[3]; // Default to peak clean window point

  return (
    <div className={`bg-white rounded-2xl ${compact ? 'p-4' : 'p-6'} border border-slate-200/90 shadow-xs`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              24-Hour Carbon Intensity Forecast
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Green Window in {region?.nextWindowIn || '3h 15m'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zone: <span className="font-semibold text-slate-700">{region?.name || 'EU-West (Ireland)'}</span> · 
            Current: <strong className="text-emerald-700">{region?.currentIntensity || 142} gCO₂/kWh</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium text-[11px]">Optimal Window (&lt;160g)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-600 font-medium text-[11px]">Fossil Peak (&gt;300g)</span>
          </div>
        </div>
      </div>

      {/* Forecast Chart Visual */}
      <div className="relative overflow-hidden w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Threshold grid lines */}
            <linearGradient id="greenWindowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Optimal Window Highlight Box */}
          <rect
            x={greenStart.x - 10}
            y={paddingY}
            width={greenEnd.x - greenStart.x + 20}
            height={chartHeight}
            fill="url(#greenWindowGrad)"
            rx="6"
          />

          {/* Dashed Threshold Line for Clean Grid (150g) */}
          <line
            x1={paddingX}
            y1={svgHeight - paddingY - ((160 - minIntensity) / range) * chartHeight}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY - ((160 - minIntensity) / range) * chartHeight}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.6"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#carbonGradient)" />

          {/* Main Forecast Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover / Interactive Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            const isCleanWindow = p.isGreen;

            return (
              <g
                key={p.time}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover target */}
                <rect
                  x={p.x - 12}
                  y={paddingY}
                  width="24"
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Point circle */}
                {(isHovered || isCleanWindow || idx % 4 === 0) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : isCleanWindow ? 4 : 3}
                    className={`transition-all duration-150 ${
                      isCleanWindow
                        ? 'fill-emerald-500 stroke-white stroke-2'
                        : isHovered
                        ? 'fill-slate-900 stroke-white stroke-2'
                        : 'fill-slate-400'
                    }`}
                  />
                )}
              </g>
            );
          })}

          {/* Active Hover Cursor Line */}
          {hoveredIdx !== null && (
            <line
              x1={points[hoveredIdx].x}
              y1={paddingY}
              x2={points[hoveredIdx].x}
              y2={svgHeight - paddingY}
              stroke="#0f766e"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Dynamic Tooltip Banner */}
        <div className="mt-3 flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-800">
              {activePoint.time} UTC:
            </span>
            <span className="font-bold text-emerald-700">
              {activePoint.intensity} gCO₂/kWh
            </span>
            <span className="text-slate-500 hidden sm:inline">
              ({activePoint.label})
            </span>
          </div>

          <div className="flex items-center gap-2 text-right">
            {activePoint.isGreen ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                ⚡ Recommended Scheduling Window
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Carbon intensity above optimal threshold
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
