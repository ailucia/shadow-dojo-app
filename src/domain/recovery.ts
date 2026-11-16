import { daysBetween } from './focus'

// Soft re-entry after off days. Never punishing. The dojo always kept your place.

export interface ReentryInfo {
  away: boolean
  daysAway: number
  message: string
}

export function reentry(lastActiveDate: string, today: string): ReentryInfo {
  const daysAway = daysBetween(lastActiveDate, today)
  if (daysAway < 2) return { away: false, daysAway, message: '' }
  const message =
    daysAway >= 7
      ? 'The dojo kept your place. Long rests happen — warm up with one small thing.'
      : 'Welcome back. Rest is part of the discipline — catch your rhythm with one easy rep.'
  return { away: true, daysAway, message }
}
