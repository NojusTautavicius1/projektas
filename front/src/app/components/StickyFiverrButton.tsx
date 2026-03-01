// Sticky Fiverr CTA Button Component
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";

export function StickyFiverrButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show button after scrolling 500px
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 500 && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.a
            href="https://www.fiverr.com/s/6YroEYL"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all group relative"
          >
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-800 transition-all"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>

            {/* Pulsing Star */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-5 h-5 fill-white" />
            </motion.div>

            <div className="flex flex-col items-start">
              <span className="text-sm font-normal opacity-90">Available Now</span>
              <span className="font-bold">Hire on Fiverr</span>
            </div>

            {/* Arrow Icon */}
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Floating Badge */}
            <div className="absolute -top-2 -left-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-slate-900">5.0</span>
              </div>
            </div>
          </motion.a>

          {/* Mobile Version (smaller) */}
          <motion.a
            href="https://www.fiverr.com/s/6YroEYL"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-2xl shadow-green-500/50"
          >
            <Star className="w-4 h-4 fill-white" />
            <span className="text-sm">Hire on Fiverr</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
