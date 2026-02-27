import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "" // Honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          name: user.nickname || user.email.split('@')[0] || "",
          email: user.email || ""
        }));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        message: ""
      }));
      
      setTimeout(() => {
        setSuccess(false);
      }, 4500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-4 font-serif font-semibold text-slate-200">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? I help turn ideas into polished, production-ready products.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-slate-700 via-zinc-700 to-slate-700 mx-auto mt-5 rounded-full shadow-sm"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl mb-4 font-serif font-medium text-slate-200">
                Let's Connect
              </h3>
              <p className="text-slate-400 leading-relaxed mb-8">
                I'm available for freelance and full-time opportunities. Reach out with a short brief and I’ll respond quickly.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "nojustautavicius007@gmail.com" },
                { icon: MapPin, label: "Location", value: "Lithuania" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-zinc-900 border border-slate-700 flex items-center justify-center group-hover:border-blue-500/60 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all">
                    <item.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">{item.label}</div>
                    <div className="text-slate-300">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-zinc-900 rounded-2xl opacity-25 blur-2xl" />
                  <div className="relative p-8 bg-gradient-to-br from-slate-900/50 to-zinc-900/50 border border-blue-500/30 rounded-lg shadow-lg shadow-blue-500/10">
                    <p className="text-slate-400 italic">
                      "Design is not just what it looks like and feels like. Design is how it works."
                    </p>
                    <p className="text-slate-600 mt-2">— Steve Jobs</p>
                  </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >            {/* Success Notification */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-start gap-3 shadow-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 font-medium">Message sent successfully!</p>
                  <p className="text-green-400/80 text-sm mt-1">We'll get back to you soon.</p>
                </div>
              </motion.div>
            )}

            {/* Error Notification */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg shadow-lg"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                  Name {isLoggedIn && <span className="text-slate-500 text-xs">(from account)</span>}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={isLoggedIn}
                  className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm ${isLoggedIn ? 'cursor-not-allowed opacity-70' : ''}`}
                  placeholder="Your name"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                  Email {isLoggedIn && <span className="text-slate-500 text-xs">(from account)</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={isLoggedIn}
                  className={`w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm ${isLoggedIn ? 'cursor-not-allowed opacity-70' : ''}`}
                  placeholder="your.email@example.com"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </motion.div>

              {/* Honeypot field - hidden from users, bots will fill it */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full px-6 py-3 bg-slate-900 border-2 border-blue-500 text-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 hover:border-blue-400 transition-all group shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                {!loading && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 pt-12 border-t border-gray-800 text-center"
        >
          <p className="text-gray-600">
            © 2025 Nojus Tautavicius. All rights reserved.
          </p>
          <motion.div
            className="mt-4 text-gray-700 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Made with ❤️ and lots of Redbulls
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
