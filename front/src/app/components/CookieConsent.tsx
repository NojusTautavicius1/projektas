import { useEffect, useMemo, useState } from "react";
import "./CookieConsent.css";

type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  status: "accepted" | "rejected" | "custom";
  updatedAt: string;
};

const STORAGE_KEY = "cookie_consent_v1";
const TRACKING_KEY = "tracking_enabled";

function applyTrackingFlag(enabled: boolean) {
  localStorage.setItem(TRACKING_KEY, String(enabled));
  (window as Window & { __trackingEnabled?: boolean }).__trackingEnabled = enabled;
}

function saveConsent(consent: ConsentPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  applyTrackingFlag(consent.analytics || consent.marketing);
}

export function CookieConsent() {
  const [isHidden, setIsHidden] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setIsHidden(false);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ConsentPreferences;
      applyTrackingFlag(Boolean(parsed.analytics || parsed.marketing));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setIsHidden(false);
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSettingsOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isSettingsOpen]);

  const closeWithAnimation = () => {
    setIsVisible(false);
    window.setTimeout(() => setIsHidden(true), 240);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      status: "accepted",
      updatedAt: new Date().toISOString(),
    });
    closeWithAnimation();
  };

  const rejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
    closeWithAnimation();
  };

  const saveCustom = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      status: "custom",
      updatedAt: new Date().toISOString(),
    });
    setIsSettingsOpen(false);
    closeWithAnimation();
  };

  const bannerClassName = useMemo(
    () =>
      `cc-banner ${isVisible ? "cc-banner--visible" : "cc-banner--hidden"} ${
        isHidden ? "cc-banner--gone" : ""
      }`,
    [isVisible, isHidden]
  );

  if (isHidden) return null;

  return (
    <>
      <div className={bannerClassName} role="region" aria-label="Slapuku sutikimas">
        <div className="cc-content">
          <p className="cc-title">Si svetaine naudoja slapukus</p>
          <p className="cc-text">
            Naudojame butinuosius, analitinius ir rinkodaros slapukus, kad pagerintume svetaines veikima ir
            jusu patirti.
          </p>
        </div>

        <div className="cc-actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={rejectNonEssential}>
            Atmesti nebutinuosius
          </button>
          <button type="button" className="cc-btn cc-btn--soft" onClick={() => setIsSettingsOpen(true)}>
            Nustatymai
          </button>
          <button type="button" className="cc-btn cc-btn--primary" onClick={acceptAll}>
            Priimti visus
          </button>
        </div>
      </div>

      <div
        className={`cc-modal-backdrop ${isSettingsOpen ? "cc-modal-backdrop--visible" : ""}`}
        onClick={() => setIsSettingsOpen(false)}
        aria-hidden={!isSettingsOpen}
      >
        <div
          className={`cc-modal ${isSettingsOpen ? "cc-modal--visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Slapuku nustatymai"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="cc-modal-title">Slapuku nustatymai</h3>
          <p className="cc-modal-text">Pasirinkite, kokius nebutinuosius slapukus leidziate.</p>

          <div className="cc-option">
            <div>
              <p className="cc-option-title">Butini slapukai</p>
              <p className="cc-option-desc">Reikalingi, kad svetaine veiktu tinkamai.</p>
            </div>
            <label className="cc-switch">
              <input type="checkbox" checked disabled />
              <span />
            </label>
          </div>

          <div className="cc-option">
            <div>
              <p className="cc-option-title">Analitiniai slapukai</p>
              <p className="cc-option-desc">Padeda suprasti, kaip naudojama svetaine.</p>
            </div>
            <label className="cc-switch">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              <span />
            </label>
          </div>

          <div className="cc-option">
            <div>
              <p className="cc-option-title">Rinkodaros slapukai</p>
              <p className="cc-option-desc">Naudojami suasmenintam turiniui ir reklamoms.</p>
            </div>
            <label className="cc-switch">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span />
            </label>
          </div>

          <div className="cc-modal-actions">
            <button type="button" className="cc-btn cc-btn--ghost" onClick={() => setIsSettingsOpen(false)}>
              Atsaukti
            </button>
            <button type="button" className="cc-btn cc-btn--primary" onClick={saveCustom}>
              Issaugoti pasirinkima
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CookieConsent;
