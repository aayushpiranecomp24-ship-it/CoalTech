import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition shadow-xs flex items-center justify-center relative focus:outline-hidden focus:ring-2 focus:ring-sky-500 ${className}`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-sky-400 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
