import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

interface KpiCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: number; // percentage change
  trendLabel?: string;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "accent";
  className?: string;
  decimals?: number;
}

const toneMap: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-[#3b82f6]/10", text: "text-[#60a5fa]", border: "border-[#3b82f6]/20" },
  success: { bg: "bg-[#10b981]/10", text: "text-[#34d399]", border: "border-[#10b981]/20" },
  warning: { bg: "bg-[#f59e0b]/10", text: "text-[#fbbf24]", border: "border-[#f59e0b]/20" },
  danger: { bg: "bg-[#ef4444]/10", text: "text-[#f87171]", border: "border-[#ef4444]/20" },
  info: { bg: "bg-[#06b6d4]/10", text: "text-[#22d3ee]", border: "border-[#06b6d4]/20" },
  accent: { bg: "bg-[#8b5cf6]/10", text: "text-[#a78bfa]", border: "border-[#8b5cf6]/20" },
  neutral: { bg: "bg-[var(--color-surface-2)]", text: "text-[var(--color-text-muted)]", border: "border-[var(--color-border)]" },
};

function NumericCounter({ num, prefix, suffix, decimals }: { num: number; prefix: string; suffix: string; decimals: number }) {
  const { ref, formatted } = useCountUp({
    end: num,
    prefix,
    suffix,
    decimals,
    duration: 1600,
  });
  return <span ref={ref}>{formatted}</span>;
}

export function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendLabel,
  icon,
  tone = "neutral",
  className,
  decimals = 0,
}: KpiCardProps) {
  const t = toneMap[tone] || toneMap.neutral;
  const isTrendUp = trend !== undefined && trend >= 0;
  const isNumeric = typeof value === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-[var(--color-border-strong)] hover:shadow-elevated shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
          {label}
        </span>
        {icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", t.bg, t.text)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--color-text)] font-mono">
        {isNumeric ? (
          <NumericCounter num={value as number} prefix={prefix} suffix={suffix} decimals={decimals} />
        ) : (
          `${prefix}${value}${suffix}`
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {isTrendUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-[#34d399]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-[#f87171]" />
          )}
          <span className={cn("text-xs font-semibold", isTrendUp ? "text-[#34d399]" : "text-[#f87171]")}>
            {isTrendUp ? "+" : ""}{trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-[var(--color-text-subtle)]">{trendLabel}</span>
          )}
        </div>
      )}

      {/* Hover glow */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500",
          tone !== "neutral" ? t.bg : "",
          "group-hover:opacity-35"
        )}
      />
    </motion.div>
  );
}
