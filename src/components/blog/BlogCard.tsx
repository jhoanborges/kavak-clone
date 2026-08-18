import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/data/blog";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de artículo. `relative` + enlace estirado sobre el título: un solo
 * destino accesible, en vez de duplicar el link en imagen, categoría y texto.
 */
export function BlogCard({
  post,
  className,
  priority = false,
}: {
  post: BlogPost;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group/post relative flex flex-col overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.cover}
          alt=""
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover/post:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <time dateTime={post.date} className="text-caption text-ink-600">
            {post.dateLabel}
          </time>
        </div>

        <h3 className="font-heading text-h4 font-medium leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {post.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-body-2 text-ink-800">{post.excerpt}</p>
      </div>
    </article>
  );
}

/** Variante compacta para el aside de artículos similares. */
export function BlogCardCompacta({ post }: { post: BlogPost }) {
  return (
    <article className="group/post relative flex gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-muted">
        <Image src={post.cover} alt="" fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex flex-col gap-1">
        <time dateTime={post.date} className="text-caption text-ink-600">
          {post.dateLabel}
        </time>
        <h3 className="font-sans text-body-2 font-medium leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
