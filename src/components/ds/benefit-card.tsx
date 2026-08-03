import * as React from "react";

import { cn } from "@/lib/utils";

type BenefitCardSlots = "badge" | "title" | "body";

/**
 * Tarjeta de beneficio (Design System VALUE)
 * Radio 20px · alto 199px · degradado diagonal · número en círculo de 50px.
 *
 * Dos capas de personalización:
 *  1. `className`  → el contenedor raíz.
 *  2. `classNames` → cada parte interna por su nombre de slot.
 *     <BenefitCard classNames={{ badge: "bg-brand-neon", title: "text-h4" }} />
 * Ambas pasan por tailwind-merge, así que sobreescriben la base sin `!important`.
 */
function BenefitCard({
  step,
  title,
  children,
  variant = "soft",
  className,
  classNames,
  ...props
}: React.ComponentProps<"article"> & {
  /** Número (o cualquier nodo) del círculo superior. */
  step: React.ReactNode;
  title: React.ReactNode;
  /** `soft` = degradado salvia · `strong` = degradado aqua destacado. */
  variant?: "soft" | "strong";
  classNames?: Partial<Record<BenefitCardSlots, string>>;
}) {
  return (
    <article
      data-slot="benefit-card"
      data-variant={variant}
      className={cn(
        "relative flex h-[199px] flex-col justify-between rounded-xl border border-background p-5",
        variant === "soft" && "bg-gradient-benefit",
        variant === "strong" && "bg-gradient-benefit-strong",
        className
      )}
      {...props}
    >
      <span
        data-slot="benefit-card-badge"
        className={cn(
          "flex size-[50px] shrink-0 items-center justify-center rounded-4xl font-label text-2xl",
          variant === "soft" && "bg-brand-aqua text-brand-ink",
          variant === "strong" && "bg-brand-ink text-white",
          classNames?.badge
        )}
      >
        {step}
      </span>

      <div className="pl-2">
        <h3
          data-slot="benefit-card-title"
          className={cn(
            "font-sans text-body-1 font-light text-brand-ink",
            classNames?.title
          )}
        >
          {title}
        </h3>
        {children ? (
          <p
            data-slot="benefit-card-body"
            className={cn(
              "mt-1 text-caption text-ink-600",
              classNames?.body
            )}
          >
            {children}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export { BenefitCard };
