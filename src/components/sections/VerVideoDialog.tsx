"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Modal del vídeo "¿Cómo funciona?".
 *
 * "use client" ES OBLIGATORIO aquí, aunque el componente no tenga estado:
 * `DialogTrigger asChild` necesita clonar el <Button> y fusionarle props
 * (aria-controls, data-state, onClick). Eso no funciona cruzando la frontera
 * RSC — el servidor no renderizaba el botón, el cliente sí, y saltaba un error
 * de hidratación. No quitar esta directiva.
 *
 * No hace falta estado propio: Radix ya monta y desmonta el contenido del
 * diálogo, así que el <video> sólo existe en el DOM mientras está abierto.
 *
 * Que el <video> no aparezca en el HTML inicial es intencionado, no un fallo:
 * si estuviera siempre en el árbol, el navegador pediría metadatos del archivo
 * de 8.8 MB en cada carga del home, lo reproduzca alguien o no.
 */
export function VerVideoDialog({
  src = "/videos/video.mp4",
  poster,
  titulo = "Cómo funciona",
}: {
  src?: string;
  /** Primer fotograma. Sin él, el modal muestra un rectángulo negro mientras carga. */
  poster?: string;
  titulo?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="petrol" size="cta">
          <Play data-icon="inline-start" />
          Ver video
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[min(92vw,960px)] overflow-hidden p-0 sm:max-w-[min(92vw,960px)]">
        {/* Radix exige un título accesible. Junto al vídeo sería redundante a la
            vista, así que sólo lo anuncian los lectores de pantalla. */}
        <DialogTitle className="sr-only">{titulo}</DialogTitle>
        <DialogDescription className="sr-only">
          Vídeo que explica el proceso para adquirir un auto con nosotros.
        </DialogDescription>

        <video
          // biome-ignore lint/a11y/useMediaCaption: falta la pista de subtítulos;
          // pendiente de que la entregue diseño.
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          // Sólo se descarga al abrir el modal, así que aquí sí interesa el
          // archivo completo cuanto antes.
          preload="auto"
          className="aspect-video w-full bg-brand-ink"
        >
          <a href={src} download>
            Descargar el vídeo
          </a>
        </video>
      </DialogContent>
    </Dialog>
  );
}
