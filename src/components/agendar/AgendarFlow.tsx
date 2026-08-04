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
import {
  destinoLegible,
  emailValido,
  enviarCodigo,
  formatearTelefono,
  registrarLead,
  telefonoValido,
  verificarCodigo,
  type Canal,
  type LeadIdentidad,
  type PreferenciaContacto,
} from "@/lib/agendar";
import { CONTACT, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const PASOS = ["Contacto", "Verificación", "Tus datos", "Listo"] as const;
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
 * Cuatro pasos en un solo componente, con el estado en memoria y no en la URL.
 * Es deliberado: si cada paso fuera una ruta, recargar en el paso 3 dejaría a
 * la persona en un formulario sin identidad verificada, y habría que reconstruir
 * o abortar. Un embudo corto se sostiene mejor en un único contenedor.
 *
 * Se pide UN dato para empezar — teléfono o correo, no ambos. Cada campo extra
 * antes del primer "Continuar" cuesta conversión, y el resto se puede pedir
 * cuando la persona ya invirtió algo en el proceso.
 */
export function AgendarFlow({
  vehiculoId,
  resumen,
}: {
  vehiculoId?: string;
  resumen?: string;
}) {
  const [paso, setPaso] = useState(0);
  const [canal, setCanal] = useState<Canal>("telefono");
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [digitos, setDigitos] = useState<string[]>(
    Array(LARGO_CODIGO).fill("")
  );
  const refsOtp = useRef<(HTMLInputElement | null)[]>([]);
  const [segundos, setSegundos] = useState(0);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [preferencias, setPreferencias] = useState<PreferenciaContacto[]>([
    "whatsapp",
  ]);

  const tituloRef = useRef<HTMLHeadingElement>(null);
  const baseId = useId();

  const identidad: LeadIdentidad = { canal, valor };

  // Al cambiar de paso, el foco va al título. Sin esto, quien navega con
  // teclado o lector de pantalla se queda donde estaba y no se entera de que
  // la pantalla cambió.
  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  useEffect(() => {
    if (segundos <= 0) return;
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  const irA = (n: number) => {
    setPaso(n);
    setError(null);
    requestAnimationFrame(() => tituloRef.current?.focus());
  };

  const identidadValida =
    canal === "telefono" ? telefonoValido(valor) : emailValido(valor);
  const codigo = digitos.join("");
  const codigoCompleto = codigo.length === LARGO_CODIGO;
  const datosValidos =
    nombre.trim().length > 1 &&
    apellido.trim().length > 1 &&
    preferencias.length > 0 &&
    (email === "" || emailValido(email));

  async function pedirCodigo() {
    setEnviando(true);
    setError(null);
    const r = await enviarCodigo(identidad);
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    setDigitos(Array(LARGO_CODIGO).fill(""));
    setSegundos(60);
    irA(1);
    requestAnimationFrame(() => refsOtp.current[0]?.focus());
  }

  async function confirmarCodigo() {
    setEnviando(true);
    setError(null);
    const r = await verificarCodigo(identidad, codigo);
    setEnviando(false);
    if (!r.ok) return setError(r.error);
    irA(2);
  }

  async function enviarDatos() {
    setEnviando(true);
    setError(null);
    const r = await registrarLead(identidad, {
      nombre,
      apellido,
      email,
      preferencias,
      vehiculoId,
    });
    setEnviando(false);
    if (!r.ok) return setError(r.error);
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

  /* ───────────────────────── presentación ───────────────────── */

  const titulos = [
    "¿Cómo te contactamos?",
    canal === "telefono" ? "Valida tu celular" : "Valida tu correo",
    "Cuéntanos quién eres",
    "¡Listo! Te contactamos pronto",
  ];

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {/* Progreso. `aria-live` anuncia el cambio de paso a quien no ve la
          barra avanzar. */}
      {paso < 3 && (
        <div className="mb-8">
          <ol className="flex gap-2">
            {PASOS.slice(0, 3).map((nombrePaso, i) => (
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

      {/* ── Paso 1: identidad ── */}
      {paso === 0 && (
        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (identidadValida) pedirCodigo();
          }}
        >
          <p className="text-body-2 text-ink-800">
            Te enviamos un código para confirmar que eres tú. Sólo pedimos un
            dato para empezar.
          </p>

          <div
            role="radiogroup"
            aria-label="Medio de contacto"
            className="flex gap-2"
          >
            {(
              [
                { v: "telefono" as const, label: "Celular", icon: Phone },
                { v: "email" as const, label: "Correo", icon: Mail },
              ]
            ).map(({ v, label, icon: Icon }) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={canal === v}
                onClick={() => {
                  setCanal(v);
                  setValor("");
                  setError(null);
                }}
                className={cn(
                  "flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border text-body-2 transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  canal === v
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
              {canal === "telefono" ? "Número de celular" : "Correo electrónico"}
            </label>
            <div className="flex items-center gap-2">
              {canal === "telefono" && (
                <span className="flex h-12 shrink-0 items-center rounded-lg border border-border bg-muted px-3 text-body-2 tabular-nums text-ink-600">
                  +52
                </span>
              )}
              <Input
                id={`${baseId}-valor`}
                type={canal === "telefono" ? "tel" : "email"}
                inputMode={canal === "telefono" ? "numeric" : "email"}
                autoComplete={canal === "telefono" ? "tel-national" : "email"}
                placeholder={
                  canal === "telefono" ? "81 1234 5678" : "tucorreo@ejemplo.com"
                }
                value={
                  canal === "telefono" ? formatearTelefono(valor) : valor
                }
                onChange={(e) => setValor(e.target.value)}
                className="h-12 flex-1 text-body-2"
              />
            </div>
            <p className="text-caption text-ink-600">
              {canal === "telefono"
                ? "Te llegará un SMS con un código de 6 dígitos."
                : "Te llegará un correo con un código de 6 dígitos."}
            </p>
          </div>

          <Button
            type="submit"
            variant="petrol"
            size="cta"
            disabled={!identidadValida || enviando}
            className="w-full"
          >
            {enviando ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Enviando código…
              </>
            ) : (
              <>
                Continuar
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* ── Paso 2: código ── */}
      {paso === 1 && (
        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (codigoCompleto) confirmarCodigo();
          }}
        >
          <p className="text-body-2 text-ink-800">
            Ingresa el código que te enviamos{" "}
            {canal === "telefono" ? "por SMS al" : "al correo"}{" "}
            <span className="font-medium text-foreground">
              {destinoLegible(identidad)}
            </span>{" "}
            <button
              type="button"
              onClick={() => irA(0)}
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

          <Button
            type="submit"
            variant="petrol"
            size="cta"
            disabled={!codigoCompleto || enviando}
            className="w-full"
          >
            {enviando ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Validando…
              </>
            ) : (
              "Validar código"
            )}
          </Button>

          <button
            type="button"
            onClick={() => irA(0)}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 text-body-2 text-ink-600 hover:text-brand-petrol"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Regresar
          </button>
        </form>
      )}

      {/* ── Paso 3: datos ── */}
      {paso === 2 && (
        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (datosValidos) enviarDatos();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${baseId}-nombre`} className="font-label text-label">
                Nombre
              </label>
              <Input
                id={`${baseId}-nombre`}
                autoComplete="given-name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="h-12 text-body-2"
              />
            </div>
          </div>

          {/* El correo sólo se pide si entró por teléfono: si ya lo dio, volver
              a pedirlo es fricción sin ganancia. */}
          {canal === "telefono" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${baseId}-email`} className="font-label text-label">
                Correo electrónico{" "}
                <span className="font-normal text-ink-600">(opcional)</span>
              </label>
              <Input
                id={`${baseId}-email`}
                type="email"
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-body-2"
              />
            </div>
          )}

          <fieldset className="flex flex-col gap-3">
            <legend className="font-label text-label">
              ¿Por dónde prefieres que te contactemos?
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {PREFERENCIAS.map(({ valor: v, label, icon: Icon }) => {
                const activo = preferencias.includes(v);
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
                    {/* Checkbox real oculto, no un div con onClick: se navega
                        con teclado y se anuncia como casilla. */}
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() =>
                        setPreferencias((p) =>
                          p.includes(v) ? p.filter((x) => x !== v) : [...p, v]
                        )
                      }
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
                      {activo && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <Icon aria-hidden className="size-4" />
                    {label}
                  </label>
                );
              })}
            </div>
            {preferencias.length === 0 && (
              <p className="text-caption text-destructive">
                Elige al menos una forma de contacto.
              </p>
            )}
          </fieldset>

          <Button
            type="submit"
            variant="petrol"
            size="cta"
            disabled={!datosValidos || enviando}
            className="w-full"
          >
            {enviando ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Enviando…
              </>
            ) : (
              "Agendar mi cita"
            )}
          </Button>

          <p className="text-caption text-ink-600">
            Al continuar aceptas que un asesor te contacte por los medios que
            elegiste.
          </p>
        </form>
      )}

      {/* ── Paso 4: éxito ── */}
      {paso === 3 && (
        <div className="mt-6 flex flex-col items-center gap-6 text-center">
          <ExitoCheck />

          <div>
            <p className="text-body-1 text-ink-800">
              Recibimos tus datos{nombre ? `, ${nombre}` : ""}. Un asesor te
              contactará por{" "}
              <span className="font-medium text-foreground">
                {preferencias
                  .map(
                    (p) => PREFERENCIAS.find((x) => x.valor === p)?.label ?? p
                  )
                  .join(", ")}
              </span>
              .
            </p>
          </div>

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
            <Button variant="outline" size="cta" className="w-full" asChild>
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
 * El trazo se dibuja con `stroke-dashoffset`, que sólo anima propiedades
 * compuestas. Respeta `prefers-reduced-motion`: con la preferencia activa
 * aparece ya dibujado en vez de suprimir la confirmación.
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
