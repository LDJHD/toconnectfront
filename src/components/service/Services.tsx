"use client";

import { Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";

const services = [
  { icon: "fi-rr-package", name: "Livraison rapide", title: "À Cotonou et ses environs" },
  { icon: "fi-rr-shield-check", name: "Paiement sécurisé", title: "Transactions 100 % fiables" },
  { icon: "fi-rr-headset", name: "Support 24/7", title: "WhatsApp & Email" },
  { icon: "fi-rr-bolt", name: "Accès instantané", title: "Abonnements activés en minutes" },
];

const Services = () => {
  return (
    <section style={{ padding: "64px 0", background: "#ffffff" }}>
      <div className="container">
        <Row className="g-3 g-md-4">
          {services.map((item, index) => (
            <div key={index} className="col-sm-6 col-md-6 col-lg-3 grid-col">
              <Fade triggerOnce direction="up" delay={index * 80} className="h-100">
                <div className="ser-card">
                  <div className="ser-icon">
                    <i className={item.icon}></i>
                  </div>
                  <h5>{item.name}</h5>
                  <p>{item.title}</p>
                </div>
              </Fade>
            </div>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Services;