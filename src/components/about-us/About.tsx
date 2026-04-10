import React from "react";
import { Col, Row } from "react-bootstrap";

const About = () => {
  return (
    <>
      <section className="gi-about padding-tb-40">
        <div className="container">
          <Row>
            <Col xl={6} md={12}>
              <div className="gi-about-img">
                <img
                  src={
                    process.env.NEXT_PUBLIC_URL + "/assets/img/common/heroimage2.jpg"
                  }
                  className="v-img"
                  alt="about"
                />
                <img
                  src={
                    process.env.NEXT_PUBLIC_URL +
                    "/assets/img/common/restauration.jpg"
                  }
                  className="h-img"
                  alt="about"
                />
                <img
                  src={
                    process.env.NEXT_PUBLIC_URL +
                    "/assets/img/common/boutique.jpg"
                  }
                  className="h-img"
                  alt="about"
                />
              </div>
            </Col>
            <Col xl={6} md={12}>
              <div className="gi-about-detail">
                <div className="section-title">
                  <h2>
                    Qui sommes-<span style={{ color: "#e50914" }}>nous ?</span>
                  </h2>
                  <p>
                    Nous sommes là pour vous offrir les meilleurs produits et services.
                    Enrichir votre quotidien avec l'essentiel.
                  </p>
                </div>
                <p>
                  <strong>TOCONNECT</strong> est votre plateforme de confiance pour tous vos besoins.
                  Que vous cherchiez des produits d'alimentation, des vêtements,
                  des chaussures, des accessoires ou des articles de косmétique,
                  nous avons tout ce qu'il vous faut.
                </p>
                <p>
                  Nous proposons également des <strong>abonnements streaming</strong> pour profiter
                  de vos plateformes préférées au meilleur prix, ainsi que des
                  <strong> packs personnalisés</strong> pour composer votre offre idéale.
                </p>
                <p>
                  Notre engagement : vous offrir une expérience d'achat simple,
                  rapide et sécurisée. Avec notre service client disponible et
                  nos livraison rapide, votre satisfaction est notre priorité.
                </p>
                <p>
                  Découvrez notre large gamme de produits et laissez-vous tenter
                  par nos offres exclusives. Bienvenue chez <strong>TOCONNECT</strong> -
                  votre partenaire au quotidien.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default About;
