// COALTECH - Unified Main Desktop Layout with TransitOps Design System
import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import { useLenis } from '../hooks/useLenis';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoControlPanel } from '../components/common/DemoControlPanel';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { SearchModal } from '../components/dashboard/SearchModal';
import { AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface MainLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const { isModuleAllowed, currentUser } = useGovernance();
  const { t } = useI18n();

  // Initialize smooth scrolling where appropriate
  useLenis();

  const isAllowed = isModuleAllowed(activeTab);

  const showToast = (msg: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSearchNavigate = (tabId: string) => {
    if (tabId === 'open_search') {
      setShowSearchModal(true);
      return;
    }
    onSelectTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-sans relative overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
      {/* Toast Notification Popup */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] max-w-sm p-4 rounded-2xl shadow-elevated border text-xs flex items-start space-x-3 transition animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#fca5a5]'
              : toast.type === 'warning'
              ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#fde68a]'
              : 'bg-[var(--color-surface)] border-[var(--color-border-strong)] text-[var(--color-text)]'
          }`}
        >
          <AlertCircle
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              toast.type === 'error'
                ? 'text-[#f87171]'
                : toast.type === 'warning'
                ? 'text-[#fbbf24]'
                : 'text-[#34d399]'
            }`}
          />
          <div className="flex-1">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-[var(--color-text-subtle)]">
              CoalTech Notification
            </span>
            <p className="mt-0.5 leading-relaxed">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Top Navbar */}
      <Header
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        isMobileNavOpen={mobileNavOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpenMobile={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        />

        {/* Center Viewport */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] overflow-x-hidden min-w-0 grid-bg-fine">
          {isAllowed ? (
            children
          ) : (
            <div className="p-8 max-w-md mx-auto my-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center space-y-4 shadow-elevated">
              <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-text)] font-display tracking-tight">
                {t('restricted_route_title', 'Access Restricted')}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {t('restricted_route_desc', 'Your current statutory role does not have authorization to access this operational module.')}{' '}
                (<strong>{currentUser?.role}</strong>)
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSelectTab('dashboard')}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                {t('restricted_route_back', 'Return to Dashboard')}
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K / Ctrl+K) */}
      <SearchModal
        open={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onNavigate={handleSearchNavigate}
      />

      {/* Multi-Channel Notification Drawer */}
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Floating Sandbox Interactive Demo Controller */}
      <DemoControlPanel onNavigateTab={onSelectTab} onShowToast={showToast} />
    </div>
  );
};
