"use client";

import dynamicImport from "next/dynamic";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// The palette (and minisearch with it) stays out of every route's
// first-load bundle — it is fetched on the first open only.
const CommandPalette = dynamicImport(
  () => import("./CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false },
);

const SearchContext = createContext<{ openPalette: () => void }>({
  openPalette: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const inField = (event.target as HTMLElement | null)?.closest?.(
        "input, textarea, select, [contenteditable]",
      );
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setEverOpened(true);
        setOpen((v) => !v);
      } else if (
        event.key === "/" &&
        !inField &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setEverOpened(true);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      openPalette: () => {
        setEverOpened(true);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      {everOpened && <CommandPalette open={open} onClose={() => setOpen(false)} />}
    </SearchContext.Provider>
  );
}
