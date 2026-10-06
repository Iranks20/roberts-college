import { Greeting } from '../../components/Greeting'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Video, Wallet, FileCheck2, MessageSquare, Bell, Receipt, Download, CheckCircle2, CalendarClock } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, LiveBadge, Modal, Notice, PageHeader, Progress, Segmented, Tabs, cn, useToast } from '../../components/ui'
import { Ring, Sparkline } from '../../components/Charts'
import { PaymentPanel } from '../../components/Payment'
import { absences, amani, amaniGrades, announcements, assignments, daniel, danielGrades, invoices, levelOfYear, payments, periods, reportCards, teacherById, y10Timetable, y6Timetable, type Student } from '../../data/school'
import { demoDayIndex, fmtDate, fmtDay, relative, usd } from '../../lib/format'
import { StatusBadge } from '../student/Learning'
import { ReportCardDoc } from '../shared/ReportCard'
import { slotState } from '../shared/Timetable'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')
const kids = [amani, daniel]
const gradesOf = (s: Student) => (s.id === 's-amani' ? amaniGrades : danielGrades)
const ttOf = (s: Student) => (s.id === 's-amani' ? y10Timetable : y6Timetable)
const invOf = (s: Student) => invoices.find((i) => i.studentId === s.id)!
const avgOf = (s: Student) => Math.round(gradesOf(s).reduce((a, g) => a + g.overall, 0) / gradesOf(s).length)

function NowLine({ s }: { s: Student }) {
  const live = ttOf(s).find((x) => x.day === demoDayIndex() && slotState(x) === 'live')
  if (!live) return <p className="text-[13.5px] text-muted">No lesson right now</p>
  return <p className="flex flex-wrap items-center gap-2 text-[13.5px]"><LiveBadge label="In class" /><span className="font-medium">{short(live.subject)}</span><span className="text-muted">· joined at 09:00</span></p>
}

export function ParentDashboard() {
  const due = kids.reduce((a, k) => a + (invOf(k).amount - invOf(k).paid), 0)
  return (
    <>
      <Greeting eyebrow="Tuesday 6 October · Term 3, week 4" title="Good morning, Mrs Nakato" photo="primaryLearners" />
      {due > 0 && (
        <Notice tone="crane" className="mb-6" title={`${usd(due)} due by Friday 23 October`} action={<Button to="/parent/fees" size="sm">Pay now</Button>}>Second instalment for Amani, Term 3. Daniel’s fees are paid in full.</Notice>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {kids.map((k) => {
          const inv = invOf(k)
          const recent = k.id === 's-amani' ? assignments.find((a) => a.status === 'Marked') : null
          return (
            <Card key={k.id}>
              <div className="flex items-start gap-4">
                <Avatar name={k.name} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] font-semibold">{k.name}</p>
                  <p className="text-[13.5px] text-muted">{k.className} · {levelOfYear(k.year).name}</p>
                  <div className="mt-2"><NowLine s={k} /></div>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-line py-4 text-[13px]">
                <div><dt className="text-muted">Attendance</dt><dd className="num text-[20px] font-semibold">{k.id === 's-amani' ? 96 : 98}%</dd></div>
                <div><dt className="text-muted">Average</dt><dd className="num text-[20px] font-semibold">{avgOf(k)}%</dd></div>
                <div><dt className="text-muted">Fees</dt><dd className={cn('text-[15px] font-semibold', inv.paid < inv.amount ? 'text-warn' : 'text-good')}>{inv.paid < inv.amount ? `${usd(inv.amount - inv.paid)} due` : 'Paid'}</dd></div>
              </dl>
              {recent ? (
                <div className="mt-4"><p className="text-[12.5px] font-semibold text-muted">Latest mark</p><p className="mt-0.5 font-semibold">{recent.title} <span className="num text-good">{recent.mark}/{recent.maxMark}</span></p><p className="line-clamp-2 text-[13.5px] text-muted">{recent.feedback}</p></div>
              ) : (
                <div className="mt-4"><p className="text-[12.5px] font-semibold text-muted">Teacher’s note</p><p className="mt-0.5 text-[14px]">“Daniel finished his reading book early. I’ve added two more to his library shelf.” Ms Ruth Atim</p></div>
              )}
              <Button to={`/parent/child/${k.id}`} variant="secondary" block className="mt-5">See {k.name.split(' ')[0]}’s progress</Button>
            </Card>
          )
        })}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Coming up for Amani" action={<Link to="/parent/child/s-amani" className="link text-[13.5px]">Homework</Link>} />
          <ul className="divide-y divide-line">
            {assignments.filter((a) => a.status === 'To do' || a.status === 'Late').map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3"><span className="min-w-0 flex-1"><span className="block truncate font-medium">{a.title}</span><span className="text-[13px] text-muted">{short(a.subject)} · due {fmtDay(a.due)}</span></span><StatusBadge status={a.status} /></li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="From the school" action={<Link to="/parent/announcements" className="link text-[13.5px]">All</Link>} />
          <ul className="space-y-4">
            {announcements.slice(0, 3).map((n) => <li key={n.id} className="flex gap-3"><Bell className="mt-0.5 h-5 w-5 shrink-0 text-nile" /><div><p className="font-semibold leading-snug">{n.title}</p><p className="text-[13px] text-muted">{n.from} · {relative(n.date)}</p></div></li>)}
          </ul>
        </Card>
      </div>
    </>
  )
}

export function ChildPage() {
  const { id = 's-amani' } = useParams()
  const k = kids.find((x) => x.id === id) ?? amani
  const [tab, setTab] = useState<'today' | 'grades' | 'attendance' | 'homework' | 'teachers'>('today')
  const grades = gradesOf(k)
  const today = ttOf(k).filter((s) => s.day === demoDayIndex())
  const teachersOf = Array.from(new Set(grades.map((g) => g.teacherId))).map(teacherById)
  return (
    <>
      <PageHeader title={k.name} description={`${k.className} · ${levelOfYear(k.year).name} · admission number ${k.admissionNo}`} actions={<Button to="/parent/messages" variant="secondary" icon={<MessageSquare className="h-4 w-4" />}>Message a teacher</Button>} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'today', label: 'Today' }, { value: 'grades', label: 'Grades' }, { value: 'attendance', label: 'Attendance' }, { value: 'homework', label: 'Homework' }, { value: 'teachers', label: 'Teachers' }]} />
      {tab === 'today' && (
        <Card>
          <CardHeader title="Tuesday 6 October" description="Lessons on Kampala time" />
          <ol className="divide-y divide-line">
            {today.map((s) => {
              const p = periods.find((x) => x.id === s.period)!
              const st = slotState(s)
              return (
                <li key={s.period} className={cn('flex items-center gap-4 py-3', st === 'live' && '-mx-3 rounded-ctl bg-crane-tint px-3')}>
                  <span className="num w-14 font-semibold">{p.start}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold">{short(s.subject)}</span><span className="text-[13px] text-muted">{teacherById(s.teacherId).name}</span></span>
                  {st === 'past' ? <Badge tone="good">Attended</Badge> : st === 'live' ? <LiveBadge label="In class now" /> : <span className="text-[13px] text-muted">{p.start}–{p.end}</span>}
                </li>
              )
            })}
          </ol>
        </Card>
      )}
      {tab === 'grades' && (
        <Card>
          <DataTable rowKey={(g) => g.subject} rows={grades} columns={[
            { key: 's', header: 'Subject', primary: true, render: (g) => <div><p className="font-semibold">{short(g.subject)}</p><p className="text-[12.5px] text-muted">{teacherById(g.teacherId).name}</p></div> },
            { key: 'o', header: 'This term', align: 'right', render: (g) => <span className="num font-semibold">{g.overall}%</span> },
            ...(k.year >= 10 ? [{ key: 'p', header: 'Predicted', align: 'right' as const, render: (g: typeof grades[number]) => <span className="font-display text-[17px]">{g.predicted}</span> }] : []),
            { key: 't', header: 'Trend', hideOnMobile: true, render: (g) => <Sparkline points={g.trend} label={`${g.subject} trend`} /> },
            { key: 'c', header: 'Teacher’s comment', hideOnMobile: true, className: 'max-w-[320px]', render: (g) => <span className="line-clamp-2 text-[13.5px] text-muted">{g.comment}</span> },
          ]} />
        </Card>
      )}
      {tab === 'attendance' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <Card className="flex items-center gap-6"><Ring value={k.id === 's-amani' ? 96 : 98} size={112} label="Attendance" /><div><p className="text-muted">This term</p><p className="text-[14px]">Target 95% or more</p><p className="mt-2 text-[13.5px] text-muted">You get an SMS whenever {k.name.split(' ')[0]} misses a lesson.</p></div></Card>
          <Card>
            <CardHeader title="Absences and late arrivals" />
            {k.id === 's-amani' ? (
              <ul className="divide-y divide-line">{absences.map((a) => <li key={a.date + a.subject} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3"><span className="num w-28 font-semibold">{fmtDate(a.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span><span className="min-w-0 flex-1"><span className="block">{short(a.subject)}</span><span className="text-[13px] text-muted">{a.reason}</span></span><Badge tone={a.status === 'Excused' ? 'nile' : a.status === 'Late' ? 'warn' : 'bad'}>{a.status}</Badge></li>)}</ul>
            ) : <p className="py-6 text-center text-muted">No absences this term.</p>}
            {k.id === 's-amani' && <Button variant="secondary" size="sm" className="mt-4">Explain an absence</Button>}
          </Card>
        </div>
      )}
      {tab === 'homework' && (
        <Card pad={false}>
          {k.id === 's-amani' ? (
            <ul className="divide-y divide-line">{assignments.map((a) => <li key={a.id} className="flex items-center gap-3 px-5 py-3.5"><span className="min-w-0 flex-1"><span className="block font-medium">{a.title}</span><span className="text-[13px] text-muted">{short(a.subject)} · due {fmtDay(a.due)}</span></span><StatusBadge status={a.status} mark={a.mark} max={a.maxMark} /></li>)}</ul>
          ) : <p className="p-8 text-center text-muted">All of Daniel’s homework is handed in.</p>}
        </Card>
      )}
      {tab === 'teachers' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {teachersOf.map((t) => (
            <Card key={t.id} className="flex items-center gap-4">
              <Avatar name={t.name} size={44} />
              <div className="min-w-0 flex-1"><p className="font-semibold">{t.name}</p><p className="truncate text-[13.5px] text-muted">{grades.filter((g) => g.teacherId === t.id).map((g) => short(g.subject)).join(', ')}</p></div>
              <Button to="/parent/messages" size="sm" variant="secondary">Message</Button>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export function ParentReports() {
  const [child, setChild] = useState<'s-amani' | 's-daniel'>('s-amani')
  const [open, setOpen] = useState<string | null>(null)
  const k = kids.find((x) => x.id === child)!
  if (open) return (
    <>
      <PageHeader back={{ to: '/parent/reports', label: 'Report cards' }} title={`${k.name}, ${reportCards.find((r) => r.id === open)!.term}`} />
      <div className="mb-4"><Button variant="ghost" size="sm" onClick={() => setOpen(null)}>Back to all reports</Button></div>
      <ReportCardDoc student={k} grades={gradesOf(k)} term={reportCards.find((r) => r.id === open)!.term} attendance={k.id === 's-amani' ? 96 : 98} />
    </>
  )
  return (
    <>
      <PageHeader title="Report cards" description="Published at the end of each term." actions={<Segmented value={child} onChange={setChild} options={kids.map((x) => ({ value: x.id as 's-amani' | 's-daniel', label: x.name.split(' ')[0] }))} />} />
      <Card pad={false}>
        <ul className="divide-y divide-line">
          {reportCards.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <FileCheck2 className="h-6 w-6 text-nile" />
              <div className="min-w-0 flex-1"><p className="font-semibold">{r.term}</p><p className="text-[13.5px] text-muted">{r.published ? `Published ${fmtDate(r.published)}` : r.status}</p></div>
              {r.published ? <Button size="sm" variant="secondary" onClick={() => setOpen(r.id)}>View report</Button> : <Badge>{r.status}</Badge>}
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export function ParentFees() {
  const [pay, setPay] = useState<Student | null>(null)
  const [paid, setPaid] = useState<string[]>([])
  const toast = useToast()
  const mine = payments.filter((p) => kids.some((k) => k.id === p.studentId))
  return (
    <>
      <PageHeader title="Fees and payments" description="Term 3, 2026. Pay in full or in two instalments." />
      <div className="grid gap-6 md:grid-cols-2">
        {kids.map((k) => {
          const inv = invOf(k)
          const isPaid = paid.includes(k.id) || inv.paid >= inv.amount
          const paidNow = isPaid ? inv.amount : inv.paid
          return (
            <Card key={k.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3"><Avatar name={k.name} size={40} /><div><p className="font-semibold">{k.name}</p><p className="text-[13px] text-muted">{k.className} · {inv.id}</p></div></div>
                <Badge tone={isPaid ? 'good' : 'crane'}>{isPaid ? 'Paid in full' : 'Part paid'}</Badge>
              </div>
              <div className="mt-5 mb-2 flex justify-between text-[14px]"><span className="text-muted">Paid {usd(paidNow)} of {usd(inv.amount)}</span><span className="num font-semibold">{Math.round((paidNow / inv.amount) * 100)}%</span></div>
              <Progress value={(paidNow / inv.amount) * 100} tone={isPaid ? 'good' : 'crane'} label="Paid" />
              <ul className="mt-5 space-y-2 text-[14px]">
                <li className="flex justify-between gap-3"><span>1st instalment · due {fmtDate(inv.dueFirst, { day: 'numeric', month: 'short' })}</span><span className="num font-medium">{usd(inv.amount / 2)} <CheckCircle2 className="ml-1 inline h-4 w-4 text-good" /></span></li>
                <li className="flex justify-between gap-3"><span>2nd instalment · due {fmtDate(inv.dueSecond, { day: 'numeric', month: 'short' })}</span><span className="num font-medium">{usd(inv.amount / 2)} {isPaid ? <CheckCircle2 className="ml-1 inline h-4 w-4 text-good" /> : <CalendarClock className="ml-1 inline h-4 w-4 text-warn" />}</span></li>
              </ul>
              {!isPaid && <Button block className="mt-5" icon={<Wallet className="h-4 w-4" />} onClick={() => setPay(k)}>Pay {usd(inv.amount - inv.paid)}</Button>}
            </Card>
          )
        })}
      </div>
      <Card className="mt-6">
        <CardHeader title="Payment history and receipts" />
        <DataTable rowKey={(p) => p.id} rows={mine} columns={[
          { key: 'd', header: 'Date', primary: true, render: (p) => <span className="font-semibold">{fmtDate(p.date)}</span> },
          { key: 'c', header: 'For', render: (p) => kids.find((k) => k.id === p.studentId)!.name },
          { key: 'm', header: 'Method', render: (p) => p.method },
          { key: 'a', header: 'Amount', align: 'right', render: (p) => <span className="num font-semibold">{usd(p.amount)}</span> },
          { key: 'r', header: 'Receipt', render: (p) => <button type="button" onClick={() => toast(`Downloading receipt ${p.id}`, 'info')} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-nile"><Receipt className="h-4 w-4" />{p.id}</button> },
        ]} />
      </Card>
      <Card className="mt-6">
        <CardHeader title="Notices about fees" />
        <ul className="space-y-3 text-[14px]">
          <li className="flex gap-3"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-nile" /><span><span className="font-medium">2 Oct, email and SMS:</span> Reminder that Amani’s second instalment of USD 300 is due by 23 October.</span></li>
          <li className="flex gap-3"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-nile" /><span><span className="font-medium">12 Sep:</span> Receipt for USD 700 (Amani first instalment, Daniel in full).</span></li>
        </ul>
        <p className="mt-4 rounded-ctl bg-sunken p-3 text-[13.5px] text-muted">If fees stay unpaid after the due date, the school sends a written notice with a final date before pausing access to lessons and reports. Contact the bursar early to agree a plan.</p>
      </Card>
      <Modal open={!!pay} onClose={() => setPay(null)} title={`Pay for ${pay?.name.split(' ')[0]}`} description="Term 3, 2026 · second instalment">
        {pay && <PaymentPanel amount={invOf(pay).amount - invOf(pay).paid} purpose={`${pay.name}, Term 3 second instalment`} onPaid={() => { setPaid((p) => [...p, pay.id]); setTimeout(() => setPay(null), 1600) }} />}
      </Modal>
    </>
  )
}

