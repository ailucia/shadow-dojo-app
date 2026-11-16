import { describe, expect, it } from 'vitest'
import { applyTitleErosion, EROSION_GRACE_DAYS, EROSION_MAX_PCT, titleForXp, titleProgress } from './titles'

describe('title ladder', () => {
  it('maps XP to the five titles', () => {
    expect(titleForXp(0).name).toBe('Novice')
    expect(titleForXp(120).name).toBe('Apprentice')
    expect(titleForXp(360).name).toBe('Adept')
    expect(titleForXp(800).name).toBe('Expert')
    expect(titleForXp(5000).name).toBe('Master')
  })

  it('reports progress toward the next title', () => {
    expect(titleProgress(240)).toMatchObject({ current: { name: 'Apprentice' }, pct: 50 })
    expect(titleProgress(5000).next).toBeNull()
  })
})

describe('rank erosion', () => {
  it('is free through the grace period', () => {
    expect(applyTitleErosion(1000, EROSION_GRACE_DAYS)).toBe(1000)
  })

  it('erodes after the grace period, but never more than the cap', () => {
    expect(applyTitleErosion(1000, EROSION_GRACE_DAYS + 1)).toBeLessThan(1000)
    expect(applyTitleErosion(1000, 365)).toBe(1000 * (1 - EROSION_MAX_PCT))
  })
})
