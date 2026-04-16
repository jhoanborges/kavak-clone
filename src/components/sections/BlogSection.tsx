import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/config";

const posts = [
  {
    id: 1,
    category: "Finanzas · Productos Financieros",
    title: "Préstamo urgente: usa tu auto como garantía",
    date: "10 Febrero",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=874&h=540&fit=crop&auto=format",
    imgAlt: "Finanzas personales y auto",
  },
  {
    id: 2,
    category: "10 Febrero · Guía Para Dueños",
    title: "Diferencias clave: SUV, Pickup, Sedán y Hatchback",
    date: "10 Febrero",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=874&h=540&fit=crop&auto=format",
    imgAlt: "Diferentes tipos de autos",
  },
  {
    id: 3,
    category: "10 Febrero · De Interés",
    title: `En ${APP_NAME} formas parte de algo grande`,
    date: "10 Febrero",
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=874&h=540&fit=crop&auto=format",
    imgAlt: "Comunidad automotriz",
  },
];

export default function BlogSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Expertos {APP_NAME}</h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-primary font-medium hover:underline cursor-pointer"
        >
          Conocer Blog
          <ArrowRight className="size-3.5" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl overflow-hidden border border-border bg-white hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="relative h-44 overflow-hidden">
              <Image
                src={post.img}
                alt={post.imgAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1.5">{post.category}</p>
              <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
