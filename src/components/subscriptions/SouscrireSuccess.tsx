"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { abonnementsService } from "@/lib/services/abonnements";
import { paiementService } from "@/lib/services/paiement";
import { BACKEND_URL } from "@/lib/api";

function SouscrireSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("checking"); // checking | completed | failed
  const [abonnementCree, setAbonnementCree] = useState(false);
  const [mode, setMode] = useState("souscription"); // souscription | reabonnement
  const [details, setDetails] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Empêche le double appel de l'effet (React.StrictMode) : sans ce garde,
  // l'abonnement était créé deux fois au premier chargement.
  const traitementDemarre = useRef(false);

  useEffect(() => {
    if (!reference) {
      router.push("/abonnements");
      return;
    }

    if (traitementDemarre.current) return;
    traitementDemarre.current = true;

    let attempts = 0;
    const maxAttempts = 6;

    const check = async () => {
      try {
        const res = await paiementService.verifierGeniusPay(reference);
        const data = res.data?.data || {};
        const paiementStatus = data.status;

        if (paiementStatus === "completed") {
          setStatus("completed");
          setDetails(data);

          // Paiement confirmé : créer (ou renouveler) l'abonnement côté backend.
          // La référence de paiement rend l'opération idempotente côté serveur :
          // recharger la page ne crée pas de doublon.
          const metadata = data.metadata || {};
          const modePaiement = metadata.mode || "souscription";
          setMode(modePaiement);
          try {
            let res: any;
            if (modePaiement === "reabonnement") {
              res = await abonnementsService.renouveler(Number(metadata.abonnementId), {
                id: Number(metadata.abonnementId),
                nom: metadata.nom || "",
                email: metadata.email || "",
                telephone: metadata.telephone || "",
                typeCompteId: Number(metadata.typeCompteId),
                duree: Number(metadata.duree || 1),
                montant: Number(data.amount || metadata.montant || 0),
                prix: Number(metadata.prix || data.amount || 0),
                plateforme: metadata.plateforme || "",
                nbEcran: Number(metadata.nbEcran || 1),
                referencePaiement: reference,
              });
            } else {
              res = await abonnementsService.create({
                email: metadata.email || "",
                nom: metadata.nom || "Client Tkp Store",
                telephone: metadata.telephone || "",
                typeCompteId: Number(metadata.typeCompteId),
                duree: Number(metadata.duree || 1),
                montant: Number(data.amount || metadata.montant || 0),
                prix: Number(metadata.prix || data.amount || 0),
                plateforme: metadata.plateforme || "",
                nbEcran: Number(metadata.nbEcran || 1),
                referencePaiement: reference,
              });
            }
            // Le backend renvoie le chemin du PDF (identifiants + reçu) généré :
            // on l'expose à l'utilisateur pour téléchargement immédiat.
            const pdf = res?.data?.data?.pdf;
            if (pdf) setPdfUrl(`${BACKEND_URL}${pdf}`);
            setAbonnementCree(true);
          } catch (err: any) {
            console.error("Erreur création abonnement:", err);
            // Normalise l'erreur : `details` peut être une chaîne ou un tableau
            // d'objets {message, rule, field} (validation Vine).
            const details = err?.response?.data?.details;
            const detailsStr = Array.isArray(details)
              ? details.map((d: any) => d?.message || JSON.stringify(d)).join(" / ")
              : details;
            setErrorMsg(
              detailsStr ||
                err?.response?.data?.message ||
                "Le paiement est confirmé mais la création de l'abonnement a échoué. Contactez le support avec votre référence."
            );
          }
        } else if (
          paiementStatus === "failed" ||
          paiementStatus === "cancelled" ||
          paiementStatus === "expired"
        ) {
          setStatus("failed");
          setErrorMsg(`Statut du paiement : ${paiementStatus}`);
        } else if (attempts < maxAttempts) {
          // pending / processing : réessayer
          attempts += 1;
          setTimeout(check, 3000);
        } else {
          setStatus("failed");
          setErrorMsg(
            "Le paiement est toujours en attente de confirmation. Si vous avez payé, il sera traité automatiquement sous peu."
          );
        }
      } catch (err: any) {
        if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(check, 3000);
        } else {
          setStatus("failed");
          setErrorMsg("Impossible de vérifier le paiement. Vérifiez votre connexion.");
        }
      }
    };

    check();
  }, [reference, router]);

  return (
    <>
      <Breadcrumb title="Confirmation de paiement" />
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
                  {status === "checking" && (
                    <>
                      <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }} />
                      <h3 style={{ fontWeight: 700, marginTop: "20px" }}>Vérification du paiement...</h3>
                      <p style={{ color: "#999" }}>Référence : {reference}</p>
                    </>
                  )}

                  {status === "completed" && (
                    <>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: "#e8f5e9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                        }}
                      >
                        <i className="fi-rr-check" style={{ fontSize: "2.5rem", color: "#2e7d32" }}></i>
                      </div>
                      <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                        {abonnementCree
                          ? mode === "reabonnement"
                            ? "Renouvellement confirmé !"
                            : "Paiement confirmé !"
                          : "Paiement reçu"}
                      </h3>
                      {abonnementCree ? (
                        <p style={{ color: "#666", marginBottom: "5px" }}>
                          {mode === "reabonnement"
                            ? "Votre abonnement a été renouvelé. Vos identifiants (compte, profil, PIN) restent les mêmes et vous ont été envoyés par email."
                            : "Votre abonnement a été activé. Vos identifiants (compte, profil, PIN) vous ont été envoyés par email et WhatsApp."}
                        </p>
                      ) : (
                        <p style={{ color: "#e67e22", marginBottom: "5px" }}>
                          {errorMsg ||
                            "Le paiement est confirmé mais l'activation est en cours. Notre équipe vous contactera."}
                        </p>
                      )}

                      {pdfUrl && abonnementCree && (
                        <div style={{ margin: "20px 0" }}>
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-block",
                              background: "#fff",
                              color: "#e50914",
                              border: "2px solid #e50914",
                              padding: "11px 26px",
                              borderRadius: "12px",
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            📄 Télécharger mon reçu (PDF)
                          </a>
                          <p style={{ color: "#999", fontSize: "0.8rem", marginTop: "10px", marginBottom: 0 }}>
                            Identifiants et reçu de paiement, également envoyés par email.
                          </p>
                        </div>
                      )}
                      <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "25px" }}>
                        Référence : <strong>{reference}</strong>
                      </p>
                      <Link
                        href="/abonnements"
                        style={{
                          display: "inline-block",
                          background: "#e50914",
                          color: "#fff",
                          padding: "13px 40px",
                          borderRadius: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Retour aux abonnements
                      </Link>
                    </>
                  )}

                  {status === "failed" && (
                    <>
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
                      <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>Paiement non confirmé</h3>
                      <p style={{ color: "#666", marginBottom: "5px" }}>{errorMsg}</p>
                      <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "25px" }}>
                        Référence : <strong>{reference}</strong>
                      </p>
                      <Link
                        href="/souscrire/echec?reference={reference}"
                        className="d-none"
                      ></Link>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <Link
                          href="/abonnements"
                          style={{
                            display: "inline-block",
                            background: "#f0f0f0",
                            color: "#333",
                            padding: "13px 30px",
                            borderRadius: "12px",
                            fontWeight: 600,
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
                            background: "#25D366",
                            color: "#fff",
                            padding: "13px 30px",
                            borderRadius: "12px",
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          Contacter le support
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </Fade>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function SouscrireSuccess() {
  return (
    <Suspense
      fallback={
        <div className="text-center" style={{ padding: "80px 0" }}>
          <div className="spinner-border text-danger" role="status" />
        </div>
      }
    >
      <SouscrireSuccessContent />
    </Suspense>
  );
}
