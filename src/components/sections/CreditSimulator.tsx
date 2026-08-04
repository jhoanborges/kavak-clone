"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CreditSimulator() {
  const [monthly, setMonthly] = useState(3500);
  const minMonthly = 2000;
  const maxMonthly = 8500;

  const carPrice = Math.round(monthly * 140);
  const downPayment = Math.round(carPrice * 0.1);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 p-8 md:p-10">
            {/* Trazo decorativo — antes iba en #1B4FD8, un azul ajeno al DS */}
            <svg
              width="160"
              height="80"
              viewBox="0 0 160 80"
              fill="none"
              aria-hidden
              className="mb-2"
            >
              <path
                d="M10 70 Q 40 10 80 40 Q 120 70 150 20"
                stroke="var(--color-brand-petrol)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M10 80 Q 40 20 80 50 Q 120 80 150 30"
                stroke="var(--color-brand-sage)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="4 3"
              />
            </svg>

            <div>
              <p className="mb-2.5 font-label text-overline uppercase text-brand-sage">
                Simulador de crédito
              </p>
              <h2 className="font-heading text-h2 font-normal leading-snug">
                Paga tu próximo auto
                <br />a meses
              </h2>
              <p className="mt-3 text-body-2 text-ink-800">
                Arma tu presupuesto en solo 2 minutos.
              </p>
            </div>

            <Button size="cta" variant="petrol" className="self-start" asChild>
              <Link href="/cotizar">Simular</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-6 border-t border-border bg-muted p-8 md:border-t-0 md:border-l md:p-10">
            <div>
              <p className="mb-1 font-label text-overline uppercase text-ink-600">
                Tu vehículo estimado
              </p>
              <p className="font-label text-[2.5rem] font-bold leading-none tabular-nums text-brand-petrol">
                ${carPrice.toLocaleString("es-MX")}
              </p>
            </div>

            <dl className="flex flex-col gap-3 text-body-2">
              <div className="flex justify-between">
                <dt className="text-ink-600">Pago inicial</dt>
                <dd className="font-medium tabular-nums">
                  ${downPayment.toLocaleString("es-MX")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Mensualidades desde</dt>
                <dd className="font-medium tabular-nums">
                  ${monthly.toLocaleString("es-MX")}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="credit-monthly"
                className="font-label text-label text-ink-800"
              >
                Mensualidad que puedes pagar
              </label>
              <input
                id="credit-monthly"
                type="range"
                min={minMonthly}
                max={maxMonthly}
                step={100}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                aria-valuetext={`$${monthly.toLocaleString("es-MX")} al mes`}
                className="w-full cursor-pointer accent-brand-petrol"
              />
              <div className="flex justify-between text-caption tabular-nums text-ink-600">
                <span>${minMonthly.toLocaleString("es-MX")}</span>
                <span>${maxMonthly.toLocaleString("es-MX")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
