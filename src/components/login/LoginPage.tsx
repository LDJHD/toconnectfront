"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { Container, Form } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/reducers/registrationSlice";
import { RootState } from "@/store";
import { authService } from "@/lib/services/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestCode = async (e: any) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showErrorToast("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    try {
      await authService.requestCode(email);
      showSuccessToast("Code de verification envoye a votre email !");
      setStep("code");
      setCountdown(60);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de l'envoi du code";
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: any) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      showErrorToast("Veuillez entrer le code de verification");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyCode(email, code);
      const data = res.data || res;

      // Store auth data
      const userData = {
        email,
        token: data.token,
        utilisateur: data.utilisateur || data.user,
        ...data,
      };
      localStorage.setItem("login_user", JSON.stringify(userData));
      localStorage.setItem("auth_token", data.token);

      dispatch(login(userData));
      showSuccessToast("Connexion reussie !");
      router.push("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Code invalide ou expire";
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await authService.requestCode(email);
      showSuccessToast("Nouveau code envoye !");
      setCountdown(60);
    } catch (err: any) {
      showErrorToast("Erreur lors du renvoi du code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Connexion"} />
      <section className="gi-login padding-tb-40">
        <Container>
          <div className="section-title-2">
            <h2 className="gi-title">
              Connexion<span></span>
            </h2>
            <p>
              {step === "email"
                ? "Entrez votre email pour recevoir un code de verification"
                : "Entrez le code de verification envoye a votre email"}
            </p>
          </div>
          <div className="gi-login-content">
            <div className="gi-login-box">
              <div className="gi-login-wrapper">
                <div className="gi-login-container">
                  <div className="gi-login-form">
                    {step === "email" ? (
                      <Form onSubmit={handleRequestCode}>
                        <span className="gi-login-wrap">
                          <label>Adresse Email *</label>
                          <Form.Group>
                            <Form.Control
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Entrez votre adresse email"
                              required
                              style={{ padding: "12px 15px", borderRadius: "10px" }}
                            />
                          </Form.Group>
                        </span>
                        <span className="gi-login-wrap gi-login-btn" style={{ marginTop: "24px" }}>
                          <button
                            className="gi-btn-1 btn"
                            type="submit"
                            disabled={loading}
                            style={{
                              background: "#e50914",
                              border: "none",
                              borderRadius: "10px",
                              padding: "12px 30px",
                              width: "100%",
                              fontWeight: 600,
                            }}
                          >
                            {loading ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" />
                            ) : null}
                            Recevoir le code
                          </button>
                        </span>
                      </Form>
                    ) : (
                      <Form onSubmit={handleVerifyCode}>
                        <div
                          style={{
                            background: "#f0f8ff",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            fontSize: "0.9rem",
                            color: "#333",
                          }}
                        >
                          <i className="fi-rr-envelope" style={{ marginRight: "8px", color: "#e50914" }}></i>
                          Code envoye a <strong>{email}</strong>
                          <a
                            onClick={() => { setStep("email"); setCode(""); }}
                            style={{ float: "right", color: "#e50914", cursor: "pointer", fontSize: "0.85rem" }}
                          >
                            Modifier
                          </a>
                        </div>

                        <span className="gi-login-wrap">
                          <label>Code de verification *</label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              value={code}
                              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="Entrez le code a 6 chiffres"
                              required
                              maxLength={6}
                              style={{
                                padding: "15px",
                                borderRadius: "10px",
                                fontSize: "1.5rem",
                                textAlign: "center",
                                letterSpacing: "10px",
                                fontWeight: 700,
                              }}
                            />
                          </Form.Group>
                        </span>

                        <span className="gi-login-wrap gi-login-btn" style={{ marginTop: "24px" }}>
                          <button
                            className="gi-btn-1 btn"
                            type="submit"
                            disabled={loading || code.length < 6}
                            style={{
                              background: "#e50914",
                              border: "none",
                              borderRadius: "10px",
                              padding: "12px 30px",
                              width: "100%",
                              fontWeight: 600,
                              opacity: code.length < 6 ? 0.6 : 1,
                            }}
                          >
                            {loading ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" />
                            ) : null}
                            Verifier et se connecter
                          </button>
                        </span>

                        <div className="text-center" style={{ marginTop: "15px" }}>
                          {countdown > 0 ? (
                            <span style={{ color: "#999", fontSize: "0.9rem" }}>
                              Renvoyer le code dans {countdown}s
                            </span>
                          ) : (
                            <a
                              onClick={handleResendCode}
                              style={{ color: "#e50914", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
                            >
                              Renvoyer le code
                            </a>
                          )}
                        </div>
                      </Form>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="gi-login-box d-n-991">
              <div className="gi-login-img">
                <img
                  src={process.env.NEXT_PUBLIC_URL + "/assets/img/common/login.png"}
                  alt="login"
                />
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="text-center" style={{ marginTop: "30px" }}>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Pas encore d'abonnement ?{" "}
              <Link href="/abonnements" style={{ color: "#e50914", fontWeight: 600 }}>
                Decouvrir nos offres
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};

export default LoginPage;
