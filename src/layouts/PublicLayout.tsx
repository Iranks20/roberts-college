import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu as MenuIcon, X, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button, cn, IconButton } from '../components/ui'

const links = [
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions and fees' },
  { to: '/online-learning', label: 'Online learning' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/** Lets keyboard users jump past the navigation. */
export function SkipLink() {
  return (
    <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}
      className="sr-only rounded-ctl bg-nile px-4 py-2 font-semibold text-nile-on focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]">Skip to content</a>
  )
}

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <div className="bg-band text-on-band">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-2 text-[13.5px] sm:px-6">
          <p className="min-w-0"><span className="font-semibold">Admissions for Term 1, 2027 are open.</span><span className="hidden opacity-80 sm:inline"> Classes begin on 2 February 2027.</span></p>
          <Link to="/apply" className="shrink-0 font-semibold underline decoration-crane decoration-2 underline-offset-4 hover:text-crane">Apply online</Link>
        </div>
      </div>
      <header className="sticky z-30 border-b border-line bg-paper/90 backdrop-blur" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="Roberts College home"><Logo /></Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-ctl px-3 py-2 text-[14.5px] font-medium', isActive ? 'text-nile' : 'text-muted hover:text-ink')}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <Button to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
            <Button to="/apply" size="sm">Apply now</Button>
            <IconButton label={open ? 'Close menu' : 'Open menu'} className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}</IconButton>
          </div>
        </div>
        {open && (
          <nav className="anim-fade border-t border-line bg-paper px-4 pb-5 pt-2 lg:hidden" aria-label="Mobile">
            {links.map((l) => <NavLink key={l.to} to={l.to} className="block rounded-ctl px-3 py-3 text-[16px] font-medium text-ink hover:bg-sunken">{l.label}</NavLink>)}
            <NavLink to="/login" className="block rounded-ctl px-3 py-3 text-[16px] font-medium text-ink hover:bg-sunken">Sign in</NavLink>
          </nav>
        )}
      </header>

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none"><Outlet /></main>

      <footer className="mt-24 bg-band text-on-band">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo inverse />
            <p className="mt-4 max-w-xs text-[14px] text-on-band/75">An online Cambridge school for Years 4 to 13, teaching live from Kampala to families in Uganda and abroad.</p>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold text-on-band/60">School</p>
            <ul className="space-y-2 text-[14.5px]">
              <li><Link to="/academics" className="hover:underline">Academics</Link></li>
              <li><Link to="/online-learning" className="hover:underline">How online school works</Link></li>
              <li><Link to="/about" className="hover:underline">About and teachers</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold text-on-band/60">Families</p>
            <ul className="space-y-2 text-[14.5px]">
              <li><Link to="/admissions" className="hover:underline">Admissions and fees</Link></li>
              <li><Link to="/apply" className="hover:underline">Apply online</Link></li>
              <li><Link to="/apply/track" className="hover:underline">Track an application</Link></li>
              <li><Link to="/login" className="hover:underline">Sign in to the portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold text-on-band/60">Contact admissions</p>
            <ul className="space-y-2.5 text-[14.5px]">
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 opacity-70" /> admissions@robertscollege.ac.ug</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 opacity-70" /> +256 700 000 000</li>
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 opacity-70" /> Kampala, Uganda</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-on-band/10">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-5 text-[13px] text-on-band/60 sm:flex-row sm:justify-between sm:px-6">
            <p>© 2026 Roberts College. Personal data is handled under Uganda’s Data Protection and Privacy Act, 2019.</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Legal"><Link to="/privacy" className="hover:underline">Privacy</Link><Link to="/safeguarding" className="hover:underline">Safeguarding</Link><Link to="/credits" className="hover:underline">Photo credits</Link></nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
