import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PlayCircle, FileText, Download, CheckCircle2, ChevronDown, Play, Pause, Volume2, Maximize, BookOpen, FileQuestion, NotebookText, Video, Newspaper, MessageCircle, Plus, Gauge } from 'lucide-react'
import { SubjectArt } from '../../components/SubjectArt'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Modal, PageHeader, Progress, SearchInput, Segmented, Select, Tabs, Textarea, cn, useToast } from '../../components/ui'
import { assignments, courseById, courses, forumPosts, library, teacherById, type LibItem } from '../../data/school'
import { fmtDate, fmtDay, relative } from '../../lib/format'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')
const tints = ['bg-nile-tint text-nile', 'bg-info-tint text-info', 'bg-crane-tint text-crane-ink', 'bg-good-tint text-good', 'bg-warn-tint text-warn', 'bg-bad-tint text-bad', 'bg-nile-tint text-nile', 'bg-info-tint text-info']

export function Courses() {
  return (
    <>
      <PageHeader title="My subjects" description="Year 10 · Cambridge IGCSE · 8 subjects" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => {
          const t = teacherById(c.teacherId)
          const lessons = c.topics.flatMap((x) => x.lessons)
          return (
            <Link key={c.id} to={`/student/courses/${c.id}`} className="card flex flex-col overflow-hidden transition-colors hover:border-nile">
              <SubjectArt subject={c.subject} className="aspect-[300/120] w-full" />
              <div className="flex flex-1 flex-col p-5">
              <div className="min-w-0"><p className="truncate text-[16px] font-semibold">{short(c.subject)}</p><p className="truncate text-[13.5px] text-muted">{t.name}</p></div>
              <p className="mt-4 text-[13.5px] text-muted">Next: <span className="font-medium text-ink">{c.nextTopic}</span></p>
              <div className="mt-auto pt-4">
                <div className="mb-1.5 flex justify-between text-[12.5px] text-muted"><span>{lessons.filter((l) => l.watched).length} of {lessons.length} lessons done</span><span className="num">{c.progress}% of course</span></div>
                <Progress value={c.progress} label={`${c.subject} progress`} />
              </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export function CourseDetail() {
  const { id = 'c-chem10' } = useParams()
  const c = courseById(id) ?? courses[0]
  const t = teacherById(c.teacherId)
  const [tab, setTab] = useState<'lessons' | 'work' | 'about'>('lessons')
  const [open, setOpen] = useState<string[]>([c.topics[2]?.id ?? c.topics[0].id])
  const work = assignments.filter((a) => a.courseId === c.id)
  return (
    <>
      <PageHeader back={{ to: '/student/courses', label: 'My subjects' }} title={short(c.subject)} description={`${c.className} · ${t.name}`}
        actions={<Button to="/student/messages" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Message {t.name.split(' ')[0]} {t.name.split(' ').slice(-1)}</Button>} />
      <SubjectArt subject={c.subject} className="mb-6 aspect-[300/70] w-full rounded-panel" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <p className="text-[13px] font-medium text-muted">Course progress</p>
          <div className="mt-2 flex items-center gap-4"><Progress value={c.progress} className="h-2.5" label="Course progress" /><span className="num text-[20px] font-semibold">{c.progress}%</span></div>
          <p className="mt-2 text-[13.5px] text-muted">Next lesson: <span className="font-medium text-ink">{c.nextTopic}</span></p>
        </Card>
        <Card><p className="text-[13px] font-medium text-muted">Work set</p><p className="num mt-1 text-[24px] font-semibold">{work.length}</p><p className="text-[13px] text-muted">{work.filter((w) => w.status === 'To do').length} to do</p></Card>
      </div>
      <Tabs value={tab} onChange={setTab} items={[{ value: 'lessons', label: 'Lessons' }, { value: 'work', label: 'Homework and tests', count: work.length }, { value: 'about', label: 'About this course' }]} />
      {tab === 'lessons' && (
        <div className="space-y-3">
          {c.topics.map((tp, i) => {
            const isOpen = open.includes(tp.id)
            const done = tp.lessons.filter((l) => l.watched).length
            return (
              <Card key={tp.id} pad={false}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== tp.id) : [...o, tp.id]))} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                  <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sunken text-[14px] font-bold text-muted">{i + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold">{tp.title}</span><span className="text-[13px] text-muted">{tp.lessons.length ? `${done} of ${tp.lessons.length} lessons watched` : 'Starts later this term'}</span></span>
                  {tp.lessons.length > 0 && done === tp.lessons.length && <Badge tone="good">Done</Badge>}
                  <ChevronDown className={cn('h-5 w-5 text-muted transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && tp.lessons.length > 0 && (
                  <ul className="border-t border-line">
                    {tp.lessons.map((l) => (
                      <li key={l.id}>
                        <Link to={`/student/courses/${c.id}/lesson/${l.id}`} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-sunken/60 sm:px-5">
                          {l.watched ? <CheckCircle2 className="h-5 w-5 shrink-0 text-good" /> : l.recording ? <PlayCircle className="h-5 w-5 shrink-0 text-nile" /> : <Video className="h-5 w-5 shrink-0 text-bad" />}
                          <span className="min-w-0 flex-1"><span className="block truncate text-[14.5px] font-medium">{l.title}</span><span className="text-[12.5px] text-muted">{fmtDay(l.date)} · {l.recording ? `Recording, ${l.duration}` : 'Live today, recording after class'} · {l.notes.length} file{l.notes.length > 1 ? 's' : ''}</span></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )
          })}
        </div>
      )}
      {tab === 'work' && (
        <Card pad={false}>
          <ul className="divide-y divide-line">
            {work.map((a) => (
              <li key={a.id}><Link to={a.type === 'Quiz' ? `/student/quiz/${a.id}` : `/student/assignments/${a.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-sunken/60">
                <span className="min-w-0 flex-1"><span className="block font-semibold">{a.title}</span><span className="text-[13px] text-muted">{a.type} · due {fmtDay(a.due)}</span></span>
                <StatusBadge status={a.status} mark={a.mark} max={a.maxMark} />
              </Link></li>
            ))}
          </ul>
        </Card>
      )}
      {tab === 'about' && (
        <Card>
          <div className="flex items-center gap-4"><Avatar name={t.name} size={56} /><div><p className="font-semibold">{t.name}</p><p className="text-[14px] text-muted">{t.title}</p></div></div>
          <p className="mt-4 max-w-prose text-[15px] text-muted">{t.bio}</p>
          <p className="mt-4 max-w-prose text-[15px]">This course follows the Cambridge IGCSE {short(c.subject)} syllabus over two years. Learners sit the final examination in May/June of Year 11. Teachers set homework weekly and an end-of-topic test after each topic.</p>
        </Card>
      )}
    </>
  )
}

export function StatusBadge({ status, mark, max }: { status: string; mark?: number; max?: number }) {
  if (status === 'Marked') return <Badge tone="good">{mark}/{max}</Badge>
  if (status === 'Submitted') return <Badge tone="info">Submitted</Badge>
  if (status === 'Late') return <Badge tone="bad">Overdue</Badge>
  if (status === 'Missing') return <Badge tone="bad">Missing</Badge>
  return <Badge tone="crane">To do</Badge>
}

export function LessonView() {
  const { id = 'c-chem10', lessonId = 'l7' } = useParams()
  const c = courseById(id) ?? courses[0]
  const lessons = c.topics.flatMap((t) => t.lessons)
  const l = lessons.find((x) => x.id === lessonId) ?? lessons[0]
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState('1')
  const [q, setQ] = useState('')
  const toast = useToast()
  const idx = lessons.indexOf(l)
  return (
    <>
      <PageHeader back={{ to: `/student/courses/${c.id}`, label: short(c.subject) }} title={l.title} description={`${fmtDate(l.date, { weekday: 'long', day: 'numeric', month: 'long' })} · ${teacherById(c.teacherId).name}`} />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {l.recording ? (
            <div className="overflow-hidden rounded-panel bg-[#0d1714] text-white">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden text-white">
                <SubjectArt subject={c.subject} className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative px-6 text-center"><p className="font-display text-[26px] sm:text-[36px]">{l.title}</p><p className="mt-2 text-[14px] text-white/80">Recorded live lesson · {l.duration}</p></div>
                <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'} className="absolute inset-0 flex items-center justify-center">
                  {!playing && <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f5a4a] text-white shadow-pop"><Play className="ml-1 h-7 w-7" /></span>}
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
                <span className="num text-[12.5px] text-white/70">{playing ? '04:12' : '00:00'} / 48:30</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-[#f0ba48]" style={{ width: playing ? '9%' : '0%' }} /></div>
                <label className="flex items-center gap-1 text-[12.5px]"><Gauge className="h-4 w-4" /><select value={speed} onChange={(e) => setSpeed(e.target.value)} className="bg-transparent" aria-label="Playback speed">{['0.75', '1', '1.25', '1.5', '2'].map((s) => <option key={s} value={s} className="text-black">{s}×</option>)}</select></label>
                <Volume2 className="hidden h-5 w-5 sm:block" /><Maximize className="hidden h-5 w-5 sm:block" />
              </div>
            </div>
          ) : (
            <Card className="flex flex-col items-center py-12 text-center">
              <Video className="h-8 w-8 text-bad" /><p className="mt-3 text-[18px] font-semibold">This lesson is live today at 09:00</p><p className="text-muted">The recording appears here about an hour after the class ends.</p>
              <Button to="/live/student" variant="danger" className="mt-5">Join the live lesson</Button>
            </Card>
          )}
          <Card>
            <CardHeader title="Lesson summary" description="Written by the teacher after class" />
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-ink/90">
              <li>Relative formula mass (Mr) is the sum of the relative atomic masses in a formula.</li>
              <li>Molar mass M has the same number as Mr, in g/mol.</li>
              <li>Use n = m ÷ M to convert between mass and moles. Always include units.</li>
            </ul>
          </Card>
          <Card>
            <CardHeader title="Ask about this lesson" description="Your question goes to the subject forum. Classmates and your teacher can answer." />
            <Textarea rows={3} value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example: why do we use 35.5 for chlorine?" aria-label="Your question" />
            <Button className="mt-3" disabled={!q.trim()} onClick={() => { setQ(''); toast('Question posted to the Chemistry forum') }}>Post question</Button>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Notes and files" />
            <ul className="space-y-2">
              {l.notes.map((n) => (
                <li key={n} className="flex items-center gap-3 rounded-ctl border border-line px-3 py-2.5">
                  <FileText className="h-5 w-5 shrink-0 text-nile" /><span className="min-w-0 flex-1 truncate text-[14px] font-medium">{n}</span>
                  <button type="button" onClick={() => toast(`Downloading ${n}`, 'info')} aria-label={`Download ${n}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-sunken hover:text-ink"><Download className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="In this topic" />
            <ol className="space-y-1">
              {lessons.map((x, i) => (
                <li key={x.id}><Link to={`/student/courses/${c.id}/lesson/${x.id}`} className={cn('flex items-center gap-3 rounded-ctl px-2 py-2 text-[14px]', x.id === l.id ? 'bg-nile-tint font-semibold text-nile' : 'hover:bg-sunken')}>
                  {x.watched ? <CheckCircle2 className="h-4 w-4 shrink-0 text-good" /> : <span className="num w-4 text-center text-[12px] text-muted">{i + 1}</span>}<span className="truncate">{x.title}</span>
                </Link></li>
              ))}
            </ol>
          </Card>
          <div className="flex gap-3">
            {idx > 0 && <Button to={`/student/courses/${c.id}/lesson/${lessons[idx - 1].id}`} variant="secondary" className="flex-1">Previous lesson</Button>}
            {idx < lessons.length - 1 && <Button to={`/student/courses/${c.id}/lesson/${lessons[idx + 1].id}`} className="flex-1">Next lesson</Button>}
          </div>
        </div>
      </div>
    </>
  )
}

const kindIcon: Record<LibItem['kind'], typeof BookOpen> = { 'E-book': BookOpen, 'Past paper': FileQuestion, 'Revision notes': NotebookText, Video: Video, Journal: Newspaper }
export function LibraryPage() {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'All' | LibItem['kind']>('All')
  const [subject, setSubject] = useState('All subjects')
  const [level, setLevel] = useState('IGCSE')
  const [openItem, setOpenItem] = useState<LibItem | null>(null)
  const subjects = ['All subjects', ...Array.from(new Set(library.map((l) => l.subject)))]
  const items = library.filter((l) => (kind === 'All' || l.kind === kind) && (subject === 'All subjects' || l.subject === subject) && (level === 'All levels' || l.level === level || l.level === 'All') && (l.title + l.by).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Library" description="Cambridge e-books, past papers and mark schemes, revision notes from your teachers, and journals." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_200px_200px]">
        <SearchInput value={q} onChange={setQ} placeholder="Search titles and authors" />
        <Select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10" aria-label="Subject">{subjects.map((s) => <option key={s}>{s}</option>)}</Select>
        <Select value={level} onChange={(e) => setLevel(e.target.value)} className="h-10" aria-label="Level">{['All levels', 'Primary', 'Lower Secondary', 'IGCSE', 'AS & A Level'].map((s) => <option key={s}>{s}</option>)}</Select>
      </div>
      <div className="scroll-x mb-5"><Segmented value={kind} onChange={setKind} options={(['All', 'E-book', 'Past paper', 'Revision notes', 'Video', 'Journal'] as const).map((k) => ({ value: k, label: k === 'All' ? 'Everything' : k }))} /></div>
      {items.length === 0 ? <Card><EmptyState icon={<BookOpen className="h-5 w-5" />} title="Nothing matches those filters" body="Try a different subject or clear the search." action={<Button variant="secondary" onClick={() => { setQ(''); setKind('All'); setSubject('All subjects'); setLevel('All levels') }}>Clear filters</Button>} /></Card> : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((it) => {
            const I = kindIcon[it.kind]
            return (
              <li key={it.id}>
                <button type="button" onClick={() => setOpenItem(it)} className="card flex h-full w-full gap-4 p-4 text-left transition-colors hover:border-nile">
                  <span className="relative h-[84px] w-16 shrink-0 overflow-hidden rounded-lg shadow-lift">
                    <SubjectArt subject={it.subject} className="absolute inset-0 h-full w-full" />
                    <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-[#0f5a4a]"><I className="h-3.5 w-3.5" /></span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold text-muted">{it.kind} · {it.subject}</span>
                    <span className="mt-0.5 block font-semibold leading-snug">{it.title}</span>
                    <span className="mt-1 block text-[13px] text-muted">{it.by}{it.size ? ` · ${it.size}` : ''}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-6 text-[13px] text-muted">Cambridge materials are provided under the school’s licence for enrolled learners only and cannot be shared outside Roberts College.</p>
      <Modal open={!!openItem} onClose={() => setOpenItem(null)} title={openItem?.title ?? ''} description={openItem ? `${openItem.kind} · ${openItem.by}` : ''} size="lg"
        footer={<><Button variant="secondary" onClick={() => setOpenItem(null)}>Close</Button><Button icon={<BookOpen className="h-4 w-4" />} onClick={() => setOpenItem(null)}>Open reader</Button></>}>
        <div className="pattern-paper flex aspect-[4/3] items-center justify-center rounded-card border border-line bg-sunken"><p className="rounded-full bg-surface px-3 py-1 text-[13px] text-muted">The document reader opens here, with page navigation, search and highlights.</p></div>
      </Modal>
    </>
  )
}

export function Forums() {
  const [open, setOpen] = useState(false)
  const [thread, setThread] = useState<string | null>('f2')
  const toast = useToast()
  const t = forumPosts.find((f) => f.id === thread)
  return (
    <>
      <PageHeader title="Discussion forums" description="Ask and answer questions with your class. Teachers read every forum." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Ask a question</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card pad={false}>
          <ul className="divide-y divide-line">
            {forumPosts.map((f) => (
              <li key={f.id}><button type="button" onClick={() => setThread(f.id)} className={cn('w-full px-5 py-4 text-left hover:bg-sunken/60', thread === f.id && 'bg-nile-tint/50')}>
                <p className="text-[12.5px] font-semibold text-muted">{f.course}</p>
                <p className="mt-0.5 font-semibold">{f.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-muted"><span>{f.author}</span><span>{f.replies} replies</span><span>{relative(f.last)}</span>{f.solved && <Badge tone="good">Answered</Badge>}</p>
              </button></li>
            ))}
          </ul>
        </Card>
        {t && (
          <Card>
            <p className="text-[12.5px] font-semibold text-muted">{t.course}</p>
            <h2 className="mt-1 text-[19px] font-semibold">{t.title}</h2>
            <div className="mt-5 space-y-5">
              {[
                { who: t.author, text: 'When we solve simultaneous equations, is elimination always faster than substitution? I keep using substitution and it takes long.' },
                { who: 'Felix Oryem', text: 'I use elimination when the coefficients already match. Otherwise substitution.' },
                { who: 'Ms Sarah Nambi', text: 'Good question. Elimination is usually faster when you can make one variable’s coefficients equal with a single multiplication. Substitution is better when one equation already has x = or y =. We will practise choosing on Wednesday.', teacher: true },
              ].map((p, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar name={p.who} size={34} />
                  <div className={cn('min-w-0 flex-1 rounded-card p-3.5', p.teacher ? 'bg-nile-tint' : 'bg-sunken')}>
                    <p className="text-[13.5px] font-semibold">{p.who}{p.teacher && <span className="ml-2 text-nile">Teacher</span>}</p>
                    <p className="mt-1 text-[14.5px]">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2"><Input placeholder="Write a reply" aria-label="Reply" /><Button onClick={() => toast('Reply posted')}>Reply</Button></div>
          </Card>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Ask a question" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast('Question posted') }}>Post question</Button></>}>
        <div className="space-y-4">
          <Field label="Subject" htmlFor="fq-sub"><Select id="fq-sub">{courses.map((c) => <option key={c.id}>{short(c.subject)} · Year 10</option>)}</Select></Field>
          <Field label="Question" htmlFor="fq-title"><Input id="fq-title" placeholder="One line that sums up your question" /></Field>
          <Field label="Details" htmlFor="fq-body" optional><Textarea id="fq-body" rows={4} /></Field>
        </div>
      </Modal>
    </>
  )
}
