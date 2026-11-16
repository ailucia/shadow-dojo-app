// ============================================================
// SHADOW DOJO — core types (the data contract; see SENSEI.md)
// ============================================================

export type TechniqueKey =
  | 'productSense'
  | 'aiFluency'
  | 'metrics'
  | 'storytelling'
  | 'behavioral'
  | 'execution'

export type TrainingKind = 'drill' | 'scout' | 'spar' | 'reflect' | 'outreach' | 'recover'
export type TrainingStatus = 'pending' | 'done'
export type TrainingSource = 'auto' | 'sensei'

export type LogType = 'event' | 'reflection' | 'sensei' | 'milestone'

// Where a gate sits in the search. The auto regimen draws reps that fit the
// current gate's phase, and interview/close gates get the "boss" look.
export type GatePhase = 'prep' | 'apply' | 'interview' | 'close'

export interface Technique {
  key: TechniqueKey
  level: number
  xp: number
}

export interface Training {
  id: string
  date: string // YYYY-MM-DD
  title: string
  detail: string
  kind: TrainingKind
  techniqueKey: TechniqueKey | null
  status: TrainingStatus
  xp: number
  focusReward: number
  source: TrainingSource
  createdAt: string
  completedAt: string | null
  focusApplied?: number // actual focus added at completion (≤ focusReward if capped); used for exact undo
  kiBloomXp?: number // title-XP bonus granted because this completion tipped ki to full; for exact undo
  order?: number // position in today's plan (warmup first, closeout last); app sorts by it
}

export interface LogEntry {
  id: string
  ts: string // ISO
  type: LogType
  body: string
  trainingId?: string // links a "Trained: …" stamp to its training item (for undo)
}

// One stretch of the campaign. The sensei writes these from the user's strategy.
export interface Gate {
  id: string
  name: string
  focus: string // one line: what this gate is for
  milestones: string[] // 2–3 inputs you control — evidence for /reflect, never outcomes
  phase: GatePhase
  targetDate?: string // YYYY-MM-DD, optional; drives "days left" and the pace line
}

// The user's campaign: their strategy from where they are to an offer, split
// into as many gates as it needs. Written by the sensei at /initiate and
// re-planned at /reflect.
export interface Campaign {
  strategy: string
  gates: Gate[]
  createdAt: string
}

export interface DojoState {
  id: string // always 'me' (single user)
  ninjaName: string
  path: string // the role you're climbing toward; '' until /initiate sets it
  pathWhy: string
  titleXp: number // overall progression XP -> title
  titleXpAtLastActive?: number // titleXp as of lastActiveDate; the baseline rank-erosion recomputes from so app-opens never double-charge
  focus: number // 0..100 (ki / momentum)
  lastActiveDate: string // YYYY-MM-DD — last day a REP was completed; the sole activity signal for the idle ebb (opening the app does NOT count)
  focusAtLastActive?: number // focus as of lastActiveDate; the baseline the idle ebb recomputes from so app-opens never reset the clock
  createdAt: string
  schemaVersion: number
  onboarded: boolean // false while the setup screens are still open (the dojo exists so the save file can be linked)
  campaignStartDate?: string // YYYY-MM-DD — the day the search began; drives the "Day N" counter
  dailyTarget?: number // reps per full training day (default 7)
  campaign?: Campaign // absent until /initiate writes one
  currentGateId?: string // the gate you're working on; advances on READINESS, never the calendar
  gateStartedDate?: string // YYYY-MM-DD — when the current gate began
  milestonesDone?: Record<string, number[]> // gate id -> indexes (into that gate's milestones) checked off
  kiBloomDate?: string // YYYY-MM-DD of the last Full Ki bloom; caps blooms to one/day and drives the fading aura
}

export interface Snapshot {
  schemaVersion: number
  exportedAt: string
  dojo: DojoState
  techniques: Technique[]
  training: Training[]
  log: LogEntry[]
}

export const SCHEMA_VERSION = 4 // v4: gates come from the user's campaign; no job board in the save
