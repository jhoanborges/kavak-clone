"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Envuelve next-themes. Aplica el tema como CLASE en <html> (`class="dark"`),
 * que es justo lo que espera `@custom-variant dark (&:is(.dark *))` y los
 * tokens `.dark { ... }` de globals.css.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
