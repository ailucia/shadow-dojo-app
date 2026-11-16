import { useState } from 'react'
import { useDojo } from '../../store/dojo'
import { FocusMeter } from '../../components/FocusMeter'
import { TrainingCard } from '../../components/TrainingCard'
import { titleProgress } from '../../domain/titles'
import { currentGate, currentGateIndex, gatesOf, hasCampaign } from '../../domain/content/campaign'
import { CampaignStrip } from '../../components/CampaignStrip'
import { daysBetween } from '../../domain/focus'
import { todayStr } from '../../lib/date'

const LOG_ICON: Record<string, string> = {
  event: '⚡',
  reflection: '🖋️',
  sensei: '🥋',
  milestone: '🏮',
}

export function Dojo() {
  const dojo = useDojo((s) => s.dojo)!
  const training = useDojo((s) => s.training)
  const log = useDojo((s) => s.log)
  const reentryMsg = useDojo((s) => s.reentryMsg)
  const complete = useDojo((s) => s.completeTraining)
  const undo = useDojo((s) => s.undoTraining)
  const regenerate = useDojo((s) => s.regenerateTraining)
  const addReflection = useDojo((s) => s.addReflection)
  const [reflection, setReflection] = useState('')
  const [briefingCopied, setBriefingCopied] = useState(false)

  const day = todayStr()
  const todays = training
    .filter((t) => t.date === day)
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  const pending = todays.filter((t) => t.status === 'pending')
  const done = todays.filter((t) => t.status === 'done')
  const nowItem = pending[0] ?? null
  const upNext = pending.slice(1)
  const tp = titleProgress(dojo.titleXp)
  const gate = currentGate(dojo)
  const gateCount = gatesOf(dojo).length
  const planned = hasCampaign(dojo)
  const allDone = todays.length > 0 && pending.length === 0
  const dayPct = todays.length ? Math.round((done.length / todays.length) * 100) : 0
  const campaignStart = dojo.campaignStartDate ?? dojo.createdAt.slice(0, 10)
  // "Day N of your search" counts the story so far — never a deadline.
  const campaignDay = daysBetween(campaignStart, day) + 1
  const campaignSince = new Date(campaignStart + 'T00:00:00')
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  function logReflection() {
    void addReflection(reflection)
    setReflection('')
  }

  async function copyBriefing() {
    const prompt = [
      'Sensei — kata.',
      'Run prompts/kata.md: check my calendar, inbox and pipeline, check in with me,',
      `then write today's training into my/shadow-dojo.json — a full training day`,
      `(~${dojo.dailyTarget ?? 7} goal-defined reps), tiny first strike, no time boxes.`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(prompt)
      setBriefingCopied(true)
      setTimeout(() => setBriefingCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="grid gap-5">
      {/* hero */}
      <section className="panel p-6">
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="emblem" aria-hidden="true">
              🥷
            </div>
            <div className="min-w-0">
              <div className="eyebrow mb-1" title={`Started ${campaignSince} — the clock is honest, not a deadline`}>
                ⛩️ <span style={{ color: 'var(--ki-2)', fontWeight: 600 }}>Day {campaignDay} of your search</span>
                {' · '}
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {planned ? `Gate ${currentGateIndex(dojo) + 1} of ${gateCount}` : 'Campaign not planned yet'}
                </span>
                {' · '}{gate.name}
              </div>
              <h1 className="display text-3xl">
                Welcome back, <span className="ki-text">{dojo.ninjaName}</span>.
              </h1>
              <div className="text-sm mt-1" style={{ color: 'var(--ink-dim)' }}>
                {tp.current.name}
                {tp.next ? ` · ${tp.pct}% to ${tp.next.name}` : ' · top rank'} — path:{' '}
                {dojo.path || <span style={{ color: 'var(--ink-faint)' }}>not set yet, run /initiate</span>}
              </div>
            </div>
          </div>
          <div className="flex-1" style={{ minWidth: 240, maxWidth: 360 }}>
            <FocusMeter focus={dojo.focus} />
          </div>
        </div>
        {reentryMsg && (
          <div className="mt-4 p-3 panel-raised" style={{ borderColor: 'var(--calm-dim)' }}>
            <span className="text-sm" style={{ color: 'var(--calm)' }}>
              ↩ {reentryMsg}
            </span>
          </div>
        )}
      </section>

      {/* the campaign: gates from your strategy */}
      <CampaignStrip />

      {/* today's training */}
      <section className="panel p-6">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <div className="eyebrow">⚔️ Today's training</div>
            <div className="text-sm" style={{ color: 'var(--ink-dim)' }}>
              {allDone
                ? 'Regimen complete. Anything more today is pure bonus.'
                : `${done.length} of ${todays.length} reps landed · the goal defines the rep`}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => void copyBriefing()}>
              {briefingCopied ? 'Copied ✓' : '☀️ Kata'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => void regenerate()}>
              ↻ New regimen
            </button>
          </div>
        </div>
        <div className="day-track mb-4" aria-hidden="true">
          <div className="day-fill" style={{ width: dayPct + '%' }} />
        </div>
        {todays.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>No training yet today.</p>}
        {nowItem && (
          <div className="mb-3">
            <div className="eyebrow mb-2" style={{ color: 'var(--ki-2)' }}>
              ▶ Strike now — just this one
            </div>
            <TrainingCard item={nowItem} onComplete={complete} onUndo={undo} spotlight />
          </div>
        )}
        {upNext.length > 0 && (
          <>
            <div className="eyebrow mb-2">On deck · {upNext.length}</div>
            <div className="grid gap-3 mb-3">
              {upNext.map((t) => (
                <TrainingCard key={t.id} item={t} onComplete={complete} onUndo={undo} />
              ))}
            </div>
          </>
        )}
        {done.length > 0 && (
          <>
            <div className="eyebrow mb-2 gold-text">Landed · {done.length}</div>
            <div className="grid gap-3">
              {done.map((t) => (
                <TrainingCard key={t.id} item={t} onComplete={complete} onUndo={undo} />
              ))}
            </div>
          </>
        )}
        {allDone && (
          <div className="mt-4 text-sm gold-text">🏮 You showed up today. That's the whole game.</div>
        )}
      </section>

      {/* quick reflection + log peek */}
      <section className="panel p-6">
        <div className="eyebrow mb-3">📜 Training log</div>
        <div className="flex gap-2 mb-3">
          <input
            className="field"
            placeholder="One line for the log…"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') logReflection()
            }}
          />
          <button className="btn btn-primary btn-sm" onClick={logReflection}>
            Log
          </button>
        </div>
        <div className="grid gap-2 scroll-thin" style={{ maxHeight: 220, overflowY: 'auto' }}>
          {log.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
              Your story starts here.
            </p>
          )}
          {log.slice(0, 8).map((e) => (
            <div
              key={e.id}
              className="text-sm"
              style={{ color: e.type === 'reflection' ? 'var(--ink)' : 'var(--ink-dim)' }}
            >
              <span style={{ color: 'var(--ink-faint)' }}>{LOG_ICON[e.type] ?? '·'} </span>
              {e.body}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
