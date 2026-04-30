"use client";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import ScrollButton from "../../button/ScrollButton";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function Footer() {
  const [dropdownState, setDropdownState] = useState(null);

  const toggleDropdown = (dropdown: any) => {
    setDropdownState((menu) => (menu === dropdown ? null : dropdown));
  };

  return (
    <>
      <footer className="gi-footer m-t-40">
        <div className="footer-container">
          <div className="footer-top padding-tb-80">
            <div className="container">
              <Row className="m-minus-991">
                <Col sm={12} lg={3}>
                  <Fade duration={400} triggerOnce direction="up" className="gi-footer-cat">
                    <div className="gi-footer-widget gi-footer-company">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                        <img
                          src={process.env.NEXT_PUBLIC_URL + "/assets/img/logo/logo.png"}
                          className="gi-footer-logo"
                          alt="Tkp Store"
                          style={{ maxHeight: "40px" }}
                        />
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e50914" }}>
                       
                        </span>
                      </div>
                      <p className="gi-footer-detail">
                        Votre plateforme d'abonnements streaming et boutique en ligne.
                        Netflix, Prime Video, Spotify et bien plus encore.
                      </p>
                      <div className="gi-app-store">
                        <a href="#" className="app-img">
                          <img
                            src={process.env.NEXT_PUBLIC_URL + "/assets/img/app/android.png"}
                            className="adroid"
                            alt="android"
                          />
                        </a>
                        <a href="#" className="app-img">
                          <img
                            src={process.env.NEXT_PUBLIC_URL + "/assets/img/app/apple.png"}
                            className="apple"
                            alt="apple"
                          />
                        </a>
                      </div>
                    </div>
                  </Fade>
                </Col>
                <Col sm={12} lg={2} className="gi-footer-info">
                  <div className="gi-footer-widget">
                    <h4 onClick={() => toggleDropdown("abonnements")} className="gi-footer-heading">
                      Abonnements
                      <div className="gi-heading-res">
                        <i className="fi-rr-angle-small-down" aria-hidden="true"></i>
                      </div>
                    </h4>
                    <motion.div
                      className="gi-footer-links gi-footer-dropdown"
                      initial={{ height: 0, opacity: 0, translateY: -20 }}
                      animate={{
                        height: dropdownState === "abonnements" ? "auto" : 0,
                        opacity: dropdownState === "abonnements" ? 1 : 0,
                        translateY: dropdownState === "abonnements" ? 0 : -20,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden", display: "block", paddingBottom: dropdownState === "abonnements" ? "20px" : "0px" }}
                    >
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link">
                          <a href="/abonnements?plateforme=Netflix">Netflix</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/abonnements?plateforme=Prime Video">Prime Video</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/abonnements?plateforme=Spotify">Spotify</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/abonnements?plateforme=GogoFlix">GogoFlix</a>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>
                <Col sm={12} lg={2} className="gi-footer-account">
                  <div className="gi-footer-widget">
                    <h4 onClick={() => toggleDropdown("boutique")} className="gi-footer-heading">
                      Boutique
                      <div className="gi-heading-res">
                        <i className="fi-rr-angle-small-down" aria-hidden="true"></i>
                      </div>
                    </h4>
                    <motion.div
                      className="gi-footer-links gi-footer-dropdown"
                      initial={{ height: 0, opacity: 0, translateY: -20 }}
                      animate={{
                        height: dropdownState === "boutique" ? "auto" : 0,
                        opacity: dropdownState === "boutique" ? 1 : 0,
                        translateY: dropdownState === "boutique" ? 0 : -20,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden", display: "block", paddingBottom: dropdownState === "boutique" ? "20px" : "0px" }}
                    >
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link">
                          <a href="/boutique/?cat=supermarche">Supermarche</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/boutique/?cat=vetement">Vetement</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/boutique/?cat=chaussure">Chaussure</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/boutique/?cat=alimentation">Alimentation</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/boutique/?cat=cosmetique">Cosmetique</a>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>
                <Col sm={12} lg={2} className="gi-footer-service">
                  <div className="gi-footer-widget">
                    <h4 onClick={() => toggleDropdown("compte")} className="gi-footer-heading">
                      Mon Compte
                      <div className="gi-heading-res">
                        <i className="fi-rr-angle-small-down" aria-hidden="true"></i>
                      </div>
                    </h4>
                    <motion.div
                      className="gi-footer-links gi-footer-dropdown"
                      initial={{ height: 0, opacity: 0, translateY: -20 }}
                      animate={{
                        height: dropdownState === "compte" ? "auto" : 0,
                        opacity: dropdownState === "compte" ? 1 : 0,
                        translateY: dropdownState === "compte" ? 0 : -20,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden", display: "block", paddingBottom: dropdownState === "compte" ? "20px" : "0px" }}
                    >
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link">
                          <a href="/login">Connexion</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/mes-abonnements">Mes Abonnements</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/orders">Mes Commandes</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/cart">Mon Panier</a>
                        </li>
                        <li className="gi-footer-link">
                          <a href="/contact-us">Nous Contacter</a>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </Col>
                <Col sm={12} lg={3} className="gi-footer-cont-social">
                  <div className="gi-footer-contact">
                    <div className="gi-footer-widget">
                      <h4 onClick={() => toggleDropdown("contact")} className="gi-footer-heading">
                        Contact
                        <div className="gi-heading-res">
                          <i className="fi-rr-angle-small-down" aria-hidden="true"></i>
                        </div>
                      </h4>
                      <motion.div
                        className="gi-footer-links gi-footer-dropdown"
                        initial={{ height: 0, opacity: 0, translateY: -20 }}
                        animate={{
                          height: dropdownState === "contact" ? "auto" : 0,
                          opacity: dropdownState === "contact" ? 1 : 0,
                          translateY: dropdownState === "contact" ? 0 : -20,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden", display: "block", paddingBottom: dropdownState === "contact" ? "20px" : "0px" }}
                      >
                        <ul className="align-itegi-center">
                          <li className="gi-footer-link gi-foo-location">
                            <span>
                              <i className="fi fi-rr-marker location svg_img foo_svg" ></i>
                            </span>
                            <p>Cotonou, Benin</p>
                          </li>
                          <li className="gi-footer-link gi-foo-call">
                            <span>
                              <i className="fi fi-brands-whatsapp svg_img foo_svg" ></i>
                            </span>
                            <a href="https://wa.me/22967357728">+229 67 35 77 28</a>
                          </li>
                          <li className="gi-footer-link gi-foo-mail">
                            <span>
                              <i className="fi fi-rr-envelope" ></i>
                            </span>
                            <a href="mailto:lordjhd7@gmail.com">lordjhd7@gmail.com</a>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                  <div className="gi-footer-social">
                    <div className="gi-footer-widget">
                      <motion.div
                        className="gi-footer-links gi-footer-dropdown"
                        initial={{ height: 0, opacity: 0, translateY: -20 }}
                        animate={{
                          height: dropdownState === "contact" ? "auto" : 0,
                          opacity: dropdownState === "contact" ? 1 : 0,
                          translateY: dropdownState === "contact" ? 0 : -20,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden", display: "block" }}
                      >
                        <ul className="align-itegi-center">
                          <li className="gi-footer-link">
                            <a href="#">
                              <i className="gicon gi-facebook"  aria-hidden="true"></i>
                            </a>
                          </li>
                          <li className="gi-footer-link">
                            <a href="#">
                              <i className="gicon gi-twitter" aria-hidden="true"></i>
                            </a>
                          </li>
                          <li className="gi-footer-link">
                            <a href="https://wa.me/22967357728">
                              <i className="fi fi-brands-whatsapp" aria-hidden="true"></i>
                            </a>
                          </li>
                          <li className="gi-footer-link">
                            <a href="#">
                              <i className="gicon gi-instagram" aria-hidden="true"></i>
                            </a>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="gi-bottom-info">
                  <div className="footer-copy">
                    <div className="footer-bottom-copy">
                      <div className="gi-copy">
                        Copyright &copy; {new Date().getFullYear()}{" "}
                        <Link className="site-name" href="/" style={{ color: "#e50914" }}>
                          Tkp Store
                        </Link>{" "}
                        - Tous droits reserves.
                      </div>
                    </div>
                  </div>
                  <div className="footer-bottom-right">
                    <div className="footer-bottom-payment d-flex justify-content-center">
                      <div className="payment-link">
                        <img
                          src={process.env.NEXT_PUBLIC_URL + "/assets/img/hero-bg/payment.png"}
                          alt="payment"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollButton />
    </>
  );
}

export default Footer;
