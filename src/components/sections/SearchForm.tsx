"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSearch } from "@/redux/slices/searchesSlice";
import { cn } from "@/lib/utils";

/**
 * Buscador de vehículos. Se usa en el hero y sobre el catálogo.
 *
 * Registra el término en redux (persistido, ver searchesSlice) y navega a
 * /vehiculos?busqueda=…, que es donde se consulta la API.
 *
 * Conserva `action` y `method="get"`: si JavaScript falla o aún no ha cargado,
 * el navegador envía el formulario igual y la búsqueda funciona. Lo único que
 * se pierde es el registro en el historial, que es lo prescindible.
 */
export function SearchForm({
  defaultValue = "",
  className,
  size = "default",
  placeholder = "Busca por año, marca o modelo…",
}: {
  defaultValue?: string;
  className?: string;
  size?: "default" | "compact";
  placeholder?: string;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  // useId, no un contador de módulo: aquel se incrementaba en el render del
  // servidor y volvía a empezar en el cliente, así que el servidor emitía
  // "search-1" y el cliente "search-2" - desajuste de hidratación. useId
  // genera identificadores estables entre ambos.
  const id = useId();

  return (
    <form
      action="/vehiculos"
      method="get"
      role="search"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const term = String(data.get("busqueda") ?? "").trim();
        if (!term) return; // sin término, que el form navegue solo

        event.preventDefault();
        dispatch(addSearch(term));
        router.push(`/vehiculos?busqueda=${encodeURIComponent(term)}`);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg bg-card",
        size === "default" ? "max-w-[640px] p-2 pl-4" : "border border-border p-1.5 pl-3",
        className
      )}
    >
      <Search aria-hidden className="size-5 shrink-0 text-ink-600" />
      <label htmlFor={id} className="sr-only">
        Busca por año, marca o modelo
      </label>
      <Input
        id={id}
        name="busqueda"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(
          "flex-1 border-0 bg-transparent text-body-2 shadow-none focus-visible:ring-0",
          size === "default" ? "h-11" : "h-9"
        )}
      />
      <Button
        type="submit"
        size="cta"
        className={cn("shrink-0", size === "default" ? "py-3" : "px-4 py-2")}
      >
        Buscar
      </Button>
    </form>
  );
}
