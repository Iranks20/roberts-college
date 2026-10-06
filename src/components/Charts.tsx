import { useState } from 'react'

/*
  Small single-series charts drawn in SVG with theme tokens.
  Multi-subject comparisons use small multiples (one sparkline per subject) rather than many coloured lines.
*/

type BarDatum = { label: string; value: number; display?: string }
export function BarChart({ data, height = 200, max, unit = '', ariaLabel, highlightLast }: { data: BarDatum[]; height?: number; max?: number; unit?: string; ariaLabel: string; highlightLast?: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600, padL = 44, padB = 28, padT = 16, H = height
  const top = max ?? niceMax(Math.max(...data.map((d) => d.value)))
  const ticks = [0, top / 2, top]
  const bw = (W - padL) / data.length
  const barW = Math.min(44, bw * 0.56)
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / top)
  return (
    <figure className="relative" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="rgb(var(--line))" strokeWidth={1} />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="rgb(var(--muted))" className="num">{fmtTick(t)}{unit}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * bw + (bw - barW) / 2
          const h = Math.max(0, H - padB - y(d.value))
          const strong = highlightLast ? i === data.length - 1 : true
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={padL + i * bw} y={padT} width={bw} height={H - padT - padB} fill="transparent" />
              <path d={roundTop(x, H - padB, barW, h, 4)} fill="rgb(var(--nile))" opacity={hover === null ? (strong ? 1 : 0.45) : hover === i ? 1 : 0.4} />
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="11.5" fill="rgb(var(--muted))">{d.label}</text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[12.5px] font-semibold text-paper shadow-pop"
          style={{ left: `${((padL + hover * bw + bw / 2) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100 - 4}%`, transform: 'translate(-50%,-100%)' }}>
          {data[hover].label}: {data[hover].display ?? `${data[hover].value}${unit}`}
        </div>
      )}
    </figure>
  )
}

export function LineChart({ points, labels, height = 180, min = 0, max = 100, unit = '%', ariaLabel }: { points: number[]; labels: string[]; height?: number; min?: number; max?: number; unit?: string; ariaLabel: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600, padL = 40, padR = 16, padB = 28, padT = 16, H = height
  const x = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, points.length - 1)
  const y = (v: number) => padT + (H - padT - padB) * (1 - (v - min) / (max - min))
  const ticks = [min, (min + max) / 2, max]
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${y(p)}`).join(' ')
  const area = `${path} L${x(points.length - 1)} ${H - padB} L${x(0)} ${H - padB} Z`
  const last = points.length - 1
  return (
    <figure className="relative" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={ariaLabel}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * W
          setHover(Math.max(0, Math.min(last, Math.round(((px - padL) / (W - padL - padR)) * last))))
        }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="rgb(var(--line))" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="rgb(var(--muted))">{t}{unit}</text>
          </g>
        ))}
        <path d={area} fill="rgb(var(--nile) / 0.08)" />
        <path d={path} fill="none" stroke="rgb(var(--nile))" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="rgb(var(--faint))" strokeDasharray="3 3" />}
        <circle cx={x(hover ?? last)} cy={y(points[hover ?? last])} r={5} fill="rgb(var(--nile))" stroke="rgb(var(--surface))" strokeWidth={2} />
        {labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'} fontSize="11.5" fill="rgb(var(--muted))">{l}</text>)}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute rounded-lg bg-ink px-2.5 py-1.5 text-[12.5px] font-semibold text-paper shadow-pop"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(points[hover]) / H) * 100}%`, transform: 'translate(-50%,-130%)' }}>
          {labels[hover]}: {points[hover]}{unit}
        </div>
      )}
    </figure>
  )
}

export function Sparkline({ points, width = 96, height = 28, min, max, label }: { points: number[]; width?: number; height?: number; min?: number; max?: number; label: string }) {
  const lo = min ?? Math.min(...points) - 4, hi = max ?? Math.max(...points) + 4
  const x = (i: number) => 3 + (i * (width - 6)) / (points.length - 1)
  const y = (v: number) => 3 + (height - 6) * (1 - (v - lo) / (hi - lo))
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${y(p)}`).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="shrink-0">
      <path d={d} fill="none" stroke="rgb(var(--nile))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r={3} fill="rgb(var(--nile))" />
    </svg>
  )
}

/** Ring used for single headline percentages (attendance). */
export function Ring({ value, size = 88, label }: { value: number; size?: number; label: string }) {
  const r = size / 2 - 6, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${value}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--sunken))" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--nile))" strokeWidth={8} strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.24} fontWeight={600} fill="rgb(var(--ink))">{value}%</text>
    </svg>
  )
}

function niceMax(v: number) { const p = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v / p) * p }
function fmtTick(v: number) { return v >= 1000 ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : String(v) }
function roundTop(x: number, base: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h, w / 2)
  return `M${x} ${base} V${base - h + rr} Q${x} ${base - h} ${x + rr} ${base - h} H${x + w - rr} Q${x + w} ${base - h} ${x + w} ${base - h + rr} V${base} Z`
}
