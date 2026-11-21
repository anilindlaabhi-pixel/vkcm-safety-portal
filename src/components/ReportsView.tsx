import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { WEEKLY_TREND_DATA } from '../data/mockSafetyData';
import { downloadCsv, StatusLabel } from './StatusText';

export const ReportsModuleView: React.FC<{ mode: 'daily' | 'weekly' | 'monthly' }> = ({ mode }) => {
  const {
    settings,
    kpis,
    inspections,
    nearMisses,
    incidents,
    capa,
    hemm,
    training,
    showToast,
  } = useSafety();

  const [reportDate, setReportDate] = useState('2026-11-21');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');

  const title =
    mode === 'daily'
      ? 'Daily Safety Return (Shift A/B/C Consolidated)'
      : mode === 'weekly'
        ? 'Weekly Mine Safety Digest'
        : 'Monthly Statutory Safety Performance Return';

  const handlePrint = () => {
    window.print();
    showToast('Print preview opened for statutory safety return');
  };

  const handleExportCsv = () => {
    if (mode === 'daily') {
      downloadCsv(
        `vkcm_daily_safety_return_${reportDate}.csv`,
        ['Metric', 'Value', 'Unit / Notes'],
        [
          ['Mine Unit', settings.unitName, settings.areaName],
          ['Report Date', reportDate, 'All Shifts Consolidated'],
          ['Safety Index', `${kpis.safetyIndex}%`, `Target ${settings.targetSafetyIndex}%`],
          ['Inspections Completed Today', `${kpis.inspectionsToday}/${kpis.dailyInspectionTarget}`, 'Statutory & Routine'],
          ['Open CAPA', kpis.openCapa, `${kpis.overdueCapa} Overdue`],
          ['Near Misses Reported', nearMisses.length, 'Active Register'],
          ['HEMM Grounded', hemm.filter((h) => h.fitnessStatus === 'Grounded').length, 'Workshop Lockout'],
        ]
      );
    } else if (mode === 'weekly') {
      downloadCsv(
        'vkcm_weekly_safety_digest.csv',
        ['Day', 'Inspections', 'Hazards Found', 'Near Misses', 'Safety Index %'],
        WEEKLY_TREND_DATA.map((d) => [d.day, d.inspections, d.hazards, d.nearMiss, d.safetyIndex])
      );
    } else {
      downloadCsv(
        `vkcm_monthly_safety_return_${selectedMonth}.csv`,
        ['Category', 'Metric', 'Figure', 'Remarks'],
        [
          ['Statutory', 'Lost Time Injuries (LTI)', incidents.filter((i) => i.classification === 'Lost Time Injury (LTI)').length, '48 LTI-Free Days'],
          ['Statutory', 'Medical Treatment Cases', incidents.filter((i) => i.classification === 'Medical Treatment (MTC)').length, 'DGMS Form IV-A'],
          ['Inspections', 'Cumulative Inspections YTD', kpis.totalInspections, 'Pit, HEMM & CHP'],
          ['Training', 'VTC & Refresher Compliance', `${kpis.trainingCompletionPct}%`, `${kpis.trainedPersonnel} Personnel`],
          ['CAPA', 'Closed CAPAs', capa.filter((c) => c.status === 'Closed').length, `${kpis.openCapa} Open`],
        ]
      );
    }
    showToast('Safety report CSV downloaded');
  };

  return (
    <div className="space-y-5">
      {/* Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">{title}</h2>
          <p className="text-xs text-slate-500">
            {settings.unitName} · {settings.areaName} · {settings.companyName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === 'daily' && (
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              aria-label="Report Date"
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-800"
            />
          )}
          {mode === 'monthly' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Report Month"
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-800"
            />
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Return</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Official Report Sheet */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#EA580C]">{settings.companyName}</div>
            <h3 className="text-lg font-bold text-[#0B1F3A] mt-0.5">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit: {settings.unitName} ({settings.mineCode}) · {settings.areaName}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 text-left sm:text-right">
            <div>Period: {mode === 'monthly' ? selectedMonth : reportDate}</div>
            <div>Generated: 2026-11-21</div>
          </div>
        </div>

        {/* Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded p-3">
            <div className="text-xs text-slate-500">Safety Index</div>
            <div className="text-xl font-bold font-mono tabular-nums text-[#0B1F3A] mt-1">{kpis.safetyIndex}%</div>
          </div>
          <div className="border border-slate-200 rounded p-3">
            <div className="text-xs text-slate-500">Inspections Logged</div>
            <div className="text-xl font-bold font-mono tabular-nums text-[#0B1F3A] mt-1">
              {mode === 'daily' ? kpis.inspectionsToday : mode === 'weekly' ? 139 : kpis.totalInspections}
            </div>
          </div>
          <div className="border border-slate-200 rounded p-3">
            <div className="text-xs text-slate-500">Open / Overdue CAPA</div>
            <div className="text-xl font-bold font-mono tabular-nums text-red-700 mt-1">
              {kpis.openCapa} / {kpis.overdueCapa}
            </div>
          </div>
          <div className="border border-slate-200 rounded p-3">
            <div className="text-xs text-slate-500">VTC Training Compliance</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
              {kpis.trainingCompletionPct}%
            </div>
          </div>
        </div>

        {/* Mode-specific Tables */}
        {mode === 'daily' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#0B1F3A]">Shift-Wise Inspection Summary</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Shift & Zone</th>
                    <th className="py-2 px-3">Inspector</th>
                    <th className="py-2 px-3 text-right">Hazards</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspections.slice(0, 6).map((i) => (
                    <tr key={i.id}>
                      <td className="py-2 px-3 font-mono font-medium">{i.id}</td>
                      <td className="py-2 px-3">{i.zone} ({i.shift.split(' ')[0]} {i.shift.split(' ')[1]})</td>
                      <td className="py-2 px-3">{i.inspector}</td>
                      <td className="py-2 px-3 text-right font-mono">{i.hazardsFound}</td>
                      <td className="py-2 px-3"><StatusLabel status={i.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {mode === 'weekly' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#0B1F3A]">7-Day Rolling Operational Safety Breakdown</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Inspections</th>
                    <th className="py-2 px-3 text-right">Hazards Identified</th>
                    <th className="py-2 px-3 text-right">Near Misses</th>
                    <th className="py-2 px-3 text-right">Safety Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {WEEKLY_TREND_DATA.map((d) => (
                    <tr key={d.day}>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">{d.day}, 2026</td>
                      <td className="py-2 px-3 text-right">{d.inspections}</td>
                      <td className="py-2 px-3 text-right">{d.hazards}</td>
                      <td className="py-2 px-3 text-right">{d.nearMiss}</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#0B1F3A]">{d.safetyIndex}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {mode === 'monthly' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#0B1F3A]">SCCL / DGMS Monthly Statutory Return Summary</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600">
                    <th className="py-2 px-3">Statutory Parameter</th>
                    <th className="py-2 px-3 text-right">Monthly Actual</th>
                    <th className="py-2 px-3 text-right">Norm / Target</th>
                    <th className="py-2 px-3">Compliance Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-medium">Lost Time Injury (LTI) Frequency Rate</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">0.00</td>
                    <td className="py-2 px-3 text-right font-mono">0.00</td>
                    <td className="py-2 px-3 text-slate-600">48 consecutive LTI-free operating days</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">HEMM Fleet Safety Availability</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      {Math.round((hemm.filter((h) => h.fitnessStatus === 'Fit for Operation').length / hemm.length) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono">95%</td>
                    <td className="py-2 px-3 text-slate-600">1 unit grounded for AFDSS recharge</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">VTC & Refresher Training Batches</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">{training.length} Batches</td>
                    <td className="py-2 px-3 text-right font-mono">4 Batches</td>
                    <td className="py-2 px-3 text-slate-600">{kpis.trainedPersonnel} personnel certified YTD</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">CAPA Closure Timeliness</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      {capa.filter((c) => c.status === 'Closed').length} / {capa.length}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">100%</td>
                    <td className="py-2 px-3 text-slate-600">{kpis.overdueCapa} overdue items escalated to Mine Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
