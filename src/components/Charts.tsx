import React, { useState } from 'react';
import { WEEKLY_TREND_DATA } from '../data/mockSafetyData';

export const SafetyTrendChart: React.FC = () => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const data = WEEKLY_TREND_DATA;
  const maxInspections = 26;
  const width = 640;
  const height = 220;
  const padL = 36;
  const padR = 20;
  const padT = 18;
  const padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = data.map((d, idx) => {
    const x = padL + (idx / (data.length - 1)) * chartW;
    const ySafety = padT + ((100 - d.safetyIndex) / 14) * chartH;
    const barH = (d.inspections / maxInspections) * (chartH * 0.75);
    const barY = padT + chartH - barH;
    return { ...d, x, ySafety, barH, barY };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.ySafety.toFixed(1)}`)
    .join(' ');

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0B1F3A]">7-Day Safety Index & Shift Inspection Volume</h3>
          <p className="text-xs text-slate-500">VKCM Pit & Surface Daily Compliance Trend</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#0B1F3A]/80 inline-block rounded-xs" />
            <span>Inspections</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#EA580C] inline-block" />
            <span>Safety Index (%)</span>
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" role="img" aria-label="7-Day Safety Index and Inspection Trend">
          {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
            const y = padT + t * chartH;
            return (
              <g key={idx}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x={padL - 8} y={y + 4} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                  {Math.round(100 - t * 14)}%
                </text>
              </g>
            );
          })}

          {points.map((p, idx) => (
            <g key={p.day}>
              <rect
                x={p.x - 16}
                y={p.barY}
                width={32}
                height={p.barH}
                rx={3}
                className={hoverIdx === idx ? 'fill-[#1E3A5F] transition-colors' : 'fill-[#0B1F3A]/18 transition-colors'}
              />
              <text x={p.x} y={height - 10} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                {p.day}
              </text>
            </g>
          ))}

          <path d={linePath} fill="none" stroke="#EA580C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, idx) => (
            <g
              key={`pt-${p.day}`}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.ySafety}
                r={hoverIdx === idx ? 5.5 : 4}
                className="fill-white stroke-[#EA580C] stroke-2"
              />
              <rect x={p.x - 24} y={padT} width={48} height={chartH} fill="transparent" />
            </g>
          ))}
        </svg>

        {hoverIdx !== null && (
          <div className="mt-2 px-3 py-2 bg-[#0B1F3A] text-white text-xs rounded-md flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">{points[hoverIdx].day}, 2026</span>
            <div className="flex items-center gap-4 font-mono tabular-nums">
              <span>Safety Index: {points[hoverIdx].safetyIndex}%</span>
              <span>Inspections: {points[hoverIdx].inspections}</span>
              <span>Hazards: {points[hoverIdx].hazards}</span>
              <span>Near Miss: {points[hoverIdx].nearMiss}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DepartmentBarChart: React.FC<{
  items: { label: string; score: number; openIssues: number }[];
}> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const barColor =
          item.score >= 93 ? 'bg-[#0B1F3A]' : item.score >= 88 ? 'bg-amber-600' : 'bg-[#EA580C]';
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 truncate pr-2">{item.label}</span>
              <span className="font-mono tabular-nums text-slate-600 shrink-0">
                {item.score}% · {item.openIssues} open
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-sm overflow-hidden">
              <div className={`h-full ${barColor} rounded-sm transition-all duration-300`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SafetyGauge: React.FC<{ value: number; target: number }> = ({ value, target }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value)) / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
          <circle cx="52" cy="52" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="9" />
          <circle
            cx="52"
            cy="52"
            r={radius}
            fill="none"
            stroke={value >= target ? '#EA580C' : '#DC2626'}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono tabular-nums text-[#0B1F3A]">{value}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">Target Threshold: {target}.0</p>
        <p className="text-sm font-semibold text-[#0B1F3A] mt-0.5">
          {value >= target ? 'Above Target Band' : 'Below Target — Action Needed'}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Composite of inspection closure, LTI-free days, and CAPA timeliness.
        </p>
      </div>
    </div>
  );
};
