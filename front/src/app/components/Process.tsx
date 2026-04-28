import { motion } from "framer-motion";
import { MessageSquare, Paintbrush, Code2, Rocket } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Konsultacija",
    description:
      "Nemokamas pokalbis — aptariame projekto tikslus, terminus ir biudžetą. Galite skambinti, rašyti ar pildyti formą.",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "Dizainas",
    description:
      "Sukuriu svetainės maketą pagal jūsų verslo stilių. Koreguojame kartu tol, kol esate patenkinti.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Kūrimas",
    description:
      "Programuoju svetainę — greita, mobili, optimizuota Google paieškai. Reguliariai informuoju apie progresą.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Paleidimas",
    description:
      "Paleidžiame svetainę, nustatome domeną ir hostingą. Po paleidimo esu pasiekiamas klausimams.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/35 bg-blue-500/10 text-blue-300 text-sm tracking-wide uppercase mb-5">
              Kaip dirbu
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-100">
              Nuo idėjos iki veikiančios svetainės
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Paprastas ir skaidrus procesas — visada žinote kas vyksta ir kada bus padaryta.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.number} delay={index * 0.1} animation="fade-up">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-zinc-900/70 hover:border-blue-500/30 transition-all duration-300 h-full"
                >
                  <div className="text-5xl font-serif font-bold text-slate-800 mb-4 leading-none select-none">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-gray-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-8 text-slate-700 text-lg z-10">
                      →
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
