"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CreditSimulator() {
  const [monthly, setMonthly] = useState(3500);
  const minMonthly = 2000;
  const maxMonthly = 8500;

  const carPrice = Math.round(monthly * 140);
  const downPayment = Math.round(carPrice * 0.1);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: simulator CTA */}
          <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
            {/* Decorative lines */}
            <div className="relative mb-2">
              <svg width="160" height="80" viewBox="0 0 160 80" fill="none" className="opacity-70">
                <path d="M10 70 Q 40 10 80 40 Q 120 70 150 20" stroke="#1B4FD8" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M10 80 Q 40 20 80 50 Q 120 80 150 30" stroke="#1B4FD8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                Paga tu próximo auto<br />a meses
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Arma tu presupuesto en solo 2 minutos
              </p>
            </div>
            <Button className="self-start cursor-pointer">Simular</Button>
          </div>

          {/* Right: calculator */}
          <div className="bg-slate-50 p-8 md:p-10 flex flex-col gap-5 border-t md:border-t-0 md:border-l border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Tu vehículo estimado
              </p>
              <p className="text-4xl font-bold text-foreground">
                ${carPrice.toLocaleString("es-MX")}
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pago inicial</span>
                <span className="font-semibold">${downPayment.toLocaleString("es-MX")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mensualidades desde</span>
                <span className="font-semibold">${monthly.toLocaleString("es-MX")}</span>
              </div>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${minMonthly.toLocaleString("es-MX")}</span>
                <span>${maxMonthly.toLocaleString("es-MX")}</span>
              </div>
              <input
                type="range"
                min={minMonthly}
                max={maxMonthly}
                step={100}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
