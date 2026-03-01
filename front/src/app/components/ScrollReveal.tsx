import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.6,
  yOffset = 40,
  className = ""
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "-100px" 
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{ 
        duration, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
