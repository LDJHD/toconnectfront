"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { abonnementsService } from "@/lib/services/abonnements";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";
const WA_NUMBER = "22967357728";

const DEFAULT_PLATFORM_IMAGES: Record<string, string> = {
  Netflix: "/assets/img/category/netflix.jpeg",
  "Prime Video": "/assets/img/category/prime.jpeg",
  Spotify: "/assets/img/category/spotify.jpg",
  GogoFlix: "/assets/img/category/gogoflix.jpg",
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
    Disney: "#113ccf",
    "Disney+": "#113ccf",
    "Disney Plus": "#113ccf",
  };
  return colors[plateforme] || "#6c5ce7";
};

function SouscrirePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeCompteId = searchParams.get("typeCompteId");

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: choix duree, 2: infos, 3: recapitulatif

  // Form state
  const [duree, setDuree] = useState(1);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  useEffect(() => {
    if (!typeCompteId) {
      router.push("/abonnements");
      return;
    }
    const fetchPlan = async () => {
      try {
        const res = await abonnementsService.getTypeCompteById(Number(typeCompteId));
        setPlan(res.data || res);
      } catch (err) {
        router.push("/abonnements");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [typeCompteId, router]);

  const montantTotal = plan ? Number(plan.prix) * duree : 0;
  const color = plan ? getPlatformColor(plan.plateforme) : "#e50914";

  const buildWhatsAppUrl = () => {
    if (!plan) return "#";
    const ecrans = plan.nombreEcran || plan.nombre_ecran || 1;

    let msg =
      `*COMMANDE ABONNEMENT - TO CONNECT TV*\n\n` +
      `*Plateforme :* ${plan.plateforme}\n` +
      `*Formule :* ${plan.nom}\n` +
      `*Ecrans :* ${ecrans}\n` +
      `*Duree :* ${duree} mois\n` +
      `*Prix/mois :* ${Number(plan.prix).toLocaleString("fr-FR")} F\n` +
      `*Total :* ${montantTotal.toLocaleString("fr-FR")} F\n`;

    if (nom) msg += `\n*Nom :* ${nom}`;
    if (email) msg += `\n*Email :* ${email}`;
    if (telephone) msg += `\n*Telephone :* ${telephone}`;

    msg += `\n\nJe souhaite prendre cet abonnement. Merci de me contacter pour finaliser.`;

    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title={"Souscription"} />
        <div className="text-center" style={{ padding: "80px 0" }}>
          <div className="spinner-border text-danger" role="status" />
        </div>
      </>
    );
  }

  if (!plan) return null;

  return (
    <>
      <Breadcrumb title={`Prendre - ${plan.nom}`} />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          <div className="row">
            {/* Left: Steps */}
            <div className="col-lg-8">
              <Fade triggerOnce duration={400}>
                {/* Progress bar */}
                <div style={{ display: "flex", gap: "5px", marginBottom: "30px" }}>
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      style={{
                        flex: 1,
                        height: "4px",
                        borderRadius: "2px",
                        background: step >= s ? color : "#e0e0e0",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>

                {/* Step 1: Duree */}
                {step === 1 && (
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: "25px" }}>
                      Choisissez la duree
                    </h3>
                    <div className="row">
                      {[
                        { value: 1, label: "1 mois" },
                        { value: 3, label: "3 mois", badge: "" },
                        { value: 6, label: "6 mois", badge: "Populaire" },
                        { value: 12, label: "12 mois", badge: "Meilleur prix" },
                      ].map((option) => (
                        <div key={option.value} className="col-md-6 col-sm-6 mb-3">
                          <div
                            onClick={() => setDuree(option.value)}
                            style={{
                              background: duree === option.value ? `${color}08` : "#fff",
                              border: `2px solid ${duree === option.value ? color : "#eee"}`,
                              borderRadius: "14px",
                              padding: "20px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              position: "relative",
                            }}
                          >
                            {option.badge && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "-10px",
                                  right: "15px",
                                  background: color,
                                  color: "#fff",
                                  padding: "3px 10px",
                                  borderRadius: "8px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                {option.badge}
                              </span>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <h5 style={{ fontWeight: 700, marginBottom: "5px" }}>{option.label}</h5>
                                <span style={{ color: "#999", fontSize: "0.85rem" }}>
                                  {Number(plan.prix).toLocaleString("fr-FR")} F/mois
                                </span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>
                                  {(Number(plan.prix) * option.value).toLocaleString("fr-FR")} F
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#999" }}>total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      style={{
                        marginTop: "20px",
                        background: color,
                        color: "#fff",
                        border: "none",
                        padding: "13px 40px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Continuer
                    </button>
                  </div>
                )}

                {/* Step 2: Informations (optionnelles) */}
                {step === 2 && (
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: "5px" }}>
                      Vos informations
                    </h3>
                    <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "25px" }}>
                      Ces informations sont facultatives mais nous aident a mieux vous servir
                    </p>
                    <div className="mb-3">
                      <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Votre nom et prenom"
                        className="form-control"
                        style={{ padding: "12px 15px", borderRadius: "10px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>
                        Adresse email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="form-control"
                        style={{ padding: "12px 15px", borderRadius: "10px" }}
                      />
                      <small style={{ color: "#999" }}>
                        Les informations de votre compte seront envoyees a cette adresse
                      </small>
                    </div>
                    <div className="mb-3">
                      <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>
                        Numero WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="+229 XX XX XX XX"
                        className="form-control"
                        style={{ padding: "12px 15px", borderRadius: "10px" }}
                      />
                      <small style={{ color: "#999" }}>
                        Les informations seront aussi envoyees par WhatsApp
                      </small>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                      <button
                        onClick={() => setStep(1)}
                        style={{
                          background: "#f0f0f0",
                          color: "#333",
                          border: "none",
                          padding: "13px 30px",
                          borderRadius: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Retour
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        style={{
                          flex: 1,
                          background: color,
                          color: "#fff",
                          border: "none",
                          padding: "13px 40px",
                          borderRadius: "12px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        Voir le recapitulatif
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Recapitulatif */}
                {step === 3 && (
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: "25px" }}>
                      Recapitulatif
                    </h3>
                    <div
                      style={{
                        background: "#f9f9f9",
                        borderRadius: "14px",
                        padding: "25px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#666" }}>Abonnement</span>
                          <span style={{ fontWeight: 600 }}>{plan.nom}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#666" }}>Plateforme</span>
                          <span style={{ fontWeight: 600, color }}>{plan.plateforme}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#666" }}>Duree</span>
                          <span style={{ fontWeight: 600 }}>{duree} mois</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#666" }}>Ecrans</span>
                          <span style={{ fontWeight: 600 }}>
                            {plan.nombreEcran || plan.nombre_ecran}
                          </span>
                        </div>
                      </div>
                      {(nom || email || telephone) && (
                        <div style={{ marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
                          {nom && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ color: "#666" }}>Nom</span>
                              <span style={{ fontWeight: 600 }}>{nom}</span>
                            </div>
                          )}
                          {email && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ color: "#666" }}>Email</span>
                              <span style={{ fontWeight: 600 }}>{email}</span>
                            </div>
                          )}
                          {telephone && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "#666" }}>Telephone</span>
                              <span style={{ fontWeight: 600 }}>{telephone}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</span>
                        <span style={{ fontSize: "1.6rem", fontWeight: 800, color }}>
                          {montantTotal.toLocaleString("fr-FR")} F
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#e8f5e9",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "20px",
                        fontSize: "0.85rem",
                        color: "#2e7d32",
                      }}
                    >
                      <i className="fi-rr-info" style={{ marginRight: "8px" }}></i>
                      En cliquant sur &quot;Confirmer via WhatsApp&quot;, vous serez redirige vers WhatsApp avec les details de votre commande. Notre equipe vous contactera pour finaliser.
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => setStep(2)}
                        style={{
                          background: "#f0f0f0",
                          color: "#333",
                          border: "none",
                          padding: "13px 30px",
                          borderRadius: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Modifier
                      </button>
                      <a
                        href={buildWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          background: "#25D366",
                          color: "#fff",
                          border: "none",
                          padding: "15px 40px",
                          borderRadius: "12px",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          textDecoration: "none",
                          boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Confirmer via WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </Fade>
            </div>

            {/* Right: Summary card */}
            <div className="col-lg-4">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "25px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #eee",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "20px",
                    height: "150px",
                  }}
                >
                  <img
                    src={plan.image ? `${BACKEND_URL}/${plan.image}` : DEFAULT_PLATFORM_IMAGES[plan.plateforme] || "/assets/img/category/netflix.jpeg"}
                    alt={plan.nom}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, ${color}dd 0%, ${color}66 40%, transparent 70%)`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "15px",
                      color: "#fff",
                    }}
                  >
                    <h5 style={{ fontWeight: 700, marginBottom: "3px" }}>{plan.nom}</h5>
                    <span style={{ opacity: 0.9, fontSize: "0.85rem" }}>{plan.plateforme}</span>
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#999" }}>Prix/mois</span>
                    <span style={{ fontWeight: 600 }}>{Number(plan.prix).toLocaleString("fr-FR")} F</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#999" }}>Duree</span>
                    <span style={{ fontWeight: 600 }}>{duree} mois</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "2px solid #f0f0f0",
                      marginTop: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.3rem", color }}>
                      {montantTotal.toLocaleString("fr-FR")} F
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default SouscrirePage;
