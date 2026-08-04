import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT, telHref, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

type DudasBannerSlots = "titulo" | "descripcion" | "imagen";

/**
 * CTA de contacto.
 *
 * Antes era una barra con un texto y una flecha. Como llamada a la acción no
 * funcionaba: "¿Tienes más dudas?" no dice qué pasa al pulsar, la flecha
 * suelta no anuncia destino, y no había ningún motivo para actuar ahora.
 *
 * Esta versión aplica lo que sí hace convertir:
 *  - Una acción PRIMARIA clara, y una secundaria de menor peso. Antes había un
 *    solo destino ambiguo.
 *  - Verbo concreto en el botón ("Escribir por WhatsApp"), no "Enviar".
 *  - Reduce la fricción diciendo qué se resuelve y que no hay compromiso.
 *  - Señal de disponibilidad (horario): saber que alguien contesta hoy es lo
 *    que empuja a escribir ahora en vez de "luego".
 *  - Fotografía de una persona. Un CTA de "habla con alguien" sobre un
 *    rectángulo de color pide confiar en una abstracción.
 *
 * Los canales se adaptan a lo que haya en .env: sin WhatsApp configurado, la
 * acción primaria pasa a ser el formulario. Nunca se pinta un botón muerto.
 */
function DudasBanner({
  href = "/contacto",
  titulo = "¿Te queda alguna duda?",
  descripcion = "Un asesor resuelve tus preguntas sobre financiamiento, garantía y entrega. Sin compromiso.",
  imagen = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=900&q=80",
  className,
  classNames,
}: {
  href?: string;
  titulo?: React.ReactNode;
  descripcion?: React.ReactNode;
  /** Foto de apoyo. `null` la omite y el bloque ocupa todo el ancho. */
  imagen?: string | null;
  className?: string;
  classNames?: Partial<Record<DudasBannerSlots, string>>;
}) {
  const hayWhatsapp = Boolean(CONTACT.whatsapp);
  const hayTelefono = Boolean(CONTACT.phone);

  return (
    <section
      className={cn(
        "relative isolate grid overflow-hidden rounded-xl bg-brand-ink text-white",
        imagen ? "md:grid-cols-[1fr_38%]" : "",
        className
      )}
    >
      {/* Blob petróleo: el mismo recurso del footer y los héroes del DS. */}
      <div
        aria-hidden
        className="absolute -bottom-56 -left-24 -z-10 size-[520px] rounded-[50%] bg-brand-petrol"
      />

      <div className="flex flex-col gap-6 p-8 md:p-12">
        <div>
          <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
            Estamos para ayudarte
          </p>
          <h2
            className={cn(
              "max-w-[520px] font-heading text-h2 font-light",
              classNames?.titulo
            )}
          >
            {titulo}
          </h2>
          <p
            className={cn(
              "mt-4 max-w-[460px] text-body-1 text-white/85",
              classNames?.descripcion
            )}
          >
            {descripcion}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hayWhatsapp ? (
            <>
              <Button size="cta" asChild>
                <a
                  href={whatsappHref(
                    CONTACT.whatsapp,
                    "Hola, tengo una duda sobre un seminuevo."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle data-icon="inline-start" />
                  Escribir por WhatsApp
                </a>
              </Button>
              <Button variant="onDark" size="cta" asChild>
                <Link href={href}>
                  Enviar un mensaje
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="cta" asChild>
                <Link href={href}>
                  Enviar un mensaje
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              {hayTelefono && (
                <Button variant="onDark" size="cta" asChild>
                  <a href={telHref(CONTACT.phone)}>
                    <Phone data-icon="inline-start" />
                    {CONTACT.phone}
                  </a>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Disponibilidad: saber que alguien contesta hoy es lo que convierte
            "luego lo veo" en "escribo ahora". */}
        <p className="flex items-center gap-2 text-caption text-brand-aqua">
          <Clock aria-hidden className="size-4" />
          Lunes a viernes, 9:00 a 18:00 h
        </p>
      </div>

      {imagen && (
        <div className={cn("relative min-h-[220px] md:min-h-full", classNames?.imagen)}>
          <Image
            src={imagen}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 38vw"
            className="object-cover"
          />
          {/* Degradado hacia la tinta: funde la foto con el bloque en vez de
              dejar un corte duro, y garantiza el contraste del texto si la
              columna se estrecha. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/40 to-transparent md:bg-gradient-to-r"
          />
        </div>
      )}
    </section>
  );
}

export { DudasBanner };
