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

const TIERS = [
  { duree: 1, label: "1 mois", multiplier: 1 },
  { duree: 3, label: "3 mois", multiplier: 3 },
  { duree: 6, label: "6 mois", multiplier: 6 },
  { duree: 12, label: "12 mois", multiplier: 12 },
];

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

  const planImage = (plan: any) =>
    plan.image ? `${BACKEND_URL}/${plan.image}` : DEFAULT_PLATFORM_IMAGES[plan.plateforme] || "/assets/img/category/netflix.jpeg";

  return (
    <>
      <Breadcrumb title={"Abonnements Streaming"} />
      <section style={{ padding: "50px 0 70px", background: "linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%)" }}>
        <div className="container">
          <Fade direction="up" triggerOnce duration={400}>
            <div className="text-center" style={{ marginBottom: "34px" }}>
              <span className="plan-eyebrow">
                <i className="fi-rr-play"></i> Offres streaming
              </span>
              <h2 className="plan-title">
                Choisissez votre <span>Abonnement</span>
              </h2>
              <p className="plan-subtitle">
                Profitez de vos plateformes de streaming préférées à des prix imbattables.
                Paiement sécurisé et accès immédiat à vos comptes.
              </p>
            </div>
          </Fade>

          {/* Filtres par plateforme */}
          <div className="plan-tabs" style={{ marginBottom: "34px" }}>
            {platforms.map((platform: any) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`plan-tab ${activePlatform === platform ? "is-active" : ""}`}
              >
                {platform === "all" ? "Toutes les plateformes" : platform}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <div className="spinner-border" role="status" style={{ color: "#e50914" }}>
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center" style={{ padding: "60px 0", color: "#94a3b8" }}>
              <i className="fi-rr-info" style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}></i>
              <p style={{ fontSize: "1.05rem" }}>Aucun abonnement disponible pour le moment.</p>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {filtered.map((plan: any, index: number) => (
                <div key={plan.id} className="col-6 col-md-6 col-lg-4 plan-col">
                  <Fade direction="up" triggerOnce duration={400} delay={index * 60} className="h-100">
                    <article className="plan-card">
                      {/* Image + badge */}
                      <div className="plan-card-media">
                        <img src={planImage(plan)} alt={plan.nom} />
                        <span className="plan-badge">{plan.plateforme}</span>
                      </div>

                      {/* Contenu */}
                      <div className="plan-card-body">
                        <h5 className="plan-card-name">{plan.nom}</h5>
                        <p className="plan-card-desc">{plan.description || ""}</p>

                        <div className="plan-feature">
                          <span className="plan-feature-icon">
                            <i className="fi-rr-check"></i>
                          </span>
                          <span>
                            {(plan.nombreEcran || plan.nombre_ecran) || 1} écran
                            {(plan.nombreEcran || plan.nombre_ecran) > 1 ? "s" : ""} simultané
                            {(plan.nombreEcran || plan.nombre_ecran) > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="plan-feature">
                          <span className="plan-feature-icon">
                            <i className="fi-rr-check"></i>
                          </span>
                          <span>Accès immédiat après paiement</span>
                        </div>
                        <div className="plan-feature">
                          <span className="plan-feature-icon">
                            <i className="fi-rr-check"></i>
                          </span>
                          <span>Identifiants + profil + PIN inclus</span>
                        </div>

                        {/* Tarifs */}
                        <div style={{ marginTop: "14px" }}>
                          {TIERS.map((tier) => (
                            <div
                              key={tier.duree}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "7px 2px",
                                borderBottom: "1px solid #eef1f5",
                                fontSize: "0.82rem",
                              }}
                            >
                              <span style={{ color: "#475569" }}>{tier.label}</span>
                              <span style={{ fontWeight: 700, color: "#0f172a" }}>
                                {(Number(plan.prix) * tier.multiplier).toLocaleString("fr-FR")} F
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="plan-card-price-row">
                          <div className="plan-actions">
                            <Link href={`/souscrire/?typeCompteId=${plan.id}`} className="btn-plan btn-plan-primary">
                              Souscrire maintenant
                            </Link>
                            <Link
                              href={`https://wa.me/22967357728?text=${encodeURIComponent(
                                `Bonjour, je souhaite souscrire à l'abonnement ${plan.nom} sur TO CONNECT TV`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-plan btn-plan-whatsapp"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Commander via WhatsApp
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Fade>
                </div>
              ))}
            </div>
          )}

          {/* CTA WhatsApp */}
          <div className="plan-cta" style={{ marginTop: "50px" }}>
            <h3>Commander par WhatsApp</h3>
            <p>Vous préférez commander directement ? Contactez-nous sur WhatsApp !</p>
            <a
              href="https://wa.me/22967357728?text=Bonjour%2C%20je%20souhaite%20souscrire%20a%20un%20abonnement%20sur%20TO%20CONNECT%20TV"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-whatsapp"
            >
              <i className="fi fi-brands-whatsapp"></i>
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default AbonnementsPage;