import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

const tones: Record<Tone, string> = {
  neutral:
    "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  primary:
    "bg-[var(--color-primary-soft)] text-[#93c5fd] border-[rgba(59,130,246,0.25)]",
  success:
    "bg-[var(--color-success-soft)] text-[#6ee7b7] border-[rgba(16,185,129,0.25)]",
  warning:
    "bg-[var(--color-warning-soft)] text-[#fcd34d] border-[rgba(245,158,11,0.25)]",
  danger:
    "bg-[var(--color-danger-soft)] text-[#fca5a5] border-[rgba(239,68,68,0.25)]",
  info: "bg-[var(--color-info-soft)] text-[#67e8f9] border-[rgba(6,182,212,0.25)]",
  accent:
    "bg-[var(--color-accent-soft)] text-[#c4b5fd] border-[rgba(139,92,246,0.25)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
  size?: "sm" | "md";
  children?: ReactNode;
}

export function Badge({
  className,
  tone = "neutral",
  dot = false,
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        tones[tone],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "neutral" && "bg-[var(--color-text-subtle)]",
            tone === "primary" && "bg-[#60a5fa]",
            tone === "success" && "bg-[#34d399]",
            tone === "warning" && "bg-[#fbbf24]",
            tone === "danger" && "bg-[#f87171]",
            tone === "info" && "bg-[#22d3ee]",
            tone === "accent" && "bg-[#a78bfa]"
          )}
        />
      )}
      {children}
    </span>
  );
}

/* Status chip variant — used for operational and mining statuses */
export function StatusChip({
  status,
  tone,
  label,
  size = "sm",
  className,
}: {
  status?: Tone;
  tone?: Tone;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const finalTone = tone || status || "neutral";
  return (
    <Badge tone={finalTone} dot size={size} className={className}>
      {label}
    </Badge>
  );
}
