import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Server component a propósito.
 *
 * Antes era cliente sólo por los badges Compra/Vende/Cotiza, cuyo `activeTab`
 * no hacía absolutamente nada: estado decorativo que obligaba a hidratar todo
 * el hero. Sin ellos no queda estado, y el buscador funciona como un <form>
 * GET normal — sirve incluso sin JavaScript.
 */
export default function Hero() {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay del DS: scrim plano que garantiza contraste sobre el vídeo
          (cambia frame a frame) + el degradado 235° hacia Verde Value. */}
      <div aria-hidden className="absolute inset-0 bg-brand-ink/45" />
      <div aria-hidden className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 flex min-h-[520px] md:min-h-[600px] flex-col justify-center px-6 py-14 md:px-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
            Seminuevos certificados
          </p>
          <h1 className="max-w-[820px] font-heading text-display-l font-light text-white">
            Kilómetros con historia,
            <br />
            autos con futuro.
          </h1>
          <p className="mt-5 max-w-[520px] text-body-1 text-white/85">
            Cada unidad pasa una revisión de 240 puntos, incluye garantía y se
            financia a tu medida.
          </p>

          {/*
            <form> GET a /compra: el buscador navega de verdad, y funciona sin
            JavaScript. Antes el botón no hacía nada.

            NOTA: /compra todavía no lee el parámetro `busqueda`; llegar con él
            muestra el catálogo completo. Falta conectarlo al filtro.
          */}
          <form
            action="/compra"
            method="get"
            role="search"
            className="mt-10 flex w-full max-w-[640px] items-center gap-2 rounded-lg bg-card p-2 pl-4"
          >
            <Search aria-hidden className="size-5 shrink-0 text-ink-600" />
            <label htmlFor="hero-search" className="sr-only">
              Busca por año, marca o modelo
            </label>
            <Input
              id="hero-search"
              name="busqueda"
              type="search"
              placeholder="Busca por año, marca o modelo…"
              className="h-11 flex-1 border-0 bg-transparent text-body-2 shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="cta" className="shrink-0 py-3">
              Buscar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
