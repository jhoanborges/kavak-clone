import { ShieldCheck, CreditCard, Wrench, RefreshCw } from "lucide-react";

const stats = [
  { value: "+300K", label: "Clientes satisfechos" },
  { value: "240", label: "Puntos de servicio" },
  { value: "4.8★", label: "Calificación promedio" },
  { value: "72", label: "Meses de financiamiento" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Autos certificados",
    desc: "Cada vehículo pasa por una revisión de 240 puntos antes de ponerse en venta.",
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
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">

        {/* Stats bar */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center py-6 px-4 gap-1 ${
                i < stats.length - 1 ? "border-r border-white/20" : ""
              }`}
            >
              <span className="text-3xl font-black text-white tracking-tight leading-none">
                {s.value}
              </span>
              <span className="text-xs text-white/70 font-medium text-center">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-white divide-y sm:divide-y-0 sm:divide-x divide-border">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3 p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--brand-primary)", opacity: 1 }}
              >
                <Icon className="size-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
