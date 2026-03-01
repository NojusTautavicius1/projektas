import { motion } from "framer-motion";
import { Code2, Palette, Zap, Rocket, Layers, Shield, Gauge, Smartphone, Code, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./Spinner";
import { ScrollReveal } from "./ScrollReveal";

const iconMap: { [key: string]: any } = {
  Code2, Palette, Zap, Rocket, Layers, Shield, Gauge, Smartphone, Code, Sparkles
};

interface FeatureBox {
  id: number;
  label: string;
  icon: string;
  description?: string;
}

export function About() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    title: "About Me",
    content: "I create polished, production-ready digital products with a focus on clarity, reliability, and craft. My background spans design and engineering, which helps me bridge the gap between visual quality and technical excellence.",
    image: null
  });
  
  const [boxes, setBoxes] = useState<FeatureBox[]>([
    { id: 1, label: "Clean Code", icon: "Code2", description: "" },
    { id: 2, label: "Design", icon: "Palette", description: "" },
    { id: 3, label: "Performance", icon: "Zap", description: "" }
  ]);

  useEffect(() => {
    Promise.all([
      fetch("/api/content/section/about_me")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setContent({
              title: data.title || "About Me",
              content: data.content || content.content,
              image: data.image || null
            });
          }
        })
        .catch(err => console.error("Failed to load about content:", err)),
      
      fetch("/api/feature-boxes/section/about_features")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.length > 0) {
            setBoxes(data);
          }
        })
        .catch(err => console.error("Failed to load feature boxes:", err))
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <section id="about" className="py-32 px-6 relative">
      {loading ? (
        <LoadingScreen message="Loading..." />
      ) : (
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl mb-16 text-center font-serif font-semibold text-gray-100">{content.title}</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="relative aspect-square rounded-lg bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 border-2 border-blue-500/40 overflow-hidden flex items-center justify-center shadow-xl shadow-blue-500/20">
                {content.image ? (
                  <img 
                    src={content.image} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-serif font-bold text-slate-200">NT</div>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {content.content}
              </p>

              <div className={`grid gap-4 pt-8 ${boxes.length === 3 ? 'grid-cols-3' : boxes.length === 2 ? 'grid-cols-2' : boxes.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {boxes.map((item, index) => {
                    const IconComponent = iconMap[item.icon] || Code2;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: index * 0.06 }}
                        whileHover={{ y: -3 }}
                        className="text-center p-4 rounded-lg bg-gradient-to-br from-slate-900/80 to-zinc-900/80 border border-slate-800 hover:border-blue-500/40 transition-all shadow-md hover:shadow-blue-500/10"
                        title={item.description || item.label}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-300">{item.label}</p>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      )}
    </section>
  );
}
