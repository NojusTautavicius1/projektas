import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" }
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-slate-950/50" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto pl-20 pr-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            whileHover={{ scale: 1.02 }}
            className="text-lg font-semibold tracking-wider text-gray-100"
          >
            <span className="font-serif">NT</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-slate-900 border-2 border-blue-500 text-slate-200 rounded-md text-sm hover:bg-slate-800 hover:border-blue-400 transition-all shadow-md"
            >
              Let's Talk
            </motion.a>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-gray-700 rounded-md">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{user.nickname || user.email}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-md text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.a
                href="/login"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gray-100 text-black rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Log In
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
