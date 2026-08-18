import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BlogCardCompacta } from "@/components/blog/BlogCard";
import { DudasBanner } from "@/components/ds";
import { Badge } from "@/components/ui/badge";
import { POSTS, getPost, type BlogBlock } from "@/data/blog";
import { APP_NAME } from "@/lib/config";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    images: [post.cover],
    type: "article",
  });
}

/** Renderiza los bloques del artículo. Mismo contrato que usará el CMS. */
function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={block.id} className="mt-4 font-heading text-h3 font-medium">
                {block.text}
              </h2>
            );
          case "img":
            return (
              <figure key={block.id} className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 720px"
                />
              </figure>
            );
          case "quote":
            return (
              <blockquote
                key={block.id}
                className="border-l-4 border-brand-aqua bg-muted px-6 py-5 font-heading text-h4 font-light text-primary"
              >
                {block.text}
              </blockquote>
            );
          default:
            return (
              <p key={block.id} className="text-body-1 text-ink-800">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const similares = POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: absoluteUrl(post.cover),
    inLanguage: "es-MX",
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/value1024x1024.png") },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado desde datos estáticos propios, no entrada de usuario
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <section className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div aria-hidden className="absolute inset-0 bg-brand-ink/45" />
          <div aria-hidden className="absolute inset-0 bg-gradient-hero" />

          <div className="relative flex min-h-[420px] flex-col justify-end px-6 py-14 md:min-h-[520px] md:px-14">
            <div className="mx-auto w-full max-w-[840px]">
              <Link
                href="/blog"
                className="mb-6 inline-flex min-h-11 items-center gap-2 font-label text-label text-brand-aqua transition-colors hover:text-brand-neon"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Volver al blog
              </Link>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge className="bg-brand-neon text-brand-ink">{post.category}</Badge>
                <time dateTime={post.date} className="text-caption text-white/80">
                  {post.dateLabel}
                </time>
              </div>
              <h1 className="font-heading text-h1 font-light text-white">
                {post.title}
              </h1>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-14 md:px-14 lg:grid-cols-[1fr_320px]">
          <article className="max-w-[720px]">
            <p className="mb-8 border-b border-border pb-6">
              <span className="block font-heading text-h4 font-medium">
                {post.author}
              </span>
              <span className="block text-caption text-ink-600">{post.role}</span>
            </p>
            <ArticleBody blocks={post.content} />
          </article>

          <aside aria-labelledby="similares-title">
            <h2
              id="similares-title"
              className="mb-6 font-label text-overline uppercase text-brand-sage"
            >
              Artículos similares
            </h2>
            <div className="flex flex-col gap-6">
              {similares.map((p) => (
                <BlogCardCompacta key={p.slug} post={p} />
              ))}
            </div>
          </aside>
        </div>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
          <DudasBanner href="/contacto" />
        </section>
      </main>
    </>
  );
}
