import type { ComponentProps } from "react";

import { Callout } from "./Callout";
import { Chart } from "./Chart";
import { Figure } from "./Figure";
import type { Article } from "@/lib/content/schema";

/**
 * Component map handed to MDXRemote for article bodies. Figure paths are
 * resolved against the article's published asset folder, so MDX authors
 * (human or routine) only ever reference bare filenames from ./assets.
 */
export function getMdxComponents(article: Article) {
  return {
    Figure: (props: Omit<ComponentProps<typeof Figure>, "assetBase">) => (
      <Figure {...props} assetBase={article.assetBase} />
    ),
    Callout,
    Chart,
  };
}
