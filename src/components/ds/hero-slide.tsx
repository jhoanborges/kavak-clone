import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroSlideSlots = "image" | "overlay" | "eyebrow" | "title" | "content";

/**
 * Hero · carrusel (Design System VALUE)
 * Imagen a sangre + overlay degradado hacia el verde (235°), overline neón,
 * título Avenir Light y los indicadores de slide abajo a la izquierda.
 *
 * Es presentacional: el estado del carrusel lo controla quien lo usa vía
 * `slideCount` / `activeSlide`, para que sirva igual con Embla, Swiper o CSS.
 */
function HeroSlide({
  src,
  alt,
  eyebrow,
  title,
  children,
  slideCount = 0,
  activeSlide = 0,
  priority,
  className,
  classNames,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  src: string;
  alt: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  slideCount?: number;
  activeSlide?: number;
  priority?: boolean;
  classNames?: Partial<Record<HeroSlideSlots, string>>;
}) {
  return (
    <section
      data-slot="hero-slide"
      className={cn(
        "relative isolate overflow-hidden rounded-xl min-h-[320px] md:min-h-[480px]",
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={cn("object-cover object-[55%_60%]", classNames?.image)}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-gradient-hero",
          classNames?.overlay
        )}
      />

      <div
        data-slot="hero-slide-content"
        className={cn(
          "absolute inset-x-6 bottom-14 md:inset-x-10",
          classNames?.content
        )}
      >
        {eyebrow ? (
          <p
            className={cn(
              "mb-2.5 font-label text-overline uppercase text-brand-neon",
              classNames?.eyebrow
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "max-w-[520px] font-heading text-h1 font-light text-white",
            classNames?.title
          )}
        >
          {title}
        </h1>
        {children}
      </div>

      {slideCount > 1 ? (
        <div
          className="absolute bottom-8 left-6 flex gap-3 md:left-10"
          role="tablist"
          aria-label="Slides"
        >
          {Array.from({ length: slideCount }, (_, i) => (
            <span
              key={i}
              role="tab"
              aria-selected={i === activeSlide}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-4xl transition-all duration-200",
                i === activeSlide
                  ? "w-9 bg-brand-neon"
                  : "w-4 bg-white/50"
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { HeroSlide };
