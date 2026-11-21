import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Award,
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  Flame,
  HardHat,
  LayoutDashboard,
  MapPin,
  Menu,
  Mountain,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { ModuleId, ShiftCode } from '../types/safety';

export interface NavItem {
  id: ModuleId;
  label: string;
  shortLabel: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', group: 'Overview', icon: LayoutDashboard },

  { id: 'daily-inspection', label: 'Daily Safety Inspection', shortLabel: 'Daily Inspection', group: 'Field & Pit Operations', icon: ClipboardCheck },
  { id: 'hemm-inspection', label: 'HEMM Inspection', shortLabel: 'HEMM Inspection', group: 'Field & Pit Operations', icon: Truck },
  { id: 'haul-road', label: 'Haul Road & Traffic Safety', shortLabel: 'Haul Road Safety', group: 'Field & Pit Operations', icon: MapPin },
  { id: 'dump-yard', label: 'Dump Yard Safety', shortLabel: 'Dump Yard Safety', group: 'Field & Pit Operations', icon: Mountain },

  { id: 'near-miss', label: 'Near Miss Reporting', shortLabel: 'Near Miss', group: 'Incident & Risk Control', icon: AlertTriangle },
  { id: 'accident-incident', label: 'Accident & Incident Reporting', shortLabel: 'Accidents & Incidents', group: 'Incident & Risk Control', icon: AlertOctagon },
  { id: 'hira', label: 'Hazard Identification & Risk Assessment', shortLabel: 'HIRA Register', group: 'Incident & Risk Control', icon: ShieldAlert },
  { id: 'safety-violation', label: 'Safety Violation Register', shortLabel: 'Safety Violations', group: 'Incident & Risk Control', icon: ShieldCheck },
  { id: 'capa', label: 'Corrective Action Tracker (CAPA)', shortLabel: 'CAPA Tracker', group: 'Incident & Risk Control', icon: CheckSquare },

  { id: 'fire-safety', label: 'Fire Safety', shortLabel: 'Fire Safety', group: 'Compliance & Workforce', icon: Flame },
  { id: 'ppe-inspection', label: 'PPE Inspection', shortLabel: 'PPE Inspection', group: 'Compliance & Workforce', icon: HardHat },
  { id: 'safety-training', label: 'Safety Training Management', shortLabel: 'Safety Training', group: 'Compliance & Workforce', icon: Award },
  { id: 'safety-meetings', label: 'Safety Meeting Records', shortLabel: 'Safety Meetings', group: 'Compliance & Workforce', icon: CalendarDays },

  { id: 'daily-reports', label: 'Daily Reports', shortLabel: 'Daily Reports', group: 'Statutory Reports', icon: FileText },
  { id: 'weekly-reports', label: 'Weekly Reports', shortLabel: 'Weekly Reports', group: 'Statutory Reports', icon: FileSpreadsheet },
  { id: 'monthly-reports', label: 'Monthly Reports', shortLabel: 'Monthly Reports', group: 'Statutory Reports', icon: BarChart3 },

  { id: 'user-management', label: 'User Management', shortLabel: 'User Management', group: 'Administration', icon: Users },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', group: 'Administration', icon: Settings },
];

const GROUPS = [
  'Overview',
  'Field & Pit Operations',
  'Incident & Risk Control',
  'Compliance & Workforce',
  'Statutory Reports',
  'Administration',
];

const SHIFTS: ShiftCode[] = [
  'Shift A (06:00-14:00)',
  'Shift B (14:00-22:00)',
  'Shift C (22:00-06:00)',
];

const CREATABLE_MODULES: ModuleId[] = [
  'daily-inspection',
  'near-miss',
  'accident-incident',
  'hemm-inspection',
  'hira',
  'safety-violation',
  'capa',
  'haul-road',
  'dump-yard',
  'fire-safety',
  'ppe-inspection',
  'safety-training',
  'safety-meetings',
  'user-management',
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeModule,
    setActiveModule,
    activeShift,
    setActiveShift,
    globalSearch,
    setGlobalSearch,
    openCreateModal,
    kpis,
    settings,
    toastMessage,
  } = useSafety();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navFilter, setNavFilter] = useState('');

  const currentItem = NAV_ITEMS.find((n) => n.id === activeModule) ?? NAV_ITEMS[0];
  const primaryCreateTarget: ModuleId = CREATABLE_MODULES.includes(activeModule) ? activeModule : 'near-miss';
  const primaryCreateLabel =
    activeModule === 'dashboard' || !CREATABLE_MODULES.includes(activeModule)
      ? 'Log Safety Report'
      : `Add ${currentItem.shortLabel}`;

  const handleSelectModule = (id: ModuleId) => {
    setActiveModule(id);
    setGlobalSearch('');
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0B1F3A] text-slate-100 select-none">
      {/* Brand Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[#EA580C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight text-white truncate font-display">
                VKCM Safety
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                SCCL · Kothagudem Area
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module quick finder */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={navFilter}
            onChange={(e) => setNavFilter(e.target.value)}
            placeholder="Find module..."
            aria-label="Filter navigation modules"
            className="w-full bg-[#132C4E] border border-white/10 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C]"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4" aria-label="Primary modules">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter(
            (item) =>
              item.group === group &&
              (navFilter.trim() === '' ||
                item.label.toLowerCase().includes(navFilter.toLowerCase()) ||
                item.shortLabel.toLowerCase().includes(navFilter.toLowerCase()))
          );
          if (items.length === 0) return null;

          return (
            <div key={group}>
              <div className="px-2.5 pb-1.5 text-[11px] font-medium text-slate-400">
                {group}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectModule(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-left text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#EA580C] text-white'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.id === 'capa' && kpis.overdueCapa > 0 && (
                        <span
                          className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {kpis.overdueCapa}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Organization Footer Card */}
      <div className="p-3 border-t border-white/10 bg-[#08172B]">
        <div className="text-xs font-medium text-white truncate">{settings.unitName}</div>
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          {settings.companyName}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-1">
          Unit Code: {settings.mineCode}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F6F9] text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 border-r border-slate-200 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: 3-zone header, compact on mobile */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Menu toggle + Breadcrumb / Current Module */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-slate-700 hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
                <span className="hidden sm:inline">VKCM · {currentItem.group}</span>
                <span className="hidden sm:inline" aria-hidden="true">/</span>
                <span className="font-semibold text-[#0B1F3A] text-sm truncate">{currentItem.label}</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Shift Selector & Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md justify-center">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search IDs, zones, officers, equipment..."
                aria-label="Search active module records"
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0B1F3A]"
              />
            </div>
            <select
              value={activeShift}
              onChange={(e) => setActiveShift(e.target.value as ShiftCode)}
              aria-label="Active Mine Shift"
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0B1F3A] whitespace-nowrap shrink-0"
            >
              {SHIFTS.map((s) => (
                <option key={s} value={s}>
                  {s.split(' ')[0]} {s.split(' ')[1]}
                </option>
              ))}
            </select>
          </div>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openCreateModal(primaryCreateTarget)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{primaryCreateLabel}</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Viewport Body */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Clean Minimal Institutional Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 lg:px-6 py-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 no-print">
          <span>
            {settings.unitName} · {settings.areaName} · {settings.companyName}
          </span>
          <span className="font-mono tabular-nums">
            DGMS Statutory Safety Portal · Date: 2026-11-21
          </span>
        </footer>
      </div>

      {/* Live Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-4 right-4 z-50 bg-[#0B1F3A] text-white text-xs font-medium px-4 py-3 rounded-md shadow-lg border border-white/15 flex items-center gap-2.5 max-w-sm"
        >
          <ShieldCheck className="w-4 h-4 text-[#EA580C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
