/**
 * Estilos de campo compartidos entre formularios.
 *
 * Existe porque /cotizar y /contacto habían divergido: uno usaba el componente
 * `Input` de shadcn (radio 10px, `bg-card`, `text-body-2`) y el otro una cadena
 * suelta con `rounded-xl` —el radio de TARJETA, 20px—, `bg-white` y `text-sm`.
 * Dos formularios del mismo sitio con cajas de distinto tamaño y esquina.
 *
 * Cualquier campo nuevo debe partir de aquí. Si hay que cambiar el aspecto de
 * los inputs, se cambia en este archivo y no en cada página.
 */
import { cn } from "@/lib/utils";

/**
 * Alto y tipografía comunes. Se pasa como `className` al componente `Input`,
 * que ya aporta el radio, el borde y el anillo de foco del sistema.
 *
 * `px-4` pisa el `px-2.5` que trae `Input` por defecto: 10px de sangría en una
 * caja de 48px de alto deja el texto pegado al borde, y además dejaba los
 * `<input>` desalineados respecto a los `<select>` de la misma página.
 */
export const CAMPO = "h-12 bg-card px-4 text-body-2 transition-colors";

/** Marca visual de error. El estado accesible va en `aria-invalid`, no aquí. */
export const CAMPO_ERROR =
  "border-destructive focus-visible:ring-destructive/30";

/**
 * Para `<select>` y `<textarea>` nativos, que no pasan por el componente
 * `Input`. Replica lo que éste renderiza — radio 10px, borde y anillo de foco —
 * para que las tres cajas se vean iguales.
 */
export const CAMPO_NATIVO = cn(
  "w-full min-w-0 rounded-lg border border-input bg-card px-4 text-body-2 text-foreground",
  "outline-none transition-colors placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

/** `<select>`: base nativa + alto y la flecha propia del navegador desactivada. */
export const CAMPO_SELECT = cn(
  CAMPO_NATIVO,
  "h-12 cursor-pointer appearance-none"
);

/** `<textarea>`: base nativa, sin alto fijo y sin tirador de redimensión. */
export const CAMPO_TEXTAREA = cn(CAMPO_NATIVO, "resize-none py-3");

/**
 * Etiqueta del campo, con los tokens del design system: `font-label` (Raleway)
 * y `text-label` (14px con su interlineado), no un `text-sm` suelto.
 *
 * En `text-foreground`, no en `text-muted-foreground`: /cotizar las tenía a
 * 12px en gris sobre fondo gris —por debajo del 4.5:1 de WCAG AA— y una
 * etiqueta ilegible convierte el formulario en adivinanza.
 */
export const ETIQUETA = "font-label text-label font-medium text-foreground";

/**
 * Texto de ayuda bajo el campo. `text-caption` (13px) en vez de `text-xs`
 * (12px) por lo mismo: es el token del sistema.
 *
 * `text-muted-foreground`, no `text-ink-600`. Hoy valen igual (#5c676e), pero
 * el token semántico es el que se aclara en modo oscuro; el literal se queda
 * fijo y desaparece contra el fondo.
 */
export const AYUDA = "text-caption text-muted-foreground";
export const ERROR = "text-caption text-destructive leading-tight";

/** Separación vertical entre etiqueta, control y ayuda. */
export const CAMPO_STACK = "flex flex-col gap-1.5";
