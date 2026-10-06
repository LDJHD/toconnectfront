"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";

const PLATFORMES = ["Netflix", "Prime Video", "Spotify", "GogoFlix", "Disney+", "CapCut"];

function HeroStreaming() {
  return (
    <section
      style={{
        background:
          "linear-gradient(160deg, #07070c 0%, #0d0f1c 45%, #151a33 100%)",
        padding: "72px 0 84px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Halos décoratifs */}
      <div
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229,9,20,0.16) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-140px",
          left: "-120px",
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Trame subtile */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row align-items-center g-4">
          <div className="col-lg-7 col-md-12">
            <Fade direction="left" triggerOnce duration={600}>
              <div style={{ color: "#fff" }} className="hero-streaming-mobile">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(229,9,20,0.14)",
                    border: "1px solid rgba(229,9,20,0.35)",
                    color: "#ff8a92",
                    padding: "7px 18px",
                    borderRadius: "30px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    marginBottom: "22px",
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                  }}
                >
                  <i className="fi-rr-badge-check" style={{ fontSize: "0.95rem" }}></i>
                  Plateforme N°1 au Bénin
                </span>

                <h1
                  style={{
                    fontSize: "clamp(2.1rem, 5vw, 3.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.16,
                    marginBottom: "20px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Vos abonnements{" "}
                  <span
                    style={{
                      color: "#e50914",
                      background: "linear-gradient(90deg, #ff3b47, #e50914)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    streaming
                  </span>{" "}
                  et votre boutique, au même endroit.
                </h1>

                <p
                  style={{
                    fontSize: "1.08rem",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "30px",
                    maxWidth: "520px",
                    lineHeight: 1.7,
                  }}
                >
                  Netflix, Prime Video, Spotify, GogoFlix… Souscrivez en quelques
                  clics, payez en toute sécurité et profitez d’un accès immédiat.
                  Deux activités, une seule plateforme.
                </p>

                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }} className="hero-streaming-btns">
                  <Link href="/abonnements" className="tkn-btn tkn-btn-primary">
                    <i className="fi-rr-play"></i>
                    Voir les Abonnements
                  </Link>
                  <Link href="/boutique" className="tkn-btn tkn-btn-glass">
                    <i className="fi-rr-shopping-bag"></i>
                    Boutique en ligne
                  </Link>
                </div>

                {/* Statistiques */}
                <div className="hero-stats">
                  <div className="hero-stat">
                    <strong>
                      500<i>+</i>
                    </strong>
                    <span>Clients actifs</span>
                  </div>
                  <div className="hero-stat">
                    <strong>
                      4.9<i>★</i>
                    </strong>
                    <span>Satisfaction</span>
                  </div>
                  <div className="hero-stat">
                    <strong>
                      24<i>/7</i>
                    </strong>
                    <span>Support dédié</span>
                  </div>
                  <div className="hero-stat">
                    <strong>
                      10<i>min</i>
                    </strong>
                    <span>Activation express</span>
                  </div>
                </div>

                {/* Plateformes */}
                <div className="hero-platforms">
                  {PLATFORMES.map((p) => (
                    <span key={p} className="hero-platform">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </Fade>
          </div>

          <div className="col-lg-5 col-md-12 mt-4 mt-lg-0">
            <Fade direction="right" triggerOnce duration={600} delay={200}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/img/hero-bg/heroimage1.jpg"
                  alt="Tkp Store - Streaming & Boutique"
                  style={{
                    width: "100%",
                    maxWidth: "520px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "24px",
                    boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                {/* Chips flottantes */}
                <div className="hero-chip" style={{ top: "16px", left: "0%" }}>
                  <i className="fi-rr-shield-check"></i>
                  Paiement sécurisé
                </div>
                <div className="hero-chip" style={{ bottom: "16px", right: "0%" }}>
                  <i className="fi-rr-badge-check"></i>
                  Abonnement activé
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroStreaming;