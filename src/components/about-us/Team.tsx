"use client";

const Team = () => {
  return (
    <section style={{ padding: "60px 0" }}>
      <div className="container text-center">
        <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: "15px" }}>Notre Équipe</h2>
        <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto 30px" }}>
          Une équipe passionnée basée à Cotonou, dédiée à vous offrir le meilleur du streaming et du e-commerce au Bénin.
        </p>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "500px", margin: "0 auto" }}>
          <h5 style={{ fontWeight: 700, marginBottom: "10px" }}>TO CONNECT TV</h5>
          <p style={{ color: "#666", marginBottom: "5px" }}>Cotonou, Bénin</p>
          <p style={{ color: "#666", marginBottom: "5px" }}>+229 67 35 77 28</p>
          <p style={{ color: "#e50914" }}>lordjhd7@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default Team;
