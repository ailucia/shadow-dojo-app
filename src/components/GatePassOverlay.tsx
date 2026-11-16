import { useDojo } from '../store/dojo'
import { ToriiShape } from './torii'

// Full-screen "pass through the gate" fanfare when the campaign advances.
// Excitement on the upside — passing a gate is a readiness call you earned.
export function GatePassOverlay() {
  const gate = useDojo((s) => s.gatePassed)
  const clear = useDojo((s) => s.clearGatePassed)
  if (!gate) return null
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
        aria-labelledby="gate-passed-title"
      >
        <div className="flex justify-center mb-3">
          <svg
            width="120"
            height="104"
            viewBox="0 0 120 104"
            aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 16px rgba(255, 206, 74, 0.55))' }}
          >
            <ToriiShape cx={60} baseY={100} h={92} fill="var(--gold)" />
          </svg>
        </div>
        <div className="eyebrow gold-text">Gate passed</div>
        <div
          id="gate-passed-title"
          className="display ki-text-bright"
          style={{ fontSize: '3rem', margin: '0.4rem 0' }}
        >
          Gate {gate.gateNumber} of {gate.total}
        </div>
        <p style={{ color: 'var(--ink-dim)', maxWidth: 380, margin: '0 auto 1.2rem' }}>
          {gate.name} begins. Passed on readiness, not the calendar.
        </p>
        <button className="btn btn-primary" onClick={clear}>
          Walk on →
        </button>
      </div>
    </div>
  )
}
