import { DEMO_NOW, SCHOOL_TZ } from '../data/school'

export const usd = (n: number) => `USD ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
const toDate = (d: string | Date) => (typeof d === 'string' ? new Date(d.length === 10 ? `${d}T12:00:00+03:00` : d.includes('+') || d.endsWith('Z') ? d : `${d}+03:00`) : d)

export const fmtDate = (d: string | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  toDate(d).toLocaleDateString('en-GB', { timeZone: SCHOOL_TZ, ...opts })
export const fmtDay = (d: string | Date) => fmtDate(d, { weekday: 'short', day: 'numeric', month: 'short' })
export const fmtTime = (d: string | Date) => toDate(d).toLocaleTimeString('en-GB', { timeZone: SCHOOL_TZ, hour: '2-digit', minute: '2-digit' })
export const fmtDateTime = (d: string | Date) => `${fmtDay(d)}, ${fmtTime(d)}`

/** "in 2 days", "3 hours ago" relative to the prototype's fixed clock. */
export function relative(d: string | Date) {
  const diff = toDate(d).getTime() - DEMO_NOW.getTime()
  const abs = Math.abs(diff), min = 60000, hr = 60 * min, day = 24 * hr
  const say = (n: number, u: string) => `${n} ${u}${n === 1 ? '' : 's'}`
  const v = abs < hr ? say(Math.max(1, Math.round(abs / min)), 'minute') : abs < day ? say(Math.round(abs / hr), 'hour') : say(Math.round(abs / day), 'day')
  return diff >= 0 ? `in ${v}` : `${v} ago`
}

/** Convert a Kampala wall-clock time on the demo date into another time zone. */
export function zoneTime(hhmm: string, tz: string) {
  const d = new Date(`2026-10-06T${hhmm}:00+03:00`)
  return d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
}
export const nowMinutes = () => {
  const t = fmtTime(DEMO_NOW).split(':').map(Number)
  return t[0] * 60 + t[1]
}
export const toMinutes = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
export const demoDayIndex = () => (DEMO_NOW.getUTCDay() + 6) % 7 // Monday = 0
