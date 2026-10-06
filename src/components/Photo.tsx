import { photos, type PhotoKey } from '../lib/photos'
import { cn } from './ui'

/** A responsive, lazily loaded photo from the site's photo library. */
export function Photo({ name, className, imgClassName, eager, position = 'center' }: { name: PhotoKey; className?: string; imgClassName?: string; eager?: boolean; position?: string }) {
  const p = photos[name]
  return (
    <div className={cn('overflow-hidden bg-sunken', className)}>
      <img src={p.src} alt={p.alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn('h-full w-full object-cover', imgClassName)} style={{ objectPosition: position }} />
    </div>
  )
}
