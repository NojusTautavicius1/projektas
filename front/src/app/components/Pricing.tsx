import { motion } from "framer-motion";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { navigateToSectionPath, SECTION_LINKS } from "../utils/sectionNavigation";
import type { MouseEvent } from "react";

const packages = [
  {
    name: "Starter",
    price: "nuo 150€",
    description: "Vizitinės kortelės svetainė mažam verslui",
    icon: Zap,
    features: [
      "Iki 5 puslapių",
      "Mobilus dizainas",
      "Kontaktų forma",
      "Google Maps integracija",
      "SSL sertifikatas",
      "1 mėn. palaikymas",
    ],
    highlight: false,
  },
  {
    name: "Business",
    price: "nuo 400€",
    description: "Pilnas online buvimas verslui",
    icon: Building2,
    features: [
      "Iki 10 puslapių",
      "SEO optimizacija",
      "Google Business Profile",
      "Greičio optimizacija",
      "Socialinių tinklų integracija",
      "3 mėn. palaikymas",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "nuo 800€",
    description: "E-komercija arba sudėtingesni projektai",
    icon: Rocket,
    features: [
      "Neriboti puslapiai",
      "Online parduotuvė",
      "Individualus dizainas",
      "Pažangus SEO",
      "Analytics integracija",
      "6 mėn. palaikymas",
    ],
    highlight: false,
  },
];

export function Pricing() {
  const handleNav = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSectionPath(SECTION_LINKS.contact);
  };

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/35 bg-blue-500/10 text-blue-300 text-sm tracking-wide uppercase mb-5">
              Kainos
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-100">
              Paprasti ir skaidrūs paketai
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Kiekvienas projektas unikalus — šios kainos orientacinės. Nemokamos konsultacijos metu aptarsime tikslų biudžetą.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <ScrollReveal key={pkg.name} delay={index * 0.12} animation="fade-up">
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`relative h-full rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                    pkg.highlight
                      ? "border-blue-500/60 bg-gradient-to-br from-blue-500/10 via-slate-900/90 to-zinc-900/90 shadow-lg shadow-blue-500/15"
                      : "border-slate-800 bg-gradient-to-br from-slate-900/70 to-zinc-900/70 hover:border-slate-700"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full tracking-wide whitespace-nowrap">
                        POPULIARIAUSIAS
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        pkg.highlight
                          ? "bg-blue-500/20 border border-blue-500/40"
                          : "bg-slate-800 border border-slate-700"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          pkg.highlight ? "text-blue-300" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-gray-100 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-400">{pkg.description}</p>
                  </div>

                  <div className="mb-8">
                    <span className="text-3xl font-bold text-gray-100">{pkg.price}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            pkg.highlight ? "text-blue-400" : "text-slate-500"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={SECTION_LINKS.contact}
                    onClick={handleNav}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`block w-full py-3 rounded-lg text-center text-sm font-semibold transition-all ${
                      pkg.highlight
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600"
                    }`}
                  >
                    Gauti pasiūlymą →
                  </motion.a>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.4}>
          <p className="mt-10 text-center text-sm text-gray-500">
            Visos kainos be PVM. Galutinė kaina priklauso nuo projekto sudėtingumo.{" "}
            <a
              href={SECTION_LINKS.contact}
              onClick={(e) => {
                e.preventDefault();
                navigateToSectionPath(SECTION_LINKS.contact);
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Susisiekite dėl tikslaus pasiūlymo →
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
