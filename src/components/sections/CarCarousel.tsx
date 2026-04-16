"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CarCard {
  id: number;
  name: string;
  variant: string;
  price: number;
  monthly: number;
  year: number;
  image?: string;
  badge?: string;
}

interface Props {
  title: string;
  cars: CarCard[];
}

function CarCardItem({ car }: { car: CarCard }) {
  return (
    <div className="shrink-0 w-52 md:w-56 bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Car image area */}
      <div className="relative h-32 bg-slate-100 overflow-hidden">
        {car.badge && (
          <Badge className="absolute top-2 left-2 z-10 text-[10px] px-2 py-0.5 bg-primary text-white">
            {car.badge}
          </Badge>
        )}
        {car.image ? (
          <Image
            src={car.image}
            alt={`${car.name} ${car.variant}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="224px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <svg viewBox="0 0 140 70" className="w-32 opacity-75 group-hover:scale-105 transition-transform duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="36" width="124" height="24" rx="7" fill="#94a3b8"/>
              <rect x="22" y="18" width="96" height="24" rx="5" fill="#cbd5e1"/>
              <circle cx="32" cy="60" r="9" fill="#475569"/>
              <circle cx="32" cy="60" r="4.5" fill="#94a3b8"/>
              <circle cx="108" cy="60" r="9" fill="#475569"/>
              <circle cx="108" cy="60" r="4.5" fill="#94a3b8"/>
              <rect x="25" y="20" width="36" height="16" rx="2" fill="#bfdbfe" opacity="0.8"/>
              <rect x="70" y="20" width="36" height="16" rx="2" fill="#bfdbfe" opacity="0.8"/>
            </svg>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground">{car.name}</p>
        <p className="text-sm font-semibold text-foreground truncate leading-tight">
          {car.variant}
        </p>
        <p className="text-base font-bold text-foreground mt-1">
          ${car.price.toLocaleString("es-MX")}
        </p>
        <p className="text-xs text-muted-foreground">
          Desde ${car.monthly.toLocaleString("es-MX")}/mes
        </p>
      </div>
    </div>
  );
}

export default function CarCarousel({ title, cars }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="size-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {cars.map((car) => (
          <CarCardItem key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
