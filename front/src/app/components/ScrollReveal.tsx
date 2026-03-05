import { motion } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

type AnimationType = 
  | "fade-up" 
  | "fade-down"
  | "fade-left" 
  | "fade-right"
  | "scale" 
  | "scale-up"
  | "rotate-in"
  | "flip-up"
  | "bounce-in"
  | "slide-up"
  | "zoom-in";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animation?: AnimationType;
  className?: string;
  once?: boolean;
  threshold?: number;
}

type AnimationVariants = {
  hidden: any;
  visible: any;
};

const animationVariants: Record<AnimationType, AnimationVariants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  "fade-down": {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  "fade-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  "fade-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  "scale": {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  },
  "rotate-in": {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 }
  },
  "flip-up": {
    hidden: { opacity: 0, rotateX: -90, transformPerspective: 1000 },
    visible: { opacity: 1, rotateX: 0, transformPerspective: 1000 }
  },
  "bounce-in": {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  },
  "slide-up": {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0, transformOrigin: "center" },
    visible: { 
      opacity: 1, 
      scale: 1,
      transformOrigin: "center"
    }
  }
};

// Custom hook for intersection observer
function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit & { once?: boolean } = {}
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.once !== false) {
          observer.unobserve(element);
        }
      } else if (options.once === false) {
        setIsInView(false);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || "-50px"
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options.threshold, options.rootMargin, options.once]);

  return isInView;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.7,
  animation = "fade-up",
  className = "",
  once = true,
  threshold = 0.1
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { 
    threshold,
    rootMargin: "-50px",
    once
  });

  const variant = animationVariants[animation];
  const isBounce = animation === "bounce-in";

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variant}
      transition={isBounce ? undefined : { 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
