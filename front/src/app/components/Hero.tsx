import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./Spinner";

export function Hero() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    name: "Nojus Tautavicius",
    subtitle: "Creative Developer",
    description: "Building digital experiences that merge creativity with thoughtful engineering",
    initials: "NT"
  });

  useEffect(() => {
    fetch("/api/content/section/hero_main")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setContent({
            name: data.title || content.name,
            subtitle: data.data?.subtitle || content.subtitle,
            description: data.content || content.description,
            initials: data.data?.initials || content.initials
          });
        }
      })
      .catch(err => console.error("Failed to load hero content:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative">
      {loading ? (
        <LoadingScreen message="Loading..." />
      ) : (
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200 
            }}
            className="mb-8"
          >
            <div className="w-28 h-28 mx-auto rounded-lg bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 border-2 border-blue-500/50 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full flex items-center justify-center text-4xl font-serif font-bold text-slate-200">
                {content.initials}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 mb-2 tracking-widest uppercase text-xs"
          >
            {content.subtitle}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-5xl md:text-7xl mb-6 tracking-tight font-serif font-semibold text-gray-100"
          >
            {content.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-6 justify-center items-center mb-16"
          >
            {[
              { icon: Github, href: "https://github.com/NojusTautavicius1", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/nojus-tautavi%C4%8Dius-8242683b4", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Email" }
            ].map((social, index) => {
              const isExternal = social.href?.startsWith("http");
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center hover:bg-slate-800 hover:border-blue-400 transition-all shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400" />
                </motion.a>
              );
            })}
          </motion.div>

          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="inline-block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
            >
              <ArrowDown className="w-8 h-8" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
      )}
    </section>
  );
}