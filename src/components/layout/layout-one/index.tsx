"use client";
import Footer from "./Footer";
import Header from "./Header";
import Toastify from "../../toast-popup/Toastify";
import { useEffect } from "react";

function LayoutOne({ children }) {
  useEffect(() => {
    const cssFilePath = "/assets/css/demo-1.css";
    const link = document.createElement("link");
    link.href = cssFilePath;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <Header />
      {children}
      <a
        href="https://wa.me/22967357728"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        title="Contacter sur WhatsApp"
        style={{
          position: "fixed",
          right: "18px",
          bottom: "22px",
          width: "56px",
          height: "56px",
          borderRadius: "999px",
          background: "#25D366",
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
          zIndex: 1200,
          textDecoration: "none",
          fontSize: "28px",
        }}
      >
        <i className="fi fi-brands-whatsapp" />
      </a>
      <Footer />
      <Toastify />
    </>
  );
}

export default LayoutOne;
