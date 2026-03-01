import { Hero } from "./components/Hero-Fiverr";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact-Fiverr";
import { StickyFiverrButton } from "./components/StickyFiverrButton";
import { FloatingElements } from "./components/FloatingElements";
import { ParticleBackground } from "./components/ParticleBackground";
import { Navigation } from "./components/Navigation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffect, useState } from "react";
import Login from "./pages/Login";

export default function App() {
  const [path, setPath] = useState<string>(typeof window !== 'undefined' ? window.location.pathname : "/");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isLogin = path === "/login" || path === "/login/";

  if (isLogin) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950 text-white overflow-x-hidden relative">
        <ParticleBackground />
        <FloatingElements />
        
        <div className="relative z-10">
          <Navigation />
          <ErrorBoundary><Hero /></ErrorBoundary>
          <ErrorBoundary><About /></ErrorBoundary>
          <ErrorBoundary><Testimonials /></ErrorBoundary>
          <ErrorBoundary><Services /></ErrorBoundary>
          <ErrorBoundary><Projects /></ErrorBoundary>
          <ErrorBoundary><Contact /></ErrorBoundary>
        </div>
        
        <StickyFiverrButton />
      </div>
    </ErrorBoundary>
  );
}