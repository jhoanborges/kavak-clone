import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Fuel, Gauge, Palette, Settings2 } from "lucide-react";

import { GaleriaVehiculo } from "@/components/catalog/GaleriaVehiculo";
import { FinanciamientoPageClient } from "@/components/catalog/FinanciamientoPageClient";
import { idDesdeSlug } from "@/lib/api/vehiculos";
import { fetchImagenes, fetchVehiculoPorId } from "@/lib/api/vehiculos-server";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ enganche?: string; plazo?: string }>;
};

/**
 * Vista COMPARTIBLE del financiamiento (GET). El vehículo se re-fetchea por id
 * (token del slug) y el cálculo se reconstruye desde los query params
 * enganche/plazo, así el link funciona en frío para cualquiera.
 */
export const dynamic = "force-dynamic";

const mxn = (n: number | null) =>
  n == null ? "-" : `$${n.toLocaleString("es-MX")}`;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  if (!id) return {};
  const { vehiculo } = await fetchVehiculoPorId(id);
  if (!vehiculo) return {};
  const titulo = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio ?? ""}`.trim();
  return buildMetadata({
    title: `Financiamiento · ${titulo}`,
    description: `Cotiza y solicita el crédito de tu ${titulo}. Elige enganche y plazo a tu medida.`,
    path: `/vehiculos/${slug}/financiamiento`,
    images: vehiculo.imagenes.slice(0, 1),
  });
}

export default async function FinanciamientoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const id = idDesdeSlug(slug);
  if (!id) notFound();

  const [{ vehiculo }, grupos] = await Promise.all([
    fetchVehiculoPorId(id),
    fetchImagenes(id),
  ]);
  if (!vehiculo) notFound();

  const titulo = `${vehiculo.marca} ${vehiculo.modelo}`;
  const tituloCompleto = `${titulo} ${vehiculo.anio ?? ""}`.trim();

  const precio = vehiculo.precio ?? 0;
  const engancheQuery = Number(sp.enganche);
  const enganche =
    Number.isFinite(engancheQuery) && engancheQuery > 0
      ? Math.round(engancheQuery)
      : Math.round(precio * 0.2);
  const plazoQuery = Number(sp.plazo);
  const plazo = Number.isFinite(plazoQuery) && plazoQuery > 0 ? plazoQuery : 6;

  const franja = [
    {
      icon: Gauge,
      valor: vehiculo.km ? `${vehiculo.km.toLocaleString("es-MX")} km` : "-",
      etiqueta: "Kilometraje",
    },
    { icon: Fuel, valor: vehiculo.combustible || "-", etiqueta: "Tipo de motor" },
    { icon: Settings2, valor: vehiculo.transmision || "-", etiqueta: "Transmisión" },
    { icon: Palette, valor: vehiculo.color || "-", etiqueta: "Color" },
  ];

  const datos: Array<[string, string | null]> = [
    ["Marca", vehiculo.marca],
    ["Modelo", vehiculo.modelo],
    ["Versión", vehiculo.version],
    ["Año", vehiculo.anio ? String(vehiculo.anio) : null],
    ["Carrocería", vehiculo.segmento],
    ["Kilometraje", vehiculo.km ? `${vehiculo.km.toLocaleString("es-MX")} km` : null],
    ["Transmisión", vehiculo.transmision],
    ["Tipo de motor", vehiculo.combustible],
    ["Color", vehiculo.color],
  ];

  return (
    <main className="flex-1 bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-14">
        <nav aria-label="Migas de pan" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-caption text-ink-600">
            <li>
              <Link href="/" className="hover:text-primary">Inicio</Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li>
              <Link href="/vehiculos" className="hover:text-primary">Vehículos</Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li>
              <Link href={`/vehiculos/${slug}`} className="hover:text-primary">
                {tituloCompleto}
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li aria-current="page" className="text-foreground">Financiamiento</li>
          </ol>
        </nav>

        <div className="mb-6">
          <p className="mb-1 font-label text-overline uppercase text-brand-sage">
            Financiamiento
          </p>
          <h1 className="font-heading text-h1 font-light">
            {titulo} <span className="tabular-nums">{vehiculo.anio}</span>
          </h1>
        </div>

        {/* Arriba: fotos + datos generales + precio (como en la ficha). */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="flex flex-col gap-6">
            <GaleriaVehiculo grupos={grupos} titulo={tituloCompleto} />

            <ul className="grid grid-cols-2 gap-4 rounded-xl bg-brand-sage/25 px-6 py-4 md:grid-cols-4">
              {franja.map(({ icon: Icon, valor, etiqueta }) => (
                <li key={etiqueta} className="flex items-center gap-2.5">
                  <Icon aria-hidden className="size-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block truncate font-label text-body-2 font-semibold">
                      {valor}
                    </span>
                    <span className="block text-caption text-ink-600">{etiqueta}</span>
                  </span>
                </li>
              ))}
            </ul>

            <section className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-4 font-heading text-h3 font-medium">Datos generales</h2>
              <dl className="grid gap-x-10 md:grid-cols-2">
                {datos
                  .filter(([, v]) => Boolean(v))
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                    >
                      <dt className="text-body-2 text-ink-600">{k}</dt>
                      <dd className="text-right font-label text-body-2 font-medium">{v}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-xl border border-border bg-card p-6">
              {vehiculo.mensualidad != null && (
                <>
                  <p className="text-caption text-ink-600">Desde</p>
                  <p className="whitespace-nowrap font-label text-h1 font-bold tabular-nums text-primary">
                    {mxn(vehiculo.mensualidad)}
                    <span className="ml-1 text-body-2 font-normal text-ink-600">/mes*</span>
                  </p>
                </>
              )}
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-4">
                <span className="text-body-2 text-ink-600">Precio de contado</span>
                <span className="font-label text-h4 font-bold tabular-nums">
                  {mxn(vehiculo.precio)}
                </span>
              </div>
              {vehiculo.meses != null && (
                <p className="mt-3 text-caption text-ink-600">
                  *Mensualidad estimada a {vehiculo.meses} meses con 30% de enganche.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Abajo: el stepper de la solicitud. */}
        <div className="mt-10">
          <FinanciamientoPageClient
            vehiculo={{
              id: vehiculo.id,
              marca: vehiculo.marca,
              modelo: vehiculo.modelo,
              anio: vehiculo.anio,
              color: vehiculo.color,
              precio: vehiculo.precio,
            }}
            valorAuto={precio}
            enganche={enganche}
            plazo={plazo}
          />
        </div>
      </div>
    </main>
  );
}
