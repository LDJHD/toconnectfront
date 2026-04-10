"use client";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import { authService } from "@/lib/services/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getPlatformColor = (plateforme: string) => {
  const colors: Record<string, string> = {
    Netflix: "#e50914",
    "Prime Video": "#00a8e1",
    Spotify: "#1db954",
    GogoFlix: "#f5a623",
  };
  return colors[plateforme] || "#6c5ce7";
};

function MesAbonnementsPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "results">("email");
  const [loading, setLoading] = useState(false);
  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);

  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
  const user = useSelector((state: RootState) => state.registration.user);

  // If already authenticated, use stored email
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedUser = user as any;
      if (storedUser.email) {
        setEmail(storedUser.email);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestCode = async (e: any) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showErrorToast("Veuillez entrer un email valide");
      return;
    }
    setLoading(true);
    try {
      await authService.requestCode(email);
      showSuccessToast("Code envoye a votre email !");
      setStep("code");
      setCountdown(60);
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.verifyCode(email, code);
      const data = res.data || res;
      setUserInfo(data.utilisateur || data.user);
      setAbonnements(data.abonnements || []);
      setStep("results");

      if (!data.abonnements || data.abonnements.length === 0) {
        showSuccessToast("Bienvenue ! Vous n'avez pas encore d'abonnement.");
      }
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Code invalide ou expire");
    } finally {
      setLoading(false);
    }
  };

  const isActive = (abo: any) => {
    if (abo.fin || abo.inactif) return false;
    const dateFin = new Date(abo.dateFin || abo.date_fin);
    return dateFin > new Date();
  };

  return (
    <>
      <Breadcrumb title={"Mes Abonnements"} />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          {step !== "results" && (
            <Fade triggerOnce duration={400}>
              <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <div className="text-center" style={{ marginBottom: "30px" }}>
                  <h2 style={{ fontWeight: 700, marginBottom: "10px" }}>
                    Verifier mes <span style={{ color: "#e50914" }}>Abonnements</span>
                  </h2>
                  <p style={{ color: "#666" }}>
                    {step === "email"
                      ? "Entrez votre email pour recevoir un code de verification"
                      : "Entrez le code recu par email"}
                  </p>
                </div>

                {step === "email" ? (
                  <form onSubmit={handleRequestCode}>
                    <div className="mb-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        className="form-control"
                        style={{ padding: "14px 18px", borderRadius: "12px", fontSize: "1rem" }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: "100%",
                        background: "#e50914",
                        color: "#fff",
                        border: "none",
                        padding: "14px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      {loading && <span className="spinner-border spinner-border-sm me-2" />}
                      Recevoir le code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode}>
                    <div
                      style={{
                        background: "#f0f8ff",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontSize: "0.9rem",
                      }}
                    >
                      Code envoye a <strong>{email}</strong>
                      <a
                        onClick={() => { setStep("email"); setCode(""); }}
                        style={{ float: "right", color: "#e50914", cursor: "pointer", fontSize: "0.85rem" }}
                      >
                        Modifier
                      </a>
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Code a 6 chiffres"
                        className="form-control"
                        maxLength={6}
                        style={{
                          padding: "15px",
                          borderRadius: "12px",
                          fontSize: "1.5rem",
                          textAlign: "center",
                          letterSpacing: "10px",
                          fontWeight: 700,
                        }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || code.length < 6}
                      style={{
                        width: "100%",
                        background: "#e50914",
                        color: "#fff",
                        border: "none",
                        padding: "14px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer",
                        opacity: code.length < 6 ? 0.6 : 1,
                      }}
                    >
                      {loading && <span className="spinner-border spinner-border-sm me-2" />}
                      Verifier
                    </button>
                    <div className="text-center" style={{ marginTop: "15px" }}>
                      {countdown > 0 ? (
                        <span style={{ color: "#999", fontSize: "0.9rem" }}>
                          Renvoyer dans {countdown}s
                        </span>
                      ) : (
                        <a
                          onClick={handleRequestCode}
                          style={{ color: "#e50914", cursor: "pointer", fontWeight: 600 }}
                        >
                          Renvoyer le code
                        </a>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </Fade>
          )}

          {step === "results" && (
            <Fade triggerOnce duration={400}>
              <div>
                {/* User info header */}
                {userInfo && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                      borderRadius: "16px",
                      padding: "25px 30px",
                      color: "#fff",
                      marginBottom: "30px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: "5px" }}>
                        Bonjour, {userInfo.nom || "Utilisateur"} !
                      </h3>
                      <p style={{ opacity: 0.7, margin: 0 }}>{email}</p>
                    </div>
                    <Link
                      href="/abonnements"
                      style={{
                        background: "#e50914",
                        color: "#fff",
                        padding: "10px 25px",
                        borderRadius: "30px",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      + Nouvel abonnement
                    </Link>
                  </div>
                )}

                {/* Abonnements list */}
                {abonnements.length === 0 ? (
                  <div className="text-center" style={{ padding: "50px 20px" }}>
                    <i className="fi-rr-play" style={{ fontSize: "3rem", color: "#ddd", display: "block", marginBottom: "15px" }}></i>
                    <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>Aucun abonnement</h4>
                    <p style={{ color: "#999", marginBottom: "20px" }}>
                      Bienvenue ! Vous n'avez pas encore souscrit a un abonnement.
                    </p>
                    <Link
                      href="/abonnements"
                      style={{
                        display: "inline-block",
                        background: "#e50914",
                        color: "#fff",
                        padding: "12px 30px",
                        borderRadius: "30px",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Decouvrir nos offres
                    </Link>
                  </div>
                ) : (
                  <div className="row">
                    {abonnements.map((abo: any, index: number) => {
                      const active = isActive(abo);
                      const platforme = abo.typeCompte?.plateforme || abo.type_compte?.plateforme || "N/A";
                      const color = getPlatformColor(platforme);
                      const dateFin = new Date(abo.dateFin || abo.date_fin);

                      return (
                        <div key={abo.id || index} className="col-lg-6 col-md-6 mb-4">
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                              border: `2px solid ${active ? color + "30" : "#eee"}`,
                            }}
                          >
                            <div
                              style={{
                                background: active ? color : "#999",
                                padding: "15px 20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                color: "#fff",
                              }}
                            >
                              <div>
                                <h5 style={{ fontWeight: 700, marginBottom: "3px", fontSize: "1rem" }}>
                                  {abo.typeCompte?.nom || abo.type_compte?.nom || "Abonnement"}
                                </h5>
                                <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{platforme}</span>
                              </div>
                              <span
                                style={{
                                  background: "rgba(255,255,255,0.2)",
                                  padding: "5px 12px",
                                  borderRadius: "20px",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}
                              >
                                {active ? "Actif" : "Expire"}
                              </span>
                            </div>
                            <div style={{ padding: "20px" }}>
                              {abo.compte && (
                                <div style={{ marginBottom: "15px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ color: "#999", fontSize: "0.85rem" }}>Identifiant</span>
                                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {abo.compte.emailCompte || abo.compte.email_compte}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ color: "#999", fontSize: "0.85rem" }}>Mot de passe</span>
                                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {abo.compte.motDePasse || abo.compte.mot_de_passe}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {abo.profil && (
                                <div style={{ marginBottom: "15px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ color: "#999", fontSize: "0.85rem" }}>Profil</span>
                                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {abo.profil.nomProfil || abo.profil.nom_profil}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ color: "#999", fontSize: "0.85rem" }}>Code PIN</span>
                                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                                      {abo.profil.pin}
                                    </span>
                                  </div>
                                </div>
                              )}
                              <div
                                style={{
                                  background: active ? "#f0fff4" : "#fff5f5",
                                  borderRadius: "10px",
                                  padding: "12px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span style={{ fontSize: "0.85rem", color: "#666" }}>
                                  Expire le
                                </span>
                                <span style={{ fontWeight: 700, color: active ? "#e50914" : "#e74c3c" }}>
                                  {dateFin.toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Fade>
          )}
        </Container>
      </section>
    </>
  );
}

export default MesAbonnementsPage;
