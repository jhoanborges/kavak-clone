import Image from "next/image";
import { CalendarCheck, Clock, MessageCircle, ShieldCheck } from "lucide-react";

import { AgendarFlow } from "@/components/agendar/AgendarFlow";
import { DudasBanner } from "@/components/ds";
import { decodeVehiculoId } from "@/lib/api/id-publico";
import { fetchVehiculoPorId } from "@/lib/api/vehiculos";
import { buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ vehiculo?: string | string[] }> };

export const metadata = buildMetadata({
  title: "Agendar una cita",
  description:
    "Déjanos tus datos y un asesor te contacta para agendar tu cita y resolver tus dudas.",
  path: "/agendar",
  // Paso de un embudo: no aporta nada al índice y crea una URL por vehículo.
  noindex: true,
});

const PROMESAS = [
  {
    icon: Clock,
    titulo: "Respuesta el mismo día",
    texto: "Un asesor te contacta en horario hábil, por el medio que elijas.",
  },
  {
    icon: ShieldCheck,
    titulo: "Sin compromiso",
    texto: "Agendar no te obliga a nada. Resolvemos dudas y tú decides.",
  },
  {
    icon: CalendarCheck,
    titulo: "Tú eliges cuándo",
    texto: "Acordamos día y hora según tu disponibilidad, no la nuestra.",
  },
];

export default async function AgendarPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = Array.isArray(params.vehiculo)
    ? params.vehiculo[0]
    : params.vehiculo;

  // El contexto del vehículo es opcional: se puede llegar desde una ficha o
  // desde cualquier CTA suelto.
  const id = token ? decodeVehiculoId(token) : null;
  const { vehiculo } = id ? await fetchVehiculoPorId(id) : { vehiculo: null };

  const resumen = vehiculo
    ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio ?? ""}`.trim()
    : undefined;

  return (
    <main className="flex-1 bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-14">
        {/*
          Dos columnas: a la izquierda lo que NO cambia entre pasos, a la
          derecha el formulario. El panel fijo sostiene el motivo para terminar
          el embudo mientras la parte interactiva avanza — un formulario suelto
          en una página vacía no da ninguna razón para seguir.
        */}
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          <aside className="flex flex-col gap-6 overflow-hidden rounded-xl bg-brand-petrol p-8 text-white lg:sticky lg:top-6">
            <div>
              <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
                Agenda tu cita
              </p>
              <h2 className="font-heading text-h3 font-medium">
                Te acompañamos en cada paso
              </h2>
              <p className="mt-3 text-body-2 text-white/80">
                Déjanos tus datos y un asesor se pone en contacto para coordinar
                la visita.
              </p>
            </div>

            {/* Si viene de una ficha, la unidad se muestra con su foto: mantiene
                presente por qué se empezó el proceso. */}
            {vehiculo && (
              <div className="flex items-center gap-4 rounded-lg bg-white/10 p-3">
                {vehiculo.imagenes[0] && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-brand-ink/40">
                    <Image
                      src={vehiculo.imagenes[0]}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-label text-label font-semibold">
                    {resumen}
                  </p>
                  <p className="truncate text-caption text-white/70">
                    {vehiculo.version}
                  </p>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-5">
              {PROMESAS.map(({ icon: Icon, titulo, texto }) => (
                <li key={titulo} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-4xl bg-white/15">
                    <Icon aria-hidden className="size-4 text-brand-neon" />
                  </span>
                  <div>
                    <p className="font-label text-label font-semibold">
                      {titulo}
                    </p>
                    <p className="mt-0.5 text-caption text-white/75">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-auto flex items-center gap-2 border-t border-white/15 pt-5 text-caption text-brand-aqua">
              <MessageCircle aria-hidden className="size-4 shrink-0" />
              Lunes a viernes, 9:00 a 18:00 h
            </p>
          </aside>

          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <AgendarFlow vehiculoId={vehiculo?.id} resumen={resumen} />
          </div>
        </div>

        <div className="pt-14">
          <DudasBanner />
        </div>
      </div>
    </main>
  );
}
