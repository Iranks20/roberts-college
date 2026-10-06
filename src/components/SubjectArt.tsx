import { cn } from './ui'

/*
  Original cover artwork for each subject, drawn in SVG so it is sharp at any size,
  costs almost nothing to load, and follows the light and dark themes.
*/
type Kind = 'chem' | 'math' | 'eng' | 'bio' | 'phy' | 'econ' | 'ict' | 'geo' | 'lang' | 'gp' | 'hum' | 'sci'
export function subjectKind(subject: string): Kind {
  const s = subject.toLowerCase()
  if (s.includes('chem')) return 'chem'
  if (s.includes('math')) return 'math'
  if (s.includes('biolog')) return 'bio'
  if (s.includes('physic')) return 'phy'
  if (s.includes('econ') || s.includes('business') || s.includes('account')) return 'econ'
  if (s.includes('ict') || s.includes('information') || s.includes('comput')) return 'ict'
  if (s.includes('geog')) return 'geo'
  if (s.includes('french') || s.includes('spanish') || s.includes('chinese') || s.includes('language') && !s.includes('english')) return 'lang'
  if (s.includes('global')) return 'gp'
  if (s.includes('humanit')) return 'hum'
  if (s.includes('science')) return 'sci'
  return 'eng'
}

const palettes: Record<Kind, [string, string, string]> = {
  chem: ['#0f5a4a', '#1f7a64', '#e9a92b'],
  math: ['#24456e', '#2f5d92', '#f2c14e'],
  eng: ['#6b3b2a', '#8a4e37', '#f3d9a4'],
  bio: ['#2f6b2a', '#3f8a37', '#d6ec9a'],
  phy: ['#3a2f6b', '#4d3f8f', '#9fd3ff'],
  econ: ['#6b4f12', '#8f6a1a', '#ffe08a'],
  ict: ['#123c4a', '#1b5869', '#6fe0d0'],
  geo: ['#4a3a1c', '#6b5428', '#b8e0a8'],
  lang: ['#6b1f3a', '#8f2a4e', '#ffc2d6'],
  gp: ['#1d4d6b', '#256691', '#bfe6ff'],
  hum: ['#5a2f12', '#7a421c', '#f0c78a'],
  sci: ['#13513f', '#1c6e56', '#c8f0c0'],
}

function Motif({ k, c }: { k: Kind; c: string }) {
  switch (k) {
    case 'chem': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9">{[[70, 60], [122, 90], [174, 60], [226, 90]].map(([x, y], i) => <polygon key={i} points={hex(x, y, 30)} />)}<line x1="226" y1="60" x2="262" y2="30" /><circle cx="268" cy="25" r="7" fill={c} /></g>
    case 'math': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><path d="M30 130 Q 110 -10 190 90 T 300 40" /><line x1="20" y1="110" x2="300" y2="110" opacity=".5" /><line x1="60" y1="20" x2="60" y2="150" opacity=".5" /><text x="215" y="140" fill={c} stroke="none" fontSize="34" fontFamily="Georgia, serif">∑</text></g>
    case 'eng': return <g fill={c} opacity=".9"><text x="34" y="98" fontSize="78" fontFamily="Georgia, serif" fontStyle="italic">Aa</text>{[60, 78, 96, 114].map((y, i) => <rect key={i} x="160" y={y} width={120 - i * 18} height="6" rx="3" opacity=".7" />)}</g>
    case 'bio': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><ellipse cx="110" cy="80" rx="62" ry="44" /><circle cx="120" cy="78" r="16" fill={c} fillOpacity=".35" /><path d="M210 30 C 240 60, 200 90, 230 120 M240 30 C 270 60, 230 90, 260 120" />{[42, 64, 86, 108].map((y) => <line key={y} x1={216 + (y % 3)} y1={y} x2={250} y2={y} opacity=".6" />)}</g>
    case 'phy': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><circle cx="150" cy="80" r="10" fill={c} /><ellipse cx="150" cy="80" rx="80" ry="28" /><ellipse cx="150" cy="80" rx="80" ry="28" transform="rotate(60 150 80)" /><ellipse cx="150" cy="80" rx="80" ry="28" transform="rotate(-60 150 80)" /></g>
    case 'econ': return <g fill={c} opacity=".9">{[50, 80, 65, 100, 120].map((h, i) => <rect key={i} x={40 + i * 46} y={140 - h} width="28" height={h} rx="4" opacity={0.55 + i * 0.09} />)}<path d="M40 60 L 110 75 L 170 40 L 250 20" stroke={c} strokeWidth="3" fill="none" /></g>
    case 'ict': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><rect x="110" y="45" width="80" height="70" rx="8" /><path d="M30 60 H110 M30 100 H110 M190 60 H270 M190 100 H270 M130 20 V45 M170 20 V45 M130 115 V140 M170 115 V140" />{[[30, 60], [30, 100], [270, 60], [270, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={c} />)}<text x="128" y="90" fill={c} stroke="none" fontSize="22" fontFamily="monospace">{'</>'}</text></g>
    case 'geo': return <g stroke={c} strokeWidth="2.5" fill="none" opacity=".9">{[70, 55, 40, 25].map((r, i) => <ellipse key={i} cx="150" cy="82" rx={r * 1.9} ry={r} />)}<path d="M20 140 L 80 110 L 120 125 L 170 95 L 220 115 L 300 80" strokeWidth="3" /></g>
    case 'lang': return <g fill={c} opacity=".9"><path d="M40 40 h110 a14 14 0 0 1 14 14 v40 a14 14 0 0 1 -14 14 h-70 l-26 22 v-22 h-14 a14 14 0 0 1 -14 -14 v-40 a14 14 0 0 1 14 -14 z" fillOpacity=".5" /><text x="62" y="86" fontSize="30" fontFamily="Georgia, serif">Bonjour</text><text x="190" y="120" fontSize="40">你好</text></g>
    case 'gp': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><circle cx="150" cy="80" r="56" /><ellipse cx="150" cy="80" rx="24" ry="56" /><line x1="94" y1="80" x2="206" y2="80" /><path d="M104 52 H196 M104 108 H196" opacity=".6" /></g>
    case 'hum': return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><path d="M60 130 V60 L150 25 L240 60 V130 Z" />{[85, 125, 165, 205].map((x) => <line key={x} x1={x} y1="70" x2={x} y2="130" />)}<line x1="50" y1="135" x2="250" y2="135" /></g>
    default: return <g stroke={c} strokeWidth="3" fill="none" opacity=".9"><path d="M120 30 V70 L90 130 H210 L180 70 V30" /><line x1="110" y1="30" x2="190" y2="30" /><circle cx="135" cy="110" r="6" fill={c} /><circle cx="165" cy="100" r="4" fill={c} /></g>
  }
}
function hex(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}` }).join(' ')
}

export function SubjectArt({ subject, className, label }: { subject: string; className?: string; label?: boolean }) {
  const k = subjectKind(subject)
  const [a, b, c] = palettes[k]
  const id = `sa-${k}`
  return (
    <svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice" className={cn('block', className)} role="img" aria-label={`${subject} cover`}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect width="300" height="160" fill={`url(#${id})`} />
      <circle cx="270" cy="150" r="70" fill="#fff" opacity=".05" />
      <Motif k={k} c={c} />
      {label && <text x="16" y="148" fill="#fff" fontSize="14" fontWeight="600" fontFamily="Hanken Grotesk, sans-serif" opacity=".9">{subject.replace(' (First Language)', '').replace('Information and Communication Technology', 'ICT')}</text>}
    </svg>
  )
}
