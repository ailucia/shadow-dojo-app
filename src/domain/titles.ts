// Overall progression — your title rises from training + missions (inputs),
// never from outcomes you can't control.

export interface TitleTier {
  name: string
  minXp: number
}

export const TITLES: TitleTier[] = [
  { name: 'Novice', minXp: 0 },
  { name: 'Apprentice', minXp: 120 },
  { name: 'Adept', minXp: 360 },
  { name: 'Expert', minXp: 800 },
  { name: 'Master', minXp: 1600 },
]

export function titleForXp(xp: number): TitleTier {
  let current = TITLES[0]
  for (const t of TITLES) if (xp >= t.minXp) current = t
  return current
}

// Rank erosion — neglect doesn't just cool your ki, it costs rank. The idle
// ebb (see focus.ts) bleeds momentum first; only once ki has collapsed to the
// floor — by the 3rd idle day — does the title itself start to bleed. So a
// rest day, even two, is free here too; a real disappearance is what erodes
// rank. Like the ebb, the penalty is a pure function of idle days recomputed
// from a baseline on every load, so reopening the app never double-charges and
// a single rep re-anchors the clock. And like the ki floor, it never wipes you
// out: a full collapse costs at most half your title XP (embers, never ashes).
export const EROSION_GRACE_DAYS = 3 // idle days before rank bleeds (== the day ki hits the floor)
export const EROSION_PCT_PER_DAY = 0.08 // each collapsed day past grace costs 8% of title XP…
export const EROSION_MAX_PCT = 0.5 // …up to half — a lapse can demote you, never erase you

/** Fraction of title XP eroded after `idleDays` of neglect (0..EROSION_MAX_PCT). */
export function titleErosionPct(idleDays: number): number {
  const collapsedDays = Math.max(0, idleDays - EROSION_GRACE_DAYS)
  return Math.min(EROSION_MAX_PCT, collapsedDays * EROSION_PCT_PER_DAY)
}

/** Erode title XP for a long idle stretch. Idempotent: pass the titleXp captured
 *  at the last completed rep (the baseline) and it returns the eroded value —
 *  re-deriving from the same baseline each load, never compounding per open. */
export function applyTitleErosion(titleXpAtLastActive: number, idleDays: number): number {
  const pct = titleErosionPct(idleDays)
  if (pct <= 0) return titleXpAtLastActive
  return Math.max(0, Math.round(titleXpAtLastActive * (1 - pct)))
}

export function nextTitle(xp: number): TitleTier | null {
  for (const t of TITLES) if (xp < t.minXp) return t
  return null
}

export function titleProgress(xp: number): { current: TitleTier; next: TitleTier | null; pct: number } {
  const current = titleForXp(xp)
  const next = nextTitle(xp)
  if (!next) return { current, next: null, pct: 100 }
  const span = next.minXp - current.minXp
  const into = xp - current.minXp
  return { current, next, pct: Math.max(0, Math.min(100, Math.round((into / span) * 100))) }
}
