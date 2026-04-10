"use client";

import Link from "next/link";
import { useState } from "react";
import SidebarCart from "../../../model/SidebarCart";
import MobileManuSidebar from "../../../model/MobileManuSidebar";

function HeaderOne({ cartItems, wishlistItems }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleMainMenu = (menuKey: any) => {
    setActiveMainMenu((prevMenu) => (prevMenu === menuKey ? null : menuKey));
  };
  const openMobileManu = () => setIsMobileMenuOpen((prev: any) => !prev);
  const closeMobileManu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* <div className="header-top" style={{ background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)" }}>
        <div className="container">
          <div className="row align-itegi-center">
            <div className="col text-left header-top-left d-lg-block">
              <div className="header-top-social">
                <ul className="mb-0">
                  <li className="list-inline-item">
                    <Link href="/">
                      <i className="fi fi-brands-whatsapp"></i>
                    </Link>
                    <span style={{ color: "#fff" }}>+229 67 35 77 28</span>
                  </li>
                  <li className="list-inline-item">
                    <Link href="/">
                      <i className="fi fi-rr-envelope"></i>
                    </Link>
                    <span style={{ color: "#fff" }}>lordjhd7@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col text-center header-top-center">
              <div className="header-top-message" style={{ color: "#fff", fontWeight: 600 }}>
                TO CONNECT TV - Vos abonnements streaming & plus encore
              </div>
            </div>
            <div className="col header-top-right d-none d-lg-block">
              <div className="header-top-right-inner d-flex justify-content-end">
                <Link className="gi-help" href="/contact-us" style={{ color: "#fff" }}>
                  Aide ?
                </Link>
                <Link className="gi-help" href="/track-order" style={{ color: "#fff" }}>
                  Suivre commande
                </Link>
              </div>
            </div>
            <div className="col header-top-res d-lg-none">
              <div className="gi-header-bottons gi-header-buttons">
                <div className="right-icons">
                  <Link href="/login" className="gi-header-btn gi-header-user gi-header-rtl-btn">
                    <div className="header-icon">
                      <i className="fi-rr-user"></i>
                    </div>
                  </Link>
                  <Link href="/wishlist" className="gi-header-btn gi-wish-toggle gi-header-rtl-btn">
                    <div className="header-icon">
                      <i className="fi-rr-heart"></i>
                    </div>
                    <span className="gi-header-count gi-wishlist-count">
                      {wishlistItems.length}
                    </span>
                  </Link>
                  <Link href="" className="gi-header-btn gi-cart-toggle gi-header-rtl-btn">
                    <div onClick={openCart} className="header-icon">
                      <i className="fi-rr-shopping-bag"></i>
                      <span className="main-label-note-new"></span>
                    </div>
                    <span className="gi-header-count gi-cart-count">
                      {cartItems.length}
                    </span>
                  </Link>
                  <Link
                    onClick={openMobileManu}
                    href=""
                    className="gi-header-btn gi-site-menu-icon d-lg-none"
                  >
                    <i className="fi-rr-menu-burger"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <SidebarCart isCartOpen={isCartOpen} closeCart={closeCart} />
      <MobileManuSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileManu={closeMobileManu}
        toggleMainMenu={toggleMainMenu}
        activeMainMenu={activeMainMenu}
      />
    </>
  );
}

export default HeaderOne;
