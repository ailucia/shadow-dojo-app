// The kunoichi who guards your current gate. A pixel-sprite ninja who stands
// at the glowing torii running a combat kata — she is a progress read-out: her
// gi recolours at every rank and she earns a new piece of gear each level, so
// the figure itself tells you how far you've climbed (Novice → Master).
//
// Built on a pixel grid around a local origin: feet at y=0, sprite rising into
// negative y. The outer <g> pins her to the gate; a scale wrapper makes the
// figure read 20% larger without touching the gate scene; an inner group runs
// the CSS combat sequence (see .gate-ninja-body in index.css). Respects
// prefers-reduced-motion (she just stands guard).

const PHASES = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master']

// The gi recolours per rank on a cool→hot ramp (slate → blue → teal → amber →
// crimson): [main, shadow]. This is the guaranteed per-level signal — every
// promotion changes her colour even before you clock the new gear.
const OUTFIT = [
  ['#64748b', '#475569'],
  ['#3f6fb5', '#2c4f85'],
  ['#1d9e75', '#0f6e56'],
  ['#d97a1f', '#a85a10'],
  ['#b3273f', '#8f1f33'],
]

// The ki-aura climbs hard with your title: a steady gold glow at Novice blazing
// out to a wide crimson corona at mastery. Colour, radius, and opacity all rise.
const AURA_COLOR = ['#ffce4a', '#ffd24a', '#ff9b3d', '#ff6a3d', '#d9304f']
const AURA_R = [18, 24, 31, 39, 48]
const AURA_OP = [0.36, 0.44, 0.52, 0.62, 0.74]

// Static pixel palette. Outfit (M/m) and sash (G) are coloured per-rank at draw
// time, so they live in OUTFIT rather than here.
const PX: Record<string, string> = {
  H: '#15100f', // hair (dark)
  h: '#2a1f1c', // hair highlight (curl shading)
  S: '#f0c9a8', // skin
  E: '#1a1010', // eye
  G: '#ffce4a', // gold sash
  L: '#241616', // legs
}

// A slim kunoichi, front-facing, long curly hair worn down. 13 cols × 18 rows.
// No headband — her brow is bare. The G row is the sash, revealed from
// Apprentice up; below that rank those cells fall back to the gi colour.
const SPRITE = [
  '.....HHH.....',
  '....HHHHH....',
  '...HHSSSHH...',
  '...HHSSSHH...',
  '...HHESEHH...',
  '...HHMMMHH...',
  '..HhMMMMMhH..',
  '..HHmMMMmHH..',
  '..HhMMMMMhH..',
  '..HHMGGGMHH..',
  '..hHMMMMMHh..',
  '..HHMMMMMHH..',
  '..h.mMMMm.h..',
  '....mm.mm....',
  '....mm.mm....',
  '....mm.mm....',
  '....LL.LL....',
  '...LLL.LLL...',
]

const CELL = 2
const LEFT_X = -12 // centers col 6 on x=0
const TOP_Y = -36 // row 17 lands feet on y=0

// A fire-elemental blade: a layered flame (deep orange over a yellow-hot core)
// on a bronze guard. Earned at Expert, dual-wielded.
const fireBlade = (dx: number) => (
  <g key={`fire-${dx}`} transform={`translate(${dx} -8)`}>
    <path d="M -2,-1 Q -2.6,-7 -1.1,-9.5 Q -1.6,-12 0,-15.5 Q 1.6,-12 1.1,-9.5 Q 2.6,-7 2,-1 Z" fill="#ff6a1a" />
    <path d="M -1,-1 Q -1.3,-6 -0.3,-8.5 Q -0.7,-11 0,-13.5 Q 0.7,-11 0.3,-8.5 Q 1.3,-6 1,-1 Z" fill="#ffce3a" />
    <rect x="-1.6" y="-1" width="3.2" height="1.4" fill="#b08d57" />
    <rect x="-0.8" y="0.4" width="1.6" height="3" fill="#241616" />
  </g>
)

export function GateNinja({
  cx,
  baseY,
  phase,
  bloom = 0,
}: {
  cx: number
  baseY: number
  phase: string
  bloom?: number // 0..1 Full-Ki afterglow: swells + brightens the aura, fading over days
}) {
  const idx = Math.max(0, PHASES.indexOf(phase))
  const auraId = 'ninja-aura-grad'
  const [mMain, mShade] = OUTFIT[idx]

  // The bloom rides on top of the title aura: a wider, brighter corona right
  // after a Full Ki, decaying back to the baseline glow as `bloom` → 0.
  const b = Math.max(0, Math.min(1, bloom))
  const auraR = AURA_R[idx] * (1 + 0.7 * b)
  const auraOp = Math.min(0.98, AURA_OP[idx] + 0.3 * b)

  // Gear accumulates with rank: each piece unlocks at a threshold and persists.
  const hasSash = idx >= 1
  const hasKunai = idx >= 1
  const hasKatana = idx >= 2
  const hasShuriken = idx >= 2
  const hasFireBlades = idx >= 3
  const hasHawk = idx >= 4

  const cells = SPRITE.flatMap((row, r) =>
    row.split('').map((k, c) => {
      if (k === '.') return null
      let fill: string
      if (k === 'M') fill = mMain
      else if (k === 'm') fill = mShade
      else if (k === 'G') fill = hasSash ? PX.G : mMain
      else fill = PX[k]
      return (
        <rect
          key={`${r}-${c}`}
          x={LEFT_X + c * CELL}
          y={TOP_Y + r * CELL}
          width={CELL + 0.05}
          height={CELL + 0.05}
          fill={fill}
        />
      )
    }),
  )

  return (
    <g transform={`translate(${cx} ${baseY})`}>
      <defs>
        <radialGradient id={auraId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={AURA_COLOR[idx]} stopOpacity={auraOp} />
          <stop offset="60%" stopColor={AURA_COLOR[idx]} stopOpacity={auraOp * 0.4} />
          <stop offset="100%" stopColor={AURA_COLOR[idx]} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* scale wrapper: figure reads 20% larger, feet stay planted at the origin */}
      <g className="gate-ninja" transform="scale(1.2)">
        <circle className="gate-ninja-aura" cx="0" cy="-19" r={auraR} fill={`url(#${auraId})`} />

        <g className="gate-ninja-body" shapeRendering="crispEdges">
          {/* katana slung across the back (drawn first → behind her) */}
          {hasKatana && (
            <g transform="translate(0 -20) rotate(-50)">
              <rect x="-1" y="-13" width="2" height="22" fill="#cfd6dd" />
              <rect x="-1.4" y="7" width="2.8" height="5" fill="#241616" />
              <rect x="-2.6" y="5.5" width="5.2" height="1.8" fill="#ffce4a" />
            </g>
          )}

          {/* the sprite */}
          {cells}

          {/* spinning shuriken thrown to her side */}
          {hasShuriken && (
            <g className="gate-shuriken" transform="translate(12 -20)" fill="#ffce4a">
              <rect x="-1" y="-1" width="2" height="2" />
              <rect x="-1" y="-4" width="2" height="2" />
              <rect x="-1" y="2" width="2" height="2" />
              <rect x="-4" y="-1" width="2" height="2" />
              <rect x="2" y="-1" width="2" height="2" />
            </g>
          )}

          {/* ring-pommel kunai worn at the hip — her first weapon */}
          {hasKunai && (
            <g transform="translate(6 -5)">
              <rect x="-0.6" y="0" width="1.2" height="4.5" fill="#cfd6dd" />
              <rect x="-1.3" y="-0.6" width="2.6" height="1" fill="#b08d57" />
              <rect x="-0.5" y="-3" width="1" height="2.4" fill="#241616" />
              <circle cx="0" cy="-3.7" r="1" fill="none" stroke="#241616" strokeWidth="0.7" />
            </g>
          )}

          {/* twin fire blades, raised at both sides */}
          {hasFireBlades && [fireBlade(-9), fireBlade(9)]}

          {/* a hawk circling at her shoulder — the master's companion */}
          {hasHawk && (
            <g transform="translate(-14 -33)">
              <polygon points="0,0 -6,-3 -5,-1 -1,0.2" fill="#6b4a2a" />
              <polygon points="0,0 6,-3 5,-1 1,0.2" fill="#6b4a2a" />
              <rect x="-0.9" y="-1" width="1.8" height="4" fill="#4a3319" />
              <circle cx="0" cy="-1.6" r="1" fill="#4a3319" />
              <polygon points="0,3 -1.2,5 1.2,5" fill="#6b4a2a" />
              <polygon points="0,-2.2 1.6,-1.6 0,-1" fill="#e0a020" />
            </g>
          )}
        </g>
      </g>
    </g>
  )
}
