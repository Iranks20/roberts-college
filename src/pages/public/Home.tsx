import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Video, PlayCircle, FileCheck2, Users, Wallet, CalendarCheck, ChevronDown, MonitorSmartphone } from 'lucide-react'
import { Button, cn, LiveBadge, Segmented } from '../../components/ui'
import { levels, fees } from '../../data/school'
import { Photo } from '../../components/Photo'
import type { PhotoKey } from '../../lib/photos'
import { zoneTime, toMinutes, nowMinutes } from '../../lib/format'

const zones = [
  { value: 'Africa/Kampala', label: 'Kampala' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'America/Toronto', label: 'Toronto' },
] as const
type Zone = (typeof zones)[number]['value']

const today = [
  { start: '08:00', end: '08:50', cls: 'Year 6', subject: 'English', teacher: 'Ms Ruth Atim' },
  { start: '09:00', end: '09:50', cls: 'Year 10', subject: 'Chemistry', teacher: 'Mr Samuel Okello' },
  { start: '10:10', end: '11:00', cls: 'Year 8', subject: 'French', teacher: 'Ms Claire Dubois' },
  { start: '11:10', end: '12:00', cls: 'Year 12', subject: 'Economics', teacher: 'Mr Brian Tumusiime' },
  { start: '13:00', end: '13:50', cls: 'Year 4', subject: 'Science', teacher: 'Ms Ruth Atim' },
  { start: '14:00', end: '14:50', cls: 'Year 13', subject: 'Computer Science', teacher: 'Ms Priya Raman' },
]

function TodayPanel({ compact }: { compact?: boolean }) {
  const [zone, setZone] = useState<Zone>('Africa/Kampala')
  const now = nowMinutes()
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-lift sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-muted">Tuesday 6 October</p>
          <h2 className="font-display text-[22px] leading-tight">Today’s live online lessons</h2>
        </div>
        <Segmented value={zone} onChange={setZone} options={zones.map((z) => ({ value: z.value, label: z.label }))} className="max-w-full overflow-x-auto" />
      </div>
      <ol className="relative">
        {(compact ? today.slice(0, 4) : today).map((l) => {
          const live = now >= toMinutes(l.start) && now < toMinutes(l.end)
          const past = now >= toMinutes(l.end)
          return (
            <li key={l.start} className={cn('relative grid grid-cols-[72px_1fr] gap-3 border-t border-line py-3 first:border-t-0 sm:grid-cols-[92px_1fr]', live && '-mx-2 rounded-card border-t-transparent bg-crane-tint px-2 [&+li]:border-t-transparent')}>
              <div className={cn('num pt-0.5 text-[15px] font-semibold', past ? 'text-faint' : 'text-ink')}>
                {zoneTime(l.start, zone)}
                <span className="block text-[12px] font-medium text-muted">to {zoneTime(l.end, zone)}</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn('text-[15px] font-semibold', past ? 'text-muted' : 'text-ink')}>{l.cls} {l.subject}</p>
                  {live && <LiveBadge />}
                  {past && <span className="text-[12.5px] font-medium text-muted">Recording ready</span>}
                </div>
                <p className="text-[13.5px] text-muted">{l.teacher}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 border-t border-line pt-3 text-[12.5px] text-muted">{compact ? 'Kampala time (EAT). Pick your city to see your own time.' : 'Lessons run on Kampala time (EAT). Pick your city to see them in your own time.'}</p>
    </div>
  )
}

const faqs = [
  { q: 'Does my child need special software for live lessons?', a: 'No. Lessons open inside the Roberts College website in any modern browser on a laptop, tablet or phone. There is nothing to install and no separate meeting link.' },
  { q: 'What if we miss a lesson or our internet drops?', a: 'Every live lesson is recorded and appears on the lesson page with the teacher’s notes, usually within an hour. Learners can replay it as often as they need.' },
  { q: 'How do I know how my child is doing?', a: 'Parents have their own account showing attendance for every lesson, homework marks with teacher feedback, and a full report card at the end of each term.' },
  { q: 'Can we pay fees in instalments?', a: `Yes. ${fees.instalmentRule} You can pay by MTN Mobile Money, Airtel Money, Visa or Mastercard, or bank transfer.` },
  { q: 'Are the qualifications recognised?', a: 'Learners follow the Cambridge International curriculum and sit Cambridge Checkpoint, IGCSE and AS & A Level examinations, which universities around the world accept.' },
]

const stagePhoto: Record<string, PhotoKey> = { primary: 'primaryLearners', lower: 'secondaryStudents', igcse: 'computerLab', alevel: 'graduation' }

export default function Home() {
  const [open, setOpen] = useState<number | null>(0)
  const totalYears = levels.reduce((a, l) => a + l.years.length, 0)
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 xl:grid-cols-[1fr_1.05fr] xl:gap-12 lg:pb-24 xl:pb-32 lg:pt-14">
        <div>
          <h1 className="h-display text-[40px] leading-[1.05] sm:text-[56px] lg:text-[64px] xl:text-[62px]" style={{ textWrap: 'wrap' }}><span className="sm:whitespace-nowrap">A Cambridge school,</span> <span className="block">fully online.</span></h1>
          <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-muted sm:text-[18px]">
            Live lessons with real teachers for Years 4 to 13, taught from our base in Kampala. Learners join from home, anywhere in Uganda or the world, and parents follow every lesson, mark and payment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/apply" size="lg">Start an application</Button>
            <Button to="/admissions" size="lg" variant="secondary">See fees and entry</Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div className="flex flex-col-reverse justify-end"><dt className="mt-1 text-[12.5px] leading-snug text-muted">Year groups</dt><dd className="num font-display text-[24px] leading-none sm:text-[26px]">4–13</dd></div>
            <div className="flex flex-col-reverse justify-end"><dt className="mt-1 text-[12.5px] leading-snug text-muted">Primary, per term</dt><dd className="num font-display text-[24px] leading-none sm:text-[26px]">$400</dd></div>
            <div className="flex flex-col-reverse justify-end"><dt className="mt-1 text-[12.5px] leading-snug text-muted">Secondary, per term</dt><dd className="num font-display text-[24px] leading-none sm:text-[26px]">$600</dd></div>
          </dl>
        </div>
        <div className="relative">
          <Photo name="heroLearners" eager className="aspect-[4/3] w-full rounded-panel sm:aspect-[16/10] xl:ml-auto xl:aspect-[4/5] xl:w-[80%]" position="62% 50%" />
          <div className="relative z-10 mx-3 -mt-20 sm:mx-8 lg:mx-auto lg:max-w-[640px] xl:hidden"><TodayPanel /></div>
          <div className="absolute -bottom-16 left-0 z-10 hidden w-[66%] xl:block"><TodayPanel compact /></div>
        </div>
      </section>

      {/* Stages: a real sequence, drawn to scale by number of years */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="h-display text-[32px] leading-tight sm:text-[40px]">One school from Year 4 to Year 13</h2>
            <p className="mt-3 text-[16.5px] text-muted">Four Cambridge stages, each ending in an internationally recognised assessment. Learners can join at the start of any year.</p>
          </div>
          <div className="hidden overflow-hidden rounded-card border border-line md:flex">
            {levels.map((l, i) => (
              <div key={l.id} style={{ flexGrow: l.years.length / totalYears }} className={cn('basis-0 border-line p-5', i > 0 && 'border-l', i === 2 && 'bg-nile-tint/60', i === 3 && 'bg-nile-tint')}>
                <p className="num text-[13px] font-semibold text-muted">Year {l.years[0]}–{l.years[l.years.length - 1]}</p>
                <p className="mt-1 font-display text-[21px] leading-tight">{l.short}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {levels.map((l) => (
              <Link to={`/academics#${l.id}`} key={l.id} className="group rounded-card border border-line p-5 transition-colors hover:border-nile md:border-0 md:p-0">
                <Photo name={stagePhoto[l.id]} className="mb-4 aspect-[4/3] rounded-card" />
                <p className="num text-[13px] font-semibold text-muted md:hidden">Year {l.years[0]}–{l.years[l.years.length - 1]}</p>
                <p className="font-semibold text-ink md:hidden">{l.name}</p>
                <p className="mt-1 text-[14.5px] text-muted md:mt-0">{l.blurb}</p>
                <p className="mt-3 text-[13.5px] font-medium text-ink">{l.exam}</p>
                <p className="mt-3 text-[14px] font-semibold text-nile group-hover:underline">Subjects and entry</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="h-display text-[32px] leading-tight sm:text-[40px]">A full school day, without the commute</h2>
            <p className="mt-3 max-w-prose text-[16.5px] text-muted">The classroom lives inside the school website. Learners click Join, see their teacher and classmates, ask questions and work on the shared board.</p>
            <ul className="mt-8 space-y-6">
              {[
                { icon: Video, t: 'Live lessons in the browser', b: 'Video, chat, raised hands and a shared whiteboard, with attendance taken automatically when a learner joins.' },
                { icon: PlayCircle, t: 'Recordings and notes after every lesson', b: 'Replay a lesson, download the slides and catch up at your own pace.' },
                { icon: FileCheck2, t: 'Homework marked with feedback', b: 'Upload a photo, PDF or document. Teachers mark online and every mark flows into the term report.' },
                { icon: MonitorSmartphone, t: 'Works on a phone or a laptop', b: 'Designed for everyday Ugandan connections, with a lighter mode when the network is slow.' },
              ].map(({ icon: Icon, t, b }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl bg-nile-tint text-nile"><Icon className="h-5 w-5" /></span>
                  <div><p className="font-semibold text-ink">{t}</p><p className="mt-0.5 text-[15px] text-muted">{b}</p></div>
                </li>
              ))}
            </ul>
            <Button to="/online-learning" variant="secondary" className="mt-8">See how a lesson works</Button>
          </div>
          <div className="relative pb-10 sm:pb-16">
            <Photo name="laptopIndoors" className="aspect-[4/3] w-full rounded-panel sm:w-[85%]" />
            <div className="relative -mt-16 ml-6 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-[66%]"><ClassroomPreview /></div>
          </div>
        </div>
      </section>

      {/* Parents */}
      <section className="bg-surface border-y border-line">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="relative pb-10 sm:pb-14">
            <Photo name="watercolours" className="aspect-[4/3] w-full rounded-panel sm:ml-auto sm:w-[82%]" position="50% 40%" />
            <div className="relative -mt-16 mr-6 sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:w-[64%]"><ParentPreview /></div>
          </div>
          <div className="lg:order-first">
            <h2 className="h-display text-[32px] leading-tight sm:text-[40px]">Parents see what teachers see</h2>
            <p className="mt-3 max-w-prose text-[16.5px] text-muted">Every family gets a parent account linked to each of their children.</p>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2">
              {[
                { icon: CalendarCheck, t: 'Attendance', b: 'Lesson by lesson, updated as soon as a class ends.' },
                { icon: FileCheck2, t: 'Marks and reports', b: 'Homework marks, teacher comments and the full term report.' },
                { icon: Wallet, t: 'Fees', b: 'Statements, receipts and instalments paid by Mobile Money or card.' },
                { icon: Users, t: 'Teachers', b: 'Message any of your child’s teachers directly.' },
              ].map(({ icon: Icon, t, b }) => (
                <li key={t}><Icon className="mb-2 h-5 w-5 text-nile" /><p className="font-semibold">{t}</p><p className="text-[14.5px] text-muted">{b}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="h-display text-[32px] leading-tight sm:text-[40px]">Clear fees, paid your way</h2>
            <p className="mt-3 max-w-prose text-[16.5px] text-muted">{fees.instalmentRule}</p>
            <p className="mt-5 text-[14.5px] font-medium text-ink">We accept</p>
            <ul className="mt-2 flex flex-wrap gap-2">{fees.methods.map((m) => <li key={m} className="rounded-full border border-line bg-surface px-3 py-1 text-[13.5px] font-medium">{m}</li>)}</ul>
          </div>
          <div className="overflow-hidden rounded-panel border border-line bg-surface">
            {[
              { name: 'Primary', years: 'Years 4 to 6', fee: 400 },
              { name: 'Secondary', years: 'Years 7 to 13, including IGCSE and A Level', fee: 600 },
            ].map((f, i) => (
              <div key={f.name} className={cn('flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between', i > 0 && 'border-t border-line')}>
                <div><p className="font-display text-[24px]">{f.name}</p><p className="text-[14.5px] text-muted">{f.years}</p></div>
                <div className="sm:text-right">
                  <p className="num font-display text-[34px] leading-none">USD {f.fee}<span className="ml-1 font-sans text-[14px] text-muted">per term</span></p>
                  <p className="num mt-1.5 text-[13.5px] text-muted">or two instalments of USD {f.fee / 2}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3 border-t border-line bg-sunken/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] text-muted">One-off application fee: USD {fees.applicationFee}</p>
              <Link to="/admissions" className="link text-[14.5px]">Full fees and admissions guide</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[860px] px-4 sm:px-6">
        <h2 className="h-display mb-6 text-[32px] leading-tight sm:text-[40px]">Questions parents ask</h2>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="text-[16.5px] font-semibold text-ink">{f.q}</span>
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && <p className="anim-fade -mt-1 max-w-prose pb-5 text-[15.5px] text-muted">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6">
        <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-panel bg-[#0a4035] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <Photo name="graduation" className="absolute inset-0 -z-10 h-full w-full bg-transparent" imgClassName="opacity-35" position="50% 30%" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a4035] via-[#0a4035]/85 to-[#0a4035]/30" />
          <div>
            <h2 className="font-display text-[30px] leading-tight sm:text-[36px]">Ready to apply for Term 1, 2027?</h2>
            <p className="mt-2 max-w-xl text-[16px] opacity-85">The online application takes about 15 minutes. Have your child’s latest school report and birth certificate ready to upload.</p>
          </div>
          <Button to="/apply" variant="gold" size="lg">Start an application</Button>
        </div>
      </section>
    </>
  )
}

/* Small, honest previews of the real product screens. */
function ClassroomPreview() {
  const people = ['Mr Samuel Okello', 'Amani Nakato', 'Felix Oryem', 'Gloria Nalubega']
  return (
    <div className="rounded-panel border border-line bg-[#0f1a17] p-3 shadow-lift" aria-label="Preview of the live classroom">
      <div className="mb-3 flex items-center justify-between px-1 text-[13px] text-white/80">
        <span className="font-semibold">Year 10 Chemistry · Moles and molar mass</span>
        <LiveBadge label="Live" />
      </div>
      <div className="grid grid-cols-[1.6fr_1fr] gap-2">
        <div className="flex aspect-[4/3] flex-col justify-between rounded-xl bg-[#f7f5ef] p-4 text-[#1b2a26]">
          <p className="font-display text-[18px]">n = m ÷ M</p>
          <div className="space-y-1.5 text-[13px]">
            <p>44 g of CO₂ ÷ 44 g/mol</p>
            <p className="font-semibold">= 1 mol</p>
          </div>
          <p className="text-[11px] text-[#5b6b66]">Shared whiteboard</p>
        </div>
        <div className="grid gap-2">
          {people.slice(0, 3).map((p, i) => (
            <div key={p} className="relative flex items-center justify-center rounded-xl bg-[#1d2c28]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c4a42] text-[13px] font-bold text-white">{p.split(' ').slice(-2).map((x) => x[0]).join('')}</span>
              <span className="absolute bottom-1.5 left-2 hidden text-[10.5px] text-white/80 sm:block">{i === 0 ? 'Teacher' : p.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        {['Mic', 'Camera', 'Raise hand', 'Chat'].map((b) => <span key={b} className="rounded-full bg-[#1d2c28] px-3 py-1.5 text-[11.5px] font-semibold text-white/85">{b}</span>)}
      </div>
    </div>
  )
}

function ParentPreview() {
  return (
    <div className="rounded-panel border border-line bg-paper p-5 shadow-lift" aria-label="Preview of the parent account">
      <p className="text-[13px] font-semibold text-muted">Amani · Year 10</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[{ k: 'Attendance', v: '96%' }, { k: 'Average', v: '78%' }, { k: 'Fees due', v: '$300' }].map((s) => (
          <div key={s.k} className="rounded-card border border-line bg-surface p-3"><p className="text-[12px] text-muted">{s.k}</p><p className="num mt-1 text-[20px] font-semibold">{s.v}</p></div>
        ))}
      </div>
      <div className="mt-3 rounded-card border border-line bg-surface p-4">
        <div className="flex items-center justify-between"><p className="text-[14px] font-semibold">Bonding end-of-topic test</p><span className="num text-[14px] font-semibold text-good">41/50</span></div>
        <p className="mt-1 text-[13px] text-muted">“Strong dot-and-cross diagrams. Revise why giant covalent structures have high melting points.” Mr Okello</p>
      </div>
    </div>
  )
}
