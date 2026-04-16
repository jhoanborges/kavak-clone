"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export default function RegistroPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio de sesión
        </Link>

        <div className="text-center flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">
            ¡No dejes escapar esta oportunidad!
          </h1>
          <p className="text-sm text-primary">
            Inicia sesión para apartar o agendar una visita.
          </p>
        </div>

        <div className="flex rounded-lg border border-border bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
          <button className="flex items-center gap-1.5 px-3 border-r border-border text-sm font-medium text-foreground shrink-0 cursor-pointer hover:bg-muted transition-colors">
            🇲🇽 <span className="text-muted-foreground">(+52)</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder=""
            className="flex-1 px-3 py-3.5 text-sm outline-none bg-transparent"
          />
        </div>

        <button
          disabled={phone.replace(/\D/g, "").length < 10}
          onClick={() => router.push("/registro/verificar")}
          className="w-full h-12 flex items-center justify-center rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundColor: phone.replace(/\D/g, "").length >= 10 ? "var(--brand-primary)" : "oklch(0.75 0 0)" }}
        >
          Continuar
        </button>

        <button className="w-full h-12 flex items-center justify-center gap-2.5 border border-border rounded-lg bg-white text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer shadow-sm">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          Iniciar sesión con Google
        </button>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Al hacer clic en &quot;Continuar&quot; confirmo que he leído y acepto los{" "}
          <Link href="/" className="text-primary hover:underline">Términos y Condiciones</Link>
          {" "}y{" "}
          <Link href="/" className="text-primary hover:underline">Aviso de Privacidad</Link>
          {" "}de {APP_NAME}.
        </p>
      </div>
    </main>
  );
}
