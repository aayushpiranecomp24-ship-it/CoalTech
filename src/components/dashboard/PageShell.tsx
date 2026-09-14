import { type ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/* ============================================================
   PAGE HEADER
   ============================================================ */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[var(--color-text-faint)]">/</span>}
                <span className={i === breadcrumbs.length - 1 ? "text-[var(--color-text)] font-medium" : ""}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)] md:text-3xl tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/* ============================================================
   STATS ROW (compact metric row)
   ============================================================ */
interface Stat {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "accent";
  icon?: ReactNode;
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  const toneMap: Record<string, { text: string; bg: string }> = {
    primary: { text: "text-[#60a5fa]", bg: "bg-[#3b82f6]/10" },
    success: { text: "text-[#34d399]", bg: "bg-[#10b981]/10" },
    warning: { text: "text-[#fbbf24]", bg: "bg-[#f59e0b]/10" },
    danger: { text: "text-[#f87171]", bg: "bg-[#ef4444]/10" },
    info: { text: "text-[#22d3ee]", bg: "bg-[#06b6d4]/10" },
    accent: { text: "text-[#a78bfa]", bg: "bg-[#8b5cf6]/10" },
    neutral: { text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-2)]" },
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
      {stats.map((s, i) => {
        const t = toneMap[s.tone || "neutral"];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-card"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                {s.label}
              </span>
              {s.icon && (
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", t.bg, t.text)}>
                  {s.icon}
                </div>
              )}
            </div>
            <div className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--color-text)] font-mono">
              {s.value}
            </div>
            {s.hint && (
              <div className="mt-1 text-[11px] text-[var(--color-text-subtle)]">{s.hint}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   FILTER BAR & SEARCH INPUT
   ============================================================ */
interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
  showClear?: boolean;
}

export function FilterBar({ children, onClear, showClear = false }: FilterBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-card">
      <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-[200px]">
        {children}
      </div>
      {showClear && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-[var(--color-text-subtle)]">
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center min-w-[220px]", className)}>
      <Search className="absolute left-3 h-4 w-4 text-[var(--color-text-subtle)] pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 pl-9 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 p-0.5 text-[var(--color-text-subtle)] hover:text-[var(--color-text)] cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   DETAIL DRAWER (slide-out side panel)
   ============================================================ */
interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function DetailDrawer({ open, onClose, title, subtitle, children, footer }: DetailDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
            {footer && (
              <div className="border-t border-[var(--color-border)] p-5 bg-[var(--color-surface)]">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   MODAL DIALOG (animated popup modal)
   ============================================================ */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function FormModal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const maxWMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 shadow-elevated my-8",
              maxWMap[maxWidth]
            )}
          >
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4 mb-5">
              <div>
                <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
