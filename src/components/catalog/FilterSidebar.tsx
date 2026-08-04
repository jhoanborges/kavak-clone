"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CARS } from "@/data/cars";
import { CarsFilters } from "@/redux/slices/carsSlice";
import { cn } from "@/lib/utils";

const ALL_BRANDS = [
  "Acura","Alfa Romeo","Audi","Baic","BMW","Buick","BYD","Cadillac","Changan",
  "Chevrolet","Chirey","Chrysler","Cupra","Dodge","Fiat","Ford","GAC","Geely",
  "GMC","Great Wall","Honda","Hyundai","Infiniti","Jac","Jaecoo","Jaguar","Jeep",
  "Jetour","Jmc","Kia","Land Rover","Lexus","Lincoln","Mazda","Mercedes Benz",
  "Mg","Mini","Mitsubishi","Nissan","Omoda","Peugeot","Porsche","Ram","Renault",
  "Seat","Smart","Subaru","Suzuki","Tesla","Toyota","Volkswagen","Volvo",
];

const POPULAR_BRANDS = [
  { name: "Chevrolet", logo: "/marcas/chevrolet.webp" },
  { name: "Honda",     logo: "/marcas/honda.webp" },
  { name: "Kia",       logo: "/marcas/kia.webp" },
  { name: "Mazda",     logo: "/marcas/mazda.webp" },
  { name: "Nissan",    logo: "/marcas/nissan.webp" },
  { name: "Volkswagen",logo: "/marcas/volkswagen.webp" },
];

const uniqueBodyTypes = [...new Set(CARS.map((c) => c.bodyType))].sort();
const uniqueYears = [...new Set(CARS.map((c) => c.year))].sort((a, b) => b - a);
const transmissions = ["Automático", "Manual"];
const fuels = ["Gasolina", "Híbrido", "Eléctrico"];

interface FilterSidebarProps {
  filters: CarsFilters;
  onToggleBrand: (brand: string) => void;
  onToggleBodyType: (type: string) => void;
  onToggleYear: (year: number) => void;
  onSetPriceMin: (val: number) => void;
  onSetPriceMax: (val: number) => void;
  onSetTransmission: (val: string) => void;
  onToggleFuel: (fuel: string) => void;
  onClear: () => void;
}

function MarcaContent({
  filters,
  onToggleBrand,
}: {
  filters: CarsFilters;
  onToggleBrand: (brand: string) => void;
}) {
  const [brandSearch, setBrandSearch] = useState("");

  const filtered = ALL_BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Brand search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Filtrar por marca"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>

      {/* Popular brands grid — only shown when not searching */}
      {!brandSearch && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Más populares</p>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_BRANDS.map((b) => {
              const active = filters.brands.includes(b.name);
              return (
                <button
                  key={b.name}
                  onClick={() => onToggleBrand(b.name)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all cursor-pointer",
                    active
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <div className="relative w-10 h-8">
                    <Image
                      src={b.logo}
                      alt={b.name}
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>
                  <span className={cn(
                    "text-[11px] font-medium leading-tight text-center",
                    active ? "text-primary" : "text-foreground/70"
                  )}>
                    {b.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All brands checkboxes */}
      <div>
        {!brandSearch && (
          <p className="text-xs font-semibold text-foreground mb-2">Todas las marcas</p>
        )}
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto scrollbar-minimal pr-0.5">
          {filtered.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onToggleBrand(brand)}
                className="rounded border-border accent-primary w-3.5 h-3.5 shrink-0"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground py-1">Sin resultados</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onToggleBrand,
  onToggleBodyType,
  onToggleYear,
  onSetPriceMin,
  onSetPriceMax,
  onSetTransmission,
  onToggleFuel,
  onClear,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.bodyTypes.length > 0 ||
    filters.years.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax > 0 ||
    filters.transmission !== "" ||
    filters.fuels.length > 0 ||
    filters.search.trim().length > 0;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Filtros</span>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["marca", "carroceria", "precio", "transmision", "combustible"]}
        className="divide-y divide-border"
      >
        {/* Marca */}
        <AccordionItem value="marca" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <span>
              Marca
              {filters.brands.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold w-4 h-4">
                  {filters.brands.length}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <MarcaContent
              filters={filters}
              onToggleBrand={onToggleBrand}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Carrocería */}
        <AccordionItem value="carroceria" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            Carrocería
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto scrollbar-minimal pr-0.5">
              {uniqueBodyTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.bodyTypes.includes(type)}
                    onChange={() => onToggleBodyType(type)}
                    className="rounded border-border accent-primary w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Año */}
        <AccordionItem value="anio" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            Año
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto scrollbar-minimal pr-0.5">
              {uniqueYears.map((year) => (
                <label
                  key={year}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.years.includes(year)}
                    onChange={() => onToggleYear(year)}
                    className="rounded border-border accent-primary w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {year}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Precio */}
        <AccordionItem value="precio" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            Precio
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Precio mínimo
                </label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.priceMin || ""}
                  onChange={(e) => onSetPriceMin(Number(e.target.value))}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Precio máximo
                </label>
                <Input
                  type="number"
                  placeholder="Sin límite"
                  value={filters.priceMax || ""}
                  onChange={(e) => onSetPriceMax(Number(e.target.value))}
                  className="h-8 text-sm"
                />
              </div>
              {(filters.priceMin > 0 || filters.priceMax > 0) && (
                <p className="text-xs text-muted-foreground">
                  {filters.priceMin > 0
                    ? `$${filters.priceMin.toLocaleString("es-MX")}`
                    : "$0"}{" "}
                  —{" "}
                  {filters.priceMax > 0
                    ? `$${filters.priceMax.toLocaleString("es-MX")}`
                    : "sin límite"}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transmisión */}
        <AccordionItem value="transmision" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            Transmisión
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === ""}
                  onChange={() => onSetTransmission("")}
                  className="accent-primary w-3.5 h-3.5 shrink-0"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  Todos
                </span>
              </label>
              {transmissions.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="transmission"
                    checked={filters.transmission === t}
                    onChange={() => onSetTransmission(t)}
                    className="accent-primary w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Combustible */}
        <AccordionItem value="combustible" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            Combustible
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="flex flex-col gap-2">
              {fuels.map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.fuels.includes(fuel)}
                    onChange={() => onToggleFuel(fuel)}
                    className="rounded border-border accent-primary w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {fuel}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Footer clear button */}
      <div className="px-4 py-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm"
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
