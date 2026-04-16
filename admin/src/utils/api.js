const rawBase = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultRemoteBase = "https://www.ntdev.lt";
const forceCrossOrigin = import.meta.env.VITE_FORCE_CROSS_ORIGIN === "true";

const computedBase = (() => {
  const isBrowser = typeof window !== "undefined";
  const isLocalhost =
    isBrowser &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  // In local dev prefer same-origin (/api) and let Vite proxy forward requests.
  // This avoids browser CORS errors against deployed APIs.
  if (isLocalhost && !forceCrossOrigin) {
    return "";
  }

  if (rawBase) {
    return rawBase.replace(/\/$/, "");
  }

  if (isBrowser) {
    const { protocol, hostname, port } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // Local admin commonly connects to deployed API.
      // Override with VITE_API_BASE_URL when needed.
      return defaultRemoteBase;
    }

    // Same-origin is the safest default in production when admin and API share host.
    if (!port) {
      return "";
    }
  }

  return "";
})();

const absoluteUrlPattern = /^https?:\/\//i;

export function buildApiUrl(path = "") {
  if (!path) {
    return computedBase || "/";
  }

  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return computedBase ? `${computedBase}${normalizedPath}` : normalizedPath;
}

export function buildAssetUrl(path = "") {
  if (!path) return "";
  if (absoluteUrlPattern.test(path) || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return computedBase ? `${computedBase}${normalizedPath}` : normalizedPath;
}

export function apiFetch(path, options) {
  return fetch(buildApiUrl(path), options);
}

export function patchWindowFetchForApi() {
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return;
  }

  if (window.__apiFetchPatched) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === "string") {
      if (input.startsWith("/api/")) {
        return originalFetch(buildApiUrl(input), init);
      }
      return originalFetch(input, init);
    }

    if (input instanceof Request) {
      const inputUrl = input.url;
      const isSameOrigin = typeof window !== "undefined" && inputUrl.startsWith(window.location.origin);
      const relativePath = isSameOrigin ? inputUrl.replace(window.location.origin, "") : inputUrl;

      if (relativePath.startsWith("/api/")) {
        const rewritten = new Request(buildApiUrl(relativePath), input);
        return originalFetch(rewritten, init);
      }
    }

    return originalFetch(input, init);
  };

  window.__apiFetchPatched = true;
}
