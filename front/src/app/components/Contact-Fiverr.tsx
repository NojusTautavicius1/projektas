// Fiverr-optimized Contact Component
import { useState, useEffect } from "react";
import { CheckCircle, Mail, MapPin, Clock, Star, Phone } from "lucide-react";

// Pakeisk savo tikruoju telefono numeriu (WhatsApp formatu: +370XXXXXXXX)
const WHATSAPP_NUMBER = "+37060116008";
import { ScrollReveal } from "./ScrollReveal";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "" // honeypot
  });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Prefill user data if logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email) {
          setFormData(prev => ({
            ...prev,
            name: user.username || "",
            email: user.email
          }));
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) {
      setStatus({ type: "error", message: "Aptiktas neleistinas užklausos turinys" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Žinutė išsiųsta! Atsakysiu per 2 valandas. Netrukus patikrinkite el. paštą."
        });
        setFormData({ name: "", email: "", message: "", website: "" });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setStatus({ type: null, message: "" });
        }, 5000);
      } else {
        const errorData = await res.json();
        setStatus({
          type: "error",
          message: errorData.message || "Nepavyko išsiųsti žinutės. Bandykite dar kartą."
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Ryšio klaida. Patikrinkite interneto ryšį."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal animation="rotate-in">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <span className="text-blue-400 font-semibold">Dirbkime kartu</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Gaukite nemokamą pasiūlymą</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Atsakau per <span className="text-blue-400 font-semibold">2 valandas</span> • Nemokama konsultacija • Jokių įsipareigojimų
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Quick Contact Options */}
          <ScrollReveal delay={0.2} animation="fade-left">
            <div>
            {/* Quick Contact Methods */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">El. paštas</h4>
                  <a href="mailto:nojustautavicius007@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    nojustautavicius007@gmail.com
                  </a>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-green-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-green-400 transition-colors">WhatsApp</h4>
                  <span className="text-gray-400 text-sm">Greičiausias būdas susisiekti</span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vieta</h4>
                  <span className="text-gray-400 text-sm">Kretinga, Lietuva · Dirbu visoje Lietuvoje</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">2h</div>
                <div className="text-sm text-gray-400">Vidutinis atsakymo laikas</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">5.0</div>
                <div className="text-sm text-gray-400">Klientų įvertinimas</div>
              </div>
            </div>
            </div>
          </ScrollReveal>

          {/* Right Column - Contact Form */}
          <ScrollReveal delay={0.3} animation="fade-right">
            <div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">Parašykite man</h3>
              <p className="text-gray-400 mb-6">
                Trumpai aprašykite projektą ir grįšiu su individualiu pasiūlymu.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Jūsų vardas *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Jonas Jonaitis"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Jūsų el. paštas *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Projekto detalės *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Papasakokite apie projektą: ką reikia sukurti, koks terminas, kokie svarbiausi reikalavimai?"
                  />
                </div>

                {/* Status Messages */}
                {status.type && (
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      status.type === "success"
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {status.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm">{status.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  {isSubmitting ? "Siunčiama..." : "Siųsti žinutę ir gauti pasiūlymą"}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Pateikdami formą sutinkate gauti su projektu susijusius laiškus. Jokio šlamšto.
                </p>
              </form>
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Footer */}
        <ScrollReveal delay={0.4}>
          <div className="mt-32 pt-12 border-t border-gray-800 text-center">
            <p className="text-gray-600">
              © 2026 Nojus Tautavičius. Visos teisės saugomos.
            </p>
            <div className="mt-4 text-gray-700 text-sm">
              Sukurta su meile ir daug „Red Bull"
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
