"use client";

const QuickViewModal = ({ show, onClose, product }: any) => {
  if (!show) return null;
  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: "16px" }}>
          <div className="modal-header" style={{ borderBottom: "1px solid #eee" }}>
            <h5 className="modal-title" style={{ fontWeight: 700 }}>
              {product?.nom || "Apercu produit"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ padding: "25px" }}>
            {product ? (
              <div className="row">
                <div className="col-md-6">
                  <img
                    src={product.image || "/assets/img/common/about.png"}
                    alt={product.nom}
                    style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <h4 style={{ fontWeight: 700 }}>{product.nom}</h4>
                  <p style={{ color: "#e50914", fontSize: "1.3rem", fontWeight: 700 }}>
                    {Number(product.prix).toLocaleString("fr-FR")} F
                  </p>
                  <p style={{ color: "#666" }}>{product.description}</p>
                </div>
              </div>
            ) : (
              <p>Produit non disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
