import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Stagger reveal for items with [data-reveal]
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const y = parseFloat(el.dataset.revealY || "20");
        gsap.fromTo(
          el,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Line reveal for headings with [data-split]
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const words = el.innerText.split(" ");
        el.innerHTML = words
          .map((w) => `<span class="reveal-line"><span>${w}&nbsp;</span></span>`)
          .join(" ");
        const inner = el.querySelectorAll(".reveal-line > span");
        gsap.fromTo(
          inner,
          { y: "110%" },
          {
            y: "0%",
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return root;
}

export { gsap, ScrollTrigger };
