// COALTECH - Root Application Component
import { useState, useEffect } from 'react';
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
import { TransportationModule } from './features/transportation/TransportationModule';

// New Integrated Operational & Governance Modules
import { MineOperationsModule } from './features/operations/MineOperationsModule';
import { HemmAssetsModule } from './features/hemm/HemmAssetsModule';
import { EmergencyModule } from './features/emergency/EmergencyModule';
import { ApprovalCenterModule } from './features/governance/ApprovalCenterModule';
import { DataQualityModule } from './features/governance/DataQualityModule';
import { DailyMineReportView } from './features/reports/DailyMineReportView';

export default function App() {
  const { currentUser, isModuleAllowed } = useGovernance();

  const getInitialTab = (): string => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) return hash;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [forceDesktopForWorker, setForceDesktopForWorker] = useState(false);

  // Synchronize route and permissions when user changes or hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.location.hash.replace(/^#\/?/, '') !== tab) {
      window.location.hash = tab;
    }
  };

  useEffect(() => {
    if (currentUser) {
      // If the current tab is not allowed for the user's role, route safely to dashboard
      if (!isModuleAllowed(activeTab)) {
        setActiveTab('dashboard');
        if (typeof window !== 'undefined') {
          window.location.hash = 'dashboard';
        }
      }
    }
  }, [currentUser]);

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
  const isAllowed = isModuleAllowed(activeTab);

  return (
    <MainLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {!isAllowed ? null : (
        <>
          {activeTab === 'dashboard' && <DashboardPage onNavigateTab={handleSelectTab} />}
          {activeTab === 'mines' && <MineOverviewPage onNavigateTab={handleSelectTab} />}
          {activeTab === 'mine-operations' && <MineOperationsModule />}
          {activeTab === 'hemm-assets' && <HemmAssetsModule />}
          {activeTab === 'compliance' && <ComplianceModule />}
          {activeTab === 'inspections' && <InspectionsModule />}
          {activeTab === 'incidents' && <IncidentsModule />}
          {activeTab === 'corrective' && <CorrectiveActionsModule />}
          {activeTab === 'emergency' && <EmergencyModule />}
          {activeTab === 'approval-center' && <ApprovalCenterModule />}
          {activeTab === 'contractors' && <ContractorsModule />}
          {activeTab.startsWith('transportation') && (
            <TransportationModule
              initialSubTab={activeTab === 'transportation' ? 'dashboard' : activeTab.replace('transportation-', '')}
              onNavigateTab={handleSelectTab}
            />
          )}
          {activeTab === 'workforce' && <WorkforceModule />}
          {activeTab === 'environment' && <EnvironmentModule />}
          {activeTab === 'gis-map' && <GisModule />}
          {activeTab === 'risk-intelligence' && <AIRiskModule />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'reports' && <ReportsModule />}
          {activeTab === 'daily-report' && <DailyMineReportView />}
          {activeTab === 'audit-trail' && <AuditBlockchainModule />}
          {activeTab === 'data-quality' && <DataQualityModule />}
          {activeTab === 'notifications' && <NotificationsModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </>
      )}
    </MainLayout>
  );
}
