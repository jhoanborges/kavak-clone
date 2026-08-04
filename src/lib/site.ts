/**
 * Datos de marca configurables por entorno: redes sociales y contacto.
 * Un solo sitio para cambiarlos sin tocar componentes (ver .env.*).
 *
 * Todo lo que venga vacío se filtra: el footer y /contacto sólo pintan lo que
 * tenga valor, así que dejar una red sin llenar no deja un icono muerto.
 */

/** Sólo estas cuatro. No añadir más sin pedirlo. */
export type SocialKey = "facebook" | "instagram" | "x" | "linkedin";

export type SocialLink = { key: SocialKey; label: string; href: string };

const RAW_SOCIALS: Array<{ key: SocialKey; label: string; href?: string }> = [
  { key: "facebook", label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK },
  { key: "instagram", label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM },
  { key: "x", label: "X", href: process.env.NEXT_PUBLIC_X },
  { key: "linkedin", label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN },
];

/** Sólo las redes que tienen URL configurada. */
export const SOCIALS: SocialLink[] = RAW_SOCIALS.filter(
  (s): s is SocialLink => Boolean(s.href)
);

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
} as const;

/**
 * Enlaces legales. Viven en el sitio corporativo de Value, no aquí: son
 * documentos con validez jurídica y duplicarlos garantiza que un día queden
 * desincronizados. Se abren en pestaña nueva para no sacar al usuario del flujo.
 * Los vacíos no se renderizan.
 */
export const LEGAL: Array<{ label: string; href: string }> = [
  { label: "Términos y condiciones", href: process.env.NEXT_PUBLIC_LEGAL_TERMINOS ?? "" },
  { label: "Aviso de privacidad", href: process.env.NEXT_PUBLIC_LEGAL_PRIVACIDAD ?? "" },
].filter((l) => Boolean(l.href));

/** `tel:` limpio a partir del teléfono con formato. */
export const telHref = (phone: string) =>
  `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Enlace a WhatsApp (wa.me exige sólo dígitos). */
export const whatsappHref = (phone: string, text?: string) => {
  const digits = phone.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
};
