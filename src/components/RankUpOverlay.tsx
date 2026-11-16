import { useDojo } from '../store/dojo'
import { Shuriken } from './Shuriken'

// Full-screen fanfare when your title rises. Excitement on the upside.
export function RankUpOverlay() {
  const rankUp = useDojo((s) => s.rankUp)
  const clear = useDojo((s) => s.clearRankUp)
  if (!rankUp) return null
  return (
    <div className="fanfare" onClick={clear}>
      <div className="fanfare-rays" />
      <div className="fanfare-card">
        <div className="flex justify-center mb-3">
          <Shuriken size={64} spin />
        </div>
        <div className="eyebrow gold-text">Rank up</div>
        <div className="display ki-text" style={{ fontSize: '3.4rem', margin: '0.4rem 0' }}>
          {rankUp.title}
        </div>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 360, margin: '0 auto 1.2rem' }}>
          Your training earned this. The title comes from showing up — outcomes are just weather.
        </p>
        <button className="btn btn-primary" onClick={clear}>
          Back to the dojo
        </button>
      </div>
    </div>
  )
}
