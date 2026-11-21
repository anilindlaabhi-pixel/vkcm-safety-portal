import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  MapPin,
  Mountain,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { downloadCsv, SeverityText, StatusLabel } from './StatusText';

/* ============================================================================
 * 1. HAUL ROAD & TRAFFIC SAFETY (Interactive Corridor Schematic + Register)
 * ========================================================================== */
export const HaulRoadModuleView: React.FC = () => {
  const { haulRoads, openCreateModal, globalSearch } = useSafety();
  const [selectedSegId, setSelectedSegId] = useState<string>(haulRoads[0]?.segmentId || 'SEG-A1');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');

  const query = (localSearch || globalSearch).toLowerCase();
  const filtered = haulRoads.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchQ =
      !query ||
      r.segmentName.toLowerCase().includes(query) ||
      r.segmentId.toLowerCase().includes(query) ||
      r.inspector.toLowerCase().includes(query);
    return matchStatus && matchQ;
  });

  const activeSeg = haulRoads.find((r) => r.segmentId === selectedSegId) || haulRoads[0];

  const handleExport = () => {
    downloadCsv(
      'vkcm_haul_road_safety.csv',
      ['ID', 'Segment', 'Name', 'Shift', 'Speed Limit (km/h)', 'Berm Height (m)', 'Gradient %', 'Dust Suppression', 'Illumination', 'Status', 'Inspector'],
      filtered.map((r) => [
        r.id,
        r.segmentId,
        r.segmentName,
        r.shift,
        r.speedLimitKmh,
        r.bermHeightM,
        r.gradientPct,
        r.dustSuppression,
        r.illuminationStatus,
        r.status,
        r.inspector,
      ])
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0B1F3A]">VKCM Pit-to-CHP Haul Road Corridor Monitor</h2>
            <p className="text-xs text-slate-500">
              Select a haul road segment on the mine schematic to inspect berm height, gradient, speed limits, and dust control
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => openCreateModal('haul-road')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Road Check</span>
            </button>
          </div>
        </div>

        {/* Interactive Schematic + Selected Segment Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="lg:col-span-2 bg-[#0B1F3A] rounded-lg p-4 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-medium">Schematic Haulage Network · Quarry Bench-4 to CHP / South OB Dump</span>
              <span className="font-mono text-[11px]">Min Berm: 1.50m</span>
            </div>

            <svg viewBox="0 0 720 230" className="w-full h-auto" role="img" aria-label="VKCM Haul Road Schematic">
              {/* Background grid lines */}
              <rect x="0" y="0" width="720" height="230" rx="6" fill="#0F294A" />
              <line x1="20" y1="60" x2="700" y2="60" stroke="#1E3A5F" strokeDasharray="4 4" />
              <line x1="20" y1="120" x2="700" y2="120" stroke="#1E3A5F" strokeDasharray="4 4" />
              <line x1="20" y1="180" x2="700" y2="180" stroke="#1E3A5F" strokeDasharray="4 4" />

              {/* Main Haulage Path */}
              <path d="M 65 170 L 210 170 L 350 110 L 510 110 L 645 65" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 510 110 L 645 175" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />

              {/* Segment A1 */}
              <line x1="65" y1="170" x2="210" y2="170" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
              {/* Segment A2 */}
              <line x1="210" y1="170" x2="350" y2="110" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
              {/* Segment B1 */}
              <line x1="350" y1="110" x2="510" y2="110" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
              {/* Segment C1 */}
              <line x1="510" y1="110" x2="645" y2="65" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
              {/* Segment D1 */}
              <line x1="510" y1="110" x2="645" y2="175" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />

              {/* Clickable Segment Nodes */}
              {[
                { id: 'SEG-A1', cx: 135, cy: 170, label: 'SEG-A1: Bench-4 Exit', color: '#10B981' },
                { id: 'SEG-A2', cx: 280, cy: 140, label: 'SEG-A2: Ramp-2 (420m)', color: '#F59E0B' },
                { id: 'SEG-B1', cx: 430, cy: 110, label: 'SEG-B1: Junction J-3', color: '#F59E0B' },
                { id: 'SEG-C1', cx: 585, cy: 85, label: 'SEG-C1: CHP Corridor', color: '#10B981' },
                { id: 'SEG-D1', cx: 585, cy: 145, label: 'SEG-D1: South OB Ramp', color: '#EF4444' },
              ].map((node) => {
                const isSelected = selectedSegId === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedSegId(node.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? 12 : 8}
                      fill={node.color}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={node.cx}
                      y={node.cy - 16}
                      textAnchor="middle"
                      className="fill-white text-[10px] font-semibold"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}

              {/* Landmark Labels */}
              <text x="55" y="205" className="fill-slate-300 text-[10px] font-mono">QUARRY FACE</text>
              <text x="610" y="45" className="fill-slate-300 text-[10px] font-mono">CHP HOPPER</text>
              <text x="595" y="205" className="fill-slate-300 text-[10px] font-mono">SOUTH OB DUMP</text>
            </svg>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Safe Corridor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Caution / Speed Restricted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Restricted / Urgent Action
              </span>
            </div>
          </div>

          {/* Selected Segment Details */}
          {activeSeg && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-[#EA580C]">{activeSeg.segmentId}</span>
                  <StatusLabel status={activeSeg.status} />
                </div>
                <h3 className="text-sm font-bold text-[#0B1F3A] mt-1">{activeSeg.segmentName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspected by {activeSeg.inspector} · {activeSeg.date}
                </p>

                <dl className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <dt className="text-slate-500">Speed Limit</dt>
                    <dd className="text-base font-bold font-mono tabular-nums text-[#0B1F3A] mt-0.5">
                      {activeSeg.speedLimitKmh} km/h
                    </dd>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <dt className="text-slate-500">Berm Height</dt>
                    <dd
                      className={`text-base font-bold font-mono tabular-nums mt-0.5 ${
                        activeSeg.bermHeightM < activeSeg.requiredBermM ? 'text-red-700' : 'text-emerald-700'
                      }`}
                    >
                      {activeSeg.bermHeightM.toFixed(2)} m
                    </dd>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <dt className="text-slate-500">Road Gradient</dt>
                    <dd className="text-base font-bold font-mono tabular-nums text-[#0B1F3A] mt-0.5">
                      {activeSeg.gradientPct}%
                    </dd>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2.5">
                    <dt className="text-slate-500">Dust Suppression</dt>
                    <dd className="mt-1">
                      <StatusLabel status={activeSeg.dustSuppression} />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Illumination: {activeSeg.illuminationStatus}</span>
                <span className="font-mono">DGMS Min Berm: {activeSeg.requiredBermM}m</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit Register Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {['All', 'Safe', 'Caution', 'Restricted'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  statusFilter === tab ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter corridor segments..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Segment</th>
                <th className="py-2.5 px-4">Corridor Name</th>
                <th className="py-2.5 px-4 text-right">Speed</th>
                <th className="py-2.5 px-4 text-right">Berm (m)</th>
                <th className="py-2.5 px-4 text-right">Gradient</th>
                <th className="py-2.5 px-4">Dust Control</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedSegId(r.segmentId)}
                  className={`hover:bg-slate-50 cursor-pointer ${
                    selectedSegId === r.segmentId ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#0B1F3A] whitespace-nowrap">{r.segmentId}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{r.segmentName}</div>
                    <div className="text-[11px] text-slate-500">{r.inspector} · {r.date}</div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">{r.speedLimitKmh} km/h</td>
                  <td className={`py-2.5 px-4 text-right font-mono tabular-nums font-semibold ${r.bermHeightM < r.requiredBermM ? 'text-red-700' : 'text-slate-800'}`}>
                    {r.bermHeightM.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">{r.gradientPct}%</td>
                  <td className="py-2.5 px-4">
                    <StatusLabel status={r.dustSuppression} />
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusLabel status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. DUMP YARD SAFETY
 * ========================================================================== */
export const DumpYardModuleView: React.FC = () => {
  const { dumpYards, openCreateModal } = useSafety();

  const handleExport = () => {
    downloadCsv(
      'vkcm_dump_yard_safety.csv',
      ['ID', 'Yard', 'Bay', 'Date', 'Slope Angle', 'Stopper Berm (m)', 'Crack Observed', 'Spotter Present', 'Lux', 'Status', 'Inspector'],
      dumpYards.map((d) => [
        d.id,
        d.yardName,
        d.bayNumber,
        d.date,
        d.slopeAngleDeg,
        d.stopperBlockHeightM,
        d.crackObserved ? 'Yes' : 'No',
        d.spotterPresent ? 'Yes' : 'No',
        d.illuminationLux,
        d.status,
        d.inspector,
      ])
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Overburden (OB) Dump Yard Stability & Tipping Safety</h2>
          <p className="text-xs text-slate-500">
            Slope angle monitoring, crest tension crack checks, stopper block heights, and spotter verification
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('dump-yard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Dump Check</span>
          </button>
        </div>
      </div>

      {/* Bay Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dumpYards.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-slate-500">{d.id} · {d.date}</div>
                <h3 className="text-sm font-bold text-[#0B1F3A] mt-0.5 flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-[#EA580C]" />
                  <span>{d.yardName} — {d.bayNumber}</span>
                </h3>
              </div>
              <StatusLabel status={d.status} />
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100">
              <div>
                <div className="text-slate-500">Slope</div>
                <div className={`font-mono font-bold tabular-nums mt-0.5 ${d.slopeAngleDeg > 37 ? 'text-red-700' : 'text-[#0B1F3A]'}`}>
                  {d.slopeAngleDeg}°
                </div>
              </div>
              <div>
                <div className="text-slate-500">Berm</div>
                <div className={`font-mono font-bold tabular-nums mt-0.5 ${d.stopperBlockHeightM < 1.5 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {d.stopperBlockHeightM.toFixed(2)}m
                </div>
              </div>
              <div>
                <div className="text-slate-500">Crack</div>
                <div className={`font-semibold mt-0.5 ${d.crackObserved ? 'text-red-700' : 'text-emerald-700'}`}>
                  {d.crackObserved ? 'Detected' : 'None'}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Lux</div>
                <div className="font-mono font-bold tabular-nums text-[#0B1F3A] mt-0.5">{d.illuminationLux} lx</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">{d.notes}</p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Spotter Assigned: {d.spotterPresent ? 'Yes (VHF Active)' : 'No'}</span>
              <span>Inspector: {d.inspector}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. HIRA (Interactive 5x5 Risk Matrix + HIRA Register)
 * ========================================================================== */
export const HiraModuleView: React.FC = () => {
  const { hira, openCreateModal } = useSafety();
  const [selectedCell, setSelectedCell] = useState<{ l: number; s: number } | null>(null);
  const [bandFilter, setBandFilter] = useState<'All' | 'Critical' | 'High' | 'Moderate'>('All');

  const filtered = hira.filter((item) => {
    if (selectedCell) {
      return item.likelihood === selectedCell.l && item.severity === selectedCell.s;
    }
    if (bandFilter === 'Critical') return item.inherentScore >= 15;
    if (bandFilter === 'High') return item.inherentScore >= 10 && item.inherentScore < 15;
    if (bandFilter === 'Moderate') return item.inherentScore < 10;
    return true;
  });

  const cellColor = (score: number) => {
    if (score >= 15) return 'bg-red-600 text-white hover:bg-red-700';
    if (score >= 10) return 'bg-[#EA580C] text-white hover:bg-[#C2410C]';
    if (score >= 5) return 'bg-amber-400 text-slate-900 hover:bg-amber-500';
    return 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200';
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0B1F3A]">Hazard Identification & Risk Assessment (HIRA)</h2>
            <p className="text-xs text-slate-500">
              DGMS-compliant 5×5 Risk Matrix · Click any matrix cell to filter matching operational hazards
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedCell && (
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear Matrix Filter ({selectedCell.l}×{selectedCell.s})
              </button>
            )}
            <button
              type="button"
              onClick={() => openCreateModal('hira')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add HIRA</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 5x5 Interactive Matrix */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-[#0B1F3A] mb-2">5×5 Risk Matrix (Likelihood × Severity)</div>
            <div className="grid grid-cols-6 gap-1 text-center text-[11px]">
              <div className="p-1 text-slate-400 font-mono">L \ S</div>
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={`sh-${s}`} className="p-1 font-semibold text-slate-600 font-mono">S{s}</div>
              ))}

              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={`row-${l}`}>
                  <div className="p-1 font-semibold text-slate-600 font-mono flex items-center justify-center">L{l}</div>
                  {[1, 2, 3, 4, 5].map((s) => {
                    const score = l * s;
                    const count = hira.filter((h) => h.likelihood === l && h.severity === s).length;
                    const active = selectedCell?.l === l && selectedCell?.s === s;
                    return (
                      <button
                        key={`${l}-${s}`}
                        type="button"
                        onClick={() => setSelectedCell(active ? null : { l, s })}
                        className={`h-9 rounded text-xs font-mono font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${cellColor(score)} ${
                          active ? 'ring-2 ring-[#0B1F3A] ring-offset-1' : ''
                        }`}
                        title={`Likelihood ${l} × Severity ${s} = ${score} (${count} hazards)`}
                      >
                        <span>{score}</span>
                        {count > 0 && <span className="text-[9px] leading-none opacity-90">({count})</span>}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Band Summary & Filter */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Risk Band:
              </span>
              {(['All', 'Critical', 'High', 'Moderate'] as const).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => {
                    setSelectedCell(null);
                    setBandFilter(band);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    bandFilter === band && !selectedCell
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <th className="py-2.5 px-3">ID & Zone</th>
                    <th className="py-2.5 px-3">Activity & Hazard</th>
                    <th className="py-2.5 px-3 text-right">Inherent</th>
                    <th className="py-2.5 px-3 text-right">Residual</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono font-semibold text-[#0B1F3A]">{h.id}</div>
                        <div className="text-[11px] text-slate-500">{h.zone}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{h.activity}</div>
                        <div className="text-slate-600 mt-0.5">{h.hazard}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Controls: {h.controls}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-red-700">{h.inherentScore}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-emerald-700">{h.residualScore}</td>
                      <td className="py-2.5 px-3">
                        <StatusLabel status={h.status} />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                        No HIRA entries match the selected risk matrix cell.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. DAILY SAFETY INSPECTION (Shift Checklist + Inspection Register)
 * ========================================================================== */
export const DailyInspectionModuleView: React.FC = () => {
  const { inspections, openCreateModal, globalSearch } = useSafety();
  const [shiftFilter, setShiftFilter] = useState<string>('All');

  const query = globalSearch.toLowerCase();
  const filtered = inspections.filter((i) => {
    const matchShift = shiftFilter === 'All' || i.shift.startsWith(shiftFilter);
    const matchQ =
      !query ||
      i.id.toLowerCase().includes(query) ||
      i.zone.toLowerCase().includes(query) ||
      i.inspector.toLowerCase().includes(query);
    return matchShift && matchQ;
  });

  const handleExport = () => {
    downloadCsv(
      'vkcm_daily_safety_inspections.csv',
      ['ID', 'Date', 'Shift', 'Zone', 'Inspector', 'Passed', 'Total', 'Hazards', 'Status', 'Remarks'],
      filtered.map((i) => [
        i.id,
        i.date,
        i.shift,
        i.zone,
        i.inspector,
        i.checklistPassed,
        i.checklistTotal,
        i.hazardsFound,
        i.status,
        i.remarks,
      ])
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Daily Shift Safety Inspection Register</h2>
          <p className="text-xs text-slate-500">
            Statutory Pit Boss / Safety Officer inspection log across Quarry Benches, Haul Roads, CHP & Substations
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('daily-inspection')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Daily Inspection</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {['All', 'Shift A', 'Shift B', 'Shift C'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setShiftFilter(tab)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  shiftFilter === tab ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Showing {filtered.length} inspection records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Inspection ID</th>
                <th className="py-2.5 px-4">Date & Shift</th>
                <th className="py-2.5 px-4">Zone & Inspector</th>
                <th className="py-2.5 px-4 text-right">Checklist</th>
                <th className="py-2.5 px-4 text-right">Hazards</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Field Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#0B1F3A] whitespace-nowrap">{r.id}</td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-mono text-slate-800">{r.date}</div>
                    <div className="text-[11px] text-slate-500">{r.shift.split(' ')[0]} {r.shift.split(' ')[1]}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{r.zone}</div>
                    <div className="text-[11px] text-slate-500">{r.inspector}</div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    {r.checklistPassed}/{r.checklistTotal}
                  </td>
                  <td className={`py-2.5 px-4 text-right font-mono tabular-nums font-semibold ${r.hazardsFound > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {r.hazardsFound}
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusLabel status={r.status} />
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-xs">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
