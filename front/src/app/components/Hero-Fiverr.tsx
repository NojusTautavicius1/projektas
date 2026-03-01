// Fiverr-optimized Hero Component
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./Spinner";

export function Hero() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    name: "Nojus Tautavicius",
    subtitle: "Full-Stack Developer",
    description: "React, Node.js & Modern Web Solutions | Fast Delivery | Production-Ready Code",
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
          {/* Profile Image/Avatar */}
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
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 border-4 border-blue-500/50 overflow-hidden flex items-center justify-center shadow-2xl shadow-blue-500/30 relative">
              {/* Online badge */}
              <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" title="Available now" />
              <div className="w-full h-full flex items-center justify-center text-5xl font-serif font-bold text-slate-200">
                {content.initials}
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-3 justify-center mb-4"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-slate-300 font-medium">Top Rated</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300 font-medium">24h Response</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-blue-400 mb-3 tracking-widest uppercase text-sm font-semibold"
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
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap gap-4 justify-center items-center mb-12"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all"
            >
              View My Work
            </motion.a>
            <motion.a
              href="https://www.fiverr.com/s/6YroEYL"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
            >
              <Star className="w-5 h-5 fill-white" />
              Hire on Fiverr
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-slate-700 hover:border-slate-600 text-slate-200 font-semibold rounded-lg transition-all"
            >
              Get Free Quote
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-6 justify-center items-center mb-16"
          >
            {[
              { icon: Github, href: "https://github.com/NojusTautavicius1", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/nojus-tautavičius-8242683b4", label: "LinkedIn" },
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

          {/* Scroll Indicator */}
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
