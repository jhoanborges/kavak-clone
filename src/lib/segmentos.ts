/**
 * Silueta por carrocería para el filtro "Tipo".
 *
 * Las imágenes ya estaban en public/models (las usa <CarTypes> en el home), así
 * que se reutilizan en lugar de duplicar assets.
 *
 * La clave es el nombre normalizado del segmento tal como lo devuelve la API.
 * Si aparece uno nuevo, `segmentoIcono()` devuelve null y la opción se pinta
 * sólo con su texto: nunca una imagen rota.
 */
const ICONOS: Record<string, string> = {
  suvs: "/models/suv.png",
  suv: "/models/suv.png",
  camionetas: "/models/pickup.png",
  camioneta: "/models/pickup.png",
  pickup: "/models/pickup.png",
  sedan: "/models/sedan.png",
  coupe: "/models/coupe.png",
  hatchback: "/models/hatchback.png",
  minivan: "/models/minivan.png",
  convertible: "/models/convertible.png",
};

function normalizar(segmento: string): string {
  return segmento
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

export function segmentoIcono(segmento: string): string | null {
  return ICONOS[normalizar(segmento)] ?? null;
}
