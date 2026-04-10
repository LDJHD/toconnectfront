"use client";

import { Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";

const services = [
  { icon: "fi-rr-shopping-cart", name: "Livraison rapide", title: "Livraison à Cotonou et environs" },
  { icon: "fi-rr-shield-check", name: "Paiement sécurisé", title: "Transactions via FedAPI" },
  { icon: "fi-rr-headset", name: "Support 24/7", title: "WhatsApp & Email" },
  { icon: "fi-rr-bolt", name: "Accès instantané", title: "Abonnements activés en quelques minutes" },
];

const Services = () => {
  return (
    <section className="gi-service-section padding-tb-40">
      <div className="container">
        <Row className="m-tb-minus-12">
          {services.map((item, index) => (
            <Fade
              triggerOnce
              direction="up"
              delay={400}
              key={index}
              className="gi-ser-content gi-ser-content-2 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp"
            >
              <div className="gi-ser-inner">
                <div className="gi-service-image">
                  <i className={item.icon} style={{ color: "#e50914" }}></i>
                </div>
                <div className="gi-service-desc">
                  <h3>{item.name}</h3>
                  <p>{item.title}</p>
                </div>
              </div>
            </Fade>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Services;
