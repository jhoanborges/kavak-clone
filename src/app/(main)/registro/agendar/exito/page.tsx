"use client";

import { useEffect, useState, Suspense } from "react";
import { APP_NAME } from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { MapPin, Calendar, Clock, Phone, ChevronRight } from "lucide-react";

function ExitoContent() {
  const searchParams = useSearchParams();
  const dia = searchParams.get("dia") ?? "próximamente";

  const [checkVisible, setCheckVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCheckVisible(true), 100);
    const t2 = setTimeout(() => setContentVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main className="flex-1 px-4 py-12">
      <div className="max-w-md mx-auto flex flex-col gap-8">

        {/* Animated checkmark */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <span className={`absolute rounded-full bg-emerald-500/10 transition-all duration-700 ease-out ${checkVisible ? "w-36 h-36 opacity-100" : "w-0 h-0 opacity-0"}`} />
            <span className={`absolute rounded-full bg-emerald-500/15 transition-all duration-500 ease-out delay-100 ${checkVisible ? "w-28 h-28 opacity-100" : "w-0 h-0 opacity-0"}`} />
            <div className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all duration-500 ease-out ${checkVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
              <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline
                  points="8,20 16,29 32,12"
                  style={{
                    strokeDasharray: 38,
                    strokeDashoffset: checkVisible ? 0 : 38,
                    transition: "stroke-dashoffset 0.5s ease-out 0.35s, opacity 0.1s 0.35s",
                  }}
                />
              </svg>
            </div>
          </div>

          <div className={`text-center transition-all duration-500 ease-out ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <h1 className="text-2xl font-bold text-foreground">¡Visita agendada!</h1>
            <p className="text-sm text-muted-foreground mt-1">Te esperamos con gusto. Confirma los detalles abajo.</p>
          </div>
        </div>

        {/* Appointment card */}
        <div className={`bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-500 ease-out delay-100 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&h=140&fit=crop&auto=format" alt="Auto" fill className="object-cover" sizes="80px" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">Acura RDX</p>
              <p className="text-xs text-muted-foreground">2022 &bull; 18,400 km</p>
            </div>
            <p className="font-bold text-foreground text-base shrink-0">$699,900</p>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="bg-primary/10 rounded-lg p-2 shrink-0"><Calendar className="size-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha de visita</p>
                <p className="text-sm font-semibold text-foreground capitalize">{dia}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="bg-purple-50 rounded-lg p-2 shrink-0"><Clock className="size-4 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Horario de atención</p>
                <p className="text-sm font-semibold text-foreground">10:00 AM – 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="bg-red-50 rounded-lg p-2 shrink-0"><MapPin className="size-4 text-red-500" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Sede</p>
                <p className="text-sm font-semibold text-foreground">{APP_NAME} WH Lerma</p>
                <p className="text-xs text-muted-foreground">Carr Amomoluco 4-2, Ocoyoacac</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="bg-emerald-50 rounded-lg p-2 shrink-0"><Phone className="size-4 text-emerald-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">¿Necesitas ayuda?</p>
                <p className="text-sm font-semibold text-foreground">800 461 0655</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className={`bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-2 transition-all duration-500 ease-out delay-200 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-xs font-bold text-[#033e48] uppercase tracking-wide">Recuerda traer</p>
          {["Identificación oficial vigente (INE/Pasaporte)", "Comprobante de domicilio reciente", "Estado de cuenta bancario"].map((tip) => (
            <div key={tip} className="flex items-start gap-2">
              <span className="mt-0.5 text-primary/70">•</span>
              <p className="text-sm text-[#033e48]">{tip}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={`flex flex-col gap-3 transition-all duration-500 ease-out delay-300 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Link href="/compra" className="w-full h-12 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
            Seguir explorando autos <ChevronRight className="size-4" />
          </Link>
          <Link href="/" className="w-full h-12 flex items-center justify-center rounded-lg text-sm font-medium text-foreground border border-border bg-white hover:bg-muted transition-colors">
            Ir al inicio
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <ExitoContent />
    </Suspense>
  );
}
