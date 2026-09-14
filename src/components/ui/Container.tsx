import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  className,
  children,
  size = "default",
  ...props
}: ContainerProps) {
  const maxW =
    size === "narrow"
      ? "max-w-3xl"
      : size === "wide"
      ? "max-w-[88rem]"
      : "max-w-[80rem]";
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-8 xl:px-10",
        maxW,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function Section({
  className,
  children,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-12 md:py-16 lg:py-20",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]",
            align === "center" && "mx-auto"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--color-text)] text-balance max-w-3xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed text-pretty",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
