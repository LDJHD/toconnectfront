"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeItem, updateQuantity } from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const sessionId = useSelector((state: RootState) => state.cart.sessionId);
  const dispatch = useDispatch();
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + Number(item.prix || item.newPrice || 0) * item.quantity,
    0
  );

  // Build shareable link based on sessionId
  useEffect(() => {
    if (sessionId && typeof window !== "undefined") {
      setShareLink(`${window.location.origin}/panier-partage/?sid=${sessionId}`);
    }
  }, [sessionId]);

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        showSuccessToast("Lien copié !");
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleQty = (id: number, quantity: number, delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  return (
    <section className="gi-cart-section padding-tb-40">
      <h2 className="d-none">Panier</h2>
      <div className="container">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "20px", fontWeight: 300, marginBottom: "20px" }}>Votre panier est vide.</p>
            <Link href="/shop-left-sidebar-col-3/" style={{ color: "#e50914", fontWeight: 600 }}>
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Sidebar résumé */}
            <div className="gi-cart-rightside col-lg-4 col-md-12">
              <div className="gi-sidebar-wrap">
                <div className="gi-sidebar-block">
                  <div className="gi-sb-title">
                    <h3 className="gi-sidebar-title">Résumé</h3>
                  </div>
                  <div className="gi-sb-block-content">
                    <div className="gi-cart-summary-bottom">
                      <div className="gi-cart-summary">
                        <span className="text-left">Sous-total</span>
                        <span className="text-right">{subTotal.toLocaleString("fr-FR")} F</span>
                      </div>
                      <div className="gi-cart-summary-total" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                        <span className="text-left" style={{ fontWeight: 700 }}>Total</span>
                        <span className="text-right" style={{ fontWeight: 700, color: "#e50914" }}>
                          {subTotal.toLocaleString("fr-FR")} F
                        </span>
                      </div>
                      <Link href="/checkout/" className="gi-btn-2" style={{ display: "block", textAlign: "center", marginTop: "15px", padding: "12px" }}>
                        Passer la commande
                      </Link>

                      {/* Shareable cart link */}
                      {shareLink && (
                        <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                          <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "8px", fontWeight: 600 }}>
                            Partager ce panier
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              readOnly
                              value={shareLink}
                              style={{ flex: 1, fontSize: "0.75rem", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", color: "#666" }}
                            />
                            <button
                              onClick={handleCopyLink}
                              style={{
                                background: copied ? "#28a745" : "#e50914",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {copied ? "Copié !" : "Copier"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="gi-cart-leftside col-lg-8 col-md-12 m-t-991">
              <div className="gi-cart-content">
                <div className="gi-cart-inner">
                  <div className="row">
                    <form action="#">
                      <div className="table-content cart-table-content">
                        <table>
                          <thead>
                            <tr>
                              <th>Produit</th>
                              <th>Prix</th>
                              <th style={{ textAlign: "center" }}>Quantité</th>
                              <th>Total</th>
                              <th>Suppr.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item: any, index: number) => {
                              const nom = item.nom || item.title || "";
                              const prix = Number(item.prix || item.newPrice || 0);
                              return (
                              <tr key={index}>
                                <td data-label="Produit" className="gi-cart-pro-name">
                                  <Link href={`/product-left-sidebar/?id=${item.id}`}>
                                    <img
                                      className="gi-cart-pro-img mr-4"
                                      src={item.image || "/assets/img/common/about.png"}
                                      alt={nom}
                                    />
                                    {nom}
                                  </Link>
                                </td>
                                <td data-label="Prix" className="gi-cart-pro-price">
                                  <span className="amount">{prix.toLocaleString("fr-FR")} F</span>
                                </td>
                                <td data-label="Quantité" className="gi-cart-pro-qty" style={{ textAlign: "center" }}>
                                  <div className="cart-qty-plus-minus" style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "6px" }}>
                                    <button
                                      type="button"
                                      onClick={() => handleQty(item.id, item.quantity, -1)}
                                      style={{ border: "none", background: "none", padding: "5px 10px", cursor: "pointer", fontSize: "1.1rem" }}
                                    >-</button>
                                    <span style={{ padding: "5px 10px", fontWeight: 600 }}>{item.quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleQty(item.id, item.quantity, 1)}
                                      style={{ border: "none", background: "none", padding: "5px 10px", cursor: "pointer", fontSize: "1.1rem" }}
                                    >+</button>
                                  </div>
                                </td>
                                <td data-label="Total" className="gi-cart-pro-subtotal">
                                  {(prix * item.quantity).toLocaleString("fr-FR")} F
                                </td>
                                <td data-label="Supprimer" className="gi-cart-pro-remove">
                                  <a href="#" onClick={(e) => { e.preventDefault(); dispatch(removeItem(item.id)); }}>
                                    <i className="gicon gi-trash-o"></i>
                                  </a>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="gi-cart-update-bottom">
                            <Link href="/shop-left-sidebar-col-3/">Continuer les achats</Link>
                            <Link href="/checkout/" className="gi-btn-2">Passer la commande</Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
