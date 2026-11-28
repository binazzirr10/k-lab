"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Field } from "@/lib/universities";

type CatalogFilters = { query: string; city: string; field: Field | "" };
type HistoryEntry = { index: number; key: string; url: string | null };
type BrowserNavigation = { currentEntry: HistoryEntry | null; entries(): HistoryEntry[] };
type CatalogDeparture = {
  id: string; filters: CatalogFilters; top: number; key?: string; historyLength: number; at: number; thumbnail?: string;
};
type CatalogReturn = { id: string; departure?: CatalogDeparture };

export const universityMorph = ["university-morph"];
let departure: CatalogDeparture | undefined;
let returning: CatalogReturn | undefined;

function browserNavigation() {
  return (window as Window & { navigation?: BrowserNavigation }).navigation;
}

export function universityRow(id: string) {
  return document.getElementById(`university-${id}`);
}

export function rememberCatalog(id: string, filters: CatalogFilters) {
  departure = {
    id, filters, top: universityRow(id)?.getBoundingClientRect().top ?? 120,
    key: browserNavigation()?.currentEntry?.key, historyLength: history.length, at: Date.now(),
    thumbnail: universityRow(id)?.querySelector("img")?.currentSrc || undefined,
  };
}

/**
 * True when this article was opened from its catalog row a moment ago, so its photo arrived through the morph and
 * must not run its own entrance. Checked once, when the article mounts.
 */
export function arrivedByMorph(id: string) {
  return departure?.id === id && Date.now() - departure.at < 3000 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The catalog thumbnail the browser already has, shown under the large photo until it loads. */
export function departureThumbnail(id: string) {
  return departure?.id === id ? departure.thumbnail : undefined;
}

export function getCatalogReturn() {
  return returning;
}

export function restoreCatalogRow(request: CatalogReturn) {
  if (returning !== request) return;
  returning = undefined;
  const row = universityRow(request.id);
  if (row && request.departure) {
    window.scrollBy({ top: row.getBoundingClientRect().top - request.departure.top, behavior: "instant" });
  } else {
    row?.scrollIntoView({ block: "start", behavior: "instant" });
  }
}

export function CatalogBackLink({ id, className }: { id: string; className: string }) {
  const router = useRouter();
  return <Link className={className} href={`/universities#university-${id}`} prefetch={true} scroll={false}
    onNavigate={(event) => {
      const navigation = browserNavigation();
      const previous = navigation?.entries()[(navigation.currentEntry?.index ?? 0) - 1];
      const fromCatalog = previous?.url
        ? new URL(previous.url).pathname === "/universities"
        : !navigation && departure?.id === id && history.length === departure.historyLength + 1;
      const sameVisit = fromCatalog && departure?.id === id && departure.key === previous?.key;
      returning = { id, departure: sameVisit ? departure : undefined };
      if (fromCatalog) {
        event.preventDefault();
        router.back();
      }
    }}>← К каталогу University Lab</Link>;
}
