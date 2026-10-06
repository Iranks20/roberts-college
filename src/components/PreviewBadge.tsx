import { useState } from 'react'
import { Info, X } from 'lucide-react'

const KEY = 'rc-preview-dismissed'
const read = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }

/** One discreet notice for the whole preview build, instead of disclaimers scattered through the pages. */
export function PreviewBadge() {
  const [hidden, setHidden] = useState(read)
  const [open, setOpen] = useState(false)
  if (hidden) return null
  return (
    <div className="fixed bottom-4 right-4 z-40 hidden flex-col items-end lg:flex">
      {open && (
        <div className="anim-fade mb-2 w-[min(300px,calc(100vw-24px))] rounded-card border border-line bg-surface p-4 text-[13px] text-muted shadow-pop">
          <p className="font-semibold text-ink">Preview build</p>
          <p className="mt-1">Names, figures, contact and bank details are sample data. Payments, messages and uploads are not sent anywhere.</p>
        </div>
      )}
      <div className="flex items-center rounded-full border border-line bg-surface/95 text-[12px] font-semibold text-muted shadow-lift backdrop-blur">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1.5 py-1.5 pl-3 pr-2 hover:text-ink" aria-expanded={open}>
          <Info className="h-3.5 w-3.5" /> Preview
        </button>
        <button type="button" aria-label="Hide preview notice" onClick={() => { setHidden(true); try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ } }} className="flex h-7 w-7 items-center justify-center rounded-full hover:text-ink"><X className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  )
}
