"use client";
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  FaEnvelope,
  FaMobileAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import api from "@/lib/api";

const Contact = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    try {
      // Send contact message via WhatsApp link + email to admin
      const whatsappMsg = encodeURIComponent(
        `Nouveau message de contact TO CONNECT:\n\nNom: ${formData.nom}\nEmail: ${formData.email}\nTel: ${formData.telephone}\n\nMessage:\n${formData.message}`
      );
      window.open(`https://wa.me/22967357728?text=${whatsappMsg}`, "_blank");

      showSuccessToast("Message envoye avec succes ! Nous vous repondrons bientot.");
      setFormData({ nom: "", email: "", telephone: "", message: "" });
      setValidated(false);
    } catch (err) {
      showErrorToast("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="gi-contact padding-tb-40">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Nous <span style={{ color: "#e50914" }}>Contacter</span>
            </h2>
            <p>
              Une question, un besoin ou une preoccupation ? N'hesitez pas a nous ecrire.
              Nous vous repondrons dans les plus brefs delais.
            </p>
          </div>
          <Row className="gi-contact-detail m-tb-minus-12">
            <Col sm={6} lg={4} className="p-tp-12">
              <div className="gi-box">
                <div className="detail">
                  <div className="icon">
                    <i className="fa fa-envelope" aria-hidden="true">
                      <FaEnvelope />
                    </i>
                  </div>
                  <div className="info">
                    <h3 className="title">Email</h3>
                    <p>
                      <i className="fa fa-envelope" aria-hidden="true">
                        <FaEnvelope />
                      </i>{" "}
                      &nbsp; lordjhd7@gmail.com
                    </p>
                  </div>
                </div>
                <div className="space"></div>
              </div>
            </Col>

            <Col sm={6} lg={4} className="p-tp-12">
              <div className="gi-box">
                <div className="detail">
                  <div className="icon">
                    <i className="fa fa-mobile" aria-hidden="true">
                      <FaMobileAlt />
                    </i>
                  </div>
                  <div className="info">
                    <h3 className="title">WhatsApp & Telephone</h3>
                    <p>
                      <i className="fa fa-mobile" aria-hidden="true">
                        <FaMobileAlt />
                      </i>{" "}
                      &nbsp; +229 67 35 77 28
                    </p>
                  </div>
                </div>
                <div className="space"></div>
              </div>
            </Col>

            <Col sm={6} lg={4} className="p-tp-12 m-auto">
              <div className="gi-box">
                <div className="detail">
                  <div className="icon">
                    <i className="fa fa-map-marker" aria-hidden="true">
                      <FaMapMarkerAlt />
                    </i>
                  </div>
                  <div className="info">
                    <h3 className="title">Adresse</h3>
                    <p>
                      <i className="fa fa-map-marker" aria-hidden="true">
                        <FaMapMarkerAlt />
                      </i>{" "}
                      &nbsp; Cotonou, Benin
                    </p>
                  </div>
                </div>
                <div className="space"></div>
              </div>
            </Col>
          </Row>
          <Row className="p-t-80">
            <Col md={6}>
              <div
                style={{
                  background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                  borderRadius: "16px",
                  padding: "40px 30px",
                  color: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3 style={{ fontWeight: 700, marginBottom: "15px" }}>
                  TO CONNECT
                </h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: "25px" }}>
                  Votre plateforme d'abonnements streaming et boutique en ligne.
                  Nous sommes a votre disposition pour toute question.
                </p>
                <a
                  href="https://wa.me/22967357728"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#e50914",
                    color: "#fff",
                    padding: "12px 25px",
                    borderRadius: "30px",
                    textDecoration: "none",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  <i className="fi fi-brands-whatsapp"></i>
                  Ecrire sur WhatsApp
                </a>
              </div>
            </Col>
            <Col md={6}>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom complet"
                    required
                    style={{ padding: "12px 15px", borderRadius: "10px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer votre nom.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Adresse email"
                    required
                    style={{ padding: "12px 15px", borderRadius: "10px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer un email valide.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Numero WhatsApp / Telephone"
                    required
                    style={{ padding: "12px 15px", borderRadius: "10px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer votre numero.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <textarea
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Votre message..."
                    required
                    style={{ padding: "12px 15px", borderRadius: "10px" }}
                  ></textarea>
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer votre message.
                  </Form.Control.Feedback>
                </Form.Group>
                <button
                  type="submit"
                  className="gi-btn-2"
                  disabled={loading}
                  style={{
                    background: "#e50914",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "10px",
                    fontWeight: 600,
                  }}
                >
                  {loading && <span className="spinner-border spinner-border-sm me-2" />}
                  Envoyer le message
                </button>
              </Form>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Contact;
