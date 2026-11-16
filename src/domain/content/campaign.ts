import type { Campaign, DojoState, Gate, GatePhase } from '../../types'

// Before /initiate the dojo has no strategy, so the strip shows one gate that
// points at the sensei. Nothing is invented on the user's behalf.
export const PLACEHOLDER_GATE: Gate = {
  id: 'meet-your-sensei',
  name: 'Meet your sensei',
  focus: 'Open this folder in your AI agent and run /initiate. Your sensei turns your strategy into gates.',
  milestones: ['Save file linked', '/initiate finished', 'First /kata planned'],
  phase: 'prep',
}

// The default template the sensei adapts at /initiate: a typical PM search from
// a cold start. Adapting means trimming, merging or reordering gates and
// rewriting milestones to fit where the user actually is.
export const DEFAULT_GATES: Gate[] = [
  { id: 'foundation', name: 'Foundation reset', phase: 'prep',
    focus: 'Rebuild the base and get live fast: first spoken rep this week.',
    milestones: ['Core skills drilled daily', 'One live mock done', 'Pitch v1 recorded'] },
  { id: 'stories', name: 'Story forging', phase: 'prep',
    focus: 'Build the stories that carry every interview, then test them out loud.',
    milestones: ['5+ stories ready', '2+ mocks run', 'Pitch sharpened'] },
  { id: 'first-applications', name: 'First applications', phase: 'apply',
    focus: 'Send the first wave of lower-stakes applications and book recruiter screens.',
    milestones: ['5+ applications out', 'Recruiter screens in motion', 'Pipeline stocked'] },
  { id: 'live-reps', name: 'Live reps', phase: 'apply',
    focus: 'Real interviews at lower stakes: every round is training data.',
    milestones: ['2+ live rounds', 'Every round debriefed', 'Weak spots named'] },
  { id: 'big-launch', name: 'The big launch', phase: 'apply',
    focus: 'Top-target applications go out with referrals behind them.',
    milestones: ['Target applications sent', 'Referrals asked for', 'Long shots taken'] },
  { id: 'loops', name: 'Loops', phase: 'interview',
    focus: 'Full interview loops with company-specific prep.',
    milestones: ['Loops scheduled or done', 'Prep notes per company', 'Pipeline kept warm'] },
  { id: 'conversion', name: 'Conversion', phase: 'close',
    focus: 'Finals, follow-ups and offers.',
    milestones: ['Final rounds', 'Follow-ups sent', 'Offers worked'] },
]

export const PHASE_LABEL: Record<GatePhase, string> = {
  prep: 'Prep',
  apply: 'Applying',
  interview: 'Interviewing',
  close: 'Closing',
}

export function gatesOf(dojo: DojoState): Gate[] {
  const gates = dojo.campaign?.gates
  return gates && gates.length ? gates : [PLACEHOLDER_GATE]
}

export function hasCampaign(dojo: DojoState): boolean {
  return !!dojo.campaign?.gates?.length
}

/** Index of the current gate (0-based); falls back to the first gate. */
export function currentGateIndex(dojo: DojoState): number {
  const gates = gatesOf(dojo)
  const i = gates.findIndex((g) => g.id === dojo.currentGateId)
  return i >= 0 ? i : 0
}

export function currentGate(dojo: DojoState): Gate {
  return gatesOf(dojo)[currentGateIndex(dojo)]
}

export function isBossGate(g: Gate): boolean {
  return g.phase === 'interview' || g.phase === 'close'
}

/** A starter campaign built from the default template (used when an older,
 *  week-based save is imported, and as the shape the sensei starts from). */
export function defaultCampaign(createdAt: string): Campaign {
  return {
    strategy: 'Default plan: prepare, apply in waves, then convert loops into offers.',
    gates: DEFAULT_GATES.map((g) => ({ ...g, milestones: [...g.milestones] })),
    createdAt,
  }
}
