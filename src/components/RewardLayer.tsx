import { useEffect } from 'react'
import { useDojo } from '../store/dojo'
import { TECHNIQUE_LABEL } from '../domain/content/techniques'

// Renders the reward beat at the click origin: a burst ring + floating XP.
export function RewardLayer() {
  const reward = useDojo((s) => s.reward)
  const clearReward = useDojo((s) => s.clearReward)

  useEffect(() => {
    if (!reward) return
    const t = setTimeout(() => clearReward(), 1100)
    return () => clearTimeout(t)
  }, [reward, clearReward])

  if (!reward) return null
  return (
    <div key={reward.nonce}>
      <div className="burst-ring" style={{ left: reward.x - 7, top: reward.y - 7 }} />
      <div className="xp-float" style={{ position: 'fixed', zIndex: 61, left: reward.x + 12, top: reward.y - 16 }}>
        +{reward.xp} XP
      </div>
      {reward.techniqueKey && (
        <div
          className="xp-float"
          style={{ position: 'fixed', zIndex: 61, left: reward.x + 12, top: reward.y + 6, color: 'var(--calm)' }}
        >
          {TECHNIQUE_LABEL[reward.techniqueKey]} ↑
        </div>
      )}
    </div>
  )
}
