import { motion } from "framer-motion";

export function FloatingElements() {
  const elements = [
    { size: 400, left: "10%", top: "20%", delay: 0 },
    { size: 300, left: "80%", top: "60%", delay: 2 },
    { size: 200, left: "60%", top: "10%", delay: 4 },
    { size: 350, left: "20%", top: "70%", delay: 1 },
    { size: 250, left: "85%", top: "30%", delay: 3 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-br from-gray-700/10 to-gray-900/10 blur-3xl"
          style={{
            width: element.size,
            height: element.size,
            left: element.left,
            top: element.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
