import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Animated gradient orbs that follow scroll
export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orb 1 - Blue */}
      <motion.div
        className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        animate={{
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated gradient orb 2 - Purple */}
      <motion.div
        className="absolute top-1/2 -right-48 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        animate={{
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Animated gradient orb 3 - Cyan */}
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, 120, 0],
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 100, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated mesh gradient lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i + 1) * 12.5}%`}
            y1="0"
            x2={`${(i + 1) * 12.5}%`}
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              strokeWidth: [0.5, 2, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 16.66}%`}
            x2="100%"
            y2={`${(i + 1) * 16.66}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              strokeWidth: [0.5, 2, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}
