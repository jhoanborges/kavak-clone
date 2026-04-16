import { CreditCard, Car, RefreshCw } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const benefits = [
  {
    icon: CreditCard,
    title: "Financia el auto que quieres",
    desc: "Aprobamos 6 de cada 10 créditos.",
  },
  {
    icon: Car,
    title: "Maneja y decide",
    desc: `Comprando tu auto ${APP_NAME} tienes 7 días o 300 km de prueba.`,
  },
  {
    icon: RefreshCw,
    title: "Más ofertas, más libertad",
    desc: `Compramos más autos que nunca, cambia tu auto con ${APP_NAME} y recibe un bono extra.`,
  },
];

export default function TrustSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center">
        Descubre por qué más de{" "}
        <span className="text-primary">300,000 clientes</span> ya confiaron en {APP_NAME}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((b) => (
          <div key={b.title} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl border border-border shadow-sm">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <b.icon className="size-5 text-primary" />
            </div>
            <p className="font-semibold text-foreground">{b.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
