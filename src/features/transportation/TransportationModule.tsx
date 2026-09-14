// COALTECH - Comprehensive Coal Logistics, Fleet & Siding Transportation Module
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import {
  Truck,
  Scale,
  Users,
  Wrench,
  Fuel,
  BarChart3,
  Plus,
  CheckCircle2,
  Navigation,
  FileText,
  Send,
} from 'lucide-react';
import type { CoalMovement } from '../../types';

import { Reveal } from '../../components/animations/Reveal';
import { Magnetic } from '../../components/animations/Magnetic';

// Tab Components
import { CoalMovementsTab } from './components/CoalMovementsTab';
import { FleetVehiclesTab } from './components/FleetVehiclesTab';
import { DriversTab } from './components/DriversTab';
import { RoutesTab } from './components/RoutesTab';
import { ReconciliationTab } from './components/ReconciliationTab';
import { MaintenanceTab } from './components/MaintenanceTab';
import { FuelExpensesTab } from './components/FuelExpensesTab';
import { TransportationAnalyticsTab } from './components/TransportationAnalyticsTab';
import { TransportReportsTab } from './components/TransportReportsTab';

// Modals & Drawers
import { DispatchWizardModal } from './components/DispatchWizardModal';
import { ReceiptReconciliationModal } from './components/ReceiptReconciliationModal';
import { MovementDetailDrawer } from './components/MovementDetailDrawer';

export type TransportSubTab =
  | 'dashboard'
  | 'dispatch'
  | 'movements'
  | 'vehicles'
  | 'drivers'
  | 'routes'
  | 'reconciliation'
  | 'maintenance'
  | 'fuel'
  | 'reports';

interface TransportationModuleProps {
  initialSubTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const TransportationModule: React.FC<TransportationModuleProps> = ({
  initialSubTab = 'dashboard',
  onNavigateTab,
}) => {
  const { t } = useI18n();

  // Normalize initialSubTab
  const normalizeSubTab = (tab?: string): TransportSubTab => {
    if (!tab || tab === 'transportation') return 'dashboard';
    const cleaned = tab.replace('transportation-', '') as TransportSubTab;
    const validTabs: TransportSubTab[] = [
      'dashboard',
      'dispatch',
      'movements',
      'vehicles',
      'drivers',
      'routes',
      'reconciliation',
      'maintenance',
      'fuel',
      'reports',
    ];
    return validTabs.includes(cleaned) ? cleaned : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<TransportSubTab>(normalizeSubTab(initialSubTab));

  // Sync if initialSubTab prop changes externally (e.g. from Sidebar or Dashboard click)
  useEffect(() => {
    if (initialSubTab) {
      const normalized = normalizeSubTab(initialSubTab);
      setActiveTab(normalized);
      if (normalized === 'dispatch') {
        setIsDispatchWizardOpen(true);
      }
    }
  }, [initialSubTab]);

  // Modal states
  const [isDispatchWizardOpen, setIsDispatchWizardOpen] = useState(false);
  const [receiptModalMovement, setReceiptModalMovement] = useState<CoalMovement | null>(null);
  const [detailDrawerMovement, setDetailDrawerMovement] = useState<CoalMovement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTabChange = (tabId: TransportSubTab) => {
    setActiveTab(tabId);
    if (tabId === 'dispatch') {
      setIsDispatchWizardOpen(true);
    }
    if (onNavigateTab) {
      onNavigateTab(`transportation-${tabId}`);
    }
  };

  const navTabs: { id: TransportSubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t('nav_trans_dashboard', 'Transport Dashboard'), icon: BarChart3 },
    { id: 'dispatch', label: t('nav_trans_dispatch', 'Coal Dispatch'), icon: Send },
    { id: 'movements', label: t('nav_trans_movements', 'Active Movements'), icon: Truck },
    { id: 'vehicles', label: t('nav_trans_vehicles', 'Vehicles'), icon: Scale },
    { id: 'drivers', label: t('nav_trans_drivers', 'Drivers'), icon: Users },
    { id: 'routes', label: t('nav_trans_routes', 'Routes'), icon: Navigation },
    { id: 'reconciliation', label: t('nav_trans_reconciliation', 'Reconciliation'), icon: CheckCircle2 },
    { id: 'maintenance', label: t('nav_trans_maintenance', 'Maintenance'), icon: Wrench },
    { id: 'fuel', label: t('nav_trans_fuel', 'Fuel'), icon: Fuel },
    { id: 'reports', label: t('nav_trans_reports', 'Transport Reports'), icon: FileText },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Module Header */}
      <Reveal direction="up" delay={0.02}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl shadow-card">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
                {t('nav_transportation', 'Coal Logistics, Fleet & Siding Weighbridge Governance')}
              </h1>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Real-time dispatch manifests, heavy tipper fleet management, HCV driver rosters, weighbridge load cell telemetry, and statutory transit loss reconciliation.
            </p>
          </div>

          {/* Global Quick Actions */}
          <div className="flex items-center space-x-2">
            <Magnetic>
              <button
                onClick={() => setIsDispatchWizardOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('btn_new_dispatch', 'New Coal Dispatch')}</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </Reveal>

      {/* Sub Tab Navigation Pills */}
      <Reveal direction="up" delay={0.04}>
        <div className="border-b border-[var(--color-border)] overflow-x-auto">
          <div className="flex space-x-1 min-w-max pb-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-[var(--color-text-subtle)]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Active Tab View */}
      <Reveal direction="up" delay={0.08}>
        {activeTab === 'dashboard' && <TransportationAnalyticsTab />}

        {(activeTab === 'movements' || activeTab === 'dispatch') && (
          <CoalMovementsTab
            onOpenDispatchWizard={() => setIsDispatchWizardOpen(true)}
            onOpenReceiptModal={(m) => setReceiptModalMovement(m)}
            onOpenDetailDrawer={(m) => setDetailDrawerMovement(m)}
          />
        )}

        {activeTab === 'vehicles' && <FleetVehiclesTab />}

        {activeTab === 'drivers' && <DriversTab />}

        {activeTab === 'routes' && <RoutesTab />}

        {activeTab === 'reconciliation' && (
          <ReconciliationTab
            onOpenReceiptModal={(m) => setReceiptModalMovement(m)}
            onOpenDetailDrawer={(m) => setDetailDrawerMovement(m)}
          />
        )}

        {activeTab === 'maintenance' && <MaintenanceTab />}

        {activeTab === 'fuel' && <FuelExpensesTab />}

        {activeTab === 'reports' && <TransportReportsTab />}
      </Reveal>

      {/* Modals & Drawers */}
      <DispatchWizardModal
        isOpen={isDispatchWizardOpen}
        onClose={() => setIsDispatchWizardOpen(false)}
        onSuccess={(id) => showToast(`Coal Movement ${id} successfully authorized & dispatched!`)}
      />

      <ReceiptReconciliationModal
        isOpen={Boolean(receiptModalMovement)}
        onClose={() => setReceiptModalMovement(null)}
        movement={receiptModalMovement}
        onSuccess={() => showToast(`Weighbridge Gross/Tare Receipt reconciled successfully!`)}
      />

      <MovementDetailDrawer
        movement={detailDrawerMovement}
        isOpen={Boolean(detailDrawerMovement)}
        onClose={() => setDetailDrawerMovement(null)}
      />
    </div>
  );
};
