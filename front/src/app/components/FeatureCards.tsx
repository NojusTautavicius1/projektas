import { motion } from "framer-motion";
import { Code2, Layers, Palette, Rocket, Shield, Gauge, Sparkles, Code, Smartphone, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Icon mapping
const iconMap: { [key: string]: any } = {
  Code2,
  Layers,
  Palette,
  Rocket,
  Shield,
  Gauge,
  Sparkles,
  Code,
  Smartphone,
  Zap
};

interface Feature {
  id: number;
  label: string;
  icon: string;
  description: string;
}

const defaultFeatures = [
  {
    id: 1,
    icon: "Code2",
    label: "Modern Tech",
    description: "Built with cutting-edge technology and best practices"
  },
  {
    id: 2,
    icon: "Layers",
    label: "Layered Design",
    description: "Beautiful depth and hierarchy in every element"
  },
  {
    id: 3,
    icon: "Palette",
    label: "Dark Theme",
    description: "Carefully crafted monochrome aesthetic"
  },
  {
    id: 4,
    icon: "Rocket",
    label: "Performance",
    description: "Optimized for lightning-fast load times"
  },
  {
    id: 5,
    icon: "Shield",
    label: "Secure",
    description: "Enterprise-grade security built-in"
  },
  {
    id: 6,
    icon: "Gauge",
    label: "Scalable",
    description: "Grows with your needs seamlessly"
  }
];

export function FeatureCards() {
  const [sectionContent, setSectionContent] = useState({
    title: "Features",
    content: "Carefully selected capabilities for professional products"
  });
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);

  useEffect(() => {
    // Load section content
    fetch("/api/content/section/feature_cards")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSectionContent({
            title: data.title || "Features",
            content: data.content || sectionContent.content
          });
        }
      })
      .catch(err => console.error("Failed to load feature cards content:", err));
    
    // Load feature boxes
    fetch("/api/feature-boxes/section/feature_cards")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          setFeatures(data);
        }
      })
      .catch(err => console.error("Failed to load feature boxes:", err));
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl mb-3 font-serif font-semibold text-gray-100">{sectionContent.title}</h2>
          <p className="text-gray-300 text-lg">{sectionContent.content}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Code2;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div className="relative h-full">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  />
                  
                      <div className="relative h-full bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
                        <div className="mb-5 inline-block">
                          <div className="bg-gray-800 p-3 rounded-lg inline-flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-gray-300" />
                          </div>
                        </div>

                        <h3 className="text-lg mb-2 font-serif font-medium text-gray-100">
                          {feature.label}
                        </h3>
                        <p className="text-gray-300">{feature.description}</p>

                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
                          className="h-px bg-gray-800 mt-5"
                        />
                      </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
