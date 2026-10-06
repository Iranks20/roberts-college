import { Greeting } from '../../components/Greeting'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Plus, CalendarDays, AlertTriangle, Check, Server, HardDrive, Smartphone, CreditCard, Mail, Video, ShieldCheck, Lock, X } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, Field, Input, KV, Modal, Notice, PageHeader, SearchInput, Segmented, Select, Stat, Switch, Tabs, Textarea, cn, useToast } from '../../components/ui'
import { BarChart } from '../../components/Charts'
import { academicYear, applications, auditLog, days, invoices, levels, periods, roleLabel, students, subjectsByLevel, teachers, term, y10Timetable, type Role } from '../../data/school'
import { fmtDate, fmtDateTime, usd } from '../../lib/format'

export function AdminDashboard() {
  const collected = invoices.reduce((a, i) => a + i.paid, 0), billed = invoices.reduce((a, i) => a + i.amount, 0)
  const byYear = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => ({ label: `Y${y}`, value: students.filter((s) => s.year === y).length }))
  return (
    <>
      <Greeting eyebrow={`${term.name}, week ${term.week} of ${term.weeks}`} title="School overview" photo="secondaryStudents" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Learners" value={students.length} sub="Target for year 2: 85" />
        <Stat label="Teachers" value={teachers.length} sub="Target for year 2: 15" />
        <Stat label="Attendance this week" value="93%" sub="Target: 95%" tone="warn" />
        <Stat label="Fees collected" value={`${Math.round((collected / billed) * 100)}%`} sub={`${usd(collected)} of ${usd(billed)}`} tone="good" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card><CardHeader title="Learners by year group" /><BarChart data={byYear} ariaLabel="Learners by year group" height={220} /></Card>
        <Card>
          <CardHeader title="Needs attention" />
          <ul className="space-y-3 text-[14.5px]">
            <li><Link to="/admin/admissions" className="flex items-center justify-between gap-3 hover:underline"><span>Applications waiting for review</span><Badge tone="crane">{applications.filter((a) => ['Submitted', 'Under review'].includes(a.status)).length}</Badge></Link></li>
            <li><Link to="/admin/finance" className="flex items-center justify-between gap-3 hover:underline"><span>Bank transfers to confirm</span><Badge tone="crane">2</Badge></Link></li>
            <li><Link to="/admin/finance" className="flex items-center justify-between gap-3 hover:underline"><span>Overdue fee accounts</span><Badge tone="bad">{invoices.filter((i) => i.status === 'Overdue').length}</Badge></Link></li>
            <li><Link to="/admin/timetable" className="flex items-center justify-between gap-3 hover:underline"><span>Timetable clashes</span><Badge tone="warn">1</Badge></Link></li>
          </ul>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Recent activity" action={<Link to="/admin/audit" className="link text-[13.5px]">Activity log</Link>} />
          <ul className="divide-y divide-line">{auditLog.slice(0, 5).map((a) => <li key={a.id} className="flex gap-3 py-3"><Avatar name={a.who} size={30} /><div className="min-w-0"><p className="text-[14px]">{a.action}</p><p className="text-[12.5px] text-muted">{a.who} · {fmtDateTime(a.when)}</p></div></li>)}</ul>
        </Card>
        <Card>
          <CardHeader title="System status" />
          <ul className="space-y-3 text-[14px]">
            {[{ i: Video, t: 'Live classroom', s: 'Running · 3 lessons now' }, { i: CreditCard, t: 'Payments (Mobile Money and cards)', s: 'Connected' }, { i: Smartphone, t: 'SMS alerts', s: 'Connected · 412 sent this month' }, { i: Mail, t: 'Email', s: 'Connected' }, { i: HardDrive, t: 'Backups', s: 'Last backup today 03:00' }].map(({ i: I, t, s }) => (
              <li key={t} className="flex items-center gap-3"><I className="h-4 w-4 text-nile" /><span className="flex-1">{t}</span><span className="flex items-center gap-1.5 text-[13px] text-muted"><span className="h-2 w-2 rounded-full bg-good" />{s}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

type U = { id: string; name: string; role: Role; email: string; status: 'Active' | 'Invited' | 'Paused'; last: string }
const users: U[] = [
  ...teachers.map((t, i) => ({ id: t.id, name: t.name, role: (t.hod ? 'hod' : 'teacher') as Role, email: t.email, status: (i === 9 ? 'Invited' : 'Active') as U['status'], last: i === 9 ? '—' : '2026-10-06T08:5' + (i % 10) })),
  { id: 'u-achieng', name: 'Ms Ruth Achieng', role: 'registrar', email: 'admissions@robertscollege.ac.ug', status: 'Active', last: '2026-10-06T08:30' },
  { id: 'u-kato', name: 'Mr Peter Kato', role: 'bursar', email: 'bursar@robertscollege.ac.ug', status: 'Active', last: '2026-10-06T08:58' },
  { id: 'u-namuli', name: 'Ms Esther Namuli', role: 'admin', email: 'admin@robertscollege.ac.ug', status: 'Active', last: '2026-10-06T09:15' },
  ...students.slice(0, 12).map((s) => ({ id: s.id, name: s.name, role: 'student' as Role, email: `${s.name.toLowerCase().replace(' ', '.')}@student.robertscollege.ac.ug`, status: (s.feeStatus === 'Suspended' ? 'Paused' : 'Active') as U['status'], last: '2026-10-06T09:0' + (s.year % 10) })),
  { id: 'p-grace', name: 'Mrs Grace Nakato', role: 'parent', email: 'grace.nakato@gmail.com', status: 'Active', last: '2026-10-05T20:05' },
]
const perms = ['See own classes and learners', 'Mark work and edit grades', 'Approve lesson plans and reports', 'Review applications', 'See all student records', 'Record and confirm payments', 'Run payroll', 'Pause or restore access', 'Post school-wide announcements', 'Manage users and settings']
const matrix: Record<string, Role[]> = {
  [perms[0]]: ['teacher', 'hod', 'admin'], [perms[1]]: ['teacher', 'hod'], [perms[2]]: ['hod', 'admin'], [perms[3]]: ['registrar', 'admin'], [perms[4]]: ['registrar', 'admin', 'hod'],
  [perms[5]]: ['bursar'], [perms[6]]: ['bursar', 'admin'], [perms[7]]: ['bursar', 'admin'], [perms[8]]: ['admin', 'registrar', 'bursar'], [perms[9]]: ['admin'],
}
export function UsersRoles() {
  const [tab, setTab] = useState<'users' | 'roles'>('users')
  const [q, setQ] = useState('')
  const [roleF, setRoleF] = useState('All')
  const [add, setAdd] = useState(false)
  const [m, setM] = useState(matrix)
  const toast = useToast()
  const staffRoles: Role[] = ['teacher', 'hod', 'registrar', 'bursar', 'admin']
  const rows = users.filter((u) => (roleF === 'All' || roleLabel[u.role] === roleF) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Users and roles" description="Students and parents are created automatically when an application is accepted. Add staff here." actions={<Button icon={<UserPlus className="h-4 w-4" />} onClick={() => setAdd(true)}>Add staff member</Button>} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'users', label: 'People', count: users.length }, { value: 'roles', label: 'What each role can do' }]} />
      {tab === 'users' ? (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]"><SearchInput value={q} onChange={setQ} placeholder="Search people" /><Select className="h-10" value={roleF} onChange={(e) => setRoleF(e.target.value)} aria-label="Role">{['All', ...Object.values(roleLabel)].map((r) => <option key={r}>{r}</option>)}</Select></div>
          <Card>
            <DataTable rowKey={(u) => u.id} rows={rows} columns={[
              { key: 'n', header: 'Name', primary: true, render: (u) => <span className="flex items-center gap-3"><Avatar name={u.name} size={32} /><span className="min-w-0"><span className="block font-semibold">{u.name}</span><span className="block truncate text-[12.5px] text-muted">{u.email}</span></span></span> },
              { key: 'r', header: 'Role', render: (u) => <Badge tone={u.role === 'admin' ? 'crane' : ['teacher', 'hod'].includes(u.role) ? 'nile' : 'neutral'}>{roleLabel[u.role]}</Badge> },
              { key: 's', header: 'Status', render: (u) => <Badge tone={u.status === 'Active' ? 'good' : u.status === 'Paused' ? 'bad' : 'info'}>{u.status}</Badge> },
              { key: 'l', header: 'Last signed in', hideOnMobile: true, render: (u) => <span className="text-muted">{u.last === '—' ? 'Not yet' : fmtDateTime(u.last)}</span> },
            ]} />
          </Card>
        </>
      ) : (
        <Card pad={false} className="scroll-x">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead><tr className="border-b border-line text-[12.5px] text-muted"><th className="px-5 py-3 text-left font-semibold">Permission</th>{staffRoles.map((r) => <th key={r} className="px-3 py-3 text-center font-semibold">{roleLabel[r]}</th>)}</tr></thead>
            <tbody>
              {perms.map((p) => (
                <tr key={p} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">{p}</td>
                  {staffRoles.map((r) => {
                    const on = m[p].includes(r)
                    return <td key={r} className="px-3 py-2 text-center"><button type="button" aria-label={`${roleLabel[r]}: ${p}`} aria-pressed={on} onClick={() => setM((x) => ({ ...x, [p]: on ? x[p].filter((y) => y !== r) : [...x[p], r] }))} className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md border', on ? 'border-nile bg-nile text-nile-on' : 'border-line text-transparent hover:border-faint')}><Check className="h-4 w-4" /></button></td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end border-t border-line p-4"><Button onClick={() => toast('Permissions saved')}>Save permissions</Button></div>
        </Card>
      )}
      <Modal open={add} onClose={() => setAdd(false)} title="Add a staff member" footer={<><Button variant="secondary" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={() => { setAdd(false); toast('Invitation sent') }}>Send invitation</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="au-name"><Input id="au-name" /></Field>
          <Field label="Work email" htmlFor="au-email"><Input id="au-email" type="email" /></Field>
          <Field label="Role" htmlFor="au-role"><Select id="au-role">{staffRoles.map((r) => <option key={r}>{roleLabel[r]}</option>)}</Select></Field>
          <Field label="Phone (for sign-in codes)" htmlFor="au-phone"><Input id="au-phone" type="tel" placeholder="+256" /></Field>
          <div className="sm:col-span-2"><Field label="Subjects taught" htmlFor="au-subj" optional><Input id="au-subj" placeholder="For example: Chemistry, Physics" /></Field></div>
        </div>
      </Modal>
    </>
  )
}

export function CalendarAdmin() {
  const [add, setAdd] = useState(false)
  const toast = useToast()
  const events = [
    { d: '2026-10-09', t: 'Independence Day (no classes)', k: 'Holiday' },
    { d: '2026-10-23', t: 'Mid-term break; second instalment due', k: 'Term' },
    { d: '2026-10-26', t: 'Cambridge Oct/Nov exam series begins', k: 'Exams' },
    { d: '2026-11-02', t: 'Year 11 mock examinations (to 13 Nov)', k: 'Exams' },
    { d: '2026-11-27', t: 'Report comments due to heads of department', k: 'Reports' },
    { d: '2026-12-04', t: 'Term 3 ends', k: 'Term' },
    { d: '2026-12-11', t: 'Term 3 reports published to families', k: 'Reports' },
  ]
  return (
    <>
      <PageHeader title="Academic calendar" description={`Academic year ${academicYear.name}`} actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setAdd(true)}>Add date</Button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {academicYear.terms.map((t) => (
          <Card key={t.name} className={cn(t.status === 'Current' && 'border-nile ring-1 ring-nile')}>
            <div className="flex items-center justify-between"><p className="font-display text-[22px]">{t.name}</p><Badge tone={t.status === 'Current' ? 'nile' : 'neutral'}>{t.status}</Badge></div>
            <p className="num mt-1 text-[14px] text-muted">{fmtDate(t.start)} to {fmtDate(t.end)}</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader title="Coming up this term" />
        <ul className="divide-y divide-line">
          {events.map((e) => <li key={e.d + e.t} className="flex items-center gap-4 py-3"><span className="num w-28 shrink-0 text-[14px] font-semibold">{fmtDate(e.d, { weekday: 'short', day: 'numeric', month: 'short' })}</span><span className="min-w-0 flex-1">{e.t}</span><Badge tone={e.k === 'Holiday' ? 'crane' : e.k === 'Exams' ? 'info' : 'neutral'}>{e.k}</Badge></li>)}
        </ul>
      </Card>
      <Modal open={add} onClose={() => setAdd(false)} title="Add a date" footer={<><Button variant="secondary" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={() => { setAdd(false); toast('Added to the calendar') }}>Add to calendar</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="What" htmlFor="ev-t"><Input id="ev-t" /></Field></div><Field label="Date" htmlFor="ev-d"><Input id="ev-d" type="date" /></Field><Field label="Type" htmlFor="ev-k"><Select id="ev-k"><option>Holiday</option><option>Exams</option><option>Term</option><option>Reports</option><option>Event</option></Select></Field><div className="sm:col-span-2"><Field label="Cancel lessons on this day?" htmlFor="ev-c"><Select id="ev-c"><option>No</option><option>Yes, and notify families</option></Select></Field></div></div>
      </Modal>
    </>
  )
}

export function Academics() {
  const toast = useToast()
  const [addSubj, setAddSubj] = useState(false)
  const [lv, setLv] = useState<(typeof levels)[number]['id']>('igcse')
  const level = levels.find((l) => l.id === lv)!
  const s = subjectsByLevel[lv]
  return (
    <>
      <PageHeader title="Subjects and classes" description="Changes here update the application form and timetables." />
      <div className="scroll-x mb-5"><Segmented value={lv} onChange={setLv} options={levels.map((l) => ({ value: l.id, label: l.short }))} /></div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title={`${level.name} subjects`} action={<Button size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setAddSubj(true)}>Add subject</Button>} />
          {s.core.length > 0 && <><p className="field-label">{level.choice ? 'Compulsory' : 'Every learner studies'}</p><ul className="mb-5 flex flex-wrap gap-2">{s.core.map((x) => <li key={x} className="rounded-full bg-nile px-3 py-1 text-[13.5px] font-semibold text-nile-on">{x}</li>)}</ul></>}
          {s.options.length > 0 && <><p className="field-label">Options</p><ul className="flex flex-wrap gap-2">{s.options.map((x) => <li key={x} className="inline-flex items-center gap-1.5 rounded-full bg-nile-tint px-3 py-1 text-[13.5px] font-semibold text-nile">{x}<button type="button" aria-label={`Remove ${x}`} onClick={() => toast(`${x} removed from new applications`)}><X className="h-3.5 w-3.5" /></button></li>)}</ul></>}
        </Card>
        <Card>
          <CardHeader title="Classes" />
          <ul className="divide-y divide-line">
            {level.years.map((y) => {
              const n = students.filter((x) => x.year === y).length
              return <li key={y} className="flex items-center gap-3 py-3"><span className="flex-1 font-semibold">Year {y}</span><span className="text-[13.5px] text-muted">{n} learners</span><Select className="h-9 w-auto text-[13.5px]" aria-label={`Class teacher for Year ${y}`} defaultValue={y <= 6 ? 'Ms Ruth Atim' : y === 10 ? 'Mr Samuel Okello' : 'Mr David Mwesigwa'}>{teachers.map((t) => <option key={t.id}>{t.name}</option>)}</Select></li>
            })}
          </ul>
        </Card>
      </div>
      <Modal open={addSubj} onClose={() => setAddSubj(false)} title={`Add a ${level.short} subject`} footer={<><Button variant="secondary" onClick={() => setAddSubj(false)}>Cancel</Button><Button onClick={() => { setAddSubj(false); toast('Subject added') }}>Add subject</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Subject name" htmlFor="as-name"><Input id="as-name" placeholder="For example: Sociology" /></Field></div>
          <Field label="Cambridge syllabus code" htmlFor="as-code" optional><Input id="as-code" placeholder="0495" /></Field>
          <Field label="Type" htmlFor="as-type"><Select id="as-type"><option>Option</option><option>Compulsory</option></Select></Field>
          <div className="sm:col-span-2"><Field label="Teacher" htmlFor="as-t"><Select id="as-t">{teachers.map((t) => <option key={t.id}>{t.name}</option>)}</Select></Field></div>
        </div>
      </Modal>
    </>
  )
}

export function TimetableBuilder() {
  const [cls, setCls] = useState('Year 10')
  const [grid, setGrid] = useState(() => Object.fromEntries(y10Timetable.map((s) => [`${s.day}-${s.period}`, s])))
  const [edit, setEdit] = useState<string | null>(null)
  const toast = useToast()
  const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')
  return (
    <>
      <PageHeader title="Timetable builder" description="Click a lesson to change it. Clashes with a teacher’s other classes are flagged." actions={<><Select className="h-11 w-auto" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">{[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => <option key={y}>Year {y}</option>)}</Select><Button onClick={() => toast('Timetable published. Learners and teachers see it now.')}>Publish</Button></>} />
      <Notice tone="warn" className="mb-5" title="1 clash">Mr Samuel Okello is timetabled for Year 10 Physics and Year 11 Chemistry on Monday at 08:00.</Notice>
      <Card pad={false} className="scroll-x">
        <table className="w-full min-w-[820px] table-fixed text-[13.5px]">
          <thead><tr><th className="w-[90px] border-b border-line p-3 text-left text-[12.5px] text-muted">Time</th>{days.map((d) => <th key={d} className="border-b border-l border-line p-3 text-left font-semibold">{d}</th>)}</tr></thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id}>
                <td className="num border-b border-line p-3 font-semibold">{p.start}</td>
                {days.map((_, d) => {
                  const k = `${d}-${p.id}`, s = grid[k]
                  const clash = d === 0 && p.id === 1
                  return (
                    <td key={d} className="border-b border-l border-line p-1.5">
                      <button type="button" onClick={() => setEdit(k)} className={cn('h-[60px] w-full rounded-lg p-2 text-left hover:ring-2 hover:ring-nile/40', clash ? 'bg-warn-tint ring-1 ring-warn' : 'bg-sunken/70')}>
                        {s ? <><span className="block truncate font-semibold">{short(s.subject)}</span><span className="block truncate text-[12px] text-muted">{teachers.find((t) => t.id === s.teacherId)?.name}</span></> : <span className="text-faint">Free</span>}
                        {clash && <AlertTriangle className="float-right -mt-4 h-4 w-4 text-warn" />}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Change lesson" description={edit ? `${cls}, ${days[Number(edit.split('-')[0])]} ${periods[Number(edit.split('-')[1]) - 1].start}` : ''}
        footer={<><Button variant="secondary" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={() => { setEdit(null); toast('Lesson updated in the draft timetable') }}>Save</Button></>}>
        {edit && <div className="grid gap-4 sm:grid-cols-2"><Field label="Subject" htmlFor="tb-s"><Select id="tb-s" defaultValue={grid[edit]?.subject}>{[...subjectsByLevel.igcse.core, ...subjectsByLevel.igcse.options, 'English (First Language)', 'Form time and clubs'].map((x) => <option key={x}>{x}</option>)}</Select></Field><Field label="Teacher" htmlFor="tb-t"><Select id="tb-t" defaultValue={teachers.find((t) => t.id === grid[edit]?.teacherId)?.name}>{teachers.map((t) => <option key={t.id}>{t.name}</option>)}</Select></Field></div>}
      </Modal>
    </>
  )
}

export function Settings() {
  const toast = useToast()
  const [tab, setTab] = useState<'school' | 'classroom' | 'payments' | 'messages' | 'privacy'>('school')
  const [rec, setRec] = useState(true), [lowData, setLowData] = useState(true), [twoStep, setTwoStep] = useState(true)
  return (
    <>
      <PageHeader title="Settings" />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'school', label: 'School' }, { value: 'classroom', label: 'Live classroom' }, { value: 'payments', label: 'Payments' }, { value: 'messages', label: 'Email and SMS' }, { value: 'privacy', label: 'Security and privacy' }]} />
      {tab === 'school' && <Card><div className="grid gap-4 sm:grid-cols-2"><Field label="School name" htmlFor="st-n"><Input id="st-n" defaultValue="Roberts College" /></Field><Field label="Curriculum" htmlFor="st-c"><Input id="st-c" defaultValue="Cambridge International" /></Field><Field label="Time zone" htmlFor="st-tz"><Select id="st-tz"><option>Africa/Kampala (EAT, UTC+3)</option></Select></Field><Field label="Currency for fees" htmlFor="st-cur"><Select id="st-cur"><option>US dollars (USD)</option><option>Uganda shillings (UGX)</option></Select></Field><div className="sm:col-span-2"><Field label="Address shown on invoices and reports" htmlFor="st-a"><Textarea id="st-a" rows={2} defaultValue="Kampala, Uganda" /></Field></div></div><Button className="mt-5" onClick={() => toast('Settings saved')}>Save</Button></Card>}
      {tab === 'classroom' && (
        <Card><ul className="divide-y divide-line">
          {[{ t: 'Record every lesson', d: 'Recordings appear on the lesson page about an hour after class.', v: rec, s: setRec }, { t: 'Offer “Save data” mode', d: 'Learners on slow connections can hide other people’s video.', v: lowData, s: setLowData }].map((x) => <li key={x.t} className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><p className="font-semibold">{x.t}</p><p className="text-[13.5px] text-muted">{x.d}</p></div><Switch checked={x.v} onChange={x.s} label={x.t} /></li>)}
          <li className="grid gap-4 py-4 sm:grid-cols-2"><Field label="Learners count as late after" htmlFor="st-late"><Select id="st-late"><option>5 minutes</option><option>10 minutes</option></Select></Field><Field label="Keep recordings for" htmlFor="st-keep"><Select id="st-keep"><option>Until the end of the academic year</option><option>Two years</option></Select></Field></li>
        </ul></Card>
      )}
      {tab === 'payments' && <Card><KV items={[{ k: 'Payment provider', v: 'Flutterwave (example)' }, { k: 'Mobile Money', v: 'MTN and Airtel, Uganda' }, { k: 'Cards', v: 'Visa and Mastercard via the provider’s secure page' }, { k: 'Bank transfers', v: 'Confirmed manually by the bursar' }, { k: 'Live key', v: 'FLWPUBK-••••••••••••-X' }, { k: 'PayPal', v: 'Not used' }]} /><Notice tone="info" className="mt-5">Card numbers are entered only on the provider’s page. Roberts College never stores them.</Notice></Card>}
      {tab === 'messages' && <Card><KV items={[{ k: 'SMS provider', v: "Africa's Talking (example)" }, { k: 'Sender name', v: 'ROBERTSCOL' }, { k: 'SMS sent this month', v: '412' }, { k: 'Email sent from', v: 'no-reply@robertscollege.ac.ug' }]} /></Card>}
      {tab === 'privacy' && (
        <Card><ul className="divide-y divide-line">
          <li className="flex items-center gap-4 py-4"><Lock className="h-5 w-5 text-nile" /><div className="min-w-0 flex-1"><p className="font-semibold">Two-step sign-in for staff</p><p className="text-[13.5px] text-muted">A code by SMS each time a staff member signs in on a new device.</p></div><Switch checked={twoStep} onChange={setTwoStep} label="Two-step sign-in" /></li>
          <li className="flex items-center gap-4 py-4"><ShieldCheck className="h-5 w-5 text-nile" /><div className="min-w-0 flex-1"><p className="font-semibold">Data protection</p><p className="text-[13.5px] text-muted">Registered with the Personal Data Protection Office under the Data Protection and Privacy Act, 2019. Parental consent recorded at application.</p></div></li>
          <li className="flex items-center gap-4 py-4"><Server className="h-5 w-5 text-nile" /><div className="min-w-0 flex-1"><p className="font-semibold">Backups</p><p className="text-[13.5px] text-muted">Daily at 03:00, kept for 30 days, stored encrypted.</p></div></li>
        </ul></Card>
      )}
    </>
  )
}

export function AuditLog() {
  const [area, setArea] = useState('All')
  const rows = auditLog.filter((a) => area === 'All' || a.area === area)
  return (
    <>
      <PageHeader title="Activity log" description="Every change to marks, payments, access and users is recorded here and cannot be edited." actions={<Select className="h-11 w-auto" value={area} onChange={(e) => setArea(e.target.value)} aria-label="Area">{['All', 'Finance', 'Grades', 'Admissions', 'Communication', 'Users', 'System'].map((a) => <option key={a}>{a}</option>)}</Select>} />
      <Card>
        <DataTable rowKey={(a) => a.id} rows={rows} columns={[
          { key: 'w', header: 'When', primary: true, render: (a) => <span className="num font-semibold">{fmtDateTime(a.when)}</span> },
          { key: 'u', header: 'Who', render: (a) => a.who },
          { key: 'a', header: 'What happened', render: (a) => <span className="text-ink">{a.action}</span> },
          { key: 'r', header: 'Area', render: (a) => <Badge>{a.area}</Badge> },
        ]} />
      </Card>
    </>
  )
}

