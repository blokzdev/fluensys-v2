"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import MiniSearch from "minisearch";

import { Dialog } from "@/components/ui/Dialog";
import { FlowDroplet, ImpellerSpinner } from "@/components/ui/motifs";
import {
  loadSearchIndex,
  SEARCH_OPTIONS,
  type SearchDoc,
} from "@/components/search/useSearchIndex";

const RECENTS_KEY = "fluensys:recent";
const MAX_RECENTS = 5;
const MAX_RESULTS = 8;

const NAV_ITEMS: PaletteItem[] = [
  { kind: "nav", title: "Home", url: "/" },
  { kind: "nav", title: "The Journal", url: "/blog" },
  { kind: "nav", title: "Services", url: "/#services" },
  { kind: "nav", title: "Expertise", url: "/#expertise" },
  { kind: "nav", title: "Contact", url: "/#contact" },
];

interface PaletteItem {
  kind: "recent" | "nav" | "category" | "article";
  title: string;
  url: string;
  meta?: string;
}

interface Recent {
  title: string;
  url: string;
}

function readRecents(): Recent[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Recent[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : [];
  } catch {
    return [];
  }
}

function saveRecent(recent: Recent) {
  try {
    const next = [recent, ...readRecents().filter((r) => r.url !== recent.url)].slice(
      0,
      MAX_RECENTS,
    );
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Private browsing — recents are a nicety only.
  }
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [categories, setCategories] = useState<string[]>([]);
  const [recents, setRecents] = useState<Recent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef<MiniSearch<SearchDoc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    setRecents(readRecents());
    loadSearchIndex()
      .then((index) => {
        indexRef.current = index;
        const all = index.search(MiniSearch.wildcard) as unknown as Array<{ category: string }>;
        setCategories([...new Set(all.map((doc) => doc.category))].sort());
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    // Native <dialog> focuses its first focusable, but be explicit:
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim();
    if (q && indexRef.current && status === "ready") {
      return indexRef.current
        .search(q, SEARCH_OPTIONS)
        .slice(0, MAX_RESULTS)
        .map((result) => {
          const doc = result as unknown as SearchDoc & { id: string };
          return {
            kind: "article" as const,
            title: doc.title,
            url: doc.url,
            meta: [doc.category, doc.readingTime ? `${doc.readingTime} min read` : null]
              .filter(Boolean)
              .join(" · "),
          };
        });
    }
    return [
      ...recents.map((r) => ({ kind: "recent" as const, title: r.title, url: r.url })),
      ...NAV_ITEMS,
      ...categories.map((category) => ({
        kind: "category" as const,
        title: category.replace(/-/g, " "),
        url: `/blog/${category}`,
      })),
    ];
  }, [query, status, recents, categories]);

  useEffect(() => setActiveIndex(0), [query]);

  const select = (item: PaletteItem) => {
    if (item.kind === "article") saveRecent({ title: item.title, url: item.url });
    onClose();
    router.push(item.url);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (items.length === 0) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + delta + items.length) % items.length;
      setActiveIndex(next);
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && items[activeIndex]) {
      event.preventDefault();
      select(items[activeIndex]);
    }
  };

  const showSections = !query.trim();

  return (
    <Dialog open={open} onClose={onClose} label="Search FluenSys" className="palette-dialog">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 stroke-ink-faint"
          fill="none"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={items[activeIndex] ? `palette-item-${activeIndex}` : undefined}
          aria-label="Search articles and pages"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Search the Journal…"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <kbd className="hidden sm:inline-block">Esc</kbd>
      </div>

      <div className="max-h-[55svh] overflow-y-auto overscroll-contain p-2">
        {status === "loading" && (
          <div className="flex items-center justify-center gap-3 py-10 text-sm text-ink-faint">
            <ImpellerSpinner size={20} />
            Priming the index…
          </div>
        )}
        {status === "error" && (
          <p className="py-10 text-center text-sm text-ink-faint">
            Search is unavailable right now — try again shortly.
          </p>
        )}
        {status === "ready" && items.length === 0 && (
          <div className="py-10 text-center">
            <div aria-hidden className="flex items-center justify-center gap-2 text-ink-faint">
              <FlowDroplet size={9} className="opacity-40" />
              <FlowDroplet size={12} className="opacity-70" />
              <FlowDroplet size={9} className="opacity-40" />
            </div>
            <p className="mt-4 text-sm text-ink-faint">No flow detected — try another term.</p>
          </div>
        )}
        {status === "ready" && items.length > 0 && (
          <ul id="palette-results" role="listbox" aria-label="Search results" ref={listRef}>
            {items.map((item, i) => {
              const sectionStart =
                showSections && (i === 0 || items[i - 1].kind !== item.kind);
              return (
                <li key={`${item.kind}-${item.url}`} role="presentation">
                  {sectionStart && (
                    <p className="text-eyebrow px-3 pb-1 pt-3 !text-[0.62rem] text-ink-faint">
                      {item.kind === "recent" ? "Recent" : item.kind === "nav" ? "Quick links" : "Categories"}
                    </p>
                  )}
                  <button
                    type="button"
                    id={`palette-item-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => select(item)}
                    onPointerMove={() => setActiveIndex(i)}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      i === activeIndex ? "bg-surface-3 text-ink" : "text-ink-dim"
                    }`}
                  >
                    {item.kind === "article" || item.kind === "recent" ? (
                      <FlowDroplet size={10} className="shrink-0 text-azure-bright" />
                    ) : (
                      <span aria-hidden className="font-mono text-xs text-ink-faint">
                        ↗
                      </span>
                    )}
                    <span
                      className={`flex-1 truncate text-sm ${item.kind === "category" ? "capitalize" : ""}`}
                    >
                      {item.title}
                    </span>
                    {item.meta && (
                      <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-ink-faint">
                        {item.meta}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
