"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const content = {
  Compra: {
    headline: "El auto que quieres, más cerca de lo que imaginas",
    cta: "Ver autos",
    steps: [
      {
        n: "1",
        title: "Encuentra tu auto ideal",
        desc: "Elige un auto entre miles que tenemos disponibles para ti",
      },
      {
        n: "2",
        title: "Elige tu forma de pago",
        desc: "Compra al contado o con un plan de pagos que se ajuste a tu presupuesto",
      },
      {
        n: "3",
        title: "Recoge tu auto",
        desc: `Agenda una cita y busca tu auto ${APP_NAME}`,
      },
    ],
  },
  Vende: {
    headline: "Vende tu auto rápido y seguro",
    cta: "Cotizar mi auto",
    steps: [
      {
        n: "1",
        title: "Cotiza en línea",
        desc: "Obtén una oferta en minutos ingresando los datos de tu auto",
      },
      {
        n: "2",
        title: "Lleva tu auto a revisión",
        desc: `Agenda una cita en la sucursal ${APP_NAME} más cercana`,
      },
      {
        n: "3",
        title: "Recibe tu pago",
        desc: "Recibe el dinero en tu cuenta en tiempo récord",
      },
    ],
  },
};

type TabKey = keyof typeof content;

export default function HowItWorks() {
  const [active, setActive] = useState<TabKey>("Compra");
  const { headline, cta, steps } = content[active];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left */}
          <div className="p-8 md:p-10 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-border">
            {/* Tabs */}
            <div className="flex gap-1 bg-muted rounded-lg p-1 self-start">
              {(Object.keys(content) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={[
                    "px-5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                    active === tab
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
              {headline}
            </h2>
            <Button className="self-start cursor-pointer">
              {cta}
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Right: steps */}
          <div className="p-8 md:p-10 flex flex-col gap-6">
            {steps.map((step, i) => (
              <div key={step.n} className="flex gap-4">
                <div className="shrink-0 size-8 rounded-full border-2 border-primary text-primary font-bold text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <div className={i < steps.length - 1 ? "pb-4 border-b border-border flex-1" : "flex-1"}>
                  <p className="font-semibold text-foreground text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
