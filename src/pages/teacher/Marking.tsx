import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, ChevronLeft, ChevronRight, Trash2, Check, Sparkles, AlertTriangle, Download, ZoomIn } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, Checkbox, Field, FileDrop, Input, Notice, PageHeader, Progress, Segmented, Select, Tabs, Textarea, cn, useToast, type PickedFile } from '../../components/ui'
import { assignments, okelloClasses, students, submissionsToMark, y10Students } from '../../data/school'
import { fmtDateTime, fmtDay, relative } from '../../lib/format'

const setWork = assignments.filter((a) => a.subject === 'Chemistry' || a.subject === 'Physics').map((a) => ({ ...a, submissions: a.submissions ?? (a.status === 'Marked' ? 7 : 5), classSize: a.classSize ?? 7 }))

export function TeacherAssignments() {
  const [tab, setTab] = useState<'open' | 'marked'>('open')
  const list = setWork.filter((a) => (tab === 'open' ? a.status !== 'Marked' : a.status === 'Marked'))
  return (
    <>
      <PageHeader title="Assignments and marking" description="Homework, quizzes and tests you have set." actions={<Button to="/teacher/assignments/new" icon={<Plus className="h-4 w-4" />}>Set new work</Button>} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'open', label: 'Open and to mark', count: setWork.filter((a) => a.status !== 'Marked').length }, { value: 'marked', label: 'Marked and returned' }]} />
      <Card pad={false}>
        <ul className="divide-y divide-line">
          {list.map((a) => {
            const pct = Math.round((a.submissions / a.classSize) * 100)
            return (
              <li key={a.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_220px_auto] md:items-center">
                <div className="min-w-0"><p className="flex flex-wrap items-center gap-2 font-semibold">{a.title}<Badge>{a.type}</Badge></p><p className="text-[13.5px] text-muted">{a.className} {a.subject} · due {fmtDay(a.due)}</p></div>
                <div><div className="mb-1 flex justify-between text-[12.5px] text-muted"><span>{a.submissions} of {a.classSize} handed in</span><span className="num">{pct}%</span></div><Progress value={pct} label="Handed in" /></div>
                {tab === 'open' ? <Button size="sm" to="/teacher/marking/a1">{a.type === 'Quiz' ? 'View results' : 'Mark'}</Button> : <Button size="sm" variant="secondary" to="/teacher/gradebook">Gradebook</Button>}
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}

type Q = { q: string; options: string[]; answer: number }
export function NewAssignment() {
  const nav = useNavigate()
  const toast = useToast()
  const [type, setType] = useState<'Homework' | 'Quiz' | 'Test' | 'Project'>('Homework')
  const [files, setFiles] = useState<PickedFile[]>([])
  const [qs, setQs] = useState<Q[]>([{ q: 'What is the Mr of water, H₂O?', options: ['17', '18', '19', '34'], answer: 1 }, { q: '', options: ['', '', '', ''], answer: 0 }])
  const [settings, setSettings] = useState({ shuffle: true, track: true, oneSitting: true, showScore: true })
  const upd = (i: number, f: (q: Q) => Q) => setQs((s) => s.map((x, j) => (j === i ? f(x) : x)))
  return (
    <>
      <PageHeader back={{ to: '/teacher/assignments', label: 'Assignments and marking' }} title="Set new work" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="mb-5"><p className="field-label">Type of work</p><Segmented value={type} onChange={setType} options={(['Homework', 'Quiz', 'Test', 'Project'] as const).map((v) => ({ value: v, label: v }))} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Class" htmlFor="nw-class"><Select id="nw-class">{okelloClasses.map((c) => <option key={c.id}>{c.className} {c.subject}</option>)}</Select></Field>
              <Field label="Linked lesson" htmlFor="nw-lesson" optional><Select id="nw-lesson"><option>Moles and molar mass (6 Oct)</option><option>Reacting masses (8 Oct)</option><option>None</option></Select></Field>
              <div className="sm:col-span-2"><Field label="Title" htmlFor="nw-title"><Input id="nw-title" defaultValue={type === 'Quiz' ? 'Reacting masses check-in' : 'Reacting masses worksheet'} /></Field></div>
              <div className="sm:col-span-2"><Field label="Instructions" htmlFor="nw-inst"><Textarea id="nw-inst" rows={4} defaultValue="Answer all questions. Show your working and include units in every answer." /></Field></div>
            </div>
            {type !== 'Quiz' && <div className="mt-5"><p className="field-label">Attachments</p><FileDrop files={files} onChange={setFiles} compact /></div>}
          </Card>

          {type === 'Quiz' && (
            <Card>
              <CardHeader title="Questions" description="Multiple choice is marked automatically." action={<Button size="sm" variant="ghost" icon={<Sparkles className="h-4 w-4" />} onClick={() => { setQs((x) => [...x.filter((q) => q.q.trim()), { q: 'How many moles are in 36 g of water, H₂O?', options: ['1 mol', '2 mol', '3 mol', '18 mol'], answer: 1 }, { q: 'What mass of carbon dioxide contains 0.5 mol?', options: ['11 g', '22 g', '44 g', '88 g'], answer: 1 }, { q: 'Which has the larger molar mass?', options: ['NaCl', 'CaCO₃', 'H₂O', 'CO₂'], answer: 1 }]); toast('3 questions drafted from today’s lesson notes. Check them before setting the quiz.') }}>Draft with AI</Button>} />
              <ol className="space-y-5">
                {qs.map((q, i) => (
                  <li key={i} className="rounded-card border border-line p-4">
                    <div className="flex items-start gap-3">
                      <span className="num mt-2.5 text-[14px] font-bold text-muted">{i + 1}</span>
                      <div className="min-w-0 flex-1 space-y-3">
                        <Input value={q.q} onChange={(e) => upd(i, (x) => ({ ...x, q: e.target.value }))} placeholder="Question" aria-label={`Question ${i + 1}`} />
                        <div className="grid gap-2 sm:grid-cols-2">
                          {q.options.map((o, k) => (
                            <div key={k} className="flex items-center gap-2">
                              <button type="button" aria-label={`Mark option ${k + 1} as correct`} aria-pressed={q.answer === k} onClick={() => upd(i, (x) => ({ ...x, answer: k }))} className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border', q.answer === k ? 'border-good bg-good text-white' : 'border-faint')}>{q.answer === k && <Check className="h-4 w-4" />}</button>
                              <Input className="h-10" value={o} onChange={(e) => upd(i, (x) => ({ ...x, options: x.options.map((y, j) => (j === k ? e.target.value : y)) }))} placeholder={`Option ${k + 1}`} aria-label={`Question ${i + 1} option ${k + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => setQs((s) => s.filter((_, j) => j !== i))} aria-label={`Delete question ${i + 1}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-sunken"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ol>
              <Button variant="secondary" className="mt-4" icon={<Plus className="h-4 w-4" />} onClick={() => setQs((s) => [...s, { q: '', options: ['', '', '', ''], answer: 0 }])}>Add question</Button>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Deadline and marks" />
            <div className="space-y-4">
              <Field label="Due" htmlFor="nw-due"><Input id="nw-due" type="datetime-local" defaultValue="2026-10-12T17:00" /></Field>
              <Field label="Total marks" htmlFor="nw-marks"><Input id="nw-marks" type="number" defaultValue={type === 'Quiz' ? qs.length : 30} /></Field>
              {type === 'Quiz' && <Field label="Time limit" htmlFor="nw-time"><Select id="nw-time"><option>10 minutes</option><option>15 minutes</option><option>20 minutes</option><option>No limit</option></Select></Field>}
              <Field label="Counts towards" htmlFor="nw-cat"><Select id="nw-cat"><option>Coursework</option><option>Tests</option><option>Practice only</option></Select></Field>
            </div>
          </Card>
          {(type === 'Quiz' || type === 'Test') && (
            <Card>
              <CardHeader title="Fair testing" description="Reduce copying in online tests." />
              <div className="space-y-3.5">
                <Checkbox checked={settings.shuffle} onChange={(v) => setSettings({ ...settings, shuffle: v })} label="Shuffle questions and options" />
                <Checkbox checked={settings.track} onChange={(v) => setSettings({ ...settings, track: v })} label="Record when a learner leaves the test page" />
                <Checkbox checked={settings.oneSitting} onChange={(v) => setSettings({ ...settings, oneSitting: v })} label="Must be finished in one sitting" />
                <Checkbox checked={settings.showScore} onChange={(v) => setSettings({ ...settings, showScore: v })} label="Show the score straight after submitting" />
              </div>
            </Card>
          )}
          <div className="flex flex-col gap-2">
            <Button size="lg" onClick={() => { toast('Work set. Learners and parents have been notified.'); nav('/teacher/assignments') }}>Set work for Year 10 Chemistry</Button>
            <Button variant="secondary" onClick={() => toast('Saved as a draft')}>Save as draft</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export function MarkingView() {
  const toast = useToast()
  const subs = submissionsToMark.slice(0, 3)
  const [i, setI] = useState(0)
  const [mark, setMark] = useState<Record<string, string>>({})
  const [fb, setFb] = useState<Record<string, string>>({})
  const [done, setDone] = useState<string[]>([])
  const sb = subs[i]
  const st = students.find((x) => x.id === sb.studentId)!
  const save = () => { setDone((d) => [...new Set([...d, sb.id])]); toast(`Mark saved for ${st.name.split(' ')[0]}`); if (i < subs.length - 1) setI(i + 1) }
  return (
    <>
      <PageHeader back={{ to: '/teacher/assignments', label: 'Assignments and marking' }} title="Mole calculations practice" description="Year 10 Chemistry · 30 marks · due Thu 8 Oct"
        actions={<Button variant="secondary" onClick={() => toast('Marks returned to learners and parents')} disabled={done.length < subs.length}>Return all marks</Button>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {subs.map((s, k) => {
          const n = students.find((x) => x.id === s.studentId)!
          return <button key={s.id} type="button" onClick={() => setI(k)} className={cn('flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13.5px] font-semibold', k === i ? 'border-nile bg-nile-tint text-nile' : 'border-line bg-surface')}>{done.includes(s.id) && <Check className="h-3.5 w-3.5 text-good" />}{n.name}</button>
        })}
        <span className="text-[13px] text-muted">· 4 not handed in yet</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <span className="flex min-w-0 items-center gap-2 text-[14px] font-medium"><FileText className="h-4 w-4 shrink-0 text-nile" /><span className="truncate">{sb.files[0]}</span>{sb.files.length > 1 && <Badge>+{sb.files.length - 1} more</Badge>}</span>
            <span className="flex gap-1"><button type="button" aria-label="Zoom" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sunken"><ZoomIn className="h-4 w-4" /></button><button type="button" aria-label="Download" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sunken"><Download className="h-4 w-4" /></button></span>
          </div>
          <div className="pattern-paper aspect-[4/5] bg-sunken p-6 sm:p-10">
            <div className="mx-auto h-full max-w-md rounded-lg bg-[#fdfcf8] p-6 font-[cursive] text-[15px] leading-8 text-[#24324a] shadow-lift">
              <p>Q1. Mr(CO₂) = 12 + 16 × 2 = 44</p><p>Q2. n = 22 ÷ 44 = 0.5 mol</p><p>Q3. m = n × M = 0.25 × 58.5 = 14.6 g</p><p>Q4. Mr(CaCO₃) = 40 + 12 + 48 = 100</p><p>Q5. n = 10 ÷ 100 = 0.1</p><p className="text-[#be342a]">Q6. Mr(NaCl) = 23 + 35 = 58</p>
            </div>
          </div>
          <p className="border-t border-line px-4 py-2.5 text-[12.5px] text-muted">Handed in {fmtDateTime(sb.submitted)} ({relative(sb.submitted)}){sb.late && ' · late'}</p>
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3"><Avatar name={st.name} size={40} /><div><p className="font-semibold">{st.name}</p><p className="text-[13px] text-muted">{st.className} · average {st.average}%</p></div></div>
            {sb.late && <Notice tone="warn" className="mt-4">Handed in after the deadline.</Notice>}
            <div className="mt-5 space-y-4">
              <Field label="Mark out of 30" htmlFor="mk-mark"><Input id="mk-mark" type="number" min={0} max={30} value={mark[sb.id] ?? ''} onChange={(e) => setMark({ ...mark, [sb.id]: e.target.value })} className="num text-[18px] font-semibold" /></Field>
              <Field label="Feedback" htmlFor="mk-fb" hint="Learners and parents see this with the mark."><Textarea id="mk-fb" rows={5} value={fb[sb.id] ?? ''} onChange={(e) => setFb({ ...fb, [sb.id]: e.target.value })} /></Field>
              <div className="flex flex-wrap gap-2">
                {['Clear working, well done.', 'Include units in every answer.', 'Use Ar(Cl) = 35.5, not 35.'].map((t) => <button key={t} type="button" onClick={() => setFb({ ...fb, [sb.id]: `${fb[sb.id] ? fb[sb.id] + ' ' : ''}${t}` })} className="rounded-full border border-line px-3 py-1 text-[12.5px] font-medium hover:border-nile">{t}</button>)}
              </div>
            </div>
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} icon={<ChevronLeft className="h-4 w-4" />}>Previous</Button>
            <Button className="flex-1" onClick={save} disabled={!mark[sb.id]}>{i < subs.length - 1 ? 'Save and next' : 'Save mark'}{i < subs.length - 1 && <ChevronRight className="h-4 w-4" />}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

const cols = ['Bonding test', 'Isotopes sheet', 'Formulae quiz', 'Lab write-up', 'Mole calcs']
const maxes = [50, 20, 10, 25, 30]
export function Gradebook() {
  const roster = y10Students
  const [cells, setCells] = useState<Record<string, (number | null)[]>>(() => Object.fromEntries(roster.map((s, i) => [s.id, [s.id === 's-amani' ? 41 : 30 + ((i * 7) % 19), 12 + ((i * 3) % 8), 6 + (i % 5), 16 + ((i * 5) % 9), i < 3 ? null : null]])))
  const toast = useToast()
  const pct = (s: string) => { const r = cells[s]; let got = 0, tot = 0; r.forEach((v, k) => { if (v !== null) { got += v; tot += maxes[k] } }); return tot ? Math.round((got / tot) * 100) : 0 }
  return (
    <>
      <PageHeader title="Gradebook" description="Marks from assignments fill in automatically. Click a mark to change it; every change is logged." actions={<Select className="h-11 w-auto" aria-label="Class">{okelloClasses.map((c) => <option key={c.id}>{c.className} {c.subject}</option>)}</Select>} />
      <Card pad={false} className="scroll-x">
        <table className="w-full min-w-[760px] text-[14px]">
          <thead><tr className="border-b border-line text-left text-[12.5px] text-muted">
            <th className="sticky left-0 bg-surface px-4 py-3 font-semibold">Learner</th>
            {cols.map((c, k) => <th key={c} className="px-3 py-3 text-right font-semibold">{c}<span className="block font-normal">/{maxes[k]}</span></th>)}
            <th className="px-4 py-3 text-right font-semibold">Overall</th>
          </tr></thead>
          <tbody>
            {roster.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="sticky left-0 bg-surface px-4 py-2 font-medium">{s.name}</td>
                {cells[s.id].map((v, k) => (
                  <td key={k} className="px-2 py-1.5 text-right">
                    <input aria-label={`${s.name}, ${cols[k]}`} inputMode="numeric" value={v ?? ''} placeholder="–"
                      onChange={(e) => { const n = e.target.value === '' ? null : Math.min(maxes[k], Number(e.target.value) || 0); setCells((c) => ({ ...c, [s.id]: c[s.id].map((x, j) => (j === k ? n : x)) })) }}
                      className={cn('num h-9 w-16 rounded-lg border border-transparent bg-transparent px-2 text-right hover:border-line focus:border-nile focus:outline-none', v !== null && v / maxes[k] < 0.5 && 'text-bad font-semibold')} />
                  </td>
                ))}
                <td className="num px-4 py-2 text-right font-semibold">{pct(s.id)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-[13px] text-muted">Marks below 50% are shown in red.</p><Button onClick={() => toast('Gradebook saved')}>Save changes</Button></div>
    </>
  )
}

export function ReportComments() {
  const roster = y10Students
  const toast = useToast()
  const [c, setC] = useState<Record<string, string>>({ 's-amani': 'Excellent progress in bonding. Keep practising mole calculations with units.' })
  const [effort, setEffort] = useState<Record<string, string>>({})
  const written = roster.filter((s) => (c[s.id] ?? '').trim().length > 0).length
  return (
    <>
      <PageHeader title="Report comments" description="Term 3 reports for Year 10 Chemistry. Due to the Head of Sciences by 27 November."
        actions={<Button onClick={() => toast('Sent to Head of Sciences for approval')} disabled={written < roster.length}>Submit for approval</Button>} />
      <Card className="mb-6"><div className="mb-2 flex justify-between text-[14px]"><span className="font-medium">{written} of {roster.length} comments written</span><span className="num text-muted">{Math.round((written / roster.length) * 100)}%</span></div><Progress value={(written / roster.length) * 100} label="Comments written" /></Card>
      <div className="space-y-4">
        {roster.map((s) => (
          <Card key={s.id}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Avatar name={s.name} size={36} /><div className="min-w-0 flex-1"><p className="font-semibold">{s.name}</p><p className="text-[13px] text-muted">Chemistry overall {s.id === 's-amani' ? 82 : s.average}% · attendance {s.attendance}%</p></div>
              <Select className="h-10 w-auto" aria-label={`Effort for ${s.name}`} value={effort[s.id] ?? 'Good'} onChange={(e) => setEffort({ ...effort, [s.id]: e.target.value })}><option>Excellent</option><option>Good</option><option>Needs focus</option></Select>
            </div>
            <Textarea rows={2} value={c[s.id] ?? ''} onChange={(e) => setC({ ...c, [s.id]: e.target.value })} placeholder="What went well, and one next step" aria-label={`Comment for ${s.name}`} />
            {!(c[s.id] ?? '').trim() && (
              <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-nile" onClick={() => setC({ ...c, [s.id]: `${s.name.split(' ')[0]} works steadily in live lessons. Next step: review the stoichiometry worked examples before the end-of-topic test.` })}>
                <Sparkles className="h-3.5 w-3.5" />Suggest a draft from this term’s marks
              </button>
            )}
          </Card>
        ))}
      </div>
    </>
  )
}

