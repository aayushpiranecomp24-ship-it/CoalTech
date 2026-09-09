// MINEGOV AI - Root Application Component
import { useState } from 'react';
import { useGovernance } from './context/GovernanceContext';
import { LoginPage } from './pages/LoginPage';
import { MobileWorkerPage } from './pages/MobileWorkerPage';
import { DashboardPage } from './pages/DashboardPage';
import { MineOverviewPage } from './pages/MineOverviewPage';
import { MainLayout } from './layouts/MainLayout';

// Feature Modules
import { ComplianceModule } from './features/compliance/ComplianceModule';
import { InspectionsModule } from './features/inspections/InspectionsModule';
import { IncidentsModule } from './features/incidents/IncidentsModule';
import { CorrectiveActionsModule } from './features/correctiveActions/CorrectiveActionsModule';
import { ContractorsModule } from './features/contractors/ContractorsModule';
import { WorkforceModule } from './features/workforce/WorkforceModule';
import { EnvironmentModule } from './features/environment/EnvironmentModule';
import { GisModule } from './features/gis/GisModule';
import { AIRiskModule } from './features/ai/AIRiskModule';
import { FinanceModule } from './features/finance/FinanceModule';
import { ReportsModule } from './features/reports/ReportsModule';
import { AuditBlockchainModule } from './features/audit/AuditBlockchainModule';
import { NotificationsModule } from './features/notifications/NotificationsModule';
import { SettingsModule } from './features/settings/SettingsModule';

export default function App() {
  const { currentUser } = useGovernance();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [forceDesktopForWorker, setForceDesktopForWorker] = useState(false);

  // 1. Unauthenticated State
  if (!currentUser) {
    return <LoginPage />;
  }

  // 2. Field Worker Role (Default to Mobile Experience)
  if (currentUser.role === 'Worker' && !forceDesktopForWorker) {
    return (
      <div className="relative">
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => setForceDesktopForWorker(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 shadow-md"
          >
            Switch to Desktop Layout
          </button>
        </div>
        <MobileWorkerPage />
      </div>
    );
  }

  // 3. Main Enterprise Desktop Layout for all Officers & Management
  return (
    <MainLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage onNavigateTab={setActiveTab} />}
      {activeTab === 'mines' && <MineOverviewPage onNavigateTab={setActiveTab} />}
      {activeTab === 'compliance' && <ComplianceModule />}
      {activeTab === 'inspections' && <InspectionsModule />}
      {activeTab === 'incidents' && <IncidentsModule />}
      {activeTab === 'corrective' && <CorrectiveActionsModule />}
      {activeTab === 'contractors' && <ContractorsModule />}
      {activeTab === 'workforce' && <WorkforceModule />}
      {activeTab === 'environment' && <EnvironmentModule />}
      {activeTab === 'gis-map' && <GisModule />}
      {activeTab === 'risk-intelligence' && <AIRiskModule />}
      {activeTab === 'finance' && <FinanceModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'audit-trail' && <AuditBlockchainModule />}
      {activeTab === 'notifications' && <NotificationsModule />}
      {activeTab === 'settings' && <SettingsModule />}
    </MainLayout>
  );
}
