"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * Toggle claro/oscuro de un solo botón.
 *
 * Los dos iconos se renderizan SIEMPRE y se cruzan con clases `dark:` (rotación
 * + escala). Al depender solo de la clase `.dark` en <html>, el HTML del
 * servidor y el del cliente coinciden: no hay parpadeo ni error de hidratación,
 * así que no hace falta un guard de "montado".
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex items-center p-1.5 rounded-md cursor-pointer transition-colors hover:bg-muted",
        className
      )}
      aria-label="Cambiar tema"
    >
      <span className="relative size-4 text-foreground/70">
        <Sun className="absolute inset-0 size-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 size-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
      </span>
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}
