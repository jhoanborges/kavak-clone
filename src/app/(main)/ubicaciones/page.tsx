import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";

import { DudasBanner, SectionHeading } from "@/components/ds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  OFICINAS,
  SEDE,
  mapsHref,
  telHref,
  type Oficina,
} from "@/data/ubicaciones";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ubicaciones",
  description:
    "Oficinas de Value en México: San Pedro Garza García, Ciudad de México, Guadalajara, Monterrey y Chihuahua. Direcciones, teléfonos y horarios.",
  path: "/ubicaciones",
});

/** LocalBusiness por oficina: habilita el rich result de sucursal en la SERP. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Value",
  url: absoluteUrl("/ubicaciones"),
  location: [SEDE, ...OFICINAS].map((o) => ({
    "@type": "LocalBusiness",
    name: `Value ${o.ciudad}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: o.direccion,
      addressLocality: o.ciudad,
      addressRegion: o.estado,
      addressCountry: "MX",
    },
    telephone: o.telefonos[0],
    openingHours: "Mo-Fr 09:00-18:00",
  })),
};

function OficinaCard({ oficina, destacada = false }: { oficina: Oficina; destacada?: boolean }) {
  return (
    <article
      className={
        destacada
          ? "grid gap-0 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-2"
          : "flex flex-col overflow-hidden rounded-xl border border-border bg-card"
      }
    >
      <div className={destacada ? "relative min-h-[280px]" : "relative aspect-[4/3]"}>
        <Image
          src={oficina.imagen}
          alt={`Oficina Value en ${oficina.ciudad}`}
          fill
          className="object-cover"
          sizes={destacada ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div>
          <Badge variant="secondary" className="mb-3">
            {oficina.entidad}
          </Badge>
          <h3 className={destacada ? "font-heading text-h2 font-normal" : "font-heading text-h3 font-medium"}>
            {oficina.ciudad}
          </h3>
          <p className="text-caption text-ink-600">{oficina.estado}</p>
        </div>

        <dl className="flex flex-col gap-3 text-body-2">
          <div className="flex gap-3">
            <dt className="sr-only">Dirección</dt>
            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-petrol" />
            <dd className="text-ink-800">{oficina.direccion}</dd>
          </div>

          <div className="flex gap-3">
            <dt className="sr-only">Teléfono</dt>
            <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-petrol" />
            <dd className="flex flex-col gap-0.5">
              {oficina.telefonos.map((t) => (
                <a
                  key={t}
                  href={telHref(t)}
                  className="text-brand-petrol underline-offset-4 hover:underline"
                >
                  {t}
                </a>
              ))}
            </dd>
          </div>

          <div className="flex gap-3">
            <dt className="sr-only">Horario</dt>
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-petrol" />
            <dd className="text-ink-800">{oficina.horario}</dd>
          </div>
        </dl>

        <Button variant="petrol" size="cta" className="mt-auto self-start" asChild>
          <a href={mapsHref(oficina)} target="_blank" rel="noopener noreferrer">
            Ver en Google Maps
          </a>
        </Button>
      </div>
    </article>
  );
}

export default function UbicacionesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        {/* Hero — overlay del DS sobre tinta, sin imagen: la sección ya carga
            cinco fotos abajo y otra más aquí sería peso sin información. */}
        <section className="relative overflow-hidden bg-brand-ink px-6 py-20 text-white md:px-14 md:py-28">
          <div
            aria-hidden
            className="absolute -right-40 -bottom-64 size-[560px] rounded-[50%] bg-brand-petrol"
          />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
              Dónde estamos
            </p>
            <h1 className="max-w-[720px] font-heading text-display-l font-light">
              Cerca de ti en toda la República
            </h1>
            <p className="mt-5 max-w-[560px] text-body-1 text-white/85">
              Cinco oficinas para acompañarte de forma presencial, con el mismo
              servicio que recibes en línea.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
          <SectionHeading
            overline="Sede corporativa"
            title="Value Arrendadora"
            lead="Nuestra casa matriz, donde opera el equipo de arrendamiento y crédito automotriz."
          />
          <OficinaCard oficina={SEDE} destacada />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <SectionHeading
            overline="Oficinas"
            title="Casa de Bolsa"
            lead="Atención presencial en las principales plazas del país."
          />
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {OFICINAS.map((o) => (
              <li key={o.id} className="flex">
                <OficinaCard oficina={o} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <DudasBanner href="/contacto" />
        </section>
      </main>
    </>
  );
}
