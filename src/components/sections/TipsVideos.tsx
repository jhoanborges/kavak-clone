import Image from "next/image";
import { Play } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const videos = [
  {
    id: 1,
    title: `Cómo vender tu auto con ${APP_NAME}`,
    img: "https://images.prd.kavak.io/assets/images/home-ui/Thumbnail1_26-3-26.webp",
    label: APP_NAME,
  },
  {
    id: 2,
    title: "+6,000 autos para ti",
    img: "https://images.prd.kavak.io/assets/images/home-ui/Thumbnail2_26-3-26.webp",
    label: APP_NAME,
  },
  {
    id: 3,
    title: "¿Quién revisa tu auto?",
    img: "https://images.prd.kavak.io/assets/images/home-ui/Thumbnail3_26-3-26.webp",
    label: APP_NAME,
  },
  {
    id: 4,
    title: "Dinero por tu auto",
    img: "https://images.prd.kavak.io/assets/images/home-ui/Thumbnail4_26-3-26.webp",
    label: APP_NAME,
  },
];

export default function TipsVideos() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-foreground mb-5">Tips y Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative rounded-2xl overflow-hidden aspect-[9/16] md:aspect-[3/4] cursor-pointer group"
          >
            <Image
              src={v.img}
              alt={v.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="text-white font-black text-sm tracking-widest opacity-90 self-start drop-shadow">
                {v.label}
              </span>
              <div>
                <p className="text-white font-bold text-sm leading-tight drop-shadow mb-2">
                  {v.title}
                </p>
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <Play className="size-4 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
