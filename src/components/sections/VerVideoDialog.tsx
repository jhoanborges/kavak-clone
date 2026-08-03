"use client";

import { useState } from "react";
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
 * Vive en su propio componente cliente para que <ComoFunciona> siga siendo
 * server component: sólo este botón necesita estado en el navegador.
 *
 * El <video> se monta SÓLO cuando el diálogo está abierto. Si estuviera siempre
 * en el árbol, el navegador pediría metadatos (y con `preload` la primera parte
 * del archivo) en cada carga del home — 9 MB que casi nadie va a reproducir.
 */
export function VerVideoDialog({
  src = "/videos/video.mp4",
  titulo = "Cómo funciona",
}: {
  src?: string;
  titulo?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="petrol" size="cta">
          <Play data-icon="inline-start" />
          Ver video
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[min(92vw,960px)] overflow-hidden p-0 sm:max-w-[min(92vw,960px)]">
        {/* Radix exige un título accesible. Es visualmente redundante junto al
            vídeo, así que va oculto para lectores de pantalla. */}
        <DialogTitle className="sr-only">{titulo}</DialogTitle>
        <DialogDescription className="sr-only">
          Vídeo que explica el proceso para adquirir un auto con nosotros.
        </DialogDescription>

        {open && (
          <video
            // biome-ignore lint/a11y/useMediaCaption: el vídeo no tiene pista de
            // subtítulos disponible todavía; pendiente de que la entregue diseño.
            src={src}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full bg-brand-ink"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
