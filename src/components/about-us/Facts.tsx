"use client";

const Facts = () => {
  const facts = [
    { number: "500+", label: "Abonnés actifs" },
    { number: "4", label: "Plateformes streaming" },
    { number: "7", label: "Catégories boutique" },
    { number: "24/7", label: "Support WhatsApp" },
  ];

  return (
    <section style={{ padding: "60px 0", background: "linear-gradient(135deg, #1a1a2e 0%, #e50914 100%)" }}>
      <div className="container">
        <div className="row text-center">
          {facts.map((f, i) => (
            <div key={i} className="col-6 col-md-3" style={{ marginBottom: "24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "2.5rem", color: "#fff" }}>{f.number}</h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facts;
