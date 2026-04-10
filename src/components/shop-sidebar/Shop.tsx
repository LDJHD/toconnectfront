"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ShopProductItem from "../product-item/ShopProductItem";
import { Col, Row } from "react-bootstrap";
import SidebarArea from "./sidebar-area/SidebarArea";
import Spinner from "../button/Spinner";
import Paginantion from "../paginantion/Paginantion";
import { articlesService } from "@/lib/services/articles";
import { categoriesService } from "@/lib/services/categories";
import { useSearchParams } from "next/navigation";

const normalize = (s: string) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const Shop = ({
  xl = 4,
  lg = 12,
  order = "",
  list = "",
  className = "padding-tb-40",
  isList = false,
}) => {
  const searchParams = useSearchParams();
  const urlCat = searchParams.get("cat");

  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const categoriesLoaded = useRef(false);

  // 1. Fetch categories once
  useEffect(() => {
    categoriesService.getAll().then((res: any) => {
      const cats = res.data || res || [];
      setCategories(cats);
      categoriesLoaded.current = true;
      console.log('Categories loaded:', cats);
      console.log('URL cat:', urlCat);

      // If URL has ?cat=, find and set the matching category ID
      if (urlCat) {
        const normalizedUrl = normalize(urlCat);
        console.log('Normalized URL:', normalizedUrl);
        const matched = cats.find(
          (c: any) => normalize(c.nom) === normalizedUrl || c.slug === urlCat
        );
        console.log('Matched category:', matched);
        if (matched) {
          setActiveCategoryId(String(matched.id));
        }
      }
    }).catch((err) => {
      console.error('Error loading categories:', err);
      categoriesLoaded.current = true;
    });
  }, []);

  // 2. When URL cat param changes, update active category
  useEffect(() => {
    if (!categoriesLoaded.current || categories.length === 0) return;
    if (urlCat) {
      const normalizedUrl = normalize(urlCat);
      const matched = categories.find(
        (c: any) => normalize(c.nom) === normalizedUrl || c.slug === urlCat
      );
      if (matched) {
        setActiveCategoryId(String(matched.id));
        setCurrentPage(1);
        return;
      }
    }
    setActiveCategoryId("");
    setCurrentPage(1);
  }, [urlCat, categories]);

  // 3. Fetch articles when filters change
  useEffect(() => {
    setLoading(true);
    setError(false);

    const params: any = { page: currentPage, limit: 12 };
    if (activeCategoryId) {
      params.category_id = activeCategoryId;
      console.log('Fetching articles with category_id:', activeCategoryId);
    }
    if (searchTerm) params.search = searchTerm;
    if (sortOption === "prix_asc") params.tri = "prix_asc";
    if (sortOption === "prix_desc") params.tri = "prix_desc";
    if (sortOption === "nom") params.tri = "nom";
    if (priceRange.min > 0) params.prix_min = priceRange.min;
    if (priceRange.max > 0) params.prix_max = priceRange.max;

    console.log('API params:', params);

    articlesService
      .getAll(params)
      .then((res: any) => {
        console.log('Articles response:', res);
        const articles = res.data?.data || res.data || res || [];
        const meta = res.data?.meta || res.meta || {};
        setData({
          data: Array.isArray(articles) ? articles : [],
          totalItems: meta.total || articles.length,
          totalPages: meta.lastPage || meta.last_page || Math.ceil((meta.total || articles.length) / 12),
        });
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [currentPage, activeCategoryId, sortOption, priceRange, searchTerm]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId((prev) => (prev === categoryId ? "" : categoryId));
    setCurrentPage(1);
  };

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    if (val === "3") setSortOption("nom");
    else if (val === "5") setSortOption("prix_asc");
    else if (val === "6") setSortOption("prix_desc");
    else setSortOption("");
    setCurrentPage(1);
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  }, []);

  if (error) return <div style={{ textAlign: "center", padding: "40px" }}>Impossible de charger les produits.</div>;

  return (
    <Row className={className}>
      <Col lg={lg} md={12} className={`margin-b-30 gi-shop-rightside ${order}`}>
        <div className="gi-pro-list-top d-flex">
          <div className="col-md-6 gi-grid-list">
            <div className="gi-gl-btn">
              <button className={`grid-btn btn-grid-50 ${!isGridView ? "active" : ""}`} onClick={() => setIsGridView(false)}>
                <i className="fi fi-rr-apps"></i>
              </button>
              <button className={`grid-btn btn-list-50 ${isGridView ? "active" : ""}`} onClick={() => setIsGridView(true)}>
                <i className="fi fi-rr-list"></i>
              </button>
            </div>
          </div>
          <div className="col-md-6 gi-sort-select">
            <div className="gi-select-inner">
              <select name="gi-select" id="gi-select" onChange={handleSortChange} defaultValue="">
                <option value="" disabled>Trier par</option>
                <option value="1">Pertinence</option>
                <option value="3">Nom, A a Z</option>
                <option value="5">Prix croissant</option>
                <option value="6">Prix decroissant</option>
              </select>
            </div>
          </div>
        </div>

        {loading || !data ? (
          <Spinner />
        ) : (
          <div className={`shop-pro-content ${isGridView ? "list-view-50" : ""}`}>
            <div className={`shop-pro-inner ${list}`}>
              <Row className="align-items-stretch">
                {data.data.map((item: any, index: number) => (
                  <ShopProductItem isGridView={isGridView} xl={xl} data={item} key={item.id || index} isList={isList} />
                ))}
              </Row>
            </div>
            {data.data.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px" }} className="gi-pro-content cart-pro-title">
                Aucun produit trouve.
              </div>
            ) : (
              <div className="gi-pro-pagination">
                <span>
                  Affichage {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, data.totalItems)} sur {data.totalItems} article(s)
                </span>
                <Paginantion currentPage={currentPage} totalPages={data.totalPages} onPageChange={(p: number) => setCurrentPage(p)} />
              </div>
            )}
          </div>
        )}
      </Col>

      <SidebarArea
        categories={categories}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={activeCategoryId ? [activeCategoryId] : []}
        min={0}
        max={50000}
        handlePriceChange={handlePriceChange}
        order={order}
      />
    </Row>
  );
};

export default Shop;
