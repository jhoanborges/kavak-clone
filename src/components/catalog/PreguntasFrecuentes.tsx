import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Faq = { pregunta: string; respuesta: React.ReactNode };

/** FAQs por defecto de la ficha de vehículo (portadas del sitio original). */
export const FAQS_VEHICULO: Faq[] = [
  {
    pregunta: "¿Puedo comprar un auto de contado?",
    respuesta:
      "Sí, puedes comprar un auto de contado. Te invitamos a comunicarte con un asesor para obtener más información.",
  },
  {
    pregunta: "¿Puedo comprar un auto en línea?",
    respuesta:
      "No puedes comprar un auto en línea. Sin embargo, te invitamos a agendar una cita para completar tu compra en persona.",
  },
  {
    pregunta: "¿Es seguro comprar un auto usado?",
    respuesta:
      "Nosotros nos encargamos de revisar cada auto que entra a nuestro inventario, asegurándonos de que esté en las mejores condiciones. De igual manera te invitamos a revisar el historial del auto y a realizar una inspección antes de comprar.",
  },
];

type Props = {
  faqs?: Faq[];
  /** Índice del panel abierto al cargar. El original abre el tercero. */
  abiertoPorDefecto?: number;
  titulo?: string;
  className?: string;
};

/**
 * Sección de preguntas frecuentes. Reutiliza el accordion del design system;
 * acepta cualquier lista de FAQs, con FAQS_VEHICULO como valor por defecto.
 */
export function PreguntasFrecuentes({
  faqs = FAQS_VEHICULO,
  abiertoPorDefecto = 2,
  titulo = "Preguntas frecuentes",
  className,
}: Props) {
  if (faqs.length === 0) return null;

  const idDe = (i: number) => `faq-${i}`;
  const abierto = faqs[abiertoPorDefecto] ? idDe(abiertoPorDefecto) : undefined;

  return (
    <section
      className={
        "rounded-xl border border-border bg-card p-6 md:p-8" +
        (className ? ` ${className}` : "")
      }
    >
      <h2 className="mb-4 font-heading text-h3 font-medium">{titulo}</h2>

      <Accordion type="single" collapsible defaultValue={abierto}>
        {faqs.map((faq, i) => (
          <AccordionItem
            key={idDe(i)}
            value={idDe(i)}
            className="border-border"
          >
            <AccordionTrigger className="font-label text-body-1 font-medium hover:no-underline">
              {faq.pregunta}
            </AccordionTrigger>
            <AccordionContent className="text-body-2 text-ink-600">
              {faq.respuesta}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
