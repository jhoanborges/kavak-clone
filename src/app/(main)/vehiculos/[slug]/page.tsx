import { notFound } from "next/navigation";

import CarDetailClient from "@/components/catalog/CarDetailClient";
import { CARS, carSlug, type Car } from "@/data/cars";
import { APP_NAME } from "@/lib/config";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return CARS.map((car) => ({ slug: carSlug(car) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = CARS.find((c) => carSlug(c) === slug);
  if (!car) return {};

  return buildMetadata({
    title: `${car.brand} ${car.model} ${car.year} — Seminuevo certificado`,
    description: `${car.brand} ${car.model} ${car.variant} ${car.year} con ${car.km.toLocaleString("es-MX")} km, ${car.transmission.toLowerCase()} y ${car.fuel.toLowerCase()}. $${car.price.toLocaleString("es-MX")} MXN o ${car.monthly.toLocaleString("es-MX")} al mes.`,
    path: `/vehiculos/${slug}`,
    images: [car.image],
  });
}

/**
 * Product + Offer: habilita el rich result de producto (precio, disponibilidad
 * y estado) en la SERP. `itemCondition: UsedCondition` es obligatorio para
 * seminuevos — sin él Google puede rechazar el marcado.
 */
function productJsonLd(car: Car, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.brand} ${car.model} ${car.variant} ${car.year}`,
    image: [car.image],
    description: `${car.brand} ${car.model} ${car.variant} ${car.year} seminuevo certificado con ${car.km.toLocaleString("es-MX")} km.`,
    sku: String(car.id),
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    itemCondition: "https://schema.org/UsedCondition",
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.km,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: absoluteUrl(`/vehiculos/${slug}`),
      seller: { "@type": "Organization", name: APP_NAME },
    },
  };
}

/** Breadcrumbs: Google los pinta en la SERP en lugar de la URL cruda. */
function breadcrumbJsonLd(car: Car, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compra un auto",
        item: absoluteUrl("/vehiculos"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${car.brand} ${car.model} ${car.year}`,
        item: absoluteUrl(`/vehiculos/${slug}`),
      },
    ],
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = CARS.find((c) => carSlug(c) === slug);
  if (!car) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(car, slug)),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(car, slug)),
        }}
      />
      <CarDetailClient car={car} allCars={CARS} />
    </>
  );
}
