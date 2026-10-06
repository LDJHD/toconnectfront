"use client";

import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useState, useEffect } from "react";
import type { IconType } from "react-icons";
import {
  TbBasket,      // Supermarché
  TbShirt,       // Vêtements
  TbShoe,        // Chaussures
  TbDiamond,     // Accessoires
  TbBread,       // Alimentation
  TbChefHat,     // Restauration
  TbPerfume,     // Cosmétique
  TbBuildingCommunity, // Appartement
  TbPackage,     // catégorie inconnue (repli)
} from "react-icons/tb";
import { categoriesService } from "@/lib/services/categories";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const normalize = (s: string) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type CategoryDef = { nom: string; slug: string; Icon: IconType };

const defaultCategories: CategoryDef[] = [
  { nom: "Supermarché", slug: "supermarche", Icon: TbBasket },
  { nom: "Vêtements", slug: "vetement", Icon: TbShirt },
  { nom: "Chaussures", slug: "chaussure", Icon: TbShoe },
  { nom: "Accessoires", slug: "accessoire", Icon: TbDiamond },
  { nom: "Alimentation", slug: "alimentation", Icon: TbBread },
  { nom: "Restauration", slug: "restauration", Icon: TbChefHat },
  { nom: "Cosmétique", slug: "cosmetique", Icon: TbPerfume },
  { nom: "Appartement", slug: "appartement", Icon: TbBuildingCommunity },
];

const catIconFor = (nom: string, slug?: string): IconType => {
  const s = slug || normalize(nom);
  return defaultCategories.find((d) => d.slug === s)?.Icon || TbPackage;
};

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

  const displayCategories = (categories.length > 0 ? categories : defaultCategories).slice(0, 8);

  return (
    <section style={{ padding: "72px 0", background: "#f6f8fb" }}>
      <div className="container">
        <Fade direction="up" triggerOnce duration={400}>
          <div className="text-center" style={{ marginBottom: "38px" }}>
            <span className="sec-eyebrow">
              <i className="fi-rr-shopping-cart"></i> Boutique
            </span>
            <h2 className="sec-title">
              Nos <span>Catégories</span>
            </h2>
            <p className="sec-subtitle">
              Découvrez nos univers produits et trouvez tout ce dont vous avez
              besoin, le tout au même endroit.
            </p>
          </div>
        </Fade>

        <div className="row g-3 g-md-4 justify-content-center">
          {displayCategories.map((cat: any, index: number) => {
            const slugValue = cat.slug || normalize(cat.nom);
            const Icon = catIconFor(cat.nom, slugValue);
            return (
              <div key={cat.id || index} className="col-lg-3 col-md-4 col-sm-6 col-6 grid-col cat-cell">
                <Fade direction="up" triggerOnce duration={400} delay={index * 60} className="h-100 w-100">
                  <Link
                    href={`/boutique?cat=${slugValue}`}
                    className="cat-link"
                    style={{ textDecoration: "none" }}
                  >
                    {cat.image ? (
                      <img
                        src={`${BACKEND_URL}${cat.image}`}
                        alt={cat.nom}
                        className="cat-img"
                      />
                    ) : (
                      <div className="cat-icon" aria-hidden="true">
                        <Icon />
                      </div>
                    )}
                    <h6 className="cat-title">{cat.nom}</h6>
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