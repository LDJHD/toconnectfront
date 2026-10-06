"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";

function CtaBanner() {
  return (
    <section style={{ padding: "48px 0 16px", background: "#ffffff" }}>
      <div className="container">
        <div className="row g-4 g-md-4">
          {/* Bannière Abonnements */}
          <div className="col-lg-6 col-md-6 grid-col">
            <Fade direction="left" triggerOnce duration={400} className="h-100">
              <div
                className="tkn-panel"
                style={{
                  background: "linear-gradient(135deg, #e50914 0%, #b20710 60%, #8f0a12 100%)",
                }}
              >
                <div
                  className="tkn-ring"
                  style={{ width: "190px", height: "190px", right: "-50px", top: "-60px" }}
                />
                <div
                  className="tkn-ring"
                  style={{ width: "110px", height: "110px", right: "60px", bottom: "-40px" }}
                />
                <div className="tkn-ico" style={{ background: "rgba(255,255,255,0.16)" }}>
                  <i className="fi-rr-play"></i>
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    opacity: 0.85,
                    marginBottom: "8px",
                  }}
                >
                  Streaming
                </span>
                <h3>Abonnements à partir de 2 300 F / mois</h3>
                <p>
                  Netflix, Prime Video, Spotify, GogoFlix… Activation immédiate et
                  paiement sécurisé.
                </p>
                <Link href="/abonnements" className="tkn-btn tkn-btn-light" style={{ width: "fit-content" }}>
                  Découvrir les offres
                </Link>
              </div>
            </Fade>
          </div>

          {/* Bannière Boutique / Pack */}
          <div className="col-lg-6 col-md-6 grid-col">
            <Fade direction="right" triggerOnce duration={400} className="h-100">
              <div
                className="tkn-panel"
                style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #273449 100%)",
                }}
              >
                <div
                  className="tkn-ring"
                  style={{ width: "190px", height: "190px", right: "-50px", top: "-60px" }}
                />
                <div
                  className="tkn-ring"
                  style={{ width: "110px", height: "110px", right: "60px", bottom: "-40px" }}
                />
                <div className="tkn-ico" style={{ background: "rgba(229,9,20,0.22)" }}>
                  <i className="fi-rr-shopping-bag" style={{ color: "#ff6b74" }}></i>
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    opacity: 0.75,
                    marginBottom: "8px",
                  }}
                >
                  Boutique
                </span>
                <h3>Composez votre pack personnalisé</h3>
                <p>
                  Sélectionnez vos produits, créez votre pack et recevez-le à
                  Cotonou et ses environs.
                </p>
                <Link href="/composer-pack" className="tkn-btn tkn-btn-primary" style={{ width: "fit-content" }}>
                  <i className="fi-rr-box-open"></i>
                  Composer mon pack
                </Link>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;