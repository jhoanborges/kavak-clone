import { CreditCard, Car, RefreshCw } from "lucide-react";

import { SectionHeading } from "@/components/ds";
import { APP_NAME } from "@/lib/config";

const benefits = [
  {
    icon: CreditCard,
    title: "Financia el auto que quieres",
    desc: "Aprobamos 6 de cada 10 créditos.",
  },
  {
    icon: Car,
    title: "Maneja y decide",
    desc: `Comprando tu auto ${APP_NAME} tienes 7 días o 300 km de prueba.`,
  },
  {
    icon: RefreshCw,
    title: "Más ofertas, más libertad",
    desc: `Compramos más autos que nunca: cambia el tuyo con ${APP_NAME} y recibe un bono extra.`,
  },
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <SectionHeading
        overline="Por qué elegirnos"
        title={
          <>
            Más de <span className="text-brand-petrol">300,000 clientes</span> ya
            confiaron en {APP_NAME}
          </>
        }
        className="mb-10 max-w-[720px]"
      />

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          >
            <span className="flex size-[50px] items-center justify-center rounded-4xl bg-brand-aqua">
              <Icon aria-hidden className="size-6 text-brand-ink" />
            </span>
            <div>
              <h3 className="font-heading text-h4 font-medium">{title}</h3>
              <p className="mt-2 text-body-2 text-ink-800">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
