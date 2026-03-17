// utils/pageAnimation.ts
import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransition = {
  duration: 0.25,
  ease: "easeOut" as const,
};

// 각 아이템용 (stagger 효과)
export const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};
