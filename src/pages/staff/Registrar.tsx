import { Greeting } from '../../components/Greeting'
import { useMemo, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Check, X, Eye, CalendarPlus, MailQuestion, UserCheck, UserX, Clock, Globe2, ShieldOff } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, Field, Input, KV, Modal, Notice, PageHeader, SearchInput, Select, Stat, Tabs, Textarea, cn, useToast } from '../../components/ui'
import { BarChart } from '../../components/Charts'
import { applications as seed, appStatusTone, levelOfYear, levels, students, type AppStatus, type Application, type Student } from '../../data/school'
import { fmtDate, relative } from '../../lib/format'

const base = (path: string) => (path.startsWith('/admin') ? '/admin' : '/registrar')
const stages: AppStatus[] = ['Submitted', 'Under review', 'Documents requested', 'Interview', 'Accepted', 'Enrolled']

export function RegistrarDashboard() {
  const b = base(useLocation().pathname)
  const counts = stages.map((s) => ({ s, n: seed.filter((a) => a.status === s).length }))
  const action = seed.filter((a) => ['Submitted', 'Under review', 'Documents requested'].includes(a.status))
  const byLevel = levels.map((l) => ({ label: l.short.replace('Lower Secondary', 'Lower Sec.'), value: seed.filter((a) => l.years.includes(a.year)).length }))
  return (
    <>
      <Greeting eyebrow="Applications for Term 1, 2027 and mid-year places" title="Admissions" photo="girlsComputer" position="50% 30%" actions={<Button to={`${b}/applications`}>Review applications</Button>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="New this week" value={seed.filter((a) => a.submitted >= '2026-09-30').length} sub="Since Wednesday 30 September" />
        <Stat label="Need your action" value={action.length} sub="Oldest waiting 7 days" tone="crane" />
        <Stat label="Offers accepted" value={seed.filter((a) => a.status === 'Accepted' || a.status === 'Enrolled').length} sub="Awaiting first payment: 1" />
        <Stat label="Average decision time" value="2.6 days" sub="Target: 3 working days" />
      </div>
      <Card className="mb-6">
        <CardHeader title="Where applications are" />
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {counts.map(({ s, n }, i) => (
            <li key={s}>
              <Link to={`${b}/applications`} className="block rounded-card border border-line p-4 hover:border-nile">
                <p className="text-[12.5px] font-semibold text-muted"><span className="num">{i + 1}.</span> {s}</p>
                <p className="num mt-1 text-[26px] font-semibold">{n}</p>
              </Link>
            </li>
          ))}
        </ol>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="Waiting for you" action={<Link to={`${b}/applications`} className="link text-[13.5px]">All</Link>} />
          <ul className="divide-y divide-line">
            {action.map((a) => (
              <li key={a.id}><Link to={`${b}/applications/${a.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                <Avatar name={a.applicant} size={36} />
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.applicant}</span><span className="text-[13px] text-muted">Year {a.year} · {a.country} · {relative(a.submitted)}</span></span>
                <Badge tone={appStatusTone[a.status]}>{a.status}</Badge>
              </Link></li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Applications by stage" description="Term 1, 2027 intake so far" />
          <BarChart data={byLevel} ariaLabel="Applications by stage" height={220} />
        </Card>
      </div>
    </>
  )
}

export function ApplicationsList() {
  const b = base(useLocation().pathname)
  const nav = useNavigate()
  const [tab, setTab] = useState<'action' | 'all' | 'decided'>('action')
  const [q, setQ] = useState('')
  const [lvl, setLvl] = useState('All')
  const rows = seed.filter((a) =>
    (tab === 'all' || (tab === 'action' ? ['Submitted', 'Under review', 'Documents requested', 'Interview'].includes(a.status) : ['Accepted', 'Rejected', 'Enrolled'].includes(a.status))) &&
    (lvl === 'All' || levelOfYear(a.year).short === lvl) && (a.applicant + a.id + a.guardian).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Applications" />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'action', label: 'In progress', count: seed.filter((a) => ['Submitted', 'Under review', 'Documents requested', 'Interview'].includes(a.status)).length }, { value: 'decided', label: 'Decided' }, { value: 'all', label: 'All', count: seed.length }]} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
        <SearchInput value={q} onChange={setQ} placeholder="Search by name, parent or application number" />
        <Select className="h-10" value={lvl} onChange={(e) => setLvl(e.target.value)} aria-label="Stage">{['All', ...levels.map((l) => l.short)].map((l) => <option key={l}>{l}</option>)}</Select>
      </div>
      <Card>
        <DataTable rowKey={(a) => a.id} rows={rows} onRowClick={(a) => nav(`${b}/applications/${a.id}`)} columns={[
          { key: 'n', header: 'Applicant', primary: true, render: (a) => <span className="flex items-center gap-3"><Avatar name={a.applicant} size={32} /><span><span className="block font-semibold">{a.applicant}</span><span className="text-[12.5px] text-muted">{a.id}</span></span></span> },
          { key: 'y', header: 'Year', render: (a) => `Year ${a.year}` },
          { key: 'c', header: 'Country', hideOnMobile: true, render: (a) => a.country },
          { key: 'f', header: 'Fee', render: (a) => (a.feePaid ? <Badge tone="good">Paid</Badge> : <Badge tone="warn">Unpaid</Badge>) },
          { key: 'd', header: 'Submitted', render: (a) => fmtDate(a.submitted, { day: 'numeric', month: 'short' }) },
          { key: 's', header: 'Status', render: (a) => <Badge tone={appStatusTone[a.status]}>{a.status}</Badge> },
        ]} />
      </Card>
    </>
  )
}

export function ApplicationDetail() {
  const { id } = useParams()
  const b = base(useLocation().pathname)
  const toast = useToast()
  const [app, setApp] = useState<Application>(() => seed.find((a) => a.id === id) ?? seed[0])
  const [modal, setModal] = useState<null | 'docs' | 'interview' | 'accept' | 'reject'>(null)
  const [view, setView] = useState<string | null>(null)
  const set = (status: AppStatus, msg: string) => { setApp((a) => ({ ...a, status })); setModal(null); toast(msg) }
  const level = levelOfYear(app.year)
  const verifyDoc = (name: string, v: boolean) => setApp((a) => ({ ...a, docs: a.docs.map((d) => (d.name === name ? { ...d, verified: v } : d)) }))
  const allVerified = app.docs.every((d) => d.verified)
  return (
    <>
      <PageHeader back={{ to: `${b}/applications`, label: 'Applications' }} title={app.applicant} description={`${app.id} · Year ${app.year}, ${level.name} · submitted ${fmtDate(app.submitted)}`}
        actions={<Badge tone={appStatusTone[app.status]} className="text-[13.5px]">{app.status}</Badge>} />
      {!app.feePaid && <Notice tone="warn" className="mb-6" title="Application fee not paid">The family has been reminded. You can review now, but an offer cannot be made until it is paid.</Notice>}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Learner" />
            <KV items={[{ k: 'Date of birth', v: fmtDate(app.dob) }, { k: 'Studying from', v: app.country }, { k: 'Previous school', v: app.previousSchool }, { k: 'Fee for this stage', v: `USD ${level.fee} per term` }]} />
          </Card>
          <Card>
            <CardHeader title="Parent or guardian" />
            <KV items={[{ k: 'Name', v: app.guardian }, { k: 'Email', v: app.guardianEmail }, { k: 'Phone', v: app.guardianPhone }]} />
          </Card>
          <Card>
            <CardHeader title="Subjects" description={level.choice ? 'Chosen by the family' : 'Fixed for this stage'} />
            <ul className="flex flex-wrap gap-2">{app.subjects.map((s) => <li key={s} className="rounded-full bg-nile-tint px-3 py-1 text-[13.5px] font-semibold text-nile">{s}</li>)}</ul>
          </Card>
          <Card>
            <CardHeader title="Documents" description={allVerified ? 'All checked' : 'Open each document and confirm it is valid'} />
            <ul className="divide-y divide-line">
              {app.docs.map((d) => (
                <li key={d.name} className="flex flex-wrap items-center gap-3 py-3">
                  <FileText className="h-5 w-5 text-nile" /><span className="min-w-0 flex-1 font-medium">{d.name}</span>
                  {d.verified === true && <Badge tone="good"><Check className="h-3 w-3" />Verified</Badge>}
                  {d.verified === false && <Badge tone="bad">Not accepted</Badge>}
                  <Button size="sm" variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={() => setView(d.name)}>Open</Button>
                  {d.verified === null && <><Button size="sm" variant="subtle" onClick={() => verifyDoc(d.name, true)}>Verify</Button><Button size="sm" variant="ghost" onClick={() => verifyDoc(d.name, false)}>Reject</Button></>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Next step" />
            <div className="grid gap-2">
              <Button variant="secondary" icon={<MailQuestion className="h-4 w-4" />} onClick={() => setModal('docs')}>Request documents</Button>
              {level.id !== 'primary' && <Button variant="secondary" icon={<CalendarPlus className="h-4 w-4" />} onClick={() => setModal('interview')}>Book an interview</Button>}
              <Button icon={<UserCheck className="h-4 w-4" />} onClick={() => setModal('accept')} disabled={!app.feePaid || app.status === 'Accepted' || app.status === 'Enrolled'}>Offer a place</Button>
              <Button variant="ghost" className="text-bad" icon={<UserX className="h-4 w-4" />} onClick={() => setModal('reject')}>Decline application</Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="History" />
            <ol className="space-y-4 text-[14px]">
              {[
                ...(app.notes ? [{ t: app.notes, when: 'Latest note' }] : []),
                { t: `Application fee ${app.feePaid ? 'paid by Mobile Money' : 'not yet paid'}`, when: fmtDate(app.submitted) },
                { t: 'Application submitted online', when: fmtDate(app.submitted) },
              ].map((h, i) => (
                <li key={i} className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" /><div><p>{h.t}</p><p className="text-[12.5px] text-muted">{h.when}</p></div></li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <Modal open={modal === 'docs'} onClose={() => setModal(null)} title="Request documents" description={`Sent to ${app.guardian} by email and SMS`}
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => set('Documents requested', 'Request sent to the family')}>Send request</Button></>}>
        <div className="space-y-4"><Field label="What is needed" htmlFor="rd-what"><Select id="rd-what"><option>Signed copy of the latest school report</option><option>Clearer birth certificate</option><option>Passport</option><option>Other</option></Select></Field><Field label="Message" htmlFor="rd-msg"><Textarea id="rd-msg" rows={4} defaultValue={`Dear ${app.guardian}, thank you for applying. Please upload a signed copy of the latest school report so we can continue reviewing ${app.applicant.split(' ')[0]}’s application.`} /></Field></div>
      </Modal>
      <Modal open={modal === 'interview'} onClose={() => setModal(null)} title="Book an online interview"
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => set('Interview', 'Interview booked and invitation sent')}>Send invitation</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Date and time (Kampala)" htmlFor="iv-when"><Input id="iv-when" type="datetime-local" defaultValue="2026-10-08T10:00" /></Field><Field label="Teacher" htmlFor="iv-t"><Select id="iv-t"><option>Mr Samuel Okello</option><option>Ms Sarah Nambi</option><option>Mr David Mwesigwa</option></Select></Field><p className="text-[13.5px] text-muted sm:col-span-2">The family gets a link that opens the interview inside the Roberts College site. Their local time is shown in the invitation.</p></div>
      </Modal>
      <Modal open={modal === 'accept'} onClose={() => setModal(null)} title={`Offer ${app.applicant.split(' ')[0]} a place`}
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => set('Accepted', 'Offer sent. The first invoice has been created.')}>Send offer</Button></>}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Class" htmlFor="ac-class"><Select id="ac-class"><option>Year {app.year}</option></Select></Field><Field label="Start" htmlFor="ac-start"><Select id="ac-start"><option>Term 1, 2027 (2 Feb)</option><option>Now: Term 3, 2026</option></Select></Field></div>
          <Notice tone="info">When the family pays the first instalment of USD {level.fee / 2}, student and parent accounts are created automatically and the learner appears in class lists.</Notice>
        </div>
      </Modal>
      <Modal open={modal === 'reject'} onClose={() => setModal(null)} title="Decline this application"
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={() => set('Rejected', 'Decision sent to the family')}>Decline and notify family</Button></>}>
        <Field label="Reason shared with the family" htmlFor="rj-why"><Textarea id="rj-why" rows={4} defaultValue="Thank you for applying. We are unable to offer a place in this year group at the moment." /></Field>
      </Modal>
      <Modal open={!!view} onClose={() => setView(null)} title={view ?? ''} size="lg"><div className="pattern-paper flex aspect-[4/3] items-center justify-center rounded-card border border-line bg-sunken"><p className="rounded-full bg-surface px-3 py-1 text-[13px] text-muted">The uploaded document opens here</p></div></Modal>
    </>
  )
}

export function StudentRecords() {
  const b = base(useLocation().pathname)
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [year, setYear] = useState('All')
  const [fee, setFee] = useState('All')
  const rows = useMemo(() => students.filter((s) => (year === 'All' || s.year === Number(year)) && (fee === 'All' || s.feeStatus === fee) && (s.name + s.admissionNo + s.guardian).toLowerCase().includes(q.toLowerCase())), [q, year, fee])
  return (
    <>
      <PageHeader title="Student records" description={`${students.length} learners enrolled in Term 3, 2026.`} actions={<Button variant="secondary" icon={<Globe2 className="h-4 w-4" />}>Export list</Button>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_160px_180px]">
        <SearchInput value={q} onChange={setQ} placeholder="Search name, admission number or parent" />
        <Select className="h-10" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year">{['All', 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => <option key={y} value={y}>{y === 'All' ? 'All years' : `Year ${y}`}</option>)}</Select>
        <Select className="h-10" value={fee} onChange={(e) => setFee(e.target.value)} aria-label="Fee status">{['All', 'Paid', 'Part paid', 'Overdue', 'Suspended'].map((f) => <option key={f} value={f}>{f === 'All' ? 'All fee statuses' : f}</option>)}</Select>
      </div>
      <Card>
        <DataTable rowKey={(s) => s.id} rows={rows} onRowClick={(s) => nav(`${b}/students/${s.id}`)} columns={[
          { key: 'n', header: 'Learner', primary: true, render: (s) => <span className="flex items-center gap-3"><Avatar name={s.name} size={32} /><span><span className="block font-semibold">{s.name}</span><span className="num text-[12.5px] text-muted">{s.admissionNo}</span></span></span> },
          { key: 'y', header: 'Class', render: (s) => s.className },
          { key: 'c', header: 'Country', hideOnMobile: true, render: (s) => s.country },
          { key: 'g', header: 'Parent', hideOnMobile: true, render: (s) => <span className="text-muted">{s.guardian}</span> },
          { key: 'a', header: 'Attendance', align: 'right', render: (s) => <span className="num">{s.attendance}%</span> },
          { key: 'f', header: 'Fees', render: (s) => <FeeBadge s={s} /> },
        ]} />
      </Card>
    </>
  )
}

export function FeeBadge({ s }: { s: Pick<Student, 'feeStatus'> }) {
  return <Badge tone={s.feeStatus === 'Paid' ? 'good' : s.feeStatus === 'Part paid' ? 'crane' : s.feeStatus === 'Overdue' ? 'bad' : 'neutral'}>{s.feeStatus === 'Suspended' && <ShieldOff className="h-3 w-3" />}{s.feeStatus}</Badge>
}

export function StudentRecord() {
  const { id } = useParams()
  const b = base(useLocation().pathname)
  const s = students.find((x) => x.id === id) ?? students[0]
  const [tab, setTab] = useState<'profile' | 'academic' | 'documents'>('profile')
  return (
    <>
      <PageHeader back={{ to: `${b}/students`, label: 'Student records' }} title={s.name} description={`${s.admissionNo} · ${s.className} · ${levelOfYear(s.year).name}`} actions={<FeeBadge s={s} />} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'profile', label: 'Profile' }, { value: 'academic', label: 'Academic' }, { value: 'documents', label: 'Documents' }]} />
      {tab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Learner" /><KV items={[{ k: 'Date of birth', v: fmtDate(s.dob) }, { k: 'Country', v: s.country }, { k: 'Admission number', v: s.admissionNo }, { k: 'Portal access', v: s.feeStatus === 'Suspended' ? 'Paused for unpaid fees' : 'Active' }]} /></Card>
          <Card><CardHeader title="Parent or guardian" /><KV items={[{ k: 'Name', v: s.guardian }, { k: 'Relationship', v: s.guardian.startsWith('Mr ') ? 'Father' : 'Mother' }, { k: 'Email', v: `${s.guardian.split(' ').slice(-2).join('.').toLowerCase()}@gmail.com` }, { k: 'Phone', v: '+256 7•• ••• •••' }]} /></Card>
        </div>
      )}
      {tab === 'academic' && (
        <Card>
          <div className="grid gap-4 sm:grid-cols-3"><Stat label="Average this term" value={`${s.average}%`} /><Stat label="Attendance" value={`${s.attendance}%`} /><Stat label="Subjects" value={s.subjects.length} /></div>
          <p className="mt-6 field-label">Subjects</p>
          <ul className="flex flex-wrap gap-2">{s.subjects.map((x) => <li key={x} className="rounded-full bg-nile-tint px-3 py-1 text-[13.5px] font-semibold text-nile">{x}</li>)}</ul>
        </Card>
      )}
      {tab === 'documents' && (
        <Card pad={false}><ul className="divide-y divide-line">{['Birth certificate', 'Previous school report', 'Passport photo', 'Parental consent form (signed online)'].map((d) => <li key={d} className="flex items-center gap-3 px-5 py-3.5"><FileText className="h-5 w-5 text-nile" /><span className="flex-1 font-medium">{d}</span><Badge tone="good"><Check className="h-3 w-3" />Verified</Badge></li>)}</ul></Card>
      )}
    </>
  )
}

