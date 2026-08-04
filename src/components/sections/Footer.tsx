import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { BrandLogo } from "@/components/ds";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/config";
import { CONTACT, LEGAL, SOCIALS, telHref } from "@/lib/site";

const NAV = {
  Explora: [
    { label: "Compra un auto", href: "/vehiculos" },
    { label: "Vende tu auto", href: "/cotizar" },
    { label: "Ubicaciones", href: "/ubicaciones" },
    { label: "Blog", href: "/blog" },
  ],
  Nosotros: [
    { label: "Quiénes somos", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative isolate mt-8 overflow-hidden bg-brand-ink text-brand-mist">
      {/* Blob petróleo del Figma */}
      <div
        aria-hidden
        className="absolute -bottom-[260px] -left-10 -z-10 h-[420px] w-[900px] rounded-[50%] bg-brand-petrol"
      />

      <div className="mx-auto max-w-7xl px-6 pt-14 pb-6 md:px-14">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo tone="white" height={48} />
            <p className="mt-4 max-w-xs text-caption leading-relaxed text-brand-sage">
              Seminuevos certificados con revisión de 240 puntos, garantía
              incluida y financiamiento a tu medida.
            </p>
          </div>

          {Object.entries(NAV).map(([heading, items]) => (
            <nav key={heading} aria-labelledby={`footer-${heading}`}>
              <p
                id={`footer-${heading}`}
                className="mb-3 font-label text-overline uppercase text-white"
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-body-2 text-brand-sage transition-colors hover:text-brand-neon"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="mb-3 font-label text-overline uppercase text-white">
              Contacto
            </p>
            <ul className="flex flex-col gap-2 text-body-2">
              {CONTACT.phone && (
                <li className="flex items-center gap-2">
                  <Phone aria-hidden className="size-4 shrink-0 text-brand-aqua" />
                  <a
                    href={telHref(CONTACT.phone)}
                    className="text-brand-sage transition-colors hover:text-brand-neon"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
              )}
              {CONTACT.email && (
                <li className="flex items-center gap-2">
                  <Mail aria-hidden className="size-4 shrink-0 text-brand-aqua" />
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-brand-sage transition-colors hover:text-brand-neon"
                  >
                    {CONTACT.email}
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/ubicaciones"
                  className="text-brand-sage transition-colors hover:text-brand-neon"
                >
                  Ver todas las oficinas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador y bloque van juntos: si no hay redes configuradas, sin
            esta condición quedaban dos divisores seguidos con un hueco vacío
            en medio. */}
        {SOCIALS.length > 0 && (
          <>
            <Separator className="mb-6 bg-sidebar-border" />
            <ul className="mb-6 flex gap-3">
              {SOCIALS.map(({ key, label, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-4xl bg-brand-petrol text-brand-mist transition-colors hover:bg-brand-aqua hover:text-brand-ink"
                  >
                    <BrandIcon name={key} />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator className="mb-4 bg-sidebar-border" />

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-brand-sage">
          <span>
            Copyright © {new Date().getFullYear()} {APP_NAME}. Todos los derechos
            reservados.
          </span>
          {/* Legales: viven en el sitio corporativo de Value (URLs por .env).
              Se abren en pestaña nueva para no romper el flujo de compra. */}
          {LEGAL.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-neon"
            >
              {label}
            </a>
          ))}
          <Link href="/sitemap.xml" className="transition-colors hover:text-brand-neon">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
