import { describe, expect, it } from 'vitest'
import { addFocus, applyEbb, daysBetween, FOCUS_FLOOR, FOCUS_MAX } from './focus'

describe('daysBetween', () => {
  it('counts calendar days and never goes negative', () => {
    expect(daysBetween('2026-11-01', '2026-11-08')).toBe(7)
    expect(daysBetween('2026-11-08', '2026-11-01')).toBe(0)
  })
})

describe('applyEbb (ki drains when idle)', () => {
  it('leaves ki alone on the same day and the first rest day', () => {
    expect(applyEbb(70, '2026-11-10', '2026-11-10')).toBe(70)
    expect(applyEbb(70, '2026-11-10', '2026-11-11')).toBe(70)
  })

  it('charges heavier each idle day after that', () => {
    expect(applyEbb(90, '2026-11-10', '2026-11-12')).toBe(90 - 36)
    expect(applyEbb(90, '2026-11-10', '2026-11-13')).toBe(FOCUS_FLOOR) // 90 − 36 − 52 < floor
  })

  it('never drops below the floor from above it', () => {
    expect(applyEbb(85, '2026-10-01', '2026-11-15')).toBe(FOCUS_FLOOR)
  })
})

describe('addFocus', () => {
  it('caps at the maximum', () => {
    expect(addFocus(FOCUS_MAX - 3, 10)).toBe(FOCUS_MAX)
  })
})
