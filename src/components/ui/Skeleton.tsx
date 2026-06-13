export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={`skeleton card-surface ${className ?? ""}`} />;
}

export function ArticleCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <Skeleton className="aspect-[16/10] rounded-none border-0" />
      <div className="grid gap-3 p-6">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="mt-2 h-3 w-32 rounded-md" />
      </div>
    </div>
  );
}
