"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Step definitions ───────────────────────────────────────────────────────

const STEPS = [
  "Datos personales",
  "Empleo e ingresos",
  "Tu auto ideal",
  "Pre-aprobación",
];

// ─── Shared field component ──────────────────────────────────────────────────

function Field({
  label,
  children,
  hint,
}: {
  label?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full h-12 rounded-xl border border-border bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all";

const selectCls =
  "w-full h-12 rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer";

// ─── Step 1: Datos personales ─────────────────────────────────────────────

function Step1({
  data,
  setData,
}: {
  data: Record<string, string>;
  setData: (k: string, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground leading-snug">
          Completa esta información para avanzar con el perfilamiento
        </h2>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">🤩</span>
        <p className="text-sm text-foreground">
          ¿Sabías que <strong>9 de 10 personas</strong> como tú ya están <strong>pre-aprobadas</strong>?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Primer nombre">
          <input className={inputCls} placeholder="Primer nombre" value={data.firstName || ""} onChange={e => setData("firstName", e.target.value)} />
        </Field>
        <Field label="Segundo nombre">
          <input className={inputCls} placeholder="Segundo nombre" value={data.secondName || ""} onChange={e => setData("secondName", e.target.value)} />
        </Field>
        <Field label="Apellido paterno">
          <input className={inputCls} placeholder="Apellido paterno" value={data.lastName1 || ""} onChange={e => setData("lastName1", e.target.value)} />
        </Field>
        <Field label="Apellido materno">
          <input className={inputCls} placeholder="Apellido materno" value={data.lastName2 || ""} onChange={e => setData("lastName2", e.target.value)} />
        </Field>
      </div>

      <Field>
        <input className={inputCls} placeholder="Fecha de nacimiento (dd/mm/aaaa)" value={data.dob || ""} onChange={e => setData("dob", e.target.value)} />
      </Field>

      <Field label="Género" hint="Debe ser el mismo que sale en tus documentos oficiales: pasaporte, IFE o acta de nacimiento.">
        <div className="relative">
          <select className={selectCls} value={data.gender || ""} onChange={e => setData("gender", e.target.value)}>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </Field>

      <Field>
        <input className={inputCls} placeholder="RFC con homoclave" value={data.rfc || ""} onChange={e => setData("rfc", e.target.value)} />
      </Field>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div
          onClick={() => setData("rfcOk", data.rfcOk === "1" ? "" : "1")}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer",
            data.rfcOk === "1" ? "bg-primary border-primary" : "border-border bg-white"
          )}
        >
          {data.rfcOk === "1" && <Check className="size-3 text-white" strokeWidth={3} />}
        </div>
        <span className="text-sm text-foreground">El RFC es correcto</span>
      </label>
    </div>
  );
}

function isStep1Valid(data: Record<string, string>) {
  return !!(data.firstName && data.lastName1 && data.dob && data.gender && data.rfc && data.rfcOk);
}

// ─── Step 2: Empleo e ingresos ────────────────────────────────────────────

function Step2({ data, setData }: { data: Record<string, string>; setData: (k: string, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground leading-snug">Cuéntanos sobre tu situación laboral</h2>
        <p className="text-sm text-muted-foreground mt-1">Usamos esta información solo para calcular tu crédito.</p>
      </div>

      <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">💼</span>
        <p className="text-sm text-foreground">Tu empleo nos ayuda a ofrecerte las <strong>mejores condiciones</strong> de financiamiento.</p>
      </div>

      <Field label="Tipo de empleo">
        <div className="relative">
          <select className={selectCls} value={data.employment || ""} onChange={e => setData("employment", e.target.value)}>
            <option value="">Selecciona</option>
            <option value="employed">Empleado de empresa</option>
            <option value="self">Independiente / Freelance</option>
            <option value="business">Empresario / Dueño de negocio</option>
            <option value="public">Empleado gobierno</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </Field>

      <Field label="Ingresos mensuales netos" hint="Ingresa el monto que recibes después de impuestos.">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <input className={cn(inputCls, "pl-7")} placeholder="0.00" type="number" min={0} value={data.income || ""} onChange={e => setData("income", e.target.value)} />
        </div>
      </Field>

      <Field label="Antigüedad laboral">
        <div className="relative">
          <select className={selectCls} value={data.seniority || ""} onChange={e => setData("seniority", e.target.value)}>
            <option value="">Selecciona</option>
            <option value="0">Menos de 6 meses</option>
            <option value="1">6 meses a 1 año</option>
            <option value="2">1 a 2 años</option>
            <option value="3">Más de 2 años</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </Field>

      <Field label="CURP" hint="Puedes encontrarla en tu credencial de elector o acta de nacimiento.">
        <input className={inputCls} placeholder="CURP" value={data.curp || ""} onChange={e => setData("curp", e.target.value)} />
      </Field>
    </div>
  );
}

function isStep2Valid(d: Record<string, string>) {
  return !!(d.employment && d.income && d.seniority && d.curp);
}

// ─── Step 3: Tu auto ideal ────────────────────────────────────────────────

const BRANDS = ["Chevrolet", "Nissan", "Toyota", "Volkswagen", "Kia", "Mazda", "Honda", "Ford", "Hyundai", "Otra"];

function Step3({ data, setData }: { data: Record<string, string>; setData: (k: string, v: string) => void }) {
  const monthly = Number(data.monthly || 3000);
  const estimated = monthly * 140;
  const enganche = Math.round(estimated * 0.10);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground leading-snug">¿Cómo es el auto que tienes en mente?</h2>
        <p className="text-sm text-muted-foreground mt-1">Sin compromisos — solo exploramos tus opciones.</p>
      </div>

      <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">🚗</span>
        <p className="text-sm text-foreground">El <strong>80% de nuestros clientes</strong> encuentran su auto ideal en menos de 3 días.</p>
      </div>

      <Field label="¿Cuánto quieres pagar al mes?">
        <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mensualidad</span>
            <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
              ${monthly.toLocaleString("es-MX")}/mes
            </span>
          </div>
          <input
            type="range" min={2000} max={8500} step={100}
            value={monthly}
            onChange={e => setData("monthly", e.target.value)}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$2,000</span><span>$8,500</span>
          </div>
          <div className="border-t border-border pt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Valor estimado del auto</p>
              <p className="font-bold text-foreground">${estimated.toLocaleString("es-MX")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Enganche aprox. (10%)</p>
              <p className="font-bold text-foreground">${enganche.toLocaleString("es-MX")}</p>
            </div>
          </div>
        </div>
      </Field>

      <Field label="Marca preferida (opcional)">
        <div className="relative">
          <select className={selectCls} value={data.brand || ""} onChange={e => setData("brand", e.target.value)}>
            <option value="">Sin preferencia</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </Field>

      <Field label="Plazo deseado">
        <div className="grid grid-cols-3 gap-2">
          {["24", "36", "48", "60", "72"].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setData("term", m)}
              className={cn(
                "h-11 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer",
                data.term === m
                  ? "border-primary text-primary bg-primary/8"
                  : "border-border text-foreground bg-white hover:border-primary/40"
              )}
            >
              {m} meses
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function isStep3Valid(d: Record<string, string>) {
  return !!(d.monthly && d.term);
}

// ─── Step 4: Pre-aprobación ───────────────────────────────────────────────

function Step4({ data }: { data: Record<string, string> }) {
  const monthly = Number(data.monthly || 3000);
  const estimated = monthly * 140;
  const enganche = Math.round(estimated * 0.10);
  const term = data.term || "48";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero result */}
      <div className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center" style={{ backgroundColor: "var(--brand-primary)" }}>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <Check className="size-8 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-white leading-tight">¡Estás pre-aprobado!</h2>
        <p className="text-sm text-white/80">
          {data.firstName}, basándonos en tu perfil tienes una oferta preliminar lista.
        </p>
      </div>

      {/* Offer card */}
      <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Mensualidad estimada</p>
          <p className="text-3xl font-black" style={{ color: "var(--brand-primary)" }}>
            ${monthly.toLocaleString("es-MX")}<span className="text-base font-medium text-muted-foreground">/mes</span>
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Auto hasta</p>
            <p className="text-sm font-bold text-foreground">${estimated.toLocaleString("es-MX")}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Enganche</p>
            <p className="text-sm font-bold text-foreground">${enganche.toLocaleString("es-MX")}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Plazo</p>
            <p className="text-sm font-bold text-foreground">{term} meses</p>
          </div>
        </div>
      </div>

      {/* Next step */}
      <div className="flex flex-col gap-3">
        <Link
          href="/compra"
          className="w-full h-12 flex items-center justify-center rounded-xl text-sm font-bold text-white transition-all active:scale-[0.99]"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          Ver autos que se ajustan a mi presupuesto
        </Link>
        <Link
          href="/"
          className="w-full h-12 flex items-center justify-center rounded-xl text-sm font-medium text-foreground border border-border bg-white hover:bg-muted transition-colors"
        >
          Explorar más tarde
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Esta pre-aprobación es referencial y no constituye un compromiso de crédito formal.
      </p>
    </div>
  );
}

// ─── Wizard shell ─────────────────────────────────────────────────────────

export default function CotizarPage() {
  const [step, setStep] = useState(0);
  const [data, setDataState] = useState<Record<string, string>>({});

  function setData(key: string, value: string) {
    setDataState(prev => ({ ...prev, [key]: value }));
  }

  const isLast = step === STEPS.length - 1;

  function canAdvance() {
    if (step === 0) return isStep1Valid(data);
    if (step === 1) return isStep2Valid(data);
    if (step === 2) return isStep3Valid(data);
    return true;
  }

  function renderStep() {
    if (step === 0) return <Step1 data={data} setData={setData} />;
    if (step === 1) return <Step2 data={data} setData={setData} />;
    if (step === 2) return <Step3 data={data} setData={setData} />;
    return <Step4 data={data} />;
  }

  return (
    <main className="flex-1 px-4 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* Progress bar */}
        <div className="flex flex-col gap-2">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step + 1) / STEPS.length) * 100}%`,
                backgroundColor: "var(--brand-primary)",
              }}
            />
          </div>
          <div className="flex justify-between">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={cn(
                  "text-[10px] font-medium hidden sm:block",
                  i <= step ? "text-primary" : "text-muted-foreground"
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Back */}
        {!isLast && (
          <button
            type="button"
            onClick={() => step === 0 ? history.back() : setStep(s => s - 1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Volver
          </button>
        )}

        {/* Step content */}
        {renderStep()}

        {/* CTA */}
        {!isLast && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep(s => s + 1)}
              className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: canAdvance() ? "var(--brand-primary)" : "oklch(0.75 0 0)",
              }}
            >
              Continuar
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" />
              Tus datos siempre estarán protegidos
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
