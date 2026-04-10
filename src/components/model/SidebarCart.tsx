import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeItem, updateQuantity } from "../../store/reducers/cartSlice";
import Link from "next/link";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const subTotal = cartItems.reduce(
    (acc: number, item: any) => acc + (item.prix || 0) * item.quantity,
    0
  );

  const handleRemove = (id: number) => {
    dispatch(removeItem(id));
  };

  const handleQty = (id: number, quantity: number, delta: number) => {
    const newQty = quantity + delta;
    if (newQty < 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="gi-side-cart-overlay"
          onClick={closeCart}
        />
      )}
      <div
        id="gi-side-cart"
        className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}
      >
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">Mon Panier</span>
              <Link onClick={closeCart} href="#" className="gi-cart-close">
                <i className="fi-rr-cross-small"></i>
              </Link>
            </div>
            {cartItems.length === 0 ? (
              <div className="gi-pro-content cart-pro-title" style={{ padding: "20px 0", color: "#666" }}>
                Votre panier est vide.
              </div>
            ) : (
              <ul className="gi-cart-pro-items">
                {cartItems.map((item: any, index: number) => (
                  <li key={index}>
                    <Link href={`/product-left-sidebar/?id=${item.id}`} onClick={closeCart} className="gi-pro-img">
                      <img src={item.image || "/assets/img/common/about.png"} alt={item.nom} />
                    </Link>
                    <div className="gi-pro-content">
                      <Link href={`/product-left-sidebar/?id=${item.id}`} onClick={closeCart} className="cart-pro-title">
                        {item.nom}
                      </Link>
                      <span className="cart-price">
                        <span>{Number(item.prix || 0).toLocaleString("fr-FR")} F</span>
                      </span>
                      <div className="qty-plus-minus gi-qty-rtl" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                        <button onClick={() => handleQty(item.id, item.quantity, -1)} style={{ border: "1px solid #ddd", background: "none", width: "24px", height: "24px", cursor: "pointer", borderRadius: "4px" }}>-</button>
                        <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => handleQty(item.id, item.quantity, 1)} style={{ border: "1px solid #ddd", background: "none", width: "24px", height: "24px", cursor: "pointer", borderRadius: "4px" }}>+</button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="remove"
                        style={{ background: "none", border: "none", color: "#e50914", cursor: "pointer", padding: 0, marginTop: "4px" }}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="gi-cart-bottom">
              <div className="cart-sub-total">
                <table className="table cart-table">
                  <tbody>
                    <tr>
                      <td className="text-left">Sous-total :</td>
                      <td className="text-right">{subTotal.toLocaleString("fr-FR")} F</td>
                    </tr>
                    <tr>
                      <td className="text-left" style={{ fontWeight: 700 }}>Total :</td>
                      <td className="text-right primary-color" style={{ fontWeight: 700, color: "#e50914" }}>
                        {subTotal.toLocaleString("fr-FR")} F
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cart_btn">
                <Link href="/cart/" className="gi-btn-1" onClick={closeCart}>
                  Voir le panier
                </Link>
                <Link href="/checkout/" className="gi-btn-2" onClick={closeCart}>
                  Commander
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
