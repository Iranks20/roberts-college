import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft, FileText, User, BookOpen, ClipboardList, Inbox, Receipt, LayoutGrid } from 'lucide-react'
import { cn } from './ui'
import { navFor } from '../lib/nav'
import { applications, assignments, courses, invoices, library, students, y10Students, type Role } from '../data/school'

type Hit = { label: string; sub: string; to: string; icon: typeof Search }

function index(role: Role): Hit[] {
  const pages: Hit[] = navFor[role].flatMap((g) => g.items).map((i) => ({ label: i.label, sub: 'Page', to: i.to, icon: LayoutGrid }))
  const base = role === 'hod' ? 'teacher' : role
  if (role === 'student') return [
    ...pages,
    ...courses.map((c) => ({ label: c.subject.replace(' (First Language)', ''), sub: 'Subject', to: `/student/courses/${c.id}`, icon: BookOpen })),
    ...assignments.map((a) => ({ label: a.title, sub: `${a.type} · ${a.subject.replace(' (First Language)', '')}`, to: a.type === 'Quiz' && a.status === 'To do' ? `/student/quiz/${a.id}` : `/student/assignments/${a.id}`, icon: ClipboardList })),
    ...library.map((l) => ({ label: l.title, sub: `Library · ${l.kind}`, to: '/student/library', icon: FileText })),
  ]
  if (role === 'teacher' || role === 'hod') return [...pages, ...y10Students.map((s) => ({ label: s.name, sub: 'Year 10 Chemistry', to: '/teacher/classes/k-chem10', icon: User }))]
  if (role === 'parent') return [...pages, { label: 'Amani’s report card', sub: 'Term 2, 2026', to: '/parent/reports', icon: FileText }, { label: 'Pay fees', sub: 'Fees and payments', to: '/parent/fees', icon: Receipt }]
  const recordBase = role === 'admin' ? '/admin' : role === 'registrar' ? '/registrar' : '/registrar'
  return [
    ...pages,
    ...students.map((s) => ({ label: s.name, sub: `${s.className} · ${s.admissionNo}`, to: role === 'bursar' ? '/bursar/invoices' : `${recordBase}/students/${s.id}`, icon: User })),
    ...(role !== 'bursar' ? applications.map((a) => ({ label: a.applicant, sub: `Application ${a.id}`, to: `${role === 'admin' ? '/admin' : '/registrar'}/applications/${a.id}`, icon: Inbox })) : []),
    ...(role === 'bursar' || role === 'admin' ? invoices.slice(0, 50).map((i) => ({ label: i.id, sub: `Invoice · ${students.find((s) => s.id === i.studentId)?.name}`, to: role === 'admin' ? '/admin/finance' : '/bursar/invoices', icon: Receipt })) : []),
  ].map((h) => ({ ...h, to: h.to.replace(/^\/teacher/, `/${base}`) }))
}

/** Search across pages and records in the current portal. Press / to focus. */
export function PortalSearch({ role, placeholder }: { role: Role; placeholder: string }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLInputElement>(null)
  const nav = useNavigate()
  const all = useMemo(() => index(role), [role])
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return all.filter((h) => (h.label + ' ' + h.sub).toLowerCase().includes(t)).slice(0, 8)
  }, [q, all])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea,select')) { e.preventDefault(); ref.current?.focus() } }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [])
  const go = (h: Hit) => { nav(h.to); setQ(''); setOpen(false); ref.current?.blur() }

  return (
    <div className="relative ml-1 hidden max-w-md flex-1 md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input ref={ref} className="input h-10 bg-surface pl-9 pr-10" placeholder={placeholder} aria-label="Search" role="combobox" aria-expanded={open && hits.length > 0} aria-controls="portal-search-results"
        value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0) }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
          if (e.key === 'Enter' && hits[active]) go(hits[active])
          if (e.key === 'Escape') { setQ(''); ref.current?.blur() }
        }} />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 text-[11px] font-semibold text-faint">/</kbd>
      {open && q.trim() && (
        <div id="portal-search-results" role="listbox" className="anim-fade absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-pop">
          {hits.length === 0 ? <p className="px-3 py-3 text-[14px] text-muted">No results for “{q}”</p> : hits.map((h, i) => (
            <button key={h.to + h.label} type="button" role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={(e) => { e.preventDefault(); go(h) }}
              className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left', i === active && 'bg-sunken')}>
              <h.icon className="h-4 w-4 shrink-0 text-nile" />
              <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-medium text-ink">{h.label}</span><span className="block truncate text-[12.5px] text-muted">{h.sub}</span></span>
              {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-faint" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
