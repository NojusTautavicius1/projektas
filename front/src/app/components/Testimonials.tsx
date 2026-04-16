import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface Review {
  id: number;
  name: string;
  role?: string;
  company?: string;
  rating: number;
  text: string;
  project_type?: string;
  created_at?: string;
}

const REVIEWS_CACHE_KEY = "reviews_cache_v1";

const normalizeReview = (item: any, index: number): Review => {
  const rating = Number(item?.rating);
  const safeRating = Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5;
  const safeName = String(item?.name || "Klientas").trim() || "Klientas";

  return {
    id: Number(item?.id) || index + 1,
    name: safeName,
    role: item?.role ? String(item.role) : undefined,
    company: item?.company ? String(item.company) : undefined,
    rating: safeRating,
    text: String(item?.text || "").trim(),
    project_type: item?.project_type ? String(item.project_type) : undefined,
    created_at: item?.created_at ? String(item.created_at) : undefined,
  };
};

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    rating: 5,
    project_type: "",
    text: ""
  });

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const isLoggedIn = Boolean(token);

  const readReviewsCache = (): Review[] => {
    try {
      const raw = localStorage.getItem(REVIEWS_CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item, index) => normalizeReview(item, index)).filter((item) => item.text);
    } catch {
      return [];
    }
  };

  const writeReviewsCache = (list: Review[]) => {
    try {
      localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage write errors.
    }
  };

  useEffect(() => {
    const cached = readReviewsCache();
    if (cached.length > 0) {
      setReviews(cached);
      setLoading(false);
    }

    fetch("/api/reviews", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
            throw new Error("Nepavyko gauti atsiliepimų");
        }
        return res.json();
      })
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((item, index) => normalizeReview(item, index)).filter((item) => item.text)
          : [];
        setReviews(normalized);
        writeReviewsCache(normalized);
        setError("");
      })
      .catch((err) => {
        console.error("Error loading reviews:", err);
        if (cached.length === 0) {
          setError("Nepavyko įkelti atsiliepimų.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        name: user?.username || user?.email || ""
      }));
    } catch {
      // Ignore invalid local user payload.
    }
  }, [storedUser]);

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return "0.0";
    }
    const total = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleInput = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Norint palikti atsiliepimą, reikia prisijungti.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
          throw new Error(result?.message || "Nepavyko išsaugoti atsiliepimo");
      }

        setSuccess("Ačiū! Jūsų atsiliepimas sėkmingai išsaugotas.");
      setFormData((prev) => ({
        ...prev,
        role: "",
        company: "",
        rating: 5,
        project_type: "",
        text: ""
      }));
      setShowForm(false);

      const listResponse = await fetch("/api/reviews", { cache: "no-store" });
      if (listResponse.ok) {
        const listData = await listResponse.json();
        const normalized = Array.isArray(listData)
          ? listData.map((item, index) => normalizeReview(item, index)).filter((item) => item.text)
          : [];
        setReviews(normalized);
        writeReviewsCache(normalized);
      }
    } catch (err) {
      console.error(err);
        setError(err instanceof Error ? err.message : "Įvyko klaida");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <span className="text-blue-400 font-semibold flex items-center gap-2 justify-center">
                <Star className="w-4 h-4 fill-blue-400" />
                 Klientų atsiliepimai
              </span>
            </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Tikri klientų įvertinimai</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Čia rasite realius klientų atsiliepimus apie atliktus darbus.
            </p>

            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setShowForm((prev) => !prev)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                >
                  {showForm ? "Uždaryti formą" : "Palikti atsiliepimą"}
                </button>
              ) : (
                <a
                  href="/login"
                  className="px-6 py-3 border border-blue-500/50 text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                >
                    Prisijunkite, kad paliktumėte atsiliepimą
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} animation="scale">
          <div className="flex flex-wrap gap-8 justify-center mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="text-sm text-gray-500 mt-1">Vidutinis įvertinimas</div>
              <div className="text-xs text-gray-600">(iš visų atsiliepimų)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{reviews.length}</div>
              <div className="text-sm text-gray-500 mt-1">Atsiliepimų kiekis</div>
              <div className="text-xs text-gray-600">(realių klientų)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-gray-500 mt-1">Kokybės prioritetas</div>
              <div className="text-xs text-gray-600">(kokybė pirmoje vietoje)</div>
          </div>
          </div>
        </ScrollReveal>

        {showForm && isLoggedIn && (
          <div className="max-w-3xl mx-auto mb-10 bg-slate-900/60 border border-slate-700 rounded-xl p-6">
            <h3 className="text-2xl font-semibold mb-4">Naujas atsiliepimas</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={formData.name}
                  onChange={(e) => handleInput("name", e.target.value)}
                  placeholder="Jūsų vardas"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
                />
                <input
                  value={formData.company}
                  onChange={(e) => handleInput("company", e.target.value)}
                  placeholder="Įmonė (neprivaloma)"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={formData.role}
                  onChange={(e) => handleInput("role", e.target.value)}
                  placeholder="Pareigos (neprivaloma)"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
                />
                <input
                  value={formData.project_type}
                  onChange={(e) => handleInput("project_type", e.target.value)}
                  placeholder="Projekto tipas"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Įvertinimas</label>
                <select
                  value={formData.rating}
                  onChange={(e) => handleInput("rating", Number(e.target.value))}
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <textarea
                required
                rows={4}
                value={formData.text}
                onChange={(e) => handleInput("text", e.target.value)}
                placeholder="Parašykite savo atsiliepimą..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-all"
              >
                {submitting ? "Siunčiama..." : "Išsaugoti atsiliepimą"}
              </button>
            </form>
          </div>
        )}

        {error && <p className="text-center text-red-400 mb-6">{error}</p>}
        {success && <p className="text-center text-green-400 mb-6">{success}</p>}

        {loading && <p className="text-center text-gray-400 mb-8">Kraunami atsiliepimai...</p>}

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {reviews.map((testimonial, index) => (
            <motion.div
              key={testimonial.id || index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }
                }
              }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all relative"
            >
              <Quote className="w-8 h-8 text-blue-400/30 mb-4" />

              <div className="flex gap-1 mb-4">
                {[...Array(Math.max(1, Math.min(5, Number(testimonial.rating) || 5)))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                  {String(testimonial.name || "Klientas")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("") || "K"}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(" • ") || "Klientas"}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Projekto tipas</div>
                <div className="text-sm text-blue-400 font-medium">{testimonial.project_type || "Nenurodyta"}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal delay={0.4}>
          <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Norite pradėti projektą?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30"
          >
            <Star className="w-5 h-5 fill-white" />
            Susisiekti dėl projekto
          </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
