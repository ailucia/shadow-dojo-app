import type { GatePhase, Training } from '../types'
import { TRAINING_TEMPLATES } from './content/trainingTemplates'
import type { TemplateSlot, TrainingTemplate } from './content/trainingTemplates'

function uid(prefix: string): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 9)
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

export interface RegimenContext {
  date: string
  phase: GatePhase // the current gate's phase
  existing: Training[] // today's existing training items (kept ones)
  away: boolean // re-entry → lead with the gentlest warmup
}

/** Build a full training day: 1 tiny warmup first (starting is the hard part),
 *  goal-defined core reps in the middle, 1 closeout to land the day.
 *  Picks are biased to the current gate's phase. Ordered — the UI
 *  spotlights the first pending rep so there's never a "what now?" moment. */
export function pickTemplates(ctx: RegimenContext, count: number): TrainingTemplate[] {
  if (count <= 0) return []
  const pool = TRAINING_TEMPLATES.filter((t) => t.phases.length === 0 || t.phases.includes(ctx.phase))
  const usedTitles = new Set(ctx.existing.map((e) => e.title))
  const bySlot = (slot: TemplateSlot) =>
    shuffle(pool.filter((t) => t.slot === slot && !usedTitles.has(t.title)))

  const wantWarmup = count >= 3 ? 1 : 0
  const wantCloseout = count >= 5 ? 1 : 0
  const wantCore = count - wantWarmup - wantCloseout

  const chosen: TrainingTemplate[] = []

  if (wantWarmup) {
    const warmups = bySlot('warmup')
    // the bedtime self-check always leads the day when it hasn't been logged yet;
    // else, returning after days away → the gentlest possible start
    const pick =
      warmups.find((t) => t.id === 'warmup-bedtime') ??
      (ctx.away ? warmups.find((t) => t.id === 'warmup-win') : undefined) ??
      warmups[0]
    if (pick) chosen.push(pick)
  }

  const cores = bySlot('core').filter((t) => !chosen.includes(t))
  const coreChosen: TrainingTemplate[] = []
  for (const t of cores) {
    if (coreChosen.length >= wantCore) break
    if (!coreChosen.includes(t)) coreChosen.push(t)
  }
  chosen.push(...coreChosen)

  if (wantCloseout) {
    const close = bySlot('closeout').find((t) => !chosen.includes(t))
    if (close) chosen.push(close)
  }
  return chosen.slice(0, count)
}

export function templatesToTraining(templates: TrainingTemplate[], date: string): Training[] {
  const now = new Date().toISOString()
  return templates.map((t, i) => ({
    id: uid('tr'),
    date,
    title: t.title,
    detail: t.detail,
    kind: t.kind,
    techniqueKey: t.techniqueKey,
    status: 'pending',
    xp: t.xp,
    focusReward: t.focusReward,
    source: 'auto',
    createdAt: now,
    completedAt: null,
    order: i,
  }))
}
