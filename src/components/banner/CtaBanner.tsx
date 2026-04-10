"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";

function CtaBanner() {
  return (
    <section style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="row" style={{ gap: "0" }}>
          <div className="col-lg-6 col-md-6 mb-3">
            <Fade direction="left" triggerOnce duration={400}>
              <div
                style={{
                  background: "linear-gradient(135deg, #e50914, #b20710)",
                  borderRadius: "16px",
                  padding: "35px 30px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "-30px",
                    bottom: "-30px",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <h3 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "8px" }}>
                  Abonnements Streaming
                </h3>
                <p style={{ opacity: 0.85, marginBottom: "15px", fontSize: "0.9rem" }}>
                  A partir de 2 300 F/mois. Netflix, Prime Video, Spotify , Gogoflix...etc .Profitez de nos offres a prix reduit et sécurisé 
                </p>
                <Link
                  href="/abonnements"
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#e50914",
                    padding: "10px 25px",
                    borderRadius: "30px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    width: "fit-content",
                  }}
                >
                  Decouvrir
                </Link>
              </div>
            </Fade>
          </div>
          <div className="col-lg-6 col-md-6 mb-3">
            <Fade direction="right" triggerOnce duration={400}>
              <div
                style={{
                  background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                  borderRadius: "16px",
                  padding: "35px 30px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "-30px",
                    bottom: "-30px",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <h3 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "8px" }}>
                  Composez votre Pack
                </h3>
                <p style={{ opacity: 0.85, marginBottom: "15px", fontSize: "0.9rem" }}>
                  Selectionnez vos produits alimentaires et creez votre pack personnalise
                </p>
                <Link
                  href="/composer-pack"
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#1a1a2e",
                    padding: "10px 25px",
                    borderRadius: "30px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    width: "fit-content",
                  }}
                >
                  Composer
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
