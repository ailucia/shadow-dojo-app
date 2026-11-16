import { useDojo } from '../store/dojo'
import { Shuriken } from './Shuriken'
import { TITLES } from '../domain/titles'

const TITLE_UPGRADES: Record<string, string> = {
  Novice: 'Slate gi with a soft gold aura.',
  Apprentice: 'Blue gi, gold sash, and kunai; the aura grows brighter.',
  Adept: 'Teal gi, katana, and spinning shuriken; a stronger orange aura.',
  Expert: 'Amber gi and twin fire blades; a wider vermilion aura.',
  Master: 'Crimson gi and a hawk companion; the largest, brightest crimson aura.',
}

// Full-screen fanfare when your title rises. Excitement on the upside.
export function RankUpOverlay() {
  const rankUp = useDojo((s) => s.rankUp)
  const clear = useDojo((s) => s.clearRankUp)
  if (!rankUp) return null
  return (
    <div
      className="fanfare"
      onClick={(event) => {
        if (event.target === event.currentTarget) clear()
      }}
    >
      <div className="fanfare-rays" />
      <div
        className="fanfare-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rank-up-title"
      >
        <div className="flex justify-center mb-3">
          <Shuriken size={64} spin />
        </div>
        <div className="eyebrow gold-text">Rank up</div>
        <div
          id="rank-up-title"
          className="display ki-text-bright"
          style={{ fontSize: '3.4rem', margin: '0.4rem 0' }}
        >
          {rankUp.title}
        </div>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 390, margin: '0 auto 1.2rem' }}>
          Your training unlocked this rank. Your outfit and aura change at every level, with new gear along the way.
        </p>
        <section className="rank-up-rewards" aria-label="Upgrades at each rank">
          <h2 className="eyebrow gold-text">The rank ladder</h2>
          <ol className="rank-up-ladder">
            {TITLES.map((tier) => {
              const unlockedNow = tier.name === rankUp.title
              return (
                <li
                  key={tier.name}
                  className={`rank-up-tier${unlockedNow ? ' is-current' : ''}`}
                  aria-current={unlockedNow ? 'step' : undefined}
                >
                  <div className="rank-up-tier-label">
                    <span className="rank-up-tier-name">{tier.name}</span>
                    <span className="rank-up-tier-xp">
                      {tier.minXp === 0 ? 'Starting rank' : `${tier.minXp} XP`}
                    </span>
                  </div>
                  <span className="rank-up-tier-reward">{TITLE_UPGRADES[tier.name]}</span>
                  {unlockedNow && <span className="rank-up-unlocked">Unlocked now</span>}
                </li>
              )
            })}
          </ol>
        </section>
        <button className="btn btn-primary" onClick={clear}>
          Back to the dojo
        </button>
      </div>
    </div>
  )
}
