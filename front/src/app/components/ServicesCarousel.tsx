import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Code2,
  Palette,
  Search,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

type Direction = -1 | 0 | 1;
type CardSlot = "prev" | "current" | "next";

interface ServiceSlide {
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}

const SLIDES: ServiceSlide[] = [
  {
    title: "Web Development",
    description:
      "Kuriu greitas, konversijai optimizuotas svetaines ir web aplikacijas su švaria architektūra bei patikimu kodu.",
    icon: Code2,
    badge: "Frontend + Backend",
  },
  {
    title: "SEO Optimizacija",
    description:
      "Tvarkau techninį SEO, turinio struktūrą ir greičio rodiklius, kad tavo puslapis kiltų paieškoje ir pritrauktų daugiau užklausų.",
    icon: Search,
    badge: "Technical SEO",
  },
  {
    title: "UI/UX Dizainas",
    description:
      "Kuriu aiškų, modernų ir patogų naudotojo kelią nuo pirmo scroll iki veiksmo, kad dizainas dirbtų verslo rezultatui.",
    icon: Palette,
    badge: "Product Design",
  },
  {
    title: "Responsive Sprendimai",
    description:
      "Užtikrinu, kad kiekvienas puslapis atrodytų ir veiktų sklandžiai telefone, planšetėje ir kompiuterio ekrane.",
    icon: Smartphone,
    badge: "Mobile First",
  },
  {
    title: "Performance & CRO",
    description:
      "Optimizuoju užkrovimo laiką, Core Web Vitals ir puslapio struktūrą, kad vartotojai greičiau rastų ir atliktų norimą veiksmą.",
    icon: BarChart3,
    badge: "Speed + Conversion",
  },
];

const ANIMATION_MS = 520;
const SWIPE_THRESHOLD = 50;

const wrapIndex = (index: number, total: number): number => {
  return (index + total) % total;
};

const getCardState = (
  slot: CardSlot,
  isAnimating: boolean,
  direction: Direction
): { translate: string; scale: number; opacity: number; zIndex: number } => {
  if (!isAnimating || direction === 0) {
    if (slot === "prev") {
      return {
        translate: "calc(-1 * var(--side-offset))",
        scale: 0.92,
        opacity: 0.5,
        zIndex: 10,
      };
    }

    if (slot === "next") {
      return {
        translate: "var(--side-offset)",
        scale: 0.92,
        opacity: 0.5,
        zIndex: 10,
      };
    }

    return { translate: "0%", scale: 1, opacity: 1, zIndex: 20 };
  }

  if (direction === 1) {
    if (slot === "prev") {
      return {
        translate: "calc(-1 * var(--offscreen-offset))",
        scale: 0.86,
        opacity: 0.16,
        zIndex: 5,
      };
    }

    if (slot === "current") {
      return {
        translate: "calc(-1 * var(--side-offset))",
        scale: 0.93,
        opacity: 0.62,
        zIndex: 12,
      };
    }

    return { translate: "0%", scale: 1, opacity: 1, zIndex: 20 };
  }

  if (slot === "next") {
    return {
      translate: "var(--offscreen-offset)",
      scale: 0.86,
      opacity: 0.16,
      zIndex: 5,
    };
  }

  if (slot === "current") {
    return {
      translate: "var(--side-offset)",
      scale: 0.93,
      opacity: 0.62,
      zIndex: 12,
    };
  }

  return { translate: "0%", scale: 1, opacity: 1, zIndex: 20 };
};

export function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const startSlide = useCallback(
    (step: Direction) => {
      if (step === 0 || isAnimating) {
        return;
      }

      setDirection(step);
      setIsAnimating(true);

      timeoutRef.current = window.setTimeout(() => {
        setActiveIndex((prev) => wrapIndex(prev + step, SLIDES.length));
        setDirection(0);
        setIsAnimating(false);
      }, ANIMATION_MS);
    },
    [isAnimating]
  );

  const goPrev = useCallback(() => startSlide(-1), [startSlide]);
  const goNext = useCallback(() => startSlide(1), [startSlide]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, isVisible]);

  const prevIndex = wrapIndex(activeIndex - 1, SLIDES.length);
  const nextIndex = wrapIndex(activeIndex + 1, SLIDES.length);

  const cards = useMemo(
    () => [
      { slot: "prev" as CardSlot, index: prevIndex },
      { slot: "current" as CardSlot, index: activeIndex },
      { slot: "next" as CardSlot, index: nextIndex },
    ],
    [activeIndex, nextIndex, prevIndex]
  );

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    setTouchStartX(null);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-28 px-6 relative"
      aria-label="Paslaugos ir kompetencijos"
    >
      <div
        className={`max-w-6xl mx-auto transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/35 bg-blue-500/10 text-blue-300 text-sm tracking-wide uppercase">
            Ką aš darau
          </div>
          <h2 className="text-4xl md:text-5xl mt-5 font-serif font-semibold text-gray-100">
            Paslaugos, kurios duoda rezultatą
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Viena kortelė centre ir gyvas kaimyninių kortelių preview, kad greitai peržiūrėtum visas mano kompetencijas.
          </p>
        </div>

        <div
          className="relative [--side-offset:72%] md:[--side-offset:58%] [--offscreen-offset:95%] md:[--offscreen-offset:88%]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[320px] md:h-[340px] overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/35 backdrop-blur-sm">
            {cards.map(({ slot, index }) => {
              const slide = SLIDES[index];
              const Icon = slide.icon;
              const state = getCardState(slot, isAnimating, direction);

              return (
                <article
                  key={`${slot}-${slide.title}-${index}`}
                  className="absolute left-1/2 top-1/2 w-[88%] md:w-[74%] max-w-[760px] h-[85%] md:h-[82%] group"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${state.translate}) scale(${state.scale})`,
                    opacity: state.opacity,
                    zIndex: state.zIndex,
                    transition:
                      "transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 520ms ease-in-out",
                  }}
                  aria-hidden={slot !== "current"}
                >
                  <div className="h-full rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-zinc-900/95 p-6 md:p-8 shadow-[0_24px_60px_rgba(2,6,23,0.48)] transition-transform duration-300 ease-in-out group-hover:scale-[1.03]">
                    <div className="flex items-start justify-between gap-4">
                      <span className="px-3 py-1 rounded-full border border-slate-600 text-xs md:text-sm text-slate-300 bg-slate-800/70">
                        {slide.badge}
                      </span>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/10 border border-blue-500/35 flex items-center justify-center">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-blue-300" />
                      </div>
                    </div>

                    <h3 className="mt-8 text-2xl md:text-3xl font-semibold text-gray-100 leading-tight">
                      {slide.title}
                    </h3>

                    <p className="mt-4 text-gray-300 md:text-lg leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goPrev}
            disabled={isAnimating}
            aria-label="Rodyti ankstesnę paslaugą"
            className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-slate-700 bg-slate-950/80 text-slate-200 hover:border-blue-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={isAnimating}
            aria-label="Rodyti kitą paslaugą"
            className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-slate-700 bg-slate-950/80 text-slate-200 hover:border-blue-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2" role="tablist" aria-label="Paslaugų skaidrės">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.title}
                type="button"
                onClick={() => {
                  if (index === activeIndex || isAnimating) {
                    return;
                  }

                  const goForward =
                    (index - activeIndex + SLIDES.length) % SLIDES.length <= SLIDES.length / 2;

                  startSlide(goForward ? 1 : -1);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-8 bg-blue-400" : "w-2.5 bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Rodyti skaidrę: ${slide.title}`}
                aria-selected={isActive}
                role="tab"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
