import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, FileText, Download, CheckCircle2, AlertTriangle, Timer, Shuffle, EyeOff, ListChecks, ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { Badge, Button, Card, CardHeader, FileDrop, KV, Modal, Notice, PageHeader, Tabs, Textarea, cn, useToast, type PickedFile } from '../../components/ui'
import { assignments, quiz, teacherById, courseById } from '../../data/school'
import { fmtDateTime, fmtDay, relative } from '../../lib/format'
import { StatusBadge } from './Learning'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')

export function Assignments() {
  const [tab, setTab] = useState<'todo' | 'submitted' | 'marked'>('todo')
  const groups = {
    todo: assignments.filter((a) => a.status === 'To do' || a.status === 'Late'),
    submitted: assignments.filter((a) => a.status === 'Submitted'),
    marked: assignments.filter((a) => a.status === 'Marked'),
  }
  const list = groups[tab].sort((a, b) => (tab === 'todo' ? a.due.localeCompare(b.due) : b.due.localeCompare(a.due)))
  return (
    <>
      <PageHeader title="Homework and quizzes" description="Everything your teachers have set, with deadlines on Kampala time." />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'todo', label: 'To do', count: groups.todo.length }, { value: 'submitted', label: 'Submitted', count: groups.submitted.length }, { value: 'marked', label: 'Marked', count: groups.marked.length }]} />
      <Card pad={false}>
        <ul className="divide-y divide-line">
          {list.map((a) => (
            <li key={a.id}>
              <Link to={a.type === 'Quiz' && a.status === 'To do' ? `/student/quiz/${a.id}` : `/student/assignments/${a.id}`} className="grid gap-2 px-5 py-4 hover:bg-sunken/60 sm:grid-cols-[1fr_auto] sm:items-center">
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{a.title}</span><Badge>{a.type}</Badge></span>
                  <span className="mt-0.5 block text-[13.5px] text-muted">{short(a.subject)} · {teacherById(courseById(a.courseId).teacherId).name}</span>
                </span>
                <span className="flex items-center gap-3 sm:justify-end">
                  <span className={cn('flex items-center gap-1.5 text-[13.5px]', a.status === 'Late' ? 'font-semibold text-bad' : 'text-muted')}><Clock className="h-4 w-4" />{a.status === 'Late' ? `Was due ${fmtDay(a.due)}` : tab === 'todo' ? `Due ${fmtDay(a.due)}, ${relative(a.due)}` : `Due ${fmtDay(a.due)}`}</span>
                  <StatusBadge status={a.status} mark={a.mark} max={a.maxMark} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export function AssignmentDetail() {
  const { id = 'a1' } = useParams()
  const a = assignments.find((x) => x.id === id) ?? assignments[0]
  const t = teacherById(courseById(a.courseId).teacherId)
  const [files, setFiles] = useState<PickedFile[]>([])
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(a.status === 'Submitted')
  const toast = useToast()
  return (
    <>
      <PageHeader back={{ to: '/student/assignments', label: 'Homework and quizzes' }} title={a.title} description={`${short(a.subject)} · ${a.type} · set by ${t.name}`} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Instructions" />
            <p className="max-w-prose text-[15.5px] leading-relaxed">{a.instructions}</p>
            <ul className="mt-5 space-y-2">
              {['Worksheet.pdf'].map((f) => <li key={f} className="flex items-center gap-3 rounded-ctl border border-line px-3 py-2.5"><FileText className="h-5 w-5 text-nile" /><span className="flex-1 text-[14px] font-medium">{a.title} – {f}</span><Download className="h-4 w-4 text-muted" /></li>)}
            </ul>
          </Card>
          {a.status === 'Marked' ? (
            <Card>
              <CardHeader title="Feedback" description={`Marked by ${t.name}`} />
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-good-tint"><span className="num text-[22px] font-bold text-good">{a.mark}</span><span className="num text-[12px] text-good">of {a.maxMark}</span></div>
                <p className="text-[15px]">{a.feedback}</p>
              </div>
            </Card>
          ) : submitted ? (
            <Notice tone="good" title="Submitted">Your work was handed in {a.status === 'Submitted' ? 'on 4 October at 16:02' : 'just now'}. You can replace it until the deadline. {t.name} will mark it and you’ll get a notification.</Notice>
          ) : (
            <Card>
              <CardHeader title="Your work" description="Upload photos of written work, a PDF or a Word document." />
              {a.status === 'Late' && <Notice tone="bad" className="mb-4">This was due {fmtDay(a.due)}. You can still hand it in; it will be marked late.</Notice>}
              <FileDrop files={files} onChange={setFiles} />
              <div className="mt-4"><label htmlFor="sub-note" className="field-label">Note to your teacher <span className="font-normal text-faint">(optional)</span></label><Textarea id="sub-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></div>
              <Button className="mt-5" size="lg" disabled={!files.length} onClick={() => { setSubmitted(true); toast('Homework handed in') }}>Hand in homework</Button>
              {!files.length && <p className="mt-2 text-[13px] text-muted">Add at least one file to hand in.</p>}
            </Card>
          )}
        </div>
        <Card className="h-fit">
          <KV cols={1} items={[
            { k: 'Due', v: `${fmtDateTime(a.due)} (${relative(a.due)})` },
            { k: 'Marks', v: `${a.maxMark}` },
            { k: 'Status', v: <StatusBadge status={submitted && a.status !== 'Marked' ? 'Submitted' : a.status} mark={a.mark} max={a.maxMark} /> },
            { k: 'Teacher', v: t.name },
          ]} />
          <Button to="/student/messages" variant="secondary" block className="mt-6">Ask {t.name.split(' ')[0]} {t.name.split(' ').slice(-1)} a question</Button>
        </Card>
      </div>
    </>
  )
}

export function Quiz() {
  const nav = useNavigate()
  const toast = useToast()
  const [stage, setStage] = useState<'intro' | 'taking' | 'done'>('intro')
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(quiz.questions.map(() => null))
  const [flags, setFlags] = useState<boolean[]>(quiz.questions.map(() => false))
  const [left, setLeft] = useState(quiz.minutes * 60)
  const [confirm, setConfirm] = useState(false)
  const [awayCount, setAwayCount] = useState(0)
  // Questions are shuffled per learner; the order is fixed for this attempt.
  const order = useMemo(() => [2, 0, 5, 1, 7, 3, 6, 4], [])
  useEffect(() => {
    if (stage !== 'taking') return
    const t = setInterval(() => setLeft((l) => (l <= 1 ? (setStage('done'), 0) : l - 1)), 1000)
    const vis = () => { if (document.hidden) { setAwayCount((n) => n + 1); toast('Leaving the quiz page is recorded for your teacher', 'bad') } }
    document.addEventListener('visibilitychange', vis)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', vis) }
  }, [stage, toast])

  const q = quiz.questions[order[i]]
  const answered = answers.filter((a) => a !== null).length
  const score = order.reduce((s, qi, k) => s + (answers[k] === quiz.questions[qi].answer ? 1 : 0), 0)

  if (stage === 'intro') return (
    <div className="mx-auto max-w-[680px]">
      <PageHeader back={{ to: '/student/assignments', label: 'Homework and quizzes' }} title={quiz.title} description="Chemistry · Year 10 · set by Mr Samuel Okello" />
      <Card>
        <h2 className="text-[17px] font-semibold">Before you start</h2>
        <ul className="mt-4 space-y-3.5 text-[15px]">
          <li className="flex gap-3"><Timer className="h-5 w-5 shrink-0 text-nile" />{quiz.questions.length} questions, {quiz.minutes} minutes. The timer keeps running if you close the page.</li>
          <li className="flex gap-3"><ListChecks className="h-5 w-5 shrink-0 text-nile" />Finish in one sitting. It submits automatically when time runs out.</li>
          <li className="flex gap-3"><Shuffle className="h-5 w-5 shrink-0 text-nile" />Questions are in a different order for each learner.</li>
          <li className="flex gap-3"><EyeOff className="h-5 w-5 shrink-0 text-nile" />If you switch to another tab or app, your teacher sees how many times.</li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={() => setStage('taking')}>Start quiz</Button><Button size="lg" variant="secondary" to="/student/assignments">Not now</Button></div>
      </Card>
    </div>
  )

  if (stage === 'done') return (
    <div className="mx-auto max-w-[680px] text-center">
      <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-good-tint text-good"><CheckCircle2 className="h-7 w-7" /></span>
      <h1 className="h-display mt-4 text-[32px]">Quiz submitted</h1>
      <p className="num mt-3 font-display text-[48px] leading-none">{score}/{quiz.questions.length}</p>
      <p className="mt-2 text-muted">Multiple-choice questions are marked straight away. Your teacher will add comments.</p>
      {awayCount > 0 && <Notice tone="warn" className="mt-6 text-left">You left the quiz page {awayCount} time{awayCount > 1 ? 's' : ''}. This is shown to your teacher.</Notice>}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={() => nav('/student/assignments')}>Back to homework</Button><Button variant="secondary" to="/student/tutor">Revise mistakes with the study assistant</Button></div>
    </div>
  )

  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0')
  return (
    <div className="mx-auto max-w-[760px]">
      <div className="sticky top-16 z-10 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="min-w-0 truncate font-semibold">{quiz.title}</p>
        <span className={cn('num inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] font-bold', left < 120 ? 'bg-bad-tint text-bad' : 'bg-sunken text-ink')} aria-live="polite"><Clock className="h-4 w-4" />{mm}:{ss}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5" aria-label="Questions">
        {order.map((_, k) => (
          <button key={k} type="button" onClick={() => setI(k)} aria-label={`Question ${k + 1}${answers[k] !== null ? ', answered' : ''}${flags[k] ? ', flagged' : ''}`}
            className={cn('num relative h-9 w-9 rounded-lg text-[13.5px] font-bold', k === i ? 'bg-nile text-nile-on' : answers[k] !== null ? 'bg-nile-tint text-nile' : 'bg-surface border border-line text-muted')}>
            {k + 1}{flags[k] && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-crane" />}
          </button>
        ))}
      </div>
      <Card className="sm:p-8">
        <p className="text-[13px] font-semibold text-muted">Question {i + 1} of {order.length}</p>
        <h2 className="mt-2 text-[19px] font-semibold leading-snug">{q.q}</h2>
        <fieldset className="mt-6 space-y-2.5">
          <legend className="sr-only">Choose one answer</legend>
          {q.options.map((o, k) => (
            <label key={o} className={cn('flex cursor-pointer items-center gap-3 rounded-ctl border p-4 text-[15.5px] transition-colors', answers[i] === k ? 'border-nile bg-nile-tint/60 ring-1 ring-nile' : 'border-line hover:border-faint')}>
              <input type="radio" name={`q${i}`} checked={answers[i] === k} onChange={() => setAnswers((a) => a.map((x, j) => (j === i ? k : x)))} className="h-4 w-4 accent-[rgb(var(--nile))]" />
              <span className="num">{o}</span>
            </label>
          ))}
        </fieldset>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" icon={<Flag className="h-4 w-4" />} onClick={() => setFlags((f) => f.map((x, j) => (j === i ? !x : x)))}>{flags[i] ? 'Unflag' : 'Flag for review'}</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setI(i - 1)} disabled={i === 0} icon={<ChevronLeft className="h-4 w-4" />}>Previous</Button>
            {i < order.length - 1 ? <Button onClick={() => setI(i + 1)}>Next <ChevronRight className="h-4 w-4" /></Button> : <Button onClick={() => setConfirm(true)}>Finish quiz</Button>}
          </div>
        </div>
      </Card>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Submit your quiz?" size="sm"
        footer={<><Button variant="secondary" onClick={() => setConfirm(false)}>Keep checking</Button><Button onClick={() => setStage('done')}>Submit quiz</Button></>}>
        <p className="text-[15px]">You have answered {answered} of {order.length} questions.{answered < order.length && ' Unanswered questions score zero.'}</p>
        {flags.some(Boolean) && <p className="mt-2 flex items-center gap-2 text-[14px] text-warn"><AlertTriangle className="h-4 w-4" />{flags.filter(Boolean).length} question flagged for review.</p>}
      </Modal>
    </div>
  )
}
