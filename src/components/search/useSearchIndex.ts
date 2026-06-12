"use client";

import MiniSearch from "minisearch";

/**
 * Options must mirror scripts/content.mjs buildIndex() exactly —
 * MiniSearch.loadJSON rejects on any mismatch. Update both together.
 */
const INDEX_OPTIONS = {
  fields: ["title", "excerpt", "tags", "category", "body"],
  storeFields: [
    "title",
    "excerpt",
    "category",
    "tags",
    "url",
    "publishedAt",
    "readingTime",
    "image",
  ],
};

export interface SearchDoc {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  url: string;
  publishedAt: string;
  readingTime: number | null;
  image: string;
}

let cached: Promise<MiniSearch<SearchDoc>> | null = null;

/** Fetches and deserialises the prebuilt index once per session. */
export function loadSearchIndex(): Promise<MiniSearch<SearchDoc>> {
  cached ??= fetch("/search-index.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Search index fetch failed (${response.status})`);
      return response.text();
    })
    .then((json) => {
      try {
        return MiniSearch.loadJSON<SearchDoc>(json, INDEX_OPTIONS);
      } catch (cause) {
        throw new Error(
          "Search index options are out of sync with scripts/content.mjs buildIndex()",
          { cause },
        );
      }
    })
    .catch((error) => {
      cached = null; // allow a retry on the next palette open
      throw error;
    });
  return cached;
}

export const SEARCH_OPTIONS = {
  prefix: true,
  fuzzy: 0.2,
  boost: { title: 3, tags: 2 },
};
