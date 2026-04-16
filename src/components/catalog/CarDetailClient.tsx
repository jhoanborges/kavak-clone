"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import {
  Sun,
  Shield,
  MapPin,
  Monitor,
  Smartphone,
  Settings,
  Gauge,
  Wind,
  Star,
  ChevronRight,
  Car,
  Fuel,
  Calendar,
  Users,
  DoorOpen,
  Palette,
  ArrowRight,
  FileText,
  CalendarDays,
  Wrench,
  ArrowLeftRight,
  BadgeDollarSign,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CatalogCarCard from "@/components/catalog/CatalogCarCard";
import type { Car as CarType } from "@/data/cars";
import { cn } from "@/lib/utils";

interface Props {
  car: CarType;
  allCars: CarType[];
}

function toSlug(car: { brand: string; model: string; id: number }) {
  return `${car.brand}-${car.model}-${car.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatPrice(n: number) {
  return "$" + n.toLocaleString("es-MX");
}

// Gallery pool by body type — 10 unique photos each
const galleryPool: Record<string, string[]> = {
  SUV: [
    "photo-1533473359331-0135ef1b58bf",
    "photo-1606664515524-ed2f786a0bd6",
    "photo-1616422285623-13ff0162193c",
    "photo-1555215695-3004980ad54e",
    "photo-1567818735868-e71b99932e29",
    "photo-1519641471654-76ce0107ad1b",
    "photo-1583121274602-3e2820c69888",
    "photo-1504215680853-026ed2a45def",
    "photo-1494976388531-d1058494cdd8",
    "photo-1549317661-bd32c8ce0db2",
  ],
  Sedan: [
    "photo-1541899481282-d53bffe3c35d",
    "photo-1494976388531-d1058494cdd8",
    "photo-1502877338535-766e1452684a",
    "photo-1549317661-bd32c8ce0db2",
    "photo-1580273916550-e323be2ae537",
    "photo-1533473359331-0135ef1b58bf",
    "photo-1555215695-3004980ad54e",
    "photo-1519641471654-76ce0107ad1b",
    "photo-1567818735868-e71b99932e29",
    "photo-1616422285623-13ff0162193c",
  ],
  Hatchback: [
    "photo-1503376780353-7e6692767b70",
    "photo-1552519507-da3b142c6e3d",
    "photo-1541899481282-d53bffe3c35d",
    "photo-1494976388531-d1058494cdd8",
    "photo-1502877338535-766e1452684a",
    "photo-1580273916550-e323be2ae537",
    "photo-1533473359331-0135ef1b58bf",
    "photo-1555215695-3004980ad54e",
    "photo-1606664515524-ed2f786a0bd6",
    "photo-1616422285623-13ff0162193c",
  ],
  Pickup: [
    "photo-1558618666-fcd25c85cd64",
    "photo-1504215680853-026ed2a45def",
    "photo-1583121274602-3e2820c69888",
    "photo-1533473359331-0135ef1b58bf",
    "photo-1606664515524-ed2f786a0bd6",
    "photo-1519641471654-76ce0107ad1b",
    "photo-1555215695-3004980ad54e",
    "photo-1567818735868-e71b99932e29",
    "photo-1549317661-bd32c8ce0db2",
    "photo-1616422285623-13ff0162193c",
  ],
  Coupe: [
    "photo-1580274455191-1c62238fa333",
    "photo-1544636331-e26879cd4d9b",
    "photo-1552519507-da3b142c6e3d",
    "photo-1494905998402-395d579af36f",
    "photo-1503376780353-7e6692767b70",
    "photo-1541899481282-d53bffe3c35d",
    "photo-1580273916550-e323be2ae537",
    "photo-1494976388531-d1058494cdd8",
    "photo-1502877338535-766e1452684a",
    "photo-1533473359331-0135ef1b58bf",
  ],
  Minivan: [
    "photo-1533473359331-0135ef1b58bf",
    "photo-1519641471654-76ce0107ad1b",
    "photo-1606664515524-ed2f786a0bd6",
    "photo-1555215695-3004980ad54e",
    "photo-1567818735868-e71b99932e29",
    "photo-1583121274602-3e2820c69888",
    "photo-1504215680853-026ed2a45def",
    "photo-1549317661-bd32c8ce0db2",
    "photo-1616422285623-13ff0162193c",
    "photo-1494976388531-d1058494cdd8",
  ],
};

const featuredEquipment = [
  { label: "Quemacocos panorámico", category: "Confort", Icon: Sun },
  { label: "8 bolsas de aire", category: "Seguridad", Icon: Shield },
  { label: "Asientos de piel", category: "Tapizado", Icon: Star },
  { label: "Sistema GPS", category: "Tecnología", Icon: MapPin },
  { label: "Pantalla Táctil", category: "Entretenimiento", Icon: Monitor },
  { label: "Apple CarPlay", category: "Entretenimiento", Icon: Smartphone },
  { label: "Android Auto", category: "Entretenimiento", Icon: Smartphone },
  { label: "Frenos ABS", category: "Seguridad", Icon: Settings },
  { label: "Control de crucero", category: "Confort", Icon: Gauge },
  { label: "Aire acondicionado", category: "Confort", Icon: Wind },
];

const categoryColors: Record<string, string> = {
  Confort: "bg-blue-50 text-blue-700 border-blue-200",
  Seguridad: "bg-red-50 text-red-700 border-red-200",
  Tapizado: "bg-amber-50 text-amber-700 border-amber-200",
  Tecnología: "bg-purple-50 text-purple-700 border-purple-200",
  Entretenimiento: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const specAccordions: {
  id: string;
  label: string;
  Icon: React.ElementType;
  specs: [string, string][];
}[] = [
  {
    id: "general",
    label: "General",
    Icon: Car,
    specs: [
      ["Litros", "1.4"],
      ["Número de Velocidades", "6"],
      ["Caballos de Fuerza Estimado", "150 HP"],
      ["Consumo combinado (l/100km)", "6.6"],
      ["Cilindros", "4"],
      ["Autonomía combinada (km)", "750"],
      ["Combustible", "Gasolina"],
      ["Tipo de motor", "Turbo"],
    ],
  },
  {
    id: "exterior",
    label: "Exterior",
    Icon: Car,
    specs: [
      ['Diámetro de Rin', '19"'],
      ["Puertas", "5"],
      ["Carrocería", "SUV"],
      ["Tipo de Rin", "Aleación"],
      ["Tipo de luz", "LED"],
    ],
  },
  {
    id: "equipamiento",
    label: "Equipamiento y confort",
    Icon: Settings,
    specs: [
      ["Asientos calefaccionados", "Sí"],
      ["Techo Panorámico", "Sí"],
      ["Sensor distancia", "Sí"],
      ["Control Crucero", "Sí"],
      ["GPS", "Sí"],
      ["Botón de Encendido", "Sí"],
      ["A/C", "Sí"],
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    Icon: Shield,
    specs: [
      ["Asistencia de frenado", "Sí"],
      ["Bolsas de aire", "8"],
      ["Sensor de ángulo muerto", "Sí"],
      ["Control de estabilidad", "Sí"],
      ["ABS", "Sí"],
      ["ISOFIX", "Sí"],
    ],
  },
  {
    id: "interior",
    label: "Interior",
    Icon: Users,
    specs: [
      ["Pasajeros", "5"],
      ["Material asientos", "Cuero"],
      ["Pantalla", "Sí"],
    ],
  },
  {
    id: "entretenimiento",
    label: "Entretenimiento",
    Icon: Monitor,
    specs: [
      ["Apple CarPlay", "Sí"],
      ["Android Auto", "Sí"],
      ["Bluetooth", "Sí"],
      ["Pantalla táctil", "Sí"],
      ["Radio AM/FM", "Sí"],
    ],
  },
];

const inspectionPhotos = [
  "photo-1503376780353-7e6692767b70",
  "photo-1494905998402-395d579af36f",
  "photo-1552519507-da3b142c6e3d",
];

const policies = [
  {
    Icon: CalendarDays,
    text: "Política de devolución de 7 días o 300km",
  },
  {
    Icon: Wrench,
    text: "Auto inspeccionado legal y mecánicamente",
  },
  {
    Icon: ArrowLeftRight,
    text: "Bono extra al entregar tu auto actual",
  },
  {
    Icon: BadgeDollarSign,
    text: "Pago a meses: aprobamos 6 de cada 10 solicitudes",
  },
  {
    Icon: ShieldCheck,
    text: "Transacción segura, sin trámites engorrosos",
  },
];

// CTA car images
const ctaCarImages = [
  "photo-1606664515524-ed2f786a0bd6",
  "photo-1533473359331-0135ef1b58bf",
  "photo-1555215695-3004980ad54e",
];

export default function CarDetailClient({ car, allCars }: Props) {
  // Build gallery
  const pool = galleryPool[car.bodyType] ?? galleryPool.SUV;
  const extraImages = pool
    .filter((id) => !car.image.includes(id))
    .slice(0, 9)
    .map((id) => `https://images.unsplash.com/${id}?w=900&h=600&fit=crop&auto=format`);
  const gallery = [car.image, ...extraImages];

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Year chips
  const fakeYears = [
    car.year - 2,
    car.year - 1,
    car.year,
    car.year + 1,
  ].map((y, i) => ({
    year: y,
    price: car.price - 40000 + i * 20000,
  }));

  // Variant chips
  const fakeVariants = [
    { label: "1.4 COMFORTLINE", price: car.price - 30000 },
    { label: car.variant, price: car.price },
    { label: "2.0 HIGHLINE", price: car.price + 40000 },
  ];

  // Similar cars
  const similarCars = allCars
    .filter((c) => c.bodyType === car.bodyType && c.id !== car.id)
    .slice(0, 4);

  // Fake stock ID from car id
  const stockId = 500000 + car.id;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
          <Link href="/compra" className="hover:text-foreground transition-colors">
            Seminuevos
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <span>{car.brand}</span>
          <ChevronRight className="size-3 shrink-0" />
          <span>{car.model}</span>
          <ChevronRight className="size-3 shrink-0" />
          <span>{car.year}</span>
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{car.variant}</span>
        </nav>

        {/* ── Hero grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ── Left: gallery ───────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {/* Gallery: vertical thumbnails left + main image right */}
            <div className="flex gap-3">
              {/* Vertical thumbnail strip */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] scrollbar-minimal pr-0.5">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                      i === activeImg
                        ? "border-blue-600 ring-1 ring-blue-600"
                        : "border-border hover:border-muted-foreground"
                    )}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <button
                className="relative flex-1 aspect-video rounded-xl overflow-hidden bg-muted cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
                aria-label="Ver imagen en pantalla completa"
              >
                <Image
                  src={gallery[activeImg]}
                  alt={`${car.brand} ${car.model} ${car.year} — imagen ${activeImg + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  priority
                />
                {/* Zoom hint */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  Ampliar
                </div>
              </button>
            </div>

            {/* Lightbox */}
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={activeImg}
              slides={gallery.map((src) => ({ src }))}
              on={{ view: ({ index }) => setActiveImg(index) }}
              plugins={[Zoom, Fullscreen]}
            />

            {/* Badge row */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                <Star className="size-3" />
                Único dueño
              </span>
              {car.certified && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  <Shield className="size-3" />
                  Certificado
                </span>
              )}
            </div>

            {/* Descripción general — inline below gallery */}
            <div className="mt-2">
              <h2 className="text-lg font-bold text-foreground mb-3">Descripción general</h2>
              <div className="bg-white border border-border rounded-xl divide-y divide-border">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="px-5 py-4">
                    <p className="text-xs text-muted-foreground mb-0.5">Consumo combinado (l / 100 km)</p>
                    <p className="text-sm font-semibold text-foreground">6.6</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-muted-foreground mb-0.5">Ciudad</p>
                    <p className="text-sm font-semibold text-foreground">Ciudad de México</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="px-5 py-4">
                    <p className="text-xs text-muted-foreground mb-0.5">Sucursal</p>
                    <p className="text-sm font-semibold text-blue-600">Kavak WH Lerma</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-muted-foreground mb-0.5">Stock ID</p>
                    <p className="text-sm font-semibold text-foreground">{stockId}</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-muted-foreground mb-0.5">Estacionado en</p>
                  <p className="text-sm font-semibold text-foreground">TALLER</p>
                </div>
              </div>
            </div>

            {/* Equipamiento destacado */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-foreground mb-3">Equipamiento destacado</h2>
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredEquipment.map(({ label, category, Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-gray-50"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full border w-fit font-medium",
                            categoryColors[category] ?? "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Características principales */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-foreground mb-3">Características principales</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <Accordion type="single" collapsible defaultValue="general">
                  {specAccordions.map((section, idx) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className={idx > 0 ? "border-t border-border" : ""}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <section.Icon className="size-4 text-muted-foreground" />
                          {section.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-2">
                        <div className="divide-y divide-border">
                          {section.specs.map(([label, value]) => (
                            <div key={label} className="grid grid-cols-2 py-3 gap-4">
                              <span className="text-sm text-muted-foreground">{label}</span>
                              <span className="text-sm font-semibold text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* ── Right: sticky sidebar ───────────────────────── */}
          <div className="lg:sticky lg:top-20">
            <div className="flex flex-col gap-4">
              {/* Title block */}
              <div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">
                  {car.brand} {car.model} {car.variant} {car.bodyType} {car.year}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {car.km.toLocaleString("es-MX")} km &bull; Ciudad de México
                </p>
              </div>

              {/* Price box */}
              <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Precio regular
                  </span>
                  <span className="text-3xl font-bold text-foreground tracking-tight">
                    {formatPrice(car.price)}
                  </span>
                </div>

                <Separator />

                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    A meses con Crédito
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(car.monthly * 72)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    72 meses de {formatPrice(car.monthly)}/mes
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer" size="lg">
                    <Link href="/registro">Apartar o Agendar visita</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full cursor-pointer" size="lg">
                    <Link href="/registro">Cotizar mi auto</Link>
                  </Button>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                {policies.map(({ Icon, text }, i) => (
                  <div key={i} className={cn("flex items-center gap-3 px-4 py-3", i < policies.length - 1 && "border-b border-border")}>
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Icon className="size-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-foreground leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* Year chips */}
              <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Años disponibles
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fakeYears.map((item) => (
                    <button
                      key={item.year}
                      className={cn(
                        "shrink-0 flex flex-col items-center px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                        item.year === car.year
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-border bg-white text-foreground hover:border-muted-foreground"
                      )}
                    >
                      <span className="font-bold">{item.year}</span>
                      <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant chips */}
              <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Versiones
                </p>
                <div className="flex flex-col gap-2">
                  {fakeVariants.map((v) => (
                    <button
                      key={v.label}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer text-left",
                        v.label === car.variant
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-border bg-white text-foreground hover:border-muted-foreground"
                      )}
                    >
                      <span className="truncate pr-2">{v.label}</span>
                      <span className="shrink-0 font-bold">{formatPrice(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────── Below-hero sections ─────────────────── */}

        {/* ── 4. CTA Financiamiento ────────────────────────────────── */}
        <section className="mt-10">
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center">
              {/* Left content */}
              <div className="p-8 flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-foreground leading-tight">
                  Paga tu auto en hasta 72 meses
                </h3>
                <p className="text-sm text-muted-foreground">
                  Con Crédito obtén la mejor opción de financiamiento para tu auto
                </p>
                <div>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer gap-2">
                    <Link href="/registro">
                      <CreditCard className="size-4" />
                      Simular plan de pagos
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Right: stacked car images */}
              <div className="hidden sm:flex flex-col gap-2 p-6 pr-8 items-end">
                {ctaCarImages.map((photoId, i) => (
                  <div
                    key={photoId}
                    className={cn(
                      "relative rounded-xl overflow-hidden border border-border shadow-sm bg-muted",
                      i === 1 ? "w-48 h-28 z-10" : "w-36 h-20"
                    )}
                  >
                    <Image
                      src={`https://images.unsplash.com/${photoId}?w=400&h=250&fit=crop&auto=format`}
                      alt={`Auto financiamiento ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Reporte de inspección ────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Reporte de inspección</h2>
          <div className="bg-white border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Shield className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Informe de inspección completo</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Consulta el informe con todos los detalles del estado del auto.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="shrink-0 flex items-center gap-2 cursor-pointer">
              <Link href="/registro">
                <FileText className="size-4" />
                Consultar informe
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ── 6. Inspección fotográfica ───────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Inspección fotográfica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {inspectionPhotos.map((photoId, i) => (
              <div key={photoId} className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <Image
                  src={`https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop&auto=format`}
                  alt={`Inspección fotográfica ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. También te podría interesar ─────────────────────── */}
        {similarCars.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">También te podría interesar</h2>
              <Link
                href="/compra"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Ver todos
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarCars.map((c) => (
                <CatalogCarCard key={c.id} car={c} />
              ))}
            </div>
          </section>
        )}

        {/* ── 8. Preguntas frecuentes ─────────────────────────────── */}
        <CarFaq car={car} similarCars={similarCars} />
      </div>
    </main>
  );
}

/* ─── FAQ sub-component ────────────────────────────────────────── */
function CarFaq({ car, similarCars }: { car: CarType; similarCars: CarType[] }) {
  const fuelCityEst = (6.6 + (car.id % 3) * 0.4).toFixed(1);
  const fuelHwyEst  = (4.8 + (car.id % 3) * 0.3).toFixed(1);
  const fuelCombEst = (5.8 + (car.id % 3) * 0.3).toFixed(1);
  const litros      = "1.4";
  const cilindros   = "4";
  const hp          = 115 + (car.id % 6) * 5;
  const accel       = (10.5 + (car.id % 5) * 0.4).toFixed(1);

  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "¿Cuál es el consumo de combustible del auto?",
      a: `Esta versión tiene un consumo en ciudad de ${fuelCityEst} l/100km, en carretera de ${fuelHwyEst} l/100km y un consumo combinado de ${fuelCombEst} l/100km.`,
    },
    {
      q: "¿Cuáles son las características del motor?",
      a: `Este modelo cuenta con un motor de ${litros} litros y ${cilindros} cilindros, con una potencia estimada de ${hp} caballos de fuerza.`,
    },
    {
      q: "¿Cuáles son las características de performance del auto?",
      a: `Ofrece una aceleración estimada de 0 a 100 km/h en ${accel} segundos, brindando una experiencia ágil y dinámica en la conducción.`,
    },
    {
      q: "¿Cuáles son las características de seguridad del auto?",
      a: `En cuanto a seguridad, este vehículo cuenta con discos de frenos, bolsas de aire delanteras y laterales, así como asistencia de frenado para garantizar la protección de los ocupantes en caso de una eventualidad en la carretera.`,
    },
    {
      q: "¿Qué autos son similares a esta versión?",
      a: similarCars.length > 0 ? (
        <span>
          Algunas opciones similares a este modelo son el{" "}
          {similarCars.slice(0, 3).map((c, i) => {
            const s = toSlug(c);
            return (
              <span key={c.id}>
                <Link href={`/compra/${s}`} className="text-blue-600 hover:underline">
                  {c.brand} {c.model} {c.year}
                </Link>
                {i < Math.min(similarCars.length, 3) - 1 ? ", " : ""}
              </span>
            );
          })}
          . Estos vehículos ofrecen un equilibrio entre eficiencia en el consumo de combustible, potencia y seguridad, al igual que esta versión.
        </span>
      ) : (
        `Actualmente no tenemos modelos similares disponibles, pero puedes explorar nuestro catálogo completo de ${car.bodyType.toLowerCase()}s.`
      ),
    },
  ];

  return (
    <section className="mt-10 mb-8">
      <h2 className="text-xl font-bold text-foreground mb-1">
        Preguntas frecuentes de Carros {car.brand} {car.model} {car.variant} {car.year}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Resuelve tus dudas sobre este {car.bodyType.toLowerCase()} seminuevo certificado.
      </p>
      <div className="divide-y divide-border border-t border-border">
        {faqs.map(({ q, a }, i) => (
          <FaqItem key={i} question={q} answer={a} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
          {question}
        </span>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-blue-600 transition-transform duration-200",
            open ? "-rotate-90" : "rotate-90"
          )}
        />
      </button>
      {open && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  );
}
