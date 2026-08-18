"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CalendarClock,
  Camera,
  Check,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Settings,
  ShieldCheck,
  Sliders,
  Trash2,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import Creditos from "@/components/perfil/Creditos";
import { CARS, type Car } from "@/data/cars";
import type { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

/* ─────────────────────────── datos (mock) ────────────────────────────────
   No hay backend: el usuario es fijo y las citas son de ejemplo. Los favoritos
   sí son reales, salen del store de Redux (los corazones del catálogo). */
const USUARIO = {
  nombre: "Alejandro Ramírez",
  rol: "Cliente VALUE",
  email: "alejandro.ramirez@correo.com",
  telefono: "+52 81 1234 5678",
  ciudad: "Monterrey, N.L.",
  miembroDesde: "Marzo 2024",
  iniciales: "AR",
};

const CITAS = [
  { id: 1, titulo: "Audi A5 2018", sede: "VALUE Monterrey Centro", fecha: "15 Ago 2026, 11:00", estado: "confirmada" as const },
  { id: 2, titulo: "Chevrolet Suburban 2016", sede: "VALUE San Pedro", fecha: "22 Ago 2026, 17:30", estado: "pendiente" as const },
  { id: 3, titulo: "BMW x2 2021", sede: "VALUE Guadalupe", fecha: "02 Jul 2026, 10:00", estado: "completada" as const },
];

const SECCIONES = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "creditos", label: "Mis créditos", icon: CreditCard },
  { id: "datos", label: "Datos personales", icon: User },
  { id: "configuracion", label: "Configuración", icon: Settings },
  { id: "favoritos", label: "Mis favoritos", icon: Heart },
  { id: "citas", label: "Mis citas", icon: CalendarClock },
  { id: "seguridad", label: "Seguridad", icon: ShieldCheck },
  { id: "preferencias", label: "Preferencias", icon: Sliders },
] as const;

type SeccionId = (typeof SECCIONES)[number]["id"];

const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

function toSlug(car: Car) {
  return `${car.brand}-${car.model}-${car.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function PerfilCliente() {
  const router = useRouter();
  const [seccion, setSeccion] = useState<SeccionId>("resumen");

  const favoritos = useSelector((s: RootState) => s.cars.favorites);
  const autosFavoritos = CARS.filter((c) => favoritos.includes(c.id));

  const seccionActual = SECCIONES.find((s) => s.id === seccion)!;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 md:px-14">
      <header className="mb-8">
        <p className="font-label text-overline uppercase tracking-[0.14em] text-primary">
          Mi cuenta
        </p>
        <h1 className="mt-1 font-heading text-h1 font-medium">Perfil</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* ── Columna izquierda: identidad + navegación vertical ── */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
            <div className="relative">
              <Avatar size="lg" className="size-20">
                <AvatarFallback className="bg-brand-aqua text-h4 font-bold text-brand-ink">
                  {USUARIO.iniciales}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                aria-label="Cambiar foto"
                className="absolute -right-1 -bottom-1 flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              >
                <Camera className="size-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="font-heading text-h4 font-medium">{USUARIO.nombre}</h2>
                <Badge variant="secondary" className="text-primary">
                  Plus
                </Badge>
              </div>
              <p className="text-caption text-ink-600">{USUARIO.rol}</p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto rounded-xl border border-border bg-card p-2 lg:flex-col lg:overflow-visible">
            {SECCIONES.map(({ id, label, icon: Icon }) => {
              const activo = id === seccion;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSeccion(id)}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 min-h-11 items-center gap-3 rounded-lg px-3.5 text-left text-body-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:w-full",
                    activo
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-ink-600 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}

            <div className="my-1 hidden h-px bg-border lg:block" />

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex shrink-0 min-h-11 items-center gap-3 rounded-lg px-3.5 text-left text-body-2 text-ink-600 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:w-full"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="whitespace-nowrap">Cerrar sesión</span>
            </button>
          </nav>
        </aside>

        {/* ── Columna derecha: render de la sección activa ── */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <seccionActual.icon className="size-5 text-primary" />
            <h2 className="font-heading text-h3 font-medium">{seccionActual.label}</h2>
          </div>

          {seccion === "resumen" && (
            <Resumen favoritos={autosFavoritos.length} citas={CITAS.length} />
          )}
          {seccion === "creditos" && <Creditos />}
          {seccion === "datos" && <DatosPersonales />}
          {seccion === "configuracion" && <Configuracion />}
          {seccion === "favoritos" && <Favoritos autos={autosFavoritos} />}
          {seccion === "citas" && <Citas />}
          {seccion === "seguridad" && <Seguridad />}
          {seccion === "preferencias" && <Preferencias />}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── secciones ─────────────────────────────── */

function Resumen({ favoritos, citas }: { favoritos: number; citas: number }) {
  const stats = [
    { valor: favoritos, label: "Favoritos" },
    { valor: citas, label: "Citas" },
    { valor: USUARIO.miembroDesde, label: "Miembro desde" },
  ];
  const contacto = [
    { icon: Mail, valor: USUARIO.email },
    { icon: Phone, valor: USUARIO.telefono },
    { icon: MapPin, valor: USUARIO.ciudad },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-muted p-4 text-center">
            <p className="font-label text-h4 font-bold tabular-nums text-foreground">{s.valor}</p>
            <p className="text-caption text-ink-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-body-2 font-medium text-foreground">Completa tu perfil</h3>
          <span className="font-label text-caption font-bold tabular-nums text-primary">66%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: "66%" }} />
        </div>
        <p className="mt-2 text-caption text-ink-600">
          Agrega tu identificación y método de pago para agilizar tu compra.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-body-2 font-medium text-foreground">Información de contacto</h3>
        <ul className="flex flex-col gap-3">
          {contacto.map((c) => (
            <li key={c.valor} className="flex items-center gap-3 text-body-2 text-ink-800">
              <c.icon className="size-4 shrink-0 text-primary" />
              {c.valor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Campo({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-ink-600">{label}</span>
      <Input type={type} defaultValue={defaultValue} className="h-11" />
    </label>
  );
}

function DatosPersonales() {
  const [guardado, setGuardado] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
      }}
      className="flex flex-col gap-5"
      onChange={() => setGuardado(false)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Nombre completo" defaultValue={USUARIO.nombre} />
        <Campo label="Correo electrónico" defaultValue={USUARIO.email} type="email" />
        <Campo label="Teléfono" defaultValue={USUARIO.telefono} type="tel" />
        <Campo label="Ciudad" defaultValue={USUARIO.ciudad} />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" variant="petrol" size="cta">
          Guardar cambios
        </Button>
        {guardado && (
          <span className="flex items-center gap-1.5 text-body-2 text-primary" role="status">
            <Check className="size-4" />
            Cambios guardados
          </span>
        )}
      </div>
    </form>
  );
}

/* Configuración = perfil público (estilo del ejemplo shadcn): foto, username,
   email, bio y URLs, cada campo con su texto de ayuda. */
const CONTROL_BASE =
  "w-full rounded-lg border border-input bg-transparent px-3 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function CampoConfig({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-body-2 font-medium text-foreground">{label}</span>
      {children}
      <p className="text-caption text-ink-600">{hint}</p>
    </div>
  );
}

function Configuracion() {
  const [urls, setUrls] = useState<string[]>(["https://shadcnuikit.com", "https://bundui.io"]);
  const [guardado, setGuardado] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
      }}
      onChange={() => setGuardado(false)}
      className="flex max-w-2xl flex-col gap-7"
    >
      {/* Foto */}
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-16">
          <AvatarFallback className="bg-brand-aqua text-body-1 font-bold text-brand-ink">
            {USUARIO.iniciales}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <Button type="button" variant="petrol" size="sm" className="w-fit">
            <Camera className="size-4" />
            Subir imagen
          </Button>
          <p className="text-caption text-ink-600">JPG o PNG, máximo 2 MB.</p>
        </div>
      </div>

      <CampoConfig
        label="Nombre de usuario"
        hint="Es tu nombre público. Puede ser tu nombre real o un alias. Solo se cambia una vez cada 30 días."
      >
        <Input defaultValue="alejandro" className="h-11" />
      </CampoConfig>

      <CampoConfig
        label="Correo"
        hint="Administra tus correos verificados en la configuración de tu cuenta."
      >
        <select
          defaultValue={USUARIO.email}
          className={cn(CONTROL_BASE, "h-11 cursor-pointer")}
        >
          <option value={USUARIO.email}>{USUARIO.email}</option>
          <option value="alejandro@empresa.com">alejandro@empresa.com</option>
        </select>
      </CampoConfig>

      <CampoConfig
        label="Bio"
        hint="Puedes @mencionar a otros usuarios y organizaciones."
      >
        <textarea
          defaultValue="Buscando mi próximo auto seminuevo certificado."
          rows={3}
          className={cn(CONTROL_BASE, "min-h-24 resize-y py-2 leading-relaxed")}
        />
      </CampoConfig>

      {/* URLs dinámicas */}
      <div className="flex flex-col gap-2">
        <span className="text-body-2 font-medium text-foreground">Enlaces</span>
        <p className="mb-1 text-caption text-ink-600">
          Agrega enlaces a tu sitio, blog o redes sociales.
        </p>
        {urls.map((url, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={url}
              onChange={(e) =>
                setUrls((prev) => prev.map((u, j) => (j === i ? e.target.value : u)))
              }
              className="h-11"
              placeholder="https://…"
            />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((_, j) => j !== i))}
              aria-label="Quitar enlace"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 w-fit"
          onClick={() => setUrls((prev) => [...prev, ""])}
        >
          <Plus className="size-4" />
          Agregar enlace
        </Button>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-5">
        <Button type="submit" variant="petrol" size="cta">
          Actualizar perfil
        </Button>
        {guardado && (
          <span className="flex items-center gap-1.5 text-body-2 text-primary" role="status">
            <Check className="size-4" />
            Perfil actualizado
          </span>
        )}
      </div>
    </form>
  );
}

function Favoritos({ autos }: { autos: Car[] }) {
  if (autos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Heart className="size-10 text-ink-500" />
        <p className="text-body-1 font-medium text-foreground">Aún no tienes favoritos</p>
        <p className="max-w-sm text-body-2 text-ink-600">
          Dale al corazón en cualquier auto del catálogo para guardarlo aquí.
        </p>
        <Button asChild variant="petrol" size="cta" className="mt-1">
          <Link href="/vehiculos">Explorar autos</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {autos.map((car) => (
        <li key={car.id}>
          <Link
            href={`/vehiculos/${toSlug(car)}`}
            className="group flex gap-4 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                sizes="112px"
                unoptimized
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="font-label text-caption font-bold uppercase tracking-[0.08em] text-ink-600">
                {car.brand}
              </p>
              <p className="truncate font-heading text-body-1 font-medium">{car.model}</p>
              <p className="truncate text-caption text-ink-600">
                {car.year} · {car.km.toLocaleString("es-MX")} km
              </p>
              <p className="mt-auto font-label text-body-1 font-bold tabular-nums text-primary dark:text-foreground">
                {mxn(car.monthly)}
                <span className="ml-1 text-caption font-normal text-ink-600">/mes</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const ESTADO_CITA: Record<string, string> = {
  confirmada: "bg-primary/15 text-primary",
  pendiente: "bg-brand-neon/20 text-brand-ink dark:bg-brand-neon/15 dark:text-brand-neon",
  completada: "bg-muted text-ink-600",
};

function Citas() {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {CITAS.map((cita) => (
        <li key={cita.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CalendarClock className="size-5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-body-1 font-medium">{cita.titulo}</p>
            <p className="truncate text-caption text-ink-600">
              {cita.fecha} · {cita.sede}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-4xl px-3 py-1 text-caption font-medium capitalize",
              ESTADO_CITA[cita.estado]
            )}
          >
            {cita.estado}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Seguridad() {
  const [guardado, setGuardado] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
      }}
      onChange={() => setGuardado(false)}
      className="flex max-w-md flex-col gap-5"
    >
      <Campo label="Contraseña actual" defaultValue="" type="password" />
      <Campo label="Nueva contraseña" defaultValue="" type="password" />
      <Campo label="Confirmar nueva contraseña" defaultValue="" type="password" />

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" variant="petrol" size="cta">
          Actualizar contraseña
        </Button>
        {guardado && (
          <span className="flex items-center gap-1.5 text-body-2 text-primary" role="status">
            <Check className="size-4" />
            Contraseña actualizada
          </span>
        )}
      </div>
    </form>
  );
}

function Toggle({ label, descripcion, inicial }: { label: string; descripcion: string; inicial: boolean }) {
  const [on, setOn] = useState(inicial);
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-body-2 font-medium text-foreground">{label}</p>
        <p className="text-caption text-ink-600">{descripcion}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          on ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-background transition-transform",
            on && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

function Preferencias() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <p className="text-body-2 font-medium text-foreground">Tema</p>
          <p className="text-caption text-ink-600">Cambia entre claro y oscuro.</p>
        </div>
        <ThemeToggle className="border border-border" />
      </div>
      <div className="h-px bg-border" />
      <Toggle
        label="Novedades por correo"
        descripcion="Ofertas y autos nuevos que coincidan con tu búsqueda."
        inicial
      />
      <div className="h-px bg-border" />
      <Toggle
        label="Alertas de precio"
        descripcion="Avísame cuando baje el precio de un favorito."
        inicial
      />
      <div className="h-px bg-border" />
      <Toggle
        label="Recordatorios de cita"
        descripcion="Notificaciones antes de una cita agendada."
        inicial={false}
      />
    </div>
  );
}
