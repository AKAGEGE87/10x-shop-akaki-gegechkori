export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div>
        <div className="aspect-square w-full bg-slate-200" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-1/3 rounded bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-200" />
          </div>
          <div className="h-3 w-1/4 rounded bg-slate-200" />
          <div className="h-6 w-1/3 rounded bg-slate-200 pt-1" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 w-full rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((key) => (
        <ProductCardSkeleton key={key} />
      ))}
    </div>
  );
}
