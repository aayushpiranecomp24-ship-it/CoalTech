// MINEGOV AI - Left Sidebar Navigation Component
import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import {
  LayoutDashboard,
  MapPin,
  FileCheck2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Users2,
  HardHat,
  Activity,
  Globe2,
  BrainCircuit,
  FileText,
  Database,
  Bell,
  Coins,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { isModuleAllowed, currentUser } = useGovernance();
  const { t } = useI18n();

  const allNavItems = [
    { id: 'dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'mines', label: t('nav_mines', 'Mines Directory'), icon: MapPin, badge: null },
    { id: 'compliance', label: t('nav_compliance', 'Statutory Compliance'), icon: FileCheck2, badge: 'CMR' },
    { id: 'inspections', label: t('nav_inspections', 'Field Inspections'), icon: Eye, badge: null },
    { id: 'incidents', label: currentUser?.role === 'Worker' ? t('nav_report_hazard', 'Report Field Hazard') : t('nav_incidents', 'Safety & Hazards'), icon: AlertTriangle, badge: 'Live' },
    { id: 'corrective', label: t('nav_corrective', 'Corrective Actions'), icon: CheckCircle2, badge: 'CAPA' },
    { id: 'contractors', label: t('nav_contractors', 'Contractor Governance'), icon: Users2, badge: null },
    { id: 'workforce', label: currentUser?.role === 'Worker' ? t('nav_my_shift', 'My Shift & Attendance') : t('nav_workforce', 'Workforce & Labour'), icon: HardHat, badge: null },
    { id: 'environment', label: t('nav_environment', 'Environmental Telemetry'), icon: Activity, badge: 'IoT' },
    { id: 'gis-map', label: t('nav_gis', 'GIS Hotzone Map'), icon: Globe2, badge: 'Vector' },
    { id: 'risk-intelligence', label: t('nav_ai', 'AI Risk Intelligence'), icon: BrainCircuit, badge: 'AI' },
    { id: 'finance', label: t('nav_finance', 'Finance & Penalties'), icon: Coins, badge: null },
    { id: 'reports', label: t('nav_reports', 'Audit Reports & Export'), icon: FileText, badge: null },
    { id: 'audit-trail', label: t('nav_audit', 'Tamper-Evident Ledger'), icon: Database, badge: 'Hash' },
    { id: 'notifications', label: t('nav_notifications', 'Notification Center'), icon: Bell, badge: null },
    { id: 'settings', label: t('nav_settings', 'Statutory Rules & SLA'), icon: Settings, badge: null },
  ];

  const navItems = allNavItems.filter((item) => isModuleAllowed(item.id));

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-900 text-slate-400 flex flex-col justify-between shrink-0 select-none overflow-y-auto transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-20 ${
        isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      <div className="p-3 space-y-4">
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between px-3 py-1 md:hidden border-b border-slate-900 pb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Operational Modules
          </span>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-sky-400 flex items-center justify-between">
            <span className="truncate">{currentUser?.role}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 uppercase font-mono font-bold shrink-0 ml-1">
              {currentUser?.scope === 'all' ? 'Enterprise' : currentUser?.areaId && !currentUser?.mineId ? 'Area' : currentUser?.role === 'Worker' ? 'Worker' : 'Mine'}
            </span>
          </div>
        </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-400/30 shadow-sm'
                      : 'hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isActive
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-slate-850 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      {/* DGMS Regulatory Footer */}
      <div className="p-3.5 border-t border-slate-900 bg-slate-950/80">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-sky-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CMR 2017 Framework</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Directorate General of Mines Safety aligned compliance engine.
          </p>
        </div>
      </div>
    </aside>
  );
};
