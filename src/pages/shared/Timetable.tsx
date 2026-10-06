import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Video, PlayCircle } from 'lucide-react'
import { Button, Card, LiveBadge, PageHeader, Segmented, Select, cn } from '../../components/ui'
import { days, periods, teacherById, type Slot } from '../../data/school'
import { demoDayIndex, nowMinutes, toMinutes, zoneTime } from '../../lib/format'

const zones = [
  { v: 'Africa/Kampala', l: 'Kampala (EAT)' }, { v: 'Europe/London', l: 'London' }, { v: 'Asia/Dubai', l: 'Dubai' },
  { v: 'Africa/Kigali', l: 'Kigali' }, { v: 'America/Toronto', l: 'Toronto' }, { v: 'Asia/Kolkata', l: 'Mumbai' },
]

export const slotState = (s: Slot) => {
  const today = demoDayIndex()
  const p = periods.find((x) => x.id === s.period)!
  if (s.day < today) return 'past'
  if (s.day > today) return 'future'
  const n = nowMinutes()
  if (n >= toMinutes(p.end)) return 'past'
  if (n >= toMinutes(p.start)) return 'live'
  return 'later'
}

const HOLIDAY_DAY = 4 // Friday 9 October, Independence Day
const subjectShort = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')

export function TimetableView({ slots, viewer, classPath }: { slots: Slot[]; viewer: 'student' | 'teacher' | 'parent'; classPath: string }) {
  const [zone, setZone] = useState('Africa/Kampala')
  const [mode, setMode] = useState<'week' | 'day'>('week')
  const [day, setDay] = useState(demoDayIndex())
  const label = (s: Slot) => (viewer === 'teacher' ? `${s.className} ${subjectShort(s.subject)}` : subjectShort(s.subject))
  const sub = (s: Slot) => (viewer === 'teacher' ? '' : teacherById(s.teacherId).name)

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented value={mode} onChange={setMode} options={[{ value: 'week', label: 'Week' }, { value: 'day', label: 'Day' }]} className="hidden md:inline-flex" />
        <div className="flex items-center gap-2">
          <label htmlFor="tz" className="text-[13.5px] font-medium text-muted">Show times in</label>
          <Select id="tz" value={zone} onChange={(e) => setZone(e.target.value)} className="h-10 w-auto">{zones.map((z) => <option key={z.v} value={z.v}>{z.l}</option>)}</Select>
        </div>
      </div>

      {/* Week grid on wide screens */}
      {mode === 'week' && (
        <Card pad={false} className="scroll-x hidden md:block">
          <table className="w-full min-w-[820px] table-fixed border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className="w-[96px] border-b border-line p-3 text-left text-[12.5px] font-semibold text-muted">Time</th>
                {days.map((d, i) => <th key={d} className={cn('border-b border-l border-line p-3 text-left font-semibold', i === demoDayIndex() ? 'text-nile' : 'text-ink')}>{d}{i === demoDayIndex() && <span className="ml-2 rounded-full bg-nile-tint px-2 py-0.5 text-[11.5px]">Today</span>}{i === HOLIDAY_DAY && <span className="ml-2 rounded-full bg-crane-tint px-2 py-0.5 text-[11.5px] text-crane-ink">Holiday</span>}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id}>
                  <td className="num border-b border-line p-3 align-top font-semibold">{zoneTime(p.start, zone)}<span className="block text-[12px] font-medium text-muted">{zoneTime(p.end, zone)}</span></td>
                  {days.map((_, d) => {
                    if (d === HOLIDAY_DAY) return p.id === 1 ? <td key={d} rowSpan={periods.length} className="border-b border-l border-line bg-sunken/60 p-4 text-center align-middle"><p className="font-semibold text-ink">Independence Day</p><p className="mt-1 text-[12.5px] text-muted">No lessons. Friday work moves to Monday 12 October.</p></td> : null
                    const s = slots.find((x) => x.day === d && x.period === p.id)
                    const st = s ? slotState(s) : null
                    return (
                      <td key={d} className={cn('border-b border-l border-line p-1.5 align-top', d === demoDayIndex() && 'bg-nile-tint/30')}>
                        {s && (
                          <div className={cn('h-full min-h-[64px] rounded-lg p-2.5', st === 'live' ? 'bg-crane-tint ring-1 ring-crane' : 'bg-surface', st === 'past' && 'opacity-60')}>
                            <p className="font-semibold leading-snug text-ink">{label(s)}</p>
                            {sub(s) && <p className="truncate text-[12px] text-muted">{sub(s)}</p>}
                            {st === 'live' && <Link to={classPath} className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-bad px-2 py-0.5 text-[11.5px] font-bold text-white"><Video className="h-3 w-3" /> {viewer === 'teacher' ? 'Start' : 'Join'}</Link>}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Day list: always on phones, optional on desktop */}
      <div className={cn(mode === 'week' && 'md:hidden')}>
        <div className="scroll-x -mx-4 mb-4 px-4">
          <div className="flex min-w-max gap-2">
            {days.map((d, i) => (
              <button key={d} type="button" onClick={() => setDay(i)} className={cn('h-10 rounded-full px-4 text-[14px] font-semibold', day === i ? 'bg-nile text-nile-on' : 'bg-surface text-muted border border-line')}>
                {d.slice(0, 3)}{i === demoDayIndex() && ' · Today'}
              </button>
            ))}
          </div>
        </div>
        <Card pad={false}>
          <ol className="divide-y divide-line">
            {periods.map((p) => {
              const s = day === HOLIDAY_DAY ? undefined : slots.find((x) => x.day === day && x.period === p.id)
              const st = s ? slotState(s) : null
              return (
                <li key={p.id} className={cn('grid grid-cols-[76px_1fr_auto] items-center gap-3 px-4 py-3.5', st === 'live' && 'bg-crane-tint')}>
                  <span className="num text-[14px] font-semibold">{zoneTime(p.start, zone)}<span className="block text-[12px] font-medium text-muted">{zoneTime(p.end, zone)}</span></span>
                  {s ? <span className="min-w-0"><span className="block truncate font-semibold">{label(s)}</span>{sub(s) && <span className="block truncate text-[13px] text-muted">{sub(s)}</span>}</span> : <span className="text-[14px] text-faint">{day === HOLIDAY_DAY ? 'Public holiday' : 'Free period'}</span>}
                  {st === 'live' ? <Button to={classPath} size="sm" variant="danger" icon={<Video className="h-4 w-4" />}>{viewer === 'teacher' ? 'Start' : 'Join'}</Button>
                    : st === 'past' && viewer !== 'teacher' ? <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-muted"><PlayCircle className="h-4 w-4" />Replay</span>
                    : <span />}
                </li>
              )
            })}
          </ol>
        </Card>
      </div>
      <p className="mt-4 text-[13px] text-muted">Breaks are 09:50 to 10:10 and 12:00 to 13:00, Kampala time.</p>
    </>
  )
}

export function TimetablePage({ slots, viewer, classPath, title = 'Timetable', description }: { slots: Slot[]; viewer: 'student' | 'teacher' | 'parent'; classPath: string; title?: string; description?: string }) {
  const live = slots.find((s) => slotState(s) === 'live')
  return (
    <>
      <PageHeader title={title} description={description ?? 'Term 3, week 4. Lessons are on Kampala time unless you choose another time zone.'}
        actions={live ? <Button to={classPath} variant="danger" icon={<Video className="h-4 w-4" />}>{viewer === 'teacher' ? 'Start' : 'Join'} {subjectShort(live.subject)}</Button> : undefined} />
      {live && <div className="mb-4 flex items-center gap-2 text-[14px]"><LiveBadge /> <span className="font-semibold">{live.className} {subjectShort(live.subject)}</span><span className="text-muted">is happening now</span></div>}
      <TimetableView slots={slots} viewer={viewer} classPath={classPath} />
    </>
  )
}
