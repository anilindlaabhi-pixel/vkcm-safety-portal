import React, { useState } from 'react';
import { CheckCircle2, Download, Plus, Search, XCircle } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { CapaRecord, NearMissRecord } from '../types/safety';
import { downloadCsv, SeverityText, StatusLabel } from './StatusText';

/* ============================================================================
 * NEAR MISS REPORTING
 * ========================================================================== */
export const NearMissView: React.FC = () => {
  const { nearMisses, updateNearMissStatus, openCreateModal, globalSearch } = useSafety();
  const [filter, setFilter] = useState<'All' | 'Open' | 'Investigating' | 'Closed'>('All');
  const [search, setSearch] = useState('');

  const q = (search || globalSearch).toLowerCase();
  const rows = nearMisses.filter((n) => {
    const matchF = filter === 'All' || n.status === filter;
    const matchQ =
      !q ||
      n.id.toLowerCase().includes(q) ||
      n.location.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q);
    return matchF && matchQ;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Near Miss Reporting & Proactive Hazard Capture</h2>
          <p className="text-xs text-slate-500">Unsafe acts, unsafe conditions, traffic & equipment near misses reported across VKCM</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                'vkcm_near_miss_register.csv',
                ['ID', 'Date', 'Location', 'Category', 'Severity', 'Reported By', 'Status', 'Immediate Action'],
                rows.map((r) => [r.id, r.date, r.location, r.category, r.potentialSeverity, r.reportedBy, r.status, r.immediateAction])
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('near-miss')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Near Miss</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {(['All', 'Open', 'Investigating', 'Closed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs font-medium rounded cursor-pointer ${
                  filter === tab ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-[#0B1F3A]'
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search near misses..."
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Report ID</th>
                <th className="py-2.5 px-4">Location & Category</th>
                <th className="py-2.5 px-4">Description & Immediate Action</th>
                <th className="py-2.5 px-4">Potential Risk</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{r.id}</div>
                    <div className="text-[11px] text-slate-500">{r.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{r.location}</div>
                    <div className="text-[11px] text-slate-500">{r.category} · {r.reportedBy}</div>
                  </td>
                  <td className="py-2.5 px-4 max-w-md">
                    <div className="text-slate-800">{r.description}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Action: {r.immediateAction}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <SeverityText level={r.potentialSeverity} />
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusLabel status={r.status} />
                  </td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <select
                      aria-label={`Update status for ${r.id}`}
                      value={r.status}
                      onChange={(e) => updateNearMissStatus(r.id, e.target.value as NearMissRecord['status'])}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700"
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Closed">Closed</option>
                    </select>
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
 * ACCIDENT & INCIDENT REPORTING
 * ========================================================================== */
export const IncidentView: React.FC = () => {
  const { incidents, openCreateModal, globalSearch } = useSafety();
  const q = globalSearch.toLowerCase();
  const rows = incidents.filter(
    (i) =>
      !q ||
      i.id.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.classification.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Accident & Incident Reporting (DGMS Statutory Register)</h2>
          <p className="text-xs text-slate-500">48 Days Since Last LTI · Internal SCCL & DGMS Form IV-A Tracking</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                'vkcm_incident_register.csv',
                ['ID', 'Date', 'Location', 'Classification', 'DGMS Ref', 'Department', 'Root Cause', 'Status'],
                rows.map((r) => [r.id, r.date, r.location, r.classification, r.dgmsFormRef, r.department, r.rootCause, r.status])
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('accident-incident')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Incident ID</th>
                <th className="py-2.5 px-4">Location & Dept</th>
                <th className="py-2.5 px-4">Classification & Form Ref</th>
                <th className="py-2.5 px-4">Injured / Involved</th>
                <th className="py-2.5 px-4">Root Cause Summary</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{r.id}</div>
                    <div className="text-[11px] text-slate-500">{r.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{r.location}</div>
                    <div className="text-[11px] text-slate-500">{r.department}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-[#0B1F3A]">{r.classification}</div>
                    <div className="text-[11px] font-mono text-slate-500">{r.dgmsFormRef}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{r.injuredPerson}</td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-sm">{r.rootCause}</td>
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
 * HEMM INSPECTION
 * ========================================================================== */
export const HemmInspectionView: React.FC = () => {
  const { hemm, openCreateModal, globalSearch } = useSafety();
  const [filter, setFilter] = useState<'All' | 'Fit for Operation' | 'Conditional' | 'Grounded'>('All');
  const q = globalSearch.toLowerCase();

  const rows = hemm.filter((h) => {
    const matchF = filter === 'All' || h.fitnessStatus === filter;
    const matchQ =
      !q ||
      h.equipmentId.toLowerCase().includes(q) ||
      h.operatorName.toLowerCase().includes(q) ||
      h.equipmentType.toLowerCase().includes(q);
    return matchF && matchQ;
  });

  const CheckIcon = ({ ok }: { ok: boolean }) =>
    ok ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" aria-label="Pass" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600 mx-auto" aria-label="Fail" />
    );

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">HEMM Pre-Shift Safety Inspection & Fitness Register</h2>
          <p className="text-xs text-slate-500">100T/85T Dumpers, Hydraulic Shovels, Dozers, Water Sprinklers & Drills — AFDSS & ROPS Audit</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('hemm-inspection')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log HEMM Check</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {(['All', 'Fit for Operation', 'Conditional', 'Grounded'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs font-medium rounded cursor-pointer ${
                  filter === tab ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-slate-500">{rows.length} Units Audited</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Equipment ID</th>
                <th className="py-2.5 px-4">Operator & Shift</th>
                <th className="py-2.5 px-3 text-center">Brakes</th>
                <th className="py-2.5 px-3 text-center">AFDSS</th>
                <th className="py-2.5 px-3 text-center">Rev Cam</th>
                <th className="py-2.5 px-3 text-center">ROPS</th>
                <th className="py-2.5 px-4">Fitness Status</th>
                <th className="py-2.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-semibold text-[#0B1F3A]">{r.equipmentId}</div>
                    <div className="text-[11px] text-slate-500">{r.equipmentType} · {r.id}</div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{r.operatorName}</div>
                    <div className="text-[11px] text-slate-500">{r.date}</div>
                  </td>
                  <td className="py-2.5 px-3"><CheckIcon ok={r.brakesOk} /></td>
                  <td className="py-2.5 px-3"><CheckIcon ok={r.afdssOk} /></td>
                  <td className="py-2.5 px-3"><CheckIcon ok={r.reverseCamOk} /></td>
                  <td className="py-2.5 px-3"><CheckIcon ok={r.ropsOk} /></td>
                  <td className="py-2.5 px-4"><StatusLabel status={r.fitnessStatus} /></td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-xs">{r.deficiencyNotes}</td>
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
 * SAFETY VIOLATION REGISTER
 * ========================================================================== */
export const ViolationRegisterView: React.FC = () => {
  const { violations, openCreateModal } = useSafety();

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Safety Violation & Disciplinary Counseling Register</h2>
          <p className="text-xs text-slate-500">PPE breaches, haul road radar overspeeding, LOTO & unauthorized zone entry tracking</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('safety-violation')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Violation</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">ID & Date</th>
                <th className="py-2.5 px-4">Violation Type & Location</th>
                <th className="py-2.5 px-4">Personnel / Contractor</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Action Taken</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{v.id}</div>
                    <div className="text-[11px] text-slate-500">{v.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-800">{v.violationType}</div>
                    <div className="text-[11px] text-slate-500">{v.location}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{v.personOrContractor}</td>
                  <td className="py-2.5 px-4"><SeverityText level={v.severity} /></td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-sm">{v.actionTaken}</td>
                  <td className="py-2.5 px-4"><StatusLabel status={v.status} /></td>
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
 * CORRECTIVE ACTION TRACKER (CAPA)
 * ========================================================================== */
export const CapaTrackerView: React.FC = () => {
  const { capa, updateCapaStatus, openCreateModal } = useSafety();
  const [filter, setFilter] = useState<string>('All');

  const rows = capa.filter((c) => (filter === 'All' ? true : c.status === filter));

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Corrective & Preventive Action Tracker (CAPA)</h2>
          <p className="text-xs text-slate-500">End-to-end closure workflow for inspections, HIRA, HEMM, and audit findings</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                'vkcm_capa_tracker.csv',
                ['ID', 'Title', 'Source', 'Location', 'Priority', 'Owner', 'Due Date', 'Status'],
                rows.map((r) => [r.id, r.title, r.sourceModule, r.location, r.priority, r.assignedTo, r.dueDate, r.status])
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('capa')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New CAPA</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-1 bg-slate-50/50">
          {['All', 'Open', 'In Progress', 'Pending Verification', 'Overdue', 'Closed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                filter === tab ? 'bg-[#0B1F3A] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B1F3A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">CAPA ID</th>
                <th className="py-2.5 px-4">Action Description</th>
                <th className="py-2.5 px-4">Owner & Due Date</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{c.id}</div>
                    <div className="text-[11px] text-slate-500">{c.sourceModule}</div>
                  </td>
                  <td className="py-2.5 px-4 max-w-md">
                    <div className="font-semibold text-slate-800">{c.title}</div>
                    <div className="text-slate-600 mt-0.5">{c.correctiveAction}</div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{c.assignedTo}</div>
                    <div className="text-[11px] font-mono text-slate-500">Due: {c.dueDate}</div>
                  </td>
                  <td className="py-2.5 px-4"><SeverityText level={c.priority} /></td>
                  <td className="py-2.5 px-4"><StatusLabel status={c.status} /></td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <select
                      aria-label={`Change CAPA status for ${c.id}`}
                      value={c.status}
                      onChange={(e) => updateCapaStatus(c.id, e.target.value as CapaRecord['status'])}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Closed">Closed</option>
                    </select>
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
 * FIRE SAFETY, PPE INSPECTION, TRAINING, MEETINGS
 * ========================================================================== */
export const FireSafetyView: React.FC = () => {
  const { fireSafety, openCreateModal } = useSafety();
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Fire Fighting Equipment & AFDSS Readiness Register</h2>
          <p className="text-xs text-slate-500">Extinguishers, hydrants, fuel station foam systems & HEMM automatic fire suppression</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('fire-safety')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Fire Audit</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Asset Code</th>
                <th className="py-2.5 px-4">Location & Type</th>
                <th className="py-2.5 px-4">Last Checked</th>
                <th className="py-2.5 px-4">Next Due</th>
                <th className="py-2.5 px-4">Pressure / Seal</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {fireSafety.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#0B1F3A]">{f.assetCode}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{f.location}</div>
                    <div className="text-[11px] text-slate-500">{f.equipmentType} · {f.inspector}</div>
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">{f.lastInspected}</td>
                  <td className="py-2.5 px-4 font-mono tabular-nums">{f.nextDue}</td>
                  <td className="py-2.5 px-4 text-xs">
                    {f.pressureOk ? 'Pressure OK' : 'Low Pressure'} · {f.sealIntact ? 'Seal Intact' : 'Broken'}
                  </td>
                  <td className="py-2.5 px-4"><StatusLabel status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PpeInspectionView: React.FC = () => {
  const { ppe, openCreateModal } = useSafety();
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">PPE Compliance & Issuance Audit</h2>
          <p className="text-xs text-slate-500">IS 2925 Helmets, Steel-Toe Boots, High-Vis Reflective Vests & FFP2 Dust Respirators</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('ppe-inspection')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record PPE Audit</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Audit ID</th>
                <th className="py-2.5 px-4">Department / Crew</th>
                <th className="py-2.5 px-3 text-right">Crew</th>
                <th className="py-2.5 px-3 text-right">Helmet</th>
                <th className="py-2.5 px-3 text-right">Boots</th>
                <th className="py-2.5 px-3 text-right">Jacket</th>
                <th className="py-2.5 px-3 text-right">Mask</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {ppe.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{p.id}</div>
                    <div className="text-[11px] text-slate-500">{p.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{p.department}</div>
                    <div className="text-[11px] text-slate-500">Auditor: {p.auditor}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.crewCount}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.helmetCompliancePct}%</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.bootCompliancePct}%</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.jacketCompliancePct}%</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.dustMaskCompliancePct}%</td>
                  <td className="py-2.5 px-4"><StatusLabel status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SafetyTrainingView: React.FC = () => {
  const { training, openCreateModal } = useSafety();
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">VTC & Refresher Safety Training Management</h2>
          <p className="text-xs text-slate-500">Mines Vocational Training Rules compliance, HEMM simulators, First Aid & statutory refreshers</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('safety-training')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Training</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Batch ID</th>
                <th className="py-2.5 px-4">Training Program & Venue</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-right">Certified / Total</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {training.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{t.id}</div>
                    <div className="text-[11px] text-slate-500">{t.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{t.programName}</div>
                    <div className="text-[11px] text-slate-500">{t.venue} · Trainer: {t.trainer}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{t.category}</td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    {t.passCount} / {t.participantsCount}
                  </td>
                  <td className="py-2.5 px-4"><StatusLabel status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SafetyMeetingsView: React.FC = () => {
  const { meetings, openCreateModal } = useSafety();
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">Safety Committee & Toolbox Talk (TBT) Records</h2>
          <p className="text-xs text-slate-500">Pit Safety Committee minutes, Daily Shift TBT briefings & Area Tripartite Reviews</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('safety-meetings')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Meeting / TBT</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Record ID</th>
                <th className="py-2.5 px-4">Meeting Type & Chair</th>
                <th className="py-2.5 px-4 text-right">Attendees</th>
                <th className="py-2.5 px-4">Key Topics & Resolutions</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {meetings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-semibold text-[#0B1F3A]">{m.id}</div>
                    <div className="text-[11px] text-slate-500">{m.date}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-slate-800">{m.meetingType}</div>
                    <div className="text-[11px] text-slate-500">Chair: {m.chairperson}</div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">{m.attendees}</td>
                  <td className="py-2.5 px-4 max-w-md">
                    <div className="text-slate-700">{m.keyTopics}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{m.resolutionsCount} resolutions logged</div>
                  </td>
                  <td className="py-2.5 px-4"><StatusLabel status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
