import Link from "next/link";
import { Award, HandshakeIcon, Target, TrendingUp } from "lucide-react";

import { BenefitCard, DudasBanner, SectionHeading } from "@/components/ds";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Quiénes somos",
  description:
    "Value: soluciones financieras empresariales en arrendamiento puro, arrendamiento financiero y crédito automotriz para impulsar el crecimiento de empresas en México.",
  path: "/nosotros",
});

/* Copy tomado del sitio corporativo de Value (app/quienes-somos). */

const MISION_VISION = [
  {
    titulo: "Misión",
    texto:
      "Impulsar el crecimiento de las empresas en México con soluciones financieras a la medida, atención cercana y esquemas que optimizan su operación y patrimonio.",
    icono: Target,
  },
  {
    titulo: "Visión",
    texto:
      "Ser la arrendadora independiente líder en México, reconocida por la excelencia de su servicio y por transformar las necesidades de negocio en oportunidades de expansión.",
    icono: TrendingUp,
  },
];

const HITOS = [
  {
    anio: "2010",
    titulo: "Nace Value Arrendadora",
    texto:
      "Iniciamos operaciones dentro de Value Grupo Financiero para acercar el arrendamiento a las empresas mexicanas.",
  },
  {
    anio: "2013",
    titulo: "Cobertura nacional",
    texto:
      "Ampliamos nuestra presencia a las principales plazas del país con esquemas de arrendamiento puro y financiero.",
  },
  {
    anio: "2015",
    titulo: "Crédito Automotriz",
    texto:
      "Sumamos el crédito automotriz para flotillas, dando más flexibilidad a la operación de nuestros clientes.",
  },
  {
    anio: "2020",
    titulo: "Experiencia digital",
    texto:
      "Lanzamos el Portal Value para cotizar, contratar y dar seguimiento a tu operación en línea.",
  },
];

const SOLUCIONES = [
  {
    titulo: "Arrendamiento Puro",
    texto: "Usa el activo sin capitalizarlo y deduce la renta al 100%.",
  },
  {
    titulo: "Arrendamiento Financiero",
    texto: "Adquiere el activo al final del plazo con una opción de compra.",
  },
  {
    titulo: "Crédito Automotriz",
    texto: "Financia tu flotilla con plazos y tasas a la medida de tu operación.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Quiénes somos — ${APP_NAME}`,
  url: absoluteUrl("/nosotros"),
  mainEntity: {
    "@type": "Organization",
    name: "Value Arrendadora",
    foundingDate: "2010",
    areaServed: { "@type": "Country", name: "México" },
  },
};

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-ink px-6 py-20 text-white md:px-14 md:py-28">
          <div
            aria-hidden
            className="absolute -right-40 -bottom-64 size-[560px] rounded-[50%] bg-brand-petrol"
          />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
              Quiénes somos
            </p>
            <h1 className="max-w-[820px] font-heading text-display-l font-light">
              Más que financiamiento, un aliado para tu negocio
            </h1>
            <p className="mt-5 max-w-[560px] text-body-1 text-white/85">
              Optimizamos tu operación con los activos que necesitas para crecer.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionHeading
                overline="Sobre Value"
                title="Soluciones financieras empresariales"
              />
              <p className="max-w-[520px] text-body-1 text-ink-800">
                Somos una empresa dedicada a ofrecer soluciones financieras
                empresariales a través de una atención integral en esquemas de
                Arrendamiento Puro, Arrendamiento Financiero y Crédito
                Automotriz, con el objetivo de impulsar el crecimiento de
                empresas en México.
              </p>
              <Button variant="petrol" size="cta" className="mt-8" asChild>
                <Link href="/vehiculos">Ver nuestro inventario</Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {MISION_VISION.map(({ titulo, texto, icono: Icono }) => (
                <article
                  key={titulo}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
                >
                  <span className="flex size-[50px] items-center justify-center rounded-4xl bg-brand-aqua">
                    <Icono aria-hidden className="size-6 text-brand-ink" />
                  </span>
                  <h2 className="font-heading text-h3 font-medium">{titulo}</h2>
                  <p className="text-body-2 text-ink-800">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <SectionHeading
            overline="Soluciones"
            title="Conoce nuestros esquemas"
            lead="Tres formas de financiar los activos que tu empresa necesita."
          />
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SOLUCIONES.map((s, i) => (
              <li key={s.titulo} className="flex">
                <BenefitCard
                  step={i + 1}
                  title={s.titulo}
                  variant={i === 1 ? "strong" : "soft"}
                  className="h-auto min-h-[199px] w-full"
                >
                  {s.texto}
                </BenefitCard>
              </li>
            ))}
          </ul>
        </section>

        {/* Cita destacada — patrón del DS: superficie petróleo, tipografía
            display ligera, sin comillas decorativas. */}
        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <blockquote className="rounded-xl bg-brand-petrol px-8 py-14 text-center text-white md:px-14">
            <p className="mx-auto max-w-[820px] font-heading text-h2 font-light leading-snug">
              Value nos permitió renovar la flotilla completa sin comprometer el
              capital de trabajo del año.
            </p>
            <footer className="mt-6 font-label text-label text-brand-aqua">
              Dirección de Administración — Cliente de Value Arrendadora
            </footer>
          </blockquote>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <SectionHeading
            overline="Historia"
            title="Nuestro recorrido"
            lead="Más de una década construyendo relaciones de largo plazo con empresas mexicanas."
          />
          {/* Línea de tiempo: <ol> porque el orden cronológico ES la información. */}
          <ol className="flex list-none flex-col gap-8 border-l border-border pl-8">
            {HITOS.map((h) => (
              <li key={h.anio} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[38px] size-3 rounded-4xl bg-brand-aqua ring-4 ring-background"
                />
                <p className="font-label text-h4 font-bold tabular-nums text-brand-petrol">
                  {h.anio}
                </p>
                <h3 className="mt-1 font-heading text-h4 font-medium">
                  {h.titulo}
                </h3>
                <p className="mt-1 max-w-[560px] text-body-2 text-ink-800">
                  {h.texto}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8">
              <span className="flex size-[50px] items-center justify-center rounded-4xl bg-brand-neon">
                <Award aria-hidden className="size-6 text-brand-ink" />
              </span>
              <h2 className="font-heading text-h3 font-medium">
                Respaldo institucional
              </h2>
              <p className="text-body-2 text-ink-800">
                Formamos parte de Value Grupo Financiero, con presencia en las
                principales plazas del país.
              </p>
              <Button variant="outline" size="cta" className="mt-auto self-start" asChild>
                <Link href="/ubicaciones">Ver ubicaciones</Link>
              </Button>
            </article>

            <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8">
              <span className="flex size-[50px] items-center justify-center rounded-4xl bg-brand-aqua">
                <HandshakeIcon aria-hidden className="size-6 text-brand-ink" />
              </span>
              <h2 className="font-heading text-h3 font-medium">
                Atención cercana
              </h2>
              <p className="text-body-2 text-ink-800">
                Un ejecutivo acompaña cada operación, desde la cotización hasta
                la entrega.
              </p>
              <Button variant="outline" size="cta" className="mt-auto self-start" asChild>
                <Link href="/contacto">Hablar con un asesor</Link>
              </Button>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <DudasBanner href="/contacto" />
        </section>
      </main>
    </>
  );
}
