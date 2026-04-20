"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";

const OrderPage = () => {
  const orders = useSelector((state: RootState) => state.cart.orders);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("fr-FR"));
  }, []);

  const pendingOrders = orders.filter((o: any) => o.status === "En attente" || o.status === "Pending");
  const completedOrders = orders.filter((o: any) => o.status === "Completed" || o.status === "Livree");

  return (
    <>
      <section className="gi-faq padding-tb-40 gi-wishlist">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Mes <span>Commandes</span>
            </h2>
            <p>Suivez vos commandes en temps reel.</p>
          </div>
          <Row>
            <Col md={12}>
              <div className="gi-vendor-dashboard-card">
                <div className="gi-vendor-card-header">
                  <h5>Commandes en cours</h5>
                  <div className="gi-header-btn">
                    <Link className="gi-btn-2" href="/boutique">
                      Boutique
                    </Link>
                  </div>
                </div>
                <div className="gi-vendor-card-body">
                  <div className="gi-vendor-card-table">
                    <table className="table gi-table">
                      <thead>
                        <tr>
                          <th scope="col">N de commande</th>
                          <th scope="col">Articles</th>
                          <th scope="col">Date</th>
                          <th scope="col">Total</th>
                          <th scope="col">Statut</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody className="wish-empt">
                        {pendingOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center">
                              <span>Aucune commande en cours</span>
                            </td>
                          </tr>
                        ) : (
                          pendingOrders.map((data: any, index: number) => (
                            <tr key={index} className="pro-gl-content">
                              <td><span>{data.orderId}</span></td>
                              <td><span>{data.totalItems}</span></td>
                              <td><span>{currentDate}</span></td>
                              <td><span>{Number(data.totalPrice).toLocaleString("fr-FR")} F</span></td>
                              <td><span className="avl">{data.status}</span></td>
                              <td>
                                <Link href={"/orders/" + data.orderId} className="gi-btn-2" style={{ padding: "5px 15px" }}>
                                  Voir
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      {completedOrders.length > 0 && (
        <section className="gi-faq padding-tb-40 gi-wishlist">
          <div className="container">
            <Row>
              <Col md={12}>
                <div className="gi-vendor-dashboard-card">
                  <div className="gi-vendor-card-header">
                    <h5>Commandes terminees</h5>
                  </div>
                  <div className="gi-vendor-card-body">
                    <div className="gi-vendor-card-table">
                      <table className="table gi-table">
                        <thead>
                          <tr>
                            <th scope="col">N de commande</th>
                            <th scope="col">Articles</th>
                            <th scope="col">Total</th>
                            <th scope="col">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedOrders.map((data: any, index: number) => (
                            <tr key={index}>
                              <td><span>{data.orderId}</span></td>
                              <td><span>{data.totalItems}</span></td>
                              <td><span>{Number(data.totalPrice).toLocaleString("fr-FR")} F</span></td>
                              <td><span className="out">Terminee</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      )}
    </>
  );
};

export default OrderPage;
