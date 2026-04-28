const SECTION_ID_BY_PATH: Record<string, string> = {
  "/": "home",
  "/pradzia": "home",
  "/apie-mane": "about",
  "/paslaugos": "services",
  "/kainos": "pricing",
  "/atsiliepimai": "testimonials",
  "/projektai": "projects",
  "/kontaktai": "contact",
};

const normalizePath = (pathname: string): string => {
  if (!pathname) return "/";
  const cleaned = pathname.trim().replace(/\/+$/, "");
  return cleaned || "/";
};

export const getSectionIdFromPath = (pathname: string): string | null => {
  const normalized = normalizePath(pathname);
  return SECTION_ID_BY_PATH[normalized] || null;
};

export const scrollToPathSection = (
  pathname: string,
  behavior: ScrollBehavior = "smooth"
): boolean => {
  const sectionId = getSectionIdFromPath(pathname);
  if (!sectionId) return false;

  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  const element = document.getElementById(sectionId);
  if (!element) return false;

  element.scrollIntoView({ behavior, block: "start" });
  return true;
};

export const navigateToSectionPath = (pathname: string): void => {
  const normalized = normalizePath(pathname);

  if (window.location.pathname !== normalized) {
    window.history.pushState({}, "", normalized);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  scrollToPathSection(normalized, "smooth");
};

export const SECTION_LINKS = {
  home: "/",
  about: "/apie-mane",
  services: "/paslaugos",
  pricing: "/kainos",
  testimonials: "/atsiliepimai",
  projects: "/projektai",
  contact: "/kontaktai",
} as const;
