import { useState } from "react";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { panierService } from "@/lib/services/panier";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getMainImage = (data: any) => {
  if (data.images?.length) {
    const main = data.images.find((img: any) => img.principal) || data.images[0];
    const url = main.imageUrl || main.image_url;
    return url ? `${BACKEND_URL}${url}` : "/assets/img/common/about.png";
  }
  return data.image || "/assets/img/common/about.png";
};

const ItemCard = ({ data }: any) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const sessionId = useSelector((state: RootState) => state.cart.sessionId);

  const nom = data.nom || data.title || "";
  const prix = data.prixPromo || data.prix || data.newPrice || 0;
  const image = getMainImage(data);
  const categorie = data.category?.nom || data.categorie?.nom || "";
  const description = data.description || "";

  const handleCart = async () => {
    // Add to Redux immediately for fast UI
    dispatch(addItem({
      id: data.id,
      nom,
      prix: Number(prix),
      image,
      category: categorie,
      quantity: 1,
    }));
    showSuccessToast("Produit ajouté au panier !");

    // Sync with backend
    try {
      if (sessionId) {
        await panierService.addItem({
          sessionId,
          articleId: data.id,
          quantite: 1,
        });
      }
    } catch {
      // Backend sync failed silently - local cart still works
    }
  };

  const isInWishlist = () => {
    return wishlistItems.some((item: any) => item.id === data.id);
  };

  const handleWishlist = () => {
    if (!isInWishlist()) {
      dispatch(addWishlist({
        id: data.id,
        nom,
        prix: Number(prix),
        image,
        category: categorie,
      }));
      showSuccessToast("Ajouté aux favoris !", { icon: false });
    } else {
      dispatch(removeWishlist(data.id));
      showSuccessToast("Retiré des favoris !", { icon: false });
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div
        className="gi-product-content"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="gi-product-inner"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #f0f0f0",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Image carrée uniforme */}
          <div className="gi-pro-image-outer" style={{ flexShrink: 0 }}>
            <div className="gi-pro-image" style={{ position: "relative" }}>
              <Link href={`/product-left-sidebar/?id=${data.id}`} className="image">
                <div
                  style={{
                    width: "100%",
                    paddingTop: "100%", // ratio 1:1 carré
                    position: "relative",
                    overflow: "hidden",
                    background: "#f8f8f8",
                  }}
                >
                  <img
                    className="main-image"
                    src={image}
                    alt={nom}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Link>
              <div className="gi-pro-actions">
                <button
                  onClick={handleWishlist}
                  className={"gi-btn-group wishlist " + (isInWishlist() ? "active" : "")}
                  title="Favoris"
                >
                  <i className="fi-rr-heart"></i>
                </button>
                <button
                  className="gi-btn-group quickview gi-cart-toggle"
                  title="Aperçu"
                  onClick={handleShow}
                >
                  <i className="fi-rr-eye"></i>
                </button>
                <button
                  title="Ajouter au panier"
                  className="gi-btn-group add-to-cart"
                  onClick={handleCart}
                >
                  <i className="fi-rr-shopping-basket"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Contenu texte */}
          <div
            className="gi-pro-content"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "12px",
            }}
          >
            {categorie && (
              <Link
                href={`/boutique/?cat=${(categorie || "")
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()}`}
              >
                <h6 className="gi-pro-stitle" style={{ marginBottom: "4px" }}>
                  {categorie}
                </h6>
              </Link>
            )}
            <h5
              className="gi-pro-title"
              style={{
                flex: 1,
                fontSize: "0.92rem",
                marginBottom: "6px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              <Link href={`/product-left-sidebar/?id=${data.id}`}>{nom}</Link>
            </h5>
            <div className="gi-pro-rat-price" style={{ marginTop: "auto" }}>
              <span className="gi-price">
                <span className="new-price" style={{ fontWeight: 700, color: "#e50914" }}>
                  {Number(prix).toLocaleString("fr-FR")} F
                </span>
                {data.prixPromo && data.prix && (
                  <span
                    className="old-price"
                    style={{
                      textDecoration: "line-through",
                      color: "#aaa",
                      fontSize: "0.82rem",
                      marginLeft: "6px",
                    }}
                  >
                    {Number(data.prix).toLocaleString("fr-FR")} F
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        <QuickViewModal show={show} onClose={handleClose} product={{ nom, prix, image, description }} />
      </div>
    </>
  );
};

export default ItemCard;
