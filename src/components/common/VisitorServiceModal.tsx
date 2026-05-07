"use client";

import { useEffect, useMemo, useState } from "react";

const WA_NUMBER = "22967357728";
const SHOW_DELAY_MS = 2 * 60 * 1000;
const MAX_DAILY_SHOWS = 2;
const STORAGE_KEY = "tkp_service_modal_daily";
const SESSION_KEY = "tkp_service_modal_session_shows";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function VisitorServiceModal() {
  const [open, setOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    const text =
      "Bonjour, je suis interesse(e) par vos services (photographie, videographie, developpement web et autres). Pouvez-vous me donner plus d'informations ?";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }, []);

  useEffect(() => {
    const today = getTodayKey();
    let intervalId: number | null = null;

    const readDailyData = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { day: today, count: 0 };
        const parsed = JSON.parse(raw) as { day?: string; count?: number };
        if (parsed.day !== today) return { day: today, count: 0 };
        return { day: today, count: Number(parsed.count || 0) };
      } catch {
        return { day: today, count: 0 };
      }
    };

    const getSessionCount = () => {
      try {
        return Number(sessionStorage.getItem(SESSION_KEY) || "0");
      } catch {
        return 0;
      }
    };

    const incrementCounters = () => {
      const current = readDailyData();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ day: today, count: current.count + 1 })
      );
      sessionStorage.setItem(SESSION_KEY, String(getSessionCount() + 1));
    };

    const tryOpenModal = () => {
      const daily = readDailyData();
      const sessionCount = getSessionCount();
      if (daily.count >= MAX_DAILY_SHOWS || sessionCount >= MAX_DAILY_SHOWS) return;
      incrementCounters();
      setOpen(true);
    };

    const timer = window.setTimeout(() => {
      tryOpenModal();
      intervalId = window.setInterval(() => {
        if (!document.hidden) tryOpenModal();
      }, SHOW_DELAY_MS);
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "14px",
          padding: "22px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer la fenetre"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#111",
            cursor: "pointer",
            fontSize: "1rem",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          ×
        </button>
        <h3 style={{ marginBottom: "10px", fontWeight: 700, fontSize: "1.2rem", color: "#111" }}>
          Besoin d'un professionnel pour votre projet ?
        </h3>
        <p style={{ marginBottom: "16px", color: "#555", lineHeight: 1.5, fontSize: "0.95rem" }}>
          Nous vous accompagnons avec des services de photographie, videographie,
          developpement web et bien plus. Cliquez ci-dessous pour nous contacter
          directement sur WhatsApp.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#25D366",
            color: "#fff",
            textDecoration: "none",
            padding: "11px 18px",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.92rem",
          }}
        >
          <i className="fi fi-brands-whatsapp"></i>
          Contacter sur WhatsApp
        </a>
      </div>
    </div>
  );
}

export default VisitorServiceModal;
