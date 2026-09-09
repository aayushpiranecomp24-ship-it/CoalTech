// MINEGOV AI - Notifications Module Full View
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Bell,
  CheckCheck,
  Search,
} from 'lucide-react';

export const NotificationsModule: React.FC = () => {
  const { notifications, clearNotification, markAllNotificationsRead } = useGovernance();
  const { t } = useI18n();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notifications.filter((n) => {
    const matchesChannel = channelFilter === 'all' || n.channel === channelFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const getChannelBadge = (ch?: string) => {
    switch (ch) {
      case 'sms':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-300">SMS</span>;
      case 'email':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-300">EMAIL</span>;
      case 'voice':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-300">VOICE CALL</span>;
      case 'whatsapp':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-300">WHATSAPP</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-300">IN-APP</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_notifications', 'Statutory Alert & Notification Center')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit history of automated alert dispatches across In-App, Twilio SMS, Voice, and WhatsApp.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alert subject or message text..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto justify-end">
          {['all', 'in-app', 'sms', 'email', 'voice', 'whatsapp'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                channelFilter === ch
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {ch === 'all' ? 'All Channels' : ch.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Bell className="w-8 h-8 mx-auto opacity-30 text-sky-500" />
            <p className="text-xs">No matching notifications in this log stream.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            return (
              <div
                key={item.id}
                onClick={() => clearNotification(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.read
                    ? 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500'
                    : isCritical
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-slate-900 dark:text-white border-l-4 border-l-red-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {getChannelBadge(item.channel)}
                    {isCritical && (
                      <span className="bg-red-500/10 text-red-600 font-bold px-1.5 py-0.2 rounded text-[9px] border border-red-300">
                        CRITICAL ESCALATION
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">{formatRelativeTime(item.timestamp)}</span>
                  </div>

                  <h3 className="font-bold text-xs">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <div>Target: {item.role}</div>
                  <div className="text-emerald-500 font-medium">Delivered (Simulated)</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
