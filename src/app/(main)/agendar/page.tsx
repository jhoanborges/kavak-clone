import { AgendarFlow } from "@/components/agendar/AgendarFlow";
import { fetchVehiculoPorId } from "@/lib/api/vehiculos";
import { decodeVehiculoId } from "@/lib/api/id-publico";
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

export default async function AgendarPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = Array.isArray(params.vehiculo)
    ? params.vehiculo[0]
    : params.vehiculo;

  // El contexto del vehículo es opcional: se puede llegar aquí desde una ficha
  // o desde cualquier CTA suelto.
  const id = token ? decodeVehiculoId(token) : null;
  const { vehiculo } = id
    ? await fetchVehiculoPorId(id)
    : { vehiculo: null };

  const resumen = vehiculo
    ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio ?? ""}`.trim()
    : undefined;

  return (
    <main className="flex-1 bg-muted px-6 py-14 md:px-14">
      <AgendarFlow vehiculoId={vehiculo?.id} resumen={resumen} />
    </main>
  );
}
