import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function KopiAssistant() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Text */}
        <div className="flex-1">
          <p className="font-bold text-lg text-foreground mb-1">
            ¡Hola! Soy{" "}
            <span className="text-primary">Kopi</span>{" "}
            <span className="text-base">🔥</span>{" "}
            <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Beta
            </span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Estoy aquí para ayudarte con lo que necesites: comprar, financiar o cuidar
            de tu auto, explorando juntos una experiencia simple y personalizada.
          </p>
          <Button size="sm" className="mt-4 cursor-pointer">
            <MessageCircle className="size-3.5" />
            Conversar ahora
          </Button>
        </div>
        {/* Car illustration placeholder */}
        <div className="shrink-0 w-40 h-24 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <svg viewBox="0 0 120 60" className="w-28 opacity-70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="30" width="100" height="20" rx="6" fill="#94a3b8"/>
            <rect x="25" y="16" width="70" height="20" rx="4" fill="#cbd5e1"/>
            <circle cx="30" cy="50" r="8" fill="#475569"/>
            <circle cx="30" cy="50" r="4" fill="#94a3b8"/>
            <circle cx="90" cy="50" r="8" fill="#475569"/>
            <circle cx="90" cy="50" r="4" fill="#94a3b8"/>
            <rect x="28" y="18" width="28" height="14" rx="2" fill="#bfdbfe" opacity="0.8"/>
            <rect x="62" y="18" width="28" height="14" rx="2" fill="#bfdbfe" opacity="0.8"/>
            <circle cx="60" cy="22" r="3" fill="#1B4FD8" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
