import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Los tres logos tienen dimensiones intrínsecas DISTINTAS y ninguno es 3:1
 * (blanco 3.138, negro 2.843, verde 2.930). Antes se calculaba el ancho como
 * `height * 3` para los tres, lo que deformaba el logo - al negro lo estiraba
 * ~10% a lo ancho. El DS es explícito: nunca distorsionar la marca.
 *
 * Los valores salen de los propios PNG. Si se reemplaza un archivo, hay que
 * actualizarlos aquí.
 */
const LOGOS = {
  /** Principal · fondos claros */
  green: { src: "/brand/logo-verde.png", width: 1855, height: 633 },
  /** Monocromo · documentos, impresos */
  black: { src: "/brand/logo-negro.png", width: 1632, height: 574 },
  /** Inverso · fondos oscuros / petróleo */
  white: { src: "/brand/logo-blanco.png", width: 1202, height: 383 },
} as const;

/** Compatibilidad: sólo las rutas, por si alguien las necesita sueltas. */
const LOGO_SRC = {
  green: LOGOS.green.src,
  black: LOGOS.black.src,
  white: LOGOS.white.src,
} as const;

/**
 * Logo VALUE (Design System VALUE)
 * Tres presentaciones según el fondo. Nunca recolorear ni distorsionar:
 * área de protección mínima = altura de la "V" (aquí, `p-*` de quien lo usa).
 *
 * `height` fija el alto renderizado; el ancho lo deduce el navegador a partir
 * del ratio real gracias a `w-auto`. Controlar UNA sola dimensión por CSS es lo
 * que provocaba el aviso de next/image sobre el aspect ratio.
 */
function BrandLogo({
  tone = "green",
  height = 56,
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt" | "height" | "width"
> & {
  tone?: keyof typeof LOGOS;
  height?: number;
}) {
  const logo = LOGOS[tone];

  return (
    <Image
      src={logo.src}
      alt="VALUE Arrendadora"
      width={logo.width}
      height={logo.height}
      className={cn("w-auto object-contain", className)}
      style={{ height, width: "auto", ...style }}
      {...props}
    />
  );
}

export { BrandLogo, LOGO_SRC, LOGOS };
