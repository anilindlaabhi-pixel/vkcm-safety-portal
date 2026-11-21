import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
  const s = status.toLowerCase();

  if (
    s.includes('compliant') ||
    s.includes('fit for') ||
    s.includes('safe') ||
    s.includes('operational') ||
    s.includes('serviceable') ||
    s.includes('controlled') ||
    s.includes('closed') ||
    s.includes('resolved') ||
    s.includes('completed') ||
    s.includes('minutes issued') ||
    s === 'active' ||
    s === 'adequate' ||
    s === 'sprinkled'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (
    s.includes('overdue') ||
    s.includes('critical') ||
    s.includes('grounded') ||
    s.includes('defective') ||
    s.includes('restricted') ||
    s.includes('non-compliant') ||
    s.includes('dry') ||
    s.includes('suspended') ||
    s.includes('lost time')
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 whitespace-nowrap">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-600" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (
    s.includes('action') ||
    s.includes('caution') ||
    s.includes('conditional') ||
    s.includes('high') ||
    s.includes('recharge') ||
    s.includes('partial') ||
    s.includes('due') ||
    s.includes('under inquiry') ||
    s.includes('investigating')
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('in progress') || s.includes('pending') || s.includes('scheduled') || s.includes('monitoring')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B1F3A] whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 shrink-0 text-slate-600" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 whitespace-nowrap">
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};

export const SeverityText: React.FC<{ level: string }> = ({ level }) => {
  const color =
    level === 'Critical'
      ? 'text-red-700 font-semibold'
      : level === 'High'
        ? 'text-orange-700 font-semibold'
        : level === 'Medium'
          ? 'text-amber-700 font-medium'
          : 'text-slate-600 font-medium';

  return <span className={`text-xs whitespace-nowrap ${color}`}>{level}</span>;
};

export function downloadCsv(filename: string, headers: string[], rows: (string | number | boolean)[][]) {
  const escape = (val: string | number | boolean) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
