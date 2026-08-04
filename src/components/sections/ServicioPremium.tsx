import Image from "next/image";

import { SectionHeading } from "@/components/ds";
import { APP_NAME } from "@/lib/config";

/**
 * Iconos de marca en public/icons (1.svg … 5.svg), 42×42, entregados por
 * diseño. Traen sus propios colores y están pensados para fondo blanco, así
 * que van directos sobre la tarjeta, sin círculo de color detrás: encerrarlos
 * en un fondo aqua aplastaría su acento verde.
 *
 * Sólo hay CINCO iconos distintos: de los seis archivos entregados, dos eran
 * copias byte a byte del mismo (`home-choose-02`). Por decisión de producto la
 * sexta tarjeta reutiliza el icono 4.
 */
type Servicio = { src: string; title: string; desc: string };

const SERVICIOS: Servicio[] = [
  {
    src: "/icons/1.svg",
    title: "Atención personalizada",
    desc: "Durante más de 30 años hemos mantenido una sólida presencia en toda la República Mexicana, siendo reconocidos por nuestra atención.",
  },
  {
    src: "/icons/2.svg",
    title: "Financiamiento a la medida",
    desc: "Nuestra área de créditos ofrece asesoramiento especializado para lograr un financiamiento óptimo para cada persona.",
  },
  {
    src: "/icons/3.svg",
    title: "Inspección a fondo",
    desc: `Ten la tranquilidad de que el equipo ${APP_NAME}, junto con especialistas externos, inspecciona los 25 puntos más importantes de cada auto.`,
  },
  {
    src: "/icons/4.svg",
    title: "Servicio post venta",
    desc: "Nuestro servicio no termina al comprar tu auto: estamos para apoyarte en cualquier circunstancia relacionada con él.",
  },
  {
    src: "/icons/5.svg",
    title: "Cliente satisfecho",
    desc: "Tu satisfacción es nuestra prioridad. Estamos aquí para ayudarte en cualquier momento. ¡Gracias por elegirnos!",
  },
  {
    // Reutiliza el icono de "Servicio post venta" por decisión de producto:
    // sólo llegaron cinco iconos distintos. Si algún día hay un 6.svg propio,
    // basta con cambiar esta ruta.
    src: "/icons/4.svg",
    title: "Conocemos tu auto",
    desc: "Tenemos un historial de mantenimiento detallado de cada auto, así aseguramos la entrega en óptimas condiciones.",
  },
];

export default function ServicioPremium() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <SectionHeading
        overline="Nuestro servicio"
        title="Servicio premium"
        lead="Te acompañamos desde el primer contacto hasta la entrega y el seguimiento de tu auto."
      />

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICIOS.map((servicio) => (
          <li
            key={servicio.title}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-[42px] shrink-0 items-center justify-center">
                <Image
                  src={servicio.src}
                  alt=""
                  width={42}
                  height={42}
                  className="size-[42px]"
                />
              </span>
              <h3 className="font-heading text-h4 font-medium text-brand-petrol">
                {servicio.title}
              </h3>
            </div>
            <p className="text-body-2 text-ink-800">{servicio.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
