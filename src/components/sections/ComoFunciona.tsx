import Link from "next/link";
import {
  CalendarCheck,
  Car,
  FileText,
  Handshake,
  Play,
  Sparkles,
} from "lucide-react";

import { SectionHeading } from "@/components/ds";
import { Button } from "@/components/ui/button";

const PASOS = [
  {
    icon: Car,
    title: "Encuentra tu auto",
    desc: "Explora nuestro catálogo y encuentra tu próximo auto.",
    href: "/compra",
  },
  {
    icon: FileText,
    title: "Explora tu financiamiento",
    desc: "Te ayudamos a encontrar el mejor plan para adquirir tu nuevo auto.",
    href: "/cotizar",
  },
  {
    icon: CalendarCheck,
    title: "Agenda tu cita",
    desc: "Agenda una cita con nosotros para conocer tu próximo auto.",
    href: "/contacto",
  },
  {
    icon: Handshake,
    title: "Conoce tu auto",
    desc: "Acude a nuestras oficinas en la fecha y hora de tu cita para ver y probar tu futuro auto.",
    href: "/ubicaciones",
  },
  {
    icon: Sparkles,
    title: "Adquiere tu auto",
    desc: "Una vez realizado el pago inicial, te esperamos para hacer entrega de tu auto en nuestras oficinas.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="bg-muted py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="Proceso"
            title="¿Cómo funciona?"
            lead="Adquirir un auto con nosotros es sencillo. Te lo explicamos en cinco pasos."
            className="mb-0"
          />
          <Button variant="petrol" size="cta" asChild>
            <Link href="/contacto">
              <Play aria-hidden />
              Ver video
            </Link>
          </Button>
        </div>

        {/*
          <ol> porque el orden ES la información: son pasos secuenciales, no una
          lista de características intercambiables.

          La línea que los une va en el contenedor con un pseudo-elemento y sólo
          aparece en desktop; en móvil los pasos se apilan y una línea horizontal
          no significaría nada.
        */}
        <ol className="relative grid list-none grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <span
            aria-hidden
            className="absolute top-5 right-0 left-0 hidden h-px bg-border lg:block"
          />

          {PASOS.map(({ icon: Icon, title, desc, href }, i) => {
            const contenido = (
              <>
                <span className="relative z-10 flex size-10 items-center justify-center rounded-4xl bg-brand-petrol font-label text-label font-bold text-white ring-4 ring-muted">
                  {i + 1}
                </span>
                <span className="flex size-16 items-center justify-center rounded-4xl border border-border bg-card">
                  <Icon aria-hidden className="size-7 text-brand-petrol" />
                </span>
                <span className="font-heading text-h4 font-medium">{title}</span>
                <span className="max-w-[240px] text-body-2 text-ink-800">
                  {desc}
                </span>
              </>
            );

            return (
              <li key={title} className="relative">
                {href ? (
                  // El paso enlaza a la acción que describe: leerlo y no poder
                  // actuar sobre él obliga a volver a buscarlo en la nav.
                  <Link
                    href={href}
                    className="flex flex-col items-center gap-4 text-center transition-colors hover:text-brand-petrol focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {contenido}
                  </Link>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    {contenido}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
