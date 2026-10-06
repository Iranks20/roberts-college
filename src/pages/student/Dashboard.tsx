import { Greeting } from '../../components/Greeting'
import { Link } from 'react-router-dom'
import { Video, ClipboardList, Clock, ArrowUpRight, Megaphone, PlayCircle, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, LiveBadge, Progress, cn } from '../../components/ui'
import { amani, announcements, assignments, courses, periods, teacherById, term, y10Timetable } from '../../data/school'
import { demoDayIndex, fmtDay, relative } from '../../lib/format'
import { slotState } from '../shared/Timetable'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')

export default function StudentDashboard() {
  const today = y10Timetable.filter((s) => s.day === demoDayIndex())
  const live = today.find((s) => slotState(s) === 'live')
  const due = assignments.filter((a) => a.status === 'To do' || a.status === 'Late').sort((a, b) => a.due.localeCompare(b.due))
  const marked = assignments.filter((a) => a.status === 'Marked').slice(0, 3)
  return (
    <>
      <Greeting eyebrow={`Tuesday 6 October · ${term.name}, week ${term.week}`} title={`Good morning, ${amani.name.split(' ')[0]}`} photo="laptopIndoors" />

      {live && (
        <section className="mb-6 flex flex-col gap-4 rounded-panel bg-band p-5 text-on-band sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-ctl bg-on-band/10 sm:flex"><Video className="h-6 w-6" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2"><LiveBadge /><span className="text-[13.5px] opacity-75">Started at 09:00 · ends 09:50</span></div>
              <p className="mt-1.5 font-display text-[24px] leading-tight">{short(live.subject)} with {teacherById(live.teacherId).name}</p>
              <p className="text-[14.5px] opacity-75">Moles and molar mass</p>
            </div>
          </div>
          <Button to="/live/student" variant="gold" size="lg" icon={<Video className="h-5 w-5" />}>Join lesson</Button>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Today’s lessons" action={<Link to="/student/timetable" className="link text-[13.5px]">Full timetable</Link>} />
            <ol className="-mx-2">
              {today.map((s) => {
                const p = periods.find((x) => x.id === s.period)!
                const st = slotState(s)
                return (
                  <li key={s.period} className={cn('grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-ctl px-2 py-2.5', st === 'live' && 'bg-crane-tint')}>
                    <span className={cn('num text-[14px] font-semibold', st === 'past' && 'text-faint')}>{p.start}</span>
                    <span className="min-w-0"><span className={cn('block truncate font-semibold', st === 'past' && 'text-muted')}>{short(s.subject)}</span><span className="block truncate text-[13px] text-muted">{teacherById(s.teacherId).name}</span></span>
                    {st === 'live' ? <Button to="/live/student" size="sm" variant="danger">Join</Button>
                      : st === 'past' ? <Link to="/student/courses/c-math10" className="inline-flex items-center gap-1 text-[13px] font-semibold text-nile"><PlayCircle className="h-4 w-4" />Replay</Link>
                      : <span className="text-[13px] text-muted">{p.start}–{p.end}</span>}
                  </li>
                )
              })}
            </ol>
          </Card>

          <Card>
            <CardHeader title="Due soon" description={`${due.length} pieces of work to do`} action={<Link to="/student/assignments" className="link text-[13.5px]">All homework</Link>} />
            <ul className="divide-y divide-line">
              {due.map((a) => (
                <li key={a.id}>
                  <Link to={a.type === 'Quiz' ? `/student/quiz/${a.id}` : `/student/assignments/${a.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl', a.status === 'Late' ? 'bg-bad-tint text-bad' : 'bg-nile-tint text-nile')}><ClipboardList className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.title}</span><span className="block text-[13px] text-muted">{short(a.subject)} · {a.type}</span></span>
                    {a.status === 'Late' ? <Badge tone="bad">Overdue</Badge> : <span className="flex items-center gap-1 whitespace-nowrap text-[13px] font-medium text-muted"><Clock className="h-3.5 w-3.5" />{fmtDay(a.due)}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="My subjects" action={<Link to="/student/courses" className="link text-[13.5px]">Open</Link>} />
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {courses.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link to={`/student/courses/${c.id}`} className="block">
                    <div className="mb-1.5 flex justify-between gap-2 text-[14px]"><span className="truncate font-semibold">{short(c.subject)}</span><span className="num text-muted">{c.progress}%</span></div>
                    <Progress value={c.progress} label={`${c.subject} course progress`} />
                    <p className="mt-1 truncate text-[12.5px] text-muted">Next: {c.nextTopic}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Recent marks" action={<Link to="/student/grades" className="link text-[13.5px]">Grades</Link>} />
            <ul className="space-y-4">
              {marked.map((a) => {
                const pct = Math.round(((a.mark ?? 0) / a.maxMark) * 100)
                return (
                  <li key={a.id}>
                    <div className="flex items-baseline justify-between gap-3"><Link to={`/student/assignments/${a.id}`} className="min-w-0 truncate font-semibold hover:underline">{a.title}</Link><span className="num shrink-0 font-semibold">{a.mark}/{a.maxMark}</span></div>
                    <p className="text-[13px] text-muted">{short(a.subject)} · {pct}%</p>
                    {a.feedback && <p className="mt-1.5 line-clamp-2 border-l-2 border-crane pl-3 text-[13.5px] text-muted">{a.feedback}</p>}
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Announcements" action={<Link to="/student/announcements" className="link text-[13.5px]">All</Link>} />
            <ul className="space-y-4">
              {announcements.slice(0, 2).map((n) => (
                <li key={n.id} className="flex gap-3">
                  <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-nile" />
                  <div><p className="font-semibold leading-snug">{n.title}</p><p className="text-[13px] text-muted">{n.from} · {relative(n.date)}</p></div>
                </li>
              ))}
            </ul>
          </Card>

          <Link to="/student/tutor" className="card flex items-center gap-4 p-5 transition-colors hover:border-nile">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl bg-crane-tint text-crane-ink"><Sparkles className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><span className="block font-semibold">Revise with the study assistant</span><span className="block text-[13.5px] text-muted">Practice questions on Moles and molar mass</span></span>
            <ArrowUpRight className="h-5 w-5 text-muted" />
          </Link>
        </div>
      </div>
    </>
  )
}
