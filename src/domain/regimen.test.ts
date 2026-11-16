import { describe, expect, it } from 'vitest'
import { pickTemplates, templatesToTraining } from './regimen'
import { TRAINING_TEMPLATES } from './content/trainingTemplates'
import type { GatePhase } from '../types'

const ctx = (phase: GatePhase, away = false) => ({ date: '2026-11-15', phase, existing: [], away })

describe('pickTemplates', () => {
  it('builds a day of the requested size: warmup first, closeout last', () => {
    const day = pickTemplates(ctx('prep'), 7)
    expect(day).toHaveLength(7)
    expect(day[0].slot).toBe('warmup')
    expect(day[6].slot).toBe('closeout')
    expect(new Set(day.map((t) => t.id)).size).toBe(7)
  })

  it("only draws reps that fit the current gate's phase", () => {
    for (const phase of ['prep', 'apply', 'interview', 'close'] as GatePhase[]) {
      for (const t of pickTemplates(ctx(phase), 7)) {
        expect(t.phases.length === 0 || t.phases.includes(phase)).toBe(true)
      }
    }
  })

  it('returns nothing for a zero-size day', () => {
    expect(pickTemplates(ctx('apply'), 0)).toEqual([])
  })
})

describe('templatesToTraining', () => {
  it('turns templates into pending auto reps in order', () => {
    const items = templatesToTraining(TRAINING_TEMPLATES.slice(0, 3), '2026-11-15')
    expect(items.map((t) => t.order)).toEqual([0, 1, 2])
    expect(items.every((t) => t.status === 'pending' && t.source === 'auto' && t.date === '2026-11-15')).toBe(true)
  })
})
