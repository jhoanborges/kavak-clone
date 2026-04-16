import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const filters = [
  "Busca por rango de precio",
  "Busca por año",
  "Busca por tracción",
  "Busca por marca",
  "Busca por sucursales",
  "Busca por ubicación",
  "Busca por color",
  "Busca por transmisión",
  "Busca por ofertas y oportunidades",
  "Busca por tipo",
  "Busca por tipo de combustible",
];

export default function SearchFilters() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-foreground mb-4">Continúa tu búsqueda</h2>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <Accordion type="single" collapsible>
          {filters.map((filter, i) => (
            <AccordionItem key={filter} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="px-5 text-sm font-medium text-foreground hover:no-underline hover:bg-muted/50 cursor-pointer">
                {filter}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                Selecciona una opción para filtrar los resultados.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
