import { Greeting } from '../../components/Greeting'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Video, UploadCloud, ClipboardPlus, Megaphone, Users, Check, X, Clock, FileText, Plus, Eye, Banknote, Download, CheckCircle2, MessageSquareWarning, NotebookPen, PlayCircle } from 'lucide-react'
import { SubjectArt } from '../../components/SubjectArt'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, Field, FileDrop, Input, KV, Modal, Notice, PageHeader, Progress, Segmented, Select, Stat, Tabs, Textarea, cn, useToast, type PickedFile } from '../../components/ui'
import { hodApprovals, lessonPlans, okelloClasses, okelloTimetable, payslips, periods, students, submissionsToMark, teacherById, threads, y10Students } from '../../data/school'
import { demoDayIndex, fmtDate, fmtDay, relative, usd } from '../../lib/format'
import { slotState } from '../shared/Timetable'

const me = teacherById('t-okello')

export function TeacherDashboard() {
  const today = okelloTimetable.filter((s) => s.day === demoDayIndex())
  const live = today.find((s) => slotState(s) === 'live')
  const toMark = okelloClasses.reduce((a, c) => a + c.toMark, 0)
  return (
    <>
      <Greeting eyebrow="Tuesday 6 October · Term 3, week 4" title="Good morning, Mr Okello" photo="computerLab"
        actions={<><Button to="/teacher/assignments/new" variant="secondary" icon={<ClipboardPlus className="h-4 w-4" />}>Set work</Button><Button to="/teacher/materials" variant="secondary" icon={<UploadCloud className="h-4 w-4" />}>Upload material</Button></>} />

      {live && (
        <section className="mb-6 flex flex-col gap-4 rounded-panel bg-band p-5 text-on-band sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[13.5px] opacity-75">Now · 09:00 to 09:50 · 7 learners</p>
            <p className="mt-1 font-display text-[24px] leading-tight">{live.className} {live.subject}: Moles and molar mass</p>
            <p className="text-[14px] opacity-75">6 learners are already waiting in the classroom</p>
          </div>
          <Button to="/live/teacher" variant="gold" size="lg" icon={<Video className="h-5 w-5" />}>Start lesson</Button>
        </section>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Lessons today" value={today.length} sub="Next at 11:10" />
        <Stat label="Work to mark" value={toMark} sub="Oldest from 4 Oct" tone="crane" />
        <Stat label="Learners" value={okelloClasses.reduce((a, c) => a + c.students, 0)} sub="Across 6 classes" />
        <Stat label="Attendance this week" value="94%" sub="All your classes" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Today’s classes" action={<Link to="/teacher/timetable" className="link text-[13.5px]">Timetable</Link>} />
            <ul className="divide-y divide-line">
              {today.map((s) => {
                const p = periods.find((x) => x.id === s.period)!
                const st = slotState(s)
                return (
                  <li key={s.period} className={cn('flex items-center gap-4 py-3', st === 'past' && 'opacity-60')}>
                    <span className="num w-14 text-[14px] font-semibold">{p.start}</span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold">{s.className} {s.subject}</span><span className="text-[13px] text-muted">{s.subject === 'Physics' ? 'Electromagnetic induction' : s.className === 'Year 10' ? 'Moles and molar mass' : s.className === 'Year 11' ? 'Electrolysis' : 'Organic chemistry: alkenes'}</span></span>
                    {st === 'live' ? <Button to="/live/teacher" size="sm" variant="danger">Start</Button> : <Button to="/teacher/planner" size="sm" variant="ghost" icon={<NotebookPen className="h-4 w-4" />}>Plan</Button>}
                  </li>
                )
              })}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Waiting to be marked" action={<Link to="/teacher/assignments" className="link text-[13.5px]">All assignments</Link>} />
            <ul className="divide-y divide-line">
              {submissionsToMark.map((sb) => {
                const st = students.find((x) => x.id === sb.studentId)!
                return (
                  <li key={sb.id}>
                    <Link to="/teacher/marking/a1" className="flex items-center gap-3 py-3 hover:opacity-80">
                      <Avatar name={st.name} size={36} />
                      <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{st.name}</span><span className="block truncate text-[13px] text-muted">Mole calculations practice · {st.className}</span></span>
                      {sb.late ? <Badge tone="bad">Late</Badge> : <span className="text-[13px] text-muted">{relative(sb.submitted)}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Lesson plans" action={<Link to="/teacher/planner" className="link text-[13.5px]">Planner</Link>} />
            <ul className="space-y-3">
              {lessonPlans.map((lp) => (
                <li key={lp.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate font-semibold">{lp.title}</p><p className="text-[13px] text-muted">{lp.className} · {fmtDay(lp.date)}</p></div>
                  <PlanBadge status={lp.status} />
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Messages" action={<Link to="/teacher/messages" className="link text-[13.5px]">Open</Link>} />
            <ul className="space-y-3">
              <li className="flex gap-3"><Avatar name="Grace Nakato" size={34} /><div className="min-w-0"><p className="text-[14px] font-semibold">Mrs Grace Nakato <span className="font-normal text-muted">· parent</span></p><p className="truncate text-[13.5px] text-muted">How is Amani coping with the new stoichiometry topic?</p></div></li>
              <li className="flex gap-3"><Avatar name="Aisha Nalwoga" size={34} /><div className="min-w-0"><p className="text-[14px] font-semibold">Science department</p><p className="truncate text-[13.5px] text-muted">I’ve uploaded the Year 11 Biology mock for checking.</p></div></li>
            </ul>
          </Card>
          <Link to="/teacher/announcements" className="card flex items-center gap-3 p-5 hover:border-nile"><Megaphone className="h-5 w-5 text-nile" /><span className="font-semibold">Post an announcement to a class</span></Link>
        </div>
      </div>
    </>
  )
}

export function PlanBadge({ status }: { status: string }) {
  const tone = status === 'Approved' ? 'good' : status === 'Submitted' ? 'info' : status === 'Changes requested' ? 'warn' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

export function TeacherClasses() {
  return (
    <>
      <PageHeader title="My classes" description="Six classes this term across Chemistry and Physics." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {okelloClasses.map((c) => (
          <Link key={c.id} to={`/teacher/classes/${c.id}`} className="card overflow-hidden transition-colors hover:border-nile">
            <SubjectArt subject={c.subject} className="aspect-[300/96] w-full" />
            <div className="p-5">
            <p className="text-[13px] font-semibold text-muted">{c.className}</p>
            <p className="font-display text-[22px]">{c.subject}</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-[13px]">
              <div><dt className="text-muted">Learners</dt><dd className="num text-[17px] font-semibold">{c.students}</dd></div>
              <div><dt className="text-muted">Average</dt><dd className="num text-[17px] font-semibold">{c.avg}%</dd></div>
              <div><dt className="text-muted">Attendance</dt><dd className="num text-[17px] font-semibold">{c.attendance}%</dd></div>
            </dl>
            {c.toMark > 0 && <Badge tone="crane" className="mt-4">{c.toMark} to mark</Badge>}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export function ClassDetail() {
  const { id = 'k-chem10' } = useParams()
  const c = okelloClasses.find((x) => x.id === id) ?? okelloClasses[0]
  const roster = (c.className === 'Year 10' ? y10Students : students.filter((s) => s.className === c.className)).slice(0, c.students)
  const [tab, setTab] = useState<'students' | 'register' | 'recordings'>('students')
  const [marks, setMarks] = useState<Record<string, 'Present' | 'Late' | 'Absent'>>(() => Object.fromEntries(roster.map((s, i) => [s.id, i === 4 ? 'Late' : i === 6 ? 'Absent' : 'Present'])))
  const toast = useToast()
  return (
    <>
      <PageHeader back={{ to: '/teacher/classes', label: 'My classes' }} title={`${c.className} ${c.subject}`} description={`${c.students} learners · class average ${c.avg}% · attendance ${c.attendance}%`}
        actions={<><Button to="/teacher/messages" variant="secondary">Message class</Button><Button to="/teacher/assignments/new" icon={<Plus className="h-4 w-4" />}>Set work</Button></>} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'students', label: 'Learners', count: roster.length }, { value: 'register', label: 'Attendance register' }, { value: 'recordings', label: 'Recordings' }]} />
      {tab === 'students' && (
        <Card>
          <DataTable rowKey={(s) => s.id} rows={roster} columns={[
            { key: 'n', header: 'Learner', primary: true, render: (s) => <span className="flex items-center gap-3"><Avatar name={s.name} size={32} /><span><span className="block font-semibold">{s.name}</span><span className="text-[12.5px] text-muted">{s.country}</span></span></span> },
            { key: 'a', header: 'Attendance', align: 'right', render: (s) => <span className="num">{s.attendance}%</span> },
            { key: 'm', header: 'Average', align: 'right', render: (s) => <span className="num font-semibold">{s.average}%</span> },
            { key: 'w', header: 'Homework', render: (s) => s.id === 's-amani' ? <Badge tone="good">Up to date</Badge> : s.average < 65 ? <Badge tone="warn">2 missing</Badge> : <Badge tone="good">Up to date</Badge> },
            { key: 'g', header: 'Parent', hideOnMobile: true, render: (s) => <span className="text-[13.5px] text-muted">{s.guardian}</span> },
          ]} />
        </Card>
      )}
      {tab === 'register' && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-semibold">Tuesday 6 October · 09:00 lesson</p><p className="text-[13.5px] text-muted">Filled in from join times. Change anything that’s wrong, then save.</p></div>
            <Select className="h-10 w-auto" aria-label="Lesson date"><option>Tue 6 Oct, 09:00</option><option>Fri 2 Oct, 08:00</option><option>Wed 30 Sep, 10:10</option></Select>
          </div>
          <ul className="divide-y divide-line">
            {roster.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <Avatar name={s.name} size={32} /><span className="min-w-0 flex-1 font-medium">{s.name}</span>
                <Segmented value={marks[s.id]} onChange={(v) => setMarks((m) => ({ ...m, [s.id]: v }))} options={(['Present', 'Late', 'Absent'] as const).map((v) => ({ value: v, label: v }))} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <p className="text-[13.5px] text-muted">Parents of absent learners get an SMS when you save.</p>
            <Button onClick={() => toast('Register saved. 1 absence SMS sent.')}>Save register</Button>
          </div>
        </Card>
      )}
      {tab === 'recordings' && (
        <Card pad={false}>
          <ul className="divide-y divide-line">
            {['Relative masses', 'Formulae and equations', 'Metallic bonding', 'Covalent bonding and giant structures'].map((t, i) => (
              <li key={t} className="flex items-center gap-4 px-5 py-3.5">
                <PlayCircle className="h-5 w-5 text-nile" /><span className="min-w-0 flex-1"><span className="block font-semibold">{t}</span><span className="text-[13px] text-muted">{['5 Oct', '2 Oct', '29 Sep', '25 Sep'][i]} · 48 min · watched by {[5, 7, 7, 6][i]} of 7</span></span>
                <Badge tone="good">Published</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

export function Planner() {
  const [open, setOpen] = useState(false)
  const [plans, setPlans] = useState(lessonPlans)
  const toast = useToast()
  return (
    <>
      <PageHeader title="Lesson plans" description="Plans you submit go to your head of department for approval." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>New lesson plan</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((lp) => (
          <Card key={lp.id}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[13px] font-semibold text-muted">{lp.className} · {fmtDate(lp.date, { weekday: 'short', day: 'numeric', month: 'short' })}</p><h2 className="text-[17px] font-semibold">{lp.title}</h2></div>
              <PlanBadge status={lp.status} />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-muted">Learning objectives</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-[14.5px]">{lp.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            {'note' in lp && lp.note && <Notice tone="warn" className="mt-4">{lp.note}</Notice>}
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>Edit</Button>
              {lp.status === 'Draft' && <Button size="sm" onClick={() => { setPlans((p) => p.map((x) => (x.id === lp.id ? { ...x, status: 'Submitted' } : x))); toast('Sent to Head of Sciences for approval') }}>Submit for approval</Button>}
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Lesson plan" size="lg"
        footer={<><Button variant="secondary" onClick={() => { setOpen(false); toast('Draft saved') }}>Save draft</Button><Button onClick={() => { setOpen(false); toast('Sent to Head of Sciences for approval') }}>Submit for approval</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Class" htmlFor="lp-class"><Select id="lp-class">{okelloClasses.map((c) => <option key={c.id}>{c.className} {c.subject}</option>)}</Select></Field>
          <Field label="Lesson" htmlFor="lp-date"><Select id="lp-date"><option>Thu 8 Oct, 09:00</option><option>Fri 9 Oct (public holiday)</option><option>Mon 12 Oct, 10:10</option></Select></Field>
          <div className="sm:col-span-2"><Field label="Title" htmlFor="lp-title"><Input id="lp-title" defaultValue="Reacting masses" /></Field></div>
          <div className="sm:col-span-2"><Field label="Learning objectives" htmlFor="lp-obj" hint="One per line."><Textarea id="lp-obj" rows={3} defaultValue={'Use balanced equations to find reacting masses\nIdentify the limiting reactant'} /></Field></div>
          <div className="sm:col-span-2"><Field label="Activities and timing" htmlFor="lp-act"><Textarea id="lp-act" rows={4} defaultValue={'5 min  Starter: recall n = m ÷ M\n15 min  Worked example on the whiteboard\n20 min  Paired practice in breakout groups\n10 min  Exit quiz (3 questions)'} /></Field></div>
          <Field label="Cambridge syllabus reference" htmlFor="lp-syl"><Input id="lp-syl" defaultValue="0620 · 3.3 The mole and the Avogadro constant" /></Field>
          <Field label="Homework" htmlFor="lp-hw" optional><Input id="lp-hw" defaultValue="Worksheet 3.3B" /></Field>
        </div>
      </Modal>
    </>
  )
}

export function Materials() {
  const [files, setFiles] = useState<PickedFile[]>([])
  const toast = useToast()
  const uploaded = [
    { name: 'Moles and molar mass – slides.pdf', cls: 'Year 10 Chemistry', topic: 'Stoichiometry', when: '2026-10-05', views: 6 },
    { name: 'Mole calculations practice.pdf', cls: 'Year 10 Chemistry', topic: 'Stoichiometry', when: '2026-10-02', views: 7 },
    { name: 'Electrolysis demo (video, 6 min).mp4', cls: 'Year 11 Chemistry', topic: 'Electrochemistry', when: '2026-10-01', views: 5 },
    { name: 'Alkenes summary.pdf', cls: 'Year 13 Chemistry', topic: 'Organic chemistry', when: '2026-09-30', views: 2 },
  ]
  return (
    <>
      <PageHeader title="Lesson materials" description="Upload slides, notes, videos and worksheets. Learners see them on the lesson page." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader title="Upload" />
          <div className="space-y-4">
            <Field label="Class" htmlFor="mt-class"><Select id="mt-class">{okelloClasses.map((c) => <option key={c.id}>{c.className} {c.subject}</option>)}</Select></Field>
            <Field label="Topic and lesson" htmlFor="mt-topic"><Select id="mt-topic"><option>Stoichiometry · Moles and molar mass (6 Oct)</option><option>Stoichiometry · Reacting masses (8 Oct)</option><option>Not linked to a lesson</option></Select></Field>
            <FileDrop files={files} onChange={setFiles} hint="PDF, Word, PowerPoint, images or video, up to 500 MB" />
            <Field label="Visible to learners from" htmlFor="mt-when"><Select id="mt-when"><option>Straight away</option><option>Start of the lesson</option><option>After the lesson</option></Select></Field>
            <Button block disabled={!files.length} onClick={() => { setFiles([]); toast('Uploaded and shared with the class') }}>Upload and share</Button>
          </div>
        </Card>
        <Card>
          <CardHeader title="Recently shared" />
          <ul className="divide-y divide-line">
            {uploaded.map((u) => (
              <li key={u.name} className="flex items-center gap-3 py-3">
                <FileText className="h-5 w-5 shrink-0 text-nile" />
                <span className="min-w-0 flex-1"><span className="block truncate font-medium">{u.name}</span><span className="block truncate text-[13px] text-muted">{u.cls} · {u.topic} · {fmtDay(u.when)}</span></span>
                <span className="flex items-center gap-1 text-[13px] text-muted"><Eye className="h-4 w-4" />{u.views}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

export function TeacherPay() {
  const mine = payslips.filter((p) => p.teacherId === me.id)
  const [open, setOpen] = useState<(typeof mine)[number] | null>(null)
  const toast = useToast()
  return (
    <>
      <PageHeader title="My pay" description="Payslips are published here on the 28th of each month." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Last net pay" value={usd(mine[0].net)} sub={`Paid ${fmtDate(mine[0].paidOn!)}`} icon={<Banknote className="h-4 w-4" />} />
        <Stat label="Gross monthly salary" value={usd(me.salary)} sub="Plus USD 100 head of department allowance" />
        <Stat label="Next payday" value="28 Oct" sub="October 2026 payroll" />
      </div>
      <Card>
        <CardHeader title="Payslips" />
        <DataTable rowKey={(p) => p.id} rows={mine} onRowClick={setOpen} columns={[
          { key: 'm', header: 'Month', primary: true, render: (p) => <span className="font-semibold">{p.month}</span> },
          { key: 'g', header: 'Gross', align: 'right', render: (p) => <span className="num">{usd(p.gross)}</span> },
          { key: 'd', header: 'Deductions', align: 'right', render: (p) => <span className="num">{usd(p.paye + p.nssf)}</span> },
          { key: 'n', header: 'Net pay', align: 'right', render: (p) => <span className="num font-semibold">{usd(p.net)}</span> },
          { key: 's', header: 'Status', render: (p) => <Badge tone="good">{p.status}</Badge> },
        ]} />
      </Card>
            <Modal open={!!open} onClose={() => setOpen(null)} title={`Payslip, ${open?.month}`} footer={<Button icon={<Download className="h-4 w-4" />} onClick={() => toast(`Downloading payslip, ${open?.month}`, 'info')}>Download PDF</Button>}>
        {open && (
          <div className="space-y-5">
            <KV items={[{ k: 'Employee', v: me.name }, { k: 'Position', v: me.title }, { k: 'Paid on', v: fmtDate(open.paidOn!) }, { k: 'Paid to', v: 'Stanbic Bank •••• 4410' }]} />
            <table className="w-full text-[14.5px]"><tbody className="divide-y divide-line">
              <tr><td className="py-2">Basic salary</td><td className="num py-2 text-right">{usd(open.gross)}</td></tr>
              <tr><td className="py-2 text-muted">PAYE</td><td className="num py-2 text-right text-muted">− {usd(open.paye)}</td></tr>
              <tr><td className="py-2 text-muted">NSSF (5%)</td><td className="num py-2 text-right text-muted">− {usd(open.nssf)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Net pay</td><td className="num py-2 text-right">{usd(open.net)}</td></tr>
            </tbody></table>
          </div>
        )}
      </Modal>
    </>
  )
}

export function Approvals() {
  const [items, setItems] = useState(hodApprovals)
  const [review, setReview] = useState<(typeof hodApprovals)[number] | null>(null)
  const [note, setNote] = useState('')
  const toast = useToast()
  const decide = (ok: boolean) => { setItems((s) => s.filter((x) => x.id !== review!.id)); toast(ok ? `Approved: ${review!.title}` : `Changes requested from ${review!.by}`); setReview(null); setNote('') }
  return (
    <>
      <PageHeader title="Approvals" description="Head of Sciences. Lesson plans, test papers and report comments from your department." />
      {items.length === 0 ? <Card><div className="flex flex-col items-center py-10 text-center"><CheckCircle2 className="h-10 w-10 text-good" /><p className="mt-3 font-semibold">All caught up</p><p className="text-muted">New items appear here when teachers submit them.</p></div></Card> : (
        <Card pad={false}>
          <ul className="divide-y divide-line">
            {items.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <Avatar name={a.by} size={36} />
                <div className="min-w-0 flex-1"><p className="font-semibold">{a.title}</p><p className="text-[13.5px] text-muted">{a.kind} · {a.className} · {a.by} · {relative(a.date)}</p></div>
                <Button size="sm" variant="secondary" onClick={() => setReview(a)}>Review</Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Modal open={!!review} onClose={() => setReview(null)} title={review?.title ?? ''} description={review ? `${review.kind} from ${review.by} · ${review.className}` : ''} size="lg"
        footer={<><Button variant="secondary" icon={<MessageSquareWarning className="h-4 w-4" />} onClick={() => decide(false)} disabled={!note.trim()}>Request changes</Button><Button icon={<Check className="h-4 w-4" />} onClick={() => decide(true)}>Approve</Button></>}>
        <div className="space-y-4">
          <div className="rounded-card bg-sunken p-4 text-[14.5px]">
            <p className="font-semibold">Learning objectives</p>
            <ul className="mt-1 list-disc pl-5"><li>Describe how temperature affects enzyme activity</li><li>Explain denaturation using the lock-and-key model</li></ul>
            <p className="mt-3 font-semibold">Activities</p>
            <p className="mt-1 whitespace-pre-line text-muted">{'10 min  Recap of enzyme structure\n20 min  Virtual lab: amylase at 5 temperatures\n15 min  Graph and conclusion\n5 min  Exit question'}</p>
          </div>
          <Field label="Note to the teacher" htmlFor="ap-note" hint="Needed when you request changes."><Textarea id="ap-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
      </Modal>
    </>
  )
}

