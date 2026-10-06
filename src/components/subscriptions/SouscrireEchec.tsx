"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";

function SouscrireEchecContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <>
      <Breadcrumb title="Paiement échoué" />
      <section style={{ padding: "60px 0" }}>
        <Container>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <Fade triggerOnce duration={400}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "40px 30px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#ffebee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <i className="fi-rr-cross-small" style={{ fontSize: "2.5rem", color: "#c62828" }}></i>
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>Oups, le paiement n&apos;a pas abouti</h3>
                  <p style={{ color: "#666", marginBottom: "5px" }}>
                    Aucun montant n&apos;a été débité. Vous pouvez réessayer quand vous voulez.
                  </p>
                  {reference && (
                    <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "25px" }}>
                      Référence : <strong>{reference}</strong>
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                      href="/abonnements"
                      style={{
                        display: "inline-block",
                        background: "#e50914",
                        color: "#fff",
                        padding: "13px 35px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Réessayer
                    </Link>
                    <a
                      href="https://wa.me/22967357728?text=Bonjour%2C%20j%27ai%20un%20souci%20avec%20mon%20paiement."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        background: "#f0f0f0",
                        color: "#333",
                        padding: "13px 35px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Contacter le support
                    </a>
                  </div>
                </div>
              </Fade>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function SouscrireEchec() {
  return (
    <Suspense
      fallback={
        <div className="text-center" style={{ padding: "80px 0" }}>
          <div className="spinner-border text-danger" role="status" />
        </div>
      }
    >
      <SouscrireEchecContent />
    </Suspense>
  );
}
