import React, { useState } from 'react';

const DATA_POINTS = [
  { time: '00:00', baseline: 140, optimized: 85 },
  { time: '02:00', baseline: 125, optimized: 80 },
  { time: '04:00', baseline: 130, optimized: 82 },
  { time: '06:00', baseline: 190, optimized: 95 },
  { time: '08:00', baseline: 260, optimized: 120 },
  { time: '10:00', baseline: 245, optimized: 145 },
  { time: '12:00', baseline: 210, optimized: 155 },
  { time: '14:00', baseline: 235, optimized: 150 },
  { time: '16:00', baseline: 290, optimized: 145 },
  { time: '18:00', baseline: 335, optimized: 130 },
  { time: '20:00', baseline: 280, optimized: 105 },
  { time: '22:00', baseline: 185, optimized: 90 },
  { time: '24:00', baseline: 140, optimized: 85 },
];

export function CarbonEmissionsChart() {
  const [hoverIndex, setHoverIndex] = useState(null);

  const width = 600;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 360;

  const getX = (index) => paddingLeft + (index / (DATA_POINTS.length - 1)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  // Build SVG smooth path strings
  const baselinePoints = DATA_POINTS.map((d, i) => `${getX(i)},${getY(d.baseline)}`);
  const optimizedPoints = DATA_POINTS.map((d, i) => `${getX(i)},${getY(d.optimized)}`);

  const baselinePath = `M ${baselinePoints.join(' L ')}`;
  const optimizedPath = `M ${optimizedPoints.join(' L ')}`;
  const areaPath = `M ${getX(0)},${getY(0)} L ${optimizedPoints.join(' L ')} L ${getX(DATA_POINTS.length - 1)},${getY(0)} Z`;

  const activePoint = hoverIndex !== null ? DATA_POINTS[hoverIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#0B1220] tracking-tight font-heading">
            AI Carbon Emissions
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Baseline unconstrained inference vs. Carbon-Aware scheduled execution
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-slate-400" />
            <span>Baseline (Unmanaged)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-[#0B1220] font-semibold">Optimized</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="optGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y labels */}
          {[360, 270, 180, 90, 0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontFamily="Inter, sans-serif"
                >
                  {val === 0 ? '0' : `${val} kg`}
                </text>
              </g>
            );
          })}

          {/* Area under optimized line */}
          <path d={areaPath} fill="url(#optGradient)" />

          {/* Baseline dashed path */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />

          {/* Optimized solid line */}
          <path
            d={optimizedPath}
            fill="none"
            stroke="#123C2D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* X-axis labels */}
          {DATA_POINTS.filter((_, i) => i % 2 === 0).map((d, i) => {
            const actualIndex = i * 2;
            return (
              <text
                key={d.time}
                x={getX(actualIndex)}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="Inter, sans-serif"
              >
                {d.time}
              </text>
            );
          })}

          {/* Hover interaction overlay triggers */}
          {DATA_POINTS.map((d, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;
            return (
              <g key={d.time}>
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={height - paddingBottom}
                      stroke="#10B981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={getY(d.baseline)} r="4" fill="#94A3B8" />
                    <circle cx={x} cy={getY(d.optimized)} r="5" fill="#123C2D" stroke="#FFFFFF" strokeWidth="2" />
                  </>
                )}
                <rect
                  x={x - chartWidth / (DATA_POINTS.length * 2)}
                  y={paddingTop}
                  width={chartWidth / DATA_POINTS.length}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="absolute pointer-events-none bg-[#0B1220] text-white px-3 py-2 rounded-xl text-[11px] shadow-lg z-20 transition-all duration-150"
            style={{
              left: `${Math.min(80, Math.max(20, (hoverIndex / (DATA_POINTS.length - 1)) * 100))}%`,
              top: '10%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-slate-300 border-b border-white/10 pb-1 mb-1">
              {activePoint.time} UTC Telemetry
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span>Baseline:</span>
              <span className="font-mono text-white">{activePoint.baseline} kg CO₂</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-400 font-semibold">
              <span>Optimized:</span>
              <span className="font-mono">{activePoint.optimized} kg CO₂</span>
            </div>
            <div className="text-[10px] text-emerald-300 mt-1 font-medium">
              Avoided: -{Math.round(((activePoint.baseline - activePoint.optimized) / activePoint.baseline) * 100)}% emissions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
