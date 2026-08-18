import { CheckCircle } from "lucide-react";

import { ArrowButton } from "@/components/ds";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Ritmo A-B-A: petróleo a los lados, tinta (el color más oscuro del DS) en
 * medio. La tercera usaba `bg-gradient-benefit-strong`, un degradado que se
 * desvanece a casi blanco sobre un fondo ya claro: quedaba lavada y rompía el
 * equilibrio de la fila.
 *
 * La del medio NO destaca sólo por color - eso se pierde en escala de grises y
 * con daltonismo. Lleva además el acento neón (que el DS define justamente como
 * «Highlight · destacar») en el icono y en la flecha, así que la jerarquía
 * sobrevive sin percepción de color.
 */
const promos = [
  {
    title: `Con ${APP_NAME} Crédito, paga a meses`,
    subtitle: "Elige entre más de 5,000 autos",
    cta: "Ver catálogo",
    surface: "bg-brand-petrol text-white",
    icon: "text-brand-aqua",
    subtle: "text-white/80",
    destacada: false,
  },
  {
    title: "Arranca el año con $600,000",
    subtitle: "Obtén un préstamo por tu auto, sin dejar de usarlo",
    cta: "Solicítalo ya",
    surface: "bg-brand-ink text-white",
    icon: "text-brand-neon",
    subtle: "text-white/80",
    destacada: true,
  },
  {
    title: "Cambia tu auto y recibe una mejor oferta",
    subtitle: "Desde $20,000 más por tu auto",
    cta: "Cotiza ahora",
    surface: "bg-brand-petrol text-white",
    icon: "text-brand-aqua",
    subtle: "text-white/80",
    destacada: false,
  },
];

export default function PromoCards() {
  return (
    <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 md:px-14">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {promos.map((promo) => (
          <article
            key={promo.title}
            /* Radio 20px = tarjetas del DS. Sistema plano: borde fino, sin
               sombras pesadas. */
            className={cn(
              "flex flex-col justify-between gap-5 rounded-xl p-5",
              promo.surface
            )}
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle
                aria-hidden
                className={cn("mt-0.5 size-5 shrink-0", promo.icon)}
              />
              <div>
                <h3 className="font-sans text-body-1 font-medium leading-snug">
                  {promo.title}
                </h3>
                <p className={cn("mt-1 text-caption", promo.subtle)}>
                  {promo.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-label text-label font-semibold">
                {promo.cta}
              </span>
              <ArrowButton
                tone="onDark"
                aria-label={promo.cta}
                className={cn(
                  "size-11",
                  // Segundo indicador de jerarquía, independiente del color de
                  // fondo: la flecha de la destacada va rellena en neón.
                  promo.destacada &&
                    "border-brand-neon bg-brand-neon text-brand-ink hover:bg-brand-neon/85 hover:text-brand-ink"
                )}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
