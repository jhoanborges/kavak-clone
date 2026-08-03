"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Search, Trash2, X } from "lucide-react";

import { SectionHeading } from "@/components/ds";
import { useHydrated } from "@/hooks/useHydrated";
import type { RootState } from "@/redux/store";
import { clearSearches, removeSearch } from "@/redux/slices/searchesSlice";

/**
 * "Continúa tu búsqueda" — las 10 últimas búsquedas de esta persona.
 *
 * Sustituye al acordeón de filtros hardcodeados ("Busca por precio", "Busca por
 * año"…), que prometía funcionalidad inexistente: ninguna de esas opciones
 * filtraba nada.
 *
 * NO SE RENDERIZA SIN DATOS. Una sección vacía titulada "Continúa tu búsqueda"
 * es peor que ninguna: ocupa espacio y sugiere que algo falló.
 */
export default function BusquedasRecientes() {
  const hydrated = useHydrated();
  const dispatch = useDispatch();
  const recent = useSelector((state: RootState) => state.searches.recent);

  // `hydrated` evita el desajuste de hidratación: el servidor no puede leer
  // localStorage, así que en su render no hay búsquedas.
  if (!hydrated || recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          overline="Tu actividad"
          title="Continúa tu búsqueda"
          lead="Retoma donde te quedaste."
          className="mb-0"
        />
        <button
          type="button"
          onClick={() => dispatch(clearSearches())}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 font-label text-label text-ink-600 transition-colors hover:text-brand-petrol focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Trash2 aria-hidden className="size-4" />
          Borrar historial
        </button>
      </div>

      <ul className="flex flex-wrap gap-3">
        {recent.map(({ term }) => (
          <li key={term} className="flex">
            {/* Chip = enlace a la búsqueda + botón de descarte, separados.
                Anidar un <button> dentro de un <a> es HTML inválido y rompe la
                navegación por teclado. */}
            <div className="group/chip flex items-center overflow-hidden rounded-4xl border border-border bg-card transition-colors hover:border-brand-petrol">
              <Link
                href={`/compra?busqueda=${encodeURIComponent(term)}`}
                className="flex min-h-11 items-center gap-2 py-2 pr-3 pl-4 text-body-2 transition-colors group-hover/chip:text-brand-petrol focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <Search aria-hidden className="size-4 text-ink-500" />
                {term}
              </Link>
              <button
                type="button"
                onClick={() => dispatch(removeSearch(term))}
                aria-label={`Quitar "${term}" del historial`}
                className="flex size-11 cursor-pointer items-center justify-center text-ink-500 transition-colors hover:text-destructive focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
