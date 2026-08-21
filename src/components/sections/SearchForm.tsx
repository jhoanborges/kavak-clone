"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSearch } from "@/redux/slices/searchesSlice";
import { cn } from "@/lib/utils";

/**
 * Buscador de vehículos con autocomplete. Se usa en el hero y sobre el catálogo.
 *
 * Sugerencias en vivo desde /api/buscar (webservice TRADEIN, LISTADO_BUSQUEDA),
 * con debounce y navegación por teclado. Registra el término en redux y navega a
 * /vehiculos?busqueda=…, que es donde se consulta la API.
 *
 * Conserva `action` y `method="get"`: si JavaScript falla o aún no ha cargado,
 * el navegador envía el formulario igual y la búsqueda funciona. El autocomplete
 * es una mejora progresiva, no un requisito.
 */

type Sugerencia = { texto: string; tipo: "marca" | "modelo" };

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
  const id = useId();
  const listId = `${id}-lista`;

  const [term, setTerm] = useState(defaultValue);
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  // Evita que la respuesta de un término ya viejo pise a la del término actual.
  const cerrarPorSeleccion = useRef(false);

  // Debounce + fetch de sugerencias.
  useEffect(() => {
    const t = term.trim();
    if (cerrarPorSeleccion.current) {
      cerrarPorSeleccion.current = false;
      return;
    }
    if (t.length < 2) {
      setSugerencias([]);
      setAbierto(false);
      return;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(t)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { sugerencias?: Sugerencia[] };
        const lista = Array.isArray(data.sugerencias) ? data.sugerencias : [];
        setSugerencias(lista);
        setAbierto(lista.length > 0);
        setActivo(-1);
      } catch {
        // Abortado o red caída: sin sugerencias, el form sigue funcionando.
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [term]);

  function irA(texto: string) {
    const t = texto.trim();
    if (!t) return;
    cerrarPorSeleccion.current = true;
    setTerm(t);
    setAbierto(false);
    dispatch(addSearch(t));
    router.push(`/vehiculos?busqueda=${encodeURIComponent(t)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!abierto || sugerencias.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => (i + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => (i <= 0 ? sugerencias.length - 1 : i - 1));
    } else if (e.key === "Enter" && activo >= 0) {
      e.preventDefault();
      irA(sugerencias[activo].texto);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  }

  return (
    <form
      action="/vehiculos"
      method="get"
      role="search"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const t = String(data.get("busqueda") ?? "").trim();
        if (!t) return; // sin término, que el form navegue solo

        event.preventDefault();
        dispatch(addSearch(t));
        setAbierto(false);
        router.push(`/vehiculos?busqueda=${encodeURIComponent(t)}`);
      }}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-lg bg-card",
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
        role="combobox"
        aria-expanded={abierto}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activo >= 0 ? `${listId}-${activo}` : undefined
        }
        autoComplete="off"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => sugerencias.length > 0 && setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 120)}
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

      {abierto && sugerencias.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {sugerencias.map((s, i) => (
            <li
              key={`${s.tipo}-${s.texto}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activo}
              // onMouseDown, no onClick: se dispara antes del blur del input,
              // así la navegación no se pierde al cerrar el dropdown.
              onMouseDown={(e) => {
                e.preventDefault();
                irA(s.texto);
              }}
              onMouseEnter={() => setActivo(i)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-body-2",
                i === activo ? "bg-muted" : "bg-transparent"
              )}
            >
              <Search aria-hidden className="size-4 shrink-0 text-ink-600" />
              <span className="truncate">{s.texto}</span>
              <span className="ml-auto shrink-0 text-caption uppercase text-ink-600">
                {s.tipo}
              </span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
