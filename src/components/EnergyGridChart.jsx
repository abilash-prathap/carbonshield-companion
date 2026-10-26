import React, { useState } from 'react';

const HOURLY_DATA = [
  { time: '00:00', computeKw: 110, intensity: 175, isClean: true },
  { time: '02:00', computeKw: 145, intensity: 130, isClean: true },
  { time: '04:00', computeKw: 160, intensity: 118, isClean: true },
  { time: '06:00', computeKw: 120, intensity: 180, isClean: true },
  { time: '08:00', computeKw: 80, intensity: 195, isClean: false },
  { time: '10:00', computeKw: 165, intensity: 220, isClean: false },
  { time: '12:00', computeKw: 75, intensity: 270, isClean: false },
  { time: '14:00', computeKw: 90, intensity: 295, isClean: false },
  { time: '16:00', computeKw: 115, intensity: 310, isClean: false },
  { time: '18:00', computeKw: 155, intensity: 290, isClean: false },
  { time: '20:00', computeKw: 105, intensity: 240, isClean: false },
  { time: '22:00', computeKw: 85, intensity: 190, isClean: true },
];

export function EnergyGridChart() {
  const [hoveredIndex, setHoveredIndex] = useState(4); // Default tooltip like screenshot at 08:00

  const width = 600;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxKw = 180;
  const maxIntensity = 320;

  const getX = (i) => paddingLeft + (i / (HOURLY_DATA.length - 1)) * chartWidth;
  const getKwY = (val) => paddingTop + chartHeight - (val / maxKw) * chartHeight;
  const getIntensityY = (val) => paddingTop + chartHeight - (val / maxIntensity) * chartHeight;

  // Compute points for intensity curve
  const intensityPoints = HOURLY_DATA.map((d, i) => `${getX(i)},${getIntensityY(d.intensity)}`);
  const intensityPath = `M ${intensityPoints.join(' L ')}`;

  const active = hoveredIndex !== null ? HOURLY_DATA[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#0B1220] tracking-tight font-heading">
            Energy Draw vs. Grid Carbon Intensity
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Server workload load (kWh) synchronized with marginal emissions (gCO₂e/kWh)
          </p>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#123C2D] font-bold text-xs self-start sm:self-auto border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Clean Window Active</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Y-Axes Left (kW) */}
          {[180, 135, 90, 45, 0].map((kw) => {
            const y = getKwY(kw);
            return (
              <g key={`kw-${kw}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F8FAFC"
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
                  {kw} kW
                </text>
              </g>
            );
          })}

          {/* Y-Axes Right (gCO2) */}
          {[320, 240, 160, 80].map((g) => {
            const y = getIntensityY(g);
            return (
              <text
                key={`g-${g}`}
                x={width - paddingRight + 8}
                y={y + 3.5}
                textAnchor="start"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="Inter, sans-serif"
              >
                {g} g
              </text>
            );
          })}

          {/* Workload Compute Bars */}
          {HOURLY_DATA.map((d, i) => {
            const x = getX(i);
            const barW = chartWidth / HOURLY_DATA.length * 0.55;
            const barY = getKwY(d.computeKw);
            const barH = height - paddingBottom - barY;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={`bar-${d.time}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <rect
                  x={x - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx="3"
                  fill={isHovered ? '#CBD5E1' : d.isClean ? '#123C2D' : '#E2E8F0'}
                  className="transition-colors duration-150"
                />
              </g>
            );
          })}

          {/* Grid Carbon Intensity Dotted Curve */}
          <path
            d={intensityPath}
            fill="none"
            stroke="#DC2626"
            strokeWidth="1.8"
            strokeDasharray="3 3"
          />

          {/* Points on the intensity curve */}
          {HOURLY_DATA.map((d, i) => {
            const x = getX(i);
            const y = getIntensityY(d.intensity);
            const isHovered = hoveredIndex === i;

            return (
              <circle
                key={`dot-${d.time}`}
                cx={x}
                cy={y}
                r={isHovered ? 5 : 2.5}
                fill={isHovered ? '#10B981' : d.isClean ? '#10B981' : '#DC2626'}
                stroke="#FFFFFF"
                strokeWidth={isHovered ? 2 : 1}
              />
            );
          })}

          {/* X-axis labels */}
          {HOURLY_DATA.filter((_, i) => i % 2 === 0).map((d) => {
            const idx = HOURLY_DATA.findIndex((item) => item.time === d.time);
            return (
              <text
                key={`lbl-${d.time}`}
                x={getX(idx)}
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
        </svg>

        {/* Floating Tooltip (Screenshot-faithful styling) */}
        {active && (
          <div
            className="absolute pointer-events-none bg-[#0B1220] text-white px-3 py-2 rounded-xl text-xs shadow-xl z-20 transition-all duration-150 border border-white/10"
            style={{
              left: `${Math.min(78, Math.max(22, (hoveredIndex / (HOURLY_DATA.length - 1)) * 100))}%`,
              top: '25%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-slate-300 border-b border-white/10 pb-1 mb-1.5 flex items-center justify-between gap-2">
              <span>{active.time} UTC</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${active.isClean ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'}`}>
                {active.isClean ? 'Clean Window' : 'Grid Peak'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300 text-[11px]">
              <span>Compute Batch:</span>
              <strong className="text-emerald-400 font-mono">{active.computeKw} kW</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300 text-[11px] mt-0.5">
              <span>Grid Intensity:</span>
              <strong className="text-white font-mono">{active.intensity} gCO₂e/kWh</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
