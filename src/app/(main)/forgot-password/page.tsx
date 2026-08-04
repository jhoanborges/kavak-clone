"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "email" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const isValid = email.includes("@") && email.includes(".");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStep("sent");
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {step === "email" ? (
          <>
            {/* Back */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>

            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-foreground">¿Olvidaste tu contraseña?</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo electrónico
                </label>
                <div className={cn(
                  "flex items-center gap-2.5 h-12 rounded-lg border bg-white px-3.5 transition-all",
                  "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
                  email ? "border-primary" : "border-border"
                )}>
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full h-12 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isValid ? "var(--brand-primary)" : "oklch(0.75 0 0)",
                }}
              >
                Enviar enlace
                {isValid && <ArrowRight className="size-4" />}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Ingresar
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Icon */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-24 h-24 rounded-full bg-primary/100/10 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="relative w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CheckCircle className="size-8 text-primary" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-foreground">Revisa tu correo</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enviamos un enlace de recuperación a{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                  <br />
                  Revisa también tu carpeta de spam.
                </p>
              </div>
            </div>

            {/* Resend */}
            <div className="bg-muted/60 rounded-xl px-5 py-4 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground text-center">
                ¿No llegó el correo?
              </p>
              <button
                onClick={() => setStep("email")}
                className="w-full h-11 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Intentar con otro correo
              </button>
            </div>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </>
        )}

      </div>
    </main>
  );
}
