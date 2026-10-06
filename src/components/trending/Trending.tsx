"use client";

import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import { articlesService } from "@/lib/services/articles";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getMainImage = (article: any) => {
  if (article.images?.length) {
    const main = article.images.find((img: any) => img.principal) || article.images[0];
    const url = main.imageUrl || main.image_url;
    return url ? `${BACKEND_URL}${url}` : "/assets/img/common/about.png";
  }
  return article.image || "/assets/img/common/about.png";
};

const Trending = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    articlesService
      .featured()
      .then((res) => {
        setArticles((res.data || res).slice(0, 6));
      })
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section style={{ padding: "72px 0", background: "#f6f8fb" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: "38px" }}>
          <span className="sec-eyebrow">
            <i className="fi-rr-trophy"></i> Populaire
          </span>
          <h2 className="sec-title">
            Produits <span>Tendance</span>
          </h2>
          <p className="sec-subtitle">Les articles les plus populaires du moment.</p>
        </div>
        <Row>
          {/* Panneau promo */}
          <Col xl={3} lg={6} md={6} sm={12} className="mb-4 grid-col">
            <Fade triggerOnce direction="up" className="h-100">
              <div
                className="tkn-panel"
                style={{
                  background: "linear-gradient(150deg, #0f172a 0%, #1a2440 60%, #241637 100%)",
                }}
              >
                <div className="tkn-ring" style={{ width: "160px", height: "160px", right: "-50px", top: "-50px" }} />
                <div className="tkn-ico" style={{ background: "rgba(229,9,20,0.22)" }}>
                  <i className="fi-rr-crown" style={{ color: "#ff6b74" }}></i>
                </div>
                <h3>Découvrez nos meilleurs produits</h3>
                <p>Des sélections soignées, des prix justes, une livraison rapide.</p>
                <Link href="/boutique" className="tkn-btn tkn-btn-primary" style={{ width: "fit-content" }}>
                  Voir la boutique
                </Link>
              </div>
            </Fade>
          </Col>
          {articles.slice(0, 3).map((article: any, i: number) => (
            <Col key={i} xl={3} lg={6} md={6} sm={6} xs={6} className="mb-4 grid-col">
              <Fade triggerOnce direction="up" delay={120 * (i + 1)} className="h-100">
                <Link
                  href={`/product-left-sidebar/?id=${article.id}`}
                  style={{ textDecoration: "none", display: "flex", width: "100%" }}
                  className="prod-card"
                >
                  <div className="prod-card-media">
                    <img src={getMainImage(article)} alt={article.nom} />
                  </div>
                  <div className="prod-card-body">
                    <h6>{article.nom}</h6>
                    <div className="prod-price">
                      <strong>{Number(article.prix).toLocaleString("fr-FR")} F</strong>
                    </div>
                  </div>
                </Link>
              </Fade>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Trending;