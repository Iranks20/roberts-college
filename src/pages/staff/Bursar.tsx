import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check, X, FileText, Send, ShieldOff, ShieldCheck, Bell, Download, Pencil, Play, CheckCircle2, MessageSquare, Mail } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, Field, Input, KV, Modal, Notice, PageHeader, SearchInput, Select, Stat, Tabs, Textarea, cn, useToast } from '../../components/ui'
import { BarChart } from '../../components/Charts'
import { collectionsByWeek, fees, invoices, levelOfYear, levels, payments as seedPayments, payrollMonths, payslips, students, teacherById, teachers, octoberPayroll, type Payment } from '../../data/school'
import { fmtDate, usd } from '../../lib/format'
import { FeeBadge } from './Registrar'

const base = (p: string) => (p.startsWith('/admin') ? '/admin/finance' : '/bursar')
const stu = (id: string) => students.find((s) => s.id === id)!

export function BursarDashboard() {
  const b = base(useLocation().pathname)
  const expected = invoices.reduce((a, i) => a + i.amount, 0)
  const collected = invoices.reduce((a, i) => a + i.paid, 0)
  const overdue = invoices.filter((i) => i.status === 'Overdue' || i.status === 'Suspended')
  const byLevel = levels.map((l) => {
    const inv = invoices.filter((i) => l.years.includes(stu(i.studentId).year))
    return { l, expected: inv.reduce((a, i) => a + i.amount, 0), paid: inv.reduce((a, i) => a + i.paid, 0) }
  })
  return (
    <>
      <PageHeader title="Finance overview" description="Term 3, 2026 · fees in US dollars" actions={<Button to={`${b === '/bursar' ? '/bursar/reports' : b}`} variant="secondary" icon={<Download className="h-4 w-4" />}>Finance reports</Button>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Billed this term" value={usd(expected)} sub={`${invoices.length} invoices`} />
        <Stat label="Collected" value={usd(collected)} sub={`${Math.round((collected / expected) * 100)}% of billed`} tone="good" />
        <Stat label="Still to collect" value={usd(expected - collected)} sub="Second instalments due 23 Oct" tone="crane" />
        <Stat label="Overdue accounts" value={overdue.length} sub={`${invoices.filter((i) => i.status === 'Suspended').length} with access paused`} tone="bad" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Collected each week" description="Term 3, weeks 1 to 4" />
          <BarChart data={collectionsByWeek.map((w) => ({ label: w.week, value: w.amount, display: usd(w.amount) }))} ariaLabel="Fees collected each week" highlightLast height={230} />
        </Card>
        <Card>
          <CardHeader title="By stage" />
          <ul className="space-y-4">
            {byLevel.map(({ l, expected: e, paid }) => (
              <li key={l.id}>
                <div className="mb-1.5 flex justify-between gap-3 text-[14px]"><span className="font-medium">{l.short}</span><span className="num text-muted">{usd(paid)} of {usd(e)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-sunken"><div className="h-full rounded-full bg-nile" style={{ width: `${(paid / e) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Bank transfers to confirm" action={<Link to={`${b}/payments`} className="link text-[13.5px]">Payments</Link>} />
          <ul className="divide-y divide-line">
            {seedPayments.filter((p) => p.status === 'Awaiting confirmation').map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3"><span className="min-w-0 flex-1"><span className="block font-semibold">{stu(p.studentId).name}</span><span className="text-[13px] text-muted">{p.method} · {p.ref}</span></span><span className="num font-semibold">{usd(p.amount)}</span></li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Overdue" action={<Link to={`${b}/access`} className="link text-[13.5px]">Access and reminders</Link>} />
          <ul className="divide-y divide-line">
            {overdue.slice(0, 5).map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3"><span className="min-w-0 flex-1"><span className="block font-semibold">{stu(i.studentId).name}</span><span className="text-[13px] text-muted">{stu(i.studentId).className} · {stu(i.studentId).guardian}</span></span><span className="num font-semibold text-bad">{usd(i.amount - i.paid)}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

export function InvoicesPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [open, setOpen] = useState<(typeof invoices)[number] | null>(null)
  const [gen, setGen] = useState(false)
  const toast = useToast()
  const rows = invoices.filter((i) => (status === 'All' || i.status === status) && (stu(i.studentId).name + i.id).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Fee invoices" description="One invoice per learner per term." actions={<Button onClick={() => setGen(true)}>Create Term 1, 2027 invoices</Button>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px]">
        <SearchInput value={q} onChange={setQ} placeholder="Search learner or invoice number" />
        <Select className="h-10" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">{['All', 'Paid', 'Part paid', 'Overdue', 'Suspended'].map((s) => <option key={s}>{s}</option>)}</Select>
      </div>
      <Card>
        <DataTable rowKey={(i) => i.id} rows={rows} onRowClick={setOpen} columns={[
          { key: 'n', header: 'Learner', primary: true, render: (i) => <span><span className="block font-semibold">{stu(i.studentId).name}</span><span className="num text-[12.5px] text-muted">{i.id}</span></span> },
          { key: 'y', header: 'Class', render: (i) => stu(i.studentId).className },
          { key: 'a', header: 'Amount', align: 'right', render: (i) => <span className="num">{usd(i.amount)}</span> },
          { key: 'p', header: 'Paid', align: 'right', render: (i) => <span className="num">{usd(i.paid)}</span> },
          { key: 'b', header: 'Balance', align: 'right', render: (i) => <span className={cn('num font-semibold', i.amount - i.paid > 0 && 'text-bad')}>{usd(i.amount - i.paid)}</span> },
          { key: 's', header: 'Status', render: (i) => <FeeBadge s={{ feeStatus: i.status }} /> },
        ]} />
      </Card>
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.id ?? ''} description={open ? `${stu(open.studentId).name} · ${open.term}` : ''}
        footer={<><Button variant="secondary" icon={<Bell className="h-4 w-4" />} onClick={() => { setOpen(null); toast('Reminder sent by email and SMS') }}>Send reminder</Button><Button icon={<Download className="h-4 w-4" />} onClick={() => toast(`Downloading ${open?.id}.pdf`, 'info')}>Download invoice</Button></>}>
        {open && <KV items={[{ k: 'Billed to', v: stu(open.studentId).guardian }, { k: 'Stage', v: levelOfYear(stu(open.studentId).year).name }, { k: 'Amount', v: usd(open.amount) }, { k: 'Paid', v: usd(open.paid) }, { k: '1st instalment due', v: fmtDate(open.dueFirst) }, { k: '2nd instalment due', v: fmtDate(open.dueSecond) }]} />}
      </Modal>
      <Modal open={gen} onClose={() => setGen(false)} title="Create invoices for Term 1, 2027"
        footer={<><Button variant="secondary" onClick={() => setGen(false)}>Cancel</Button><Button onClick={() => { setGen(false); toast('50 invoices created and emailed to parents') }}>Create and email 50 invoices</Button></>}>
        <ul className="space-y-2 text-[14.5px]">
          <li className="flex justify-between"><span>Primary learners (13 × USD 400)</span><span className="num font-semibold">{usd(13 * 400)}</span></li>
          <li className="flex justify-between"><span>Secondary learners (37 × USD 600)</span><span className="num font-semibold">{usd(37 * 600)}</span></li>
          <li className="flex justify-between border-t border-line pt-2 font-semibold"><span>Total</span><span className="num">{usd(13 * 400 + 37 * 600)}</span></li>
        </ul>
        <p className="mt-4 text-[13.5px] text-muted">Due dates: first instalment 2 February 2027, second instalment at mid-term.</p>
      </Modal>
    </>
  )
}

export function PaymentsPage() {
  const [list, setList] = useState<Payment[]>(seedPayments)
  const [tab, setTab] = useState<'confirm' | 'all'>('confirm')
  const [view, setView] = useState<Payment | null>(null)
  const toast = useToast()
  const pending = list.filter((p) => p.status === 'Awaiting confirmation')
  const decide = (p: Payment, ok: boolean) => { setList((l) => l.map((x) => (x.id === p.id ? { ...x, status: ok ? 'Confirmed' : 'Failed' } : x))); setView(null); toast(ok ? `Confirmed. Receipt sent to ${p.payer}.` : 'Marked as not received. The parent has been told.') }
  return (
    <>
      <PageHeader title="Payments" description="Mobile Money and card payments confirm themselves. Bank transfers need you to check the bank statement." />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'confirm', label: 'To confirm', count: pending.length }, { value: 'all', label: 'All payments', count: list.length }]} />
      {tab === 'confirm' ? (
        pending.length === 0 ? <Card><div className="flex flex-col items-center py-10 text-center"><CheckCircle2 className="h-10 w-10 text-good" /><p className="mt-3 font-semibold">All bank transfers are confirmed</p></div></Card> : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((p) => (
              <Card key={p.id}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{stu(p.studentId).name}</p><p className="text-[13.5px] text-muted">Paid by {p.payer}</p></div><p className="num text-[20px] font-semibold">{usd(p.amount)}</p></div>
                <KV items={[{ k: 'Bank reference', v: p.ref }, { k: 'Date on slip', v: fmtDate(p.date) }]} />
                <button type="button" onClick={() => setView(p)} className="mt-4 flex w-full items-center gap-3 rounded-ctl border border-line px-3 py-2.5 text-left hover:border-nile"><FileText className="h-5 w-5 text-nile" /><span className="flex-1 text-[14px] font-medium">Proof of payment.jpg</span><span className="text-[13px] text-nile">Open</span></button>
                <div className="mt-4 flex gap-2"><Button className="flex-1" icon={<Check className="h-4 w-4" />} onClick={() => decide(p, true)}>Confirm received</Button><Button variant="secondary" icon={<X className="h-4 w-4" />} onClick={() => decide(p, false)}>Not received</Button></div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card>
          <DataTable rowKey={(p) => p.id} rows={list} columns={[
            { key: 'd', header: 'Date', primary: true, render: (p) => <span className="font-semibold">{fmtDate(p.date)}</span> },
            { key: 'n', header: 'Learner', render: (p) => stu(p.studentId).name },
            { key: 'm', header: 'Method', render: (p) => p.method },
            { key: 'r', header: 'Reference', hideOnMobile: true, render: (p) => <span className="num text-[13px] text-muted">{p.ref}</span> },
            { key: 'a', header: 'Amount', align: 'right', render: (p) => <span className="num font-semibold">{usd(p.amount)}</span> },
            { key: 's', header: 'Status', render: (p) => <Badge tone={p.status === 'Confirmed' ? 'good' : p.status === 'Failed' ? 'bad' : 'crane'}>{p.status}</Badge> },
          ]} />
        </Card>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title="Proof of payment" description={view ? `${view.payer} · ${view.ref}` : ''} size="lg"
        footer={view && <><Button variant="secondary" onClick={() => decide(view, false)}>Not received</Button><Button onClick={() => decide(view, true)}>Confirm received</Button></>}>
        <div className="pattern-paper flex aspect-[4/3] items-center justify-center rounded-card border border-line bg-sunken"><p className="rounded-full bg-surface px-3 py-1 text-[13px] text-muted">The uploaded bank slip opens here</p></div>
      </Modal>
    </>
  )
}

type AccStage = 'Reminder sent' | 'Final notice sent' | 'Access paused' | 'Due soon'
export function AccessPage() {
  const toast = useToast()
  const seed = useMemo(() => invoices.filter((i) => i.status === 'Overdue' || i.status === 'Suspended').map((i, k) => ({
    inv: i, s: stu(i.studentId),
    stage: (i.status === 'Suspended' ? 'Access paused' : k % 2 ? 'Final notice sent' : 'Reminder sent') as AccStage,
    noticeDate: i.status === 'Suspended' ? '2026-09-21' : k % 2 ? '2026-09-29' : '2026-10-02',
  })), [])
  const [rows, setRows] = useState(seed)
  const [act, setAct] = useState<null | { kind: 'notice' | 'pause' | 'restore'; id: string }>(null)
  const row = rows.find((r) => r.inv.id === act?.id)
  const update = (id: string, stage: AccStage, msg: string) => { setRows((r) => r.map((x) => (x.inv.id === id ? { ...x, stage, noticeDate: '2026-10-06' } : x))); setAct(null); toast(msg) }
  return (
    <>
      <PageHeader title="Access and reminders" description="The school pauses access only after written notice, as agreed in the fees policy." />
      <Card className="mb-6">
        <ol className="grid gap-4 sm:grid-cols-4">
          {[
            { t: 'Reminder', b: 'Automatic email and SMS 7 days before and on the due date.' },
            { t: 'Final notice', b: 'You send a written notice with a final date, at least 14 days ahead.' },
            { t: 'Pause access', b: 'After the final date, lessons and reports are paused. Parents can still pay and message.' },
            { t: 'Restore', b: 'Access comes back as soon as a payment is confirmed.' },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-3"><span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nile text-[13px] font-bold text-nile-on">{i + 1}</span><div><p className="font-semibold">{s.t}</p><p className="text-[13px] text-muted">{s.b}</p></div></li>
          ))}
        </ol>
      </Card>
      <Card>
        <DataTable rowKey={(r) => r.inv.id} rows={rows} columns={[
          { key: 'n', header: 'Learner', primary: true, render: (r) => <span className="flex items-center gap-3"><Avatar name={r.s.name} size={32} /><span><span className="block font-semibold">{r.s.name}</span><span className="text-[12.5px] text-muted">{r.s.className} · {r.s.guardian}</span></span></span> },
          { key: 'b', header: 'Balance', align: 'right', render: (r) => <span className="num font-semibold text-bad">{usd(r.inv.amount - r.inv.paid)}</span> },
          { key: 'st', header: 'Stage', render: (r) => <Badge tone={r.stage === 'Access paused' ? 'bad' : r.stage === 'Final notice sent' ? 'warn' : 'crane'}>{r.stage === 'Access paused' && <ShieldOff className="h-3 w-3" />}{r.stage}</Badge> },
          { key: 'd', header: 'Since', render: (r) => <span className="text-muted">{fmtDate(r.noticeDate, { day: 'numeric', month: 'short' })}</span> },
          { key: 'x', header: 'Action', render: (r) => r.stage === 'Access paused'
              ? <Button size="sm" variant="secondary" icon={<ShieldCheck className="h-4 w-4" />} onClick={() => setAct({ kind: 'restore', id: r.inv.id })}>Restore</Button>
              : r.stage === 'Final notice sent'
                ? <Button size="sm" variant="danger" icon={<ShieldOff className="h-4 w-4" />} onClick={() => setAct({ kind: 'pause', id: r.inv.id })}>Pause access</Button>
                : <Button size="sm" variant="secondary" icon={<Send className="h-4 w-4" />} onClick={() => setAct({ kind: 'notice', id: r.inv.id })}>Send final notice</Button> },
        ]} />
      </Card>
      <Modal open={act?.kind === 'notice'} onClose={() => setAct(null)} title="Send a final notice" description={row ? `To ${row.s.guardian}, by email, SMS and in the parent account` : ''}
        footer={<><Button variant="secondary" onClick={() => setAct(null)}>Cancel</Button><Button onClick={() => row && update(row.inv.id, 'Final notice sent', 'Final notice sent')}>Send notice</Button></>}>
        {row && <div className="space-y-4"><Field label="Final date to pay" htmlFor="fn-date" hint="At least 14 days from today."><Input id="fn-date" type="date" defaultValue="2026-10-20" /></Field><Field label="Message" htmlFor="fn-msg"><Textarea id="fn-msg" rows={5} defaultValue={`Dear ${row.s.guardian}, ${row.s.name.split(' ')[0]}’s Term 3 fees have a balance of ${usd(row.inv.amount - row.inv.paid)}. Please pay by 20 October 2026. If payment is not received by then, access to live lessons and reports will be paused until the balance is cleared. Please contact the bursar if you need to agree a payment plan.`} /></Field></div>}
      </Modal>
      <Modal open={act?.kind === 'pause'} onClose={() => setAct(null)} title={`Pause access for ${row?.s.name.split(' ')[0]}?`}
        footer={<><Button variant="secondary" onClick={() => setAct(null)}>Cancel</Button><Button variant="danger" onClick={() => row && update(row.inv.id, 'Access paused', 'Access paused. The family has been told.')}>Pause access</Button></>}>
        {row && <><Notice tone="warn">Final notice was sent on {fmtDate(row.noticeDate)}. The learner will not be able to join lessons or open reports. The parent account stays open so the family can pay.</Notice><p className="mt-4 text-[14px] text-muted">This action is recorded in the activity log.</p></>}
      </Modal>
      <Modal open={act?.kind === 'restore'} onClose={() => setAct(null)} title="Restore access"
        footer={<><Button variant="secondary" onClick={() => setAct(null)}>Cancel</Button><Button onClick={() => row && update(row.inv.id, 'Reminder sent', 'Access restored')}>Restore access</Button></>}>
        <p className="text-[14.5px]">Use this when a payment plan has been agreed. Access is restored automatically when the balance is paid.</p>
      </Modal>
    </>
  )
}

export function FeeStructure() {
  const [edit, setEdit] = useState(false)
  const toast = useToast()
  return (
    <>
      <PageHeader title="Fee structure" description="Applies from Term 1, 2027 unless changed." actions={<Button variant="secondary" icon={<Pencil className="h-4 w-4" />} onClick={() => setEdit(true)}>Edit fees</Button>} />
      <Card className="mb-6">
        <DataTable rowKey={(l) => l.id} rows={levels} columns={[
          { key: 'n', header: 'Stage', primary: true, render: (l) => <span className="font-semibold">{l.name}</span> },
          { key: 'y', header: 'Years', render: (l) => <span className="num">{l.years[0]}–{l.years[l.years.length - 1]}</span> },
          { key: 'f', header: 'Per term', align: 'right', render: (l) => <span className="num font-semibold">{usd(l.fee)}</span> },
          { key: 'i', header: 'Each instalment', align: 'right', render: (l) => <span className="num">{usd(l.fee / 2)}</span> },
          { key: 'a', header: 'Per year (3 terms)', align: 'right', render: (l) => <span className="num">{usd(l.fee * 3)}</span> },
        ]} />
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader title="Rules" /><KV cols={1} items={[{ k: 'Application fee', v: usd(fees.applicationFee) }, { k: 'Instalments', v: fees.instalmentRule }, { k: 'Currency', v: 'US dollars. Mobile Money is charged in UGX at the day’s rate.' }]} /></Card>
        <Card><CardHeader title="Payment methods" /><ul className="space-y-2.5 text-[14.5px]">{fees.methods.map((m) => <li key={m} className="flex items-center justify-between gap-3"><span>{m}</span><Badge tone="good">On</Badge></li>)}<li className="flex items-center justify-between gap-3 text-muted"><span>PayPal</span><Badge>Off, by school decision</Badge></li></ul></Card>
      </div>
      <Modal open={edit} onClose={() => setEdit(false)} title="Edit fees" footer={<><Button variant="secondary" onClick={() => setEdit(false)}>Cancel</Button><Button onClick={() => { setEdit(false); toast('Fees saved. They apply to new invoices only.') }}>Save fees</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">{levels.map((l) => <Field key={l.id} label={`${l.short} per term (USD)`} htmlFor={`fee-${l.id}`}><Input id={`fee-${l.id}`} type="number" defaultValue={l.fee} /></Field>)}<Field label="Application fee (USD)" htmlFor="fee-app"><Input id="fee-app" type="number" defaultValue={fees.applicationFee} /></Field></div>
        <Notice tone="info" className="mt-4">Changes apply to invoices created after saving. Existing invoices keep their amounts.</Notice>
      </Modal>
    </>
  )
}

export function Payroll() {
  const toast = useToast()
  const [month, setMonth] = useState('October 2026')
  const [stage, setStage] = useState<'draft' | 'approved' | 'paid'>('draft')
  const rows = month === 'October 2026'
    ? octoberPayroll.map((r) => { const gross = r.gross + r.allowances; const nssf = Math.round(gross * 0.05); const paye = Math.round(Math.max(0, gross - 110) * 0.18); return { ...r, gross, nssf, paye, net: gross - nssf - paye } })
    : payslips.filter((p) => p.month === month).map((p) => ({ teacherId: p.teacherId, gross: p.gross, allowances: 0, deductions: 0, nssf: p.nssf, paye: p.paye, net: p.net }))
  const total = rows.reduce((a, r) => a + r.net, 0)
  const isPast = month !== 'October 2026'
  return (
    <>
      <PageHeader title="Payroll" description="Teachers see their payslip in their own account once payroll is paid."
        actions={<Select className="h-11 w-auto" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">{['October 2026', ...payrollMonths].map((m) => <option key={m}>{m}</option>)}</Select>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Staff paid" value={rows.length} />
        <Stat label="Gross pay" value={usd(rows.reduce((a, r) => a + r.gross, 0))} />
        <Stat label="PAYE and NSSF" value={usd(rows.reduce((a, r) => a + r.paye + r.nssf, 0))} />
        <Stat label="Net to pay" value={usd(total)} tone="good" />
      </div>
      {!isPast && (
        <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-semibold">{stage === 'draft' ? 'October payroll is a draft' : stage === 'approved' ? 'Approved, ready to pay on 28 October' : 'Paid and payslips published'}</p><p className="text-[13.5px] text-muted">{stage === 'draft' ? 'Check the figures, then approve. The administrator gets a copy.' : stage === 'approved' ? 'Bank file is ready for Stanbic Bank.' : 'Each teacher can see their payslip under My pay.'}</p></div>
          {stage === 'draft' && <Button icon={<Check className="h-4 w-4" />} onClick={() => { setStage('approved'); toast('Payroll approved') }}>Approve payroll</Button>}
          {stage === 'approved' && <Button icon={<Play className="h-4 w-4" />} onClick={() => { setStage('paid'); toast('Marked as paid. 10 payslips published.') }}>Mark as paid and publish payslips</Button>}
          {stage === 'paid' && <Badge tone="good"><CheckCircle2 className="h-3.5 w-3.5" />Paid</Badge>}
        </Card>
      )}
      <Card>
        <DataTable rowKey={(r) => r.teacherId} rows={rows} columns={[
          { key: 'n', header: 'Teacher', primary: true, render: (r) => <span className="flex items-center gap-3"><Avatar name={teacherById(r.teacherId).name} size={32} /><span><span className="block font-semibold">{teacherById(r.teacherId).name}</span><span className="text-[12.5px] text-muted">{teacherById(r.teacherId).title}</span></span></span> },
          { key: 'g', header: 'Gross', align: 'right', render: (r) => <span className="num">{usd(r.gross)}</span> },
          { key: 'p', header: 'PAYE', align: 'right', render: (r) => <span className="num text-muted">{usd(r.paye)}</span> },
          { key: 's', header: 'NSSF', align: 'right', render: (r) => <span className="num text-muted">{usd(r.nssf)}</span> },
          { key: 'net', header: 'Net pay', align: 'right', render: (r) => <span className="num font-semibold">{usd(r.net)}</span> },
        ]} />
      </Card>
      <p className="mt-3 text-[12.5px] text-muted">PAYE and NSSF are calculated with the rates set in Settings → Payroll.</p>
    </>
  )
}

export function FinanceReports() {
  const toast = useToast()
  const byMethod = ['MTN Mobile Money', 'Visa / Mastercard', 'Bank transfer', 'Airtel Money'].map((m, i) => ({ label: m.replace(' / Mastercard', '/MC').replace(' Mobile Money', ' MoMo').replace(' Money', ''), value: [7800, 6400, 4100, 1600][i], display: usd([7800, 6400, 4100, 1600][i]) }))
  const reports = ['Term collections summary', 'Outstanding balances by year group', 'Payments by method', 'Payroll summary, Q3 2026', 'Receipts register']
  return (
    <>
      <PageHeader title="Finance reports" description="Term 3, 2026" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card><CardHeader title="Collected by payment method" description="Term 3 so far" /><BarChart data={byMethod} ariaLabel="Collected by payment method" height={230} /></Card>
        <Card>
          <CardHeader title="Download" />
          <ul className="divide-y divide-line">
            {reports.map((r) => <li key={r} className="flex items-center gap-3 py-3"><FileText className="h-5 w-5 text-nile" /><span className="flex-1 font-medium">{r}</span><button type="button" onClick={() => toast(`Downloading ${r} (Excel)`, 'info')} className="text-[13.5px] font-semibold text-nile">Excel</button><button type="button" onClick={() => toast(`Downloading ${r} (PDF)`, 'info')} className="text-[13.5px] font-semibold text-nile">PDF</button></li>)}
          </ul>
        </Card>
      </div>
    </>
  )
}

