"use client";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import { articlesService } from "@/lib/services/articles";
import { categoriesService } from "@/lib/services/categories";
import { packsService } from "@/lib/services/packs";
import { panierService } from "@/lib/services/panier";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

function ComposerPackPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [packItems, setPackItems] = useState<any[]>([]);
  const [packName, setPackName] = useState("Mon Pack Personnalise");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Find alimentation category ID, then fetch its articles
        const catRes = await categoriesService.getAll();
        const cats = catRes.data || catRes || [];
        const alimCat = cats.find((c: any) => (c.nom || "").toLowerCase().includes("alimentation"));
        const params: any = { limit: 50 };
        if (alimCat) params.category_id = alimCat.id;
        const res = await articlesService.getAll(params);
        const data = res.data?.data || res.data || res || [];
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur:", err);
        try {
          const res = await articlesService.getAll({});
          const data = res.data?.data || res.data || res || [];
          setArticles(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("Erreur fallback:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const addToPackItems = (article: any) => {
    const existing = packItems.find((item) => item.articleId === article.id);
    if (existing) {
      setPackItems(
        packItems.map((item) =>
          item.articleId === article.id ? { ...item, quantite: item.quantite + 1 } : item
        )
      );
    } else {
      setPackItems([
        ...packItems,
        {
          articleId: article.id,
          nom: article.nom,
          prix: Number(article.prixPromo || article.prix),
          quantite: 1,
          image: article.images?.[0]?.imageUrl || article.images?.[0]?.image_url,
        },
      ]);
    }
    showSuccessToast(`${article.nom} ajoute au pack !`);
  };

  const updateQuantity = (articleId: number, delta: number) => {
    setPackItems(
      packItems
        .map((item) =>
          item.articleId === articleId
            ? { ...item, quantite: Math.max(0, item.quantite + delta) }
            : item
        )
        .filter((item) => item.quantite > 0)
    );
  };

  const removeFromPack = (articleId: number) => {
    setPackItems(packItems.filter((item) => item.articleId !== articleId));
  };

  const totalPack = packItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  const handleCommander = () => {
    if (packItems.length === 0) {
      showErrorToast("Ajoutez au moins un article a votre pack");
      return;
    }

    const lignes = packItems
      .map((item) => `• ${item.nom} x${item.quantite} = ${(item.prix * item.quantite).toLocaleString("fr-FR")} F`)
      .join("\n");

    const message =
      `*COMMANDE PACK Tkp Store*\n\n` +
      `*Nom du pack :* ${packName}\n\n` +
      `*Articles :*\n${lignes}\n\n` +
      `*TOTAL : ${totalPack.toLocaleString("fr-FR")} F*\n\n` +
      `Je souhaite passer cette commande.`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/22967357728?text=${encoded}`;
    window.open(waUrl, "_blank");
  };

  const handleCreatePack = async () => {
    if (packItems.length === 0) {
      showErrorToast("Ajoutez au moins un article a votre pack");
      return;
    }

    setCreating(true);
    try {
      const sessionId = localStorage.getItem("session_id") || `session_${Date.now()}`;
      localStorage.setItem("session_id", sessionId);

      const payload = {
        nom: packName,
        sessionId,
        items: packItems.map((item) => ({
          articleId: item.articleId,
          quantite: item.quantite,
        })),
      };

      const res = await packsService.create(payload);
      const pack = res.data || res;

      // Add pack to cart
      await panierService.addItem({
        sessionId,
        packId: pack.id,
        quantite: 1,
      });

      showSuccessToast("Pack cree et ajoute au panier !");
      setPackItems([]);
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Erreur lors de la creation du pack");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Composer mon Pack"} />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          <Fade triggerOnce duration={400}>
            <div className="text-center" style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
                Composez votre <span style={{ color: "#e50914" }}>Pack</span>
              </h2>
              <p style={{ color: "#666", maxWidth: "500px", margin: "10px auto 0" }}>
                Selectionnez les articles de votre choix pour creer votre pack personnalise
              </p>
            </div>
          </Fade>

          <div className="row">
            {/* Left: Articles list */}
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center" style={{ padding: "40px" }}>
                  <div className="spinner-border text-danger" role="status" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center" style={{ padding: "40px", color: "#999" }}>
                  <p>Aucun article disponible pour le moment.</p>
                  <Link href="/boutique" style={{ color: "#e50914", fontWeight: 600 }}>
                    Voir la boutique
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {articles.map((article: any) => {
                    const mainImage = article.images?.find((img: any) => img.principal) || article.images?.[0];
                    const imageUrl = mainImage
                      ? `${BACKEND_URL}${mainImage.imageUrl || mainImage.image_url}`
                      : "/assets/img/category/pack.png";
                    const inPack = packItems.find((item) => item.articleId === article.id);

                    return (
                      <div key={article.id} className="col-md-4 col-sm-6 col-6 mb-3">
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                            border: inPack ? "2px solid #e50914" : "1px solid #eee",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              paddingTop: "75%",
                              position: "relative",
                              overflow: "hidden",
                              background: "#f5f5f5",
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={article.nom}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {inPack && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  background: "#e50914",
                                  color: "#fff",
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                }}
                              >
                                {inPack.quantite}
                              </span>
                            )}
                          </div>
                          <div style={{ padding: "12px" }}>
                            <h6
                              style={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                marginBottom: "6px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {article.nom}
                            </h6>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontWeight: 700, color: "#e50914" }}>
                                {Number(article.prixPromo || article.prix).toLocaleString("fr-FR")} F
                              </span>
                              <button
                                onClick={() => addToPackItems(article)}
                                style={{
                                  background: "#e50914",
                                  color: "#fff",
                                  border: "none",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontSize: "1.1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Pack summary */}
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
                <h5 style={{ fontWeight: 700, marginBottom: "15px" }}>
                  <i className="fi-rr-box-open" style={{ marginRight: "8px", color: "#e50914" }}></i>
                  Mon Pack
                </h5>

                <div className="mb-3">
                  <input
                    type="text"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    className="form-control"
                    placeholder="Nom du pack"
                    style={{ padding: "10px 14px", borderRadius: "10px", fontSize: "0.9rem" }}
                  />
                </div>

                {packItems.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "#999" }}>
                    <i className="fi-rr-box-open" style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}></i>
                    <p style={{ fontSize: "0.85rem" }}>Pack vide. Ajoutez des articles.</p>
                  </div>
                ) : (
                  <>
                    {packItems.map((item) => (
                      <div
                        key={item.articleId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{item.nom}</span>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>
                            {item.prix.toLocaleString("fr-FR")} F x {item.quantite}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <button
                            onClick={() => updateQuantity(item.articleId, -1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                              background: "#fff",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                            {item.quantite}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.articleId, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                              background: "#fff",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromPack(item.articleId)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: "none",
                              background: "#fee",
                              color: "#e50914",
                              cursor: "pointer",
                              fontSize: "0.7rem",
                              marginLeft: "5px",
                            }}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "15px",
                        paddingTop: "15px",
                        borderTop: "2px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span style={{ fontWeight: 800, color: "#e50914", fontSize: "1.2rem" }}>
                        {totalPack.toLocaleString("fr-FR")} F
                      </span>
                    </div>

                    <button
                      onClick={handleCommander}
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        background: "#e50914",
                        color: "#fff",
                        border: "none",
                        padding: "13px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#c40710";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#e50914";
                      }}
                    >
                      <i className="fi-rr-shopping-bag" style={{ color: "#fff" }}></i>
                      Commander sur WhatsApp
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default ComposerPackPage;
