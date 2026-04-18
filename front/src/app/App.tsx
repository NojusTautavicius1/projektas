import { Hero } from "./components/Hero-Fiverr";
import { About } from "./components/About";
import { ServicesCarousel } from "./components/ServicesCarousel";
import { Testimonials } from "./components/Testimonials";
// import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact-Fiverr";
import { FloatingElements } from "./components/FloatingElements";
import { ParticleBackground } from "./components/ParticleBackground";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Navigation } from "./components/Navigation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollProgress } from "./components/ScrollProgress";
import { CookieConsent } from "./components/CookieConsent";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import { scrollToPathSection } from "./utils/sectionNavigation";

export default function App() {
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    // Set path on client side only
    setPath(window.location.pathname);
    
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    
    // Also listen for hash changes in case of hash routing
    const onHashChange = () => setPath(window.location.pathname);
    window.addEventListener("hashchange", onHashChange);
    
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (!path) return;
    if (path === "/login" || path === "/login/") return;

    // Allow content to mount before trying to scroll to a section.
    const timer = window.setTimeout(() => {
      scrollToPathSection(path, "auto");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [path]);

  // Remove loading screen after component mounts
  useEffect(() => {
    const removeLoadingScreen = () => {
      const hideInitialLoader = (window as Window & { __hideInitialLoader?: () => void }).__hideInitialLoader;
      if (typeof hideInitialLoader === 'function') {
        hideInitialLoader();
        return;
      }

      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transition = "opacity 0.5s ease";
        setTimeout(() => loadingScreen.remove(), 500);
      }
    };

    const onLoad = () => setTimeout(removeLoadingScreen, 300);

    // Wait for document to be ready and give React time to render
    if (document.readyState === "complete") {
      setTimeout(removeLoadingScreen, 300);
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const isLogin = path === "/login" || path === "/login/";

  if (isLogin) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      <ScrollProgress />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950 text-white overflow-x-hidden relative">
        <AnimatedBackground />
        <ParticleBackground />
        <FloatingElements />
        
        <div className="relative z-10">
          <Navigation />
          <ErrorBoundary><Hero /></ErrorBoundary>
          <ErrorBoundary><About /></ErrorBoundary>
          <ErrorBoundary><ServicesCarousel /></ErrorBoundary>
          <ErrorBoundary><Testimonials /></ErrorBoundary>
          {/* Services section is temporarily hidden, kept for future use.
          <ErrorBoundary><Services /></ErrorBoundary>
          */}
          <ErrorBoundary><Projects /></ErrorBoundary>
          <ErrorBoundary><Contact /></ErrorBoundary>
          <CookieConsent />
        </div>
      </div>
    </ErrorBoundary>
  );
}