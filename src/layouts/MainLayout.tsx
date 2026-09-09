// MINEGOV AI - Enterprise Main Desktop Layout
import React, { useState } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { useI18n } from '../context/I18nContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { DemoControlPanel } from '../components/common/DemoControlPanel';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

interface MainLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const { isModuleAllowed, currentUser } = useGovernance();
  const { t } = useI18n();

  const isAllowed = isModuleAllowed(activeTab);

  const showToast = (msg: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Toast Popup Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] max-w-sm p-4 rounded-xl shadow-2xl border text-xs flex items-start space-x-3 transition animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-200'
              : toast.type === 'warning'
              ? 'bg-amber-950 border-amber-800 text-amber-200'
              : 'bg-slate-900 border-slate-750 text-white'
          }`}
        >
          <AlertCircle
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              toast.type === 'error'
                ? 'text-red-400'
                : toast.type === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          />
          <div className="flex-1">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400">
              MINEGOV System Alert
            </span>
            <p className="mt-0.5">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Top Navbar */}
      <Header
        onOpenNotifications={() => setShowNotifications(true)}
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
        />

        {/* Center Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 overflow-x-hidden min-w-0">
          {isAllowed ? (
            children
          ) : (
            <div className="p-8 max-w-md mx-auto my-16 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">{t('restricted_route_title')}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('restricted_route_desc')}{' '}
                (<strong>{currentUser?.role}</strong>)
              </p>
              <button
                onClick={() => onSelectTab('dashboard')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition inline-flex items-center space-x-1.5 shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('restricted_route_back')}</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Multi-Channel Notification Drawer */}
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Floating Sandbox Interactive Demo Controller */}
      <DemoControlPanel onNavigateTab={onSelectTab} onShowToast={showToast} />
    </div>
  );
};
