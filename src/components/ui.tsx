import { clsx } from 'clsx'
import {
  createContext, useCallback, useContext, useEffect, useId, useRef, useState,
  type ButtonHTMLAttributes, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes,
} from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, Info, X, UploadCloud, FileText, Search, Check, XCircle } from 'lucide-react'

export const cn = clsx

/* ---------- Buttons ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'subtle'
type Size = 'sm' | 'md' | 'lg'
const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-ctl transition-colors disabled:opacity-50 disabled:pointer-events-none select-none'
const btnVariant: Record<Variant, string> = {
  primary: 'bg-nile text-nile-on hover:bg-nile-deep',
  secondary: 'bg-surface text-ink border border-line hover:border-faint hover:bg-sunken',
  ghost: 'text-ink hover:bg-sunken',
  subtle: 'bg-nile-tint text-nile hover:bg-nile/15',
  danger: 'bg-bad text-white hover:bg-bad/90',
  gold: 'bg-crane text-[#2a1c02] hover:bg-crane/90',
}
const btnSize: Record<Size, string> = { sm: 'h-9 px-3 text-[13.5px]', md: 'h-11 px-4 text-[14.5px]', lg: 'h-12 px-5 text-[15.5px]' }

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; icon?: ReactNode; to?: string; block?: boolean }
export function Button({ variant = 'primary', size = 'md', icon, to, block, className, children, ...rest }: ButtonProps) {
  const cls = cn(btnBase, btnVariant[variant], btnSize[size], block && 'w-full', className)
  if (to) return <Link to={to} className={cls}>{icon}{children}</Link>
  return <button type="button" className={cls} {...rest}>{icon}{children}</button>
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} title={label} className={cn('inline-flex h-10 w-10 items-center justify-center rounded-ctl text-muted hover:bg-sunken hover:text-ink transition-colors', className)} {...rest}>
      {children}
    </button>
  )
}

/* ---------- Badges ---------- */
export type Tone = 'neutral' | 'nile' | 'good' | 'warn' | 'bad' | 'info' | 'crane'
const toneCls: Record<Tone, string> = {
  neutral: 'bg-sunken text-muted',
  nile: 'bg-nile-tint text-nile',
  good: 'bg-good-tint text-good',
  warn: 'bg-warn-tint text-warn',
  bad: 'bg-bad-tint text-bad',
  info: 'bg-info-tint text-info',
  crane: 'bg-crane-tint text-crane-ink',
}
export function Badge({ tone = 'neutral', children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap', toneCls[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function LiveBadge({ label = 'Live now' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bad px-2.5 py-0.5 text-[12px] font-bold text-white">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" /> {label}
    </span>
  )
}

/* ---------- Cards and headers ---------- */
export function Card({ className, children, pad = true, as: As = 'section' }: { className?: string; children: ReactNode; pad?: boolean; as?: 'section' | 'div' | 'article' }) {
  return <As className={cn('card', pad && 'p-5 sm:p-6', className)}>{children}</As>
}

export function CardHeader({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[13.5px] text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, description, actions, back }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; back?: { to: string; label: string } }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back && <Link to={back.to} className="mb-2 inline-block text-[13.5px] font-semibold text-muted hover:text-ink">‹ {back.label}</Link>}
        <h1 className="h-display text-[28px] leading-tight sm:text-[34px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-prose text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

/* ---------- Form fields ---------- */
export function Field({ label, hint, error, children, htmlFor, optional }: { label: string; hint?: ReactNode; error?: string; children: ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">{label}{optional && <span className="ml-1 font-normal text-faint">(optional)</span>}</label>
      {children}
      {error ? <p className="mt-1.5 text-[12.5px] font-semibold text-bad">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input className={cn('input', className)} {...p} />
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cn('input', className)} {...p} />
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn('input appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9', className)}
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2378887f' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...p}>
    {children}
  </select>
)

export function SearchInput({ placeholder = 'Search', value, onChange, className }: { placeholder?: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input className="input h-10 pl-9" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder} />
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', checked ? 'bg-nile' : 'bg-line')}>
      <span className={cn('inline-block h-5 w-5 rounded-full bg-surface shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
    </button>
  )
}

export function Checkbox({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; description?: ReactNode }) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-nile/40', checked ? 'border-nile bg-nile text-nile-on' : 'border-faint bg-surface')}>
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-medium text-ink">{label}</span>
        {description && <span className="block text-[13px] text-muted">{description}</span>}
      </span>
    </label>
  )
}

/* ---------- Segmented control and tabs ---------- */
export function Segmented<T extends string>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; className?: string }) {
  return (
    <div className={cn('inline-flex rounded-ctl bg-sunken p-1', className)} role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} type="button" onClick={() => onChange(o.value)}
          className={cn('h-8 rounded-[8px] px-3 text-[13.5px] font-semibold transition-colors', value === o.value ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink')}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Tabs<T extends string>({ value, onChange, items, className }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[]; className?: string }) {
  return (
    <div className={cn('scroll-x -mx-1 mb-5 border-b border-line', className)}>
      <div className="flex min-w-max gap-1 px-1" role="tablist">
        {items.map((t) => (
          <button key={t.value} type="button" role="tab" aria-selected={value === t.value} onClick={() => onChange(t.value)}
            className={cn('relative -mb-px flex h-11 items-center gap-2 border-b-2 px-3 text-[14px] font-semibold transition-colors',
              value === t.value ? 'border-nile text-ink' : 'border-transparent text-muted hover:text-ink')}>
            {t.label}
            {t.count !== undefined && <span className={cn('rounded-full px-1.5 text-[12px]', value === t.value ? 'bg-nile-tint text-nile' : 'bg-sunken text-muted')}>{t.count}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Avatar ---------- */
const avatarTones = ['bg-nile-tint text-nile', 'bg-crane-tint text-crane-ink', 'bg-info-tint text-info', 'bg-good-tint text-good', 'bg-bad-tint text-bad', 'bg-warn-tint text-warn']
export function initials(name: string) {
  const parts = name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '').split(' ').filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}
export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const tone = avatarTones[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTones.length]
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold', tone, className)} style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden>
      {initials(name)}
    </span>
  )
}

/* ---------- Progress ---------- */
export function Progress({ value, tone = 'nile', className, label }: { value: number; tone?: 'nile' | 'good' | 'warn' | 'bad' | 'crane'; className?: string; label?: string }) {
  const bar = { nile: 'bg-nile', good: 'bg-good', warn: 'bg-warn', bad: 'bg-bad', crane: 'bg-crane' }[tone]
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-sunken', className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn('h-full rounded-full', bar)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

/* ---------- Stat ---------- */
export function Stat({ label, value, sub, tone, icon }: { label: string; value: ReactNode; sub?: ReactNode; tone?: Tone; icon?: ReactNode }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        {icon && <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneCls[tone ?? 'nile'])}>{icon}</span>}
      </div>
      <p className="num mt-2 text-[26px] font-semibold leading-none tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-2 text-[12.5px] text-muted">{sub}</p>}
    </div>
  )
}

/* ---------- Key/value list ---------- */
export function KV({ items, cols = 2 }: { items: { k: string; v: ReactNode }[]; cols?: 1 | 2 | 3 }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', cols === 2 && 'sm:grid-cols-2', cols === 3 && 'sm:grid-cols-3')}>
      {items.map((i) => (
        <div key={i.k} className="min-w-0">
          <dt className="text-[12.5px] font-medium text-muted">{i.k}</dt>
          <dd className="mt-0.5 break-words text-[14.5px] font-medium text-ink">{i.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sunken text-muted">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[14px] text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/* ---------- Notice banner ---------- */
export function Notice({ tone = 'info', title, children, action, className }: { tone?: 'info' | 'warn' | 'bad' | 'good' | 'crane'; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  const Icon = tone === 'good' ? CheckCircle2 : tone === 'info' ? Info : AlertTriangle
  return (
    <div className={cn('flex flex-col gap-3 rounded-card p-4 sm:flex-row sm:items-center', toneCls[tone], className)} role={tone === 'bad' ? 'alert' : 'status'}>
      <Icon className="h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1 text-[14px]">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-ink/80">{children}</div>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Modal / drawer ---------- */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title: ReactNode; description?: ReactNode; children?: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="anim-fade absolute inset-0 bg-[rgb(var(--shadow)/0.45)]" onClick={onClose} />
      <div ref={ref} className={cn('anim-sheet relative flex max-h-[92vh] w-full flex-col rounded-t-panel bg-surface shadow-pop sm:rounded-panel',
        size === 'sm' && 'sm:max-w-md', size === 'md' && 'sm:max-w-xl', size === 'lg' && 'sm:max-w-3xl')}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-[13.5px] text-muted">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1"><X className="h-5 w-5" /></IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">{footer}</div>}
      </div>
    </div>
  )
}

/* ---------- Toasts ---------- */
type ToastT = { id: number; tone: 'good' | 'bad' | 'info'; text: string }
const ToastCtx = createContext<(text: string, tone?: ToastT['tone']) => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastT[]>([])
  const push = useCallback((text: string, tone: ToastT['tone'] = 'good') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, tone, text }])
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3800)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="anim-toast pointer-events-auto flex max-w-md items-center gap-3 rounded-ctl bg-ink px-4 py-3 text-[14px] font-medium text-paper shadow-pop">
            {t.tone === 'good' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[rgb(var(--good))]" /> : t.tone === 'bad' ? <XCircle className="h-5 w-5 shrink-0 text-[rgb(var(--bad))]" /> : <Info className="h-5 w-5 shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- File drop ---------- */
export type PickedFile = { name: string; size: number }
export function fmtSize(b: number) { return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB` }
export function FileDrop({ files, onChange, accept, hint = 'PDF, JPG, PNG or Word, up to 10 MB each', multiple = true, compact }: { files: PickedFile[]; onChange: (f: PickedFile[]) => void; accept?: string; hint?: string; multiple?: boolean; compact?: boolean }) {
  const [over, setOver] = useState(false)
  const id = useId()
  const add = (list: FileList | null) => {
    if (!list) return
    const picked = Array.from(list).map((f) => ({ name: f.name, size: f.size }))
    onChange(multiple ? [...files, ...picked] : picked.slice(0, 1))
  }
  return (
    <div>
      <label htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}
        className={cn('flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed text-center transition-colors',
          compact ? 'px-4 py-5' : 'px-6 py-8', over ? 'border-nile bg-nile-tint' : 'border-line bg-sunken/50 hover:border-faint')}>
        <UploadCloud className="mb-2 h-7 w-7 text-nile" />
        <span className="text-[14.5px] font-semibold text-ink">Drop files here or <span className="text-nile underline underline-offset-4">browse</span></span>
        <span className="mt-1 text-[12.5px] text-muted">{hint}</span>
        <input id={id} type="file" className="sr-only" accept={accept} multiple={multiple} onChange={(e) => add(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-3 rounded-ctl border border-line bg-surface px-3 py-2">
              <FileText className="h-5 w-5 shrink-0 text-nile" />
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{f.name}</span>
              <span className="text-[12.5px] text-muted">{fmtSize(f.size)}</span>
              <IconButton label={`Remove ${f.name}`} className="h-8 w-8" onClick={() => onChange(files.filter((_, j) => j !== i))}><X className="h-4 w-4" /></IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- Stepper (a real sequence) ---------- */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current, active = i === current
        return (
          <li key={s} className={cn('flex min-w-0 items-center gap-2', i < steps.length - 1 && 'flex-1')} aria-current={active ? 'step' : undefined}>
            <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
              done ? 'bg-nile text-nile-on' : active ? 'bg-crane text-[#2a1c02]' : 'bg-sunken text-muted')}>
              {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('hidden truncate text-[13.5px] font-semibold md:block', active ? 'text-ink' : 'text-muted')}>{s}</span>
            {i < steps.length - 1 && <span className={cn('h-px min-w-3 flex-1', done ? 'bg-nile' : 'bg-line')} />}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- Data table: table on wide screens, stacked rows on phones ---------- */
export type Column<T> = { key: string; header: string; render: (row: T) => ReactNode; className?: string; hideOnMobile?: boolean; primary?: boolean; align?: 'right'; action?: boolean }
const isAction = (c: { action?: boolean; header: string }) => c.action || ['Action', 'Receipt'].includes(c.header)
export function DataTable<T>({ columns, rows, rowKey, onRowClick, empty }: { columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string; onRowClick?: (r: T) => void; empty?: ReactNode }) {
  if (!rows.length) return <>{empty ?? <EmptyState title="Nothing here yet" />}</>
  const primary = columns.find((c) => c.primary) ?? columns[0]
  return (
    <>
      <div className="scroll-x hidden md:block">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-line text-[12.5px] text-muted">
              {columns.map((c) => <th key={c.key} className={cn('px-4 py-2.5 font-semibold first:pl-0 last:pr-0', c.align === 'right' && 'text-right', c.className)}>{c.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={rowKey(r)} onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={cn('border-b border-line last:border-0', onRowClick && 'cursor-pointer hover:bg-sunken/60')}>
                {columns.map((c) => <td key={c.key} className={cn('px-4 py-3 align-middle first:pl-0 last:pr-0', c.align === 'right' && 'text-right', c.className)}>{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-line md:hidden">
        {rows.map((r) => (
          <li key={rowKey(r)} onClick={onRowClick ? () => onRowClick(r) : undefined} className={cn('py-3.5', onRowClick && 'cursor-pointer')}>
            <div className="mb-2.5">{primary.render(r)}</div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13.5px]">
              {columns.filter((c) => c !== primary && !c.hideOnMobile && !isAction(c)).map((c) => (
                <div key={c.key} className="min-w-0"><dt className="text-[12px] text-muted">{c.header}</dt><dd className="mt-0.5 break-words font-medium">{c.render(r)}</dd></div>
              ))}
            </dl>
            {columns.filter((c) => isAction(c) && !c.hideOnMobile).map((c) => <div key={c.key} className="mt-3">{c.render(r)}</div>)}
          </li>
        ))}
      </ul>
    </>
  )
}

/* ---------- Dropdown menu ---------- */
export function Menu({ trigger, children, align = 'right' }: { trigger: (open: boolean, toggle: () => void) => ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k) }
  }, [open])
  return (
    <div className="relative" ref={ref}>
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div className={cn('anim-fade absolute z-40 mt-2 min-w-[240px] rounded-card border border-line bg-surface p-1.5 shadow-pop', align === 'right' ? 'right-0' : 'left-0')}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
export function MenuItem({ icon, children, onClick, to, danger }: { icon?: ReactNode; children: ReactNode; onClick?: () => void; to?: string; danger?: boolean }) {
  const cls = cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14px] font-medium hover:bg-sunken', danger ? 'text-bad' : 'text-ink')
  if (to) return <Link to={to} className={cls} onClick={onClick}>{icon}{children}</Link>
  return <button type="button" className={cls} onClick={onClick}>{icon}{children}</button>
}

/* ---------- Section label used inside cards ---------- */
export function Divider({ className }: { className?: string }) { return <hr className={cn('border-line', className)} /> }
