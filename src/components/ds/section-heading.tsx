import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeadingSlots = "overline" | "title" | "lead";

/**
 * Encabezado de sección (Design System VALUE)
 * Overline (Raleway 13px, MAYÚS, tracking 0.14em) + H2 + párrafo de entrada.
 * Es el patrón que repiten las 9 secciones del sitio.
 */
function SectionHeading({
  overline,
  title,
  lead,
  as: Comp = "h2",
  className,
  classNames,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  overline?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  classNames?: Partial<Record<SectionHeadingSlots, string>>;
}) {
  return (
    <header
      data-slot="section-heading"
      className={cn("mb-8", className)}
      {...props}
    >
      {overline ? (
        <p
          data-slot="section-heading-overline"
          className={cn(
            "mb-2.5 font-label text-overline uppercase text-brand-sage",
            classNames?.overline
          )}
        >
          {overline}
        </p>
      ) : null}
      <Comp
        data-slot="section-heading-title"
        className={cn(
          "font-heading text-h2 font-normal text-foreground",
          classNames?.title
        )}
      >
        {title}
      </Comp>
      {lead ? (
        <p
          data-slot="section-heading-lead"
          className={cn(
            "mt-3 max-w-[640px] text-body-2 text-ink-800",
            classNames?.lead
          )}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export { SectionHeading };
