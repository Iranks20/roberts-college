import type { ReactNode } from 'react'
import { Photo } from './Photo'
import type { PhotoKey } from '../lib/photos'

/** Dashboard greeting with a photo on wider screens. */
export function Greeting({ eyebrow, title, photo, actions, position }: { eyebrow: string; title: string; photo: PhotoKey; actions?: ReactNode; position?: string }) {
  return (
    <div className="mb-6 grid items-end gap-4 sm:mb-8 md:grid-cols-[1fr_auto]">
      <div>
        <p className="text-[14px] font-medium text-muted">{eyebrow}</p>
        <h1 className="h-display mt-1 text-[30px] leading-tight sm:text-[38px]">{title}</h1>
        {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
      </div>
      <Photo name={photo} className="hidden h-[120px] w-[300px] rounded-card md:block" position={position} />
    </div>
  )
}
