import { cn } from './ui'

/** Original mark: an open book under a three-feather crest (a nod to the crested crane). */
export function Mark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="rgb(var(--nile))" />
      <path d="M8 16.5c4.2-1.6 8.2-1.2 12 1.3v14c-3.8-2.4-7.8-2.8-12-1.2v-14Z" fill="rgb(var(--nile-on))" />
      <path d="M32 16.5c-4.2-1.6-8.2-1.2-12 1.3v14c3.8-2.4 7.8-2.8 12-1.2v-14Z" fill="rgb(var(--nile-on))" opacity=".78" />
      <path d="M20 12.5 18 7.5M20 12.5V6.5M20 12.5l2-5" stroke="rgb(var(--crane))" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ compact, className, inverse }: { compact?: boolean; className?: string; inverse?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Mark />
      {!compact && (
        <span className="leading-none">
          <span className={cn('block font-display text-[19px] tracking-[-0.01em]', inverse ? 'text-on-band' : 'text-ink')}>Roberts College</span>
          <span className={cn('mt-1 block text-[11.5px] font-medium', inverse ? 'text-on-band/70' : 'text-muted')}>Cambridge International curriculum</span>
        </span>
      )}
    </span>
  )
}
