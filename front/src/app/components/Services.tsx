// Fiverr Service Packages Component
import { motion } from "framer-motion";
import { Check, Star, Clock, Zap, Crown, Package, Rocket, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface ServicePackage {
  id: number;
  name: string;
  icon: string;
  price: string;
  delivery_time: string;
  description: string;
  features: string[];
  revisions: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  color: string;
  border_color: string;
  bg_color: string;
  icon_color: string;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Zap,
  Star,
  Crown,
  Package,
  Rocket,
  Shield,
};

// Default packages as fallback
const defaultPackages: ServicePackage[] = [
  {
    id: 1,
    name: "Bazinis",
    icon: "Zap",
    price: "$299",
    delivery_time: "3-5 d.",
    description: "Puikiai tinka nukreipimo puslapiams ir paprastoms svetainėms",
    features: [
      "Vieno puslapio svetainė arba nukreipimo puslapis",
      "Prisitaikantis dizainas (mobilus + kompiuteris)",
      "Kontaktų formos integracija",
      "Bazinis SEO optimizavimas",
      "1 pataisymas įskaičiuotas",
      "Pridėtas išeities kodas"
    ],
    revisions: "1 pataisymas",
    is_popular: false,
    is_active: true,
    sort_order: 1,
    color: "from-blue-500 to-cyan-500",
    border_color: "border-blue-500/30",
    bg_color: "bg-blue-500/10",
    icon_color: "text-blue-400"
  },
  {
    id: 2,
    name: "Standartinis",
    icon: "Star",
    price: "$799",
    delivery_time: "7-10 d.",
    description: "Pilnai funkcionalios svetainės su individualiomis galimybėmis",
    features: [
      "Iki 5 puslapių arba sekcijų",
      "Individualus dizainas ir animacijos",
      "Duomenų bazės integracija (jei reikia)",
      "Administratoriaus panelė turinio valdymui",
      "API integracija",
      "Pažangus SEO ir našumo optimizavimas",
      "3 pataisymai įskaičiuoti",
      "30 dienų palaikymas"
    ],
    revisions: "3 pataisymai",
    is_popular: true,
    is_active: true,
    sort_order: 2,
    color: "from-purple-600 to-pink-600",
    border_color: "border-purple-500/30",
    bg_color: "bg-purple-500/10",
    icon_color: "text-purple-400"
  },
  {
    id: 3,
    name: "Premium",
    icon: "Crown",
    price: "$1,999",
    delivery_time: "14-21 d.",
    description: "Pilnos žiniatinklio aplikacijos su full-stack funkcijomis",
    features: [
      "Neribotas puslapių ir sekcijų skaičius",
      "Full-stack žiniatinklio aplikacija",
      "Vartotojų autentifikacija ir autorizacija",
      "Mokėjimų sistemos integracija",
      "Realaus laiko funkcijos (pokalbiai, pranešimai)",
      "Trečiųjų šalių API integracijos",
      "Pažangi administravimo panelė",
      "Duomenų bazės projektavimas ir optimizavimas",
      "Neribotas pataisymų skaičius",
      "90 dienų palaikymas ir priežiūra"
    ],
    revisions: "Neriboti pataisymai",
    is_popular: false,
    is_active: true,
    sort_order: 3,
    color: "from-blue-700 to-blue-900",
    border_color: "border-blue-700/30",
    bg_color: "bg-blue-700/10",
    icon_color: "text-blue-500"
  }
];

export function Services() {
  const [packages, setPackages] = useState<ServicePackage[]>(defaultPackages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services/active");
        if (response.ok) {
          const data = await response.json();
          // Only use API data if it has valid services with prices
          if (data && data.length > 0 && data[0].price && data[0].price !== "0") {
            setPackages(data);
          }
          // Otherwise keep defaultPackages
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          Kraunamos paslaugos...
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal animation="zoom-in">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <span className="text-blue-400 font-semibold">Paslaugų paketai</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Pasirinkite savo paketą</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Skaidri kainodara, greitas pristatymas ir produkcijai paruoštas kodas. Į visus paketus įeina modernus technologijų rinkinys (React, Node.js, TypeScript).
            </p>
          </div>
        </ScrollReveal>

        {/* Packages Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {packages.map((pkg, index) => {
            const IconComponent = iconMap[pkg.icon] || Zap;
            
            return (
              <motion.div
                key={pkg.id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.21, 0.47, 0.32, 0.98]
                    }
                  }
                }}
                className={`relative bg-slate-900/50 border ${
                  pkg.is_popular ? "border-purple-500/50 shadow-lg shadow-purple-500/20" : pkg.border_color
                } rounded-2xl p-8 hover:shadow-2xl transition-all ${
                  pkg.is_popular ? "md:-mt-4 md:scale-105" : ""
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
                    Populiariausias
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl ${pkg.bg_color} flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-8 h-8 ${pkg.icon_color}`} />
                </div>

                {/* Package Name */}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                
                {/* Price */}
                <div className="mb-4">
                  <span className={`text-4xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                    {pkg.price}
                  </span>
                  <span className="text-gray-400 ml-2">nuo</span>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">Pristatymas per {pkg.delivery_time}</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6 min-h-[48px]">{pkg.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full py-3 bg-gradient-to-r ${pkg.color} text-white font-semibold rounded-lg text-center transition-all ${
                    pkg.is_popular ? "shadow-lg shadow-purple-500/50" : ""
                  }`}
                >
                  Pradėti
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <ScrollReveal delay={0.3}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-gray-400">Pinigų grąžinimo garantija</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Galimas bendravimas</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Fast</div>
              <div className="text-gray-400">Galimas skubus pristatymas</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Custom Project CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Reikia individualaus sprendimo?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Turite unikalų projektą? Aptarkime jūsų poreikius, ir paruošiu individualų pasiūlymą.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30"
            >
              Gauti individualų pasiūlymą
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
