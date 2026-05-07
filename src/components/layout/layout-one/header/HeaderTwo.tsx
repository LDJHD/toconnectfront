"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarCart from "../../../model/SidebarCart";
import MobileManuSidebar from "../../../model/MobileManuSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { logout, setUserData } from "@/store/reducers/registrationSlice";
import { setSearchTerm } from "@/store/reducers/filterReducer";
import { authService } from "@/lib/services/auth";

function HeaderTwo({ cartItems, wishlistItems }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const { searchTerm } = useSelector((state: RootState) => state.filter);
  const [searchInput, setSearchInput] = useState(searchTerm || "");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [submittingCode, setSubmittingCode] = useState(false);

  useEffect(() => {
    const userdata = localStorage.getItem("login_user") ?? "";
    const user = userdata !== "" ? JSON.parse(userdata) : null;
    dispatch(setUserData({ isAuthenticated: userdata !== "", user }));
    const points = Number(user?.utilisateur?.points || 0);
    setUserPoints(points);
  }, [dispatch]);

  const handleRedeemCode = async () => {
    const userdata = localStorage.getItem("login_user");
    if (!userdata) return;
    const parsed = JSON.parse(userdata);
    const utilisateurId = Number(parsed?.utilisateur?.id);
    if (!utilisateurId || !codeValue.trim()) return;

    setSubmittingCode(true);
    try {
      const res = await authService.redeemPromoCode(codeValue.trim(), utilisateurId);
      const payload = res.data || {};
      const nextPoints = Number(payload.points || 0);
      parsed.utilisateur = { ...(parsed.utilisateur || {}), points: nextPoints, statut: payload.statut || parsed.utilisateur?.statut };
      localStorage.setItem("login_user", JSON.stringify(parsed));
      setUserPoints(nextPoints);
      setCodeValue("");
      setShowCodeModal(false);
      window.alert("Code applique avec succes");
    } catch (error: any) {
      window.alert(error?.response?.data?.message || "Code invalide ou deja utilise");
    } finally {
      setSubmittingCode(false);
    }
  };

  const handleSearch = (event: any) => {
    const value = event.target.value;
    setSearchInput(value);
    dispatch(setSearchTerm(value.trim()));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchInput.trim();
    dispatch(setSearchTerm(term));
    if (!term) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openMobileManu = () => setIsMobileMenuOpen(true);
  const closeMobileManu = () => setIsMobileMenuOpen(false);
  const toggleMainMenu = (menuKey: string) => {
    setActiveMainMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleLogout = () => {
    localStorage.removeItem("login_user");
    localStorage.removeItem("auth_token");
    dispatch(logout());
    router.push("/");
  };

  return (
    <>
      <div className="gi-header-bottom d-lg-block">
        <div className="container position-relative">
          <div className="row">
            <div className="gi-flex">
              {/* Logo */}
              <div className="align-self-center gi-header-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={openMobileManu}
                  className="d-lg-none"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    padding: "0",
                    color: "#111827",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
                  }}
                  aria-label="Menu"
                  title="Ouvrir le menu"
                >
                  <i className="fi-rr-menu-burger" style={{ fontWeight: 700 }}></i>
                </button>
                <div className="header-logo">
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <img
                      src="/assets/img/logo/logo.png"
                      alt="Tkp Store"
                      style={{ maxHeight: "45px" }}
                    />
                    {/* <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e50914", lineHeight: 1.1 }}>
                      Tkp Store<br />
                      <span style={{ fontSize: "0.7rem", color: "#333", fontWeight: 400 }}>TV & Boutique</span>
                    </span> */}
                  </Link>
                </div>
              </div>

              {/* Search */}
              <div className="align-self-center gi-header-search">
                <div className="header-search">
                  <form onSubmit={handleSubmit} className="gi-search-group-form" action="#">
                    <input
                      className="form-control gi-search-bar"
                      placeholder="Rechercher produits, abonnements..."
                      type="text"
                      value={searchInput}
                      onChange={handleSearch}
                    />
                    <button className="search_submit" type="submit">
                      <i className="fi-rr-search"></i>
                    </button>
                  </form>
                </div>
              </div>

              {/* Actions */}
              <div className="gi-header-action align-self-center">
                <div className="gi-header-bottons">
                  {/* User */}
                  <div className="gi-acc-drop">
                    <Link
                      href=""
                      className="gi-header-btn gi-header-user dropdown-toggle gi-user-toggle gi-header-rtl-btn"
                      title="Compte"
                    >
                      <div className="header-icon">
                        <i className="fi-rr-user"></i>
                      </div>
                      <div className="gi-btn-desc">
                        <span className="gi-btn-title">Compte</span>
                        <span className="gi-btn-stitle">
                          {isAuthenticated ? "Deconnexion" : "Connexion"}
                        </span>
                      </div>
                    </Link>
                    <ul className="gi-dropdown-menu">
                      {isAuthenticated ? (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/user-profile">
                              Mon Profil
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/mes-abonnements">
                              Mes Abonnements
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/orders">
                              Mes Commandes
                            </Link>
                          </li>
                          <li>
                            <a className="dropdown-item" onClick={() => setShowCodeModal(true)} style={{ cursor: "pointer" }}>
                              Saisir mon code
                            </a>
                          </li>
                          <li>
                            <span className="dropdown-item" style={{ color: "#e50914", fontWeight: 700 }}>
                              Mes points: {userPoints.toFixed(2)}
                            </span>
                          </li>
                          <li>
                            <a className="dropdown-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
                              Deconnexion
                            </a>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/login">
                              Connexion
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/abonnements">
                              Abonnements
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/boutique">
                              Boutique
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    className="gi-header-btn gi-wish-toggle gi-header-rtl-btn"
                    title="Favoris"
                  >
                    <div className="header-icon">
                      <i className="fi-rr-heart"></i>
                    </div>
                    <div className="gi-btn-desc">
                      <span className="gi-btn-title">Favoris</span>
                      <span className="gi-btn-stitle">
                        <b className="gi-wishlist-count">{wishlistItems.length}</b> -articles
                      </span>
                    </div>
                  </Link>

                  {/* Cart */}
                  <Link
                    onClick={openCart}
                    href="#"
                    className="gi-header-btn gi-cart-toggle gi-header-rtl-btn"
                    title="Panier"
                  >
                    <div className="header-icon">
                      <i className="fi-rr-shopping-bag"></i>
                      <span className="main-label-note-new"></span>
                    </div>
                    <div className="gi-btn-desc">
                      <span className="gi-btn-title">Panier</span>
                      <span className="gi-btn-stitle">
                        <b className="gi-cart-count">{cartItems.length}</b> -articles
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SidebarCart isCartOpen={isCartOpen} closeCart={closeCart} />
      <MobileManuSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileManu={closeMobileManu}
        toggleMainMenu={toggleMainMenu}
        activeMainMenu={activeMainMenu}
      />

      {showCodeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "420px", borderRadius: "14px", padding: "22px" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Saisir mon code</h4>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>
              Points actuels: <strong>{userPoints.toFixed(2)}</strong>
            </p>
            <input
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value.toUpperCase())}
              placeholder="Ex: TC-1234-ABCD"
              style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCodeModal(false)} style={{ border: "1px solid #ddd", background: "#fff", borderRadius: "8px", padding: "8px 12px" }}>Annuler</button>
              <button onClick={handleRedeemCode} disabled={submittingCode} style={{ border: "none", background: "#e50914", color: "#fff", borderRadius: "8px", padding: "8px 12px", opacity: submittingCode ? 0.7 : 1 }}>
                {submittingCode ? "Validation..." : "Valider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderTwo;
