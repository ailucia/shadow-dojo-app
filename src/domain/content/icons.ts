import type { TrainingKind } from '../../types'

// One visual anchor per training kind — every card gets a face.
export const KIND_ICON: Record<TrainingKind, string> = {
  drill: '🎯',
  scout: '🔭',
  spar: '⚔️',
  reflect: '🖋️',
  outreach: '🤝',
  recover: '🍵',
}
