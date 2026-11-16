// A torii gate built from rects — drop inside any <svg>.
// cx = horizontal center, baseY = ground line, h = gate height.
export function ToriiShape({
  cx,
  baseY,
  h,
  fill,
  opacity = 1,
}: {
  cx: number
  baseY: number
  h: number
  fill: string
  opacity?: number
}) {
  const w = h
  const pw = Math.max(2, h * 0.09)
  return (
    <g fill={fill} opacity={opacity}>
      <rect
        x={cx - w * 0.58}
        y={baseY - h}
        width={w * 1.16}
        height={Math.max(2.5, h * 0.1)}
        rx={Math.max(1, h * 0.02)}
      />
      <rect x={cx - w * 0.44} y={baseY - h * 0.76} width={w * 0.88} height={Math.max(2, h * 0.07)} />
      <rect x={cx - w * 0.42} y={baseY - h * 0.9} width={pw} height={h * 0.9} />
      <rect x={cx + w * 0.42 - pw} y={baseY - h * 0.9} width={pw} height={h * 0.9} />
    </g>
  )
}
