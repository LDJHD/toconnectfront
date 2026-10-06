"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
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

function SubscriptionPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState("all");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await abonnementsService.getTypeComptes();
        setPlans(res.data || res || []);
      } catch (err) {
        console.error("Erreur chargement plans:", err);
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
    <section className="plan-section">
      <div className="container">
        <Fade direction="up" triggerOnce duration={400}>
          <div className="text-center" style={{ marginBottom: "34px" }}>
            <span className="plan-eyebrow">
              <i className="fi-rr-play"></i> Nos offres streaming
            </span>
            <h2 className="plan-title">
              Nos <span>Abonnements</span>
            </h2>
            <p className="plan-subtitle">
              Choisissez votre plateforme préférée et profitez de vos contenus favoris
              dès aujourd&apos;hui.
            </p>
          </div>
        </Fade>

        {/* Filtres par plateforme */}
        <div className="plan-tabs">
          {platforms.map((platform: any) => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`plan-tab ${activePlatform === platform ? "is-active" : ""}`}
            >
              {platform === "all" ? "Tous" : platform}
            </button>
          ))}
        </div>

        {/* Grille des plans */}
        {loading ? (
          <div className="text-center" style={{ padding: "60px 0" }}>
            <div className="spinner-border" role="status" style={{ color: "#e50914" }}>
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center" style={{ padding: "50px 0", color: "#94a3b8" }}>
            <i className="fi-rr-info" style={{ fontSize: "2.6rem", display: "block", marginBottom: "12px" }}></i>
            <p>Aucun abonnement disponible pour le moment.</p>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {filtered.slice(0, 8).map((plan: any, index: number) => (
              <div key={plan.id} className="col-6 col-md-6 col-lg-3 plan-col">
                <Fade direction="up" triggerOnce duration={400} delay={index * 70} className="h-100">
                  <article className="plan-card">
                    {/* Image + badge plateforme */}
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

                      <div className="plan-card-price-row">
                        <div className="plan-card-price">
                          <strong>{Number(plan.prix).toLocaleString("fr-FR")} F</strong>
                          <span>/ mois</span>
                        </div>
                        <div className="plan-actions">
                          <Link href={`/souscrire?typeCompteId=${plan.id}`} className="btn-plan btn-plan-primary">
                            Souscrire
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
                            WhatsApp
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

        {/* Voir tout */}
        <div className="text-center" style={{ marginTop: "34px" }}>
          <Link href="/abonnements" className="plan-link-all">
            Voir tous les abonnements <i className="fi-rr-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SubscriptionPlans;