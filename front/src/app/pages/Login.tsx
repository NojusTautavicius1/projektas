import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = isLogin ? "Login" : "Register";
  }, [isLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isLogin 
        ? "/api/auth/login" 
        : "/api/auth/register";
      
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            nickname: formData.nickname,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors[0].msg || data.message || "An error occurred");
        } else {
          setError(data.message || "An error occurred");
        }
        return;
      }

      if (isLogin) {
        // Success - store token and redirect
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => window.location.href = "/", 1500);
        }
      } else {
        setSuccess("Registration successful! You can now login.");
        setFormData({ email: "", password: "", passwordConfirm: "", nickname: "" });
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-gradient-to-br from-slate-900/70 to-zinc-900/70 border border-slate-800 p-8 rounded-lg shadow-xl shadow-slate-900/50">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg shadow-slate-900/50 mb-4">
              <div className="text-2xl md:text-3xl font-serif font-bold text-slate-200">
                NT
              </div>
            </div>
            <h1 className="font-serif text-3xl text-slate-200 mb-1">
              {isLogin ? "Login" : "Register"}
            </h1>
            <p className="text-sm text-slate-400">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 rounded-md transition font-medium ${
                isLogin
                  ? "bg-gradient-to-br from-slate-700 to-zinc-700 text-slate-100 shadow-md"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 rounded-md transition font-medium ${
                !isLogin
                  ? "bg-gradient-to-br from-slate-700 to-zinc-700 text-slate-100 shadow-md"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-sm shadow-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded text-green-300 text-sm shadow-sm"
            >
              {success}
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-600 transition shadow-sm"
                placeholder="your@email.com"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-600 transition shadow-sm"
                  placeholder="your.nickname"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-600 transition shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-600 transition shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-900 border-2 border-blue-500 text-slate-200 rounded-md shadow-md hover:bg-slate-800 hover:border-blue-400 transition disabled:opacity-50 font-medium"
            >
              {loading ? "..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-slate-900/70 to-zinc-900/70 text-slate-400">
                    Or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-md hover:bg-slate-700/60 hover:border-slate-600 transition flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                <Github className="w-4 h-4" />
                Sign in with Google
              </button>
            </>
          )}

          <a
            href="/"
            className="text-sm text-slate-400 hover:text-slate-200 mt-4 block text-center transition"
          >
            Return home
          </a>
        </div>
      </motion.div>
    </section>
  );
}
