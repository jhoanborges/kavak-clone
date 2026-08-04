import { BlogCard } from "@/components/blog/BlogCard";
import { DudasBanner, SectionHeading } from "@/components/ds";
import { POSTS } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Guías, análisis y estrategias sobre arrendamiento, crédito automotriz y gestión de flotillas para empresas en México.",
  path: "/blog",
});

export default function BlogPage() {
  const [principal, ...resto] = POSTS;

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-brand-ink px-6 py-20 text-white md:px-14 md:py-28">
        <div
          aria-hidden
          className="absolute -bottom-64 -left-40 size-[560px] rounded-[50%] bg-brand-petrol"
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-2.5 font-label text-overline uppercase text-brand-neon">
            Blog
          </p>
          <h1 className="max-w-[720px] font-heading text-display-l font-light">
            Recursos para impulsar tu negocio
          </h1>
          <p className="mt-5 max-w-[560px] text-body-1 text-white/85">
            Guías, análisis y estrategias diseñadas para expandir tu operación
            sin complicaciones.
          </p>
        </div>
      </section>

      {principal && (
        <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
          <SectionHeading overline="Destacado" title="Lo más reciente" />
          {/* El destacado ocupa 2 columnas en desktop: jerarquía por tamaño,
              no por un badge de "destacado" que habría que leer. */}
          <div className="grid gap-5 lg:grid-cols-3">
            <BlogCard
              post={principal}
              priority
              className="lg:col-span-2 lg:flex-row"
            />
            {resto[0] && <BlogCard post={resto[0]} />}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
        <SectionHeading
          overline="Artículos"
          title="Todos los artículos"
          lead={`${POSTS.length} publicaciones sobre arrendamiento, crédito y flotillas.`}
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resto.slice(1).map((post) => (
            <li key={post.slug} className="flex">
              <BlogCard post={post} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-14">
        <DudasBanner href="/contacto" />
      </section>
    </main>
  );
}
