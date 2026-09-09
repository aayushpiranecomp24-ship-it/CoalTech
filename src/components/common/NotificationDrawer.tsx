// MINEGOV AI - Notification Center Drawer Component
import React, { useState } from 'react';
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

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, clearNotification, markAllNotificationsRead } = useGovernance();
  const [channelFilter, setChannelFilter] = useState<'all' | 'in-app' | 'sms' | 'email' | 'voice' | 'whatsapp'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (channelFilter === 'all') return true;
    return n.channel === channelFilter;
  });

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case 'sms':
        return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-400" />;
      case 'voice':
        return <PhoneCall className="w-3.5 h-3.5 text-amber-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'in-app':
      default:
        return <Bell className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Statutory Notification Center</h3>
              <p className="text-[10px] text-slate-400">Multi-channel alert dispatch log</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 text-xs flex items-center space-x-1"
              title="Mark all read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Channel Filter Tabs */}
        <div className="p-2 border-b border-slate-800/80 bg-slate-900/50 flex space-x-1 overflow-x-auto text-[11px]">
          {(['all', 'in-app', 'sms', 'email', 'voice', 'whatsapp'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium whitespace-nowrap transition ${
                channelFilter === ch ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-850'
              }`}
            >
              {ch === 'all' ? 'All Channels' : ch.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No notifications found in this channel.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isCritical = item.severity === 'CRITICAL';
              return (
                <div
                  key={item.id}
                  onClick={() => clearNotification(item.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer relative ${
                    item.read
                      ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                      : isCritical
                      ? 'bg-red-950/40 border-red-800/80 text-white'
                      : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 rounded bg-slate-800">{getChannelIcon(item.channel)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.channel || 'IN-APP'}
                      </span>
                      {isCritical && (
                        <span className="bg-red-500/20 border border-red-500/40 text-red-400 font-bold px-1.5 py-0.2 rounded text-[9px] flex items-center">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" /> CRITICAL
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{formatRelativeTime(item.timestamp)}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-100 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item.message}</p>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Target: {item.role}</span>
                    <span className="text-emerald-400 font-medium">Status: {item.deliveryStatus || 'Delivered'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-[10px] text-slate-400 text-center">
          Prototype delivery simulator. Can be connected to Twilio, SendGrid, or Gupshup SMS/WhatsApp APIs.
        </div>
      </div>
    </div>
  );
};
