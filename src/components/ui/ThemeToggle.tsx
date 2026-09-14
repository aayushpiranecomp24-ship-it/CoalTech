import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)] cursor-pointer",
        className
      )}
    >
      <Sun className="h-4 w-4 transition-transform duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 transition-transform duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
