import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the article layout grid so resolution causes no layout shift. */
export default function ArticleLoading() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <section className="border-b border-line">
          <div className="container-site py-14 md:py-20">
            <Skeleton className="h-3 w-56 max-w-full rounded-md" />
            <Skeleton className="mt-8 h-10 w-full max-w-3xl rounded-lg" />
            <Skeleton className="mt-3 h-10 w-2/3 max-w-xl rounded-lg" />
            <Skeleton className="mt-6 h-4 w-full max-w-2xl rounded-md" />
            <div className="mt-8 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>
        </section>
        <div className="container-site grid gap-14 py-14 lg:grid-cols-[1fr_280px] lg:py-20">
          <div className="min-w-0">
            <Skeleton className="mb-12 aspect-[16/9] w-full" />
            <div className="grid max-w-[70ch] gap-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="mt-6 h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
