"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const tabs = ["Compra", "Vende", "Cotiza"];

export default function Hero() {
  const [activeTab, setActiveTab] = useState("Compra");

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay del DS: scrim plano que garantiza contraste sobre el vídeo
          (cambia frame a frame) + el degradado 235° hacia Verde Value. */}
      <div aria-hidden className="absolute inset-0 bg-brand-ink/45" />
      <div aria-hidden className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 flex min-h-[520px] md:min-h-[600px] flex-col justify-center px-6 py-14 md:px-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
            Seminuevos certificados
          </p>
          <h1 className="max-w-[720px] font-heading text-display-l font-light text-white">
            Transforma tu camino
          </h1>
          <p className="mt-5 max-w-[520px] text-body-1 text-white/85">
            Compra o vende tu auto con revisión de 240 puntos, garantía incluida
            y financiamiento a tu medida.
          </p>

          {/* Buscador — radio 10px (inputs del DS), no pill */}
          <div className="mt-10 flex w-full max-w-[640px] items-center gap-2 rounded-lg bg-card p-2 pl-4">
            <Search aria-hidden className="size-5 shrink-0 text-ink-600" />
            <label htmlFor="hero-search" className="sr-only">
              Busca por año, marca o modelo
            </label>
            <Input
              id="hero-search"
              placeholder="Busca por año, marca o modelo…"
              className="h-11 flex-1 border-0 bg-transparent text-body-2 shadow-none focus-visible:ring-0"
            />
            <Button size="cta" className="shrink-0 py-3">
              Buscar
            </Button>
          </div>

          <div
            className="mt-6 flex flex-wrap items-center gap-3"
            role="tablist"
            aria-label="Tipo de operación"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  // min-h-11 = 44px, objetivo táctil accesible
                  "min-h-11 cursor-pointer rounded-4xl border px-6 font-label text-label transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
                  activeTab === tab
                    ? "border-brand-aqua bg-brand-aqua text-brand-ink"
                    : "border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
