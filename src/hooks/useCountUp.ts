import { useEffect, useRef, useState } from "react";

type Options = {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
};

export function useCountUp<T extends HTMLElement = HTMLSpanElement>({
  end,
  duration = 1800,
  start = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
}: Options) {
  const [value, setValue] = useState(start);
  const ref = useRef<T>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            if (prefersReduced) {
              setValue(end);
              return;
            }
            const startTime = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              // easeOutExpo
              const eased =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const current = start + (end - start) * eased;
              setValue(current);
              if (progress < 1) requestAnimationFrame(tick);
              else setValue(end);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, start, duration]);

  const formatted =
    prefix +
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return { ref, value, formatted };
}
