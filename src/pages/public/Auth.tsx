import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Users, BookOpen, Inbox, Wallet, Settings2, ShieldCheck, MailCheck } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { Button, Field, Input, Notice, cn } from '../../components/ui'
import { announcements, demoUsers, roleLabel, type Role } from '../../data/school'
import { useSession } from '../../lib/session'
import { fmtDate } from '../../lib/format'
import { Photo } from '../../components/Photo'

const demoRoles: { role: Role; icon: typeof Users }[] = [
  { role: 'student', icon: GraduationCap }, { role: 'parent', icon: Users }, { role: 'teacher', icon: BookOpen },
  { role: 'hod', icon: ShieldCheck }, { role: 'registrar', icon: Inbox }, { role: 'bursar', icon: Wallet }, { role: 'admin', icon: Settings2 },
]

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(420px,0.85fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Link to="/" className="self-start"><Logo /></Link>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">{children}</div>
      </div>
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-[#0a4035] p-10 text-white lg:flex">
        <Photo name="heroLearners" eager className="absolute inset-0 -z-10 h-full w-full bg-transparent" position="50% 40%" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a4035]/95 via-[#0a4035]/80 to-[#0a4035]/40" />
        <div>
          <p className="text-[13px] font-semibold opacity-70">This week at Roberts College</p>
          <ul className="mt-6 space-y-6">
            {announcements.slice(0, 3).map((a) => (
              <li key={a.id} className="border-l-2 border-crane pl-4">
                <p className="text-[12.5px] opacity-70">{fmtDate(a.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p className="mt-1 font-display text-[21px] leading-snug">{a.title}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="max-w-sm text-[13.5px] opacity-70">Need help signing in? Email support@robertscollege.ac.ug or call +256 700 000 000, weekdays 8:00 to 17:00 Kampala time.</p>
      </aside>
    </div>
  )
}

export function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const { setRole } = useSession()
  const nav = useNavigate()
  const go = (r: Role) => { setRole(r); nav(demoUsers[r].home) }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !pw) { setErr('Enter your school email and password.'); return }
    const match = (Object.keys(demoUsers) as Role[]).find((r) => demoUsers[r].email === email.trim().toLowerCase())
    go(match ?? 'student')
  }
  return (
    <AuthShell>
      <h1 className="h-display text-[34px] leading-tight">Sign in</h1>
      <p className="mt-2 text-[15px] text-muted">Students, parents and staff use the same sign-in page.</p>
      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Email address" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </Field>
        <Field label="Password" htmlFor="password" error={err}>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="pr-11" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between text-[14px]">
          <label className="flex items-center gap-2 text-muted"><input type="checkbox" className="h-4 w-4 accent-[rgb(var(--nile))]" defaultChecked /> Keep me signed in</label>
          <Link to="/forgot-password" className="link">Forgot password?</Link>
        </div>
        <Button type="submit" block size="lg">Sign in</Button>
      </form>
      <p className="mt-6 text-[14px] text-muted">New to Roberts College? <Link to="/apply" className="link">Apply for a place</Link> or <Link to="/apply/track" className="link">track your application</Link>.</p>

      <div className="mt-10 rounded-card border border-line bg-sunken/60 p-4">
        <p className="text-[13.5px] font-semibold text-ink">Demo accounts</p>
        <p className="text-[12.5px] text-muted">Explore each portal without a password.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {demoRoles.map(({ role, icon: Icon }) => (
            <button key={role} type="button" onClick={() => go(role)} className={cn('flex items-center gap-2.5 rounded-ctl border border-line bg-surface px-3 py-2.5 text-left text-[13.5px] font-semibold hover:border-nile hover:text-nile', role === 'admin' && 'col-span-2')}>
              <Icon className="h-4 w-4 shrink-0 text-nile" />
              <span className="min-w-0"><span className="block truncate">{roleLabel[role]}</span><span className="block truncate text-[11.5px] font-medium text-muted">{demoUsers[role].name}</span></span>
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  )
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  return (
    <AuthShell>
      {sent ? (
        <div>
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-good-tint text-good"><MailCheck className="h-6 w-6" /></span>
          <h1 className="h-display text-[32px] leading-tight">Check your email</h1>
          <p className="mt-2 text-[15px] text-muted">If <strong className="text-ink">{email || 'that address'}</strong> has a Roberts College account, a link to reset your password is on its way. The link works for 30 minutes.</p>
          <Notice tone="info" className="mt-6">Students under 13 can also ask their class teacher to reset their password.</Notice>
          <Button to="/login" variant="secondary" className="mt-6">Back to sign in</Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          <h1 className="h-display text-[32px] leading-tight">Reset your password</h1>
          <p className="mt-2 text-[15px] text-muted">Enter the email you use for Roberts College and we’ll send you a reset link.</p>
          <div className="mt-8"><Field label="Email address" htmlFor="fp-email"><Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field></div>
          <Button type="submit" block size="lg" className="mt-6">Send reset link</Button>
          <p className="mt-6 text-[14px]"><Link to="/login" className="link">Back to sign in</Link></p>
        </form>
      )}
    </AuthShell>
  )
}
