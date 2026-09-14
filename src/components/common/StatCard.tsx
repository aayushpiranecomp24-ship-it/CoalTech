import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral' | 'alert';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  onClick?: () => void;
  className?: string;
}

function NumericValue({ num }: { num: number }) {
  const isFloat = num % 1 !== 0;
  const { ref, formatted } = useCountUp({
    end: num,
    decimals: isFloat ? 1 : 0,
    duration: 1500,
  });
  return <span ref={ref}>{formatted}</span>;
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
  className,
}) => {
  const getSemanticTone = () => {
    if (riskLevel === 'CRITICAL' || trendType === 'alert') {
      return {
        bg: 'bg-[#ef4444]/10',
        text: 'text-[#f87171]',
        border: 'border-[#ef4444]/25',
        glow: 'bg-[#ef4444]',
      };
    }
    if (riskLevel === 'HIGH') {
      return {
        bg: 'bg-[#f59e0b]/10',
        text: 'text-[#fbbf24]',
        border: 'border-[#f59e0b]/25',
        glow: 'bg-[#f59e0b]',
      };
    }
    if (riskLevel === 'MEDIUM') {
      return {
        bg: 'bg-[#f59e0b]/10',
        text: 'text-[#fbbf24]',
        border: 'border-[#f59e0b]/20',
        glow: 'bg-[#f59e0b]',
      };
    }
    if (riskLevel === 'LOW' || trendType === 'up') {
      return {
        bg: 'bg-[#10b981]/10',
        text: 'text-[#34d399]',
        border: 'border-[#10b981]/25',
        glow: 'bg-[#10b981]',
      };
    }
    return {
      bg: 'bg-[#3b82f6]/10',
      text: 'text-[#60a5fa]',
      border: 'border-[#3b82f6]/20',
      glow: 'bg-[#3b82f6]',
    };
  };

  const tone = getSemanticTone();
  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      whileHover={onClick ? { y: -2 } : { y: -1 }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5',
        'shadow-card transition-all duration-200 hover:border-[var(--color-border-strong)] hover:shadow-elevated',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)] line-clamp-1">
          {title}
        </span>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors', tone.bg, tone.text)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)] font-mono">
        {isNumeric ? <NumericValue num={value as number} /> : value}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2.5 text-xs">
          {subtitle && (
            <span className="text-[var(--color-text-muted)] text-[11px] truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <div className="flex items-center gap-1 shrink-0 ml-auto">
              {trendType === 'up' && <TrendingUp className="w-3 h-3 text-[#34d399]" />}
              {trendType === 'down' && <TrendingDown className="w-3 h-3 text-[#f87171]" />}
              {trendType === 'alert' && <AlertCircle className="w-3 h-3 text-[#f87171]" />}
              <span
                className={cn(
                  'text-[11px] font-semibold',
                  trendType === 'up'
                    ? 'text-[#34d399]'
                    : trendType === 'alert' || trendType === 'down'
                    ? 'text-[#f87171]'
                    : 'text-[var(--color-text-subtle)]'
                )}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Corner Hover Glow */}
      <div
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500',
          tone.glow,
          'group-hover:opacity-20'
        )}
      />
    </motion.div>
  );
};
