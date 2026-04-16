"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const tabs = ["Compra", "Vende", "Cotiza"];

export default function Hero() {
  const [activeTab, setActiveTab] = useState("Compra");

  return (
    <section className="relative w-full h-[480px] md:h-[520px] overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.kavak.services/assets/images/home-ui/VIDEO_HB_MX_KAVAK-27012026.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-md">
          Transforma tu camino
        </h1>
        <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">
          Compra o vende tu auto. Financiamiento a tu medida.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-xl bg-white rounded-full shadow-xl flex items-center px-4 gap-2 mb-5">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Busca por año, marca o modelo..."
            className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground flex-1 h-11 text-sm"
          />
          <Button size="sm" className="rounded-full cursor-pointer px-5">
            Buscar
          </Button>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
