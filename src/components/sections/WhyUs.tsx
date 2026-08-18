import { ShieldCheck, CreditCard, Wrench, RefreshCw } from "lucide-react";

const stats = [
  { value: "+300K", label: "Clientes satisfechos" },
  { value: "240", label: "Puntos de revisión" },
  { value: "4.8", label: "Calificación promedio" },
  { value: "72", label: "Meses de financiamiento" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Autos certificados",
    desc: "Cada vehículo pasa una revisión de 240 puntos antes de ponerse en venta.",
  },
  {
    icon: CreditCard,
    title: "Financiamiento fácil",
    desc: "Aprobación en minutos, sin aval y con tasas competitivas desde el primer día.",
  },
  {
    icon: Wrench,
    title: "Garantía incluida",
    desc: "Todos nuestros autos incluyen garantía mecánica para que manejes tranquilo.",
  },
  {
    icon: RefreshCw,
    title: "Devolución en 7 días",
    desc: "Si no estás satisfecho, devuelve el auto en los primeros 7 días sin preguntas.",
  },
];

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:px-14">
      <div className="overflow-hidden rounded-xl border border-border">
        {/* Barra de stats - petróleo del DS. Antes usaba un inline style con
            var(--brand-primary), variable que ya no existe: renderizaba
            transparente y el texto blanco quedaba invisible. */}
        <dl className="grid grid-cols-2 bg-brand-petrol md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-6 ${
                i < stats.length - 1 ? "border-r border-brand-aqua/25" : ""
              }`}
            >
              <dt className="font-label text-[2rem] font-bold leading-none tabular-nums text-brand-neon">
                {s.value}
              </dt>
              <dd className="text-center text-caption text-brand-aqua">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="grid grid-cols-1 divide-y divide-border bg-card sm:grid-cols-2 sm:divide-y-0 sm:divide-x md:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex flex-col gap-4 p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-brand-aqua">
                <Icon aria-hidden className="size-5 text-brand-ink" />
              </span>
              <div>
                <h3 className="font-heading text-h4 font-medium">{title}</h3>
                <p className="mt-1.5 text-caption leading-relaxed text-ink-800">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
