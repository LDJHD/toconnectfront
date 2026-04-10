"use client";

import { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import { articlesService } from "@/lib/services/articles";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await articlesService.featured();
        setProducts((res.data || res || []).slice(0, 8));
      } catch (err) {
        console.error("Erreur chargement produits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "60px 0" }}>
        <div className="container text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ padding: "60px 0" }}>
      <div className="container">
        <Fade direction="up" triggerOnce duration={400}>
          <div className="text-center" style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "10px" }}>
              Produits <span style={{ color: "#e50914" }}>en Vedette</span>
            </h2>
            <p style={{ color: "#666" }}>Nos meilleures selections pour vous</p>
          </div>
        </Fade>

        <div className="row">
          {products.map((product: any, index: number) => {
            const mainImage = product.images?.find((img: any) => img.principal) || product.images?.[0];
            const imageUrl = mainImage
              ? `${BACKEND_URL}${mainImage.imageUrl || mainImage.image_url}`
              : "/assets/img/common/about.png";

            return (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                <Fade direction="up" triggerOnce duration={400} delay={index * 80}>
                  <Link href={`/product-left-sidebar/?id=${product.id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                        transition: "all 0.3s ease",
                        border: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          paddingTop: "100%",
                          overflow: "hidden",
                          background: "#f5f5f5",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.nom}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {product.prixPromo && (
                          <span
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              background: "#e50914",
                              color: "#fff",
                              padding: "3px 10px",
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Promo
                          </span>
                        )}
                      </div>
                      <div style={{ padding: "15px" }}>
                        <h6
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "#333",
                            marginBottom: "8px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.nom}
                        </h6>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "#e50914",
                            }}
                          >
                            {Number(product.prixPromo || product.prix).toLocaleString("fr-FR")} F
                          </span>
                          {product.prixPromo && (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#999",
                                textDecoration: "line-through",
                              }}
                            >
                              {Number(product.prix).toLocaleString("fr-FR")} F
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Fade>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={{ marginTop: "20px" }}>
          <Link
            href="/shop-left-sidebar-col-3"
            style={{
              color: "#e50914",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Voir toute la boutique <i className="fi-rr-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
