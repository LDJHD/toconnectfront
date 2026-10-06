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
          <div className="spinner-border" role="status" style={{ color: "#e50914" }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ padding: "72px 0", background: "#ffffff" }}>
      <div className="container">
        <Fade direction="up" triggerOnce duration={400}>
          <div className="text-center" style={{ marginBottom: "38px" }}>
            <span className="sec-eyebrow">
              <i className="fi-rr-sparkles"></i> Sélection
            </span>
            <h2 className="sec-title">
              Produits <span>en Vedette</span>
            </h2>
            <p className="sec-subtitle">
              Nos meilleures sélections pour vous, livrées à Cotonou et environs.
            </p>
          </div>
        </Fade>

        <div className="row g-3 g-md-4">
          {products.map((product: any, index: number) => {
            const mainImage = product.images?.find((img: any) => img.principal) || product.images?.[0];
            const imageUrl = mainImage
              ? `${BACKEND_URL}${mainImage.imageUrl || mainImage.image_url}`
              : "/assets/img/common/about.png";

            return (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 col-6 grid-col">
                <Fade direction="up" triggerOnce duration={400} delay={index * 60} className="h-100">
                  <Link
                    href={`/product-left-sidebar/?id=${product.id}`}
                    style={{ textDecoration: "none", display: "flex", width: "100%" }}
                    className="prod-card"
                  >
                    <div className="prod-card-media">
                      <img src={imageUrl} alt={product.nom} />
                      {product.prixPromo && <span className="prod-badge">Promo</span>}
                    </div>
                    <div className="prod-card-body">
                      <h6>{product.nom}</h6>
                      <div className="prod-price">
                        <strong>{Number(product.prixPromo || product.prix).toLocaleString("fr-FR")} F</strong>
                        {product.prixPromo && (
                          <s>{Number(product.prix).toLocaleString("fr-FR")} F</s>
                        )}
                      </div>
                    </div>
                  </Link>
                </Fade>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={{ marginTop: "34px" }}>
          <Link href="/boutique" className="tkn-link">
            Voir toute la boutique <i className="fi-rr-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;