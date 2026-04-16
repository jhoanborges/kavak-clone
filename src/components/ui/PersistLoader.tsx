"use client";

import { APP_NAME } from "@/lib/config";

export default function PersistLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">

      {/* Pulse stack */}
      <div className="relative flex items-center justify-center mb-8">

        {/* Ripple ring 1 */}
        <span
          className="absolute rounded-full"
          style={{
            width: 128,
            height: 128,
            backgroundColor: "var(--brand-primary)",
            opacity: 0,
            animation: "brandRipple 2s ease-out infinite",
          }}
        />
        {/* Ripple ring 2 — delayed */}
        <span
          className="absolute rounded-full"
          style={{
            width: 128,
            height: 128,
            backgroundColor: "var(--brand-primary)",
            opacity: 0,
            animation: "brandRipple 2s ease-out 0.65s infinite",
          }}
        />

        {/* Icon circle */}
        <div
          className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full"
          style={{
            backgroundColor: "var(--brand-primary)",
            animation: "brandPulse 2s ease-in-out infinite",
            boxShadow: "0 0 0 0 var(--brand-primary)",
          }}
        >
          {/* vercel.svg triangle — white fill */}
          <svg
            viewBox="0 0 1155 1000"
            className="w-9 h-9"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m577.3 0 577.4 1000H0z" />
          </svg>
        </div>
      </div>

      {/* App name */}
      <span
        className="text-2xl font-black tracking-wider select-none"
        style={{
          fontFamily: "Arial Black, Arial, sans-serif",
          color: "var(--brand-primary)",
        }}
      >
        {APP_NAME.toUpperCase()}
      </span>

      {/* Subtitle */}
      <p className="mt-2 text-sm tracking-wide" style={{ color: "var(--brand-primary)", opacity: 0.6 }}>
        Cargando tu experiencia…
      </p>

      <style>{`
        @keyframes brandPulse {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.10); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.06); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes brandRipple {
          0%   { transform: scale(0.55); opacity: 0.35; }
          100% { transform: scale(1.9);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}
