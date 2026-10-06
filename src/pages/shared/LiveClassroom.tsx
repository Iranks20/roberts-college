import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Mic, MicOff, Video, VideoOff, Hand, MessageSquare, Users, PenLine, Presentation, MonitorUp, LogOut, Circle, Eraser, Trash2,
  Wifi, Signal, X, Send, Check, ChevronLeft, ChevronRight, FileText, Download, ClipboardCheck, Volume2,
} from 'lucide-react'
import { Avatar, Badge, Button, Modal, Switch, cn, useToast } from '../../components/ui'
import { y10Students } from '../../data/school'

type Person = { id: string; name: string; teacher?: boolean; mic: boolean; hand: boolean; joined: string; poor?: boolean }
const roster: Person[] = [
  { id: 't', name: 'Mr Samuel Okello', teacher: true, mic: true, hand: false, joined: '08:58' },
  ...y10Students.filter((s) => s.id !== 's-amani').map((s, i) => ({ id: s.id, name: s.name, mic: false, hand: i === 3, joined: ['08:59', '09:00', '09:01', '09:00', '09:06', '09:02', '09:00'][i] ?? '09:00', poor: i === 5 })),
]
const initialChat = [
  { who: 'Mr Samuel Okello', text: 'Good morning everyone. Open the mole calculations sheet from Files.', t: '09:02' },
  { who: 'Felix Oryem', text: 'Good morning sir', t: '09:02' },
  { who: 'Gloria Nalubega', text: 'Is n = m ÷ M the same as moles = mass ÷ molar mass?', t: '09:11' },
  { who: 'Mr Samuel Okello', text: 'Exactly right, Gloria. Same formula, shorter symbols.', t: '09:12' },
]
const slides = [
  { title: 'Moles and molar mass', lines: ['Learning objectives', '• Define the mole and the Avogadro constant', '• Calculate molar mass (M) from Ar values', '• Convert between mass and moles'] },
  { title: 'The mole', lines: ['1 mole = 6.02 × 10²³ particles', 'Molar mass M = Mr in g/mol', 'Example: M(H₂O) = 2(1) + 16 = 18 g/mol'] },
  { title: 'n = m ÷ M', lines: ['n  amount (mol)', 'm  mass (g)', 'M  molar mass (g/mol)', 'Try: how many moles in 88 g of CO₂?'] },
]

export default function LiveClassroom() {
  const { role = 'student' } = useParams()
  const teacher = role === 'teacher'
  const nav = useNavigate()
  const toast = useToast()
  const [joined, setJoined] = useState(false)
  const [mic, setMic] = useState(teacher)
  const [cam, setCam] = useState(true)
  const [hand, setHand] = useState(false)
  const [audioOnly, setAudioOnly] = useState(false)
  const [stage, setStage] = useState<'board' | 'slides' | 'speaker'>('board')
  const [panel, setPanel] = useState<'chat' | 'people' | 'files' | 'register' | null>('chat')
  const [chat, setChat] = useState(initialChat)
  const [msg, setMsg] = useState('')
  const [people, setPeople] = useState(() => (teacher ? [roster[0], { id: 's-amani', name: 'Amani Nakato', mic: false, hand: false, joined: '09:00' }, ...roster.slice(1)] : roster))
  const [slide, setSlide] = useState(2)
  const [recording, setRecording] = useState(true)
  const [ending, setEnding] = useState(false)
  const [ended, setEnded] = useState(false)
  const [elapsed, setElapsed] = useState(20 * 60)
  useEffect(() => { if (!joined) return; const t = setInterval(() => setElapsed((e) => e + 1), 1000); return () => clearInterval(t) }, [joined])
  useEffect(() => { if (window.innerWidth < 1024) setPanel(null) }, [])

  const me = teacher ? 'Mr Samuel Okello' : 'Amani Nakato'
  const send = () => { if (!msg.trim()) return; setChat((c) => [...c, { who: me, text: msg.trim(), t: '09:2' + (c.length % 10) }]); setMsg('') }
  const mm = Math.floor(elapsed / 60)
  const hands = people.filter((p) => p.hand).length + (hand ? 1 : 0)
  const leave = () => nav(teacher ? '/teacher' : '/student')

  if (!joined) return <Lobby teacher={teacher} mic={mic} cam={cam} setMic={setMic} setCam={setCam} audioOnly={audioOnly} setAudioOnly={setAudioOnly} onJoin={() => setJoined(true)} onBack={leave} />
  if (ended) return <Ended onDone={leave} count={people.length} />

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0d1714] text-white" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-3 sm:px-5">
        <button type="button" onClick={leave} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10" aria-label="Back to portal"><ChevronLeft className="h-5 w-5" /></button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold">Year 10 Chemistry · Moles and molar mass</p>
          <p className="num text-[12px] text-white/60">Started 09:00 · {mm} min · {people.length + (teacher ? 0 : 1)} in class</p>
        </div>
        {recording && <span className="hidden items-center gap-1.5 rounded-full bg-[#c4392f] px-2.5 py-1 text-[12px] font-bold sm:inline-flex"><Circle className="live-dot h-2.5 w-2.5 fill-current" /> Recording</span>}
        <span className="hidden items-center gap-1.5 text-[12.5px] text-white/70 md:flex"><Wifi className="h-4 w-4" /> Good connection</span>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Stage */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-2 sm:p-3">
          <div className="flex items-center gap-1">
            {([['board', 'Whiteboard', PenLine], ['slides', 'Slides', Presentation], ['speaker', 'Teacher', Video]] as const).map(([k, l, I]) => (
              <button key={k} type="button" onClick={() => setStage(k)} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold', stage === k ? 'bg-white text-[#0d1714]' : 'text-white/75 hover:bg-white/10')}><I className="h-3.5 w-3.5" />{l}</button>
            ))}
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#f7f5ef] text-[#1b2a26]">
            {stage === 'board' && <Whiteboard canDraw={teacher || hand} />}
            {stage === 'slides' && (
              <div className="flex h-full flex-col justify-center p-6 sm:p-12">
                <p className="text-[12px] font-semibold text-[#5b6b66]">Slide {slide + 1} of {slides.length}</p>
                <h2 className="mt-2 font-display text-[28px] sm:text-[44px]">{slides[slide].title}</h2>
                <ul className="mt-5 space-y-2 text-[16px] sm:text-[22px]">{slides[slide].lines.map((l) => <li key={l}>{l}</li>)}</ul>
                {teacher && (
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button type="button" aria-label="Previous slide" onClick={() => setSlide((s) => Math.max(0, s - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1b2a26] text-white"><ChevronLeft className="h-5 w-5" /></button>
                    <button type="button" aria-label="Next slide" onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1b2a26] text-white"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                )}
              </div>
            )}
            {stage === 'speaker' && (
              <div className="flex h-full items-center justify-center bg-[#1a2a26]">
                <div className="text-center text-white"><Avatar name="Mr Samuel Okello" size={120} className="!bg-[#2c4a42] !text-white" /><p className="mt-3 font-semibold">Mr Samuel Okello</p><p className="flex items-center justify-center gap-1 text-[13px] text-white/70"><Volume2 className="h-4 w-4" /> Speaking</p></div>
              </div>
            )}
          </div>
          {/* Film strip */}
          <div className="scroll-x">
            <div className="flex gap-2">
              {[...(teacher ? [] : [{ id: 'me', name: 'Amani Nakato', mic, hand, joined: '', teacher: false } as Person]), ...people].map((p) => (
                <div key={p.id} className={cn('relative flex h-[76px] w-[112px] shrink-0 items-center justify-center rounded-lg bg-[#1d2c28] sm:h-[88px] sm:w-[132px]', p.teacher && 'ring-2 ring-[#4abe9b]')}>
                  {(p.id === 'me' ? cam && !audioOnly : !audioOnly) ? <Avatar name={p.name} size={40} className="!bg-[#2c4a42] !text-white" /> : <VideoOff className="h-5 w-5 text-white/40" />}
                  <span className="absolute bottom-1 left-1.5 right-6 truncate text-[11px] text-white/85">{p.id === 'me' ? 'You' : p.teacher ? 'Teacher' : p.name.split(' ')[0]}</span>
                  <span className="absolute bottom-1 right-1.5">{p.mic ? <Mic className="h-3.5 w-3.5 text-[#4abe9b]" /> : <MicOff className="h-3.5 w-3.5 text-white/50" />}</span>
                  {p.hand && <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f0ba48] text-[#2a1c02]"><Hand className="h-3.5 w-3.5" /></span>}
                  {p.poor && <span className="absolute left-1.5 top-1.5"><Signal className="h-3.5 w-3.5 text-[#f0ba48]" /></span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        {panel && (
          <aside className="absolute inset-x-0 bottom-[72px] top-14 z-10 flex flex-col bg-[#13201c] lg:static lg:w-[340px] lg:border-l lg:border-white/10">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <p className="font-semibold">{{ chat: 'Class chat', people: 'People', files: 'Lesson files', register: 'Attendance' }[panel]}</p>
              <button type="button" onClick={() => setPanel(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10" aria-label="Close panel"><X className="h-4 w-4" /></button>
            </div>
            {panel === 'chat' && (
              <>
                <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                  {chat.map((c, i) => (
                    <li key={i}><p className="text-[12px] text-white/55"><span className={cn('font-semibold', c.who.startsWith('Mr') ? 'text-[#4abe9b]' : 'text-white/85')}>{c.who === me ? 'You' : c.who}</span> · {c.t}</p><p className="text-[14px]">{c.text}</p></li>
                  ))}
                </ol>
                <form className="flex gap-2 border-t border-white/10 p-3" onSubmit={(e) => { e.preventDefault(); send() }}>
                  <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message the class" aria-label="Chat message" className="h-10 min-w-0 flex-1 rounded-lg bg-white/10 px-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#4abe9b]" />
                  <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4abe9b] text-[#06201a]" aria-label="Send"><Send className="h-4 w-4" /></button>
                </form>
              </>
            )}
            {panel === 'people' && (
              <ul className="min-h-0 flex-1 overflow-y-auto p-2">
                {people.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5">
                    <Avatar name={p.name} size={32} className="!bg-[#2c4a42] !text-white" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-[14px]">{p.name}</span><span className="text-[12px] text-white/50">{p.teacher ? 'Teacher' : p.poor ? 'Weak connection' : 'Learner'}</span></span>
                    {p.hand && (teacher
                      ? <button type="button" onClick={() => { setPeople((ps) => ps.map((x) => x.id === p.id ? { ...x, hand: false, mic: true } : x)); toast(`${p.name.split(' ')[0]} can speak now`) }} className="rounded-md bg-[#f0ba48] px-2 py-1 text-[12px] font-bold text-[#2a1c02]">Let speak</button>
                      : <Hand className="h-4 w-4 text-[#f0ba48]" />)}
                    {teacher && !p.teacher && p.mic && <button type="button" aria-label={`Mute ${p.name}`} onClick={() => setPeople((ps) => ps.map((x) => x.id === p.id ? { ...x, mic: false } : x))} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10"><MicOff className="h-4 w-4" /></button>}
                  </li>
                ))}
              </ul>
            )}
            {panel === 'files' && (
              <ul className="space-y-2 p-3">
                {['Moles and molar mass – slides.pdf', 'Mole calculations practice.pdf', 'Periodic table (Ar values).pdf'].map((f) => (
                  <li key={f} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5"><FileText className="h-5 w-5 shrink-0 text-[#4abe9b]" /><span className="min-w-0 flex-1 truncate text-[13.5px]">{f}</span><button type="button" onClick={() => toast(`Downloading ${f}`, 'info')} aria-label={`Download ${f}`} className="text-white/70 hover:text-white"><Download className="h-4 w-4" /></button></li>
                ))}
                {teacher && <li><button type="button" className="mt-1 w-full rounded-lg border border-dashed border-white/25 py-2.5 text-[13.5px] text-white/75 hover:bg-white/5">Share a file with the class</button></li>}
              </ul>
            )}
            {panel === 'register' && (
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <p className="mb-3 rounded-lg bg-white/5 p-3 text-[13px] text-white/75">Filled in automatically from join times. Learners joining after 09:05 are marked late. Confirm at the end of the lesson.</p>
                <ul className="space-y-1">
                  {people.filter((p) => !p.teacher).map((p) => {
                    const late = p.joined > '09:05'
                    return (
                      <li key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <span className="min-w-0 flex-1 truncate text-[14px]">{p.name}</span>
                        <span className="num text-[12px] text-white/55">{p.joined}</span>
                        <span className={cn('rounded-full px-2 py-0.5 text-[11.5px] font-bold', late ? 'bg-[#f0ba48] text-[#2a1c02]' : 'bg-[#4abe9b] text-[#06201a]')}>{late ? 'Late' : 'Present'}</span>
                      </li>
                    )
                  })}
                  <li className="flex items-center gap-3 rounded-lg px-2 py-2 opacity-70"><span className="min-w-0 flex-1 truncate text-[14px]">Faith Nyakato</span><span className="text-[12px] text-white/55">not joined</span><span className="rounded-full bg-[#c4392f] px-2 py-0.5 text-[11.5px] font-bold">Absent</span></li>
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Controls */}
      <footer className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-t border-white/10 px-2 sm:px-5">
        <div className="hidden w-40 text-[12.5px] text-white/60 lg:block">{hands > 0 ? `${hands} hand${hands > 1 ? 's' : ''} raised` : 'No hands raised'}</div>
        <div className="flex flex-1 items-center justify-center gap-1 sm:gap-2 lg:flex-none">
          <Ctl label={mic ? 'Mute' : 'Unmute'} on={mic} onClick={() => setMic(!mic)} danger={!mic}>{mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}</Ctl>
          <Ctl label={cam ? 'Camera off' : 'Camera on'} on={cam} onClick={() => setCam(!cam)} danger={!cam}>{cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}</Ctl>
          {!teacher && <Ctl label={hand ? 'Lower hand' : 'Raise hand'} on={hand} active={hand} onClick={() => { setHand(!hand); if (!hand) toast('Hand raised. Mr Okello can see it.', 'info') }}><Hand className="h-5 w-5" /></Ctl>}
          {teacher && <Ctl label="Share screen" className="hidden sm:flex" onClick={() => toast('Choose a window or screen to share', 'info')}><MonitorUp className="h-5 w-5" /></Ctl>}
          {teacher && <Ctl label={recording ? 'Stop recording' : 'Record'} active={recording} onClick={() => setRecording(!recording)}><Circle className={cn('h-5 w-5', recording && 'fill-current')} /></Ctl>}
          <Ctl label="Chat" active={panel === 'chat'} onClick={() => setPanel(panel === 'chat' ? null : 'chat')}><MessageSquare className="h-5 w-5" /></Ctl>
          <Ctl label="People" active={panel === 'people'} onClick={() => setPanel(panel === 'people' ? null : 'people')} badge={teacher && hands ? hands : undefined}><Users className="h-5 w-5" /></Ctl>
          <Ctl label="Files" active={panel === 'files'} onClick={() => setPanel(panel === 'files' ? null : 'files')} className="hidden sm:flex"><FileText className="h-5 w-5" /></Ctl>
          {teacher && <Ctl label="Attendance" active={panel === 'register'} onClick={() => setPanel(panel === 'register' ? null : 'register')}><ClipboardCheck className="h-5 w-5" /></Ctl>}
        </div>
        <div className="flex justify-end lg:w-40">
          {teacher
            ? <button type="button" onClick={() => setEnding(true)} className="flex h-11 items-center gap-2 rounded-full bg-[#c4392f] px-3.5 text-[14px] font-bold sm:px-4" aria-label="End lesson"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">End lesson</span></button>
            : <button type="button" onClick={leave} className="flex h-11 items-center gap-2 rounded-full bg-[#c4392f] px-3.5 text-[14px] font-bold sm:px-4" aria-label="Leave lesson"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Leave</span></button>}
        </div>
      </footer>

      <Modal open={ending} onClose={() => setEnding(false)} title="End the lesson for everyone?" description="Learners leave the classroom and the recording is saved to the lesson page."
        footer={<><Button variant="secondary" onClick={() => setEnding(false)}>Keep teaching</Button><Button variant="danger" onClick={() => { setEnding(false); setEnded(true) }}>End lesson</Button></>}>
        <ul className="space-y-2 text-[14.5px] text-ink">
          <li className="flex gap-2"><Check className="h-5 w-5 text-good" />Attendance: {people.length - 1} present, 1 late, 1 absent</li>
          <li className="flex gap-2"><Check className="h-5 w-5 text-good" />Recording processed and published within about an hour</li>
          <li className="flex gap-2"><Check className="h-5 w-5 text-good" />Chat saved with the lesson</li>
        </ul>
      </Modal>
    </div>
  )
}

function Ctl({ children, label, onClick, on, active, danger, badge, className }: { children: React.ReactNode; label: string; onClick: () => void; on?: boolean; active?: boolean; danger?: boolean; badge?: number; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={active ?? on}
      className={cn('relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors sm:h-12 sm:w-12', danger ? 'bg-[#c4392f]' : active ? 'bg-[#f0ba48] text-[#2a1c02]' : 'bg-white/10 hover:bg-white/20', className)}>
      {children}
      {badge ? <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[#f0ba48] px-1.5 text-[11px] font-bold text-[#2a1c02]">{badge}</span> : null}
    </button>
  )
}

function Whiteboard({ canDraw }: { canDraw: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [colour, setColour] = useState('#1b2a26')
  const drawing = useRef(false)
  const draw = (clear = false) => {
    const c = ref.current; if (!c) return
    const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
    c.width = r.width * dpr; c.height = r.height * dpr
    const g = c.getContext('2d')!; g.scale(dpr, dpr)
    g.fillStyle = '#f7f5ef'; g.fillRect(0, 0, r.width, r.height)
    if (clear) return
    const s = Math.min(1.4, r.width / 560)
    g.fillStyle = '#1b2a26'; g.font = `${28 * s}px "Young Serif", Georgia, serif`; g.fillText('n = m ÷ M', 28 * s, 54 * s)
    g.font = `${17 * s}px "Hanken Grotesk", system-ui, sans-serif`
    ;['How many moles in 88 g of CO₂?', 'M(CO₂) = 12 + 2(16) = 44 g/mol', 'n = 88 ÷ 44'].forEach((t, i) => g.fillText(t, 28 * s, (100 + i * 34) * s))
    g.fillStyle = '#0f5a4a'; g.font = `600 ${20 * s}px "Hanken Grotesk", system-ui, sans-serif`; g.fillText('= 2 mol', 28 * s, 212 * s)
    g.strokeStyle = '#e9a92b'; g.lineWidth = 3; g.beginPath(); g.ellipse(70 * s, 205 * s, 58 * s, 22 * s, 0, 0, Math.PI * 2); g.stroke()
  }
  useEffect(() => { draw(); const on = () => draw(); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on) }, []) // eslint-disable-line
  const pos = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className={cn('h-full w-full touch-none', canDraw ? 'cursor-crosshair' : 'cursor-default')} aria-label="Shared whiteboard"
        onPointerDown={(e) => { if (!canDraw) return; drawing.current = true; const g = ref.current!.getContext('2d')!; const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y) }}
        onPointerMove={(e) => {
          if (!drawing.current) return
          const g = ref.current!.getContext('2d')!; const [x, y] = pos(e)
          g.strokeStyle = tool === 'eraser' ? '#f7f5ef' : colour; g.lineWidth = tool === 'eraser' ? 22 : 3; g.lineCap = 'round'; g.lineTo(x, y); g.stroke()
        }}
        onPointerUp={() => (drawing.current = false)} onPointerLeave={() => (drawing.current = false)} />
      {canDraw ? (
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl bg-white p-1 shadow-lift">
          <button type="button" aria-label="Pen" onClick={() => setTool('pen')} className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tool === 'pen' && 'bg-[#e3efeb]')}><PenLine className="h-4 w-4" /></button>
          {['#1b2a26', '#0f5a4a', '#be342a', '#2762aa'].map((c) => <button key={c} type="button" aria-label={`Colour ${c}`} onClick={() => { setColour(c); setTool('pen') }} className={cn('h-6 w-6 rounded-full border-2', colour === c && tool === 'pen' ? 'border-[#e9a92b]' : 'border-white')} style={{ background: c }} />)}
          <button type="button" aria-label="Eraser" onClick={() => setTool('eraser')} className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tool === 'eraser' && 'bg-[#e3efeb]')}><Eraser className="h-4 w-4" /></button>
          <button type="button" aria-label="Clear board" onClick={() => draw(true)} className="flex h-8 w-8 items-center justify-center rounded-lg"><Trash2 className="h-4 w-4" /></button>
        </div>
      ) : <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[12px] text-[#5b6b66]">Raise your hand to be invited to the board</p>}
    </div>
  )
}

function Lobby({ teacher, mic, cam, setMic, setCam, audioOnly, setAudioOnly, onJoin, onBack }: { teacher: boolean; mic: boolean; cam: boolean; setMic: (v: boolean) => void; setCam: (v: boolean) => void; audioOnly: boolean; setAudioOnly: (v: boolean) => void; onJoin: () => void; onBack: () => void }) {
  const name = teacher ? 'Mr Samuel Okello' : 'Amani Nakato'
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="grid w-full max-w-[920px] gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-panel bg-[#1a2a26]">
            {cam ? <Avatar name={name} size={96} className="!bg-[#2c4a42] !text-white" /> : <VideoOff className="h-10 w-10 text-white/40" />}
            <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[12.5px] text-white">{cam ? 'Camera preview' : 'Camera is off'}</span>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <button type="button" onClick={() => setMic(!mic)} aria-pressed={mic} className={cn('flex h-12 w-12 items-center justify-center rounded-full border', mic ? 'border-line bg-surface' : 'border-bad bg-bad text-white')} aria-label={mic ? 'Turn microphone off' : 'Turn microphone on'}>{mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}</button>
            <button type="button" onClick={() => setCam(!cam)} aria-pressed={cam} className={cn('flex h-12 w-12 items-center justify-center rounded-full border', cam ? 'border-line bg-surface' : 'border-bad bg-bad text-white')} aria-label={cam ? 'Turn camera off' : 'Turn camera on'}>{cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}</button>
          </div>
        </div>
        <div>
          <Badge tone="bad" dot>Live since 09:00</Badge>
          <h1 className="h-display mt-3 text-[32px] leading-tight">Year 10 Chemistry</h1>
          <p className="mt-1 text-[16px] text-muted">Moles and molar mass · Mr Samuel Okello</p>
          <ul className="mt-6 space-y-3 text-[14.5px]">
            <li className="flex items-center gap-3"><Wifi className="h-5 w-5 text-good" />Connection is good</li>
            <li className="flex items-center gap-3"><Circle className="h-5 w-5 text-bad" />This lesson is recorded for learners who miss it</li>
          </ul>
          <div className="mt-6 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-4">
            <div><p className="text-[14.5px] font-semibold">Save data</p><p className="text-[13px] text-muted">Hide other people’s video. Use this on a slow connection.</p></div>
            <Switch checked={audioOnly} onChange={setAudioOnly} label="Save data" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={onJoin} className="sm:flex-1">{teacher ? 'Start teaching' : 'Join lesson'}</Button>
            <Button size="lg" variant="secondary" onClick={onBack}>Not now</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Ended({ onDone, count }: { onDone: () => void; count: number }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-good-tint text-good"><Check className="h-7 w-7" /></span>
        <h1 className="h-display mt-4 text-[30px]">Lesson ended</h1>
        <p className="mt-2 text-muted">Attendance for {count - 1} learners is saved. The recording will appear on the lesson page within about an hour.</p>
        <Button className="mt-6" onClick={onDone}>Back to today</Button>
      </div>
    </div>
  )
}
