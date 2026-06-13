import { Header } from "@/components/layout/Header";
import { ArticleCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <div className="container-site py-14 md:py-20">
          <Skeleton className="h-3 w-40 rounded-md" />
          <Skeleton className="mt-6 h-12 w-80 max-w-full rounded-lg" />
          <Skeleton className="mt-5 h-4 w-full max-w-xl rounded-md" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
