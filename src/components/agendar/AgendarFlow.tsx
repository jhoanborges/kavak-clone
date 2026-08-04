"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/useHydrated";
import {
  destinoLegible,
  emailValido,
  enviarCodigo,
  formatearTelefono,
  registrarLead,
  telefonoValido,
  verificarCodigo,
  type LeadIdentidad,
  type PreferenciaContacto,
} from "@/lib/agendar";
import {
  obtenerTokenRecaptcha,
  verificarRecaptcha,
  RECAPTCHA_ACCIONES,
} from "@/lib/recaptcha";
import { CONTACT, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  limpiarAgendar,
  setCampo,
  setCanal,
  togglePreferencia,
} from "@/redux/slices/agendarSlice";
import type { RootState } from "@/redux/store";

const PASOS = ["Tus datos", "Contacto", "Verificación"] as const;
const LARGO_CODIGO = 6;
const IDS_OTP = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

const PREFERENCIAS: Array<{
  valor: PreferenciaContacto;
  label: string;
  icon: typeof Phone;
}> = [
  { valor: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { valor: "llamada", label: "Llamada", icon: Phone },
  { valor: "email", label: "Correo", icon: Mail },
];

/**
 * Captura de lead de "Agendar una cita".
 *
 * ORDEN: datos personales → contacto → código → confirmación. Los datos van
 * primero porque nombre y apellido son triviales de dar; pedir el teléfono de
 * entrada levanta la guardia antes de que la persona haya invertido nada. Al
 * llegar al número ya empezó, y abandonar cuesta más.
 *
 * Lo escrito se persiste en redux (ver agendarSlice), así que cambiar de canal
 * o retroceder no borra nada. El código NO se persiste: es un secreto de un
 * solo uso y vive únicamente aquí.
 *
 * Anterior/Siguiente existen en los tres pasos editables. En la confirmación
 * desaparecen: el lead ya se envió y "atrás" no puede deshacerlo — ofrecerlo
 * sería mentir sobre lo que hace.
 */
export function AgendarFlow({
  vehiculoId,
  resumen,
}: {
  vehiculoId?: string;
  resumen?: string;
}) {
  const hydrated = useHydrated();
  const dispatch = useDispatch();
  const datos = useSelector((s: RootState) => s.agendar);

  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El código vive aquí, nunca en redux ni en localStorage.
  const [digitos, setDigitos] = useState<string[]>(
    Array(LARGO_CODIGO).fill("")
  );
  const refsOtp = useRef<(HTMLInputElement | null)[]>([]);
  const [segundos, setSegundos] = useState(0);

  const tituloRef = useRef<HTMLHeadingElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  const valorCanal = datos.canal === "telefono" ? datos.telefono : datos.email;
  const identidad: LeadIdentidad = { canal: datos.canal, valor: valorCanal };

  useEffect(() => {
    if (segundos <= 0) return;
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  const irA = (n: number) => {
    setPaso(n);
    setError(null);
    requestAnimationFrame(() => {
      if (n === 0) nombreRef.current?.focus();
      else tituloRef.current?.focus();
    });
  };

  const datosValidos =
    datos.nombre.trim().length > 1 &&
    datos.apellido.trim().length > 1 &&
    datos.preferencias.length > 0;

  const contactoValido =
    datos.canal === "telefono"
      ? telefonoValido(datos.telefono)
      : emailValido(datos.email);

  const codigo = digitos.join("");
  const codigoCompleto = codigo.length === LARGO_CODIGO;

  async function pedirCodigo() {
    setEnviando(true);
    setError(null);
    const r = await enviarCodigo(identidad);
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setDigitos(Array(LARGO_CODIGO).fill(""));
    setSegundos(60);
    irA(2);
    requestAnimationFrame(() => refsOtp.current[0]?.focus());
  }

  async function confirmarYEnviar() {
    setEnviando(true);
    setError(null);

    const v = await verificarCodigo(identidad, codigo);
    if (!v.ok) {
      setEnviando(false);
      return setError(v.error);
    }

    // reCAPTCHA antes de crear el lead. Con el interruptor apagado devuelve
    // null y el servidor responde `omitido`, así que no bloquea.
    try {
      const token = await obtenerTokenRecaptcha(RECAPTCHA_ACCIONES.agendar);
      const check = await verificarRecaptcha(token, RECAPTCHA_ACCIONES.agendar);
      if (!check.ok) {
        setEnviando(false);
        return setError(check.error);
      }
    } catch {
      setEnviando(false);
      return setError(
        "No pudimos completar la verificación de seguridad. Inténtalo de nuevo."
      );
    }

    const r = await registrarLead(identidad, {
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      preferencias: datos.preferencias,
      vehiculoId,
    });
    setEnviando(false);
    if (!r.ok) return setError(r.error);

    setDigitos(Array(LARGO_CODIGO).fill(""));
    irA(3);
  }

  /* ─────────────────────────── OTP ─────────────────────────── */

  function escribirDigito(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digitos];
    next[i] = d;
    setDigitos(next);
    if (d && i < LARGO_CODIGO - 1) refsOtp.current[i + 1]?.focus();
  }

  function teclaOtp(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digitos[i] && i > 0) {
      refsOtp.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refsOtp.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LARGO_CODIGO - 1)
      refsOtp.current[i + 1]?.focus();
  }

  // Pegar el código completo desde el SMS es lo que hace casi todo el mundo.
  function pegarOtp(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const texto = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LARGO_CODIGO);
    if (!texto) return;
    const next = Array(LARGO_CODIGO).fill("");
    texto.split("").forEach((d, i) => {
      next[i] = d;
    });
    setDigitos(next);
    refsOtp.current[Math.min(texto.length, LARGO_CODIGO - 1)]?.focus();
  }

  /* ──────────────────────────── carga ─────────────────────────── */

  // El servidor no puede leer localStorage, así que los campos rehidratados
  // llegarían distintos y React marcaría un desajuste. Se espera al cliente.
  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const titulos = [
    "Cuéntanos quién eres",
    "¿Cómo te contactamos?",
    datos.canal === "telefono" ? "Valida tu celular" : "Valida tu correo",
    "¡Listo! Te contactamos pronto",
  ];

  const puedeAvanzar =
    paso === 0 ? datosValidos : paso === 1 ? contactoValido : codigoCompleto;

  const avanzar = () => {
    if (paso === 0) return irA(1);
    if (paso === 1) return pedirCodigo();
    return confirmarYEnviar();
  };

  const etiquetaAvanzar =
    paso === 0
      ? "Continuar"
      : paso === 1
        ? "Enviar código"
        : "Validar y agendar";

  return (
    <div className="w-full">
      {paso < 3 && (
        <div className="mb-8">
          <ol className="flex gap-2">
            {PASOS.map((nombrePaso, i) => (
              <li key={nombrePaso} className="flex-1">
                <span
                  className={cn(
                    "block h-1 rounded-4xl transition-colors",
                    i <= paso ? "bg-brand-petrol" : "bg-border"
                  )}
                />
              </li>
            ))}
          </ol>
          <p aria-live="polite" className="mt-2 text-caption text-ink-600">
            Paso {paso + 1} de 3 · {PASOS[paso]}
          </p>
        </div>
      )}

      <h1
        ref={tituloRef}
        tabIndex={-1}
        className="font-heading text-h2 font-light outline-none"
      >
        {titulos[paso]}
      </h1>

      {resumen && paso < 3 && (
        <p className="mt-2 text-body-2 text-ink-600">
          Sobre: <span className="font-medium text-foreground">{resumen}</span>
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-2 text-destructive"
        >
          {error}
        </p>
      )}

      {paso < 3 && (
        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (puedeAvanzar && !enviando) avanzar();
          }}
        >
          {/* ── Paso 1: datos personales ── */}
          {paso === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`${baseId}-nombre`}
                    className="font-label text-label"
                  >
                    Nombre
                  </label>
                  <Input
                    id={`${baseId}-nombre`}
                    ref={nombreRef}
                    autoComplete="given-name"
                    value={datos.nombre}
                    onChange={(e) =>
                      dispatch(
                        setCampo({ campo: "nombre", valor: e.target.value })
                      )
                    }
                    className="h-12 text-body-2"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`${baseId}-apellido`}
                    className="font-label text-label"
                  >
                    Apellido
                  </label>
                  <Input
                    id={`${baseId}-apellido`}
                    autoComplete="family-name"
                    value={datos.apellido}
                    onChange={(e) =>
                      dispatch(
                        setCampo({ campo: "apellido", valor: e.target.value })
                      )
                    }
                    className="h-12 text-body-2"
                  />
                </div>
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="font-label text-label">
                  ¿Por dónde prefieres que te contactemos?
                </legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PREFERENCIAS.map(({ valor: v, label, icon: Icon }) => {
                    const activo = datos.preferencias.includes(v);
                    return (
                      <label
                        key={v}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-body-2 transition-colors",
                          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                          activo
                            ? "border-brand-petrol bg-brand-aqua/30 font-medium text-brand-petrol"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        {/* Checkbox real oculto, no un div con onClick:
                            navegable por teclado y anunciado como casilla. */}
                        <input
                          type="checkbox"
                          checked={activo}
                          onChange={() => dispatch(togglePreferencia(v))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-sm border-2",
                            activo
                              ? "border-brand-petrol bg-brand-petrol text-white"
                              : "border-border"
                          )}
                        >
                          {activo && (
                            <Check className="size-3" strokeWidth={3} />
                          )}
                        </span>
                        <Icon aria-hidden className="size-4" />
                        {label}
                      </label>
                    );
                  })}
                </div>
                {datos.preferencias.length === 0 && (
                  <p className="text-caption text-destructive">
                    Elige al menos una forma de contacto.
                  </p>
                )}
              </fieldset>
            </>
          )}

          {/* ── Paso 2: contacto ── */}
          {paso === 1 && (
            <>
              <p className="text-body-2 text-ink-800">
                Te enviamos un código para confirmar que eres tú.
              </p>

              <div
                role="radiogroup"
                aria-label="Medio de contacto"
                className="flex gap-2"
              >
                {[
                  { v: "telefono" as const, label: "Celular", icon: Phone },
                  { v: "email" as const, label: "Correo", icon: Mail },
                ].map(({ v, label, icon: Icon }) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={datos.canal === v}
                    // Sólo cambia el canal. Teléfono y correo son campos
                    // distintos en el slice, así que alternar no borra nada.
                    onClick={() => {
                      dispatch(setCanal(v));
                      setError(null);
                    }}
                    className={cn(
                      "flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border text-body-2 transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      datos.canal === v
                        ? "border-brand-petrol bg-brand-aqua/30 font-medium text-brand-petrol"
                        : "border-border bg-card hover:bg-muted"
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${baseId}-valor`}
                  className="font-label text-label"
                >
                  {datos.canal === "telefono"
                    ? "Número de celular"
                    : "Correo electrónico"}
                </label>
                <div className="flex items-center gap-2">
                  {datos.canal === "telefono" && (
                    <span className="flex h-12 shrink-0 items-center rounded-lg border border-border bg-muted px-3 text-body-2 tabular-nums text-ink-600">
                      +52
                    </span>
                  )}
                  <Input
                    id={`${baseId}-valor`}
                    type={datos.canal === "telefono" ? "tel" : "email"}
                    inputMode={datos.canal === "telefono" ? "numeric" : "email"}
                    autoComplete={
                      datos.canal === "telefono" ? "tel-national" : "email"
                    }
                    placeholder={
                      datos.canal === "telefono"
                        ? "81 1234 5678"
                        : "tucorreo@ejemplo.com"
                    }
                    value={
                      datos.canal === "telefono"
                        ? formatearTelefono(datos.telefono)
                        : datos.email
                    }
                    onChange={(e) =>
                      dispatch(
                        setCampo({
                          campo:
                            datos.canal === "telefono" ? "telefono" : "email",
                          valor: e.target.value,
                        })
                      )
                    }
                    className="h-12 flex-1 text-body-2"
                  />
                </div>
                <p className="text-caption text-ink-600">
                  {datos.canal === "telefono"
                    ? "Te llegará un SMS con un código de 6 dígitos."
                    : "Te llegará un correo con un código de 6 dígitos."}
                </p>
              </div>
            </>
          )}

          {/* ── Paso 3: código ── */}
          {paso === 2 && (
            <>
              <p className="text-body-2 text-ink-800">
                Ingresa el código que te enviamos{" "}
                {datos.canal === "telefono" ? "por SMS al" : "al correo"}{" "}
                <span className="font-medium text-foreground">
                  {destinoLegible(identidad)}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => irA(1)}
                  className="cursor-pointer text-brand-petrol underline underline-offset-4"
                >
                  Cambiar
                </button>
              </p>

              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Código de 6 dígitos</legend>
                <div className="flex justify-between gap-2">
                  {digitos.map((d, i) => (
                    <input
                      key={IDS_OTP[i]}
                      ref={(el) => {
                        refsOtp.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      aria-label={`Dígito ${i + 1}`}
                      value={d}
                      onChange={(e) => escribirDigito(i, e.target.value)}
                      onKeyDown={(e) => teclaOtp(i, e)}
                      onPaste={pegarOtp}
                      className={cn(
                        "h-14 w-full rounded-lg border bg-card text-center font-label text-h3 tabular-nums outline-none transition-colors",
                        "focus-visible:border-brand-petrol focus-visible:ring-2 focus-visible:ring-brand-aqua",
                        d ? "border-brand-petrol" : "border-border"
                      )}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="flex items-center justify-between gap-3 text-caption">
                <span className="text-ink-600">
                  {segundos > 0
                    ? `Puedes reenviarlo en ${segundos}s`
                    : "¿No te llegó?"}
                </span>
                <button
                  type="button"
                  disabled={segundos > 0 || enviando}
                  onClick={pedirCodigo}
                  className="cursor-pointer text-brand-petrol underline underline-offset-4 disabled:cursor-not-allowed disabled:text-ink-500 disabled:no-underline"
                >
                  Reenviar código
                </button>
              </div>
            </>
          )}

          {/* Navegación común a los tres pasos editables. */}
          <div className="mt-1 flex items-center gap-3">
            {paso > 0 && (
              <Button
                type="button"
                variant="outline"
                size="cta"
                onClick={() => irA(paso - 1)}
                disabled={enviando}
              >
                <ArrowLeft data-icon="inline-start" />
                Anterior
              </Button>
            )}
            <Button
              type="submit"
              variant="petrol"
              size="cta"
              disabled={!puedeAvanzar || enviando}
              className="flex-1"
            >
              {enviando ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Un momento…
                </>
              ) : (
                <>
                  {etiquetaAvanzar}
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* ── Confirmación. Sin navegación: el lead ya se envió. ── */}
      {paso === 3 && (
        <div className="mt-6 flex flex-col items-center gap-6 text-center">
          <ExitoCheck />

          <p className="text-body-1 text-ink-800">
            Recibimos tus datos{datos.nombre ? `, ${datos.nombre}` : ""}. Un
            asesor te contactará por{" "}
            <span className="font-medium text-foreground">
              {datos.preferencias
                .map((p) => PREFERENCIAS.find((x) => x.valor === p)?.label ?? p)
                .join(", ")}
            </span>
            .
          </p>

          <p className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-body-2 text-ink-800">
            <Clock aria-hidden className="size-4 shrink-0 text-brand-petrol" />
            Horario de atención: lunes a viernes, 9:00 a 18:00 h
          </p>

          <div className="flex w-full flex-col gap-3">
            {CONTACT.whatsapp && (
              <Button variant="petrol" size="cta" className="w-full" asChild>
                <a
                  href={whatsappHref(
                    CONTACT.whatsapp,
                    "Hola, acabo de agendar una cita."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle data-icon="inline-start" />
                  Escríbenos por WhatsApp
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="cta"
              className="w-full"
              asChild
              onClick={() => dispatch(limpiarAgendar())}
            >
              <Link href="/vehiculos">Seguir viendo autos</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Checkmark de éxito.
 *
 * El trazo se dibuja con `stroke-dashoffset`. Respeta `prefers-reduced-motion`:
 * con la preferencia activa aparece ya dibujado, en vez de suprimir la
 * confirmación.
 */
function ExitoCheck() {
  return (
    <span className="relative flex size-24 items-center justify-center">
      <span className="absolute inset-0 animate-ping rounded-4xl bg-brand-aqua/40 [animation-duration:2s] motion-reduce:hidden" />
      <span className="relative flex size-20 items-center justify-center rounded-4xl bg-brand-petrol">
        <svg
          viewBox="0 0 52 52"
          className="size-10 text-brand-neon"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path
            d="M14 27l8 8 16-18"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:1] [animation:dibujar_.5s_.15s_forwards_ease-out] motion-reduce:[stroke-dashoffset:0] motion-reduce:animate-none"
          />
        </svg>
      </span>
    </span>
  );
}
