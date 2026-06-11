import Image from "next/image";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  assetBase: string;
}

/**
 * Article figure. `src` is resolved relative to the article's published
 * asset folder (/blogfiles/<year>/<slug>/) unless it is absolute.
 */
export function Figure({ src, alt, caption, assetBase }: FigureProps) {
  const resolved = src.startsWith("/") || src.startsWith("http") ? src : `${assetBase}/${src}`;
  return (
    <figure className="!my-10">
      <div className="card-surface overflow-hidden bg-white/95 p-2 sm:p-3">
        <Image
          src={resolved}
          alt={alt}
          width={1200}
          height={675}
          className="h-auto w-full rounded-lg object-contain"
          sizes="(max-width: 768px) 100vw, 70ch"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
