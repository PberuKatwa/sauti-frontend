import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { authService } from "../services/auth.service";
import "../assets/css/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      await authService.login(email, password);
      toast.success("Successfully logged in", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard/home");
    } catch (error: any) {
      toast.error("Invalid email or password", {
        position: "top-right",
        autoClose: 5000,
      });
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

          {/* Middle: Preamble + Form */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-2">

            {/* AI Badge */}
            {/*<div className="ai-pill mb-5" style={{ width: "fit-content" }}>
              <span className="pulse-dot" />
              <span
                className="font-mono-ui"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#12245B",
                }}
              >
                AI-Powered Sales
              </span>
            </div>*/}

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
              Automate Your Sales
              <br />
              <span style={{ color: "#F48120" }}>24/7 Intelligence</span>
            </h1>

            {/* Preamble */}
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.65,
                color: "#6B7280",
                marginBottom: "24px",
                maxWidth: "360px",
              }}
            >
              Close deals and provide support around the clock with AI bots that
              understand your customers—no human in the loop required.
            </p>

            {/* Stat chips */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
              <div className="stat-card">
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#12245B",
                    letterSpacing: "-0.5px",
                  }}
                >
                  24/7<span style={{ color: "#F48120" }}>+</span>
                </span>
                <span
                  className="font-mono-ui"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Availability
                </span>
              </div>
              <div className="stat-card">
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#12245B",
                    letterSpacing: "-0.5px",
                  }}
                >
                  40<span style={{ color: "#F48120" }}>%</span>
                </span>
                <span
                  className="font-mono-ui"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Higher Conversion
                </span>
              </div>
              <div className="stat-card">
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#12245B",
                    letterSpacing: "-0.5px",
                  }}
                >
                  0<span style={{ color: "#F48120" }}>s</span>
                </span>
                <span
                  className="font-mono-ui"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Wait Time
                </span>
              </div>
            </div>

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

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <label
                    className="font-mono-ui"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "#9CA3AF",
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-mono-ui"
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#12245B")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9CA3AF")
                    }
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    <span>Signing in…</span>
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
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </button>
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
              Live Bot Activity
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
              What you get access to
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
                Conversational AI sales bots
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
                Real-time sales analytics & tracking
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
                Automated customer support 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
