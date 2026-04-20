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
    articlesService.featured().then((res) => {
      setArticles((res.data || res).slice(0, 6));
    }).catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section style={{ padding: "50px 0", background: "#f8f9fa" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: "35px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.8rem" }}>
            Produits <span style={{ color: "#e50914" }}>Tendance</span>
          </h2>
          <p style={{ color: "#666" }}>Les articles les plus populaires du moment</p>
        </div>
        <Row>
          <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
            <Fade triggerOnce direction="up">
              <div style={{
                background: "linear-gradient(135deg, #e50914, #b20710)",
                borderRadius: "16px",
                padding: "30px",
                height: "100%",
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "#fff",
              }}>
                <h4 style={{ fontWeight: 800, marginBottom: "15px" }}>
                  Découvrez nos meilleurs produits
                </h4>
                <Link
                  href="/boutique"
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#e50914",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    textDecoration: "none",
                    width: "fit-content",
                  }}
                >
                  Voir la boutique
                </Link>
              </div>
            </Fade>
          </Col>
          {articles.slice(0, 3).map((article: any, i: number) => (
            <Col key={i} xl={3} lg={6} md={6} sm={12} className="mb-4">
              <Fade triggerOnce direction="up" delay={200 * (i + 1)}>
                <div style={{
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  height: "100%",
                }}>
                  <img
                    src={getMainImage(article)}
                    alt={article.nom}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "15px" }}>
                    <h6 style={{ fontWeight: 700, marginBottom: "5px" }}>{article.nom}</h6>
                    <p style={{ color: "#e50914", fontWeight: 700, margin: 0 }}>
                      {Number(article.prix).toLocaleString("fr-FR")} F
                    </p>
                  </div>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Trending;
