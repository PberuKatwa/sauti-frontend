import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { authService } from "../services/auth.service";
import "../assets/css/login.css";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const user = await authService.login(email, password);

      if (!user.data) throw new Error(`User credentials are wrong`);
      setUser(user.data)

      toast.success("Successfully logged in", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/dashboard/home");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password";
      toast.error(message, {
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
                  <Link
                    to="/forgot-password"
                    className="font-mono-ui"
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#12245B",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F48120")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#12245B")
                    }
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9CA3AF",
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                        <line x1="4.22" y1="4.22" x2="19.78" y2="19.78" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
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

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                Don&apos;t have an account?{" "}
              </span>
              <Link
                to="/register"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#F48120",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#12245B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#F48120")
                }
              >
                Register
              </Link>
            </div>
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
