import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reserva exactamente el mismo alto que VehiculoCard (imagen 4/3 + p-5) para
 * que al llegar los datos no haya salto de layout (CLS).
 */
export default function VehiculoCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-7 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
