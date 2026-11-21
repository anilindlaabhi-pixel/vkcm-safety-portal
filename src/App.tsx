/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SettingsView, UserManagementView } from './components/AdminModules';
import { DashboardView } from './components/DashboardView';
import {
  DailyInspectionModuleView,
  DumpYardModuleView,
  HaulRoadModuleView,
  HiraModuleView,
} from './components/FieldSafetyModules';
import { Layout } from './components/Layout';
import {
  CapaTrackerView,
  FireSafetyView,
  HemmInspectionView,
  IncidentView,
  NearMissView,
  PpeInspectionView,
  SafetyMeetingsView,
  SafetyTrainingView,
  ViolationRegisterView,
} from './components/OperationalRegisters';
import { RecordModal } from './components/RecordModal';
import { ReportsModuleView } from './components/ReportsView';
import { SafetyProvider, useSafety } from './context/SafetyContext';

const ActiveModuleContent: React.FC = () => {
  const { activeModule } = useSafety();

  switch (activeModule) {
    case 'dashboard':
      return <DashboardView />;
    case 'daily-inspection':
      return <DailyInspectionModuleView />;
    case 'near-miss':
      return <NearMissView />;
    case 'accident-incident':
      return <IncidentView />;
    case 'hemm-inspection':
      return <HemmInspectionView />;
    case 'hira':
      return <HiraModuleView />;
    case 'safety-violation':
      return <ViolationRegisterView />;
    case 'capa':
      return <CapaTrackerView />;
    case 'haul-road':
      return <HaulRoadModuleView />;
    case 'dump-yard':
      return <DumpYardModuleView />;
    case 'fire-safety':
      return <FireSafetyView />;
    case 'ppe-inspection':
      return <PpeInspectionView />;
    case 'safety-training':
      return <SafetyTrainingView />;
    case 'safety-meetings':
      return <SafetyMeetingsView />;
    case 'daily-reports':
      return <ReportsModuleView mode="daily" />;
    case 'weekly-reports':
      return <ReportsModuleView mode="weekly" />;
    case 'monthly-reports':
      return <ReportsModuleView mode="monthly" />;
    case 'user-management':
      return <UserManagementView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

export default function App() {
  return (
    <SafetyProvider>
      <Layout>
        <ActiveModuleContent />
      </Layout>
      <RecordModal />
    </SafetyProvider>
  );
}
