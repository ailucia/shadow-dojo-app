// Focus (ki) — momentum that builds with training and ebbs when idle.
// Tuned for a full-time search: ONE rest day a week costs nothing (the
// "almost" in almost-daily), then the cost climbs steeply. The landing
// stays soft — it never resets to zero / shatters, and coming back never
// gets harder. Absence is expensive; return is cheap.

export const FOCUS_MAX = 100
export const FOCUS_FLOOR = 12 // long absence leaves embers, never ashes

// Full Ki bloom: hitting the top isn't a plateau you park on — it fires a
// ritual, pays out a one-time title-XP bonus, and then drops you hard so the
// climb is renewable. The afterglow floor sits BELOW the idle floor on purpose
// (peaking is meant to cost you), and the granted aura fades over a few days.
export const AFTERGLOW_FLOOR = 10 // where ki resets to after a bloom
export const KI_BLOOM_XP = 50 // one-time title-XP bonus for reaching full ki
export const KI_BLOOM_AURA_DAYS = 6 // days the bloom aura takes to fade to baseline
// Steep and escalating: the penalty grows with each idle day, and any
// realistically-high ki is on the floor by the 3rd idle day. Note ki tops out
// BELOW 100 in practice — reaching 100 fires the bloom and resets to
// AFTERGLOW_FLOOR — so we don't calibrate to a 100 start. From the surging tier
// (~85) the two charged days (−36, −52) clear the ~73 down to FOCUS_FLOOR by
// day 3; lower starts hit the floor sooner.
const EBB_SCHEDULE = [36, 52] // 2nd idle day −36, 3rd −52 (heavier each day)…
const EBB_PER_DAY_AFTER = 60 // …4th and beyond −60/day (you're already at the floor)

export function daysBetween(fromDate: string, toDate: string): number {
  const a = new Date(fromDate + 'T00:00:00')
  const b = new Date(toDate + 'T00:00:00')
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.round(ms / 86400000))
}

/** Ebb focus for idle days on an escalating curve: first rest day free, then
 *  −36, −52, −60/day (a realistically-high ki hits the floor by the 3rd idle
 *  day). Never falls below the floor (if already above it). */
export function applyEbb(focus: number, lastActiveDate: string, today: string): number {
  const idle = daysBetween(lastActiveDate, today)
  if (idle <= 0) return focus
  const ebbDays = Math.max(0, idle - 1) // day one of rest is part of the discipline
  let drop = 0
  for (let i = 0; i < ebbDays; i++) drop += EBB_SCHEDULE[i] ?? EBB_PER_DAY_AFTER
  const ebbed = focus - drop
  if (focus <= FOCUS_FLOOR) return Math.max(0, ebbed)
  return Math.max(FOCUS_FLOOR, ebbed)
}

export function addFocus(focus: number, amount: number): number {
  return Math.max(0, Math.min(FOCUS_MAX, focus + amount))
}

/** Bloom-aura strength, 1 on the day of a Full Ki bloom fading to 0 over
 *  KI_BLOOM_AURA_DAYS. Returns 0 if there's no bloom on record. */
export function kiBloomIntensity(kiBloomDate: string | undefined, today: string): number {
  if (!kiBloomDate) return 0
  const idle = daysBetween(kiBloomDate, today)
  return Math.max(0, Math.min(1, 1 - idle / KI_BLOOM_AURA_DAYS))
}

export type FocusTier = 'dormant' | 'warming' | 'flowing' | 'surging'

export function focusTier(focus: number): FocusTier {
  if (focus < 25) return 'dormant'
  if (focus < 55) return 'warming'
  if (focus < 85) return 'flowing'
  return 'surging'
}

export const FOCUS_TIER_LABEL: Record<FocusTier, string> = {
  dormant: 'Embers',
  warming: 'Warming up',
  flowing: 'In flow',
  surging: 'Surging',
}

export const FOCUS_TIER_ICON: Record<FocusTier, string> = {
  dormant: '🌑',
  warming: '✨',
  flowing: '🔥',
  surging: '⚡',
}
