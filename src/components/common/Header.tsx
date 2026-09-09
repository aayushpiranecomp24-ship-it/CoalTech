// MINEGOV AI - Top Header Component
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import {
  Shield,
  Bell,
  Languages,
  Wifi,
  WifiOff,
  LogOut,
  MapPin,
  ChevronDown,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onToggleMobileNav, isMobileNavOpen }) => {
  const { currentUser, logout, users, quickSwitchUser, isOffline, toggleOfflineMode, notifications, offlineQueue } =
    useGovernance();
  const { language, setLanguage, t } = useI18n();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getScopeLabel = () => {
    if (!currentUser) return '';
    switch (currentUser.role) {
      case 'Coal Mine Manager':
        return t('scope_enterprise', 'Enterprise Scope • All 5 Mines');
      case 'Area Manager':
        return t('scope_area', 'Area Scope • North Area (Jharia)');
      case 'Mine Head':
        return t('scope_mine', 'Mine Operations • Jharia Deep Mine A');
      case 'Safety Officer':
        return t('scope_safety', 'Safety Scope • Jharia Deep Mine A');
      case 'Inspection Officer':
        return t('scope_inspection', 'Statutory Inspection • Jharia Deep Mine A');
      case 'Environment Officer':
        return t('scope_environment', 'Environment Scope • Jharia Deep Mine A');
      case 'Contractor Manager':
        return t('scope_contractor', 'Contractor Scope • Jharia Deep Mine A');
      case 'Finance Officer':
        return t('scope_finance', 'Corporate Finance • All Sectors');
      case 'Workforce Head':
        return t('scope_workforce', 'Workforce & Labour • Jharia Deep Mine A');
      case 'Worker':
        return t('scope_worker', 'Ground Miner • Zone 3 Excavation Face');
      case 'Regulatory Authority':
        return t('scope_regulatory', 'DGMS Surveillance • Dhanbad Directorate');
      default:
        return 'Standard Scope';
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-900 text-white h-16 flex items-center justify-between px-3 sm:px-6 z-30 sticky top-0 shadow-md">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-sky-400" /> : <Menu className="w-5 h-5 text-sky-400" />}
          </button>
        )}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="truncate">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight font-sans text-white">MINEGOV AI</span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-sky-500/10 text-sky-400 border border-sky-400/20">
              SIH 26024
            </span>
          </div>
          <p className="hidden md:block text-[10px] text-slate-400 font-medium tracking-wide">
            {t('app_subtitle', 'Smart Coal Governance & Compliance Platform')}
          </p>
        </div>
      </div>

      {/* Center: Current Mine & Area Context */}
      <div className="hidden xl:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-slate-400 font-semibold">{getScopeLabel()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs shrink-0">
        {/* Connection Mode Toggle */}
        <button
          onClick={toggleOfflineMode}
          title={isOffline ? 'Switch to Online Mode' : 'Simulate Network Outage (Offline Mode)'}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition ${
            isOffline
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
          }`}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="hidden sm:inline font-medium text-[11px]">{isOffline ? t('offline_mode', 'Offline') : t('online_mode', 'Sync Active')}</span>
          {offlineQueue.length > 0 && (
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[9px] animate-pulse">
              {offlineQueue.length}
            </span>
          )}
        </button>

        {/* Language Selector */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <Languages className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
              language === 'en' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
              language === 'hi' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition"
          title={t('notifications_title', 'Open Notification Center')}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Info & Quick Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1.5 rounded-lg text-left transition"
          >
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <span className="block font-semibold text-white text-xs leading-none">{currentUser?.name}</span>
              <span className="block text-[10px] text-sky-400 font-medium tracking-wide mt-0.5">{currentUser?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Quick Role Selection Dropdown */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-sky-400" /> {t('quick_role_switch', 'Switch Demo Role')}
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      quickSwitchUser(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                      currentUser?.id === u.id ? 'bg-sky-500/10 text-sky-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="block font-medium">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.role}</span>
                    </div>
                    {currentUser?.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-slate-800 flex items-center"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" /> {t('logout', 'Sign Out')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
