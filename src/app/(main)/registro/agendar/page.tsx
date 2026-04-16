"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const MONTHS_FULL_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function generateDays(count = 7) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      date: d,
      dayName: DAYS_ES[d.getDay()],
      dayNum: d.getDate(),
      month: MONTHS_ES[d.getMonth()],
    };
  });
}

export default function AgendarPage() {
  const days = useMemo(() => generateDays(7), []);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const router = useRouter();

  return (
    <main className="flex-1 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <Link
          href="/registro/continuar"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Regresar
        </Link>

        <h1 className="text-2xl font-bold text-foreground">¿Cuándo quieres venir?</h1>

        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&h=140&fit=crop&auto=format"
              alt="Auto"
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm">Acura RDX</p>
            <p className="text-sm text-muted-foreground">2022 &bull; 18,400 km</p>
          </div>
          <p className="font-bold text-foreground text-lg shrink-0">$699,900</p>
        </div>

        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <span className="text-xl shrink-0">🔥</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Este auto ya tiene más de 10 citas agendadas.
            </p>
          </div>
          <Link
            href="/registro/continuar"
            className="text-sm font-semibold text-blue-600 hover:underline shrink-0 flex items-center gap-0.5"
          >
            Apartar auto <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">Selecciona un día</p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 bg-white shrink-0 min-w-[72px] transition-all cursor-pointer",
                  selectedDay === i ? "border-blue-600 bg-blue-50" : "border-border hover:border-blue-300"
                )}
              >
                <span className={cn("text-xs font-medium uppercase tracking-wide", selectedDay === i ? "text-blue-600" : "text-muted-foreground")}>
                  {day.dayName}
                </span>
                <span className={cn("text-xl font-bold leading-none", selectedDay === i ? "text-blue-600" : "text-foreground")}>
                  {day.dayNum}
                </span>
                <span className={cn("text-xs font-medium", selectedDay === i ? "text-blue-600" : "text-muted-foreground")}>
                  {day.month}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">Lugar de visita</p>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="relative w-full h-52">
              <Image
                src="https://maps.googleapis.com/maps/api/staticmap?center=19.2654,-99.4419&zoom=14&size=600x300&markers=color:red%7C19.2654,-99.4419&key=DEMO_KEY"
                alt="Mapa de la sede"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 600px"
                unoptimized
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop&auto=format&q=80";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <MapPin className="size-6 text-red-500 fill-red-100" />
                </div>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="mt-0.5 shrink-0 bg-red-50 rounded-lg p-2">
                <MapPin className="size-4 text-red-500" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-foreground text-sm">Kavak WH Lerma</p>
                <p className="text-sm text-muted-foreground">Carr Amomoluco 4-2, Ocoyoacac</p>
                <p className="text-sm text-muted-foreground">Estado de México, 52740</p>
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={selectedDay === null}
          onClick={() => {
            if (selectedDay === null) return;
            const d = days[selectedDay];
            const params = new URLSearchParams({
              dia: `${d.dayName} ${d.dayNum} de ${MONTHS_FULL_ES[d.date.getMonth()]}`,
            });
            router.push(`/registro/agendar/exito?${params.toString()}`);
          }}
          className="w-full h-12 flex items-center justify-center rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundColor: selectedDay !== null ? "oklch(0.47 0.24 264)" : "oklch(0.75 0 0)" }}
        >
          Agendar visita
          {selectedDay !== null && (
            <span className="ml-2 text-white/80 font-normal">
              — {days[selectedDay].dayName} {days[selectedDay].dayNum} {MONTHS_FULL_ES[days[selectedDay].date.getMonth()]}
            </span>
          )}
        </button>

      </div>
    </main>
  );
}
