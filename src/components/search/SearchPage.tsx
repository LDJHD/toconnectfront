"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { articlesService } from "@/lib/services/articles";
import { abonnementsService } from "@/lib/services/abonnements";
import ItemCard from "../product-item/ItemCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const normalize = (value: string) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

function SearchPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [loading, setLoading] = useState(false);
  const [articleResults, setArticleResults] = useState<any[]>([]);
  const [abonnementResults, setAbonnementResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const runSearch = async () => {
      if (!query) {
        setArticleResults([]);
        setAbonnementResults([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        // Base backend: articles search fields => nom, description
        // Base backend: type comptes fields => nom, plateforme, description, composition
        const [articlesRes, plansRes] = await Promise.allSettled([
          articlesService.search(query),
          abonnementsService.getTypeComptes(),
        ]);

        if (articlesRes.status === "fulfilled") {
          const payload = articlesRes.value.data || {};
          setArticleResults(payload.data || payload || []);
        } else {
          setArticleResults([]);
        }

        if (plansRes.status === "fulfilled") {
          const list = plansRes.value.data?.data || plansRes.value.data || [];
          const q = normalize(query);
          const filtered = list.filter((item: any) => {
            const fields = [
              item.nom,
              item.plateforme,
              item.description,
              item.composition,
            ]
              .filter(Boolean)
              .map((v) => normalize(String(v)));
            return fields.some((f) => f.includes(q));
          });
          setAbonnementResults(filtered);
        } else {
          setAbonnementResults([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Erreur lors de la recherche");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  const totalCount = useMemo(
    () => articleResults.length + abonnementResults.length,
    [articleResults.length, abonnementResults.length]
  );

  return (
    <>
      <Breadcrumb title="Recherche" />
      <section className="padding-tb-40">
        <div className="container">
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "6px" }}>Resultats</h3>
            {query ? (
              <p style={{ color: "#666", marginBottom: 0 }}>
                Mot cle: <strong>{query}</strong> - {totalCount} resultat(s)
              </p>
            ) : (
              <p style={{ color: "#666", marginBottom: 0 }}>
                Saisissez un mot dans la barre de recherche pour afficher les produits et abonnements.
              </p>
            )}
          </div>

          {loading && <div style={{ padding: "18px 0" }}>Recherche en cours...</div>}
          {error && <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>}

          {!loading && query && (
            <>
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Produits</h4>
                {articleResults.length === 0 ? (
                  <div style={{ color: "#777" }}>Aucun produit trouve.</div>
                ) : (
                  <div className="row">
                    {articleResults.map((article: any, index: number) => (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={`a-${article.id || index}`}>
                        <ItemCard data={article} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Abonnements</h4>
                {abonnementResults.length === 0 ? (
                  <div style={{ color: "#777" }}>Aucun abonnement trouve.</div>
                ) : (
                  <div className="row">
                    {abonnementResults.map((plan: any) => {
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

                      return (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={`p-${plan.id}`}>
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              transition: "all 0.3s ease",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              border: "1px solid #eee",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                height: "160px",
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
                                  background: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)`,
                                }}
                              />
                              <span
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  background: getPlatformColor(plan.plateforme),
                                  color: "#fff",
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                {plan.plateforme}
                              </span>
                            </div>

                            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                              <h5 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "8px" }}>
                                {plan.nom}
                              </h5>
                              {plan.description && (
                                <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "12px", lineHeight: 1.4 }}>
                                  {plan.description.substring(0, 80)}
                                  {plan.description.length > 80 ? "..." : ""}
                                </p>
                              )}
                              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                                <i className="fi-rr-screen" style={{ color: getPlatformColor(plan.plateforme) }}></i>
                                <span style={{ fontSize: "0.85rem", color: "#555" }}>
                                  {plan.nombreEcran || plan.nombre_ecran} ecran{(plan.nombreEcran || plan.nombre_ecran) > 1 ? "s" : ""}
                                </span>
                              </div>
                              <div style={{ marginTop: "auto" }}>
                                <div
                                  style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: getPlatformColor(plan.plateforme),
                                    marginBottom: "12px",
                                  }}
                                >
                                  {Number(plan.prix).toLocaleString("fr-FR")} F
                                  <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#999" }}>/mois</span>
                                </div>
                                <span
                                  style={{
                                    display: "block",
                                    textAlign: "center",
                                    background: "#ccc",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    cursor: "not-allowed",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Souscrire
                                </span>
                                <Link
                                  href={`/souscrire?typeCompteId=${plan.id}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    textAlign: "center",
                                    background: "#25D366",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                  Prendre
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default SearchPage;
