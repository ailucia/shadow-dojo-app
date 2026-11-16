import { describe, expect, it } from 'vitest'
import { currentGate, currentGateIndex, defaultCampaign, gatesOf, hasCampaign, isBossGate, PLACEHOLDER_GATE } from './campaign'
import type { DojoState } from '../../types'

const base = { id: 'me', ninjaName: 'Kage', path: '', pathWhy: '', titleXp: 0, focus: 30, lastActiveDate: '2026-11-15', createdAt: '2026-11-15T00:00:00Z', schemaVersion: 4, onboarded: true } as DojoState

describe('campaign helpers', () => {
  it('shows a single "Meet your sensei" gate before /initiate', () => {
    expect(hasCampaign(base)).toBe(false)
    expect(gatesOf(base)).toEqual([PLACEHOLDER_GATE])
    expect(currentGate(base).id).toBe(PLACEHOLDER_GATE.id)
  })

  it('follows currentGateId through the user\'s own gates', () => {
    const dojo = { ...base, campaign: defaultCampaign('2026-11-15T00:00:00Z'), currentGateId: 'live-reps' }
    expect(hasCampaign(dojo)).toBe(true)
    expect(currentGateIndex(dojo)).toBe(3)
    expect(currentGate(dojo).name).toBe('Live reps')
  })

  it('falls back to the first gate if currentGateId is missing or stale', () => {
    const dojo = { ...base, campaign: defaultCampaign('2026-11-15T00:00:00Z'), currentGateId: 'gone' }
    expect(currentGateIndex(dojo)).toBe(0)
  })

  it('gives interview and closing gates the boss look', () => {
    const gates = defaultCampaign('2026-11-15T00:00:00Z').gates
    expect(gates.filter(isBossGate).map((g) => g.phase)).toEqual(['interview', 'close'])
  })
})
