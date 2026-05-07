"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useState, useEffect } from "react";
import { categoriesService } from "@/lib/services/categories";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const normalize = (s: string) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const defaultCategories = [
  { nom: "Supermarche", slug: "supermarche", icon: "fi-rr-shopping-cart", color: "#ff6b6b" },
  { nom: "Vetement", slug: "vetement", icon: "fi-rr-shopping-bag", color: "#6c5ce7" },
  { nom: "Chaussure", slug: "chaussure", icon: "fi-rr-man-head", color: "#e50914" },
  { nom: "Accessoire", slug: "accessoire", icon: "fi-rr-diamond", color: "#fdcb6e" },
  { nom: "Alimentation", slug: "alimentation", icon: "fi-rr-restaurant", color: "#e17055" },
  { nom: "Restauration", slug: "restauration", icon: "fi-rr-utensils", color: "#0984e3" },
  { nom: "Cosmetique", slug: "cosmetique", icon: "fi-rr-flower", color: "#e84393" },
  { nom: "Appartement", slug: "appartement", icon: "fi-rr-home", color: "#877f83" },
];

function ShopCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesService.getAll();
        const data = res.data || res || [];
        setCategories(data.length > 0 ? data : []);
      } catch (err) {
        console.error("Erreur chargement categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section style={{ padding: "60px 0", background: "#f9f9f9" }}>
      <div className="container">
        <Fade direction="up" triggerOnce duration={400}>
          <div className="text-center" style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "10px" }}>
              Notre <span style={{ color: "#e50914" }}>Boutique</span>
            </h2>
            <p style={{ color: "#666", maxWidth: "500px", margin: "0 auto" }}>
              Decouvrez nos categories de produits et trouvez tout ce dont vous avez besoin
            </p>
          </div>
        </Fade>

        <div className="row justify-content-center">
          {displayCategories.map((cat: any, index: number) => {
            const slugValue = cat.slug || normalize(cat.nom);
            const defaultCat = defaultCategories.find(
              (d) => d.slug === slugValue
            );
            const color = defaultCat?.color || "#6c5ce7";
            const icon = defaultCat?.icon || "fi-rr-box-open";

            return (
              <div key={cat.id || index} className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                <Fade direction="up" triggerOnce duration={400} delay={index * 80}>
                  <Link
                    href={`/boutique?cat=${slugValue}`}
                    className="cat-card"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="cat-card-inner"
                    >
                      {cat.image ? (
                        <img
                          src={`${BACKEND_URL}${cat.image}`}
                          alt={cat.nom}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            marginBottom: "12px",
                          }}
                        />
                      ) : (
                        <div
                          className="cat-icon"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: `${color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px",
                            fontSize: "1.5rem",
                            color: color,
                          }}
                        >
                          <i className={icon}></i>
                        </div>
                      )}
                      <h6
                        className="cat-title"
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#333",
                          margin: 0,
                          textTransform: "capitalize",
                        }}
                      >
                        {cat.nom}
                      </h6>
                    </div>
                  </Link>
                </Fade>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ShopCategories;
