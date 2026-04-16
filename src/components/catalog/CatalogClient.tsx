"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  toggleBrand,
  toggleBodyType,
  toggleYear,
  setPriceMin,
  setPriceMax,
  setTransmission,
  toggleFuel,
  setSearch,
  setSortBy,
  clearFilters,
} from "@/redux/slices/carsSlice";
import { CARS, Car } from "@/data/cars";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import FilterSidebarSkeleton from "./FilterSidebarSkeleton";
import CatalogCarCard from "./CatalogCarCard";
import CatalogCarCardSkeleton from "./CatalogCarCardSkeleton";
import CatalogTopBarSkeleton from "./CatalogTopBarSkeleton";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "year-desc", label: "Año: más nuevo" },
  { value: "year-asc", label: "Año: más antiguo" },
  { value: "km-asc", label: "KM: menor" },
];

function applyFilters(cars: Car[], filters: RootState["cars"]["filters"]): Car[] {
  let result = [...cars];

  if (filters.brands.length > 0) {
    result = result.filter((c) => filters.brands.includes(c.brand));
  }
  if (filters.bodyTypes.length > 0) {
    result = result.filter((c) => filters.bodyTypes.includes(c.bodyType));
  }
  if (filters.years.length > 0) {
    result = result.filter((c) => filters.years.includes(c.year));
  }
  if (filters.priceMin > 0) {
    result = result.filter((c) => c.price >= filters.priceMin);
  }
  if (filters.priceMax > 0) {
    result = result.filter((c) => c.price <= filters.priceMax);
  }
  if (filters.transmission) {
    result = result.filter((c) => c.transmission === filters.transmission);
  }
  if (filters.fuels.length > 0) {
    result = result.filter((c) => filters.fuels.includes(c.fuel));
  }
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q)
    );
  }

  return result;
}

function applySort(cars: Car[], sortBy: string): Car[] {
  const sorted = [...cars];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    case "year-asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "km-asc":
      return sorted.sort((a, b) => a.km - b.km);
    default:
      return sorted;
  }
}

// Swap `isLoading` for your real API loading flag when the fetch lands
const SKELETON_CARD_COUNT = 9;

export default function CatalogClient() {
  const dispatch = useDispatch();
  const { filters, sortBy } = useSelector((s: RootState) => s.cars);

  // Simulates initial data fetch — replace with real API isLoading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = applyFilters(CARS, filters);
  const results = applySort(filtered, sortBy);

  // Above-fold cards are always rendered immediately — never behind skeleton.
  // Only below-fold cards (index >= 3) show as skeletons during load.
  const ABOVE_FOLD = 3;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 items-start">
        {/* Sidebar — independently scrollable, fixed to viewport height */}
        <aside className="w-64 shrink-0 sticky top-20 self-start max-h-[calc(100dvh-5rem)] overflow-y-auto scrollbar-minimal">
          {isLoading ? (
            <FilterSidebarSkeleton />
          ) : (
            <FilterSidebar
              filters={filters}
              onToggleBrand={(b) => dispatch(toggleBrand(b))}
              onToggleBodyType={(t) => dispatch(toggleBodyType(t))}
              onToggleYear={(y) => dispatch(toggleYear(y))}
              onSetPriceMin={(v) => dispatch(setPriceMin(v))}
              onSetPriceMax={(v) => dispatch(setPriceMax(v))}
              onSetTransmission={(t) => dispatch(setTransmission(t))}
              onToggleFuel={(f) => dispatch(toggleFuel(f))}
              onClear={() => dispatch(clearFilters())}
            />
          )}
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Search + top bar: skeleton while loading, real controls after */}
          {isLoading ? (
            <CatalogTopBarSkeleton />
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Busca por marca, modelo o variante..."
                  value={filters.search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 h-10 text-sm bg-white"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{results.length}</span>{" "}
                  resultados
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                    className="h-8 text-sm border border-border rounded-md px-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Grid — first 3 cards always render immediately (LCP) */}
          {results.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-semibold text-foreground mb-2">Sin resultados</p>
              <p className="text-sm text-muted-foreground mb-4">
                Prueba ajustando los filtros para encontrar más opciones.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Above-fold: real cards, never skeletonised */}
              {results.slice(0, ABOVE_FOLD).map((car, index) => (
                <CatalogCarCard key={car.id} car={car} priority={true} />
              ))}

              {/* Below-fold: skeleton during load, real cards after */}
              {isLoading
                ? Array.from({ length: SKELETON_CARD_COUNT - ABOVE_FOLD }).map((_, i) => (
                    <CatalogCarCardSkeleton key={`sk-${i}`} />
                  ))
                : results.slice(ABOVE_FOLD).map((car) => (
                    <CatalogCarCard key={car.id} car={car} priority={false} />
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
