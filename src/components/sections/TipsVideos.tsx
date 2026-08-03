import Image from "next/image";
import { Play } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const videos = [
  {
    id: 1,
    title: `Cómo vender tu auto con ${APP_NAME}`,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=600&fit=crop&auto=format",
    label: APP_NAME,
  },
  {
    id: 2,
    title: "+6,000 autos para ti",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop&auto=format",
    label: APP_NAME,
  },
  {
    id: 3,
    title: "¿Quién revisa tu auto?",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=600&fit=crop&auto=format",
    label: APP_NAME,
  },
  {
    id: 4,
    title: "Dinero por tu auto",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=600&fit=crop&auto=format",
    label: APP_NAME,
  },
];

export default function TipsVideos() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-14 py-10">
      <h2 className="font-heading text-h2 font-normal text-foreground mb-5">Tips y Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative rounded-xl overflow-hidden aspect-[9/16] md:aspect-[3/4] cursor-pointer group"
          >
            <Image
              src={v.img}
              alt={v.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/20 via-transparent to-brand-ink/75" />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="self-start font-label text-overline uppercase text-brand-neon">
                {v.label}
              </span>
              <div>
                <p className="mb-2 font-sans text-body-2 font-medium leading-snug text-white">
                  {v.title}
                </p>
                {/* Hover en tinta, no en aqua: sobre una miniatura clara el
                    aqua se lavaba y el botón perdía definición. Oscurecer
                    funciona con cualquier imagen de fondo, y el icono en neón
                    da el acento sin aclarar el círculo. */}
                <div className="flex size-11 items-center justify-center rounded-4xl border border-white/80 bg-brand-ink/40 backdrop-blur-sm transition-all duration-200 group-hover:scale-105 group-hover:border-brand-neon group-hover:bg-brand-ink">
                  <Play className="size-4 fill-white text-white transition-colors group-hover:fill-brand-neon group-hover:text-brand-neon" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
