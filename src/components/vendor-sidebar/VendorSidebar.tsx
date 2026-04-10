"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

const VendorSidebar = () => {
  const user = useSelector((state: RootState) => state.registration);

  return (
    <div className="col-lg-3 col-md-12 mb-24">
      <div className="gi-vendor-sidebar" style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div className="gi-vendor-sidebar-heading" style={{ marginBottom: "15px" }}>
          <h5 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Mon Compte</h5>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/user-profile" style={{ color: "#333", textDecoration: "none" }}>
              Mon Profil
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/mes-abonnements" style={{ color: "#333", textDecoration: "none" }}>
              Mes Abonnements
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/track-order" style={{ color: "#333", textDecoration: "none" }}>
              Mes Commandes
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/wishlist" style={{ color: "#333", textDecoration: "none" }}>
              Ma Liste de souhaits
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorSidebar;
