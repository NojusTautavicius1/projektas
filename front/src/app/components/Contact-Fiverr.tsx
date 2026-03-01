// Fiverr-optimized Contact Component
import { useState, useEffect } from "react";
import { CheckCircle, Mail, MapPin, Clock, Star } from "lucide-react";

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
      setStatus({ type: "error", message: "Spam detected" });
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
          message: "Message sent! I'll respond within 2 hours. Check your email shortly."
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
          message: errorData.message || "Failed to send message. Please try again."
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection."
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
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
            <span className="text-blue-400 font-semibold">Let's Work Together</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Your Free Quote</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Response within <span className="text-green-400 font-semibold">2 hours</span> • Free consultation • No commitment required
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Quick Contact Options */}
          <div>
            {/* Fiverr CTA Card */}
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <h3 className="text-2xl font-bold">Hire on Fiverr</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Browse my gigs, check reviews, and order with confidence. Protected payments & guaranteed delivery.
              </p>
              <a
                href="https://www.fiverr.com/s/6YroEYL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/30"
              >
                View Fiverr Profile →
              </a>
            </div>

            {/* Quick Contact Methods */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a href="mailto:nojustautavicius007@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                    nojustautavicius007@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">2h</div>
                <div className="text-sm text-gray-400">Avg Response</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">5.0</div>
                <div className="text-sm text-gray-400">Client Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">Send Me a Message</h3>
              <p className="text-gray-400 mb-6">
                Describe your project and I'll get back to you with a custom quote.
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
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email *
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
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your project: What do you need built? What's your timeline? Any specific requirements?"
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
                  {isSubmitting ? "Sending..." : "Send Message & Get Quote"}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By submitting, you agree to receive project-related emails. No spam ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
