"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";

function HeroStreaming() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        padding: "60px 0 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-12">
            <Fade direction="left" triggerOnce duration={600}>
              <div style={{ color: "#fff" }} className="hero-streaming-mobile">
                <span
                  style={{
                    display: "inline-block",
                    background: "#e50914",
                    color: "#fff",
                    padding: "6px 18px",
                    borderRadius: "30px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "20px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Streaming & Boutique
                </span>
                <h1
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: "20px",
                  }}
                >
                  Vos abonnements{" "}
                  <span style={{ color: "#e50914" }}>streaming</span>
                  <br />
                  au meilleur prix
                </h1>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "30px",
                    maxWidth: "500px",
                    lineHeight: 1.6,
                  }}
                >
                  Netflix, Prime Video, Spotify, GogoFlix... Souscrivez facilement
                  a vos abonnements preferes. Paiement securise et acces immediat.
                </p>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }} className="hero-streaming-btns">
                  <Link
                    href="/abonnements"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#e50914",
                      color: "#fff",
                      padding: "14px 32px",
                      borderRadius: "50px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(229,9,20,0.4)",
                    }}
                  >
                    <i className="fi-rr-play"></i>
                    Voir les Abonnements
                  </Link>
                  <Link
                    href="/shop-left-sidebar-col-3"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "14px 32px",
                      borderRadius: "50px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="fi-rr-shopping-bag"></i>
                    Boutique en ligne
                  </Link>
                </div>
              </div>
            </Fade>
          </div>
          <div className="col-lg-5 col-md-12 mt-4 mt-lg-0">
            <Fade direction="right" triggerOnce duration={600} delay={200}>
              <div style={{ 
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <img
                  src="/assets/img/hero-bg/heroimage1.jpg"
                  alt="TOCONNECT - Streaming & Boutique"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "20px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroStreaming;
