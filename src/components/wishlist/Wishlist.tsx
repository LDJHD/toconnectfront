"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addItem } from "../../store/reducers/cartSlice";
import { Col, Row } from "react-bootstrap";
import { removeWishlist } from "@/store/reducers/wishlistSlice";
import { showSuccessToast } from "../toast-popup/Toastify";
import Link from "next/link";

const Wishlist = () => {
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const dispatch = useDispatch();

  const handleRemoveFromwishlist = (id: number) => {
    dispatch(removeWishlist(id));
  };

  const handleCart = (data: any) => {
    dispatch(addItem({
      id: data.id,
      nom: data.nom || data.title || "",
      prix: Number(data.prix || data.newPrice || 0),
      image: data.image || "",
      category: data.category || "",
      quantity: 1,
    }));
    showSuccessToast("Produit ajouté au panier !");
  };

  return (
    <section className="gi-faq padding-tb-40 gi-wishlist">
      <div className="container">
        <div className="section-title-2">
          <h2 className="gi-title">
            Ma <span>Liste de souhaits</span>
          </h2>
          <p>Vos produits favoris en un seul endroit.</p>
        </div>
        {wishlistItems.length === 0 ? (
          <h4 className="text-center">Votre liste de souhaits est vide.</h4>
        ) : (
          <Row>
            <Col md={12}>
              <div className="gi-vendor-dashboard-card">
                <div className="gi-vendor-card-header">
                  <h5>Favoris</h5>
                  <div className="gi-header-btn">
                    <Link className="gi-btn-2" href="/shop-left-sidebar-col-3">
                      Voir la boutique
                    </Link>
                  </div>
                </div>
                <div className="gi-vendor-card-body">
                  <div className="gi-vendor-card-table">
                    <table className="table gi-table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Image</th>
                          <th scope="col">Nom</th>
                          <th scope="col">Prix</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="wish-empt">
                        {wishlistItems.map((data: any, index: number) => (
                          <tr key={index} className="pro-gl-content">
                            <td scope="row"><span>{index + 1}</span></td>
                            <td>
                              <img className="prod-img" src={data.image || "/assets/img/common/about.png"} alt="" />
                            </td>
                            <td><span>{data.nom || data.title}</span></td>
                            <td><span>{Number(data.prix || data.newPrice || 0).toLocaleString("fr-FR")} F</span></td>
                            <td>
                              <span className="tbl-btn">
                                <a className="gi-btn-2 add-to-cart" title="Ajouter au panier" onClick={() => handleCart(data)} style={{ cursor: "pointer" }}>
                                  <i className="fi-rr-shopping-basket"></i>
                                </a>
                                <a onClick={() => handleRemoveFromwishlist(data.id)} className="gi-btn-1 gi-remove-wish btn" href="#" title="Retirer">
                                  x
                                </a>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
