"use client";

import { APP_NAME } from "@/lib/config";

export default function PersistLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      {/* Heart pulse stack */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer ripple 1 */}
        <span
          className="absolute rounded-full bg-red-400/20"
          style={{
            width: 120,
            height: 120,
            animation: "heartRipple 1.6s ease-out infinite",
          }}
        />
        {/* Outer ripple 2 — offset */}
        <span
          className="absolute rounded-full bg-red-400/15"
          style={{
            width: 120,
            height: 120,
            animation: "heartRipple 1.6s ease-out 0.4s infinite",
          }}
        />
        {/* Inner circle */}
        <div
          className="relative z-10 w-20 h-20 rounded-full bg-white shadow-[0_0_0_3px_theme(colors.red.100)] flex items-center justify-center"
          style={{ animation: "heartBeat 1.6s ease-in-out infinite" }}
        >
          {/* Heart SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-9 h-9 text-red-500"
          >
            <path d="M12 21.593c-.521-.438-9-7.45-9-12.093 0-3.309 2.691-6 6-6 1.701 0 3.26.72 4.364 1.866A5.967 5.967 0 0 1 17.636 3.5c3.309 0 6 2.691 6 6 0 4.643-8.479 11.655-9 12.093L12 21.593z" />
          </svg>
        </div>
      </div>

      {/* Logo text */}
      <span
        className="text-2xl font-black tracking-wider text-foreground select-none"
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        {APP_NAME.toUpperCase()}
      </span>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-muted-foreground tracking-wide">
        Cargando tu experiencia…
      </p>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes heartBeat {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.12); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.08); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes heartRipple {
          0%   { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
