"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function ContinuarPage() {
  const router = useRouter();

  return (
    <main className="flex-1 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <h1 className="text-2xl font-bold text-foreground">¿Cómo quieres continuar?</h1>

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
          <p className="text-sm font-semibold text-red-700">
            Este auto ya tiene más de 10 citas agendadas. ¡Apartalo para que no te lo ganen!
          </p>
        </div>

        <button className="w-full bg-white border border-border rounded-xl px-5 py-5 flex items-start justify-between gap-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer text-left group">
          <div className="flex flex-col gap-1.5">
            <p className="font-bold text-foreground text-base">Apartar auto</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El apartado dura 3 días. Si no concretas la reserva, no se reembolsará este monto. Si quieres pagar a meses y tu préstamo a meses no se aprueba, sí te reembolsaremos el monto de tu reserva.
            </p>
          </div>
          <ChevronRight className="size-5 text-blue-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/registro/agendar")}
          className="w-full bg-white border border-border rounded-xl px-5 py-5 flex items-start justify-between gap-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer text-left group"
        >
          <div className="flex flex-col gap-1.5">
            <p className="font-bold text-foreground text-base">Agendar visita</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ven a la sede y conoce todas las opciones. El auto seguirá disponible para otras personas.
            </p>
          </div>
          <ChevronRight className="size-5 text-blue-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </main>
  );
}
