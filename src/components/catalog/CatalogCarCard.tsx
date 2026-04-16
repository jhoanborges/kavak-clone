"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Gauge, Calendar, Cog } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Car } from "@/data/cars";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/redux/slices/carsSlice";
import type { RootState } from "@/redux/store";

function toSlug(car: { brand: string; model: string; id: number }) {
  return `${car.brand}-${car.model}-${car.id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface CatalogCarCardProps {
  car: Car;
  priority?: boolean;
}

function formatPrice(n: number): string {
  return "$" + n.toLocaleString("es-MX");
}

function formatKm(n: number): string {
  return n.toLocaleString("es-MX") + " km";
}

const badgeColors: Record<string, string> = {
  "Más vendido": "bg-primary text-white",
  Destacado: "bg-amber-500 text-white",
  "Nuevo ingreso": "bg-emerald-600 text-white",
};

export default function CatalogCarCard({ car, priority = false }: CatalogCarCardProps) {
  const dispatch = useDispatch();
  const favorited = useSelector((state: RootState) => state.cars.favorites.includes(car.id));
  const slug = toSlug(car);

  return (
    <article className="relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer">
      {/* Full-card link overlay */}
      <Link
        href={`/compra/${slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalles de ${car.brand} ${car.model} ${car.year}`}
      />

      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />

        {/* Certified badge */}
        {car.certified && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
            <ShieldCheck className="size-3" />
            Certificado
          </div>
        )}

        {/* Badge overlay */}
        {car.badge && (
          <div
            className={cn(
              "absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full",
              badgeColors[car.badge] ?? "bg-primary text-primary-foreground"
            )}
          >
            {car.badge}
          </div>
        )}

        {/* Heart / favorite button — above the overlay link */}
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleFavorite(car.id));
          }}
          className="absolute top-2 right-2 z-20 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer"
          aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              favorited ? "fill-red-500 text-red-500" : "text-foreground/50"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Name */}
        <div>
          <p className="font-bold text-sm text-foreground leading-tight">
            {car.brand} {car.model}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{car.variant}</p>
        </div>

        {/* Price */}
        <div>
          <p className="text-xl font-bold text-foreground tracking-tight">
            {formatPrice(car.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            Desde {formatPrice(car.monthly)}/mes
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Calendar className="size-3 shrink-0" />
            {car.year}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Gauge className="size-3 shrink-0" />
            {formatKm(car.km)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Cog className="size-3 shrink-0" />
            {car.transmission}
          </span>
        </div>

        {/* Color + fuel row */}
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-border shrink-0"
            style={{ backgroundColor: car.color }}
            title={`Color: ${car.color}`}
          />
          <span className="text-xs text-muted-foreground">{car.fuel}</span>
        </div>
      </div>
    </article>
  );
}
