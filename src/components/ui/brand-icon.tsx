import { siFacebook, siInstagram, siX } from "simple-icons";

import type { SocialKey } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Iconos de marca para las redes sociales.
 *
 * lucide-react v1 eliminó todos los iconos de marca (política de marcas
 * registradas), así que los glifos vienen de `simple-icons`, que es la fuente
 * canónica y mantiene los trazos oficiales.
 *
 * LinkedIn tampoco está ahí - lo retiraron a petición de LinkedIn - así que se
 * dibuja como marca tipográfica "in", que es exactamente lo que es su logo.
 * Inventar el trazo de memoria daría un glifo deforme.
 */
const PATHS: Partial<Record<SocialKey, string>> = {
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  x: siX.path,
};

export function BrandIcon({
  name,
  className,
}: {
  name: SocialKey;
  className?: string;
}) {
  const path = PATHS[name];

  if (!path) {
    return (
      <span
        aria-hidden
        className={cn(
          "font-label text-label font-bold lowercase leading-none",
          className
        )}
      >
        in
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      // currentColor: el icono hereda el color del contenedor, así funciona
      // igual sobre tinta que sobre aqua en hover.
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path d={path} />
    </svg>
  );
}
