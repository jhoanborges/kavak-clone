/**
 * Logos de marca disponibles en public/marcas.
 *
 * El inventario lo decide la API, no este archivo: hoy devuelve 18 marcas y
 * aquí sólo hay 6 logos. Por eso `marcaLogo()` puede devolver `null` y quien lo
 * use DEBE tener un fallback textual — si no, esas marcas quedarían invisibles.
 *
 * Para añadir una: deja el .webp en public/marcas con el nombre normalizado
 * (minúsculas, sin acentos, guiones en lugar de espacios) y añádelo al Set.
 * Ej. "MERCEDES BENZ" → mercedes-benz.webp
 */
const LOGOS_DISPONIBLES = new Set([
  "chevrolet",
  "honda",
  "kia",
  "mazda",
  "nissan",
  "volkswagen",
]);

/** Normaliza el nombre que da la API al formato de archivo. */
export function marcaSlug(marca: string): string {
  return marca
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Ruta del logo, o `null` si no lo tenemos. Nunca devuelve una ruta rota. */
export function marcaLogo(marca: string): string | null {
  const slug = marcaSlug(marca);
  return LOGOS_DISPONIBLES.has(slug) ? `/marcas/${slug}.webp` : null;
}
