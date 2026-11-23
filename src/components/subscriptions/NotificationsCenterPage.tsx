"use client";

import { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { notificationsService, NotificationItem } from "@/lib/services/notifications";

function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await notificationsService.getMesNotifications();
      setNotifications(res?.data || []);
      setUnread(res?.nonLues ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Impossible de charger vos notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkOne = async (id: number) => {
    try {
      await notificationsService.marquerLue(id);
      await load();
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
    try {
      await notificationsService.marquerToutesLues();
      await load();
    } catch { /* ignore */ }
  };

  return (
    <>
      <Breadcrumb title={"Mes notifications"} />
      <section style={{ padding: "40px 0 60px" }}>
        <Container>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ fontWeight: 700, margin: 0 }}>
                Mes <span style={{ color: "#e50914" }}>notifications</span>
                {unread > 0 && (
                  <span style={{ background: "#e50914", color: "#fff", fontSize: "0.8rem", fontWeight: 700, borderRadius: "12px", padding: "2px 10px", marginLeft: "10px", verticalAlign: "middle" }}>
                    {unread} non lues
                  </span>
                )}
              </h2>
              {notifications.length > 0 && unread > 0 && (
                <button onClick={handleMarkAll} style={{ background: "#111827", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center" style={{ padding: "60px" }}>
                <div className="spinner-border text-danger" role="status" />
              </div>
            ) : error ? (
              <div style={{ background: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px" }}>{error}</div>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <i className="fi-rr-bell" style={{ fontSize: "2.5rem", display: "block", marginBottom: "15px" }}></i>
                <p>Aucune notification pour le moment.</p>
              </div>
            ) : (
              <Fade triggerOnce duration={400}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        background: n.lue ? "#fff" : "#fff6f6",
                        border: `1px solid ${n.lue ? "#eee" : "#fecaca"}`,
                        borderRadius: "12px",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                        <div>
                          {n.titre && (
                            <h5 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0, color: "#111827" }}>{n.titre}</h5>
                          )}
                          <span style={{ color: "#999", fontSize: "0.75rem" }}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleString("fr-FR") : ""}
                            {n.type ? ` • ${n.type}` : ""}
                          </span>
                        </div>
                        {!n.lue && (
                          <button
                            onClick={() => handleMarkOne(n.id)}
                            style={{ background: "#f0f7ff", border: "none", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", color: "#2563eb", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                      <div style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                        {n.message}
                      </div>
                      {n.lien && (
                        <div style={{ marginTop: "10px" }}>
                          <a href={n.lien} target="_blank" rel="noopener noreferrer" style={{ color: "#e50914", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                            Ouvrir →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Fade>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

export default NotificationsCenterPage;