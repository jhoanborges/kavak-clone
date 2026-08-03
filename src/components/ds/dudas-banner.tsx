import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type DudasBannerSlots = "label" | "arrow";

/**
 * Banner "¿Tienes más dudas?" (Design System VALUE)
 * Radio 20px · fondo petróleo · hover salvia + flecha rellena de aqua.
 * El hover del contenedor propaga a la flecha vía `group/dudas`.
 */
function DudasBanner({
  href,
  label = "¿Tienes más dudas?",
  className,
  classNames,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "children"> & {
  label?: React.ReactNode;
  classNames?: Partial<Record<DudasBannerSlots, string>>;
}) {
  return (
    <Link
      href={href}
      data-slot="dudas-banner"
      className={cn(
        "group/dudas flex items-center justify-between gap-4 rounded-xl bg-brand-petrol p-5 text-white transition-colors",
        "hover:bg-brand-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
        className
      )}
      {...props}
    >
      <span
        data-slot="dudas-banner-label"
        className={cn("font-sans text-h3 font-light", classNames?.label)}
      >
        {label}
      </span>
      <span
        data-slot="dudas-banner-arrow"
        aria-hidden
        className={cn(
          "flex size-[47px] shrink-0 items-center justify-center rounded-4xl border border-white transition-colors",
          "group-hover/dudas:border-brand-ink group-hover/dudas:bg-brand-aqua group-hover/dudas:text-brand-ink",
          classNames?.arrow
        )}
      >
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export { DudasBanner };
