import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import "../assets/css/login.css";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setValidating(false);
        return;
      }
      try {
        const response = await authService.validateToken(token);
        if (response.success) {
          setTokenValid(true);
        }
      } catch (error) {
        console.error("Token validation failed", error);
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !token) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword(token, password);
      if (!response.success) throw new Error(response.message);
      toast.success("Password reset successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password. Please try again.";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div
        className="min-h-screen bg-white flex justify-center items-center font-sans"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        <div
          className="max-w-screen-7xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-2xl flex flex-1 shadow-sm overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          <div
            className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-center items-center relative"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
            }}
          >
            <div className="grid-bg" />
            <div className="relative z-10 text-center">
              <span className="spinner mx-auto mb-4" />
              <p style={{ fontSize: "14px", color: "#6B7280" }}>
                Validating your reset link...
              </p>
            </div>
          </div>
          <div
            className="right-panel flex-1 hidden lg:block"
            style={{ background: "#12245B", position: "relative" }}
          >
            <img
              src="/logo/back_56.png"
              alt="Sauti AI sales automation"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.55 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div
        className="min-h-screen bg-white flex justify-center items-center font-sans"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        <div
          className="max-w-screen-7xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-2xl flex flex-1 shadow-sm overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          <div
            className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-between relative"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
            }}
          >
            <div className="grid-bg" />
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

            <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
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
                Invalid or Expired Link
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
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <div
                style={{ borderBottom: "1.5px solid #E5E7EB", marginBottom: "28px" }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link
                  to="/forgot-password"
                  className="btn-signin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
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
                  <span>Request New Link</span>
                </Link>

                <div style={{ textAlign: "center" }}>
                  <Link
                    to="/login"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#12245B",
                      textDecoration: "none",
                    }}
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <p
                className="font-mono-ui"
                style={{ fontSize: "11px", color: "#D1D5DB", textAlign: "center" }}
              >
                AI-powered sales automation · sauti-cloud.com
              </p>
            </div>
          </div>

          <div
            className="right-panel flex-1 hidden lg:block"
            style={{ background: "#12245B", position: "relative" }}
          >
            <img
              src="/logo/back_56.png"
              alt="Sauti AI sales automation"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.55 }}
            />
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
                Security tips
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                >
                  Reset links expire after 15 minutes
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <span
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                >
                  Each link can only be used once
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
                  Contact support if you need help
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white flex justify-center items-center font-sans"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div
        className="max-w-screen-7xl w-full m-0 sm:m-10 bg-white border border-gray-200 sm:rounded-2xl flex flex-1 shadow-sm overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        <div
          className="lg:w-1/2 xl:w-5/12 p-8 sm:p-12 flex flex-col justify-between relative"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
          }}
        >
          <div className="grid-bg" />

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

          <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
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
              Set New Password
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
              Enter your new password below.
            </p>

            <div
              style={{ borderBottom: "1.5px solid #E5E7EB", marginBottom: "28px" }}
            />

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
                  New Password
                </label>
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
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input-field"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
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
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                    <span>Resetting password…</span>
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
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Reset Password</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#12245B",
                    textDecoration: "none",
                  }}
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>

          <div className="relative z-10">
            <p
              className="font-mono-ui"
              style={{ fontSize: "11px", color: "#D1D5DB", textAlign: "center" }}
            >
              AI-powered sales automation · sauti-cloud.com
            </p>
          </div>
        </div>

        <div
          className="right-panel flex-1 hidden lg:block"
          style={{ background: "#12245B", position: "relative" }}
        >
          <img
            src="/logo/back_56.png"
            alt="Sauti AI sales automation"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />

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
              Secure Password Reset
            </span>
          </div>

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
              Password tips
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
              >
                Use at least 6 characters
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <span
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
              >
                Mix letters, numbers, and symbols
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
                Avoid reusing old passwords
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
