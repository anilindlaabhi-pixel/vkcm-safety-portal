import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Award,
  CheckSquare,
  ClipboardCheck,
  Flame,
  Mountain,
  Plus,
  ShieldAlert,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { DepartmentBarChart, SafetyGauge, SafetyTrendChart } from './Charts';
import { SeverityText, StatusLabel } from './StatusText';

export const DashboardView: React.FC = () => {
  const {
    kpis,
    settings,
    inspections,
    capa,
    hemm,
    dumpYards,
    haulRoads,
    nearMisses,
    setActiveModule,
    openCreateModal,
    activeShift,
  } = useSafety();

  const overdueCapas = capa.filter((c) => c.status === 'Overdue');
  const groundedHemm = hemm.filter((h) => h.fitnessStatus === 'Grounded' || h.fitnessStatus === 'Conditional');
  const closedDumps = dumpYards.filter((d) => d.status !== 'Operational');
  const cautionRoads = haulRoads.filter((r) => r.status !== 'Safe');

  const deptScores = [
    { label: 'Quarry Bench & Blasting Operations', score: 96, openIssues: 1 },
    { label: 'CHP & Conveyor Handling Plant', score: 94, openIssues: 2 },
    { label: 'HEMM Maintenance & Fleet', score: 89, openIssues: groundedHemm.length },
    { label: 'Haul Road & Traffic Corridor', score: 86, openIssues: cautionRoads.length },
    { label: 'OB Dump Yard Operations', score: 84, openIssues: closedDumps.length },
  ];

  const kpiCards = [
    {
      label: 'Safety Index',
      value: `${kpis.safetyIndex}%`,
      sub: `Target ${settings.targetSafetyIndex}.0% · Kothagudem Top Quartile`,
      target: 'dashboard' as const,
      accent: 'text-[#0B1F3A]',
      icon: TrendingUp,
    },
    {
      label: 'Total Inspections',
      value: kpis.totalInspections.toLocaleString(),
      sub: 'YTD statutory & shift checks',
      target: 'daily-inspection' as const,
      accent: 'text-[#0B1F3A]',
      icon: ClipboardCheck,
    },
    {
      label: 'Inspections Completed Today',
      value: `${kpis.inspectionsToday} / ${kpis.dailyInspectionTarget}`,
      sub: `${Math.round((kpis.inspectionsToday / kpis.dailyInspectionTarget) * 100)}% shift target achieved`,
      target: 'daily-inspection' as const,
      accent: 'text-[#0B1F3A]',
      icon: ClipboardCheck,
    },
    {
      label: 'Hazards Identified',
      value: String(kpis.hazardsIdentified),
      sub: 'Active HIRA & field hazards',
      target: 'hira' as const,
      accent: 'text-amber-700',
      icon: ShieldAlert,
    },
    {
      label: 'Near Misses Reported',
      value: String(kpis.nearMissesReported),
      sub: `${nearMisses.filter((n) => n.status !== 'Closed').length} open under investigation`,
      target: 'near-miss' as const,
      accent: 'text-[#EA580C]',
      icon: AlertTriangle,
    },
    {
      label: 'Incidents Reported',
      value: String(kpis.incidentsReported),
      sub: '48 days since last LTI',
      target: 'accident-incident' as const,
      accent: 'text-[#0B1F3A]',
      icon: AlertOctagon,
    },
    {
      label: 'Open Corrective Actions',
      value: String(kpis.openCapa),
      sub: 'Across pit, HEMM & CHP',
      target: 'capa' as const,
      accent: 'text-[#0B1F3A]',
      icon: CheckSquare,
    },
    {
      label: 'Overdue Corrective Actions',
      value: String(kpis.overdueCapa),
      sub: kpis.overdueCapa > 0 ? 'Immediate escalation required' : 'All actions on schedule',
      target: 'capa' as const,
      accent: kpis.overdueCapa > 0 ? 'text-red-700' : 'text-emerald-700',
      icon: AlertOctagon,
    },
    {
      label: 'Safety Training Completed',
      value: `${kpis.trainingCompletionPct}%`,
      sub: `${kpis.trainedPersonnel} / 450 VTC & simulator certified`,
      target: 'safety-training' as const,
      accent: 'text-emerald-700',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Header Strip */}
      <div className="bg-[#0B1F3A] text-white rounded-lg p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-orange-300">
            The Singareni Collieries Company Limited (SCCL) · Kothagudem Area
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white font-display">
            Venkatesh Khani Coal Mine (VKCM) — Safety Command Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Active Shift: {activeShift} · 48 LTI-Free Operating Days · DGMS Compliance Active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => openCreateModal('daily-inspection')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Shift Inspection</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('near-miss')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-orange-300" />
            <span>Report Near Miss</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('daily-reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Daily Return</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 9 Core Dashboard KPI Cards */}
      <section aria-label="Key Safety Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.label}
                type="button"
                onClick={() => setActiveModule(card.target)}
                className="bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-[#0B1F3A]/40 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">{card.label}</span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#EA580C] transition-colors shrink-0" />
                </div>
                <div className={`text-2xl font-bold font-mono tabular-nums mt-2 ${card.accent}`}>
                  {card.value}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="truncate">{card.sub}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Analytics Split: Trend Chart + Safety Index Gauge & Pending Action Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left 2 Columns: Trend Chart + Department Compliance */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <SafetyTrendChart />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">Section-Wise Risk & Compliance Index</h3>
                <p className="text-xs text-slate-500">Weighted score across active VKCM operational zones</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModule('hira')}
                className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer whitespace-nowrap"
              >
                Open HIRA Matrix
              </button>
            </div>
            <DepartmentBarChart items={deptScores} />
          </div>
        </div>

        {/* Right Column: Safety Gauge + Pending Action Alerts */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">Mine Safety Index Gauge</h3>
            <SafetyGauge value={kpis.safetyIndex} target={settings.targetSafetyIndex} />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-[#0B1F3A]">Pending Action Alerts</h3>
              <span className="text-xs font-mono tabular-nums text-red-700 font-semibold">
                {overdueCapas.length + closedDumps.length + groundedHemm.length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {closedDumps.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveModule('dump-yard')}
                  className="w-full py-3 text-left hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 shrink-0" />
                      <span>{d.yardName} · {d.bayNumber}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{d.notes}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                </button>
              ))}

              {groundedHemm.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveModule('hemm-inspection')}
                  className="w-full py-3 text-left hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      <span>{h.equipmentId} ({h.fitnessStatus})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{h.deficiencyNotes}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                </button>
              ))}

              {overdueCapas.slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveModule('capa')}
                  className="w-full py-3 text-left hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 shrink-0" />
                      <span>{c.id} · Overdue CAPA</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{c.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Due {c.dueDate} · Owner: {c.assignedTo}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shift Inspections & Open CAPA Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[#0B1F3A]">Latest Shift Safety Inspections</h3>
              <p className="text-xs text-slate-500">Quarry, Haul Road, CHP & OB Dump checks</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModule('daily-inspection')}
              className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer whitespace-nowrap"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-4">ID / Date</th>
                  <th className="py-2.5 px-4">Mine Zone</th>
                  <th className="py-2.5 px-4 text-right">Checks</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {inspections.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap">
                      <div className="font-medium text-[#0B1F3A]">{item.id}</div>
                      <div className="text-[11px] text-slate-500">{item.date}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800">{item.zone}</div>
                      <div className="text-[11px] text-slate-500">{item.inspector}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      {item.checklistPassed}/{item.checklistTotal}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusLabel status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[#0B1F3A]">Priority Corrective Actions (CAPA)</h3>
              <p className="text-xs text-slate-500">Tracked hazard & audit closures</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModule('capa')}
              className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer whitespace-nowrap"
            >
              Manage CAPA
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-4">CAPA ID</th>
                  <th className="py-2.5 px-4">Action Item</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {capa.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap">
                      <div className="font-medium text-[#0B1F3A]">{item.id}</div>
                      <div className="text-[11px] text-slate-500">Due {item.dueDate}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.assignedTo}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <SeverityText level={item.priority} />
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusLabel status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
