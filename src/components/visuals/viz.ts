/* Timing helpers for the case-study visuals. Every visual is one SVG whose
   SMIL animations share a single loop; these turn a start and end, as
   fractions of that loop, into the keyTimes strings SMIL wants. */

const n = (x: number) => +x.toFixed(3);

/** A dot that travels a path between s and e, hidden outside that window.
    back: it goes out and returns along the same path. */
export function travel(s: number, e: number, back = false) {
  const m = n((s + e) / 2);
  return {
    keyPoints: back ? '0;0;1;0;0' : '0;0;1;1',
    keyTimes: back ? `0;${n(s)};${m};${n(e)};1` : `0;${n(s)};${n(e)};1`,
    shown: { values: '0;1;0', keyTimes: `0;${n(s)};${n(e)}` },
  };
}

/** Fade something in and out across a window: a glow, a flash label. */
export function pulse(s: number, e: number) {
  const m = n((s + e) / 2);
  return { values: '0;0;1;0;0', keyTimes: `0;${n(s)};${m};${n(e)};1` };
}

/** Fade in at s and stay until e, then fade out. */
export function hold(s: number, e: number) {
  const a = n(Math.min(s + 0.03, e));
  return { values: '0;0;1;1;0;0', keyTimes: `0;${n(s)};${a};${n(e)};${n(Math.min(e + 0.03, 0.999))};1` };
}

export const C = {
  teal: '#2dd4bf',
  violet: '#a78bfa',
  gold: '#fbbf24',
  red: '#f87171',
  blue: '#60a5fa',
  green: '#4ade80',
  text: '#e2e8f0',
  dim: '#94a3b8',
  faint: 'rgba(148,163,184,0.28)',
  panel: '#111a2e',
  edge: 'rgba(148,163,184,0.22)',
};
