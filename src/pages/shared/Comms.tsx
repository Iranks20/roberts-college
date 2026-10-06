import { useMemo, useState } from 'react'
import { ChevronLeft, Send, Paperclip, Pin, Plus, Megaphone, Users, Mail, Smartphone, Bell } from 'lucide-react'
import { Avatar, Badge, Button, Card, Checkbox, Field, Input, KV, Modal, PageHeader, SearchInput, Select, Switch, Textarea, cn, useToast } from '../../components/ui'
import { announcements as seedAnnouncements, demoUsers, roleLabel, threads as studentThreads, type Role, type Thread, type Announcement } from '../../data/school'
import { fmtDate, fmtDateTime, relative } from '../../lib/format'

function threadsFor(role: Role): Thread[] {
  if (role === 'student') return studentThreads
  if (role === 'parent') return [
    { id: 'pm1', with: 'Mr Samuel Okello', withRole: 'Amani’s Chemistry teacher', subject: 'Amani’s progress in Chemistry', unread: 1, messages: [
      { from: 'me', text: 'Good evening Mr Okello. How is Amani coping with the new stoichiometry topic?', time: '2026-10-04T20:05' },
      { from: 'them', text: 'Good evening Mrs Nakato. She is doing very well and asks good questions. A little more practice with units will help her get full marks.', time: '2026-10-05T08:15' },
    ] },
    { id: 'pm2', with: 'Ms Ruth Atim', withRole: 'Daniel’s class teacher', subject: 'Reading at home', unread: 0, messages: [
      { from: 'them', text: 'Daniel finished his reading book early. I’ve added two more to his library shelf.', time: '2026-10-01T15:30' },
      { from: 'me', text: 'Thank you, he is enjoying them!', time: '2026-10-01T19:02' },
    ] },
    { id: 'pm3', with: 'Mr Peter Kato', withRole: 'Bursar', subject: 'Second instalment for Amani', unread: 0, messages: [
      { from: 'me', text: 'Can I pay Amani’s second instalment on 20 October?', time: '2026-09-29T10:12' },
      { from: 'them', text: 'Yes, any date up to 23 October is fine. You can pay by Mobile Money from the Fees page.', time: '2026-09-29T11:40' },
    ] },
  ]
  if (role === 'teacher' || role === 'hod') return [
    { id: 'tm1', with: 'Amani Nakato', withRole: 'Year 10 student', subject: 'Question about molar mass', unread: 0, messages: [
      { from: 'them', text: 'Good morning sir, in question 6 do we use 35.5 for chlorine or round it to 35?', time: '2026-10-05T19:12' },
      { from: 'me', text: 'Good question, Amani. Always use 35.5 unless the question gives a different value. The mark scheme expects it.', time: '2026-10-05T19:40' },
    ] },
    { id: 'tm2', with: 'Mrs Grace Nakato', withRole: 'Parent of Amani (Year 10)', subject: 'Amani’s progress in Chemistry', unread: 1, messages: [
      { from: 'them', text: 'Good evening Mr Okello. How is Amani coping with the new stoichiometry topic?', time: '2026-10-04T20:05' },
    ] },
    { id: 'tm3', with: 'Science department', withRole: 'Staff group · 3 members', subject: 'Mock exam papers', unread: 1, messages: [
      { from: 'them', text: 'Ms Nalwoga: I’ve uploaded the Year 11 Biology mock for checking.', time: '2026-10-05T16:20' },
    ] },
  ]
  return [
    { id: 'sm1', with: 'Mr Samuel Okello', withRole: 'Head of Sciences', subject: 'Year 11 mock timetable', unread: 0, messages: [{ from: 'them', text: 'The mock timetable is final. Can it go out to parents this week?', time: '2026-10-05T12:00' }] },
    { id: 'sm2', with: 'Mrs Alice Uwimana', withRole: 'Applicant parent', subject: 'Application APP-2026-0418', unread: 1, messages: [{ from: 'them', text: 'Hello, I have submitted Keza’s application. How long does the review take?', time: '2026-10-05T18:44' }] },
  ]
}

export function Messages({ role }: { role: Role }) {
  const [list, setList] = useState(() => threadsFor(role))
  const [active, setActive] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const [compose, setCompose] = useState(false)
  const toast = useToast()
  const shown = list.filter((t) => (t.with + t.subject).toLowerCase().includes(q.toLowerCase()))
  const current = list.find((t) => t.id === active) ?? null
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
  const sel = current ?? (isDesktop ? list[0] : null)

  const send = () => {
    if (!text.trim() || !sel) return
    setList((ls) => ls.map((t) => (t.id === sel.id ? { ...t, messages: [...t.messages, { from: 'me', text: text.trim(), time: '2026-10-06T09:21' }] } : t)))
    setText('')
  }
  return (
    <>
      <PageHeader title="Messages" description="Messages stay inside the school system so teachers, learners and parents have one record." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setCompose(true)}>New message</Button>} />
      <Card pad={false} className="grid min-h-[560px] overflow-hidden lg:grid-cols-[340px_1fr]">
        <div className={cn('flex flex-col border-line lg:border-r', sel && !isDesktop && 'hidden')}>
          <div className="border-b border-line p-3"><SearchInput value={q} onChange={setQ} placeholder="Search messages" /></div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {shown.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => { setActive(t.id); setList((ls) => ls.map((x) => (x.id === t.id ? { ...x, unread: 0 } : x))) }}
                  className={cn('flex w-full gap-3 border-b border-line px-4 py-3.5 text-left hover:bg-sunken/70', sel?.id === t.id && 'bg-nile-tint/50')}>
                  <Avatar name={t.with} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2"><span className="truncate text-[14.5px] font-semibold">{t.with}</span><span className="shrink-0 text-[12px] text-muted">{relative(t.messages[t.messages.length - 1].time)}</span></span>
                    <span className="block truncate text-[13.5px] text-ink">{t.subject}</span>
                    <span className="block truncate text-[13px] text-muted">{t.messages[t.messages.length - 1].text}</span>
                  </span>
                  {t.unread > 0 && <span className="num mt-1 h-5 min-w-5 rounded-full bg-nile px-1.5 text-center text-[11.5px] font-bold leading-5 text-nile-on">{t.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn('flex min-w-0 flex-col', !sel && 'hidden lg:flex')}>
          {sel && (
            <>
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <button type="button" className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sunken lg:hidden" onClick={() => setActive(null)} aria-label="Back to conversations"><ChevronLeft className="h-5 w-5" /></button>
                <Avatar name={sel.with} size={36} />
                <div className="min-w-0"><p className="truncate font-semibold">{sel.with}</p><p className="truncate text-[12.5px] text-muted">{sel.withRole}</p></div>
              </div>
              <div className="min-h-[320px] flex-1 space-y-3 overflow-y-auto bg-paper/60 p-4 sm:p-6">
                <p className="text-center text-[12.5px] font-semibold text-muted">{sel.subject}</p>
                {sel.messages.map((m, i) => (
                  <div key={i} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[70%]', m.from === 'me' ? 'rounded-br-md bg-nile text-nile-on' : 'rounded-bl-md border border-line bg-surface')}>
                      <p className="text-[14.5px]">{m.text}</p>
                      <p className={cn('mt-1 text-[11.5px]', m.from === 'me' ? 'text-nile-on/70' : 'text-muted')}>{fmtDateTime(m.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form className="flex items-end gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); send() }}>
                <input id="msg-attach" type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast(`Attached ${e.target.files[0].name}`)} /><button type="button" aria-label="Attach a file" onClick={() => document.getElementById('msg-attach')?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl text-muted hover:bg-sunken"><Paperclip className="h-5 w-5" /></button>
                <Textarea rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" aria-label="Message" className="max-h-32 min-h-11 resize-none"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} />
                <Button type="submit" aria-label="Send" className="w-11 shrink-0 px-0"><Send className="h-4 w-4" /></Button>
              </form>
            </>
          )}
        </div>
      </Card>
      <Modal open={compose} onClose={() => setCompose(false)} title="New message"
        footer={<><Button variant="secondary" onClick={() => setCompose(false)}>Cancel</Button><Button onClick={() => { setCompose(false); toast('Message sent') }}>Send message</Button></>}>
        <div className="space-y-4">
          <Field label="To" htmlFor="nm-to">
            <Select id="nm-to">
              {role === 'student' && <><option>Mr Samuel Okello (Chemistry, Physics)</option><option>Ms Sarah Nambi (Mathematics)</option><option>Mr David Mwesigwa (English)</option><option>Year 10 class group</option></>}
              {role === 'parent' && <><option>Amani’s teachers: Mr Samuel Okello</option><option>Daniel’s class teacher: Ms Ruth Atim</option><option>Bursar: Mr Peter Kato</option><option>Admissions office</option></>}
              {(role === 'teacher' || role === 'hod') && <><option>Year 10 Chemistry (class)</option><option>Parents of Year 10 Chemistry</option><option>Amani Nakato</option><option>Mrs Grace Nakato (parent)</option><option>Science department</option></>}
              {['registrar', 'bursar', 'admin'].includes(role) && <><option>All parents</option><option>All staff</option><option>Mr Samuel Okello</option><option>Mrs Grace Nakato</option></>}
            </Select>
          </Field>
          <Field label="Subject" htmlFor="nm-sub"><Input id="nm-sub" /></Field>
          <Field label="Message" htmlFor="nm-body"><Textarea id="nm-body" rows={5} /></Field>
        </div>
      </Modal>
    </>
  )
}

export function Announcements({ role }: { role: Role }) {
  const canPost = ['teacher', 'hod', 'admin', 'registrar', 'bursar'].includes(role)
  const [items, setItems] = useState<Announcement[]>(seedAnnouncements)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '', audience: role === 'teacher' || role === 'hod' ? 'Year 10 Chemistry' : 'Everyone', email: true, sms: false })
  const toast = useToast()
  const sorted = useMemo(() => [...items].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date)), [items])
  const publish = () => {
    if (!draft.title.trim()) return
    setItems((s) => [{ id: `n${s.length + 1}`, title: draft.title, body: draft.body, audience: draft.audience, from: demoUsers[role].name, date: '2026-10-06' }, ...s])
    setOpen(false); toast(`Published to ${draft.audience}${draft.sms ? ', with SMS' : ''}`)
    setDraft((d) => ({ ...d, title: '', body: '' }))
  }
  return (
    <>
      <PageHeader title="Announcements" description="News from the school, your teachers and the office." actions={canPost ? <Button icon={<Megaphone className="h-4 w-4" />} onClick={() => setOpen(true)}>New announcement</Button> : undefined} />
      <div className="grid gap-4">
        {sorted.map((a) => (
          <Card key={a.id} as="article">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              {a.pinned && <Badge tone="crane"><Pin className="h-3 w-3" />Pinned</Badge>}
              <span>{fmtDate(a.date, { weekday: 'long', day: 'numeric', month: 'long' })}</span><span aria-hidden>·</span><span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{a.audience}</span>
            </div>
            <h2 className="mt-2 text-[18px] font-semibold">{a.title}</h2>
            <p className="mt-1.5 max-w-prose text-[15px] text-muted">{a.body}</p>
            <p className="mt-3 flex items-center gap-2 text-[13.5px] font-medium"><Avatar name={a.from} size={24} />{a.from}</p>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New announcement" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={publish} disabled={!draft.title.trim()}>Publish</Button></>}>
        <div className="space-y-4">
          <Field label="Title" htmlFor="an-title"><Input id="an-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Message" htmlFor="an-body"><Textarea id="an-body" rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></Field>
          <Field label="Who should see it" htmlFor="an-aud">
            <Select id="an-aud" value={draft.audience} onChange={(e) => setDraft({ ...draft, audience: e.target.value })}>
              {(role === 'teacher' || role === 'hod' ? ['Year 10 Chemistry', 'Year 11 Chemistry', 'Parents of Year 10 Chemistry', 'All my classes'] : ['Everyone', 'All parents', 'All students', 'All staff', 'Primary families', 'Secondary families', 'Year 11 students and parents']).map((o) => <option key={o}>{o}</option>)}
            </Select>
          </Field>
          <div className="space-y-3 rounded-card bg-sunken p-4">
            <Checkbox checked={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} label="Also send by email" />
            <Checkbox checked={draft.sms} onChange={(v) => setDraft({ ...draft, sms: v })} label="Also send an SMS alert" description="Use for urgent or time-sensitive news. SMS costs apply per message." />
          </div>
        </div>
      </Modal>
    </>
  )
}

export function Profile({ role }: { role: Role }) {
  const u = demoUsers[role]
  const toast = useToast()
  const [prefs, setPrefs] = useState({ email: true, sms: role === 'parent', push: true, lowData: false })
  return (
    <>
      <PageHeader title="Profile and settings" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-4"><Avatar name={u.name} size={64} /><div><p className="text-[19px] font-semibold">{u.name}</p><p className="text-muted">{roleLabel[role]} · {u.title}</p></div></div>
          <div className="mt-6"><KV cols={1} items={[{ k: 'Email', v: u.email }, { k: 'Phone', v: role === 'parent' ? '+256 772 908 114' : '+256 700 000 000' }, { k: 'Time zone', v: 'Africa/Kampala (EAT, UTC+3)' }, { k: 'Language', v: 'English' }]} /></div>
          <Button variant="secondary" className="mt-6" onClick={() => toast('Profile saved')}>Save profile</Button>
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="text-[16px] font-semibold">Notifications</h2>
            <p className="text-[13.5px] text-muted">Choose how the school reaches you.</p>
            <ul className="mt-4 divide-y divide-line">
              {[
                { k: 'email' as const, icon: Mail, t: 'Email', d: 'Marks, reports, receipts and announcements' },
                { k: 'sms' as const, icon: Smartphone, t: 'SMS', d: 'Absences, fee reminders and urgent news' },
                { k: 'push' as const, icon: Bell, t: 'In the portal', d: 'Everything, shown under the bell' },
              ].map(({ k, icon: I, t, d }) => (
                <li key={k} className="flex items-center gap-4 py-3.5"><I className="h-5 w-5 shrink-0 text-nile" /><div className="min-w-0 flex-1"><p className="font-semibold">{t}</p><p className="text-[13.5px] text-muted">{d}</p></div><Switch checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={t} /></li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-4"><div className="min-w-0 flex-1"><h2 className="text-[16px] font-semibold">Save data</h2><p className="text-[13.5px] text-muted">Lower video quality and load images only when you tap them. Helpful on mobile data.</p></div><Switch checked={prefs.lowData} onChange={(v) => setPrefs({ ...prefs, lowData: v })} label="Save data" /></div>
          </Card>
          <Card>
            <h2 className="text-[16px] font-semibold">Password and security</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="New password" htmlFor="pw1" hint="At least 10 characters."><Input id="pw1" type="password" autoComplete="new-password" /></Field>
              <Field label="Confirm new password" htmlFor="pw2"><Input id="pw2" type="password" autoComplete="new-password" /></Field>
            </div>
            {role !== 'student' && role !== 'parent' && <p className="mt-4 rounded-ctl bg-sunken p-3 text-[13.5px] text-muted">Staff accounts use two-step sign-in with a code sent to your phone.</p>}
            <Button className="mt-5" onClick={() => toast('Password updated')}>Update password</Button>
          </Card>
        </div>
      </div>
    </>
  )
}
