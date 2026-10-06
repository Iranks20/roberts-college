import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileCheck2, Send, Sparkles, BookOpen, Lightbulb, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, CardHeader, DataTable, Notice, PageHeader, Progress, Tabs, cn } from '../../components/ui'
import { LineChart, Ring, Sparkline } from '../../components/Charts'
import { absences, amani, amaniGrades, attendanceBySubject, invoices, reportCards, teacherById, payments } from '../../data/school'
import { fmtDate, usd } from '../../lib/format'
import { ReportCardDoc } from '../shared/ReportCard'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')

export function Grades() {
  const [tab, setTab] = useState<'term' | 'reports'>('term')
  const avg = Math.round(amaniGrades.reduce((a, g) => a + g.overall, 0) / amaniGrades.length)
  const trend = [0, 1, 2, 3].map((i) => Math.round(amaniGrades.reduce((a, g) => a + g.trend[i], 0) / amaniGrades.length))
  return (
    <>
      <PageHeader title="Grades and reports" description="Term 3, 2026 so far. Marks update when your teachers mark work." />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'term', label: 'This term' }, { value: 'reports', label: 'Report cards', count: 2 }]} />
      {tab === 'term' ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
            <Card>
              <p className="text-[13px] font-medium text-muted">Average across 8 subjects</p>
              <p className="num mt-1 font-display text-[48px] leading-none">{avg}%</p>
              <p className="mt-2 text-[14px] text-muted">Up {avg - trend[0]} points since Term 1</p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-[13px]">
                <div><p className="text-muted">Predicted A* or A</p><p className="num text-[18px] font-semibold">{amaniGrades.filter((g) => g.predicted.startsWith('A')).length}</p></div>
                <div><p className="text-muted">Predicted B</p><p className="num text-[18px] font-semibold">{amaniGrades.filter((g) => g.predicted === 'B').length}</p></div>
                <div><p className="text-muted">Needs focus</p><p className="num text-[18px] font-semibold">{amaniGrades.filter((g) => g.effort === 'Needs focus').length}</p></div>
              </div>
            </Card>
            <Card>
              <CardHeader title="Average over the year" description="Term 1 to Term 3 (so far), all subjects" />
              <LineChart points={trend} labels={['Term 1', 'Mid-year', 'Term 2', 'Term 3']} min={50} max={100} ariaLabel="Average mark by term" />
            </Card>
          </div>
          <Card>
            <CardHeader title="By subject" />
            <DataTable rowKey={(g) => g.subject} rows={amaniGrades} columns={[
              { key: 's', header: 'Subject', primary: true, render: (g) => <div><p className="font-semibold">{short(g.subject)}</p><p className="text-[12.5px] text-muted">{teacherById(g.teacherId).name}</p></div> },
              { key: 'c', header: 'Coursework', align: 'right', render: (g) => <span className="num">{g.coursework}%</span> },
              { key: 't', header: 'Tests', align: 'right', render: (g) => <span className="num">{g.tests}%</span> },
              { key: 'o', header: 'Overall', align: 'right', render: (g) => <span className="num font-semibold">{g.overall}%</span> },
              { key: 'p', header: 'Predicted', align: 'right', render: (g) => <span className="font-display text-[17px]">{g.predicted}</span> },
              { key: 'tr', header: 'This year', hideOnMobile: true, render: (g) => <Sparkline points={g.trend} label={`${g.subject} trend`} /> },
              { key: 'e', header: 'Effort', render: (g) => <Badge tone={g.effort === 'Excellent' ? 'good' : g.effort === 'Good' ? 'nile' : 'warn'}>{g.effort}</Badge> },
            ]} />
          </Card>
        </div>
      ) : (
        <Card pad={false}>
          <ul className="divide-y divide-line">
            {reportCards.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <FileCheck2 className="h-6 w-6 text-nile" />
                <div className="min-w-0 flex-1"><p className="font-semibold">{r.term}</p><p className="text-[13.5px] text-muted">{r.published ? `Published ${fmtDate(r.published)}` : r.status}</p></div>
                {r.published ? <Button to={`/student/reports/${r.id}`} variant="secondary" size="sm">View report</Button> : <Badge>{r.status}</Badge>}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}

export function StudentReport() {
  const { id = 'r-t2' } = useParams()
  const r = reportCards.find((x) => x.id === id) ?? reportCards[0]
  return (
    <>
      <PageHeader back={{ to: '/student/grades', label: 'Grades and reports' }} title={`Report card, ${r.term}`} />
      <ReportCardDoc student={amani} grades={amaniGrades} term={r.term} attendance={96} />
    </>
  )
}

export function Attendance({ name = 'Your' }: { name?: string }) {
  const total = attendanceBySubject.reduce((a, s) => a + s.total, 0)
  const att = attendanceBySubject.reduce((a, s) => a + s.attended, 0)
  const pct = Math.round((att / total) * 100)
  return (
    <>
      <PageHeader title="Attendance" description={`${name} attendance in Term 3, recorded automatically when joining each live lesson.`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Card className="flex items-center gap-6">
          <Ring value={pct} size={112} label="Attendance this term" />
          <div><p className="text-[14px] text-muted">This term</p><p className="num text-[18px] font-semibold">{att} of {total} lessons</p><p className="mt-1 text-[13.5px] text-muted">School target: 95% or more</p></div>
        </Card>
        <Card>
          <CardHeader title="Absences and late arrivals" />
          <ul className="divide-y divide-line">
            {absences.map((a) => (
              <li key={a.date + a.subject} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="num w-28 text-[14px] font-semibold">{fmtDate(a.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                <span className="min-w-0 flex-1"><span className="block font-medium">{short(a.subject)}</span><span className="block text-[13px] text-muted">{a.reason}</span></span>
                <Badge tone={a.status === 'Excused' ? 'nile' : a.status === 'Late' ? 'warn' : 'bad'}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader title="By subject" />
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {attendanceBySubject.map((s) => {
            const p = Math.round((s.attended / s.total) * 100)
            return (
              <li key={s.subject}>
                <div className="mb-1.5 flex justify-between gap-3 text-[14px]"><span className="truncate font-medium">{short(s.subject)}</span><span className="num text-muted">{s.attended}/{s.total} · {p}%</span></div>
                <Progress value={p} tone={p >= 95 ? 'nile' : p >= 90 ? 'warn' : 'bad'} label={`${s.subject} attendance`} />
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}

export function StudentFees() {
  const inv = invoices.find((i) => i.studentId === amani.id)!
  return (
    <>
      <PageHeader title="Fees" description="Your parent or guardian pays fees from their own account. This page is for your information." />
      <Notice tone="crane" title={`Second instalment of ${usd(inv.amount - inv.paid)} is due by 23 October`}>Your parent has been sent a reminder. Your lessons are not affected.</Notice>
      <Card className="mt-6">
        <CardHeader title={`Term 3, 2026 · ${inv.id}`} />
        <div className="mb-2 flex justify-between text-[14px]"><span className="text-muted">Paid {usd(inv.paid)} of {usd(inv.amount)}</span><span className="num font-semibold">{Math.round((inv.paid / inv.amount) * 100)}%</span></div>
        <Progress value={(inv.paid / inv.amount) * 100} tone="crane" label="Fees paid" />
        <ul className="mt-6 divide-y divide-line text-[14.5px]">
          {payments.filter((p) => p.studentId === amani.id).map((p) => <li key={p.id} className="flex justify-between gap-3 py-3"><span>{fmtDate(p.date)} · {p.method}</span><span className="num font-semibold">{usd(p.amount)}</span></li>)}
        </ul>
      </Card>
    </>
  )
}

/* ---------------- Study assistant (AI, Phase 3 preview) ---------------- */
type Msg = { from: 'me' | 'ai'; text: string; quiz?: { q: string; options: string[]; answer: number } }
const starters = ['Quiz me on moles and molar mass', 'Explain n = m ÷ M with an example', 'Where am I losing marks in Physics?', 'Make me a revision plan for this week']
const replies: Record<string, Msg> = {
  [starters[0]]: { from: 'ai', text: 'Here is a question at the level of your end-of-topic test.', quiz: { q: 'How many moles are in 9 g of water, H₂O? (H = 1, O = 16)', options: ['0.25 mol', '0.5 mol', '1 mol', '2 mol'], answer: 1 } },
  [starters[1]]: { from: 'ai', text: 'n = m ÷ M links three things. n is the amount in moles, m is the mass in grams and M is the molar mass in g/mol.\n\nExample from Tuesday’s lesson: 88 g of CO₂. M(CO₂) = 12 + 2 × 16 = 44 g/mol. So n = 88 ÷ 44 = 2 mol.\n\nTip from Mr Okello’s feedback: always write the units at each step.' },
  [starters[2]]: { from: 'ai', text: 'From your marked Physics work this term, most lost marks are on graphs. In the speed–time worksheet you lost 5 of 20 marks on questions about the area under the graph, which gives distance travelled.\n\nWant three practice questions on that?' },
  [starters[3]]: { from: 'ai', text: 'Based on your timetable and deadlines:\n\nTuesday evening: mole calculations homework (due Thursday).\nWednesday: 15 minutes of speed–time graph practice.\nThursday: take the Chemistry quiz (due Friday).\nWeekend: plan your persuasive letter for English (due Monday 12 October).' },
}

export function Tutor() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'ai', text: `Hello ${amani.name.split(' ')[0]}. I can explain topics from your lessons, quiz you and help you plan revision. I only use your school’s course materials, and your teachers can see what we discuss.` }])
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<Record<number, number>>({})
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [msgs])
  const ask = (q: string) => {
    if (!q.trim()) return
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setText('')
    setTimeout(() => setMsgs((m) => [...m, replies[q] ?? { from: 'ai', text: 'Good question. Your teacher covered this in a recent lesson. Open the lesson recording and notes from My subjects, or try one of the suggestions below and I’ll walk you through it step by step.' }]), 700)
  }
  return (
    <>
      <PageHeader title="Study assistant" description="Practice and explanations based on your own lessons." actions={<Badge tone="crane"><Sparkles className="h-3.5 w-3.5" />Beta</Badge>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card pad={false} className="flex min-h-[560px] flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {msgs.map((m, i) => (
              <div key={i} className={cn('flex gap-3', m.from === 'me' && 'justify-end')}>
                {m.from === 'ai' && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crane-tint text-crane-ink"><Sparkles className="h-4 w-4" /></span>}
                <div className={cn('max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14.5px]', m.from === 'me' ? 'rounded-br-md bg-nile text-nile-on' : 'rounded-bl-md bg-sunken')}>
                  {m.text}
                  {m.quiz && (
                    <div className="mt-3 rounded-ctl bg-surface p-3 text-ink">
                      <p className="font-semibold">{m.quiz.q}</p>
                      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {m.quiz.options.map((o, k) => {
                          const chosen = picked[i]
                          const show = chosen !== undefined
                          return <button key={o} type="button" disabled={show} onClick={() => setPicked((p) => ({ ...p, [i]: k }))} className={cn('rounded-lg border px-3 py-2 text-left text-[14px]', show && k === m.quiz!.answer ? 'border-good bg-good-tint' : show && k === chosen ? 'border-bad bg-bad-tint' : 'border-line hover:border-faint')}>{o}</button>
                        })}
                      </div>
                      {picked[i] !== undefined && <p className="mt-2 text-[13.5px] text-muted">{picked[i] === m.quiz.answer ? 'Correct. ' : 'Not quite. '}M(H₂O) = 18 g/mol, so n = 9 ÷ 18 = 0.5 mol.</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="border-t border-line p-3">
            <div className="scroll-x mb-2"><div className="flex min-w-max gap-2">{starters.map((s) => <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-[13px] font-medium hover:border-nile hover:text-nile">{s}</button>)}</div></div>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(text) }}>
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about any of your subjects" aria-label="Ask the study assistant" />
              <Button type="submit" aria-label="Send" className="w-11 shrink-0 px-0"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </Card>
        <div className="space-y-4">
          <Card><p className="flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4 text-nile" />Uses your courses</p><p className="mt-1 text-[13.5px] text-muted">Answers come from your lesson notes, recordings and the Cambridge syllabus.</p></Card>
          <Card><p className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-nile" />Helps, doesn’t do homework</p><p className="mt-1 text-[13.5px] text-muted">It explains and asks questions. It won’t write answers to homework you hand in.</p></Card>
          <Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={() => setMsgs((m) => m.slice(0, 1))}>Start a new conversation</Button>
          <p className="text-[12.5px] text-muted">See <Link to="/student/grades" className="link">your grades</Link> for teacher feedback.</p>
        </div>
      </div>
    </>
  )
}
