import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Save, Check, Circle, Clock3 } from 'lucide-react'
import { Badge, Button, Card, Checkbox, Field, FileDrop, Input, Notice, Select, Stepper, Textarea, cn, type PickedFile } from '../../components/ui'
import { PaymentPanel } from '../../components/Payment'
import { fees, foreignLanguages, levelOfYear, maxOptions, minOptions, subjectsByLevel, applications, appStatusTone } from '../../data/school'
import { fmtDate } from '../../lib/format'

const STEPS = ['Learner', 'Parent or guardian', 'Year and subjects', 'Documents', 'Review and pay']
const countries = ['Uganda', 'Kenya', 'Rwanda', 'Tanzania', 'South Sudan', 'Democratic Republic of the Congo', 'United Kingdom', 'United Arab Emirates', 'United States', 'Canada', 'India', 'Other']

type Form = {
  first: string; last: string; dob: string; gender: string; nationality: string; country: string; school: string; needs: string
  gName: string; gRel: string; gEmail: string; gPhone: string; gWhatsapp: boolean; gAddress: string
  year: string; english: 'First Language' | 'Second Language'; language: string; options: string[]
  consent: boolean; accurate: boolean
}
const blank: Form = {
  first: '', last: '', dob: '', gender: 'Female', nationality: '', country: 'Uganda', school: '', needs: '',
  gName: '', gRel: 'Mother', gEmail: '', gPhone: '', gWhatsapp: true, gAddress: '',
  year: '10', english: 'First Language', language: 'French', options: [], consent: false, accurate: false,
}
const example: Form = {
  first: 'Keza', last: 'Uwimana', dob: '2011-03-14', gender: 'Female', nationality: 'Rwandan', country: 'Rwanda', school: 'Green Hills Academy, Kigali', needs: '',
  gName: 'Alice Uwimana', gRel: 'Mother', gEmail: 'alice.uwimana@gmail.com', gPhone: '+250 788 210 455', gWhatsapp: true, gAddress: 'Kigali, Rwanda',
  year: '10', english: 'Second Language', language: 'French', options: ['Biology', 'Chemistry', 'Physics'], consent: false, accurate: false,
}

export function Apply() {
  const [step, setStep] = useState(0)
  const [f, setF] = useState<Form>(blank)
  const fillExample = () => { setF(example); setDocs({ birth: [{ name: 'Keza-birth-certificate.pdf', size: 412000 }], report: [{ name: 'Year-9-report.pdf', size: 820000 }], photo: [{ name: 'passport-photo.jpg', size: 210000 }], passport: [{ name: 'passport.pdf', size: 540000 }] }); setErrors({}) }
  const [docs, setDocs] = useState<Record<string, PickedFile[]>>({ birth: [], report: [], photo: [], passport: [] })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paid, setPaid] = useState(false)
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }))
  const level = levelOfYear(Number(f.year))
  const subj = subjectsByLevel[level.id]
  const international = f.country !== 'Uganda'

  const chosenSubjects = useMemo(() => {
    if (!level.choice) return subj.core.map((s) => (s === 'Modern Foreign Language' ? `${f.language}` : s))
    if (level.id === 'igcse') return ['Mathematics', `English (${f.english})`, ...f.options]
    return f.options
  }, [f, level, subj])

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 0) { if (!f.first) e.first = 'Enter the learner’s first name.'; if (!f.last) e.last = 'Enter the learner’s last name.'; if (!f.dob) e.dob = 'Enter a date of birth.' }
    if (step === 1) { if (!f.gName) e.gName = 'Enter a name.'; if (!/\S+@\S+\.\S+/.test(f.gEmail)) e.gEmail = 'Enter an email like name@example.com.'; if (!f.gPhone) e.gPhone = 'Enter a phone number with country code.' }
    if (step === 2 && level.choice) {
      const n = f.options.length, min = minOptions[level.id], max = maxOptions[level.id]
      if (n < min || n > max) e.options = level.id === 'igcse' ? `Choose ${min} to ${max} option subjects. You have chosen ${n}.` : `Choose ${min} or ${max} subjects. You have chosen ${n}.`
    }
    if (step === 3) { if (!docs.birth.length) e.birth = 'Upload a birth certificate.'; if (!docs.report.length) e.report = 'Upload the latest school report.'; if (!docs.photo.length) e.photo = 'Upload a passport photo.'; if (international && !docs.passport.length) e.passport = 'Upload a passport for learners outside Uganda.' }
    if (step === 4) { if (!f.consent) e.consent = 'Parental consent is needed to process the application.'; if (!f.accurate) e.accurate = 'Confirm the information is accurate.' }
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const next = () => { if (validate()) { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) } }
  const toggleOption = (o: string) => set('options', f.options.includes(o) ? f.options.filter((x) => x !== o) : [...f.options, o])

  if (paid) return <Submitted name={`${f.first} ${f.last}`} email={f.gEmail} />

  return (
    <div className="mx-auto max-w-[920px] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h-display text-[34px] leading-tight sm:text-[42px]">Apply to Roberts College</h1>
          <p className="mt-1.5 text-[15.5px] text-muted">For entry in Term 1, 2027. Takes about 15 minutes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {!f.first && <Button variant="ghost" size="sm" onClick={fillExample}>Fill with an example</Button>}
          <Button variant="ghost" size="sm" icon={<Save className="h-4 w-4" />} onClick={() => setSaved(true)} disabled={!f.gEmail}>{saved ? 'Saved' : 'Save and finish later'}</Button>
        </div>
      </div>
      <Stepper steps={STEPS} current={step} />
      <p className="mt-3 text-[13.5px] font-semibold text-muted md:hidden">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
      {saved && <Notice tone="good" className="mt-5">Saved. We’ve emailed {f.gEmail} a link to continue this application.</Notice>}

      <Card className="mt-6 sm:p-8">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <h2 className="text-[19px] font-semibold sm:col-span-2">About the learner</h2>
            <Field label="First name" htmlFor="a-first" error={errors.first}><Input id="a-first" value={f.first} onChange={(e) => set('first', e.target.value)} /></Field>
            <Field label="Last name" htmlFor="a-last" error={errors.last}><Input id="a-last" value={f.last} onChange={(e) => set('last', e.target.value)} /></Field>
            <Field label="Date of birth" htmlFor="a-dob" error={errors.dob}><Input id="a-dob" type="date" value={f.dob} onChange={(e) => set('dob', e.target.value)} /></Field>
            <Field label="Gender" htmlFor="a-gender"><Select id="a-gender" value={f.gender} onChange={(e) => set('gender', e.target.value)}><option>Female</option><option>Male</option><option>Prefer not to say</option></Select></Field>
            <Field label="Nationality" htmlFor="a-nat"><Input id="a-nat" value={f.nationality} onChange={(e) => set('nationality', e.target.value)} /></Field>
            <Field label="Country the learner will study from" htmlFor="a-country" hint="Used to show lesson times in your time zone."><Select id="a-country" value={f.country} onChange={(e) => set('country', e.target.value)}>{countries.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <div className="sm:col-span-2"><Field label="Current or most recent school" htmlFor="a-school"><Input id="a-school" value={f.school} onChange={(e) => set('school', e.target.value)} /></Field></div>
            <div className="sm:col-span-2"><Field label="Learning support or medical needs" htmlFor="a-needs" optional hint="Anything teachers should know to help the learner do well."><Textarea id="a-needs" rows={3} value={f.needs} onChange={(e) => set('needs', e.target.value)} /></Field></div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <h2 className="text-[19px] font-semibold sm:col-span-2">Parent or guardian</h2>
            <p className="-mt-3 text-[14px] text-muted sm:col-span-2">This person gets the parent account, receives reports and pays fees.</p>
            <Field label="Full name" htmlFor="g-name" error={errors.gName}><Input id="g-name" value={f.gName} onChange={(e) => set('gName', e.target.value)} /></Field>
            <Field label="Relationship to learner" htmlFor="g-rel"><Select id="g-rel" value={f.gRel} onChange={(e) => set('gRel', e.target.value)}><option>Mother</option><option>Father</option><option>Guardian</option><option>Sponsor</option></Select></Field>
            <Field label="Email" htmlFor="g-email" error={errors.gEmail}><Input id="g-email" type="email" value={f.gEmail} onChange={(e) => set('gEmail', e.target.value)} /></Field>
            <Field label="Phone number" htmlFor="g-phone" error={errors.gPhone} hint="Include the country code. We send fee and attendance alerts by SMS."><Input id="g-phone" type="tel" value={f.gPhone} onChange={(e) => set('gPhone', e.target.value)} /></Field>
            <div className="sm:col-span-2"><Checkbox checked={f.gWhatsapp} onChange={(v) => set('gWhatsapp', v)} label="This number uses WhatsApp" /></div>
            <div className="sm:col-span-2"><Field label="Home address" htmlFor="g-addr"><Input id="g-addr" value={f.gAddress} onChange={(e) => set('gAddress', e.target.value)} /></Field></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-[19px] font-semibold">Year and subjects</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Year group applying for" htmlFor="y-year" hint={`${level.name}. USD ${level.fee} per term.`}>
                <Select id="y-year" value={f.year} onChange={(e) => { set('year', e.target.value); set('options', []) }}>
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </Select>
              </Field>
              {!level.choice && (
                <Field label="Foreign language" htmlFor="y-lang"><Select id="y-lang" value={f.language} onChange={(e) => set('language', e.target.value)}>{foreignLanguages.map((l) => <option key={l} value={l.split(' ')[0]}>{l}</option>)}</Select></Field>
              )}
              {level.id === 'igcse' && (
                <Field label="English" htmlFor="y-eng" hint="Second Language suits learners whose first language is not English.">
                  <Select id="y-eng" value={f.english} onChange={(e) => set('english', e.target.value as Form['english'])}><option>First Language</option><option>Second Language</option></Select>
                </Field>
              )}
            </div>
            {!level.choice ? (
              <div>
                <p className="field-label">Subjects in {level.short}</p>
                <p className="mb-3 text-[14px] text-muted">Every learner in this stage studies the same subjects.</p>
                <ul className="grid gap-2 sm:grid-cols-2">{chosenSubjects.map((s) => <li key={s} className="flex items-center gap-2.5 rounded-ctl bg-sunken px-3.5 py-2.5 text-[14.5px] font-medium"><Check className="h-4 w-4 text-nile" />{s}</li>)}</ul>
              </div>
            ) : (
              <div>
                {level.id === 'igcse' && <p className="mb-4 text-[14px] text-muted">Mathematics and English are compulsory. Choose {minOptions.igcse} to {maxOptions.igcse} more subjects.</p>}
                {level.id === 'alevel' && <p className="mb-4 text-[14px] text-muted">Choose {minOptions.alevel} or {maxOptions.alevel} subjects. Most university courses ask for three.</p>}
                <div className="flex items-center justify-between"><p className="field-label">Option subjects</p><Badge tone={errors.options ? 'bad' : 'nile'}>{f.options.length} chosen</Badge></div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {subj.options.map((o) => {
                    const on = f.options.includes(o)
                    return (
                      <button key={o} type="button" aria-pressed={on} onClick={() => toggleOption(o)} className={cn('flex items-center gap-3 rounded-ctl border px-3.5 py-3 text-left text-[14.5px] font-medium transition-colors', on ? 'border-nile bg-nile-tint/60 text-ink' : 'border-line bg-surface hover:border-faint')}>
                        <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', on ? 'border-nile bg-nile text-nile-on' : 'border-faint')}>{on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>{o}
                      </button>
                    )
                  })}
                </div>
                {errors.options && <p className="mt-2 text-[13px] font-semibold text-bad">{errors.options}</p>}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div><h2 className="text-[19px] font-semibold">Documents</h2><p className="text-[14px] text-muted">Clear photos or scans are fine. PDF, JPG or PNG, up to 10 MB each.</p></div>
            {[
              { k: 'birth', label: 'Birth certificate' },
              { k: 'report', label: 'Latest school report', hint: 'Signed or stamped by the school.' },
              { k: 'photo', label: 'Passport-size photo' },
              ...(international ? [{ k: 'passport', label: 'Passport', hint: 'Needed because the learner studies from outside Uganda.' }] : []),
            ].map((d) => (
              <div key={d.k}>
                <p className="field-label">{d.label}</p>
                {'hint' in d && d.hint && <p className="-mt-1 mb-2 text-[13px] text-muted">{d.hint}</p>}
                <FileDrop files={docs[d.k] ?? []} onChange={(v) => setDocs((s) => ({ ...s, [d.k]: v }))} multiple={false} compact />
                {errors[d.k] && <p className="mt-1.5 text-[13px] font-semibold text-bad">{errors[d.k]}</p>}
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-[19px] font-semibold">Check your application</h2>
              <dl className="mt-4 divide-y divide-line text-[14.5px]">
                {[
                  ['Learner', `${f.first} ${f.last}, born ${fmtDate(f.dob)}`],
                  ['Studying from', f.country],
                  ['Parent or guardian', `${f.gName} (${f.gRel})`],
                  ['Contact', `${f.gEmail} · ${f.gPhone}`],
                  ['Applying for', `Year ${f.year}, ${level.name}`],
                  ['Subjects', chosenSubjects.join(', ')],
                  ['Documents', `${Object.values(docs).flat().length} uploaded`],
                ].map(([k, v], i) => (
                  <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="flex items-start justify-between gap-3 font-medium"><span className="min-w-0">{v}</span><button type="button" className="link shrink-0 text-[13px]" onClick={() => setStep(i < 2 ? 0 : i < 4 ? 1 : i < 6 ? 2 : 3)}>Change</button></dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 space-y-3">
                <Checkbox checked={f.consent} onChange={(v) => set('consent', v)} label="I consent to Roberts College processing this personal data" description="Under Uganda’s Data Protection and Privacy Act, 2019, for admissions and schooling only." />
                {errors.consent && <p className="text-[13px] font-semibold text-bad">{errors.consent}</p>}
                <Checkbox checked={f.accurate} onChange={(v) => set('accurate', v)} label="The information in this application is accurate" />
                {errors.accurate && <p className="text-[13px] font-semibold text-bad">{errors.accurate}</p>}
              </div>
            </div>
            <div className="rounded-card border border-line p-5">
              <h3 className="text-[16px] font-semibold">Application fee</h3>
              <p className="mb-4 mt-1 text-[13.5px] text-muted">Non-refundable. Your application is sent to the registrar once it is paid.</p>
              {f.consent && f.accurate
                ? <PaymentPanel amount={fees.applicationFee} purpose="Application fee" onPaid={() => setTimeout(() => setPaid(true), 900)} />
                : <p className="rounded-ctl bg-sunken p-4 text-[14px] text-muted">Tick both boxes to continue to payment.</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < 4 && <Button onClick={next}>Continue to {STEPS[step + 1].toLowerCase()}</Button>}
          {step === 4 && !(f.consent && f.accurate) && <Button onClick={validate}>Continue to payment</Button>}
        </div>
      </Card>
    </div>
  )
}

function Submitted({ name, email }: { name: string; email: string }) {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-16 text-center sm:px-6">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-good-tint text-good"><CheckCircle2 className="h-7 w-7" /></span>
      <h1 className="h-display mt-5 text-[36px] leading-tight">Application submitted</h1>
      <p className="mt-3 text-[16px] text-muted">Thank you. {name}’s application is with our registrar. We’ve sent a confirmation to {email}.</p>
      <Card className="mt-8 text-left">
        <p className="text-[13px] text-muted">Application number</p>
        <p className="num font-display text-[28px]">APP-2026-0418</p>
        <p className="mt-4 text-[14.5px] font-semibold">What happens next</p>
        <ul className="mt-2 space-y-2 text-[14.5px] text-muted">
          <li>The registrar checks your documents within three working days.</li>
          <li>Secondary applicants are invited to a 20-minute online interview.</li>
          <li>You’ll receive an offer by email and SMS, with a link to pay the first instalment.</li>
        </ul>
      </Card>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button to="/apply/track">Track this application</Button><Button to="/" variant="secondary">Back to the website</Button></div>
    </div>
  )
}

const pipeline = ['Submitted', 'Under review', 'Interview', 'Accepted', 'Enrolled'] as const
export function Track() {
  const [no, setNo] = useState('APP-2026-0412')
  const [email, setEmail] = useState('vikram.mehta@gmail.com')
  const [found, setFound] = useState<(typeof applications)[number] | null | undefined>(undefined)
  const look = (e: React.FormEvent) => { e.preventDefault(); setFound(applications.find((a) => a.id.toLowerCase() === no.trim().toLowerCase()) ?? null) }
  const idx = found ? Math.max(0, pipeline.indexOf((found.status === 'Documents requested' ? 'Under review' : found.status) as (typeof pipeline)[number])) : 0
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="h-display text-[36px] leading-tight sm:text-[44px]">Track an application</h1>
      <p className="mt-2 text-[16px] text-muted">Enter the application number from your confirmation email.</p>
      <Card className="mt-8">
        <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={look}>
          <Field label="Application number" htmlFor="t-no"><Input id="t-no" value={no} onChange={(e) => setNo(e.target.value)} /></Field>
          <Field label="Parent’s email" htmlFor="t-email"><Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Button type="submit">Check status</Button>
        </form>
      </Card>
      {found === null && <Notice tone="warn" className="mt-6" title="No application found">Check the number in your confirmation email. It looks like APP-2026-0000.</Notice>}
      {found && (
        <Card className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-[13px] text-muted">{found.id}</p><p className="text-[20px] font-semibold">{found.applicant}</p><p className="text-[14px] text-muted">Year {found.year} · submitted {fmtDate(found.submitted)}</p></div>
            <Badge tone={appStatusTone[found.status]}>{found.status}</Badge>
          </div>
          {found.status === 'Rejected' ? (
            <Notice tone="bad" className="mt-6" title="We could not offer a place this time">{found.notes}</Notice>
          ) : (
            <ol className="mt-7 space-y-0">
              {pipeline.map((p, i) => {
                const done = i < idx || found.status === 'Enrolled', current = i === idx && found.status !== 'Enrolled'
                return (
                  <li key={p} className="relative grid grid-cols-[28px_1fr] gap-3 pb-6 last:pb-0">
                    {i < pipeline.length - 1 && <span className={cn('absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5', done ? 'bg-nile' : 'bg-line')} />}
                    <span className={cn('flex h-7 w-7 items-center justify-center rounded-full', done ? 'bg-nile text-nile-on' : current ? 'bg-crane text-[#2a1c02]' : 'bg-sunken text-faint')}>{done ? <Check className="h-4 w-4" strokeWidth={3} /> : current ? <Clock3 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}</span>
                    <div className="pt-0.5">
                      <p className={cn('font-semibold', !done && !current && 'text-muted')}>{p}</p>
                      {current && found.notes && <p className="mt-0.5 text-[14px] text-muted">{found.notes}</p>}
                      {current && found.status === 'Documents requested' && <Button size="sm" className="mt-2" to="/apply">Upload missing document</Button>}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </Card>
      )}
      <p className="mt-6 text-[14px] text-muted">Try APP-2026-0415 (documents requested) or APP-2026-0409 (accepted). <Link to="/contact" className="link">Contact admissions</Link></p>
    </div>
  )
}
