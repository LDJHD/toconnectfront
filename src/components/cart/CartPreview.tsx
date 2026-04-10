"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { panierService } from "@/lib/services/panier";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getItemImage = (item: any) => {
  const article = item.article;
  if (article?.images?.length) {
    const main = article.images.find((img: any) => img.principal) || article.images[0];
    const url = main.imageUrl || main.image_url;
    return url ? `${BACKEND_URL}${url}` : "/assets/img/common/about.png";
  }
  return "/assets/img/common/about.png";
};

const CartPreview = () => {
  const searchParams = useSearchParams();
  const sid = searchParams.get("sid");
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sid) {
      setLoading(false);
      setError(true);
      return;
    }
    panierService.get(sid)
      .then((res: any) => {
        const data = res.data;
        const panierItems = data?.panier?.items || [];
        setItems(panierItems);
        setTotal(data?.total || 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [sid]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div className="spinner-border" style={{ color: "#e50914" }} />
        <p style={{ marginTop: "15px", color: "#666" }}>Chargement du panier...</p>
      </div>
    );
  }

  if (error || !sid) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h4>Lien invalide ou expiré</h4>
        <Link href="/shop-left-sidebar-col-3/" style={{ color: "#e50914" }}>
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <section className="gi-cart-section padding-tb-40">
      <div className="container">
        <div style={{ background: "#fff", borderRadius: "12px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "800px", margin: "0 auto" }}>
          <h4 style={{ fontWeight: 700, marginBottom: "5px" }}>Aperçu du panier partagé</h4>
          <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "25px" }}>
            Ce panier vous a été partagé par un client.
          </p>

          {items.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center", padding: "30px 0" }}>Ce panier est vide.</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #eee" }}>
                      <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Produit</th>
                      <th style={{ textAlign: "center", padding: "10px", fontWeight: 600 }}>Qté</th>
                      <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Prix unitaire</th>
                      <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, i: number) => {
                      const nom = item.article?.nom || item.pack?.nom || "Produit";
                      const prix = item.prixUnitaire || 0;
                      const image = getItemImage(item);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "12px 10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <img
                                src={image}
                                alt={nom}
                                style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }}
                              />
                              <span style={{ fontWeight: 500 }}>{nom}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", padding: "12px 10px" }}>
                            <span style={{ background: "#f5f5f5", borderRadius: "6px", padding: "4px 12px", fontWeight: 600 }}>
                              {item.quantite}
                            </span>
                          </td>
                          <td style={{ textAlign: "right", padding: "12px 10px" }}>
                            {Number(prix).toLocaleString("fr-FR")} F
                          </td>
                          <td style={{ textAlign: "right", padding: "12px 10px", fontWeight: 600 }}>
                            {(prix * item.quantite).toLocaleString("fr-FR")} F
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ borderTop: "2px solid #eee", marginTop: "20px", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#e50914" }}>
                  {Number(total).toLocaleString("fr-FR")} F
                </span>
              </div>

              <div style={{ marginTop: "25px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link
                  href="/shop-left-sidebar-col-3/"
                  style={{
                    padding: "12px 24px",
                    border: "2px solid #e50914",
                    borderRadius: "8px",
                    color: "#e50914",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Voir la boutique
                </Link>
                <Link
                  href="/checkout/"
                  style={{
                    padding: "12px 24px",
                    background: "#e50914",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Commander maintenant
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartPreview;
