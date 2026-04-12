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
      navigate("/dashboard");
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
    <div className="min-h-screen flex bg-white font-[Poppins,sans-serif]">

      {/* ── LEFT PANEL ── */}
      <div className="relative flex flex-col w-full lg:w-[52%] px-10 py-10 overflow-y-auto">

        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10 mb-2">
          <div className="flex items-center gap-3">
            <img
              src="/logo/sauti-main.png"
              alt="Sauti-Cloud"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Middle: Preamble + Form */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full p-3">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 mb-5 w-fit bg-[rgba(244,129,32,0.05)] border border-[rgba(244,129,32,0.12)] rounded-full px-2.5 py-1">
            {/* Pulse dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)] animate-pulse flex-shrink-0" />
            <span className="text-xs font-medium text-[#F48120]">
              AI-Powered Sales
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl leading-tight mb-2 text-[#0F172A] font-bold tracking-tight">
            Automate Your Sales<br />
            <span className="text-[#F48120]">24/7 Intelligence</span>
          </h1>

          {/* Preamble */}
          <p className="text-sm mb-6 leading-relaxed text-gray-500 font-normal">
            Close deals and provide support around the clock with AI bots that understand your customers—no human in the loop required.
          </p>

          {/* Stat chips */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {[
              { value: "24/7", label: "Availability", highlight: "+" },
              { value: "40", label: "Higher Conversion", highlight: "%" },
              { value: "0", label: "Wait Time", highlight: "s" },
            ].map(({ value, label, highlight }) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 flex-1 min-w-[90px] bg-white border-[1.5px] border-gray-200 rounded-[10px] px-3.5 py-3 shadow-[0_1px_4px_rgba(30,58,138,0.05)]"
              >
                <span className="text-base text-[#0F172A] font-bold">
                  {value}<span className="text-[#F48120]">{highlight}</span>
                </span>
                <span className="text-xs text-gray-500 font-normal">{label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full mb-6 h-px bg-gray-200" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Business Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-[13px] rounded-[10px] bg-gray-50 border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#0F172A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.08)] font-[inherit]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-[#0F172A] transition-colors bg-transparent border-none cursor-pointer font-[inherit]"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-[13px] rounded-[10px] bg-gray-50 border-[1.5px] border-gray-200 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#0F172A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.08)] font-[inherit]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-[13px] mt-1 rounded-[10px] bg-[#0F172A] text-white font-bold text-sm flex items-center justify-center gap-2 tracking-[-0.2px] transition-all duration-200 shadow-[0_4px_14px_rgba(15,23,42,0.22)] hover:enabled:bg-[#020617] hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_20px_rgba(15,23,42,0.30)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed font-[inherit]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center mt-6 text-gray-400">
            AI-powered sales automation · sauti-cloud.com
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden bg-[#0F172A]">
        {/* Background image */}
        <img
          src="/logo/back_56.png"
          alt="AI sales automation"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(15,23,42,0.70)] via-[rgba(15,23,42,0.30)] to-transparent pointer-events-none z-[1]" />

        {/* Top-right decorative element */}
        <div className="absolute top-8 right-8 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.12] backdrop-blur-xl border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
          <span className="text-white text-xs font-medium">Live Bot Activity</span>
        </div>

        {/* Bottom overlay card */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-white bg-white/[0.10] backdrop-blur-xl border border-white/20 rounded-[14px] px-5 py-[18px]">
          <p className="text-xs mb-3 text-white/60 font-medium uppercase tracking-[0.05em]">
            Platform Capabilities
          </p>

          {[
            "Conversational AI sales bots",
            "Real-time sales analytics & tracking",
            "Automated customer support",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 mb-2 last:mb-0">
              <div className="flex items-center justify-center flex-shrink-0 w-7 h-7 rounded-[7px] bg-[rgba(244,129,32,0.30)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm text-white/90 font-normal">{feature}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
