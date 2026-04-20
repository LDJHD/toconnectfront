"use client";
import React from "react";
import Link from "next/link";
import CurrentLocation from "./CurrentLocation";

function HeaderManu() {
  return (
    <>
      <div className="gi-header-cat d-none d-lg-block">
        <div className="container position-relative">
          <div className="gi-nav-bar">
            {/* Main Menu */}
            <div id="gi-main-menu-desk" className="d-none d-lg-block sticky-nav" style={{ width: "100%" }}>
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="gi-main-menu">
                      <ul>
                        <li className="non-drop">
                          <Link href="/">
                            <i className="fi-rr-home"></i> Accueil
                          </Link>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="/abonnements" className="dropdown-arrow">
                            Abonnements<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            <li>
                              <Link href="/abonnements/?plateforme=Netflix">Netflix</Link>
                            </li>
                            <li>
                              <Link href="/abonnements/?plateforme=Prime Video">Prime Video</Link>
                            </li>
                            <li>
                              <Link href="/abonnements/?plateforme=Spotify">Spotify</Link>
                            </li>
                            <li>
                              <Link href="/abonnements/?plateforme=GogoFlix">GogoFlix</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="/boutique/" className="dropdown-arrow">
                            Boutique<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            <li>
                              <Link href="/boutique/?cat=supermarche">Supermarche</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=vetement">Vetement</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=chaussure">Chaussure</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=accessoire">Accessoire</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=alimentation">Alimentation</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=restauration">Restauration</Link>
                            </li>
                            <li>
                              <Link href="/boutique/?cat=cosmetique">Cosmetique</Link>
                            </li>
                             <li>
                              <Link href="/boutique/?cat=appartement">Appartement</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="non-drop">
                          <Link href="/composer-pack">
                            <i className="fi-rr-box-open"></i> Composer mon Pack
                          </Link>
                        </li>
                        <li className="non-drop">
                          <Link href="/contact-us">
                            <i className="fi-rr-envelope"></i> Contact
                          </Link>
                        </li>
                        <li className="non-drop">
                          <Link href="/about-us">
                            A propos
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderManu;
