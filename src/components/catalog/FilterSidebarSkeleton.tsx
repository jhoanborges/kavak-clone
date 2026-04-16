import { Skeleton } from "@/components/ui/skeleton";

function FilterSection({ rows = 4 }: { rows?: number }) {
  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded" />
            <Skeleton className="h-3" style={{ width: `${50 + (i % 3) * 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebarSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Filter sections */}
      <div className="divide-y divide-border">
        {/* Marca */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <FilterSection rows={5} />
        </div>

        {/* Carrocería */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <FilterSection rows={4} />
        </div>

        {/* Año */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <FilterSection rows={4} />
        </div>

        {/* Precio */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <div className="px-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Transmisión */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <FilterSection rows={3} />
        </div>

        {/* Combustible */}
        <div className="py-3">
          <div className="flex items-center justify-between px-4 mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3 rounded-sm" />
          </div>
          <FilterSection rows={3} />
        </div>
      </div>

      {/* Footer button */}
      <div className="px-4 py-3 border-t border-border">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
}
