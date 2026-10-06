import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check, Laptop, Headphones, Wifi, ShieldCheck, Clock, Video, MessageSquare, PenLine, Hand, Mail, Phone, MapPin, CheckCircle2, Lock, Camera } from 'lucide-react'
import { Avatar, Button, Card, Field, Input, Select, Textarea, cn } from '../../components/ui'
import { fees, levels, subjectsByLevel, foreignLanguages, teachers, periods, academicYear } from '../../data/school'
import { fmtDate } from '../../lib/format'
import { Photo } from '../../components/Photo'
import { photos, photoSource, type PhotoKey } from '../../lib/photos'

function Hero({ title, lead, children, photo, position }: { title: string; lead: string; children?: React.ReactNode; photo?: PhotoKey; position?: string }) {
  return (
    <section className="border-b border-line">
      <div className={cn('mx-auto max-w-[1200px] px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-16', photo && 'grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]')}>
        <div>
          <h1 className="h-display max-w-3xl text-[40px] leading-[1.05] sm:text-[54px]">{title}</h1>
          <p className="mt-5 max-w-2xl text-[17.5px] leading-relaxed text-muted">{lead}</p>
          {children}
        </div>
        {photo && <Photo name={photo} eager className="aspect-[16/11] rounded-panel" position={position} />}
      </div>
    </section>
  )
}
const levelPhoto: Record<string, PhotoKey> = { primary: 'laptopIndoors', lower: 'secondaryStudents', igcse: 'readingLaptop', alevel: 'graduation' }

function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }, [hash])
}

/* ---------------- Academics ---------------- */
export function Academics() {
  useHashScroll()
  return (
    <>
      <Hero title="Academics" photo="computerLab" lead="Roberts College follows the Cambridge International curriculum from Year 4 to Year 13. Every subject is taught live by a specialist teacher, with recordings, notes and marked work in one place.">
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Stages">
          {levels.map((l) => <a key={l.id} href={`#/academics#${l.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] font-semibold hover:border-nile hover:text-nile">{l.short} <span className="num font-medium text-muted">Y{l.years[0]}–{l.years[l.years.length - 1]}</span></a>)}
        </nav>
      </Hero>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {levels.map((l) => {
          const s = subjectsByLevel[l.id]
          return (
            <section key={l.id} id={l.id} className="grid scroll-mt-24 gap-8 border-b border-line py-14 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
              <div>
                <p className="num text-[14px] font-semibold text-muted">Years {l.years[0]} to {l.years[l.years.length - 1]}</p>
                <h2 className="h-display mt-1 text-[34px] leading-tight">{l.name}</h2>
                <p className="mt-3 text-[16px] text-muted">{l.blurb}</p>
                <Photo name={levelPhoto[l.id]} className="mt-6 aspect-[3/2] rounded-card" />
                <dl className="mt-6 space-y-3 text-[14.5px]">
                  <div><dt className="text-muted">Assessment</dt><dd className="font-medium">{l.exam}</dd></div>
                  <div><dt className="text-muted">Grading</dt><dd className="font-medium">{l.grading}</dd></div>
                  <div><dt className="text-muted">Fee</dt><dd className="num font-medium">USD {l.fee} per term, or two instalments of USD {l.fee / 2}</dd></div>
                </dl>
              </div>
              <div>
                {s.core.length > 0 && (
                  <div>
                    <h3 className="text-[15px] font-semibold">{l.choice ? 'Compulsory subjects' : 'Subjects every learner studies'}</h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {s.core.map((x) => <li key={x} className="flex items-center gap-2.5 rounded-ctl border border-line bg-surface px-3.5 py-2.5 text-[14.5px] font-medium"><Check className="h-4 w-4 shrink-0 text-nile" />{x === 'Modern Foreign Language' ? `Foreign language: ${foreignLanguages.join(', ')}` : x}</li>)}
                    </ul>
                  </div>
                )}
                {s.options.length > 0 && (
                  <div className={cn(s.core.length > 0 && 'mt-7')}>
                    <h3 className="text-[15px] font-semibold">{l.id === 'alevel' ? 'Choose three or four subjects' : 'Choose your options'}</h3>
                    <p className="text-[14px] text-muted">{l.id === 'igcse' ? 'Learners take 7 to 9 IGCSE subjects in total, chosen with their parents when they apply.' : 'Every A Level subject is available. Learners and parents choose together when applying.'}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.options.map((x) => <li key={x} className="rounded-full bg-nile-tint px-3 py-1.5 text-[13.5px] font-semibold text-nile">{x}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )
        })}
        <div className="flex flex-col items-start gap-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[26px]">Not sure which year your child should join?</p>
          <Button to="/contact" variant="secondary">Ask our admissions team</Button>
        </div>
      </div>
    </>
  )
}

/* ---------------- Admissions and fees ---------------- */
const steps = [
  { t: 'Apply online', b: 'Fill in the learner’s details, the parent or guardian’s details and, for IGCSE and A Level, subject choices.' },
  { t: 'Upload documents', b: 'Birth certificate, the latest school report, a passport photo, and a passport for learners outside Uganda.' },
  { t: `Pay the USD ${fees.applicationFee} application fee`, b: 'By Mobile Money, card or bank transfer. Your application goes to the registrar as soon as it is paid.' },
  { t: 'Review and short interview', b: 'The registrar checks your documents within three working days. Secondary applicants have a 20-minute online conversation with a teacher.' },
  { t: 'Offer and first instalment', b: 'Accept the offer and pay the full term fee or the first instalment to secure the place.' },
  { t: 'Welcome to Roberts College', b: 'Student and parent accounts are created, the learner joins a class and sees their timetable the same day.' },
]
export function Admissions() {
  return (
    <>
      <Hero title="Admissions and fees" photo="girlsComputer" position="50% 30%" lead="Apply online in about 15 minutes. Most families hear back within three working days.">
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button to="/apply" size="lg">Start an application</Button><Button to="/apply/track" size="lg" variant="secondary">Track an application</Button></div>
      </Hero>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]">
          <div><h2 className="h-display text-[32px] leading-tight">How to join</h2><p className="mt-3 text-[16px] text-muted">Six steps from application to first lesson. You can save your application and come back to it.</p></div>
          <ol className="space-y-0">
            {steps.map((s, i) => (
              <li key={s.t} className="relative grid grid-cols-[40px_1fr] gap-4 pb-7 last:pb-0">
                {i < steps.length - 1 && <span className="absolute left-[19px] top-10 h-[calc(100%-40px)] w-px bg-line" aria-hidden />}
                <span className="num flex h-10 w-10 items-center justify-center rounded-full bg-nile text-[15px] font-bold text-nile-on">{i + 1}</span>
                <div className="pt-1.5"><p className="font-semibold">{s.t}</p><p className="mt-0.5 text-[15px] text-muted">{s.b}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section id="fees" className="border-t border-line py-14">
          <h2 className="h-display text-[32px] leading-tight">Fees for 2026 and 2027</h2>
          <p className="mt-3 max-w-prose text-[16px] text-muted">Fees are charged per term in US dollars. {fees.instalmentRule}</p>
          <div className="scroll-x mt-8 rounded-card border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left text-[14.5px]">
              <thead className="text-[13px] text-muted"><tr className="border-b border-line"><th className="px-5 py-3 font-semibold">Stage</th><th className="px-5 py-3 font-semibold">Years</th><th className="px-5 py-3 text-right font-semibold">Per term</th><th className="px-5 py-3 text-right font-semibold">1st instalment</th><th className="px-5 py-3 text-right font-semibold">2nd instalment</th></tr></thead>
              <tbody>
                {levels.map((l) => (
                  <tr key={l.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3.5 font-semibold">{l.name}</td><td className="num px-5 py-3.5">{l.years[0]}–{l.years[l.years.length - 1]}</td>
                    <td className="num px-5 py-3.5 text-right font-semibold">USD {l.fee}</td><td className="num px-5 py-3.5 text-right">USD {l.fee / 2} <span className="block text-[12.5px] text-muted">by first day of term</span></td><td className="num px-5 py-3.5 text-right">USD {l.fee / 2} <span className="block text-[12.5px] text-muted">by mid-term</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card>
              <h3 className="font-semibold">Ways to pay</h3>
              <ul className="mt-3 space-y-2 text-[14.5px]">{fees.methods.map((m) => <li key={m} className="flex items-center gap-2"><Check className="h-4 w-4 text-nile" />{m}</li>)}</ul>
              <p className="mt-3 text-[13.5px] text-muted">Pay from your parent account. Receipts are issued automatically.</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Bank transfer details</h3>
              <dl className="mt-3 space-y-1.5 text-[14px]">
                <div className="flex justify-between gap-3"><dt className="text-muted">Bank</dt><dd className="text-right font-medium">{fees.bank.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Account name</dt><dd className="text-right font-medium">{fees.bank.account}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Account number</dt><dd className="num text-right font-medium">{fees.bank.number}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">SWIFT</dt><dd className="text-right font-medium">{fees.bank.swift}</dd></div>
              </dl>
            </Card>
            <Card>
              <h3 className="font-semibold">If a payment is late</h3>
              <p className="mt-3 text-[14.5px] text-muted">We send reminders by email and SMS before each due date. If fees stay unpaid, the school may pause access to lessons and reports, always with written notice first. Talk to the bursar early if you need a payment plan.</p>
            </Card>
          </div>
        </section>

        <section className="grid gap-10 border-t border-line py-14 lg:grid-cols-2">
          <div>
            <h2 className="h-display text-[32px] leading-tight">Documents you will need</h2>
            <ul className="mt-6 space-y-3 text-[15px]">
              {['Birth certificate', 'Most recent school report, signed by the school', 'A recent passport-size photo', 'Passport or national ID (learners outside Uganda)', 'Previous Cambridge results, if any (IGCSE or AS)'].map((d) => <li key={d} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-nile" />{d}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="h-display text-[32px] leading-tight">Term dates, {academicYear.name}</h2>
            <ul className="mt-6 divide-y divide-line rounded-card border border-line bg-surface">
              {academicYear.terms.map((t) => <li key={t.name} className="flex items-center justify-between gap-3 px-5 py-3.5 text-[15px]"><span className="font-semibold">{t.name}</span><span className="num text-muted">{fmtDate(t.start, { day: 'numeric', month: 'short' })} to {fmtDate(t.end, { day: 'numeric', month: 'short' })}</span></li>)}
            </ul>
            <p className="mt-3 text-[14px] text-muted">New learners usually start in Term 1, which begins in February. Mid-year entry is possible when a class has space.</p>
          </div>
        </section>
      </div>
    </>
  )
}

/* ---------------- How online school works ---------------- */
export function OnlineLearning() {
  return (
    <>
      <Hero title="How online school works" photo="tutor" lead="Lessons happen live, inside the Roberts College website. There is no separate app and no meeting link to find: learners sign in, open their timetable and click Join." />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="h-display text-[32px] leading-tight">A school day</h2>
            <p className="mt-3 text-[16px] text-muted">Six 50-minute lessons on Kampala time, with breaks between. Families in other time zones can see the day in their own time on the timetable.</p>
          </div>
          <ol className="rounded-card border border-line bg-surface">
            {periods.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-0">
                <span className="num font-semibold">{p.start} to {p.end}</span>
                <span className="text-[14px] text-muted">Lesson {i + 1}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="border-t border-line py-14">
          <h2 className="h-display max-w-2xl text-[32px] leading-tight">In the classroom</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Video, t: 'See and hear the teacher', b: 'Video and audio in the browser. If the connection drops, the lesson reconnects on its own.' },
              { icon: PenLine, t: 'Shared whiteboard', b: 'Teachers write, draw and share slides; learners can be invited to solve on the board.' },
              { icon: Hand, t: 'Raise a hand', b: 'Ask a question out loud or in the chat. Teachers can bring learners into small groups.' },
              { icon: Clock, t: 'Attendance taken for you', b: 'The register fills itself when learners join; teachers confirm it at the end of the lesson.' },
            ].map(({ icon: Icon, t, b }) => <div key={t}><Icon className="h-6 w-6 text-nile" /><p className="mt-3 font-semibold">{t}</p><p className="mt-1 text-[14.5px] text-muted">{b}</p></div>)}
          </div>
        </section>
        <section className="grid gap-10 border-t border-line py-14 lg:grid-cols-2">
          <div>
            <h2 className="h-display text-[32px] leading-tight">What your child needs</h2>
            <ul className="mt-6 space-y-4">
              {[
                { icon: Laptop, t: 'A laptop or tablet', b: 'A phone works for catching up, but a bigger screen is better for daily lessons.' },
                { icon: Headphones, t: 'Headphones with a microphone', b: 'So the teacher can hear clearly and the household stays quiet.' },
                { icon: Wifi, t: 'A steady internet connection', b: 'Home broadband or a reliable mobile data bundle. A lighter video mode helps on slower networks.' },
                { icon: Camera, t: 'A quiet place to work', b: 'Cameras are on during lessons, so a tidy corner with good light helps.' },
              ].map(({ icon: Icon, t, b }) => <li key={t} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-nile-tint text-nile"><Icon className="h-5 w-5" /></span><div><p className="font-semibold">{t}</p><p className="text-[14.5px] text-muted">{b}</p></div></li>)}
            </ul>
          </div>
          <div>
            <h2 className="h-display text-[32px] leading-tight">Safe and fair</h2>
            <ul className="mt-6 space-y-4">
              {[
                { icon: Lock, t: 'Only enrolled learners can join', b: 'Every lesson is inside a signed-in account. Visitors cannot open a class.' },
                { icon: ShieldCheck, t: 'Children’s data protected', b: 'We follow Uganda’s Data Protection and Privacy Act, 2019, and ask parents’ consent for learners under 18.' },
                { icon: MessageSquare, t: 'Messages are visible to the school', b: 'Teachers and learners message inside the portal, never on private apps.' },
                { icon: CheckCircle2, t: 'Fair online tests', b: 'Timed tests, shuffled questions and a record of when a learner leaves the test page.' },
              ].map(({ icon: Icon, t, b }) => <li key={t} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-nile-tint text-nile"><Icon className="h-5 w-5" /></span><div><p className="font-semibold">{t}</p><p className="text-[14.5px] text-muted">{b}</p></div></li>)}
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}

/* ---------------- About ---------------- */
export function About() {
  return (
    <>
      <Hero title="About Roberts College" photo="watercolours" lead="We are an online school based in Kampala, teaching the Cambridge International curriculum to learners in Uganda and around the world. Our teachers are qualified specialists who teach every lesson live." />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <section className="grid gap-6 py-14 md:grid-cols-[1.4fr_1fr]">
          <figure>
            <Photo name="kampala" className="aspect-[16/10] rounded-panel" />
            <figcaption className="mt-2 text-[13px] text-muted">Kampala, where every lesson is taught from.</figcaption>
          </figure>
          <div className="grid gap-6">
            <Photo name="girlsComputer" className="aspect-[16/10] rounded-panel md:aspect-auto md:min-h-[200px]" position="50% 30%" />
            <Card>
              <p className="font-display text-[22px] leading-snug">Licensed to teach the Cambridge International curriculum.</p>
              <p className="mt-2 text-[14.5px] text-muted">Learners use Cambridge-endorsed textbooks and past papers in our digital library and sit Cambridge examinations.</p>
            </Card>
          </div>
        </section>
        <section className="grid gap-8 border-t border-line py-14 md:grid-cols-[1fr_1.2fr] md:items-center">
          <Photo name="crane" className="aspect-[4/3] rounded-panel" position="50% 40%" />
          <div>
            <h2 className="h-display text-[32px] leading-tight">Why the crested crane</h2>
            <p className="mt-3 max-w-prose text-[16px] text-muted">Uganda’s national bird stands for the qualities we hope every learner carries: confidence, grace and the patience to keep growing. Its golden crest gives our school its accent colour, and the three feathers in our mark.</p>
            <p className="mt-3 max-w-prose text-[16px] text-muted">Our teachers bring that patience to every live lesson, whether a learner joins from Kampala, Kigali or London.</p>
          </div>
        </section>
        <section className="border-t border-line py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="h-display text-[32px] leading-tight">Our teachers</h2>
            <p className="text-[15px] text-muted">{teachers.length} specialist teachers</p>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <li key={t.id} className="flex gap-4">
                <Avatar name={t.name} size={52} />
                <div className="min-w-0"><p className="font-semibold">{t.name}</p><p className="text-[14px] text-nile">{t.title}</p><p className="mt-1 text-[14px] text-muted">{t.bio}</p></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <>
      <Hero title="Contact us" photo="kampala" lead="Questions about admissions, fees or which year to join? Send us a message and the admissions team will reply within one working day." />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="sm:p-8">
          {sent ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-good" />
              <p className="mt-3 font-display text-[24px]">Message sent</p>
              <p className="mt-1 text-muted">We’ll reply to you by email within one working day.</p>
              <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
            </div>
          ) : (
            <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <Field label="Your name" htmlFor="c-name"><Input id="c-name" required autoComplete="name" /></Field>
              <Field label="Email" htmlFor="c-email"><Input id="c-email" type="email" required autoComplete="email" /></Field>
              <Field label="Phone or WhatsApp" htmlFor="c-phone" optional><Input id="c-phone" type="tel" placeholder="+256" /></Field>
              <Field label="What is it about?" htmlFor="c-topic">
                <Select id="c-topic" defaultValue="Admissions"><option>Admissions</option><option>Fees and payments</option><option>Choosing a year or subjects</option><option>Technical help</option><option>Something else</option></Select>
              </Field>
              <div className="sm:col-span-2"><Field label="Message" htmlFor="c-msg"><Textarea id="c-msg" rows={5} required /></Field></div>
              <div className="sm:col-span-2"><Button type="submit" size="lg">Send message</Button></div>
            </form>
          )}
        </Card>
        <div className="space-y-6">
          {[
            { icon: Mail, k: 'Email', v: 'admissions@robertscollege.ac.ug' },
            { icon: Phone, k: 'Phone and WhatsApp', v: '+256 700 000 000' },
            { icon: MapPin, k: 'Office', v: 'Kampala, Uganda' },
            { icon: Clock, k: 'Office hours', v: 'Monday to Friday, 8:00 to 17:00 Kampala time' },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-nile-tint text-nile"><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="text-[13px] text-muted">{k}</p><p className="break-words font-semibold">{v}</p></div></div>
          ))}
          <p className="text-[14.5px]">Already a family at Roberts College? <Link to="/login" className="link">Sign in</Link> and message the school from your account.</p>
        </div>
      </div>
    </>
  )
}

/* ---------------- Photo credits ---------------- */
export function Credits() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="h-display text-[40px] leading-tight">Photo credits</h1>
      <p className="mt-3 max-w-prose text-[16px] text-muted">Photographs are used under open licences from Wikimedia Commons. Subject illustrations and the Roberts College mark are original artwork.</p>
      <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-surface">
        {(Object.keys(photos) as PhotoKey[]).map((k) => (
          <li key={k} className="flex items-center gap-4 p-4">
            <Photo name={k} className="h-16 w-24 shrink-0 rounded-lg" />
            <div className="min-w-0 text-[14px]">
              <a href={photoSource(k)} target="_blank" rel="noreferrer" className="link break-words">{photos[k].title.replace(/\.(jpg|JPG|tif)$/, '')}</a>
              <p className="text-muted">{photos[k].author} · {photos[k].license}{photos[k].license !== 'CC0' && ' · cropped and resized'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
