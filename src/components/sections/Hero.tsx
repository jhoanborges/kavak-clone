import { SearchForm } from "@/components/sections/SearchForm";

/**
 * Server component: el vídeo, el texto y el overlay no necesitan JavaScript.
 * Sólo el buscador se hidrata, y vive aparte en <HeroSearchForm>.
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

          <SearchForm className="mt-10" />
        </div>
      </div>
    </section>
  );
}
