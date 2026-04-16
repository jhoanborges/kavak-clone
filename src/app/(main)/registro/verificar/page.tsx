"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

export default function VerificarPage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(60);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  function handleResend() {
    setSeconds(60);
    setDigits(Array(CODE_LENGTH).fill(""));
    focusAt(0);
  }

  const filled = digits.filter(Boolean).length;
  const isComplete = filled === CODE_LENGTH;

  function focusAt(index: number) {
    inputRefs.current[index]?.focus();
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < CODE_LENGTH - 1) focusAt(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    focusAt(Math.min(pasted.length, CODE_LENGTH - 1));
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <Link
          href="/registro"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Regresar
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Verifica tu número</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa el código de 6 dígitos que enviamos a tu teléfono.
          </p>
        </div>

        <div className="flex gap-3 justify-between">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={cn(
                "w-full aspect-square text-center text-xl font-bold rounded-xl border-2 bg-white outline-none transition-all",
                digit ? "border-primary text-foreground" : "border-border text-foreground",
                "focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          ¿No recibiste el código?{" "}
          {seconds > 0 ? (
            <span className="font-medium text-foreground">
              Reenviar en{" "}
              <span className="tabular-nums text-blue-600">
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
              </span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Reenviar
            </button>
          )}
        </p>

        <button
          disabled={!isComplete}
          onClick={() => isComplete && router.push("/registro/continuar")}
          className="w-full h-12 flex items-center justify-center rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundColor: isComplete ? "oklch(0.47 0.24 264)" : "oklch(0.75 0 0)" }}
        >
          Confirmar código
        </button>
      </div>
    </main>
  );
}
