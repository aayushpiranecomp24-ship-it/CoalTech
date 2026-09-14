import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  Shield,
  Bell,
  Languages,
  Wifi,
  WifiOff,
  LogOut,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSearch?: () => void;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSearch,
  onToggleMobileNav,
  isMobileNavOpen,
}) => {
  const {
    currentUser,
    logout,
    users,
    quickSwitchUser,
    isOffline,
    toggleOfflineMode,
    notifications,
    offlineQueue,
  } = useGovernance();
  const { language, setLanguage, t } = useI18n();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getScopeBadge = () => {
    if (!currentUser) return null;
    let label = 'Enterprise';
    let tone = 'bg-[#3b82f6]/10 text-[#60a5fa] border-[#3b82f6]/20';

    if (currentUser.role === 'Transportation Head') {
      label = 'Haulage & Logistics';
      tone = 'bg-[#06b6d4]/10 text-[#22d3ee] border-[#06b6d4]/20';
    } else if (currentUser.scope.startsWith('mine:')) {
      label = 'Mine Sector';
      tone = 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/20';
    } else if (currentUser.scope.startsWith('area:')) {
      label = 'Area Lead';
      tone = 'bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/20';
    } else if (currentUser.role === 'Regulatory Authority') {
      label = 'DGMS Central';
      tone = 'bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20';
    }

    return (
      <span className={cn('hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', tone)}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {label}
      </span>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CT';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 px-4 backdrop-blur-xl md:px-6 shadow-sm">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="rounded-xl p-2 transition-colors hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] md:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-[var(--color-primary)]" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* Brand Shield & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-md shadow-[#3b82f6]/20 shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[var(--color-text)]">
                COALTECH
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[var(--color-primary-soft)] text-[#60a5fa] border border-[var(--color-primary)]/20">
                GOVERNANCE
              </span>
              {getScopeBadge()}
            </div>
            <p className="hidden md:block text-[11px] text-[var(--color-text-muted)] font-normal tracking-normal truncate">
              {t('app_subtitle', 'Smart Coal Governance, Safety & Siding Logistics Platform')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-xs shrink-0">
        {/* Global Search Bar Button */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-subtle)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] cursor-pointer shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-[var(--color-text-subtle)]" />
            <span>Search modules, mines, dispatches...</span>
            <kbd className="ml-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-subtle)]">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Connection Status Indicator */}
        <button
          onClick={toggleOfflineMode}
          title={isOffline ? 'Switch to Online Mode' : 'Simulate Network Outage (Offline Mode)'}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs',
            isOffline
              ? 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/30'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
          )}
        >
          {isOffline ? (
            <WifiOff className="w-3.5 h-3.5 text-[#f87171] animate-pulse" />
          ) : (
            <Wifi className="w-3.5 h-3.5 text-[#34d399]" />
          )}
          <span className="hidden sm:inline font-medium text-[11px]">
            {isOffline ? t('offline_mode', 'Offline') : t('online_mode', 'Sync Active')}
          </span>
          {offlineQueue.length > 0 && (
            <span className="bg-[#fbbf24] text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[9px] animate-pulse">
              {offlineQueue.length}
            </span>
          )}
        </button>

        {/* Language Switcher */}
        <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          <Languages className="w-3.5 h-3.5 ml-1.5 text-[var(--color-text-subtle)]" />
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer',
              language === 'en'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={cn(
              'px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer',
              language === 'hi'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            )}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-all cursor-pointer"
          title={t('notifications_title', 'Open Notification Center')}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Info & Quick Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 pr-2.5 transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xs font-bold text-white shadow-sm">
              {getInitials(currentUser?.name)}
            </div>
            <div className="hidden md:block text-left">
              <span className="block font-semibold text-[var(--color-text)] text-xs leading-none">
                {currentUser?.name}
              </span>
              <span className="block text-[10px] text-[#60a5fa] font-medium tracking-wide mt-0.5">
                {currentUser?.role}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[var(--color-text-subtle)] transition-transform duration-200',
                showRoleDropdown && 'rotate-180'
              )}
            />
          </button>

          {/* Quick Role Selection Dropdown */}
          {showRoleDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRoleDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-elevated py-2 z-50 text-[var(--color-text)]">
                <div className="px-3.5 py-2 border-b border-[var(--color-border)] text-[10px] uppercase font-bold text-[var(--color-text-subtle)] tracking-wider flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  {t('quick_role_switch', 'Switch Demo Persona')}
                </div>
                <div className="max-h-72 overflow-y-auto p-1 space-y-0.5">
                  {users.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          quickSwitchUser(u);
                          setShowRoleDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-[var(--color-primary-soft)] text-[#60a5fa] font-semibold'
                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                        )}
                      >
                        <div className="truncate pr-2">
                          <span className="block font-medium truncate">{u.name}</span>
                          <span className="text-[10px] text-[var(--color-text-subtle)] truncate block">
                            {u.role}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-[var(--color-border)] p-1.5 mt-1">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#f87171] hover:bg-[#ef4444]/10 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('logout', 'Sign Out')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
