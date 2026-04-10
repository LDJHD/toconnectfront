"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarCart from "../../../model/SidebarCart";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { logout, setUserData } from "@/store/reducers/registrationSlice";
import { setSearchTerm } from "@/store/reducers/filterReducer";

function HeaderTwo({ cartItems, wishlistItems }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const { searchTerm } = useSelector((state: RootState) => state.filter);
  const [searchInput, setSearchInput] = useState(searchTerm || "");

  useEffect(() => {
    const userdata = localStorage.getItem("login_user") ?? "";
    const user = userdata !== "" ? JSON.parse(userdata) : null;
    dispatch(setUserData({ isAuthenticated: userdata !== "", user }));
  }, [dispatch]);

  const handleSearch = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setSearchTerm(searchInput));
    router.push("/shop-left-sidebar-col-3");
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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
              <div className="align-self-center gi-header-logo">
                <div className="header-logo">
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <img
                      src={process.env.NEXT_PUBLIC_URL + "/assets/img/logo/logo.png"}
                      alt="TO CONNECT TV"
                      style={{ maxHeight: "45px" }}
                    />
                    {/* <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e50914", lineHeight: 1.1 }}>
                      TO CONNECT<br />
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
                            <Link className="dropdown-item" href="/shop-left-sidebar-col-3">
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
    </>
  );
}

export default HeaderTwo;
