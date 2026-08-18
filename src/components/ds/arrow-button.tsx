import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Flecha · icono direccional (Design System VALUE)
 * Círculo de 47px (radio 100). Dos estados: default (outline) y hover (relleno aqua).
 *
 * Personalización: `className` se fusiona con tailwind-merge, así que cualquier
 * utility que pases GANA sobre la base - `<ArrowButton className="size-14 bg-brand-neon" />`.
 */
function ArrowButton({
  className,
  tone = "onDark",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "variant"> & {
  /** Fondo sobre el que vive el botón. */
  tone?: "onDark" | "onLight";
}) {
  return (
    <Button
      variant="ghost"
      size="icon-round"
      aria-label="Continuar"
      className={cn(
        "border transition-colors",
        tone === "onDark" &&
          "border-white text-white hover:bg-brand-aqua hover:text-brand-ink",
        tone === "onLight" &&
          "border-brand-ink text-brand-ink hover:bg-brand-aqua hover:text-brand-ink",
        className
      )}
      {...props}
    >
      {children ?? <ArrowRight aria-hidden />}
    </Button>
  );
}

export { ArrowButton };
