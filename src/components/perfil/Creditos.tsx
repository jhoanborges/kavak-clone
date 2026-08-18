"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/* Datos mock: no hay backend de créditos. Los charts y la tabla son de ejemplo
   con forma realista para una financiera de autos. */
type Estado = "activo" | "en revisión" | "pagado" | "rechazado";

const CREDITOS: {
  id: string;
  vehiculo: string;
  monto: number;
  mensualidad: number;
  plazo: number;
  estado: Estado;
  fecha: string;
}[] = [
  { id: "CR-1042", vehiculo: "Audi A5 2018", monto: 320000, mensualidad: 8442, plazo: 48, estado: "activo", fecha: "12 Jun 2026" },
  { id: "CR-1039", vehiculo: "Chevrolet Suburban 2016", monto: 440000, mensualidad: 11587, plazo: 60, estado: "en revisión", fecha: "28 May 2026" },
  { id: "CR-1021", vehiculo: "BMW x2 2021", monto: 370000, mensualidad: 9752, plazo: 48, estado: "activo", fecha: "03 May 2026" },
  { id: "CR-0998", vehiculo: "Honda Civic 2022", monto: 380000, mensualidad: 10014, plazo: 48, estado: "pagado", fecha: "15 Feb 2026" },
  { id: "CR-0975", vehiculo: "GMC Acadia 2019", monto: 230000, mensualidad: 6083, plazo: 36, estado: "pagado", fecha: "20 Ene 2026" },
  { id: "CR-0961", vehiculo: "Ford Territory 2023", monto: 380000, mensualidad: 10014, plazo: 60, estado: "rechazado", fecha: "08 Ene 2026" },
];

const PAGOS = [
  { mes: "Feb", pago: 21980 },
  { mes: "Mar", pago: 24540 },
  { mes: "Abr", pago: 23110 },
  { mes: "May", pago: 27890 },
  { mes: "Jun", pago: 26230 },
  { mes: "Jul", pago: 29781 },
  { mes: "Ago", pago: 28650 },
];

const SOLICITADO = [
  { mes: "Mar", monto: 230000 },
  { mes: "Abr", monto: 0 },
  { mes: "May", monto: 810000 },
  { mes: "Jun", monto: 320000 },
  { mes: "Jul", monto: 0 },
  { mes: "Ago", monto: 440000 },
];

const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

const ESTADO_BADGE: Record<Estado, string> = {
  activo: "bg-primary/15 text-primary",
  "en revisión": "bg-brand-neon/20 text-brand-ink dark:bg-brand-neon/15 dark:text-brand-neon",
  pagado: "bg-muted text-ink-600",
  rechazado: "bg-destructive/10 text-destructive",
};

type TooltipInput = {
  active?: boolean;
  label?: string | number;
  payload?: { value: number }[];
};

function TooltipBox({ active, label, payload }: TooltipInput) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-caption shadow-md">
      <p className="font-medium text-foreground">{label}</p>
      <p className="tabular-nums text-ink-600">{mxn(payload[0].value)}</p>
    </div>
  );
}

const AXIS_TICK = { fill: "var(--color-ink-600)", fontSize: 12 };

export default function Creditos() {
  const activos = CREDITOS.filter((c) => c.estado === "activo");
  const totalFinanciado = CREDITOS.filter((c) => c.estado !== "rechazado").reduce((s, c) => s + c.monto, 0);
  const mensualidadActiva = activos.reduce((s, c) => s + c.mensualidad, 0);
  // Saldo estimado: mock, ~62% del financiado activo aún por pagar.
  const saldo = Math.round(activos.reduce((s, c) => s + c.monto, 0) * 0.62);

  const kpis = [
    { label: "Total financiado", valor: mxn(totalFinanciado) },
    { label: "Saldo pendiente", valor: mxn(saldo) },
    { label: "Créditos activos", valor: String(activos.length) },
    { label: "Mensualidad total", valor: mxn(mensualidadActiva) },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-caption text-ink-600">{k.label}</p>
            <p className="mt-1 font-label text-h4 font-bold tabular-nums text-foreground">{k.valor}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h3 className="text-body-2 font-medium text-foreground">Pagos mensuales</h3>
            <span className="text-caption text-ink-600">Últimos 7 meses</span>
          </div>
          <p className="mb-3 font-label text-h4 font-bold tabular-nums text-primary dark:text-foreground">
            {mxn(PAGOS[PAGOS.length - 1].pago)}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PAGOS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPago" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={AXIS_TICK} dy={6} />
              <YAxis hide domain={["dataMin - 4000", "dataMax + 2000"]} />
              <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--color-border)" }} />
              <Area
                dataKey="pago"
                type="monotone"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#fillPago)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-primary)", stroke: "var(--color-card)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h3 className="text-body-2 font-medium text-foreground">Monto solicitado</h3>
            <span className="text-caption text-ink-600">Por mes</span>
          </div>
          <p className="mb-3 font-label text-h4 font-bold tabular-nums text-primary dark:text-foreground">
            {mxn(SOLICITADO.reduce((s, d) => s + d.monto, 0))}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SOLICITADO} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={AXIS_TICK} dy={6} />
              <YAxis hide />
              <Tooltip content={<TooltipBox />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="monto" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historial / transacciones */}
      <div>
        <h3 className="mb-3 text-body-2 font-medium text-foreground">Historial de créditos</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-body-2">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-caption uppercase tracking-wide text-ink-600">
                <th className="px-4 py-3 font-medium">Crédito</th>
                <th className="px-4 py-3 font-medium">Vehículo</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
                <th className="px-4 py-3 text-right font-medium">Mensualidad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CREDITOS.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-caption text-ink-600">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{c.vehiculo}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{mxn(c.monto)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                    {mxn(c.mensualidad)}
                    <span className="text-caption text-ink-600">/mes</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-4xl px-2.5 py-0.5 text-caption font-medium capitalize",
                        ESTADO_BADGE[c.estado]
                      )}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-600">{c.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
