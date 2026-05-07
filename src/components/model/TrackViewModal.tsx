"use client";

const TrackViewModal = ({ show, onClose, order }: any) => {
  if (!show) return null;
  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: "16px" }}>
          <div className="modal-header" style={{ borderBottom: "1px solid #eee" }}>
            <h5 className="modal-title" style={{ fontWeight: 700 }}>Suivi de commande</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ padding: "25px" }}>
            {order ? (
              <div>
                <p><strong>Commande :</strong> {order.numero || order.id}</p>
                <p><strong>Statut :</strong> {order.statut || "En attente"}</p>
              </div>
            ) : (
              <p>Aucune information disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackViewModal;
