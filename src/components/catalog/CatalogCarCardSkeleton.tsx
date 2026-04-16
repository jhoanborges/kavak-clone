import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogCarCardSkeleton() {
  return (
    <article className="bg-white rounded-xl border border-border overflow-hidden flex flex-col">
      {/* Image */}
      <Skeleton className="aspect-video w-full rounded-none" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-2/5" />
          <Skeleton className="h-3 w-1/3" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Color + fuel */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="h-3 w-14" />
        </div>

        {/* CTA */}
        <Skeleton className="mt-auto h-8 w-full rounded-md" />
      </div>
    </article>
  );
}
