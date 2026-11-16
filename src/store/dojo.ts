import { create } from 'zustand'
import { db } from '../db/schema'
import { scheduleAutosave, isFileConnected, syncFromFile } from '../db/persistence'
import { migrateDojo } from '../db/snapshot'
import { currentGate, currentGateIndex, gatesOf } from '../domain/content/campaign'
import type { DojoState, LogEntry, Technique, TechniqueKey, Training } from '../types'
import { SCHEMA_VERSION } from '../types'
import { TECHNIQUES } from '../domain/content/techniques'
import { addFocus, applyEbb, daysBetween, AFTERGLOW_FLOOR, FOCUS_MAX, KI_BLOOM_XP } from '../domain/focus'
import { pickTemplates, templatesToTraining } from '../domain/regimen'
import { reentry } from '../domain/recovery'
import { titleForXp, applyTitleErosion } from '../domain/titles'

function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
function uid(prefix: string): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 9)
}
function nowIso(): string {
  return new Date().toISOString()
}
function techLevel(xp: number): number {
  return 1 + Math.floor(xp / 60)
}

export interface RewardEvent {
  nonce: number
  x: number
  y: number
  xp: number
  focus: number
  techniqueKey: TechniqueKey | null
}
export interface RankUpEvent {
  nonce: number
  title: string
}
export interface GatePassEvent {
  nonce: number
  gateNumber: number // 1-based position of the gate you just walked into
  total: number
  name: string
}
export interface KiBloomEvent {
  nonce: number
  xp: number
}

const DEFAULT_DAILY_TARGET = 7

interface DojoStore {
  ready: boolean
  dojo: DojoState | null
  techniques: Technique[]
  training: Training[]
  log: LogEntry[]
  reentryMsg: string
  reward: RewardEvent | null
  rankUp: RankUpEvent | null
  gatePassed: GatePassEvent | null
  kiBloom: KiBloomEvent | null
  syncIssue: string | null // why the linked save file couldn't be loaded, if it couldn't
  notice: string | null // a short, non-error message for the top bar

  init: () => Promise<void>
  createDojo: (ninjaName: string) => Promise<void>
  finishOnboarding: () => Promise<void>
  completeTraining: (id: string, origin: { x: number; y: number }) => Promise<void>
  undoTraining: (id: string) => Promise<void>
  regenerateTraining: () => Promise<void>
  advanceGate: () => Promise<void>
  toggleMilestone: (gateId: string, index: number) => Promise<void>
  addReflection: (body: string) => Promise<void>
  reload: () => Promise<void>
  setSyncIssue: (msg: string | null) => void
  setNotice: (msg: string | null) => void
  clearReward: () => void
  clearRankUp: () => void
  clearGatePassed: () => void
  clearKiBloom: () => void
}

export const useDojo = create<DojoStore>((set, get) => ({
  ready: false,
  dojo: null,
  techniques: [],
  training: [],
  log: [],
  reentryMsg: '',
  reward: null,
  rankUp: null,
  gatePassed: null,
  kiBloom: null,
  syncIssue: null,
  notice: null,

  init: async () => {
    // The connected file (the sensei's latest plan) is the source of truth on
    // startup — not stale local state. Pull it in first so the morning's agreed
    // plan can't be clobbered by an autosave of yesterday's local board.
    try {
      if (await isFileConnected()) await syncFromFile()
    } catch (e) {
      // bad/partial file — keep local state and say why
      set({ syncIssue: e instanceof Error ? e.message : 'Your save file could not be loaded.' })
    }

    const dojoRows = await db.dojo.toArray()
    if (dojoRows.length === 0) {
      set({ ready: true, dojo: null })
      return
    }
    const dojo = dojoRows[0]
    const today = todayStr()
    const migrated = migrateDojo(dojo)
    // The idle ebb recomputes from the focus captured at the last completed rep,
    // so it is idempotent: opening the app any number of times in one idle
    // stretch charges the same total and never resets the clock. Only a rep
    // advances lastActiveDate (see completeTraining) — leave it untouched here.
    const baseline = migrated.focusAtLastActive ?? migrated.focus
    const ebbed = applyEbb(baseline, migrated.lastActiveDate, today)
    // Rank erosion runs on the same idle signal as the ebb and is idempotent
    // for the same reason: it recomputes titleXp from the baseline captured at
    // the last rep, so app-opens during an idle stretch never double-charge and
    // only a rep re-anchors it (see completeTraining). Leave the baseline
    // untouched here — this override is derived, not committed as the new anchor.
    const idle = daysBetween(migrated.lastActiveDate, today)
    const titleBaseline = migrated.titleXpAtLastActive ?? migrated.titleXp
    const erodedXp = applyTitleErosion(titleBaseline, idle)
    const re = reentry(migrated.lastActiveDate, today)
    const demoted = titleForXp(erodedXp).name !== titleForXp(titleBaseline).name
    const reMessage =
      erodedXp < titleBaseline
        ? `${re.message || 'Welcome back.'} Your ki fell to the floor — rank slipped${
            demoted ? ` to ${titleForXp(erodedXp).name}` : ''
          }. One rep starts the climb back.`
        : re.message
    const updatedDojo: DojoState = {
      ...migrated,
      focus: ebbed,
      titleXp: erodedXp,
    }
    await db.dojo.put(updatedDojo)

    const [techniques, allTraining, log] = await Promise.all([
      db.techniques.toArray(),
      db.training.toArray(),
      db.log.orderBy('ts').reverse().toArray(),
    ])

    // Sweep stale auto filler before deciding today's board:
    //  · pending auto reps from past days are dead — the app is day-scoped, so
    //    they never surface again and just accumulate in the save file forever;
    //  · today's pending auto is superseded the moment a sensei plan exists. The
    //    morning flow fills an empty day with auto reps, THEN the sensei writes
    //    the plan, so the filler is already on the board when the plan lands —
    //    the init gate below only stops NEW filler, it can't remove this. A
    //    sensei-curated day stands alone.
    const todays = allTraining.filter((t) => t.date === today)
    const hasSenseiPlan = todays.some((t) => t.source === 'sensei')
    const staleAuto = allTraining.filter(
      (t) =>
        t.source === 'auto' &&
        t.status === 'pending' &&
        (t.date < today || (t.date === today && hasSenseiPlan)),
    )
    if (staleAuto.length) await db.training.bulkDelete(staleAuto.map((t) => t.id))
    const staleIds = new Set(staleAuto.map((t) => t.id))

    // ensure today's training exists — but a sensei-curated day stands alone.
    // Only an empty, uncurated day falls back to the auto regimen; if the
    // sensei has written a plan for today, that plan IS the board.
    let training = allTraining.filter((t) => !staleIds.has(t.id))
    if (todays.length === 0 && !hasSenseiPlan) {
      const target = updatedDojo.dailyTarget ?? DEFAULT_DAILY_TARGET
      const templates = pickTemplates(
        { date: today, phase: currentGate(updatedDojo).phase, existing: [], away: re.away },
        target,
      )
      const fresh = templatesToTraining(templates, today)
      if (fresh.length) await db.training.bulkPut(fresh)
      training = [...training, ...fresh]
    }

    set({
      ready: true,
      dojo: updatedDojo,
      techniques,
      training,
      log,
      reentryMsg: reMessage,
    })
    scheduleAutosave()
  },

  // Setup creates the dojo early (not yet onboarded) so the save file can be
  // linked before setup finishes. The target role, start date and campaign
  // come from the sensei at /initiate.
  createDojo: async (ninjaName) => {
    const today = todayStr()
    const dojo: DojoState = {
      id: 'me',
      ninjaName: ninjaName.trim() || 'Ninja',
      path: '',
      pathWhy: '',
      titleXp: 0,
      titleXpAtLastActive: 0,
      focus: 30, // start with a warm spark, not cold
      focusAtLastActive: 30,
      lastActiveDate: today,
      createdAt: nowIso(),
      schemaVersion: SCHEMA_VERSION,
      onboarded: false,
      campaignStartDate: today,
      dailyTarget: DEFAULT_DAILY_TARGET,
      gateStartedDate: today,
    }
    const techniques: Technique[] = TECHNIQUES.map((t) => ({ key: t.key, level: 1, xp: 0 }))
    const log: LogEntry[] = [
      {
        id: uid('lg'),
        ts: nowIso(),
        type: 'milestone',
        body: 'Entered the dojo.',
      },
    ]
    const templates = pickTemplates(
      { date: today, phase: 'prep', existing: [], away: false },
      DEFAULT_DAILY_TARGET,
    )
    const training = templatesToTraining(templates, today)

    await db.transaction('rw', [db.dojo, db.techniques, db.training, db.log], async () => {
      await db.dojo.put(dojo)
      await db.techniques.bulkPut(techniques)
      await db.training.bulkPut(training)
      await db.log.bulkPut(log)
    })
    set({ ready: true, dojo, techniques, training, log, reentryMsg: '' })
    scheduleAutosave()
  },

  finishOnboarding: async () => {
    const state = get()
    if (!state.dojo) return
    const dojo: DojoState = { ...state.dojo, onboarded: true }
    await db.dojo.put(dojo)
    set({ dojo })
    scheduleAutosave()
  },

  completeTraining: async (id, origin) => {
    const state = get()
    const item = state.training.find((t) => t.id === id)
    if (!item || item.status === 'done' || !state.dojo) return

    const today = todayStr()
    const rawFocus = addFocus(state.dojo.focus, item.focusReward)
    // Full Ki bloom: this rep tipped ki to the very top (and none already fired
    // today) → pay the one-time bonus, fire the ritual, and drop to the afterglow
    // floor so the climb stays renewable. focusApplied stays the true net delta,
    // so undo restores the pre-bloom ki exactly.
    const bloomed = rawFocus >= FOCUS_MAX && state.dojo.kiBloomDate !== today
    const finalFocus = bloomed ? AFTERGLOW_FLOOR : rawFocus
    const bloomXp = bloomed ? KI_BLOOM_XP : 0

    const completed: Training = {
      ...item,
      status: 'done',
      completedAt: nowIso(),
      focusApplied: finalFocus - state.dojo.focus,
      kiBloomXp: bloomed ? KI_BLOOM_XP : undefined, // always overwrite, never inherit a stale value
    }
    await db.training.put(completed)

    const prevTitle = titleForXp(state.dojo.titleXp)
    const newTitleXp = state.dojo.titleXp + item.xp + bloomXp
    const newTitle = titleForXp(newTitleXp)
    const updatedDojo: DojoState = {
      ...state.dojo,
      focus: finalFocus,
      focusAtLastActive: finalFocus, // this rep is the activity signal — anchor the idle-ebb baseline here
      titleXp: newTitleXp,
      titleXpAtLastActive: newTitleXp, // and the rank-erosion baseline — a rep resets the clock, banking any earlier erosion
      lastActiveDate: today,
      ...(bloomed ? { kiBloomDate: today } : {}),
    }
    await db.dojo.put(updatedDojo)

    let techniques = state.techniques
    if (item.techniqueKey) {
      const key = item.techniqueKey
      techniques = state.techniques.map((t) =>
        t.key === key ? { ...t, xp: t.xp + item.xp, level: techLevel(t.xp + item.xp) } : t,
      )
      const updated = techniques.find((t) => t.key === key)
      if (updated) await db.techniques.put(updated)
    }

    const logEntry: LogEntry = {
      id: uid('lg'),
      ts: nowIso(),
      type: 'event',
      body: `Trained: ${item.title}  (+${item.xp} XP)`,
      trainingId: item.id,
    }
    await db.log.put(logEntry)

    const reward: RewardEvent = {
      nonce: Date.now(),
      x: origin.x,
      y: origin.y,
      xp: item.xp,
      focus: item.focusReward,
      techniqueKey: item.techniqueKey,
    }
    const rankUp: RankUpEvent | null =
      newTitle.name !== prevTitle.name ? { nonce: Date.now(), title: newTitle.name } : state.rankUp
    const kiBloom: KiBloomEvent | null = bloomed ? { nonce: Date.now(), xp: KI_BLOOM_XP } : state.kiBloom

    set({
      training: state.training.map((t) => (t.id === id ? completed : t)),
      dojo: updatedDojo,
      techniques,
      log: [logEntry, ...state.log],
      reward,
      rankUp,
      kiBloom,
    })
    scheduleAutosave()
  },

  // A quiet correction: give back exactly what the completion granted.
  undoTraining: async (id) => {
    const state = get()
    const item = state.training.find((t) => t.id === id)
    if (!item || item.status !== 'done' || !state.dojo) return

    const reverted: Training = { ...item, status: 'pending', completedAt: null, focusApplied: undefined, kiBloomXp: undefined }
    await db.training.put(reverted)

    const focusDelta = item.focusApplied ?? item.focusReward
    // Undoing a rep that bloomed: hand back the bonus XP too, and clear the
    // bloom stamp so the day's one-bloom cap resets. focusDelta is the net delta
    // (negative on a bloom), so focus rewinds to its pre-bloom value on its own.
    const undoBloom = (item.kiBloomXp ?? 0) > 0
    const updatedDojo: DojoState = {
      ...state.dojo,
      focus: Math.max(0, state.dojo.focus - focusDelta),
      // rewind the ebb baseline in lockstep, else the next load would recompute
      // focus from the un-rewound baseline and resurrect the undone rep's ki
      focusAtLastActive: Math.max(0, (state.dojo.focusAtLastActive ?? state.dojo.focus) - focusDelta),
      titleXp: Math.max(0, state.dojo.titleXp - item.xp - (item.kiBloomXp ?? 0)),
      // rewind the erosion baseline in lockstep too, so a later load can't
      // recompute titleXp from the un-rewound anchor and resurrect the undone XP
      titleXpAtLastActive: Math.max(0, (state.dojo.titleXpAtLastActive ?? state.dojo.titleXp) - item.xp - (item.kiBloomXp ?? 0)),
      ...(undoBloom ? { kiBloomDate: undefined } : {}),
    }
    await db.dojo.put(updatedDojo)

    let techniques = state.techniques
    if (item.techniqueKey) {
      const key = item.techniqueKey
      techniques = state.techniques.map((t) => {
        if (t.key !== key) return t
        const xp = Math.max(0, t.xp - item.xp)
        return { ...t, xp, level: techLevel(xp) }
      })
      const updated = techniques.find((t) => t.key === key)
      if (updated) await db.techniques.put(updated)
    }

    // drop the matching "Trained: …" stamp (fall back to body match for older saves)
    const stamp =
      state.log.find((e) => e.trainingId === id) ??
      state.log.find((e) => e.type === 'event' && e.body.startsWith(`Trained: ${item.title}`))
    if (stamp) await db.log.delete(stamp.id)

    set({
      training: state.training.map((t) => (t.id === id ? reverted : t)),
      dojo: updatedDojo,
      techniques,
      log: stamp ? state.log.filter((e) => e.id !== stamp.id) : state.log,
    })
    scheduleAutosave()
  },

  // Gate milestones are evidence for /reflect, not homework — tappable in the
  // app, readable (and settable) by the sensei via the file.
  toggleMilestone: async (gateId, index) => {
    const state = get()
    if (!state.dojo) return
    const all = { ...(state.dojo.milestonesDone ?? {}) }
    const cur = new Set(all[gateId] ?? [])
    if (cur.has(index)) cur.delete(index)
    else cur.add(index)
    all[gateId] = Array.from(cur).sort((a, b) => a - b)
    const dojo: DojoState = { ...state.dojo, milestonesDone: all }
    await db.dojo.put(dojo)
    set({ dojo })
    scheduleAutosave()
  },

  // A readiness call, never a calendar one — the user (or the sensei at
  // /reflect, via the file) passes a gate when its milestones are substantially met.
  advanceGate: async () => {
    const state = get()
    if (!state.dojo) return
    const gates = gatesOf(state.dojo)
    const i = currentGateIndex(state.dojo)
    if (!state.dojo.campaign || i >= gates.length - 1) return
    const next = gates[i + 1]
    const dojo: DojoState = { ...state.dojo, currentGateId: next.id, gateStartedDate: todayStr() }
    await db.dojo.put(dojo)
    const logEntry: LogEntry = {
      id: uid('lg'),
      ts: nowIso(),
      type: 'milestone',
      body: `Gate passed. Now at gate ${i + 2} of ${gates.length}: ${next.name}.`,
    }
    await db.log.put(logEntry)
    set({
      dojo,
      log: [logEntry, ...state.log],
      gatePassed: { nonce: Date.now(), gateNumber: i + 2, total: gates.length, name: next.name },
    })
    scheduleAutosave()
    // re-aim today's remaining auto training at the new gate's phase
    await get().regenerateTraining()
  },

  regenerateTraining: async () => {
    const state = get()
    if (!state.dojo) return
    const today = todayStr()
    const keep = state.training.filter(
      (t) => t.date === today && (t.source === 'sensei' || t.status === 'done'),
    )
    const removable = state.training.filter(
      (t) => t.date === today && t.source === 'auto' && t.status === 'pending',
    )
    await db.training.bulkDelete(removable.map((t) => t.id))
    const keptPending = keep.filter((k) => k.status === 'pending').length
    const keptDone = keep.filter((k) => k.status === 'done').length
    const target = state.dojo.dailyTarget ?? DEFAULT_DAILY_TARGET
    const genericTarget = Math.max(0, target - keptPending - keptDone)
    const templates = pickTemplates(
      { date: today, phase: currentGate(state.dojo).phase, existing: keep, away: false },
      Math.max(1, genericTarget),
    )
    const maxKeptOrder = keep.reduce((m, k) => Math.max(m, k.order ?? 0), -1)
    const fresh = templatesToTraining(templates, today).map((t, i) => ({
      ...t,
      order: maxKeptOrder + 1 + i,
    }))
    if (fresh.length) await db.training.bulkPut(fresh)
    const others = state.training.filter((t) => t.date !== today)
    set({ training: [...others, ...keep, ...fresh] })
    scheduleAutosave()
  },

  addReflection: async (body) => {
    const text = body.trim()
    if (!text) return
    const state = get()
    const entry: LogEntry = { id: uid('lg'), ts: nowIso(), type: 'reflection', body: text }
    await db.log.put(entry)
    // A reflection is a journal line and a sensei signal — it grants no ki and
    // is not an activity signal. Only a completed rep moves focus or the idle
    // clock, so the dojo record is untouched here.
    set({ log: [entry, ...state.log] })
    scheduleAutosave()
  },

  reload: async () => {
    const dojoRows = await db.dojo.toArray()
    const [techniques, training, log] = await Promise.all([
      db.techniques.toArray(),
      db.training.toArray(),
      db.log.orderBy('ts').reverse().toArray(),
    ])
    set({ dojo: dojoRows[0] ?? null, techniques, training, log })
  },

  setSyncIssue: (msg) => set({ syncIssue: msg }),
  setNotice: (msg) => set({ notice: msg }),
  clearReward: () => set({ reward: null }),
  clearRankUp: () => set({ rankUp: null }),
  clearGatePassed: () => set({ gatePassed: null }),
  clearKiBloom: () => set({ kiBloom: null }),
}))
