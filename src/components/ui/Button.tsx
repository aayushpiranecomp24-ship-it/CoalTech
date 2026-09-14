import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/animations/Magnetic";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "glass";

type Size = "sm" | "md" | "lg" | "xl" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-[0_8px_24px_-8px_var(--color-primary-glow)] hover:shadow-[0_12px_32px_-8px_var(--color-primary-glow)]",
  secondary:
    "bg-[var(--color-surface-3)] text-[var(--color-text)] hover:bg-[var(--color-border-strong)] border border-[var(--color-border)]",
  outline:
    "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-text-subtle)]",
  ghost:
    "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:brightness-110 active:brightness-95 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.4)]",
  glass:
    "glass text-[var(--color-text)] hover:border-[var(--color-border-strong)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-[15px] rounded-xl gap-2",
  xl: "h-14 px-8 text-base rounded-xl gap-2.5",
  icon: "h-10 w-10 rounded-lg p-0 items-center justify-center",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      magnetic = false,
      ...props
    },
    ref
  ) => {
    const btn = (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer will-change-transform select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );

    if (magnetic) {
      return <Magnetic>{btn}</Magnetic>;
    }

    return btn;
  }
);
Button.displayName = "Button";
