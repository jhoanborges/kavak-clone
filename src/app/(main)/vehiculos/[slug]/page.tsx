import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Fuel,
  Gauge,
  Palette,
  Phone,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { GaleriaVehiculo } from "@/components/catalog/GaleriaVehiculo";
import VehiculoCard from "@/components/catalog/VehiculoCard";
import { VehiculosDisclaimer } from "@/components/catalog/VehiculosEstado";
import { DudasBanner, SectionHeading } from "@/components/ds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fetchImagenes,
  fetchVehiculoPorId,
  idDesdeSlug,
  type Vehiculo,
} from "@/lib/api/vehiculos";
import { APP_NAME } from "@/lib/config";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { encodeVehiculoId } from "@/lib/api/id-publico";
import { CONTACT, telHref } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/**
 * Renderizado en servidor bajo demanda, no estático.
 *
 * `generateStaticParams` obligaría a llamar a la API durante el build, y el WAF
 * de Value bloquea las IP de datacenter: el build fallaría en CI. Además el
 * inventario cambia a diario, así que congelarlo en el build tampoco convendría.
 *
 * Los datos se piden servidor-a-servidor: sin CORS, y la ficha llega en el HTML
 * para que Google la indexe.
 */
export const dynamic = "force-dynamic";

const mxn = (n: number | null) =>
  n == null ? "—" : `$${n.toLocaleString("es-MX")}`;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  if (!id) return {};

  const { vehiculo } = await fetchVehiculoPorId(id);
  if (!vehiculo) return {};

  const titulo = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio ?? ""}`.trim();

  return buildMetadata({
    title: `${titulo} — Seminuevo certificado`,
    description: `${titulo} ${vehiculo.version}. ${vehiculo.km?.toLocaleString("es-MX") ?? "—"} km, ${vehiculo.transmision.toLowerCase()}, ${vehiculo.combustible.toLowerCase()}. ${mxn(vehiculo.precio)} MXN.`,
    path: `/vehiculos/${slug}`,
    images: vehiculo.imagenes.slice(0, 1),
  });
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
      <dt className="text-body-2 text-ink-600">{etiqueta}</dt>
      <dd className="text-right font-label text-body-2 font-medium">{valor}</dd>
    </div>
  );
}

export default async function VehiculoDetallePage({ params }: Props) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  if (!id) notFound();

  const [{ vehiculo, similares }, grupos] = await Promise.all([
    fetchVehiculoPorId(id),
    fetchImagenes(id),
  ]);

  if (!vehiculo) notFound();

  const titulo = `${vehiculo.marca} ${vehiculo.modelo}`;
  const tituloCompleto = `${titulo} ${vehiculo.anio ?? ""}`.trim();
  const todasLasFotos = grupos.flatMap((g) => g.fotos);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: tituloCompleto,
    brand: { "@type": "Brand", name: vehiculo.marca },
    model: vehiculo.modelo,
    vehicleModelDate: String(vehiculo.anio ?? ""),
    itemCondition: "https://schema.org/UsedCondition",
    vehicleTransmission: vehiculo.transmision,
    fuelType: vehiculo.combustible,
    color: vehiculo.color,
    bodyType: vehiculo.segmento,
    sku: vehiculo.id,
    image: todasLasFotos.slice(0, 8),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehiculo.km,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: vehiculo.precio,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: absoluteUrl(`/vehiculos/${slug}`),
      seller: { "@type": "Organization", name: APP_NAME },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vehículos",
        item: absoluteUrl("/vehiculos"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tituloCompleto,
        item: absoluteUrl(`/vehiculos/${slug}`),
      },
    ],
  };

  const datosGenerales: Array<[string, string | null]> = [
    ["Marca", vehiculo.marca],
    ["Modelo", vehiculo.modelo],
    ["Versión", vehiculo.version],
    ["Año", vehiculo.anio ? String(vehiculo.anio) : null],
    ["Carrocería", vehiculo.segmento],
    ["Kilometraje", vehiculo.km ? `${vehiculo.km.toLocaleString("es-MX")} km` : null],
    ["Transmisión", vehiculo.transmision],
    ["Tipo de motor", vehiculo.combustible],
    ["Color", vehiculo.color],
    ["Identificador", vehiculo.id],
  ];

  const franja = [
    {
      icon: Gauge,
      valor: vehiculo.km ? `${vehiculo.km.toLocaleString("es-MX")} km` : "—",
      etiqueta: "Kilometraje",
    },
    { icon: Fuel, valor: vehiculo.combustible || "—", etiqueta: "Tipo de motor" },
    { icon: Settings2, valor: vehiculo.transmision || "—", etiqueta: "Transmisión" },
    { icon: Palette, valor: vehiculo.color || "—", etiqueta: "Color" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde la respuesta de la API, no entrada de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos propios, no entrada de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-7xl px-6 pt-8 md:px-14">
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-caption text-ink-600">
              <li>
                <Link href="/" className="hover:text-brand-petrol">
                  Inicio
                </Link>
              </li>
              <ChevronRight aria-hidden className="size-3.5" />
              <li>
                <Link href="/vehiculos" className="hover:text-brand-petrol">
                  Vehículos
                </Link>
              </li>
              <ChevronRight aria-hidden className="size-3.5" />
              <li aria-current="page" className="text-foreground">
                {tituloCompleto}
              </li>
            </ol>
          </nav>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 font-label text-overline uppercase text-brand-sage">
                Seminuevo certificado
              </p>
              <h1 className="font-heading text-h1 font-light">
                {titulo} <span className="tabular-nums">{vehiculo.anio}</span>
              </h1>
            </div>
            <Badge variant="secondary" className="tabular-nums">
              ID {vehiculo.id}
            </Badge>
          </div>
        </div>

        {/* Franja de datos clave, como en el diseño original: lo que decide la
            compra, visible antes de bajar a la ficha completa. */}
        <div className="mb-8 bg-brand-sage/25">
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-4 md:grid-cols-4 md:px-14">
            {franja.map(({ icon: Icon, valor, etiqueta }) => (
              <li key={etiqueta} className="flex items-center gap-2.5">
                <Icon aria-hidden className="size-5 shrink-0 text-brand-petrol" />
                <span className="min-w-0">
                  <span className="block truncate font-label text-body-2 font-semibold">
                    {valor}
                  </span>
                  <span className="block text-caption text-ink-600">{etiqueta}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-14">
          <GaleriaVehiculo grupos={grupos} titulo={tituloCompleto} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="flex flex-col gap-8">
              <section className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 font-heading text-h3 font-medium">
                  Datos generales
                </h2>
                <dl className="grid gap-x-10 md:grid-cols-2">
                  {datosGenerales
                    .filter(([, v]) => Boolean(v))
                    .map(([etiqueta, valor]) => (
                      <Dato
                        key={etiqueta}
                        etiqueta={etiqueta}
                        valor={valor as string}
                      />
                    ))}
                </dl>
              </section>

              <section className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 font-heading text-h3 font-medium">
                  Qué incluye
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Revisión de 240 puntos antes de publicarse",
                    "Garantía mecánica incluida",
                    "Historial de mantenimiento documentado",
                    "Acompañamiento de un asesor en todo el proceso",
                  ].map((punto) => (
                    <li key={punto} className="flex gap-2.5">
                      <ShieldCheck
                        aria-hidden
                        className="mt-0.5 size-5 shrink-0 text-brand-petrol"
                      />
                      <span className="text-body-2 text-ink-800">{punto}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Columna de conversión, pegada al hacer scroll: la ficha es larga
                y el precio no debe quedarse arriba. */}
            <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
              <div className="rounded-xl border border-border bg-card p-6">
                {vehiculo.mensualidad != null && (
                  <>
                    <p className="text-caption text-ink-600">Desde</p>
                    <p className="whitespace-nowrap font-label text-h1 font-bold tabular-nums text-brand-petrol">
                      {mxn(vehiculo.mensualidad)}
                      <span className="ml-1 text-body-2 font-normal text-ink-600">
                        /mes*
                      </span>
                    </p>
                  </>
                )}

                <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-4">
                  <span className="text-body-2 text-ink-600">
                    Precio de contado
                  </span>
                  <span className="font-label text-h4 font-bold tabular-nums">
                    {mxn(vehiculo.precio)}
                  </span>
                </div>

                {/*
                  Sólo se muestra el plazo que devuelve la API. Calcular 6, 12,
                  18 o 24 meses exigiría una tasa fija, y la implícita varía
                  entre unidades (1.72%–1.75% mensual): saldrían cifras
                  inventadas en un producto financiero regulado. Pendiente del
                  endpoint de financiamiento real.
                */}
                {vehiculo.meses != null && (
                  <p className="mt-3 text-caption text-ink-600">
                    Mensualidad calculada a {vehiculo.meses} meses con 30% de
                    enganche.
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="petrol" size="cta" className="w-full" asChild>
                    {/* Al embudo de captura, no a /contacto: el objetivo es
                        obtener el lead, y el token opaco mantiene el id fuera
                        de la URL. */}
                    <Link href={`/agendar?vehiculo=${encodeVehiculoId(vehiculo.id)}`}>
                      <CalendarDays data-icon="inline-start" />
                      Agendar una cita
                    </Link>
                  </Button>

                  {CONTACT.phone && (
                    <Button variant="outline" size="cta" className="w-full" asChild>
                      <a href={telHref(CONTACT.phone)}>
                        <Phone data-icon="inline-start" />
                        Hablar con un asesor
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <VehiculosDisclaimer meses={vehiculo.meses ?? 36} />
            </aside>
          </div>

          {similares.length > 0 && (
            <section className="pt-14">
              {/* Título genérico a propósito: la lista se completa con otras
                  carrocerías cuando no hay suficientes de la misma, así que
                  prometer "Otros SUVs" sería inexacto. */}
              <SectionHeading
                overline="También te puede interesar"
                title="Otras unidades disponibles"
                lead="Seminuevos certificados, listos para entrega."
              />
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {similares.map((v: Vehiculo) => (
                  <li key={v.id} className="flex">
                    <VehiculoCard vehiculo={v} />
                  </li>
                ))}
              </ul>
              <VehiculosDisclaimer meses={vehiculo.meses ?? 36} />
            </section>
          )}

          <section className="py-14">
            <DudasBanner href="/contacto" />
          </section>
        </div>
      </main>
    </>
  );
}
