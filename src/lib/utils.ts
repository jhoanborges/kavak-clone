import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge extendido con los tokens propios del Design System.
 *
 * POR QUÉ HACE FALTA: tailwind-merge sólo resuelve conflictos entre clases que
 * conoce. Nuestros roles tipográficos (`text-body-2`, `text-h3`, …) y familias
 * (`font-heading`, `font-label`) se definen en @theme, así que de fábrica los
 * clasificaba mal -`text-body-2` como COLOR de texto- y al fusionar eliminaba
 * el color real.
 *
 * Síntoma que provocó: `<Button size="cta">` quedaba con `bg-primary` pero sin
 * `text-primary-foreground`, es decir texto oscuro sobre petróleo oscuro. El
 * botón compilaba, pasaba el lint y era ilegible.
 *
 * Al declarar los grupos, `text-body-2` (tamaño) y `text-primary-foreground`
 * (color) pasan a ser dimensiones distintas y conviven.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Roles tipográficos del DS - son font-size, no color.
      "font-size": [
        {
          text: [
            "display-l",
            "h1",
            "h2",
            "h3",
            "h4",
            "body-1",
            "body-2",
            "caption",
            "label",
            "overline",
          ],
        },
      ],
      // Familias del DS - son font-family, no font-weight.
      "font-family": [{ font: ["heading", "label", "museo", "avenir"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
