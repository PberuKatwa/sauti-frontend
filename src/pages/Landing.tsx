import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#12245B] to-[#0a1a4a] font-[Poppins] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F48120]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F48120]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#3B82F6]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/2 rounded-full border border-white/5" />
      </div>

      <nav className="relative z-20 flex justify-between items-center px-8 py-6 md:px-16">
        <div className="text-white font-bold text-2xl tracking-tight">
          SAUTI<span className="text-[#F48120]"> Cloud</span>
        </div>
        <Link
          to="/login"
          className="px-6 py-2 rounded-full border border-[#F48120] text-[#F48120] font-medium hover:bg-[#F48120] hover:text-white transition-all"
        >
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4 md:px-16 lg:px-24 text-center m-10">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 text-sm text-white/90">
          <span className="bg-[#F48120] text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI-Powered</span>
          <div className="h-4 w-px bg-white/30" />
          <span className="font-semibold text-[#3B82F6]">Intelligent Sales & Support</span>
          <div className="h-4 w-px bg-white/30" />
          <span>24/7 Automation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white max-w-4xl leading-[1.1] tracking-tight mb-6">
          Intelligence, Not Interruption
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          Close sales and deliver seamless customer support around the clock through AI-driven bots that feel human, not robotic. No human required in the loop.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F48120] to-[#12245B] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#F48120]/20 w-full sm:w-auto text-center"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur text-white font-semibold text-base hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
          >
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h3 className="text-[#F48120] font-bold mb-2">AI Sales Bots</h3>
            <p className="text-white/50 text-sm">Intelligent bots that engage leads, answer questions, and close deals automatically, 24/7.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 border border-[#F48120]/30 text-left scale-105 shadow-xl shadow-[#F48120]/5">
            <h3 className="text-white font-bold mb-2">Customer Support</h3>
            <p className="text-white/70 text-sm">Seamless, human-like support experiences that resolve issues instantly without human intervention.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h3 className="text-[#3B82F6] font-bold mb-2">Web Interfaces</h3>
            <p className="text-white/50 text-sm">Beautiful, responsive web interfaces that integrate directly into your existing sales funnel.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
