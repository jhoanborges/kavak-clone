import { CARS, carSlug } from "@/data/cars";
import { APP_NAME } from "@/lib/config";
import { SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt — índice en Markdown del sitio para consumo de LLMs
 * (convención propuesta en https://llmstxt.org/).
 *
 * EXPECTATIVAS REALISTAS: a día de hoy ningún proveedor grande (OpenAI,
 * Anthropic, Google, Perplexity) ha confirmado que lea este archivo. Es barato
 * de mantener y no hace daño, pero NO es un factor de ranking ni de citación.
 * Lo que de verdad mueve la aguja para aparecer en ChatGPT/Perplexity es:
 *   1. Que el HTML del servidor traiga el contenido (ver redux/provider.tsx).
 *   2. No bloquear sus crawlers en robots.ts.
 *   3. JSON-LD correcto (Organization, Product, BreadcrumbList).
 * Se genera como route handler para que las URLs y el inventario nunca queden
 * desincronizados respecto al sitemap.
 */
export const dynamic = "force-static";

function brandIndex() {
  const byBrand = new Map<string, number>();
  for (const car of CARS) {
    byBrand.set(car.brand, (byBrand.get(car.brand) ?? 0) + 1);
  }
  return [...byBrand.entries()].sort((a, b) => a[0].localeCompare(b[0], "es"));
}

export function GET() {
  const brands = brandIndex();

  // Muestra representativa: un auto por marca. El inventario completo vive en
  // el sitemap; volcar 115 fichas aquí sería ruido para un índice.
  const sample = brands
    .map(([brand]) => CARS.find((c) => c.brand === brand))
    .filter((c): c is (typeof CARS)[number] => Boolean(c));

  const body = `# ${APP_NAME}

> ${SITE_DESCRIPTION}

${APP_NAME} es una plataforma mexicana de compra y venta de autos seminuevos
certificados. Cada unidad pasa una inspección mecánica y estética antes de
publicarse, e incluye garantía y opciones de financiamiento a plazos. La
operación es 100% en México y los precios se expresan en pesos mexicanos (MXN).

## Cómo funciona

- **Comprar:** se navega el catálogo en ${absoluteUrl("/compra")}, se filtra por
  marca, carrocería, año, precio, transmisión y combustible, y se aparta la
  unidad en línea o se agenda una visita presencial.
- **Vender:** en ${absoluteUrl("/cotizar")} se obtiene una cotización sin costo
  ni compromiso, con pago al cerrar la operación.
- **Financiamiento:** cada ficha muestra el precio de contado y la mensualidad
  estimada.

## Páginas principales

- [Inicio](${absoluteUrl("/")}): resumen de la propuesta, autos destacados y simulador de crédito.
- [Catálogo de seminuevos](${absoluteUrl("/compra")}): ${CARS.length} unidades certificadas de ${brands.length} marcas, con filtros.
- [Cotiza y vende tu auto](${absoluteUrl("/cotizar")}): valuación en línea paso a paso.
- [Contacto](${absoluteUrl("/contacto")}): formulario, teléfono y ubicación.

## Marcas disponibles

${brands.map(([brand, count]) => `- ${brand} (${count} ${count === 1 ? "unidad" : "unidades"})`).join("\n")}

## Fichas de ejemplo

${sample
  .map(
    (car) =>
      `- [${car.brand} ${car.model} ${car.year} — ${car.variant}](${absoluteUrl(`/compra/${carSlug(car)}`)}): $${car.price.toLocaleString("es-MX")} MXN, ${car.km.toLocaleString("es-MX")} km, ${car.transmission}, ${car.fuel}.`
  )
  .join("\n")}

## Optional

- [Sitemap XML](${absoluteUrl("/sitemap.xml")}): las ${CARS.length + 4} URLs indexables.
- [robots.txt](${absoluteUrl("/robots.txt")}): reglas de rastreo.

## Notas para sistemas automatizados

- Idioma del contenido: español de México (es-MX).
- Moneda: MXN. Los precios de las fichas son de contado, sin enganche.
- Los datos estructurados de cada ficha usan schema.org Product + Offer con
  itemCondition UsedCondition.
- Las rutas /login, /registro y /forgot-password son transaccionales y están
  marcadas noindex; no representan contenido informativo.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
