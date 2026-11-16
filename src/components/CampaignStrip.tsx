import { useState } from 'react'
import { useDojo } from '../store/dojo'
import { currentGateIndex, gatesOf, hasCampaign, isBossGate, PHASE_LABEL } from '../domain/content/campaign'
import { ToriiShape } from './torii'
import { GateNinja } from './GateNinja'
import { GatePassOverlay } from './GatePassOverlay'
import { titleForXp } from '../domain/titles'
import { daysBetween, kiBloomIntensity } from '../domain/focus'
import { todayStr } from '../lib/date'

const VIEW_W = 720
const MAX_SLOT_W = 72
const GROUND_Y = 120

// A gold 5-pointed star (the finale crown), centred on its own origin.
const STAR_PATH =
  'M0,-6 L1.35,-1.86 L5.71,-1.85 L2.19,0.71 L3.53,4.85 L0,2.3 L-3.53,4.85 L-2.19,0.71 L-5.71,-1.85 L-1.35,-1.86 Z'
// Angles for the finale's rotating sunburst.
const RAY_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

// Linear interpolate between two #rrggbb colours.
function lerpHex(a: string, b: string, t: number): string {
  const ca = parseInt(a.slice(1), 16)
  const cb = parseInt(b.slice(1), 16)
  const m = (sh: number) => {
    const x = Math.round(((ca >> sh) & 255) + (((cb >> sh) & 255) - ((ca >> sh) & 255)) * t)
    return x.toString(16).padStart(2, '0')
  }
  return `#${m(16)}${m(8)}${m(0)}`
}

// The campaign as a trail of torii gates that grow toward the horizon — as many
// as the user's strategy needs. Passed gates burn gold behind you; the current
// gate glows like an ember. Passing plays a through-the-gate fanfare. Gates move
// on readiness, never the calendar.
export function CampaignStrip() {
  const dojo = useDojo((s) => s.dojo)!
  const advanceGate = useDojo((s) => s.advanceGate)
  const toggleMilestone = useDojo((s) => s.toggleMilestone)
  const gates = gatesOf(dojo)
  const planned = hasCampaign(dojo)
  const n = gates.length
  const current = currentGateIndex(dojo)
  const phase = titleForXp(dojo.titleXp).name
  const bloom = kiBloomIntensity(dojo.kiBloomDate, todayStr())
  const [peek, setPeek] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  // Gates spread evenly, centred, at most MAX_SLOT_W apart.
  const slotW = n > 1 ? Math.min(MAX_SLOT_W, (VIEW_W - 72) / (n - 1)) : 0
  const startX = VIEW_W / 2 - ((n - 1) * slotW) / 2
  const slotX = (i: number) => startX + i * slotW
  const progress = (i: number) => (n > 1 ? i / (n - 1) : 1)
  const isFinal = (i: number) => n > 1 && i === n - 1
  // Gates grow as the campaign advances; the final gate towers over the rest.
  const displayHeight = (i: number) => 36 + progress(i) * 63 + (isFinal(i) ? 16 : 0)

  // Honest clock, only when the strategy set dates: which gate the dates say
  // you'd be at, and how many days are left to the final one.
  const today = todayStr()
  const campaignDay = daysBetween(dojo.campaignStartDate ?? dojo.createdAt.slice(0, 10), today)
  const dated = gates.some((g) => g.targetDate)
  const expected = dated ? Math.min(gates.filter((g) => g.targetDate && g.targetDate < today).length, n - 1) : current
  const paceGap = expected - current
  const finalDate = gates[n - 1]?.targetDate
  const daysLeft = finalDate ? daysBetween(today, finalDate) : null

  const doneFor = (i: number) => dojo.milestonesDone?.[gates[i].id] ?? []
  const shown = peek ?? current

  async function copyReflect() {
    const g = gates[current]
    const prompt = [
      'Sensei — weekly reflect.',
      `Run prompts/reflect.md with me: what worked this week, what didn't, and what to change next week.`,
      `Then make the gate call for gate ${current + 1} of ${n} (${g.name}): pass, stay, or re-plan.`,
      `My milestone checkmarks: ${doneFor(current).length}/${g.milestones.length} (state in dojo.milestonesDone).`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  function gateFill(i: number): string {
    if (i === current) return 'var(--ki-2)'
    if (i < current) return 'var(--gold)'
    // future gates warm from bronze toward gold as the prize nears
    return lerpHex('#7a4a28', '#ffce4a', progress(i))
  }

  // A glow that escalates toward the end — the path ahead looks more inviting
  // and the final gate blazes like a reward. The current gate keeps its ember.
  function gateGlow(i: number): string {
    if (i === current) return 'drop-shadow(0 0 11px rgba(255, 106, 61, 0.7))'
    const k = 1 + progress(i) * 9
    return `drop-shadow(0 0 ${2 + k * 1.2}px rgba(255, 206, 74, ${0.1 + k * 0.04}))`
  }

  function renderDetail() {
    const g = gates[shown]
    const isCurrent = shown === current
    const checks = doneFor(shown)
    const boss = isBossGate(g)
    return (
      <div className={'panel-raised p-4' + (isCurrent ? ' now-card' : '')} style={boss ? { borderColor: 'var(--gold-dim)' } : undefined}>
        <button
          className="flex items-center justify-between gap-2 w-full"
          style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textAlign: 'left', cursor: isCurrent ? 'default' : 'pointer' }}
          onClick={() => {
            if (!isCurrent) setPeek(null)
          }}
        >
          <span className="font-bold">
            {boss && '⚔️ '}Gate {shown + 1} · {g.name}
            {isCurrent && <span style={{ color: 'var(--ki-2)' }}> — you are here</span>}
          </span>
          <span className="flex gap-2 items-center">
            {planned && <span className="chip">{PHASE_LABEL[g.phase]}</span>}
            {boss && <span className="chip chip-boss">boss gate</span>}
            {!isCurrent && <span className="chip">{shown < current ? 'passed · tap to close' : 'peeking · tap to close'}</span>}
          </span>
        </button>
        <p className="text-sm mt-1 mb-2" style={{ color: 'var(--ink-dim)' }}>
          {g.focus}
          {g.targetDate && <span style={{ color: 'var(--ink-faint)' }}> · aim: {g.targetDate}</span>}
        </p>
        <div className="grid gap-1">
          {g.milestones.map((m, i) => {
            const checked = checks.includes(i)
            const box = <span className={'ms-box' + (checked ? ' is-done' : '')}>{checked ? '✓' : ''}</span>
            const label = <span className={checked ? 'ms-done-text' : ''}>{m}</span>
            return isCurrent && planned ? (
              <button key={m} className="ms-row" onClick={() => void toggleMilestone(g.id, i)}>
                {box}
                {label}
              </button>
            ) : (
              <div key={m} className="ms-row" style={{ cursor: 'default' }}>
                {box}
                {label}
              </div>
            )
          })}
        </div>
        {isCurrent && planned && (
          <div className="text-xs mt-2" style={{ color: 'var(--ink-faint)' }}>
            {checks.length}/{g.milestones.length} landed — evidence for your next /reflect, not homework
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="panel p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="eyebrow">⛩️ Your campaign · {planned ? `${n} gates, flexible by design` : 'not planned yet'}</div>
          <div className="text-sm" style={{ color: 'var(--ink-dim)' }}>
            {planned
              ? dojo.campaign!.strategy
              : 'Run /initiate with your sensei: it turns your strategy into gates.'}
          </div>
        </div>
        {planned && (
          <div className="flex gap-2 week-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => void copyReflect()}>
              {copied ? 'Copied ✓' : '📋 Reflect'}
            </button>
            {current < n - 1 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setPeek(null)
                  void advanceGate()
                }}
                title="A readiness call, not a calendar one — your sensei can also do this at /reflect"
              >
                Pass gate → {gates[current + 1].name}
              </button>
            )}
          </div>
        )}
      </div>

      {paceGap > 0 && (
        <div className="flex items-center justify-between gap-2 flex-wrap mt-3">
          <div className="text-sm" style={{ color: 'var(--ink-dim)' }}>
            <span style={{ color: 'var(--ki-2)', fontWeight: 600 }}>day {campaignDay} of your search</span>
            {' · your dates say '}
            <span style={{ color: 'var(--ink-faint)' }}>gate {expected + 1}</span>
            {" · you're at "}
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>gate {current + 1}</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--ki-2)', border: '1px solid var(--ki-2)', borderRadius: 999, padding: '2px 10px' }}>
            {paceGap} {paceGap === 1 ? 'gate' : 'gates'} behind your dates
          </span>
        </div>
      )}

      <svg viewBox={`0 -68 ${VIEW_W} 214`} className="mt-3 mb-3" style={{ width: '100%', display: 'block' }}>
        {paceGap > 0 && (
          <rect x={slotX(current)} y={-34} width={slotX(expected) - slotX(current)} height={GROUND_Y + 34} fill="rgba(255, 106, 61, 0.07)" />
        )}
        <line x1="0" y1={GROUND_Y} x2={VIEW_W} y2={GROUND_Y} stroke="var(--line)" strokeWidth="1.5" />
        {gates.map((g, i) => {
          const past = i < current
          const cur = i === current
          const final = isFinal(i)
          const h = displayHeight(i)
          const topY = GROUND_Y - h
          const x = slotX(i)
          return (
            <g key={g.id} onClick={() => setPeek(i === current || peek === i ? null : i)} style={{ cursor: 'pointer' }}>
              <title>{`Gate ${i + 1} · ${g.name}${cur ? ' — you are here' : past ? ' — passed' : final ? ' — the finale' : ''}`}</title>
              <rect x={x - 34} y={2} width="68" height="140" fill="transparent" />
              {final && (
                <g transform={`translate(${x} ${topY - 2})`}>
                  <g className="final-rays">
                    {RAY_ANGLES.map((a) => (
                      <line key={a} x1="0" y1="0" x2="0" y2="-22" stroke="var(--gold)" strokeWidth="1.2" opacity="0.16" transform={`rotate(${a})`} />
                    ))}
                  </g>
                </g>
              )}
              <g className={final ? 'final-gate-glow' : undefined} style={final ? undefined : { filter: gateGlow(i) }}>
                <ToriiShape cx={x} baseY={GROUND_Y} h={h} fill={gateFill(i)} />
                {isBossGate(g) && (
                  <g>
                    <line x1={x} y1={topY + 4} x2={x} y2={topY + 11} stroke="var(--gold-dim)" strokeWidth="1" />
                    <rect x={x - 4} y={topY + 11} width="8" height="11" rx="3" fill="#ff6a3d" stroke="var(--gold)" strokeWidth="0.8" />
                    <rect x={x - 2.4} y={topY + 9.5} width="4.8" height="2" rx="1" fill="var(--gold)" />
                  </g>
                )}
              </g>
              {final && (
                <g className="final-star" transform={`translate(${x} ${topY - 12})`}>
                  <path d={STAR_PATH} fill="var(--gold)" />
                </g>
              )}
              <text
                x={x}
                y={GROUND_Y + 17}
                textAnchor="middle"
                fontSize="11"
                fontWeight={cur ? 800 : 600}
                fill={cur ? 'var(--ki-2)' : past ? 'var(--gold)' : peek === i ? 'var(--calm)' : 'var(--ink-faint)'}
              >
                {past ? '✓' : i + 1}
              </text>
              {peek === i && <rect x={x - 12} y={GROUND_Y + 21} width="24" height="2" rx="1" fill="var(--calm)" />}
            </g>
          )
        })}
        {paceGap > 0 && daysLeft !== null && (
          <g>
            <line x1={slotX(expected)} y1={-46} x2={slotX(expected)} y2={GROUND_Y} stroke="var(--ki-2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={slotX(expected)} y={-52} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ki-2)">
              {daysLeft} days to your target date
            </text>
          </g>
        )}
        <GateNinja cx={slotX(current)} baseY={GROUND_Y} phase={phase} bloom={bloom} />
      </svg>

      {planned && current === n - 1 && n > 1 && (
        <p className="text-sm mb-3 gold-text">The final gate. Land it — and the campaign is yours.</p>
      )}

      {renderDetail()}
      <GatePassOverlay />
    </section>
  )
}
