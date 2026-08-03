"use client";

import { useEffect, useState } from "react";

/**
 * `false` durante el render del servidor y en el primer render del cliente;
 * `true` a partir del efecto.
 *
 * Necesario para cualquier cosa que dependa de redux-persist: el estado
 * guardado vive en localStorage, que el servidor no puede leer. Pintarlo
 * directamente haría que el HTML del servidor y el del cliente difieran, y
 * React lanzaría un error de hidratación.
 *
 * Con este hook, servidor y primer render del cliente coinciden (ambos sin
 * datos) y el contenido aparece justo después.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
