import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Karla Moreno",
    date: "13 febrero 2023",
    text: "Lugar ideal para comprar mi primer auto. Mil opciones, la tienda se ve moderna.",
    initials: "KM",
  },
  {
    name: "Andrea Cruz",
    date: "4 Septiembre 2024",
    text: "Vendí mi auto y ayudó a mi mamá a vender el suyo. Todo el proceso fue rápido.",
    initials: "AC",
  },
  {
    name: "Salvador Luna",
    date: "31 julio 2024",
    text: "Me gustó la atención, el personal es amable y resuelven tus dudas. Revisé los autos sin presión.",
    initials: "SL",
  },
  {
    name: "Blanca Muñoz",
    date: "19 marzo 2024",
    text: "Tienen un gran inventario y garantizan una gran experiencia de compra.",
    initials: "BM",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-14 py-14">
      <h2 className="font-heading text-h2 font-normal text-foreground mb-6">Lo que opinan nuestros clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.name} className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-brand-aqua text-brand-ink font-label text-caption font-semibold">
                  {r.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-caption text-ink-600">{r.date}</p>
              </div>
              <Stars />
            </div>
            <p className="text-body-2 text-ink-800">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
