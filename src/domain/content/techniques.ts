import type { TechniqueKey } from '../../types'

export interface TechniqueDef {
  key: TechniqueKey
  label: string
  icon: string
  blurb: string
}

// The AI-PM skill set, modeled as techniques you train and level up.
export const TECHNIQUES: TechniqueDef[] = [
  { key: 'productSense', label: 'Product Sense', icon: '🧭', blurb: 'Spot real user problems and shape crisp product bets.' },
  { key: 'aiFluency', label: 'AI Fluency', icon: '🤖', blurb: 'Talk models, eval, latency, RAG — credibly. The AI-PM edge.' },
  { key: 'metrics', label: 'Metrics & Analytics', icon: '📊', blurb: 'Define success; reason about funnels, trade-offs, and impact.' },
  { key: 'storytelling', label: 'Storytelling', icon: '🎙️', blurb: 'Vision and narrative — exec-ready communication.' },
  { key: 'behavioral', label: 'Behavioral', icon: '🧠', blurb: 'STAR stories, leadership, influence without authority.' },
  { key: 'execution', label: 'Execution', icon: '⚙️', blurb: 'Scope, prioritize, ship, drive cross-functional delivery.' },
]

export const TECHNIQUE_LABEL: Record<TechniqueKey, string> = Object.fromEntries(
  TECHNIQUES.map((t) => [t.key, t.label]),
) as Record<TechniqueKey, string>

export const TECHNIQUE_ICON: Record<TechniqueKey, string> = Object.fromEntries(
  TECHNIQUES.map((t) => [t.key, t.icon]),
) as Record<TechniqueKey, string>
