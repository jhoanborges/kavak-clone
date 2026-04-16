import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogTopBarSkeleton() {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Search bar */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Results count + sort */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-44 rounded-md" />
      </div>
    </div>
  );
}
