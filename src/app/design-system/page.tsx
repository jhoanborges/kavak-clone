import type { Metadata } from "next";

import {
  ArrowButton,
  BenefitCard,
  BrandLogo,
  DudasBanner,
  HeroSlide,
  SectionHeading,
} from "@/components/ds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design System · VALUE Arrendadora",
  description:
    "Fundamentos, componentes y patrones del sistema de diseño VALUE Arrendadora, implementados con Tailwind v4 + shadcn/ui.",
  // Documentación interna: no debe aparecer en resultados de búsqueda.
  // También está en el Disallow de robots.ts.
  robots: { index: false, follow: false },
  // Autorreferencial: sin esto hereda el canonical "/" del root layout, lo que
  // le diría a Google que esta página ES la home.
  alternates: { canonical: absoluteUrl("/design-system") },
};

/* ------------------------------------------------------------------ data */

const BRAND_COLORS = [
  { name: "Verde Value", hex: "#0D1F26", token: "brand-ink", use: "Primario · texto, fondos", swatch: "bg-brand-ink" },
  { name: "Petróleo", hex: "#004E59", token: "brand-petrol", use: "Secundario · superficies", swatch: "bg-brand-petrol" },
  { name: "Aqua", hex: "#A5DBD9", token: "brand-aqua", use: "Acento · botones primarios", swatch: "bg-brand-aqua" },
  { name: "Salvia", hex: "#7EA8AD", token: "brand-sage", use: "Acento suave · hover, degradados", swatch: "bg-brand-sage" },
  { name: "Neón", hex: "#DEF698", token: "brand-neon", use: "Highlight · destacar, badges", swatch: "bg-brand-neon" },
  { name: "Gris", hex: "#E2E6EA", token: "brand-mist", use: "Neutro · fondos, divisores", swatch: "bg-brand-mist" },
];

const AQUA_SCALE = [
  { step: "200", hex: "#DCF1EF", swatch: "bg-aqua-200" },
  { step: "300", hex: "#C2E7E4", swatch: "bg-aqua-300" },
  { step: "400", hex: "#A5DBD9", swatch: "bg-aqua-400" },
  { step: "500", hex: "#7FC8C4", swatch: "bg-aqua-500" },
  { step: "600", hex: "#54AEA9", swatch: "bg-aqua-600" },
  { step: "700", hex: "#3A918C", swatch: "bg-aqua-700", dark: true },
  { step: "800", hex: "#2E726E", swatch: "bg-aqua-800", dark: true },
];

const INK_SCALE = [
  { step: "200", hex: "#FFFFFF", swatch: "bg-ink-200" },
  { step: "300", hex: "#F5F6F7", swatch: "bg-ink-300" },
  { step: "400", hex: "#E2E6EA", swatch: "bg-ink-400" },
  { step: "500", hex: "#B0B8BF", swatch: "bg-ink-500" },
  { step: "600", hex: "#5C676E", swatch: "bg-ink-600", dark: true },
  { step: "800", hex: "#3A4449", swatch: "bg-ink-800", dark: true },
];

const TYPE_ROLES = [
  { sample: "Display L", utility: "text-display-l", desktop: "56px", mobile: "36px", family: "Avenir Light", cls: "font-heading text-[34px] font-light leading-none" },
  { sample: "Heading 1", utility: "text-h1", desktop: "44px", mobile: "32px", family: "Avenir Medium · Título de página", cls: "font-heading text-[30px] font-medium leading-none" },
  { sample: "Heading 2", utility: "text-h2", desktop: "34px", mobile: "26px", family: "Avenir Medium · Secciones", cls: "font-heading text-[26px] font-medium leading-none" },
  { sample: "Heading 3", utility: "text-h3", desktop: "26px", mobile: "22px", family: "Avenir Medium · Tarjetas", cls: "font-heading text-[22px] font-medium leading-none" },
  { sample: "Heading 4", utility: "text-h4", desktop: "20px", mobile: "18px", family: "Avenir Medium", cls: "font-heading text-[20px] font-medium leading-none" },
  { sample: "Body Text 1", utility: "text-body-1", desktop: "18px", mobile: "18px", family: "Museo Sans 300/500 · Cuerpo", cls: "font-sans text-[18px] font-medium leading-tight" },
  { sample: "Body Text 2", utility: "text-body-2", desktop: "16px", mobile: "16px", family: "Museo Sans 300 · Secundario", cls: "font-sans text-[16px] font-light leading-tight" },
  { sample: "Caption", utility: "text-caption", desktop: "13px", mobile: "13px", family: "Museo Sans · Pies", cls: "font-sans text-[13px] font-light leading-tight" },
  { sample: "Label", utility: "text-label", desktop: "14px", mobile: "14px", family: "Raleway", cls: "font-label text-[14px] font-medium leading-tight" },
  { sample: "Overline", utility: "text-overline", desktop: "13px", mobile: "13px", family: "Raleway · Eyebrows (MAYÚS)", cls: "font-label text-[13px] font-semibold uppercase tracking-[0.14em] leading-tight" },
];

const SPACING = [
  { px: 8, utility: "p-2 / gap-2", use: "Base · gaps mínimos, iconos", bar: "w-2 bg-brand-aqua" },
  { px: 16, utility: "p-4 / gap-4", use: "Padding vertical de botones, gap de chips", bar: "w-4 bg-brand-aqua" },
  { px: 20, utility: "p-5 / gap-5", use: "Padding interno de tarjetas", bar: "w-5 bg-aqua-500" },
  { px: 24, utility: "p-6 / gap-6", use: "Padding horizontal de botones, gap de columnas", bar: "w-6 bg-aqua-500" },
  { px: 32, utility: "p-8 / gap-8", use: "Separación entre grupos", bar: "w-8 bg-aqua-600" },
  { px: 40, utility: "p-10 / gap-10", use: "Espaciado de secciones internas", bar: "w-10 bg-aqua-600" },
  { px: 56, utility: "p-14 / gap-14", use: "Columnas del footer, bloques mayores", bar: "w-14 bg-aqua-700" },
];

const RADII = [
  { px: "5px", utility: "rounded-sm", use: "xs · contenedores base, chips", cls: "rounded-sm" },
  { px: "10px", utility: "rounded-lg", use: "sm · botones, inputs", cls: "rounded-lg" },
  { px: "20px", utility: "rounded-xl", use: "md · tarjetas, banners", cls: "rounded-xl" },
  { px: "100px", utility: "rounded-4xl", use: "full · avatares, iconos, pills", cls: "rounded-4xl" },
];

const SITE_SECTIONS = [
  { n: "01", name: "Home", desc: "Página principal: hero carrusel, plan Value, beneficios, paso a paso y CTA final.", tags: ["Hero", "Beneficio", "CTA", "Footer"] },
  { n: "02", name: "Quiénes somos", desc: "Institucional: misión, historia y presencia. Refuerza confianza en la marca.", tags: ["Hero", "Testimonial", "Footer"] },
  { n: "03", name: "Qué es arrendamiento", desc: "Educativo del producto: explica el arrendamiento con tarjetas de beneficio y flip cards.", tags: ["Beneficio", "Flip card", "Dudas"] },
  { n: "04", name: "Qué es crédito automotriz", desc: "Educativo del producto de crédito automotriz, mismo patrón que arrendamiento.", tags: ["Beneficio", "Flip card", "Dudas"] },
  { n: "05", name: "Analiza tu presupuesto", desc: "Herramienta interactiva para estimar capacidad de pago antes de cotizar.", tags: ["Inputs", "CTA"] },
  { n: "06", name: "Cotiza tu crédito", desc: "Cotizador con parámetros de monto, plazo y tasa. Devuelve una estimación.", tags: ["Inputs", "Slider", "CTA"] },
  { n: "07", name: "Solicitud de crédito", desc: "Formulario de onboarding en pasos para iniciar el trámite de crédito.", tags: ["Form", "Steps", "CTA"] },
  { n: "08", name: "Blog", desc: "Contenidos y novedades. Tarjetas de artículo con imagen, categoría y fecha.", tags: ["Card", "Overline"] },
  { n: "09", name: "Global · Footer", desc: "Pie de página compartido en todas las secciones: navegación, contacto y redes.", tags: ["Footer"] },
];

const NAV = [
  { id: "intro", label: "Introducción" },
  { id: "logo", label: "Marca · Logo" },
  { id: "color", label: "Color" },
  { id: "tipografia", label: "Tipografía" },
  { id: "espaciado", label: "Espaciado & layout" },
  { id: "radios", label: "Radios" },
  { id: "superficie", label: "Superficie & bordes" },
  { id: "componentes", label: "Componentes" },
  { id: "secciones", label: "Mapa de secciones" },
];

/* ------------------------------------------------------------- primitives */

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-border py-14">
      <SectionHeading overline={eyebrow} title={title} lead={lead} />
      {children}
    </section>
  );
}

function SubTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-label text-h4 font-semibold">{children}</h3>
      {hint ? <p className="mt-1 text-label text-ink-600">{hint}</p> : null}
    </div>
  );
}

/** Muestra el snippet de personalización de cada componente. */
function Snippet({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-sm border border-border bg-ink-300 p-4 text-caption">
      <code className="font-mono text-ink-800">{children}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------- page */

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-screen items-start">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 self-start overflow-y-auto bg-sidebar px-5 py-8 text-sidebar-foreground lg:block scrollbar-minimal">
        <div className="mb-1.5 flex items-center gap-2.5">
          <span className="size-3 rounded-4xl bg-brand-neon" />
          <span className="font-label text-caption font-bold uppercase tracking-[0.14em] text-brand-sage">
            VALUE
          </span>
        </div>
        <p className="font-heading text-h3 font-light">Design System</p>
        <p className="mb-6 text-caption text-brand-sage">Arrendadora · v1.0</p>

        <nav className="flex flex-col gap-0.5 font-label text-label">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-md px-3 py-2.5 transition-colors hover:bg-brand-petrol hover:text-brand-neon"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="mt-7 border-t border-sidebar-border pt-5 text-caption leading-relaxed text-brand-sage">
          Extraído del archivo Figma VALUE Arrendadora × INTERIUS. Guía viva:
          esta página renderiza los componentes reales de{" "}
          <code className="font-mono">src/components</code>.
        </p>
      </aside>

      {/* Main */}
      <main className="mx-auto w-full max-w-[1000px] px-6 pb-24 md:px-14">
        {/* INTRO */}
        <section id="intro" className="scroll-mt-8 py-14 md:py-20">
          <Badge className="mb-6 bg-brand-neon font-label text-overline uppercase text-brand-petrol">
            Design System · Documentación
          </Badge>
          <h1 className="mb-5 font-heading text-display-l font-light">
            Sistema de diseño
            <br />
            <strong className="font-bold">VALUE Arrendadora</strong>
          </h1>
          <p className="mb-10 max-w-[620px] text-body-1 text-ink-800">
            Fundamentos, componentes y patrones extraídos del archivo de Figma y
            traducidos a tokens de Tailwind v4 + primitivas shadcn/ui. Una
            fuente única de verdad para diseño y desarrollo.
          </p>
          <dl className="flex flex-wrap gap-7">
            {[
              ["6", "colores de marca"],
              ["10", "roles tipográficos"],
              ["11", "familias de componentes"],
              ["9", "secciones del sitio"],
            ].map(([n, label]) => (
              <div key={label} className="min-w-[120px]">
                <dt className="font-label text-[40px] font-bold text-brand-petrol">
                  {n}
                </dt>
                <dd className="text-caption text-ink-600">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* LOGO */}
        <Section
          id="logo"
          eyebrow="01 · Marca"
          title="Logo"
          lead="Tres presentaciones del logotipo según el fondo. Usa siempre el archivo original; no recolorees ni distorsiones la marca. Mantén un área de protección mínima equivalente a la altura de la «V»."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { tone: "green" as const, bg: "bg-background", label: "Principal · verde", desc: "fondos claros" },
              { tone: "black" as const, bg: "bg-white", label: "Monocromo · negro", desc: "documentos, impresos" },
              { tone: "white" as const, bg: "bg-brand-petrol", label: "Inverso · blanco", desc: "fondos oscuros / petróleo" },
            ].map((item) => (
              <figure
                key={item.tone}
                className="overflow-hidden rounded-xl border border-border"
              >
                <div className={cn("flex min-h-[150px] items-center justify-center px-7 py-9", item.bg)}>
                  <BrandLogo tone={item.tone} height={64} />
                </div>
                <figcaption className="bg-card px-5 py-3.5 text-caption text-ink-600">
                  <strong className="text-foreground">{item.label}</strong> - {item.desc}
                </figcaption>
              </figure>
            ))}
          </div>
          <Snippet>{`<BrandLogo tone="white" height={56} className="opacity-90" />`}</Snippet>
        </Section>

        {/* COLOR */}
        <Section
          id="color"
          eyebrow="02 · Fundamentos"
          title="Color"
          lead="La paleta se apoya en el verde petróleo de la marca, acentos aqua y neón, y una base neutra. Cada color es un token de Tailwind: bg-brand-aqua, text-ink-600, border-brand-mist…"
        >
          <SubTitle hint="6 colores · disponibles como bg-*, text-*, border-*, ring-*">
            Colores de marca
          </SubTitle>
          <div className="mb-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRAND_COLORS.map((c) => (
              <div key={c.hex} className="overflow-hidden rounded-xl border border-border">
                <div className={cn("h-[120px]", c.swatch)} />
                <div className="bg-card px-3.5 py-3">
                  <p className="font-label text-label font-semibold">{c.name}</p>
                  <p className="text-caption tabular-nums text-ink-600">{c.hex}</p>
                  <p className="mt-1 font-mono text-caption text-brand-sage">{c.token}</p>
                  <p className="mt-1 text-caption text-ink-600">{c.use}</p>
                </div>
              </div>
            ))}
          </div>

          <SubTitle hint="bg-aqua-200 … bg-aqua-800">Escala secundaria · Aqua</SubTitle>
          <div className="mb-9 flex flex-wrap overflow-hidden rounded-md border border-border">
            {AQUA_SCALE.map((s) => (
              <div key={s.step} className="min-w-[96px] flex-1">
                <div className={cn("h-[88px]", s.swatch)} />
                <div className={cn("px-3 py-2.5 text-caption", s.dark ? cn(s.swatch, "text-white") : "bg-card")}>
                  <p className="font-label font-bold">{s.step}</p>
                  <p className={cn("tabular-nums", s.dark ? "opacity-85" : "text-ink-600")}>{s.hex}</p>
                </div>
              </div>
            ))}
          </div>

          <SubTitle hint="bg-ink-200 … bg-ink-800">Neutrales</SubTitle>
          <div className="flex flex-wrap overflow-hidden rounded-md border border-border">
            {INK_SCALE.map((s) => (
              <div key={s.step} className="min-w-[96px] flex-1">
                <div className={cn("h-[88px]", s.swatch)} />
                <div className={cn("px-3 py-2.5 text-caption", s.dark ? cn(s.swatch, "text-white") : "bg-card")}>
                  <p className="font-label font-bold">{s.step}</p>
                  <p className={cn("tabular-nums", s.dark ? "opacity-85" : "text-ink-600")}>{s.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* TIPOGRAFIA */}
        <Section
          id="tipografia"
          eyebrow="03 · Fundamentos"
          title="Tipografía"
          lead="Tres familias: Avenir para títulos (font-heading), Museo Sans para el cuerpo (font-sans) y Raleway para etiquetas (font-label). Cada rol es una utility con clamp() que interpola móvil → desktop."
        >
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              { aa: "font-heading", name: "Avenir", use: "Títulos y destacados.", weights: "Light · Roman · Medium · Heavy · Black", util: "font-heading" },
              { aa: "font-sans", name: "Museo Sans", use: "Cuerpo de texto.", weights: "300 · 500 · 700 · 900", util: "font-sans" },
              { aa: "font-label", name: "Raleway", use: "Etiquetas y números.", weights: "Light · Medium · SemiBold · Bold", util: "font-label" },
            ].map((f) => (
              <div key={f.name} className="rounded-xl border border-border bg-card p-6">
                <p className={cn("mb-3 text-[56px] font-medium leading-none", f.aa)}>Aa</p>
                <p className="font-label text-body-2 font-bold">{f.name}</p>
                <p className="mt-1 text-caption text-ink-600">{f.use}</p>
                <p className="text-caption text-ink-600">{f.weights}</p>
                <p className="mt-2 font-mono text-caption text-brand-sage">{f.util}</p>
              </div>
            ))}
          </div>
          <p className="mb-8 rounded-sm border border-border bg-ink-300 p-4 text-caption text-ink-800">
            <strong>Nota:</strong> Avenir y Museo Sans son de licencia propia y
            van self-hosted en <code className="font-mono">.woff2</code> desde{" "}
            <code className="font-mono">src/fonts/</code> vía{" "}
            <code className="font-mono">next/font/local</code> (Raleway viene de
            Google Fonts). Los originales <code className="font-mono">.ttf</code>/
            <code className="font-mono">.otf</code> quedan en{" "}
            <code className="font-mono">public/fonts/</code> como fuente de verdad
            y están excluidos de la imagen Docker.
          </p>

          <SubTitle>Escala de roles</SubTitle>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-ink-300 font-label text-caption font-semibold uppercase tracking-wider text-ink-600">
                <tr>
                  <th className="px-5 py-3.5">Muestra</th>
                  <th className="px-5 py-3.5">Utility</th>
                  <th className="px-5 py-3.5">Desktop</th>
                  <th className="px-5 py-3.5">Móvil</th>
                  <th className="px-5 py-3.5">Familia</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_ROLES.map((r) => (
                  <tr key={r.utility} className="border-t border-border align-baseline">
                    <td className={cn("px-5 py-4", r.cls)}>{r.sample}</td>
                    <td className="px-5 py-4 font-mono text-caption text-brand-petrol">{r.utility}</td>
                    <td className="px-5 py-4 tabular-nums text-ink-800">{r.desktop}</td>
                    <td className="px-5 py-4 tabular-nums text-ink-800">{r.mobile}</td>
                    <td className="px-5 py-4 text-caption text-ink-600">{r.family}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ESPACIADO */}
        <Section
          id="espaciado"
          eyebrow="04 · Fundamentos"
          title="Espaciado & layout"
          lead="Base de 8px. Todos los valores del Figma caen sobre la escala nativa de Tailwind (1 = 4px), así que no hace falta ningún token de espaciado propio."
        >
          <ul className="flex max-w-[640px] flex-col gap-3.5">
            {SPACING.map((s) => (
              <li key={s.px} className="flex items-center gap-5">
                <span className={cn("h-7 shrink-0 rounded-sm", s.bar)} />
                <span className="w-14 shrink-0 font-label font-semibold tabular-nums">{s.px}</span>
                <code className="w-28 shrink-0 font-mono text-caption text-brand-petrol">{s.utility}</code>
                <span className="text-caption text-ink-600">{s.use}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* RADIOS */}
        <Section
          id="radios"
          eyebrow="05 · Fundamentos"
          title="Radios"
          lead="Cuatro radios cubren todo el sistema. Se mapean sobre los nombres que ya usan las primitivas shadcn, así button/card/badge quedan correctos sin tocar su código."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RADII.map((r) => (
              <div key={r.px} className="text-center">
                <div className={cn("mb-3 h-24 bg-brand-aqua", r.cls)} />
                <p className="font-label font-bold">{r.px}</p>
                <p className="font-mono text-caption text-brand-petrol">{r.utility}</p>
                <p className="text-caption text-ink-600">{r.use}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* SUPERFICIE */}
        <Section
          id="superficie"
          eyebrow="06 · Fundamentos"
          title="Superficie & bordes"
          lead="El sistema es plano: la jerarquía se logra con color y bordes finos de 1px, no con sombras pesadas. Los degradados aportan profundidad en héroes y tarjetas."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex min-h-[120px] flex-col justify-end rounded-xl border border-ink-500/60 bg-card p-6">
              <p className="font-label text-label font-semibold">Borde tarjeta</p>
              <code className="mt-1 font-mono text-caption text-ink-600">border-border</code>
            </div>
            <div className="flex min-h-[120px] flex-col justify-end rounded-xl border border-background bg-card p-6">
              <p className="font-label text-label font-semibold">Borde suave</p>
              <code className="mt-1 font-mono text-caption text-ink-600">border-background</code>
            </div>
            <div className="flex min-h-[120px] flex-col justify-end rounded-xl border border-background bg-gradient-benefit p-6">
              <p className="font-label text-label font-semibold">Degradado tarjeta</p>
              <code className="mt-1 font-mono text-caption text-ink-800">bg-gradient-benefit</code>
            </div>
            <div className="flex min-h-[120px] flex-col justify-end rounded-xl bg-gradient-hero p-6">
              <p className="font-label text-label font-semibold text-white">Overlay hero</p>
              <code className="mt-1 font-mono text-caption text-brand-aqua">bg-gradient-hero</code>
            </div>
          </div>
        </Section>

        {/* COMPONENTES */}
        <Section
          id="componentes"
          eyebrow="07 · Componentes"
          title="Componentes"
          lead="Primitivas shadcn/ui retematizadas + composiciones propias en src/components/ds. Todas aceptan className (fusionado con tailwind-merge) y las compuestas aceptan además classNames por slot."
        >
          {/* Botones */}
          <SubTitle hint="size='cta' → padding 16/24 · radio 10 · 16px. Cuatro variantes según el fondo.">
            Botones · CTA
          </SubTitle>
          <div className="mb-4 flex flex-wrap gap-4">
            <Button size="cta">Solicitar cotización</Button>
            <Button size="cta" variant="onColor">Solicitar cotización</Button>
            <Button size="cta" variant="neon">Solicitar cotización</Button>
          </div>
          <div className="mb-4 flex flex-wrap gap-4 rounded-xl bg-brand-ink p-6">
            <Button size="cta" variant="onDark">Conoce más</Button>
            <Button size="cta" variant="glass">Conoce más</Button>
            <Button size="cta" variant="onColor">Conoce más</Button>
          </div>
          <div className="mb-4 grid gap-3 text-caption text-ink-600 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["default", "Primary · fondo Aqua, sobre claro"],
              ["onColor", "Type3 · fondo blanco, sobre color"],
              ["onDark", "Secondary · outline, sobre oscuro"],
              ["glass", "Type4 · vidrio 20%, sobre imagen"],
            ].map(([v, d]) => (
              <p key={v}>
                <strong className="font-label text-foreground">{v}</strong>
                <br />
                {d}
              </p>
            ))}
          </div>
          <Snippet>{`// La capa de personalización es className: tailwind-merge
// hace que lo que pasas GANE sobre la base, sin CSS extra.
<Button size="cta" variant="onDark" className="w-full rounded-4xl px-10">
  Conoce más
</Button>`}</Snippet>

          {/* Flecha */}
          <div className="mt-11">
            <SubTitle hint="Círculo de 47px (radio 100). Default outline · hover relleno aqua.">
              Flecha · icono direccional
            </SubTitle>
            <div className="flex items-center gap-6 rounded-xl bg-brand-petrol p-7">
              <ArrowButton tone="onDark" />
              <ArrowButton tone="onDark" className="bg-brand-aqua text-brand-ink" />
              <span className="font-label text-caption text-brand-aqua">
                default · hover
              </span>
            </div>
            <Snippet>{`<ArrowButton tone="onLight" className="size-14" />`}</Snippet>
          </div>

          {/* Benefit card */}
          <div className="mt-11">
            <SubTitle hint="Radio 20px · alto 199px · degradado diagonal · número en círculo de 50px.">
              Tarjeta de beneficio
            </SubTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <BenefitCard step="1" title="Optimiza tu flujo de caja" />
              <BenefitCard step="1" title="Optimiza tu flujo de caja" variant="strong" />
            </div>
            <Snippet>{`// Dos capas: className (raíz) + classNames (slots internos)
<BenefitCard
  step="2"
  title="Deduce impuestos"
  variant="strong"
  className="h-auto min-h-[199px]"
  classNames={{ badge: "bg-brand-neon text-brand-ink", title: "text-h4" }}
/>`}</Snippet>
          </div>

          {/* Banner */}
          <div className="mt-11">
            <SubTitle hint="Acción primaria + secundaria, señal de disponibilidad y foto de apoyo. Los canales se adaptan a lo que haya en .env.">
              CTA de contacto
            </SubTitle>
            <div className="flex flex-col gap-6">
              <DudasBanner />
              {/* Sin foto: para huecos estrechos o cuando ya hay mucha imagen
                  alrededor. */}
              <DudasBanner
                imagen={null}
                titulo="¿Listo para cotizar tu auto?"
                descripcion="Te damos una oferta en minutos, sin costo ni compromiso."
              />
            </div>
          </div>

          {/* Inputs */}
          <div className="mt-11">
            <SubTitle hint="Radio 10px, borde 1px. Etiqueta siempre visible - nunca placeholder como label.">
              Inputs
            </SubTitle>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ds-nombre" className="font-label text-label">
                  Nombre
                </label>
                <Input id="ds-nombre" placeholder="Ana Ruiz" className="h-12 px-4 text-body-2" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ds-monto" className="font-label text-label">
                  Monto a financiar
                </label>
                <Input id="ds-monto" placeholder="$350,000" className="h-12 px-4 text-body-2" />
              </div>
            </div>
          </div>

          {/* Card + badge */}
          <div className="mt-11">
            <SubTitle hint="La Card de shadcn ya hereda el radio 20 y el borde fino desde los tokens.">
              Card & Badge
            </SubTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Arrendamiento puro</CardTitle>
                </CardHeader>
                <CardContent className="text-body-2 text-ink-800">
                  Deduce el 100% de la renta y mantén tu capital trabajando.
                </CardContent>
              </Card>
              <Card className="border-transparent bg-gradient-benefit">
                <CardHeader>
                  <CardTitle>Crédito simple</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Sin aval</Badge>
                  <Badge variant="secondary">48 meses</Badge>
                  <Badge className="bg-brand-neon text-brand-ink">Nuevo</Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Hero */}
          <div className="mt-11">
            <SubTitle hint="Imagen a sangre con overlay degradado hacia el verde, texto e indicadores de slide inferiores.">
              Hero · carrusel
            </SubTitle>
            <HeroSlide
              src="/brand/hero-sample.jpg"
              alt="Flota de vehículos en arrendamiento"
              eyebrow="Patrocinio"
              title="Título del hero sobre imagen con overlay"
              slideCount={4}
              activeSlide={0}
            >
              <div className="mt-6 flex flex-wrap gap-4">
                <Button size="cta" variant="glass">Conoce más</Button>
              </div>
            </HeroSlide>
          </div>

          {/* Footer */}
          <div className="mt-11">
            <SubTitle hint="Fondo Verde Value con blob petróleo, logo blanco y columnas de enlaces.">
              Footer
            </SubTitle>
            <div className="relative overflow-hidden rounded-xl bg-brand-ink px-10 py-9 text-background">
              <div
                aria-hidden
                className="absolute -bottom-[260px] -left-10 h-[420px] w-[900px] rounded-[50%] bg-brand-petrol"
              />
              <div className="relative flex flex-wrap items-start gap-12">
                <BrandLogo tone="white" height={56} />
                {[
                  ["¿Quiénes somos?", "¿Qué es arrendamiento?", "¿Qué es crédito simple?"],
                  ["Analiza tu presupuesto", "Cotiza tu crédito", "Solicitud de crédito"],
                  ["Blog", "Formato SOFOME"],
                ].map((col) => (
                  <ul key={col[0]} className="flex flex-col gap-3.5 text-body-2">
                    {col.map((link) => (
                      <li key={link}>
                        <span className="cursor-default">{link}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* SECCIONES */}
        <Section
          id="secciones"
          eyebrow="08 · Patrones"
          title="Mapa de secciones"
          lead="Las nueve secciones que componen el sitio, con su propósito y los componentes que reutilizan."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SITE_SECTIONS.map((s) => (
              <article key={s.n} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="font-label text-caption font-bold text-brand-petrol">{s.n}</span>
                  <h3 className="font-label text-body-2 font-semibold">{s.name}</h3>
                </div>
                <p className="mb-3 text-label leading-relaxed text-ink-800">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-caption font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <p className="border-t border-border pt-10 text-caption text-brand-sage">
          Design System VALUE Arrendadora · extraído de Figma · implementado con
          Tailwind v4 + shadcn/ui
        </p>
      </main>
    </div>
  );
}
