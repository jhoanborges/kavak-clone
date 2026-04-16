import { CARS } from "@/data/cars";
import { notFound } from "next/navigation";
import CarDetailClient from "@/components/catalog/CarDetailClient";

function toSlug(car: { brand: string; model: string; id: number }) {
  return `${car.brand}-${car.model}-${car.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function generateStaticParams() {
  return CARS.map((car) => ({ slug: toSlug(car) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = CARS.find((c) => toSlug(c) === slug);
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model} ${car.year} — Seminuevo certificado`,
    description: `${car.brand} ${car.model} ${car.variant} ${car.year} con ${car.km.toLocaleString("es-MX")} km. Precio: $${car.price.toLocaleString("es-MX")} MXN.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = CARS.find((c) => toSlug(c) === slug);
  if (!car) notFound();

  return <CarDetailClient car={car} allCars={CARS} />;
}
