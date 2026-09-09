// MINEGOV AI - StatCard Component
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral' | 'alert';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  riskLevel,
  onClick,
}) => {
  const getBorderColor = () => {
    if (riskLevel === 'CRITICAL') return 'border-l-4 border-l-red-500 border-slate-200 dark:border-slate-800';
    if (riskLevel === 'HIGH') return 'border-l-4 border-l-orange-500 border-slate-200 dark:border-slate-800';
    if (riskLevel === 'MEDIUM') return 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800';
    if (riskLevel === 'LOW') return 'border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-800';
    return 'border-slate-200 dark:border-slate-800';
  };

  const getIconBg = () => {
    if (riskLevel === 'CRITICAL') return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (riskLevel === 'HIGH') return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
    if (riskLevel === 'MEDIUM') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    if (riskLevel === 'LOW') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    return 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${getBorderColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">{value}</div>
        </div>
        <div className={`p-2.5 rounded-xl ${getIconBg()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold text-[11px] ${
                trendType === 'alert'
                  ? 'text-red-600 dark:text-red-400'
                  : trendType === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
