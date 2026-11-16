import { describe, expect, it } from 'vitest'
import { migrateDojo, validateSnapshot } from './migrate'
import { SCHEMA_VERSION } from '../types'
import type { DojoState } from '../types'

const dojo = (extra: Record<string, unknown> = {}) =>
  ({
    id: 'me',
    ninjaName: 'Kage',
    path: 'Product Manager',
    pathWhy: '',
    titleXp: 100,
    focus: 40,
    lastActiveDate: '2026-11-14',
    createdAt: '2026-10-01T00:00:00.000Z',
    schemaVersion: 3,
    onboarded: true,
    ...extra,
  }) as unknown as DojoState

const save = (extra: Record<string, unknown> = {}) => ({
  schemaVersion: 3,
  exportedAt: '2026-11-15T00:00:00.000Z',
  dojo: dojo(),
  techniques: [],
  training: [{ id: 'tr_1', date: '2026-11-15', title: 'A rep', status: 'pending', xp: 8, focusReward: 8 }],
  log: [{ id: 'lg_1', ts: '2026-11-15T00:00:00.000Z', type: 'sensei', body: 'Planned.' }],
  ...extra,
})

describe('migrateDojo', () => {
  it('fills defaults and stamps the current schema version', () => {
    const d = migrateDojo(dojo())
    expect(d.schemaVersion).toBe(SCHEMA_VERSION)
    expect(d.campaignStartDate).toBe('2026-10-01')
    expect(d.dailyTarget).toBe(7)
    expect(d.campaign).toBeUndefined() // no campaign until /initiate writes one
  })

  it('turns an old week-based save into the default gates, at the matching gate', () => {
    const d = migrateDojo(dojo({ currentWeekId: 6, weekStartedDate: '2026-11-10' }))
    expect(d.campaign?.gates.length).toBeGreaterThan(0)
    expect(d.currentGateId).toBe('big-launch')
    expect(d.gateStartedDate).toBe('2026-11-10')
    expect('currentWeekId' in d).toBe(false)
  })
})

describe('validateSnapshot', () => {
  it('accepts a good save, including an old one that still has a mission board', () => {
    expect(validateSnapshot(save())).toBeNull()
    expect(validateSnapshot(save({ missions: [{ id: 'ms_1', company: 'Acme' }] }))).toBeNull()
  })

  it('rejects saves that would load broken data', () => {
    expect(validateSnapshot('nope')).toMatch(/not a JSON object/)
    expect(validateSnapshot(save({ schemaVersion: SCHEMA_VERSION + 1 }))).toMatch(/newer version/)
    expect(validateSnapshot(save({ dojo: undefined }))).toMatch(/dojo object/)
    expect(validateSnapshot(save({ training: [{ id: 'x', date: '2026-11-15', title: 'Bad', status: 'maybe', xp: 1, focusReward: 1 }] }))).toMatch(/unknown status/)
    expect(validateSnapshot(save({ dojo: dojo({ campaign: { gates: [{ id: 'g', name: 'G', milestones: [], phase: 'someday' }] } }) }))).toMatch(/unknown phase/)
  })
})
