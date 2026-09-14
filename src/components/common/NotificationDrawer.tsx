import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGovernance } from '../../context/GovernanceContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  X,
  Bell,
  MessageSquare,
  Mail,
  PhoneCall,
  Smartphone,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, clearNotification, markAllNotificationsRead } = useGovernance();
  const [channelFilter, setChannelFilter] = useState<'all' | 'in-app' | 'sms' | 'email' | 'voice' | 'whatsapp'>('all');

  const filtered = notifications.filter((n) => {
    if (channelFilter === 'all') return true;
    return n.channel === channelFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case 'sms':
        return <Smartphone className="w-4 h-4 text-[#60a5fa]" />;
      case 'email':
        return <Mail className="w-4 h-4 text-[#a78bfa]" />;
      case 'voice':
        return <PhoneCall className="w-4 h-4 text-[#fbbf24]" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-[#34d399]" />;
      case 'in-app':
      default:
        return <Bell className="w-4 h-4 text-[#22d3ee]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-elevated text-[var(--color-text)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text)]">
                    Notification Center
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {unreadCount} unread · {notifications.length} statutory alerts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={markAllNotificationsRead}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-2.5">
              <div className="flex space-x-1.5 overflow-x-auto text-xs no-scrollbar">
                {(['all', 'in-app', 'sms', 'email', 'voice', 'whatsapp'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={cn(
                      'rounded-lg px-2.5 py-1 font-medium capitalize whitespace-nowrap transition-all duration-200 cursor-pointer',
                      channelFilter === ch
                        ? 'bg-[var(--color-primary)] text-white shadow-sm font-semibold'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                    )}
                  >
                    {ch === 'all' ? 'All Channels' : ch.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--color-text-muted)] space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mx-auto text-[var(--color-text-subtle)]">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-xs">No notifications recorded in this channel.</p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isCritical = item.severity === 'CRITICAL';
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => clearNotification(item.id)}
                      className={cn(
                        'group rounded-2xl border p-4 transition-all duration-200 cursor-pointer shadow-sm relative',
                        item.read
                          ? 'border-[var(--color-border)] bg-[var(--color-surface)]/40 hover:bg-[var(--color-surface-2)] opacity-80'
                          : isCritical
                          ? 'border-[#ef4444]/30 bg-[#ef4444]/5 hover:bg-[#ef4444]/10'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-card'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-[var(--color-surface-2)]">
                            {getChannelIcon(item.channel)}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                            {item.channel || 'IN-APP'}
                          </span>
                          {isCritical && (
                            <span className="bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171] font-bold px-1.5 py-0.5 rounded-full text-[9px] flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> CRITICAL
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[var(--color-text-subtle)] font-mono">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>

                      <h4 className="font-semibold text-xs text-[var(--color-text)] mb-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[var(--color-border)] flex justify-between items-center text-[10px] text-[var(--color-text-subtle)]">
                        <span>Audience: {item.role}</span>
                        <span className="text-[#34d399] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                          {item.deliveryStatus || 'Delivered'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-surface)] text-[10px] text-[var(--color-text-subtle)] text-center">
              Statutory Multi-Channel Alert Gateway • Twilio & DGMS Dispatch Sim
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
