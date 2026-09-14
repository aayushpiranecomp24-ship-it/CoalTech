import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number; // duration in ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  // If the value is a string containing non-numeric chars (e.g. "₹6.0 Cr" or "8 Active"), handle gracefully
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const isPlainNumber = !isNaN(numericValue) && (typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value).trim()));

  const [displayValue, setDisplayValue] = useState<number>(() => (isPlainNumber ? 0 : 0));

  useEffect(() => {
    if (!isPlainNumber) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(numericValue);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = 0;
    const targetValue = numericValue;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo function
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (targetValue - startValue) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [numericValue, duration, isPlainNumber]);

  if (!isPlainNumber) {
    return <span className={className}>{value}</span>;
  }

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
