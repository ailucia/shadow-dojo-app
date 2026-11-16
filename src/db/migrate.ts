import type { DojoState, GatePhase } from '../types'
import { SCHEMA_VERSION } from '../types'
import { DEFAULT_GATES, defaultCampaign } from '../domain/content/campaign'

// Pure save-file helpers (no database access), so they can be unit-tested.

// Fields older saves may carry: the week-based campaign (v3 and earlier).
interface LegacyDojo {
  currentWeekId?: number
  weekStartedDate?: string
  currentArcId?: number
}

// Fill fields added after a save was created. An older, week-based save gets
// the default gate template, positioned at the gate that matches its week.
export function migrateDojo(raw: DojoState): DojoState {
  const { currentWeekId, weekStartedDate, currentArcId: _arc, ...d } = raw as DojoState & LegacyDojo
  void _arc
  const migrated: DojoState = {
    ...d,
    campaignStartDate: d.campaignStartDate ?? d.createdAt.slice(0, 10),
    focusAtLastActive: d.focusAtLastActive ?? d.focus,
    titleXpAtLastActive: d.titleXpAtLastActive ?? d.titleXp,
    dailyTarget: d.dailyTarget ?? 7,
    milestonesDone: d.milestonesDone ?? {},
    schemaVersion: SCHEMA_VERSION,
  }
  if (!migrated.campaign && currentWeekId) {
    // 10 weeks folded onto the 7 default gates.
    const WEEK_TO_GATE = [0, 0, 1, 2, 3, 3, 4, 4, 5, 5, 6]
    const gate = DEFAULT_GATES[WEEK_TO_GATE[Math.min(currentWeekId, 10)] ?? 0]
    migrated.campaign = defaultCampaign(new Date().toISOString())
    migrated.currentGateId = gate.id
    migrated.gateStartedDate = weekStartedDate
    migrated.milestonesDone = {}
  }
  return migrated
}

const PHASES: GatePhase[] = ['prep', 'apply', 'interview', 'close']
const isStr = (v: unknown): v is string => typeof v === 'string'
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Returns the first problem with a save, or null if it's safe to load.
 *  Runs before anything is cleared, so a bad edit never replaces good data. */
export function validateSnapshot(snap: unknown): string | null {
  if (!isObj(snap)) return 'The file is not a JSON object.'
  if (!isNum(snap.schemaVersion)) return 'Missing schemaVersion.'
  if (snap.schemaVersion > SCHEMA_VERSION) return 'This save was made by a newer version of Shadow Dojo.'
  const d = snap.dojo
  if (!isObj(d)) return 'Missing the dojo object.'
  for (const k of ['id', 'ninjaName', 'lastActiveDate', 'createdAt'] as const) if (!isStr(d[k])) return `dojo.${k} must be a string.`
  for (const k of ['titleXp', 'focus'] as const) if (!isNum(d[k])) return `dojo.${k} must be a number.`
  if (d.campaign !== undefined) {
    const c = d.campaign
    if (!isObj(c) || !Array.isArray(c.gates)) return 'dojo.campaign.gates must be a list.'
    for (const [i, g] of c.gates.entries()) {
      if (!isObj(g) || !isStr(g.id) || !isStr(g.name)) return `Gate ${i + 1} needs an id and a name.`
      if (!Array.isArray(g.milestones) || !g.milestones.every(isStr)) return `Gate "${g.name}" needs a list of milestones.`
      if (!PHASES.includes(g.phase as GatePhase)) return `Gate "${g.name}" has an unknown phase.`
    }
  }
  for (const key of ['techniques', 'training', 'log'] as const) {
    if (snap[key] !== undefined && !Array.isArray(snap[key])) return `${key} must be a list.`
  }
  for (const [i, t] of ((snap.training as unknown[]) ?? []).entries()) {
    if (!isObj(t) || !isStr(t.id) || !isStr(t.date) || !isStr(t.title)) return `Training item ${i + 1} needs an id, date and title.`
    if (t.status !== 'pending' && t.status !== 'done') return `Training "${t.title}" has an unknown status.`
    if (!isNum(t.xp) || !isNum(t.focusReward)) return `Training "${t.title}" needs numeric xp and focusReward.`
  }
  for (const [i, e] of ((snap.log as unknown[]) ?? []).entries()) {
    if (!isObj(e) || !isStr(e.id) || !isStr(e.ts) || !isStr(e.body)) return `Log entry ${i + 1} needs an id, ts and body.`
  }
  return null
}
