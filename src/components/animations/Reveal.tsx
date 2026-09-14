import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  direction = "up",
  once = true,
}: RevealProps) {
  const initialY = direction === "up" ? y : direction === "down" ? -y : 0;
  const initialX = direction === "left" ? y : direction === "right" ? -y : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: "0.5em" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}
