"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSearch } from "@/redux/slices/searchesSlice";

/**
 * Buscador del hero.
 *
 * Registra el término en redux (persistido) y navega a /compra.
 *
 * Sigue siendo un <form> con `action` y `method="get"`: si JavaScript falla o
 * aún no cargó, el navegador envía el formulario igual y la búsqueda funciona.
 * Sólo se pierde el registro en el historial, que es lo prescindible.
 */
export function HeroSearchForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <form
      action="/compra"
      method="get"
      role="search"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const term = String(data.get("busqueda") ?? "").trim();
        if (!term) return; // sin término, deja que el form navegue solo

        event.preventDefault();
        dispatch(addSearch(term));
        router.push(`/compra?busqueda=${encodeURIComponent(term)}`);
      }}
      className="mt-10 flex w-full max-w-[640px] items-center gap-2 rounded-lg bg-card p-2 pl-4"
    >
      <Search aria-hidden className="size-5 shrink-0 text-ink-600" />
      <label htmlFor="hero-search" className="sr-only">
        Busca por año, marca o modelo
      </label>
      <Input
        id="hero-search"
        name="busqueda"
        type="search"
        placeholder="Busca por año, marca o modelo…"
        className="h-11 flex-1 border-0 bg-transparent text-body-2 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" size="cta" className="shrink-0 py-3">
        Buscar
      </Button>
    </form>
  );
}
