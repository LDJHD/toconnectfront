"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/services/admin";

type View = "login" | "forgot" | "code" | "newpass";

function AdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await adminService.login({ email, password });
      const data = res.data;
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_data", JSON.stringify(data.admin));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError("Veuillez entrer votre email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminService.forgotPassword(forgotEmail);
      setSuccess("Code envoye a votre email");
      setView("code");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Veuillez entrer le code a 6 chiffres");
      return;
    }
    setError("");
    setView("newpass");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminService.resetPassword({
        email: forgotEmail,
        code,
        nouveauMotDePasse: newPassword,
      });
      setSuccess("Mot de passe modifie avec succes !");
      setTimeout(() => {
        setView("login");
        setSuccess("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de la reinitialisation");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    setSuccess("");
    if (view === "code") setView("forgot");
    else if (view === "newpass") setView("code");
    else setView("login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "#e50914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            <i className={view === "login" ? "fi-rr-lock" : "fi-rr-key"}></i>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "5px" }}>
            {view === "login" && "Administration"}
            {view === "forgot" && "Mot de passe oublie"}
            {view === "code" && "Verification"}
            {view === "newpass" && "Nouveau mot de passe"}
          </h2>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            {view === "login" && "TO CONNECT"}
            {view === "forgot" && "Entrez votre email pour recevoir un code"}
            {view === "code" && `Code envoye a ${forgotEmail}`}
            {view === "newpass" && "Choisissez votre nouveau mot de passe"}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {success}
          </div>
        )}

        {/* LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@toconnecttv.com"
                className="form-control"
                style={{ padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.95rem", width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="form-control"
                style={{ padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.95rem", width: "100%" }}
              />
            </div>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => { setView("forgot"); setError(""); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e50914",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mot de passe oublie ?
              </button>
            </div>
            <SubmitButton loading={loading} text="Se connecter" />
          </form>
        )}

        {/* FORGOT - Email */}
        {view === "forgot" && (
          <form onSubmit={handleForgot}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Email du compte admin
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@email.com"
                className="form-control"
                style={{ padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.95rem", width: "100%" }}
              />
            </div>
            <SubmitButton loading={loading} text="Envoyer le code" />
            <BackButton onClick={goBack} />
          </form>
        )}

        {/* CODE */}
        {view === "code" && (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Code de verification
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="form-control"
                maxLength={6}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  border: "2px solid #eee",
                  fontSize: "1.8rem",
                  width: "100%",
                  textAlign: "center",
                  letterSpacing: "10px",
                  fontWeight: 800,
                }}
              />
              <small style={{ color: "#999", display: "block", textAlign: "center", marginTop: "8px" }}>
                Entrez le code a 6 chiffres recu par email
              </small>
            </div>
            <SubmitButton loading={false} text="Verifier" />
            <BackButton onClick={goBack} />
          </form>
        )}

        {/* NEW PASSWORD */}
        {view === "newpass" && (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 caracteres"
                className="form-control"
                style={{ padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.95rem", width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", color: "#333" }}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez le mot de passe"
                className="form-control"
                style={{ padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.95rem", width: "100%" }}
              />
            </div>
            <SubmitButton loading={loading} text="Reinitialiser" />
            <BackButton onClick={goBack} />
          </form>
        )}
      </div>
    </div>
  );
}

function SubmitButton({ loading, text }: { loading: boolean; text: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        background: "#e50914",
        color: "#fff",
        border: "none",
        padding: "14px",
        borderRadius: "12px",
        fontWeight: 700,
        fontSize: "1rem",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "all 0.3s ease",
      }}
    >
      {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
      {text}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        padding: "12px",
        color: "#666",
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      Retour
    </button>
  );
}

export default AdminLoginPage;
