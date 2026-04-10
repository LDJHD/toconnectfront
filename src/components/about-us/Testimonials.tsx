"use client";

const Testimonials = () => {
  const testimonials = [
    { name: "Kofi A.", text: "Grâce à TO CONNECT TV, j'ai accès à Netflix et Spotify à des prix imbattables. Service rapide et fiable !", rating: 5 },
    { name: "Aminata D.", text: "La boutique en ligne est super pratique. Livraison rapide à Cotonou !", rating: 5 },
    { name: "Jean-Marc T.", text: "Le pack alimentaire est une excellente idée. Je compose mon panier chaque semaine.", rating: 4 },
  ];

  return (
    <section style={{ padding: "60px 0", background: "#f9f9f9" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: "40px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "2rem" }}>Ce que disent nos clients</h2>
          <p style={{ color: "#666" }}>La satisfaction de nos clients est notre priorité</p>
        </div>
        <div className="row">
          {testimonials.map((t, i) => (
            <div key={i} className="col-md-4" style={{ marginBottom: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "25px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", height: "100%" }}>
                <div style={{ color: "#f5a623", marginBottom: "10px" }}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p style={{ color: "#555", fontStyle: "italic", marginBottom: "15px" }}>"{t.text}"</p>
                <strong style={{ color: "#e50914" }}>{t.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
