/**
 * Logos de marca en public/marcas.
 *
 * El mapa es explícito porque las extensiones son mixtas y porque el nombre del
 * archivo no siempre coincide con lo que devuelve la API.
 *
 * FORMATO: SVG por defecto — es vectorial, nítido en cualquier densidad de
 * pantalla y más ligero que un ráster para formas planas. Convertirlo todo a
 * WebP sería un retroceso.
 *
 * La excepción son GMC y Peugeot: sus logos son cromados con 82 y 81 gradientes
 * (224 y 41 paths), o sea vectores imitando un degradado fotográfico. A 32x24px
 * ese detalle no se ve, y pesaban 84 KB y 44 KB YA optimizados. Rasterizados a
 * 192px de ancho quedan en 4.1 KB y 1.7 KB. Ahí el ráster sí gana.
 *
 * Para añadir una marca: deja el archivo en public/marcas con el slug como
 * nombre y añade la entrada aquí. Si la API la nombra distinto, añade también
 * un alias abajo.
 */
const ARCHIVOS: Record<string, string> = {
  audi: "audi.svg",
  bmw: "bmw.svg",
  chery: "chery.svg",
  chevrolet: "chevrolet.webp",
  fiat: "fiat.svg",
  ford: "ford.svg",
  gmc: "gmc.webp",
  honda: "honda.webp",
  hyundai: "hyundai.svg",
  jeep: "jeep.svg",
  kia: "kia.svg",
  "land-rover": "land-rover.svg",
  mazda: "mazda.webp",
  "mercedes-benz": "mercedes-benz.svg",
  mg: "mg.svg",
  mitsubishi: "mitsubishi.svg",
  nissan: "nissan.svg",
  peugeot: "peugeot.webp",
  toyota: "toyota.svg",
  volkswagen: "volkswagen.webp",
};

/**
 * Nombres de la API que no coinciden con el archivo.
 *
 * La API llama "CHIREY" a la marca; el nombre correcto es Chery, que es como
 * se llama el archivo. Se traduce aquí en vez de tocar el dato de origen.
 */
const ALIAS: Record<string, string> = {
  chirey: "chery",
};

/** Normaliza el nombre que da la API al formato de slug. */
export function marcaSlug(marca: string): string {
  const slug = marca
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return ALIAS[slug] ?? slug;
}

/** Ruta del logo, o `null` si no lo tenemos. Nunca devuelve una ruta rota. */
export function marcaLogo(marca: string): string | null {
  const archivo = ARCHIVOS[marcaSlug(marca)];
  return archivo ? `/marcas/${archivo}` : null;
}
