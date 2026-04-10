"use client";

import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import Spinner from "../button/Spinner";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addItem } from "@/store/reducers/cartSlice";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { showSuccessToast } from "../toast-popup/Toastify";
import { articlesService } from "@/lib/services/articles";
import { panierService } from "@/lib/services/panier";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getMainImage = (product: any) => {
  if (product?.images?.length) {
    const main = product.images.find((img: any) => img.principal) || product.images[0];
    const url = main.imageUrl || main.image_url;
    return url ? `${BACKEND_URL}${url}` : "/assets/img/common/about.png";
  }
  return product?.image || "/assets/img/common/about.png";
};

const ProductPage = ({
  order = "",
  lg = 12,
}) => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.wishlist);
  const sessionId = useSelector((state: RootState) => state.cart.sessionId);

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }
    
    const fetchProduct = async () => {
      try {
        const res = await articlesService.getById(Number(productId))
        const article = res.data?.article || res.data
        if (article?.id) {
          setProduct(article)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId])

  if (loading) return <Spinner />;
  if (!product) return (
    <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
      <h4>Produit non trouvé</h4>
      <Link href="/shop-left-sidebar-col-3/" style={{ color: "#e50914" }}>Retour à la boutique</Link>
    </div>
  );

  const handleCart = async () => {
    const prix = product.prixPromo || product.prix;
    dispatch(addItem({
      id: product.id,
      nom: product.nom,
      prix: Number(prix),
      image: getMainImage(product),
      category: product.category?.nom || "",
      quantity,
    }));
    showSuccessToast("Produit ajouté au panier !");

    try {
      if (sessionId) {
        await panierService.addItem({ sessionId, articleId: product.id, quantite: quantity });
      }
    } catch {}
  };

  const isInWishlist = wishlistItems.some((item: any) => item.id === product.id);

  const handleWishlist = () => {
    if (!isInWishlist) {
      dispatch(addWishlist({
        id: product.id,
        nom: product.nom,
        prix: Number(product.prixPromo || product.prix),
        image: getMainImage(product),
        category: product.category?.nom || "",
      }));
      showSuccessToast("Ajouté aux favoris !", { icon: false });
    } else {
      dispatch(removeWishlist(product.id));
      showSuccessToast("Retiré des favoris !", { icon: false });
    }
  };

  return (
    <Col lg={lg} md={12} className={`gi-pro-rightside gi-common-rightside ${order}`}>
      <div className="single-pro-block">
        <div className="single-pro-inner">
          <div className="row">
            <div className="col-md-5">
              <div style={{ borderRadius: "12px", overflow: "hidden" }}>
                <img
                  src={getMainImage(product)}
                  alt={product.nom}
                  style={{ width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-md-7" style={{ paddingLeft: "30px" }}>
              <div className="single-pro-content">
                {product.category?.nom && (
                  <Link href={`/shop-left-sidebar-col-3/?cat=${product.category.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`} style={{ color: "#e50914", fontSize: "0.9rem", textTransform: "uppercase" }}>
                    {product.category.nom}
                  </Link>
                )}
                <h5 className="gi-single-title" style={{ fontWeight: 700, fontSize: "1.5rem", margin: "10px 0" }}>
                  {product.nom}
                </h5>
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ color: "#e50914", fontSize: "1.5rem", fontWeight: 700 }}>
                    {Number(product.prixPromo || product.prix).toLocaleString("fr-FR")} F
                  </span>
                  {product.prixPromo && (
                    <span style={{ fontSize: "1rem", color: "#999", textDecoration: "line-through", marginLeft: "10px" }}>
                      {Number(product.prix).toLocaleString("fr-FR")} F
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: product.stock > 0 ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                    {product.stock > 0 ? "En stock" : "Rupture de stock"}
                  </span>
                </div>
                {product.description && (
                  <div style={{ color: "#666", marginBottom: "20px" }}>
                    {product.description}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "8px" }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: "none", background: "none", padding: "8px 15px", fontSize: "1.2rem", cursor: "pointer" }}>-</button>
                    <span style={{ padding: "8px 15px", fontWeight: 700 }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ border: "none", background: "none", padding: "8px 15px", fontSize: "1.2rem", cursor: "pointer" }}>+</button>
                  </div>
                  <button onClick={handleCart} style={{ background: "#e50914", color: "#fff", border: "none", padding: "10px 25px", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                    Ajouter au panier
                  </button>
                  <button onClick={handleWishlist} style={{ background: isInWishlist ? "#e50914" : "#f5f5f5", color: isInWishlist ? "#fff" : "#333", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer" }}>
                    <i className="fi-rr-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductPage;
