import { Header } from "@/components/layout/Header";
import { ImpellerSpinner } from "@/components/ui/motifs";

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70svh] items-center justify-center pt-[72px]">
        <ImpellerSpinner size={32} />
      </main>
    </>
  );
}
