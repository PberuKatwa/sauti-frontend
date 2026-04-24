import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { authService } from "../services/auth.service";
import "../assets/css/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      if (!response.success) throw new Error(`Error in sending reset link to email`);
      toast.success(
        response.message,
        {
          position: "top-right",
          autoClose: 6000,
        }
      );
      navigate("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send reset instructions. Please try again.";
      toast.error(`Error in sending reset link to email`, {
        position: "top-right",
        autoClose: 5000,
      });

      console.error("error in sending reset link", message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center font-sans"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div
        className="max-w-screen-7xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-2xl flex flex-1 shadow-sm overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-between relative"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
          }}
        >
          <div className="grid-bg" />

          {/* Top: Logo */}
          <div className="relative z-10">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="/logo/sauti-main.png"
                alt="Sauti-Cloud"
                className="object-contain"
                style={{ height: 48, maxHeight: 48, width: "auto" }}
              />
              <div>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "#12245B",
                  }}
                >
                  Sauti<span style={{ color: "#F48120" }}>Cloud</span>
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Form */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
            {/* Heading */}
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.6px",
                lineHeight: 1.2,
                color: "#12245B",
                marginBottom: "10px",
              }}
            >
              Reset Your Password
            </h1>

            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.65,
                color: "#6B7280",
                marginBottom: "28px",
                maxWidth: "360px",
              }}
            >
              Enter the email address associated with your account and we will
              send you instructions to reset your password.
            </p>

            {/* Divider */}
            <div
              style={{ borderBottom: "1.5px solid #E5E7EB", marginBottom: "28px" }}
            />

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label
                  className="font-mono-ui"
                  style={{
                    display: "block",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    marginBottom: "6px",
                  }}
                >
                  Business Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@sauti-cloud.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-signin"
                disabled={loading}
                style={{ marginTop: "4px" }}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    <span>Sending instructions…</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#12245B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <p
              className="font-mono-ui"
              style={{ fontSize: "11px", color: "#D1D5DB", textAlign: "center" }}
            >
              AI-powered sales automation · sauti-cloud.com
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="right-panel flex-1 hidden lg:block"
          style={{ background: "#12245B", position: "relative" }}
        >
          {/* Background image */}
          <img
            src="/logo/back_56.png"
            alt="Sauti AI sales automation"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />

          {/* Top-right decorative element */}
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 28,
              zIndex: 2,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "10px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="pulse-dot" />
            <span
              className="font-mono-ui"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
                textTransform: "uppercase",
              }}
            >
              Secure Account Recovery
            </span>
          </div>

          {/* Bottom overlay card */}
          <div className="overlay-card">
            <p
              className="font-mono-ui"
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "12px",
              }}
            >
              Need help?
            </p>

            <div className="feature-row">
              <div className="feature-icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F48120"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
              >
                Check your spam folder if you do not see the email
              </span>
            </div>

            <div className="feature-row">
              <div className="feature-icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F48120"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
              >
                Reset links expire after 15 minutes for security
              </span>
            </div>

            <div className="feature-row">
              <div className="feature-icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F48120"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
              >
                Contact support if you need further assistance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
