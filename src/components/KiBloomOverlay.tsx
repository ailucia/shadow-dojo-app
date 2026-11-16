import { useDojo } from '../store/dojo'
import { Shuriken } from './Shuriken'

// Full-screen ritual when your ki hits the very top. A peak, not a plateau —
// it pays out, then the bar resets low so the climb is worth making again.
export function KiBloomOverlay() {
  const kiBloom = useDojo((s) => s.kiBloom)
  const clear = useDojo((s) => s.clearKiBloom)
  if (!kiBloom) return null
  return (
    <div className="fanfare" onClick={clear}>
      <div className="fanfare-rays" />
      <div className="fanfare-card">
        <div className="flex justify-center mb-3">
          <Shuriken size={64} spin />
        </div>
        <div className="eyebrow gold-text">Full Ki</div>
        <div className="display ki-text-bright" style={{ fontSize: '3.4rem', margin: '0.4rem 0' }}>
          +{kiBloom.xp} XP
        </div>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 360, margin: '0 auto 1.2rem' }}>
          You burned all the way to the top. The aura's yours for a few days — then it fades.
          Your ki resets low on purpose: climb it again.
        </p>
        <button className="btn btn-primary" onClick={clear}>
          Back to the dojo
        </button>
      </div>
    </div>
  )
}
