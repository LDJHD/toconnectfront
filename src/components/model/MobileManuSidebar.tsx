import React, { useState } from "react";
import Link from "next/link";
import Collapse from 'react-bootstrap/Collapse';

const MobileManuSidebar = ({ isMobileMenuOpen, closeMobileManu, toggleMainMenu, activeMainMenu, cartCount = 0, wishlistCount = 0 }) => {
  return (
    <>
      <div
        style={{ display: isMobileMenuOpen ? "block" : "none" }}
        onClick={closeMobileManu}
        className="gi-mobile-menu-overlay"
      ></div>
      {isMobileMenuOpen && (
        <div id="gi-mobile-menu" className="gi-mobile-menu gi-menu-open">
          <div className="gi-menu-title">
            <span className="menu_title" style={{ color: "#e50914", fontWeight: 700 }}>Tkp Store</span>
            <button onClick={closeMobileManu} className="gi-close-menu">
              x
            </button>
          </div>
          <div className="gi-menu-inner">
            <div style={{ padding: "12px 15px 0" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link
                  href="/login"
                  onClick={closeMobileManu}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border: "1px solid #eee",
                    textDecoration: "none",
                    color: "#111827",
                    background: "#fff",
                  }}
                >
                  <i className="fi-rr-user" style={{ fontSize: "1.1rem" }}></i>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Compte</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={closeMobileManu}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border: "1px solid #eee",
                    textDecoration: "none",
                    color: "#111827",
                    background: "#fff",
                    position: "relative",
                  }}
                >
                  <i className="fi-rr-heart" style={{ fontSize: "1.1rem" }}></i>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Favoris</span>
                  {wishlistCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "8px",
                        minWidth: "18px",
                        height: "18px",
                        padding: "0 5px",
                        borderRadius: "999px",
                        background: "#e50914",
                        color: "#fff",
                        fontSize: "0.72rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMobileManu}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border: "1px solid #eee",
                    textDecoration: "none",
                    color: "#111827",
                    background: "#fff",
                    position: "relative",
                  }}
                >
                  <i className="fi-rr-shopping-bag" style={{ fontSize: "1.1rem" }}></i>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Panier</span>
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "8px",
                        minWidth: "18px",
                        height: "18px",
                        padding: "0 5px",
                        borderRadius: "999px",
                        background: "#e50914",
                        color: "#fff",
                        fontSize: "0.72rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="gi-menu-content">
              <ul>
                <li>
                  <Link href="/" onClick={closeMobileManu}>
                    <i className="fi-rr-home" style={{ marginRight: "8px" }}></i>Accueil
                  </Link>
                </li>
                <li className="dropdown drop-list">
                  <span onClick={() => toggleMainMenu('abonnements')} className="menu-toggle"></span>
                  <Link href="#" onClick={() => toggleMainMenu('abonnements')}>
                    Abonnements
                  </Link>
                  <Collapse in={activeMainMenu === "abonnements"}>
                    <ul style={{ display: activeMainMenu === 'abonnements' ? 'block' : 'none' }} className="sub-menu">
                      <li><Link href="/abonnements" onClick={closeMobileManu}>Tous les abonnements</Link></li>
                      <li><Link href="/abonnements?plateforme=Netflix" onClick={closeMobileManu}>Netflix</Link></li>
                      <li><Link href="/abonnements?plateforme=Prime Video" onClick={closeMobileManu}>Prime Video</Link></li>
                      <li><Link href="/abonnements?plateforme=Spotify" onClick={closeMobileManu}>Spotify</Link></li>
                      <li><Link href="/abonnements?plateforme=GogoFlix" onClick={closeMobileManu}>GogoFlix</Link></li>
                      <li><Link href="/abonnements?plateforme=CapCut" onClick={closeMobileManu}>CapCut</Link></li>
                    </ul>
                  </Collapse>
                </li>
                <li className="dropdown drop-list">
                  <span onClick={() => toggleMainMenu('boutique')} className="menu-toggle"></span>
                  <Link href="#" onClick={() => toggleMainMenu('boutique')}>
                    Boutique
                  </Link>
                  <Collapse in={activeMainMenu === "boutique"}>
                    <ul style={{ display: activeMainMenu === 'boutique' ? 'block' : 'none' }} className="sub-menu">
                      <li><Link href="/boutique" onClick={closeMobileManu}>Tous les produits</Link></li>
                      <li><Link href="/boutique?cat=supermarche" onClick={closeMobileManu}>Supermarche</Link></li>
                      <li><Link href="/boutique?cat=vetement" onClick={closeMobileManu}>Vetement</Link></li>
                      <li><Link href="/boutique?cat=chaussure" onClick={closeMobileManu}>Chaussure</Link></li>
                      <li><Link href="/boutique?cat=accessoire" onClick={closeMobileManu}>Accessoire</Link></li>
                      <li><Link href="/boutique?cat=alimentation" onClick={closeMobileManu}>Alimentation</Link></li>
                      <li><Link href="/boutique?cat=restauration" onClick={closeMobileManu}>Restauration</Link></li>
                      <li><Link href="/boutique?cat=cosmetique" onClick={closeMobileManu}>Cosmetique</Link></li>
                    </ul>
                  </Collapse>
                </li>
                <li>
                  <Link href="/composer-pack" onClick={closeMobileManu}>
                    <i className="fi-rr-box-open" style={{ marginRight: "8px" }}></i>Composer mon Pack
                  </Link>
                </li>
                <li className="dropdown drop-list">
                  <span onClick={() => toggleMainMenu('compte')} className="menu-toggle"></span>
                  <Link href="#" onClick={() => toggleMainMenu('compte')}>
                    Mon Compte
                  </Link>
                  <Collapse in={activeMainMenu === "compte"}>
                    <ul style={{ display: activeMainMenu === 'compte' ? 'block' : 'none' }} className="sub-menu">
                      <li><Link href="/login" onClick={closeMobileManu}>Connexion</Link></li>
                      <li><Link href="/mes-abonnements" onClick={closeMobileManu}>Mes Abonnements</Link></li>
                      <li><Link href="/orders" onClick={closeMobileManu}>Mes Commandes</Link></li>
                      <li><Link href="/cart" onClick={closeMobileManu}>Mon Panier</Link></li>
                    </ul>
                  </Collapse>
                </li>
                <li>
                  <Link href="/contact-us" onClick={closeMobileManu}>
                    <i className="fi-rr-envelope" style={{ marginRight: "8px" }}></i>Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" onClick={closeMobileManu}>
                    A propos
                  </Link>
                </li>
              </ul>
            </div>
            <div className="header-res-lan-curr">
              <div className="header-res-social">
                <div className="header-top-social">
                  <ul className="mb-0">
                    <li className="list-inline-item">
                      <a href="https://wa.me/22967357728" target="_blank" rel="noopener noreferrer">
                        <i className="fi fi-brands-whatsapp"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <Link href="#">
                        <i className="gicon gi-facebook"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="#">
                        <i className="gicon gi-instagram"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileManuSidebar;
