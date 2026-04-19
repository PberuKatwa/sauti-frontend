export function SautiCloudLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-white/90 backdrop-blur-sm font-['Poppins',sans-serif]">

      {/* Orbital spinner */}
      <div className="relative w-16 h-16">

        {/* Navy disc - Sauti Navy Blue */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "#12245B" }}
        />

        {/* Wordmark - Sauti Orange */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[8px] font-extrabold uppercase"
            style={{ color: "#F48120", letterSpacing: "0.18em" }}
          >
            suti
          </span>
        </div>

        {/* Spinning orange arc - Sauti Orange */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "spin-cw 1.1s linear infinite" }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle cx="32" cy="32" r="29" stroke="#F48120" strokeWidth="3" strokeDasharray="48 134" strokeLinecap="round" />
        </svg>

        {/* Orbiting dot - Sauti Orange */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "spin-cw 1.1s linear infinite" }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle cx="32" cy="3" r="3" fill="#F48120" />
        </svg>

      </div>

      {/* Message - Sauti Navy Blue */}
      <p className="text-sm font-medium tracking-wide" style={{ color: "#12245B" }}>
        Preparing your workspace…
      </p>

      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
