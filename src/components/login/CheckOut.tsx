"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Col, Row } from "react-bootstrap";
import { clearCart } from "@/store/reducers/cartSlice";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import Link from "next/link";
import { commandesService } from "@/lib/services/commandes";
import { authService } from "@/lib/services/auth";

const WA_NUMBER = "22967357728";

const buildWhatsAppMessage = (
  formData: any,
  cartItems: any[],
  subTotal: number,
  viewLink: string
) => {
  const lignes = cartItems
    .map((item: any) => {
      const nom = item.nom || item.title || "Produit";
      const prix = Number(item.prix || item.newPrice || 0);
      return `• ${nom} x${item.quantity} = ${(prix * item.quantity).toLocaleString("fr-FR")} F`;
    })
    .join("\n");

  const adresse = [formData.adresse, formData.ville].filter(Boolean).join(", ");

  const msg =
    `*COMMANDE Tkp Store*\n\n` +
    `*Nom :* ${formData.nom}\n` +
    `*Telephone :* ${formData.telephone}\n` +
    (adresse ? `*Adresse :* ${adresse}\n` : "") +
    (formData.notes ? `*Notes :* ${formData.notes}\n` : "") +
    `\n*Details de la commande :*\n${lignes}\n\n` +
    `*TOTAL : ${subTotal.toLocaleString("fr-FR")} F*\n\n` +
    `*Apercu de la commande :*\n${viewLink}`;

  return msg;
};

const CheckOut = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const sessionId = useSelector((state: RootState) => state.cart.sessionId);
  const [viewLink, setViewLink] = useState("");
  const [loyalty, setLoyalty] = useState<any>(null);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + Number(item.prix || item.newPrice || 0) * item.quantity,
    0
  );

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "Cotonou",
    notes: "",
  });

  useEffect(() => {
    if (sessionId && typeof window !== "undefined") {
      setViewLink(`${window.location.origin}/panier-partage/?sid=${sessionId}`);
    }
  }, [sessionId]);

  useEffect(() => {
    const initUser = async () => {
      const raw = localStorage.getItem("login_user");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setFormData((prev) => ({
        ...prev,
        nom: parsed?.utilisateur?.nom || prev.nom,
        email: parsed?.utilisateur?.email || prev.email,
        telephone: parsed?.utilisateur?.telephone || prev.telephone,
      }));
      const utilisateurId = Number(parsed?.utilisateur?.id);
      if (utilisateurId) {
        try {
          const res = await authService.getLoyaltySummary(utilisateurId);
          setLoyalty(res.data || null);
        } catch {
          setLoyalty(null);
        }
      }
    };
    initUser();
  }, []);

  const reductionPourcentage = Number(loyalty?.canApplyReduction ? loyalty?.reductionPourcentage || 0 : 0);
  const reductionMontant = reductionPourcentage > 0 ? (subTotal * reductionPourcentage) / 100 : 0;
  const totalFinal = subTotal - reductionMontant;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = async () => {
    if (!formData.nom || !formData.telephone || !formData.email) {
      showErrorToast("Veuillez renseigner votre nom, email et téléphone.");
      return;
    }
    if (cartItems.length === 0) {
      showErrorToast("Votre panier est vide.");
      return;
    }

    try {
      const res = await commandesService.create({
        sessionId,
        utilisateurNom: formData.nom,
        utilisateurEmail: formData.email,
        utilisateurTelephone: formData.telephone,
        adresseLivraison: [formData.adresse, formData.ville].filter(Boolean).join(", "),
        notes: formData.notes || undefined,
      });
      const payload = res.data || {};
      const url = payload.whatsappLinkClient || payload.whatsappLinkAdmin;
      if (url) {
        window.open(url, "_blank");
      } else {
        const message = buildWhatsAppMessage(formData, cartItems, totalFinal, viewLink);
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, "_blank");
      }

      dispatch(clearCart());
      showSuccessToast("Commande creee. Redirection WhatsApp...");
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Erreur lors de la creation de commande");
    }
  };

  return (
    <section className="gi-checkout padding-tb-40">
      <div className="container">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h4>Votre panier est vide</h4>
            <Link href="/boutique/" style={{ color: "#e50914" }}>
              Retour à la boutique
            </Link>
          </div>
        ) : (
          <Row>
            {/* Formulaire infos client */}
            <Col lg={8} md={12}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "25px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <h5 style={{ fontWeight: 700, marginBottom: "6px" }}>
                  Informations de livraison
                </h5>
                <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "20px" }}>
                  Ces informations seront envoyées avec votre commande sur WhatsApp.
                </p>
                <Row>
                  <Col md={6} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Votre nom"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="exemple@email.com"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="+229 XX XX XX XX"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Ville
                    </label>
                    <select
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Cotonou">Cotonou</option>
                      <option value="Porto-Novo">Porto-Novo</option>
                      <option value="Parakou">Parakou</option>
                      <option value="Abomey-Calavi">Abomey-Calavi</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Quartier, rue, repère..."
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <label style={{ fontWeight: 600, marginBottom: "5px", display: "block" }}>
                      Notes / Instructions
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Instructions spéciales pour la livraison..."
                      rows={3}
                    />
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Résumé + bouton WhatsApp */}
            <Col lg={4} md={12} className="mt-4 mt-lg-0">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "25px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <h5 style={{ fontWeight: 700, marginBottom: "20px" }}>
                  Résumé de commande
                </h5>

                {/* Liste des articles */}
                <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "15px" }}>
                  {cartItems.map((item: any, i: number) => {
                    const nom = item.nom || item.title || "Produit";
                    const prix = Number(item.prix || item.newPrice || 0);
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "10px",
                          fontSize: "0.88rem",
                          alignItems: "center",
                        }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={nom}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #eee",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{nom}</div>
                          <div style={{ color: "#888" }}>
                            x{item.quantity} &times; {prix.toLocaleString("fr-FR")} F
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                          {(prix * item.quantity).toLocaleString("fr-FR")} F
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr style={{ margin: "12px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    marginBottom: "20px",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "#e50914" }}>
                    {totalFinal.toLocaleString("fr-FR")} F
                  </span>
                </div>
                {loyalty && (
                  <div style={{ marginBottom: "14px", fontSize: "0.85rem", color: "#555" }}>
                    <div>Points: <strong>{Number(loyalty.points || 0).toFixed(2)}</strong></div>
                    {loyalty.statut === "vip" ? (
                      <div style={{ color: "#e50914", fontWeight: 700 }}>Statut VIP (pas de calcul reduction)</div>
                    ) : reductionPourcentage > 0 ? (
                      <>
                        <div>Reduction: <strong>{reductionPourcentage}%</strong></div>
                        <div>Montant reduction: -{reductionMontant.toLocaleString("fr-FR")} F</div>
                        <div>Usages restants: {Number(loyalty.remainingUses || 0)} / 5</div>
                      </>
                    ) : (
                      <div>Aucune reduction (active a partir de 2%)</div>
                    )}
                  </div>
                )}

                {/* Lien apercu envoye dans le message WhatsApp uniquement */}

                {/* Bouton WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#e50914",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Commander via WhatsApp
                </button>
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.78rem",
                    marginTop: "10px",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  WhatsApp s'ouvre avec tous les détails de votre commande.
                  Un agent vous confirmera la livraison.
                </p>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </section>
  );
};

export default CheckOut;
