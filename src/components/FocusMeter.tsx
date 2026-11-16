import { useEffect, useRef, useState } from 'react'
import { FOCUS_MAX, FOCUS_TIER_ICON, FOCUS_TIER_LABEL, focusTier } from '../domain/focus'

export function FocusMeter({ focus }: { focus: number }) {
  const [surge, setSurge] = useState(false)
  const prev = useRef(focus)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    if (focus > prev.current) {
      setSurge(true)
      t = setTimeout(() => setSurge(false), 850)
    }
    prev.current = focus
    return () => {
      if (t) clearTimeout(t)
    }
  }, [focus])

  const pct = Math.max(0, Math.min(100, Math.round((focus / FOCUS_MAX) * 100)))
  const tier = focusTier(focus)

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div className="eyebrow">Focus · ki</div>
        <div className="text-sm font-bold">
          <span aria-hidden="true">{FOCUS_TIER_ICON[tier]}</span>{' '}
          <span className="ki-text">
            {FOCUS_TIER_LABEL[tier]} · {pct}
          </span>
        </div>
      </div>
      <div className="focus-track">
        <div className={'focus-fill' + (surge ? ' is-surging' : '')} style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}
