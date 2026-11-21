import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_CAPA,
  INITIAL_DAILY_INSPECTIONS,
  INITIAL_DUMP_YARDS,
  INITIAL_FIRE_SAFETY,
  INITIAL_HAUL_ROADS,
  INITIAL_HEMM,
  INITIAL_HIRA,
  INITIAL_INCIDENTS,
  INITIAL_MEETINGS,
  INITIAL_NEAR_MISSES,
  INITIAL_PPE,
  INITIAL_SETTINGS,
  INITIAL_TRAINING,
  INITIAL_USERS,
  INITIAL_VIOLATIONS,
} from '../data/mockSafetyData';
import {
  CapaRecord,
  DailyInspectionRecord,
  DumpYardRecord,
  FireSafetyRecord,
  HaulRoadRecord,
  HemmRecord,
  HiraRecord,
  IncidentRecord,
  MeetingRecord,
  MineSettings,
  MineUser,
  ModuleId,
  NearMissRecord,
  PpeRecord,
  ShiftCode,
  TrainingRecord,
  ViolationRecord,
} from '../types/safety';

const STORAGE_KEY = 'vkcm_safety_sms_v1';

interface PersistedState {
  inspections: DailyInspectionRecord[];
  nearMisses: NearMissRecord[];
  incidents: IncidentRecord[];
  hemm: HemmRecord[];
  hira: HiraRecord[];
  violations: ViolationRecord[];
  capa: CapaRecord[];
  haulRoads: HaulRoadRecord[];
  dumpYards: DumpYardRecord[];
  fireSafety: FireSafetyRecord[];
  ppe: PpeRecord[];
  training: TrainingRecord[];
  meetings: MeetingRecord[];
  users: MineUser[];
  settings: MineSettings;
}

const DEFAULT_PERSISTED: PersistedState = {
  inspections: INITIAL_DAILY_INSPECTIONS,
  nearMisses: INITIAL_NEAR_MISSES,
  incidents: INITIAL_INCIDENTS,
  hemm: INITIAL_HEMM,
  hira: INITIAL_HIRA,
  violations: INITIAL_VIOLATIONS,
  capa: INITIAL_CAPA,
  haulRoads: INITIAL_HAUL_ROADS,
  dumpYards: INITIAL_DUMP_YARDS,
  fireSafety: INITIAL_FIRE_SAFETY,
  ppe: INITIAL_PPE,
  training: INITIAL_TRAINING,
  meetings: INITIAL_MEETINGS,
  users: INITIAL_USERS,
  settings: INITIAL_SETTINGS,
};

interface SafetyContextValue extends PersistedState {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  activeShift: ShiftCode;
  setActiveShift: (shift: ShiftCode) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  modalModule: ModuleId | null;
  openCreateModal: (module: ModuleId) => void;
  closeCreateModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addInspection: (rec: Omit<DailyInspectionRecord, 'id'>) => void;
  addNearMiss: (rec: Omit<NearMissRecord, 'id'>) => void;
  addIncident: (rec: Omit<IncidentRecord, 'id'>) => void;
  addHemm: (rec: Omit<HemmRecord, 'id'>) => void;
  addHira: (rec: Omit<HiraRecord, 'id' | 'inherentScore'>) => void;
  addViolation: (rec: Omit<ViolationRecord, 'id'>) => void;
  addCapa: (rec: Omit<CapaRecord, 'id' | 'createdDate'>) => void;
  updateCapaStatus: (id: string, status: CapaRecord['status']) => void;
  updateNearMissStatus: (id: string, status: NearMissRecord['status']) => void;
  addHaulRoad: (rec: Omit<HaulRoadRecord, 'id'>) => void;
  addDumpYard: (rec: Omit<DumpYardRecord, 'id'>) => void;
  addFireSafety: (rec: Omit<FireSafetyRecord, 'id'>) => void;
  addPpe: (rec: Omit<PpeRecord, 'id'>) => void;
  addTraining: (rec: Omit<TrainingRecord, 'id'>) => void;
  addMeeting: (rec: Omit<MeetingRecord, 'id'>) => void;
  addUser: (rec: Omit<MineUser, 'id'>) => void;
  toggleUserStatus: (id: string) => void;
  updateSettings: (next: MineSettings) => void;
  resetAllData: () => void;
  kpis: {
    safetyIndex: number;
    totalInspections: number;
    inspectionsToday: number;
    dailyInspectionTarget: number;
    hazardsIdentified: number;
    nearMissesReported: number;
    incidentsReported: number;
    openCapa: number;
    overdueCapa: number;
    trainingCompletionPct: number;
    trainedPersonnel: number;
  };
}

const SafetyContext = createContext<SafetyContextValue | undefined>(undefined);

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...DEFAULT_PERSISTED, ...parsed };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

const VALID_MODULES: ModuleId[] = [
  'dashboard',
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
  'daily-reports',
  'weekly-reports',
  'monthly-reports',
  'user-management',
  'settings',
];

function getModuleFromHash(): ModuleId {
  try {
    const raw = window.location.hash.replace(/^#\/?/, '') as ModuleId;
    return VALID_MODULES.includes(raw) ? raw : 'dashboard';
  } catch {
    return 'dashboard';
  }
}

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [activeModule, setActiveModuleState] = useState<ModuleId>(getModuleFromHash);
  const [activeShift, setActiveShift] = useState<ShiftCode>('Shift A (06:00-14:00)');
  const [globalSearch, setGlobalSearch] = useState('');
  const [modalModule, setModalModule] = useState<ModuleId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setActiveModule = (id: ModuleId) => {
    setActiveModuleState(id);
    try {
      const targetHash = `#/${id}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } catch {
      // ignore history errors in restricted iframes
    }
  };

  useEffect(() => {
    const onHashChange = () => {
      setActiveModuleState(getModuleFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const openCreateModal = (module: ModuleId) => setModalModule(module);
  const closeCreateModal = () => setModalModule(null);

  const addInspection = (rec: Omit<DailyInspectionRecord, 'id'>) => {
    const id = `INSP-2026-${1143 + state.inspections.length}`;
    setState((s) => ({ ...s, inspections: [{ ...rec, id }, ...s.inspections] }));
    showToast(`Inspection ${id} logged for ${rec.zone}`);
  };

  const addNearMiss = (rec: Omit<NearMissRecord, 'id'>) => {
    const id = `NM-VKCM-${310 + state.nearMisses.length}`;
    setState((s) => ({ ...s, nearMisses: [{ ...rec, id }, ...s.nearMisses] }));
    showToast(`Near miss ${id} recorded`);
  };

  const addIncident = (rec: Omit<IncidentRecord, 'id'>) => {
    const id = `INC-2026-0${43 + state.incidents.length}`;
    setState((s) => ({ ...s, incidents: [{ ...rec, id }, ...s.incidents] }));
    showToast(`Incident report ${id} registered`);
  };

  const addHemm = (rec: Omit<HemmRecord, 'id'>) => {
    const id = `HEMM-CHK-${813 + state.hemm.length}`;
    setState((s) => ({ ...s, hemm: [{ ...rec, id }, ...s.hemm] }));
    showToast(`HEMM audit ${id} saved (${rec.fitnessStatus})`);
  };

  const addHira = (rec: Omit<HiraRecord, 'id' | 'inherentScore'>) => {
    const id = `HIRA-VKCM-0${state.hira.length + 1}`;
    const inherentScore = rec.likelihood * rec.severity;
    setState((s) => ({ ...s, hira: [{ ...rec, id, inherentScore }, ...s.hira] }));
    showToast(`HIRA ${id} added (Risk Score: ${inherentScore})`);
  };

  const addViolation = (rec: Omit<ViolationRecord, 'id'>) => {
    const id = `VIO-2026-${185 + state.violations.length}`;
    setState((s) => ({ ...s, violations: [{ ...rec, id }, ...s.violations] }));
    showToast(`Safety violation ${id} logged`);
  };

  const addCapa = (rec: Omit<CapaRecord, 'id' | 'createdDate'>) => {
    const id = `CAPA-2026-0${92 + state.capa.length}`;
    const createdDate = new Date().toISOString().slice(0, 10);
    setState((s) => ({ ...s, capa: [{ ...rec, id, createdDate }, ...s.capa] }));
    showToast(`CAPA ${id} assigned to ${rec.assignedTo}`);
  };

  const updateCapaStatus = (id: string, status: CapaRecord['status']) => {
    setState((s) => ({
      ...s,
      capa: s.capa.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
    showToast(`CAPA ${id} updated to ${status}`);
  };

  const updateNearMissStatus = (id: string, status: NearMissRecord['status']) => {
    setState((s) => ({
      ...s,
      nearMisses: s.nearMisses.map((n) => (n.id === id ? { ...n, status } : n)),
    }));
    showToast(`Near miss ${id} marked ${status}`);
  };

  const addHaulRoad = (rec: Omit<HaulRoadRecord, 'id'>) => {
    const id = `HR-SEG-0${state.haulRoads.length + 1}`;
    setState((s) => ({ ...s, haulRoads: [{ ...rec, id }, ...s.haulRoads] }));
    showToast(`Haul road check ${id} saved`);
  };

  const addDumpYard = (rec: Omit<DumpYardRecord, 'id'>) => {
    const id = `DMP-0${state.dumpYards.length + 1}`;
    setState((s) => ({ ...s, dumpYards: [{ ...rec, id }, ...s.dumpYards] }));
    showToast(`Dump yard check ${id} recorded`);
  };

  const addFireSafety = (rec: Omit<FireSafetyRecord, 'id'>) => {
    const id = `FIRE-${106 + state.fireSafety.length}`;
    setState((s) => ({ ...s, fireSafety: [{ ...rec, id }, ...s.fireSafety] }));
    showToast(`Fire asset ${id} logged`);
  };

  const addPpe = (rec: Omit<PpeRecord, 'id'>) => {
    const id = `PPE-AUD-${45 + state.ppe.length}`;
    setState((s) => ({ ...s, ppe: [{ ...rec, id }, ...s.ppe] }));
    showToast(`PPE inspection ${id} recorded`);
  };

  const addTraining = (rec: Omit<TrainingRecord, 'id'>) => {
    const id = `TRN-VTC-${215 + state.training.length}`;
    setState((s) => ({ ...s, training: [{ ...rec, id }, ...s.training] }));
    showToast(`Training record ${id} saved`);
  };

  const addMeeting = (rec: Omit<MeetingRecord, 'id'>) => {
    const id = `MTG-2026-0${90 + state.meetings.length}`;
    setState((s) => ({ ...s, meetings: [{ ...rec, id }, ...s.meetings] }));
    showToast(`Safety meeting ${id} recorded`);
  };

  const addUser = (rec: Omit<MineUser, 'id'>) => {
    const id = `USR-0${state.users.length + 1}`;
    setState((s) => ({ ...s, users: [...s.users, { ...rec, id }] }));
    showToast(`User ${rec.name} added to VKCM directory`);
  };

  const toggleUserStatus = (id: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      ),
    }));
    showToast('User access status updated');
  };

  const updateSettings = (next: MineSettings) => {
    setState((s) => ({ ...s, settings: next }));
    showToast('VKCM mine configuration saved');
  };

  const resetAllData = () => {
    setState(DEFAULT_PERSISTED);
    localStorage.removeItem(STORAGE_KEY);
    showToast('All registers restored to baseline VKCM sample data');
  };

  const kpis = useMemo(() => {
    const todayStr = '2026-11-21';
    const todayCountFromRecords = state.inspections.filter((i) => i.date === todayStr).length;
    const inspectionsToday = 14 + todayCountFromRecords; // baseline shift checks + active records
    const totalInspections = 1278 + state.inspections.length;
    const openCapa = state.capa.filter((c) => c.status !== 'Closed').length;
    const overdueCapa = state.capa.filter((c) => c.status === 'Overdue').length;
    const hazardsFromInspections = state.inspections.reduce((acc, i) => acc + i.hazardsFound, 0);
    const activeHira = state.hira.filter((h) => h.status !== 'Controlled').length;
    const hazardsIdentified = 19 + hazardsFromInspections + activeHira;
    const nearMissesReported = 10 + state.nearMisses.length;
    const incidentsReported = state.incidents.length;

    const totalTrained = state.training
      .filter((t) => t.status === 'Completed')
      .reduce((acc, t) => acc + t.passCount, 0);
    const trainedPersonnel = 329 + totalTrained;
    const trainingCompletionPct = Math.min(99.2, Number(((trainedPersonnel / 450) * 100).toFixed(1)));

    const penalty = overdueCapa * 1.4 + state.incidents.filter((i) => i.classification === 'Lost Time Injury (LTI)').length * 4;
    const safetyIndex = Math.max(72, Math.min(99.5, Number((98.4 - penalty).toFixed(1))));

    return {
      safetyIndex,
      totalInspections,
      inspectionsToday,
      dailyInspectionTarget: state.settings.dailyInspectionTarget,
      hazardsIdentified,
      nearMissesReported,
      incidentsReported,
      openCapa,
      overdueCapa,
      trainingCompletionPct,
      trainedPersonnel,
    };
  }, [state]);

  return (
    <SafetyContext.Provider
      value={{
        ...state,
        activeModule,
        setActiveModule,
        activeShift,
        setActiveShift,
        globalSearch,
        setGlobalSearch,
        modalModule,
        openCreateModal,
        closeCreateModal,
        toastMessage,
        showToast,
        addInspection,
        addNearMiss,
        addIncident,
        addHemm,
        addHira,
        addViolation,
        addCapa,
        updateCapaStatus,
        updateNearMissStatus,
        addHaulRoad,
        addDumpYard,
        addFireSafety,
        addPpe,
        addTraining,
        addMeeting,
        addUser,
        toggleUserStatus,
        updateSettings,
        resetAllData,
        kpis,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within SafetyProvider');
  return ctx;
}
