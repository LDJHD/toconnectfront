import React from "react";
import Services from "../service/Services";
import { Container, Row } from "react-bootstrap";

const Service = () => {
  return (
    <>
      <section className="gi-service-section padding-tb-40">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Nos <span style={{ color: "#e50914" }}>Services</span>
            </h2>
            <p>
              Notre plateforme regroupe vos abonnements comme Netflix, Prime Video et Spotify, tout en proposant la vente de produits alimentaires, des packs de ravitaillement et des services de restauration. Une solution simple et pratique pour répondre à tous vos besoins au quotidien.
            </p>
          </div>
          <Row className="m-tb-minus-12">
            <Services />
          </Row>
        </div>
      </section>
    </>
  );
};

export default Service;
