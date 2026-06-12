import { Header } from "@/components/layout/Header";
import { ArticleCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <div className="container-site py-14 md:py-20">
          <Skeleton className="h-3 w-32 rounded-md" />
          <Skeleton className="mt-6 h-12 w-72 max-w-full rounded-lg" />
          <div className="mb-10 mt-12 flex flex-wrap gap-2.5">
            <Skeleton className="h-11 w-20 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
