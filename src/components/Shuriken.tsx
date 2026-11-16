import { useId } from 'react'

// The brand mark: a four-point shuriken filled with the ki gradient.
export function Shuriken({ size = 22, spin = false }: { size?: number; spin?: boolean }) {
  const id = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{
        filter: 'drop-shadow(0 0 6px rgba(255, 106, 61, 0.45))',
        animation: spin ? 'spin 9s linear infinite' : undefined,
        flexShrink: 0,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffce4a" />
          <stop offset="0.55" stopColor="#ff6a3d" />
          <stop offset="1" stopColor="#d9304f" />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L40 24 L62 32 L40 40 L32 62 L24 40 L2 32 L24 24 Z"
        fill={`url(#${id})`}
      />
      <circle cx="32" cy="32" r="6" fill="#120c0c" />
    </svg>
  )
}
