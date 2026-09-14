// COALTECH - Left Sidebar Navigation Component with TransitOps Visual Language
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Truck,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  BarChart3,
  Send,
  Scale,
  Users,
  Navigation,
  Wrench,
  Fuel,
  Mountain,
  Radio,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
}) => {
  const { isModuleAllowed, currentUser, pendingApprovals, emergencyCommand } = useGovernance();
  const { t } = useI18n();

  const isTransportActive = activeTab.startsWith('transportation');
  const [transportExpanded, setTransportExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  const showExpanded = isOpenMobile || (!collapsed || isHovered || isPinned);

  const pendingApprovalsCount = pendingApprovals.filter(a => a.status === 'PENDING').length;

  // Hierarchical navigation organized by operational domain
  const navSections = [
    {
      title: 'OPERATIONS & EXTRACTION',
      items: [
        { id: 'dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard, badge: null },
        { id: 'mines', label: t('nav_mines', 'Mines Directory'), icon: MapPin, badge: null },
        { id: 'mine-operations', label: t('nav_mine_operations', 'Pit & Mine Operations'), icon: Mountain, badge: 'Planning' },
        { id: 'hemm-assets', label: t('nav_hemm_assets', 'HEMM Heavy Machinery'), icon: Wrench, badge: 'CAN-bus' },
        { id: 'transportation', label: t('nav_transportation', 'Coal & Logistics'), icon: Truck, badge: 'Fleet', isGroup: true },
      ],
    },
    {
      title: 'STATUTORY SAFETY & GOVERNANCE',
      items: [
        { id: 'compliance', label: t('nav_compliance', 'Statutory Compliance'), icon: FileCheck2, badge: 'CMR' },
        { id: 'inspections', label: t('nav_inspections', 'Field Inspections'), icon: Eye, badge: null },
        { id: 'incidents', label: currentUser?.role === 'Worker' ? t('nav_report_hazard', 'Report Field Hazard') : t('nav_incidents', 'Safety & Hazards'), icon: AlertTriangle, badge: 'Live' },
        { id: 'corrective', label: t('nav_corrective', 'Corrective Actions'), icon: CheckCircle2, badge: 'CAPA' },
        {
          id: 'emergency',
          label: t('nav_emergency', 'Emergency Command & Muster'),
          icon: Radio,
          badge: emergencyCommand?.sirenActivated ? 'SIREN' : 'Ready'
        },
        {
          id: 'approval-center',
          label: t('nav_approval_center', 'Approval Center'),
          icon: FileCheck2,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null
        },
      ],
    },
    {
      title: 'WORKFORCE & CONTRACTORS',
      items: [
        { id: 'workforce', label: currentUser?.role === 'Worker' ? t('nav_my_shift', 'My Shift & Attendance') : t('nav_workforce', 'Workforce & Labour'), icon: HardHat, badge: null },
        { id: 'contractors', label: t('nav_contractors', 'Contractor Governance'), icon: Users2, badge: null },
      ],
    },
    {
      title: 'ENVIRONMENT & SURVEILLANCE',
      items: [
        { id: 'environment', label: t('nav_environment', 'Environmental Telemetry'), icon: Activity, badge: 'IoT' },
        { id: 'gis-map', label: t('nav_gis', 'GIS Hotzone Map'), icon: Globe2, badge: 'Vector' },
        { id: 'risk-intelligence', label: t('nav_ai', 'AI Risk Intelligence'), icon: BrainCircuit, badge: 'AI' },
      ],
    },
    {
      title: 'FINANCE, AUDIT & ASSURANCE',
      items: [
        { id: 'finance', label: t('nav_finance', 'Finance & Penalties'), icon: Coins, badge: null },
        { id: 'reports', label: t('nav_reports', 'Audit Reports & Export'), icon: FileText, badge: null },
        { id: 'daily-report', label: t('nav_daily_report', 'Daily Mine Return (DMR)'), icon: ClipboardList, badge: 'DGMS' },
        { id: 'audit-trail', label: t('nav_audit', 'Tamper-Evident Ledger'), icon: Database, badge: 'Hash' },
        { id: 'data-quality', label: t('nav_data_quality', 'Data Quality Health'), icon: ShieldCheck, badge: '96%' },
      ],
    },
    {
      title: 'SYSTEM & CONFIGURATION',
      items: [
        { id: 'notifications', label: t('nav_notifications', 'Notification Center'), icon: Bell, badge: null },
        { id: 'settings', label: t('nav_settings', 'Statutory Rules & SLA'), icon: Settings, badge: null },
      ],
    },
  ];

  const transportSubItems = [
    { id: 'transportation-dashboard', label: t('nav_trans_dashboard', 'Transport Dashboard'), icon: BarChart3 },
    { id: 'transportation-dispatch', label: t('nav_trans_dispatch', 'Coal Dispatch'), icon: Send },
    { id: 'transportation-movements', label: t('nav_trans_movements', 'Active Movements'), icon: Truck },
    { id: 'transportation-vehicles', label: t('nav_trans_vehicles', 'Vehicles'), icon: Scale },
    { id: 'transportation-drivers', label: t('nav_trans_drivers', 'Drivers'), icon: Users },
    { id: 'transportation-routes', label: t('nav_trans_routes', 'Routes'), icon: Navigation },
    { id: 'transportation-reconciliation', label: t('nav_trans_reconciliation', 'Reconciliation'), icon: CheckCircle2 },
    { id: 'transportation-maintenance', label: t('nav_trans_maintenance', 'Maintenance'), icon: Wrench },
    { id: 'transportation-fuel', label: t('nav_trans_fuel', 'Fuel'), icon: Fuel },
    { id: 'transportation-reports', label: t('nav_trans_reports', 'Transport Reports'), icon: FileText },
  ];

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleTransportParentClick = () => {
    if (!isTransportActive) {
      onSelectTab('transportation-dashboard');
      setTransportExpanded(true);
    } else {
      setTransportExpanded((prev) => !prev);
    }
    if (onCloseMobile && window.innerWidth < 768) {
      onCloseMobile();
    }
  };

  const handleToggleArrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTransportExpanded((prev) => !prev);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: showExpanded ? 260 : 70,
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] z-20 shrink-0 select-none overflow-hidden',
        'fixed inset-y-0 left-0 md:static transition-transform duration-200 ease-in-out md:translate-x-0',
        isOpenMobile ? 'translate-x-0 shadow-2xl z-50 w-72' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Top Header / Role Bar */}
      <div className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4 shrink-0 bg-[var(--color-surface)]/40">
        {showExpanded ? (
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-subtle)] truncate">
              {currentUser?.role || 'Operational Menu'}
            </span>
          </div>
        ) : (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <LayoutDashboard className="h-4 w-4" />
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] md:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Desktop collapse & pin buttons */}
          {onToggleCollapse && (
            <>
              <button
                onClick={() => setIsPinned((v) => !v)}
                className={cn(
                  'hidden rounded-lg p-1.5 transition-colors hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] md:block cursor-pointer',
                  !showExpanded && 'hidden'
                )}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={onToggleCollapse}
                className="hidden rounded-lg p-1.5 transition-colors hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] md:block cursor-pointer"
                title={showExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {showExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links Grouped by Section */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {navSections.map((section, idx) => {
          // Filter items allowed by RBAC
          const allowedItems = section.items.filter((item) => isModuleAllowed(item.id));
          if (allowedItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {showExpanded && (
                <div className="px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[var(--color-text-subtle)]/70">
                  {section.title}
                </div>
              )}

              {allowedItems.map((item) => {
                const Icon = item.icon;

                // Hierarchical Transportation Accordion Group
                if (item.id === 'transportation') {
                  const isGroupActive = isTransportActive;
                  const isGroupOpen = transportExpanded && showExpanded;

                  return (
                    <div key={item.id} className="space-y-0.5">
                      <div
                        className={cn(
                          'group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer select-none',
                          isGroupActive
                            ? 'bg-[var(--color-primary-soft)] text-[#60a5fa] font-semibold'
                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
                          !showExpanded && 'justify-center px-2'
                        )}
                        onClick={handleTransportParentClick}
                        title={!showExpanded ? item.label : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={cn(
                              'h-4.5 w-4.5 shrink-0 transition-colors',
                              isGroupActive ? 'text-[#60a5fa]' : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text)]'
                            )}
                          />
                          {showExpanded && <span className="truncate">{item.label}</span>}
                        </div>

                        {showExpanded && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 text-[9px] font-bold text-[#60a5fa] border border-[var(--color-border)]">
                                {item.badge}
                              </span>
                            )}
                            <button
                              onClick={handleToggleArrow}
                              className="rounded-md p-1 hover:bg-[var(--color-surface-3)] text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                              title={isGroupOpen ? 'Collapse sub-menu' : 'Expand sub-menu'}
                            >
                              <ChevronDown
                                className={cn(
                                  'h-3.5 w-3.5 transition-transform duration-200',
                                  isGroupOpen && 'rotate-180'
                                )}
                              />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Sub-menu accordion */}
                      <AnimatePresence initial={false}>
                        {isGroupOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden pl-5 pr-1 space-y-0.5"
                          >
                            {transportSubItems.map((sub) => {
                              const isSubActive = activeTab === sub.id;
                              const SubIcon = sub.icon;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => handleTabClick(sub.id)}
                                  className={cn(
                                    'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 text-left cursor-pointer',
                                    isSubActive
                                      ? 'bg-[var(--color-primary-soft)] text-[#60a5fa] font-semibold'
                                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                                  )}
                                >
                                  <SubIcon
                                    className={cn(
                                      'h-3.5 w-3.5 shrink-0',
                                      isSubActive ? 'text-[#60a5fa]' : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text)]'
                                    )}
                                  />
                                  <span className="truncate">{sub.label}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Regular Single Nav Item
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      'group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer select-none text-left',
                      isActive
                        ? 'bg-[var(--color-primary-soft)] text-[#60a5fa] font-semibold'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
                      !showExpanded && 'justify-center px-2'
                    )}
                    title={!showExpanded ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'h-4.5 w-4.5 shrink-0 transition-colors',
                          isActive ? 'text-[#60a5fa]' : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text)]'
                        )}
                      />
                      {showExpanded && <span className="truncate">{item.label}</span>}
                    </div>

                    {showExpanded && item.badge && (
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 border',
                          item.badge === 'CMR'
                            ? 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/25'
                            : item.badge === 'Live'
                            ? 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/25'
                            : item.badge === 'AI'
                            ? 'bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/25'
                            : item.badge === 'SIREN'
                            ? 'bg-red-600 text-white animate-pulse border-red-500 font-extrabold'
                            : item.badge === 'DGMS'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : 'bg-[var(--color-surface-3)] text-[var(--color-text-subtle)] border-[var(--color-border)]'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Status / Sector Badge */}
      {showExpanded && (
        <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-surface)]/30">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-[11px] shadow-sm">
            <div className="flex items-center justify-between text-[var(--color-text-subtle)] font-bold text-[10px] uppercase tracking-wider">
              <span>DGMS Status</span>
              <span className="flex items-center gap-1 text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" /> Active
              </span>
            </div>
            <div className="mt-1 text-[var(--color-text)] font-semibold truncate text-[11px]">
              {currentUser?.name}
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
