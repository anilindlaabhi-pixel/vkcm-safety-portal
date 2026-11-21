import React, { useState } from 'react';
import { Plus, RotateCcw, Save } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { MineSettings } from '../types/safety';
import { StatusLabel } from './StatusText';

/* ============================================================================
 * USER MANAGEMENT
 * ========================================================================== */
export const UserManagementView: React.FC = () => {
  const { users, toggleUserStatus, openCreateModal } = useSafety();

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0B1F3A]">VKCM Safety Personnel & Role Access Directory</h2>
          <p className="text-xs text-slate-500">Mine Manager, Safety Officers, Overmen / Pit Bosses, HEMM Foremen & VTC Instructors</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal('user-management')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Officer / Supervisor</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-4">Employee Code</th>
                <th className="py-2.5 px-4">Name & Contact</th>
                <th className="py-2.5 px-4">Statutory Role</th>
                <th className="py-2.5 px-4">Department & Shift</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#0B1F3A] whitespace-nowrap">{u.empCode}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-800">{u.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{u.phone}</div>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{u.role}</td>
                  <td className="py-2.5 px-4">
                    <div className="text-slate-800">{u.department}</div>
                    <div className="text-[11px] text-slate-500">{u.shift}</div>
                  </td>
                  <td className="py-2.5 px-4"><StatusLabel status={u.status} /></td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
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
 * SETTINGS
 * ========================================================================== */
export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useSafety();
  const [draft, setDraft] = useState<MineSettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(draft);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h2 className="text-base font-bold text-[#0B1F3A]">VKCM Mine Safety Configuration & Thresholds</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure unit identifiers, DGMS haul road/berm safety limits, CAPA escalation timelines, and local storage data
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Mine Unit Name</span>
            <input
              type="text"
              value={draft.unitName}
              onChange={(e) => setDraft({ ...draft, unitName: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B1F3A]"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Area Name</span>
            <input
              type="text"
              value={draft.areaName}
              onChange={(e) => setDraft({ ...draft, areaName: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B1F3A]"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Organization</span>
            <input
              type="text"
              value={draft.companyName}
              onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B1F3A]"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">SCCL Unit Code</span>
            <input
              type="text"
              value={draft.mineCode}
              onChange={(e) => setDraft({ ...draft, mineCode: e.target.value })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-[#0B1F3A]"
            />
          </label>
        </div>

        <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Target Safety Index (%)</span>
            <input
              type="number"
              min={50}
              max={100}
              value={draft.targetSafetyIndex}
              onChange={(e) => setDraft({ ...draft, targetSafetyIndex: Number(e.target.value) })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono text-slate-800"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Daily Inspection Target</span>
            <input
              type="number"
              min={1}
              max={100}
              value={draft.dailyInspectionTarget}
              onChange={(e) => setDraft({ ...draft, dailyInspectionTarget: Number(e.target.value) })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono text-slate-800"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Haul Max Speed (km/h)</span>
            <input
              type="number"
              min={10}
              max={60}
              value={draft.haulRoadMaxSpeedKmh}
              onChange={(e) => setDraft({ ...draft, haulRoadMaxSpeedKmh: Number(e.target.value) })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono text-slate-800"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Min Berm Height (m)</span>
            <input
              type="number"
              step="0.1"
              min={0.5}
              max={3.0}
              value={draft.minBermHeightM}
              onChange={(e) => setDraft({ ...draft, minBermHeightM: Number(e.target.value) })}
              className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono text-slate-800"
            />
          </label>
        </div>

        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center gap-6 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.emailAlertsEnabled}
              onChange={(e) => setDraft({ ...draft, emailAlertsEnabled: e.target.checked })}
              className="rounded border-slate-300 text-[#EA580C]"
            />
            <span className="font-medium text-slate-700">Email Escalation for Overdue CAPA</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.smsEscalationEnabled}
              onChange={(e) => setDraft({ ...draft, smsEscalationEnabled: e.target.checked })}
              className="rounded border-slate-300 text-[#EA580C]"
            />
            <span className="font-medium text-slate-700">Shift SMS Alert for Critical Pit Hazards</span>
          </label>
        </div>

        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetAllData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline Sample Data</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
