"use client";

import { useState } from "react";
import PriceRangeSlider from "../../price-range/PriceRangeSlider";
import { GoChevronDown } from "react-icons/go";
import Collapse from "react-bootstrap/Collapse";

const SidebarArea = ({
  categories = [],
  handleCategoryChange,
  selectedCategory,
  handlePriceChange,
  min,
  max,
  order = "order-md-last order-lg-first",
}: any) => {
  const [isOpen, setIsOpen] = useState({
    category: true,
    price: true,
  });

  const renderIcon = (name: string) => {
    const n = (name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (n.includes("supermarche")) return "fi fi-rs-shopping-cart";
    if (n.includes("vetement")) return "fi fi-rs-shirt";
    if (n.includes("chaussure")) return "fi fi-rs-shoe-prints";
    if (n.includes("accessoire")) return "fi fi-rs-gem";
    if (n.includes("alimentation")) return "fi fi-rs-utensils";
    if (n.includes("restauration")) return "fi fi-rs-restaurant";
    if (n.includes("cosmetique")) return "fi fi-rs-flower";
    return "fi fi-rs-box";
  };

  const toggleDropdown = (section: string) => {
    setIsOpen((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={`gi-shop-sidebar col-lg-3 col-md-12 m-t-991 ${order}`}>
      <div id="shop_sidebar">
        <div className="gi-sidebar-wrap">
          <div className="gi-sidebar-block">
            <div style={{ display: "flex", justifyContent: "space-evenly" }} className="gi-sb-title">
              <h3 className="gi-sidebar-title">Categories</h3>
              <div style={{ cursor: "pointer" }} onClick={() => toggleDropdown("category")}>
                <GoChevronDown />
              </div>
            </div>
            <Collapse in={isOpen.category}>
              <div className="gi-cat-sub-dropdown gi-sb-block-content">
                <ul>
                  {categories.map((cat: any) => (
                    <li key={cat.id}>
                      <div className="gi-sidebar-block-item">
                        <input
                          checked={selectedCategory?.includes(String(cat.id))}
                          onChange={() => handleCategoryChange(String(cat.id))}
                          type="checkbox"
                        />
                        <span style={{ cursor: "pointer", marginLeft: "8px" }}>
                          <i className={renderIcon(cat.nom)} style={{ marginRight: "6px" }}></i>
                          {cat.nom}
                        </span>
                        <span className="checked"></span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Collapse>
          </div>

          <div className="gi-sidebar-block">
            <div style={{ display: "flex", justifyContent: "space-evenly" }} className="gi-sb-title">
              <h3 className="gi-sidebar-title">Prix</h3>
              <div style={{ cursor: "pointer" }} onClick={() => toggleDropdown("price")}>
                <GoChevronDown />
              </div>
            </div>
            <Collapse in={isOpen.price}>
              <div className="gi-sb-block-content gi-price-range-slider es-price-slider">
                <PriceRangeSlider min={min} max={max} onPriceChange={handlePriceChange} />
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarArea;
