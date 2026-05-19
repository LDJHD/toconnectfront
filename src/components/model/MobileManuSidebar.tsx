"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Collapse from "react-bootstrap/Collapse";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { logout } from "@/store/reducers/registrationSlice";
import { authService } from "@/lib/services/auth";

const MobileManuSidebar = ({
  isMobileMenuOpen,
  closeMobileManu,
  toggleMainMenu,
  activeMainMenu,
  cartCount = 0,
  wishlistCount = 0,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [userPoints, setUserPoints] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [submittingCode, setSubmittingCode] = useState(false);

  const refreshUserPoints = () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("login_user");
    if (!raw) {
      setUserPoints(0);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUserPoints(Number(parsed?.utilisateur?.points || 0));
    } catch {
      setUserPoints(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserPoints();
    } else {
      setUserPoints(0);
    }
  }, [isAuthenticated, isMobileMenuOpen]);

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
      parsed.utilisateur = {
        ...(parsed.utilisateur || {}),
        points: nextPoints,
        statut: payload.statut || parsed.utilisateur?.statut,
      };
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

  const openCompteMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    toggleMainMenu("compte");
  };

  const handleLogout = () => {
    localStorage.removeItem("login_user");
    localStorage.removeItem("auth_token");
    dispatch(logout());
    closeMobileManu();
    router.push("/");
  };
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
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={openCompteMenu}
                    className={
                      "gi-mobile-account-tile" +
                      (activeMainMenu === "compte" ? " is-open" : "")
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px 8px",
                      borderRadius: "12px",
                      border: "2px solid #28a745",
                      color: "#111827",
                      background: "#f0fff4",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    aria-expanded={activeMainMenu === "compte"}
                    aria-label="Ouvrir le menu du compte connecté"
                  >
                    <i
                      className="fi-rr-angle-small-down gi-mobile-account-chevron"
                      aria-hidden
                    />
                    <span style={{ position: "relative", display: "inline-flex" }}>
                      <i
                        className="fi-rr-user"
                        style={{ fontSize: "1.1rem", color: "#28a745" }}
                      ></i>
                      <span
                        style={{
                          position: "absolute",
                          right: "-4px",
                          bottom: "-2px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#28a745",
                          border: "1px solid #fff",
                        }}
                      />
                    </span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Connecté</span>
                  </button>
                ) : (
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
                )}

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
                <li
                  className={
                    "dropdown drop-list" +
                    (activeMainMenu === "compte" ? " active" : "")
                  }
                >
                  <span onClick={() => toggleMainMenu("compte")} className="menu-toggle"></span>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMainMenu("compte");
                    }}
                  >
                    <i
                      className="fi-rr-user"
                      style={{
                        marginRight: "8px",
                        color: isAuthenticated ? "#28a745" : undefined,
                      }}
                    ></i>
                    {isAuthenticated ? "Mon compte (Connecté)" : "Mon Compte"}
                  </Link>
                  <Collapse in={activeMainMenu === "compte"}>
                    <ul
                      style={{
                        display: activeMainMenu === "compte" ? "block" : "none",
                      }}
                      className="sub-menu"
                    >
                      {isAuthenticated ? (
                        <>
                          <li>
                            <Link href="/user-profile" onClick={closeMobileManu}>
                              Mon Profil
                            </Link>
                          </li>
                          <li>
                            <Link href="/mes-abonnements" onClick={closeMobileManu}>
                              Mes Abonnements
                            </Link>
                          </li>
                          <li>
                            <Link href="/orders" onClick={closeMobileManu}>
                              Mes Commandes
                            </Link>
                          </li>
                          <li>
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                refreshUserPoints();
                                setShowCodeModal(true);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              Saisir mon code
                            </a>
                          </li>
                          <li>
                            <span
                              style={{
                                display: "block",
                                padding: "10px 15px",
                                color: "#e50914",
                                fontWeight: 700,
                              }}
                            >
                              Mes points : {userPoints.toFixed(2)}
                            </span>
                          </li>
                          <li>
                            <Link href="/cart" onClick={closeMobileManu}>
                              Mon Panier
                            </Link>
                          </li>
                          <li>
                            <a
                              onClick={handleLogout}
                              style={{ cursor: "pointer", color: "#e50914" }}
                            >
                              Déconnexion
                            </a>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link href="/login" onClick={closeMobileManu}>
                              Connexion
                            </Link>
                          </li>
                          <li>
                            <Link href="/mes-abonnements" onClick={closeMobileManu}>
                              Mes Abonnements
                            </Link>
                          </li>
                          <li>
                            <Link href="/orders" onClick={closeMobileManu}>
                              Mes Commandes
                            </Link>
                          </li>
                          <li>
                            <Link href="/cart" onClick={closeMobileManu}>
                              Mon Panier
                            </Link>
                          </li>
                        </>
                      )}
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

      {showCodeModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "420px",
              borderRadius: "14px",
              padding: "22px",
            }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Saisir mon code</h4>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "12px" }}>
              Points actuels : <strong>{userPoints.toFixed(2)}</strong>
            </p>
            <input
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value.toUpperCase())}
              placeholder="Ex: TC-1234-ABCD"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "14px",
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                style={{
                  border: "1px solid #ddd",
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRedeemCode}
                disabled={submittingCode}
                style={{
                  border: "none",
                  background: "#e50914",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  opacity: submittingCode ? 0.7 : 1,
                }}
              >
                {submittingCode ? "Validation..." : "Valider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileManuSidebar;
