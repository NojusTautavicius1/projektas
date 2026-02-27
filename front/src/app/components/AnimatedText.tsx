import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = ["Elegant", "Modern", "Powerful", "Sleek"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="overflow-hidden h-32 flex items-center justify-center">
            <motion.div
              key={currentIndex}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-6xl md:text-7xl"
            >
              <span className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 bg-clip-text text-transparent inline-block">
                {words[currentIndex]}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <p className="text-gray-500 text-xl">
              Experience design that speaks volumes
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mt-12">
            {words.map((_, index) => (
              <motion.div
                key={index}
                className="h-1 rounded-full bg-gray-800"
                style={{ width: 60 }}
                animate={{
                  backgroundColor: index === currentIndex ? "#ffffff" : "#1f2937"
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {[
            { value: "99%", label: "Uptime" },
            { value: "2M+", label: "Users" },
            { value: "150+", label: "Countries" },
            { value: "24/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800/50 backdrop-blur-sm"
            >
              <div className="text-4xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
