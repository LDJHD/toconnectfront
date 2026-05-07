"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { abonnementsService } from "@/lib/services/abonnements";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const DEFAULT_PLATFORM_IMAGES: Record<string, string> = {
  Netflix: "/assets/img/category/netflix.jpeg",
  "Prime Video": "/assets/img/category/prime.jpeg",
  Spotify: "/assets/img/category/spotify.jpg",
  GogoFlix: "/assets/img/category/gogoflix.jpg",
  CapCut: "/assets/img/category/gogoflix.jpg",
  Disney: "/assets/img/category/disney.png",
  "Disney+": "/assets/img/category/disney.png",
  "Disney Plus": "/assets/img/category/disney.png",
};


const getPlatformColor = (plateforme: string) => {
  const colors: Record<string, string> = {
    Netflix: "#25D366",
    "Prime Video": "#00a8e1",
    Spotify: "#1db954",
    GogoFlix: "#f5a623",
    CapCut: "#111111",
    Disney: "#113ccf",
    "Disney+": "#113ccf",
    "Disney Plus": "#113ccf",
  };
  return colors[plateforme] || "#6c5ce7";
};

function AbonnementsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const platformeParam = searchParams.get("plateforme");
  const [activePlatform, setActivePlatform] = useState(platformeParam || "all");

  useEffect(() => {
    if (platformeParam) setActivePlatform(platformeParam);
  }, [platformeParam]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await abonnementsService.getTypeComptes();
        setPlans(res.data || res || []);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const platforms = ["all", ...new Set(plans.map((p: any) => p.plateforme))];
  const filtered = activePlatform === "all" ? plans : plans.filter((p: any) => p.plateforme === activePlatform);

  return (
    <>
      <Breadcrumb title={"Abonnements Streaming"} />
      <section style={{ padding: "40px 0 60px" }}>
        <div className="container">
          <Fade direction="up" triggerOnce duration={400}>
            <div className="text-center" style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
                Choisissez votre <span style={{ color: "#e50914" }}>Abonnement</span>
              </h2>
              <p style={{ color: "#666", maxWidth: "600px", margin: "10px auto 0" }}>
                Profitez de vos plateformes de streaming preferees a des prix imbattables.
                Paiement securise et acces immediat a vos comptes.
              </p>
            </div>
          </Fade>

          {/* Platform tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            {platforms.map((platform: any) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                style={{
                  padding: "10px 25px",
                  borderRadius: "30px",
                  border: activePlatform === platform ? "none" : "1px solid #ddd",
                  background: activePlatform === platform
                    ? (platform === "all" ? "#e50914" : getPlatformColor(platform))
                    : "#fff",
                  color: activePlatform === platform ? "#fff" : "#333",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {platform === "all" ? "Toutes les plateformes" : platform}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: "60px" }}>
              <div className="spinner-border text-danger" role="status" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center" style={{ padding: "60px", color: "#999" }}>
              <i className="fi-rr-info" style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}></i>
              <p style={{ fontSize: "1.1rem" }}>Aucun abonnement disponible pour le moment.</p>
            </div>
          ) : (
            <div className="row">
              {filtered.map((plan: any, index: number) => {
                const color = getPlatformColor(plan.plateforme);
                return (
                  <div key={plan.id} className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                    <Fade direction="up" triggerOnce duration={400} delay={index * 80}>
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: `2px solid ${color}15`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "1 / 1",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={plan.image ? `${BACKEND_URL}/${plan.image}` : DEFAULT_PLATFORM_IMAGES[plan.plateforme] || "/assets/img/category/netflix.jpeg"}
                            alt={plan.nom}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: `linear-gradient(to top, ${color}ee 0%, ${color}88 30%, transparent 70%)`,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "15px",
                              left: "20px",
                              right: "20px",
                              color: "#fff",
                            }}
                          >
                            <h4 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "3px" }}>
                              {plan.nom}
                            </h4>
                            <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{plan.plateforme}</span>
                          </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
                          {plan.description && (
                            <p className="d-none d-sm-block" style={{ color: "#666", fontSize: "0.82rem", marginBottom: "10px", lineHeight: 1.3 }}>
                              {plan.description}
                            </p>
                          )}

                          <div style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                              <i className="fi-rr-check" style={{ color, fontSize: "0.8rem" }}></i>
                              <span style={{ fontSize: "0.8rem" }}>
                                {plan.nombreEcran || plan.nombre_ecran} ecran{(plan.nombreEcran || plan.nombre_ecran) > 1 ? "s" : ""} simultane{(plan.nombreEcran || plan.nombre_ecran) > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="d-none d-sm-flex" style={{ alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                              <i className="fi-rr-check" style={{ color, fontSize: "0.8rem" }}></i>
                              <span style={{ fontSize: "0.8rem" }}>Acces immediat apres paiement</span>
                            </div>
                            <div className="d-none d-sm-flex" style={{ alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                              <i className="fi-rr-check" style={{ color, fontSize: "0.8rem" }}></i>
                              <span style={{ fontSize: "0.8rem" }}>Identifiants + profil + PIN inclus</span>
                            </div>
                          </div>

                          <div style={{ marginTop: "auto" }}>
                            {/* Price tiers */}
                            <div style={{ marginBottom: "10px" }}>
                              {[
                                { duree: 1, label: "1 mois", multiplier: 1 },
                                { duree: 3, label: "3 mois", multiplier: 3 },
                                { duree: 6, label: "6 mois", multiplier: 6 },
                                { duree: 12, label: "12 mois", multiplier: 12 },
                              ].map((tier) => (
                                <div
                                  key={tier.duree}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "6px 0",
                                    borderBottom: "1px solid #f0f0f0",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  <span style={{ color: "#555" }}>{tier.label}</span>
                                  <span style={{ fontWeight: 700, color }}>
                                    {(Number(plan.prix) * tier.multiplier).toLocaleString("fr-FR")} F
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Bouton Souscrire - desactive */}
                            <span
                              style={{
                                display: "block",
                                textAlign: "center",
                                background: "#ccc",
                                color: "#fff",
                                padding: "9px 12px",
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                cursor: "not-allowed",
                                marginBottom: "6px",
                              }}
                            >
                              Souscrire maintenant
                            </span>

                            {/* Bouton Prendre via WhatsApp */}
                            <Link
                              href={`/souscrire/?typeCompteId=${plan.id}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                textAlign: "center",
                                background: "#25D366",
                                color: "#fff",
                                padding: "9px 12px",
                                borderRadius: "10px",
                                textDecoration: "none",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Prendre
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Fade>
                  </div>
                );
              })}
            </div>
          )}

          {/* WhatsApp CTA */}
          <div
            style={{
              marginTop: "50px",
              background: "#25D366",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
              Commander par WhatsApp
            </h3>
            <p style={{ opacity: 0.9, marginBottom: "15px" }}>
              Vous preferez commander directement ? Contactez-nous sur WhatsApp !
            </p>
            <a
              href="https://wa.me/22967357728?text=Bonjour%2C%20je%20souhaite%20souscrire%20a%20un%20abonnement%20sur%20TO%20CONNECT%20TV"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                color: "#e50914",
                padding: "12px 30px",
                borderRadius: "30px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              <i className="fi fi-brands-whatsapp"></i>
              Ecrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default AbonnementsPage;
