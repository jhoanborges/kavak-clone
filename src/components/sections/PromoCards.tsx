import { ArrowRight, CheckCircle } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const promos = [
  {
    bg: "bg-primary",
    text: "text-white",
    title: `Con ${APP_NAME} Crédito, paga a meses`,
    subtitle: "Fija entre más de 5,000 autos",
    cta: "Ver catálogo",
    ctaStyle: "bg-white/20 hover:bg-white/30 text-white",
    accent: "text-white/90",
  },
  {
    bg: "bg-emerald-600",
    text: "text-white",
    title: "Arranca el año con $600,000",
    subtitle: "Obtén un préstamo por tu auto, sin dejar de usarlo",
    cta: "Solicítalo ya",
    ctaStyle: "bg-white/20 hover:bg-white/30 text-white",
    accent: "text-white/90",
  },
  {
    bg: "bg-sky-500",
    text: "text-white",
    title: "Cambia tu auto y recibe una mejor oferta",
    subtitle: "Desde $20,000 más por tu auto",
    cta: "Cotiza ahora",
    ctaStyle: "bg-white/20 hover:bg-white/30 text-white",
    accent: "text-white/90",
  },
];

export default function PromoCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map((promo) => (
          <div
            key={promo.title}
            className={[
              "rounded-2xl p-5 flex flex-col gap-3 shadow-lg",
              promo.bg,
              promo.text,
            ].join(" ")}
          >
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 mt-0.5 opacity-80 shrink-0" />
              <div>
                <p className="font-bold text-sm leading-tight">{promo.title}</p>
                <p className={["text-xs mt-0.5 leading-snug", promo.accent].join(" ")}>
                  {promo.subtitle}
                </p>
              </div>
            </div>
            <button
              className={[
                "self-start flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer",
                promo.ctaStyle,
              ].join(" ")}
            >
              {promo.cta}
              <ArrowRight className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
