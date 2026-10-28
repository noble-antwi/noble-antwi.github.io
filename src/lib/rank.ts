/* Client-safe half of the site index: the row shape and the ranking, so the
   terminal can import it without pulling in astro:content. */

/** One row per page a visitor might be looking for: k is the kind, t the
    title, u the URL. Feeds the terminal's ls and open, and the 404 page's
    "did you mean". */
export interface IndexRow { k: 'section' | 'work' | 'note'; t: string; u: string }

const STOP = new Set(['the', 'and', 'for', 'from', 'with', 'how', 'what', 'that', 'this', 'not', 'into', 'html', 'www']);
const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));

/** Rank rows against free text (a typed query or a broken URL). Shared by
    the terminal and the 404 page, so both guess the same way. */
export function rank(rows: IndexRow[], query: string, n = 5): IndexRow[] {
  const q = words(query);
  if (!q.length) return [];
  const scored = rows.map((r) => {
    const hay = words(`${r.t} ${r.u}`);
    let s = 0;
    for (const w of q) {
      if (hay.includes(w)) s += 3;
      else if (hay.some((h) => h.startsWith(w) || (w.length > 3 && w.startsWith(h) && h.length > 3))) s += 2;
    }
    return { r, s: s + (r.k === 'section' ? 0.5 : 0) };
  });
  /* keep only rows close to the best match, so one strong hit is not
     padded out with pages that share a single common word */
  const top = Math.max(0, ...scored.map((x) => x.s));
  return scored.filter((x) => x.s >= 2 && x.s >= top * 0.5).sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.r);
}
