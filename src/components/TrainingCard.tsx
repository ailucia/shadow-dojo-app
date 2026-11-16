import { useState } from 'react'
import type { MouseEvent } from 'react'
import type { Training } from '../types'
import { TECHNIQUE_ICON, TECHNIQUE_LABEL } from '../domain/content/techniques'
import { KIND_ICON } from '../domain/content/icons'

export function TrainingCard({
  item,
  onComplete,
  onUndo,
  spotlight = false,
}: {
  item: Training
  onComplete: (id: string, origin: { x: number; y: number }) => void
  onUndo: (id: string) => void
  spotlight?: boolean
}) {
  const [justDone, setJustDone] = useState(false)
  const done = item.status === 'done'

  function handle(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setJustDone(true)
    onComplete(item.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  function handleUndo() {
    setJustDone(false)
    onUndo(item.id)
  }

  return (
    <div
      className={
        'train-card p-4 flex items-start gap-3' +
        (done ? ' is-done' : '') +
        (justDone ? ' just-done' : '') +
        (spotlight ? ' now-card' : '')
      }
    >
      <div className="kind-icon" aria-hidden="true">
        {KIND_ICON[item.kind]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="train-title font-bold">{item.title}</span>
          {item.source === 'sensei' && <span className="chip chip-sensei">🥋 sensei</span>}
          {item.techniqueKey && (
            <span className="chip">
              {TECHNIQUE_ICON[item.techniqueKey]} {TECHNIQUE_LABEL[item.techniqueKey]}
            </span>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--ink-dim)' }}>
          {item.detail}
        </p>
        <div className="text-xs mt-2" style={{ color: 'var(--ink-faint)' }}>
          +{item.xp} XP · +{item.focusReward} focus
        </div>
      </div>
      {done ? (
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold gold-text">Done ✓</span>
          <button className="btn btn-ghost btn-sm" onClick={handleUndo} title="Take it back — no harm done">
            ↶ Undo
          </button>
        </div>
      ) : (
        <button className="btn btn-primary btn-sm" onClick={handle}>
          Train
        </button>
      )}
    </div>
  )
}
