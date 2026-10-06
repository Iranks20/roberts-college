import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Bell, Menu as MenuIcon, X, Moon, Sun, Monitor, SunMoon, Check, LogOut, UserRound, Repeat2, Search, MoreHorizontal } from 'lucide-react'
import { Logo, Mark } from '../components/Logo'
import { Avatar, cn, IconButton, Menu, MenuItem } from '../components/ui'
import { navFor, mobilePrimary, shortLabel, type NavItem } from '../lib/nav'
import { useSession } from '../lib/session'
import { demoUsers, notificationsFor, roleLabel, term, type Role } from '../data/school'
import { relative } from '../lib/format'
import { PortalSearch } from '../components/PortalSearch'
import { SkipLink } from './PublicLayout'

const roleOrder: Role[] = ['student', 'parent', 'teacher', 'hod', 'registrar', 'bursar', 'admin']

function NavRow({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink to={item.to} end={item.end} onClick={onClick}
      className={({ isActive }) => cn('group flex h-10 items-center gap-3 rounded-ctl px-3 text-[14px] font-medium transition-colors',
        isActive ? 'bg-nile-tint text-nile' : 'text-muted hover:bg-sunken hover:text-ink')}>
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge ? <span className="num rounded-full bg-crane px-1.5 text-[11.5px] font-bold text-[#2a1c02]">{item.badge}</span> : null}
    </NavLink>
  )
}

function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const groups = navFor[role]
  return (
    <nav className="flex h-full flex-col" aria-label="Main">
      <div className="px-5 pb-4 pt-5"><Link to="/" onClick={onNavigate}><Logo /></Link></div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((g, i) => (
          <div key={i}>
            {g.label && <p className="mb-1.5 px-3 text-[12px] font-semibold text-faint">{g.label}</p>}
            <div className="space-y-0.5">{g.items.map((it) => <NavRow key={it.to} item={it} onClick={onNavigate} />)}</div>
          </div>
        ))}
      </div>
      <div className="m-3 rounded-card bg-sunken p-3.5">
        <p className="text-[12.5px] font-semibold text-ink">{term.name}</p>
        <p className="num text-[12.5px] text-muted">Week {term.week} of {term.weeks}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-crane" style={{ width: `${(term.week / term.weeks) * 100}%` }} /></div>
      </div>
    </nav>
  )
}

export function PortalLayout({ role: routeRole }: { role: Role }) {
  const { role: sessionRole, setRole, theme, setTheme } = useSession()
  const role: Role = routeRole === 'teacher' && sessionRole === 'hod' ? 'hod' : routeRole
  const user = demoUsers[role]
  const [drawer, setDrawer] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  useEffect(() => { setDrawer(false); window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => { if (routeRole !== sessionRole && !(routeRole === 'teacher' && sessionRole === 'hod')) setRole(routeRole) }, [routeRole]) // eslint-disable-line

  const allItems = navFor[role].flatMap((g) => g.items)
  const primary = mobilePrimary[role].map((p) => allItems.find((i) => i.to === p)!).filter(Boolean)
  const switchTo = (r: Role) => { setRole(r); nav(demoUsers[r].home) }
  const notifications = notificationsFor[role]
  const unread = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen lg:pl-[272px]">
      <SkipLink />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-line bg-surface lg:block"><Sidebar role={role} /></aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="anim-fade absolute inset-0 bg-[rgb(var(--shadow)/0.45)]" onClick={() => setDrawer(false)} />
          <div className="anim-sheet absolute inset-y-0 left-0 w-[86%] max-w-[300px] bg-surface shadow-pop" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <IconButton label="Close menu" className="absolute right-2 top-3" onClick={() => setDrawer(false)}><X className="h-5 w-5" /></IconButton>
            <Sidebar role={role} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <header className="sticky z-20 border-b border-line bg-paper/90 backdrop-blur" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-10">
          <IconButton label="Open menu" className="-ml-2 lg:hidden" onClick={() => setDrawer(true)}><MenuIcon className="h-5 w-5" /></IconButton>
          <Link to={user.home} className="lg:hidden"><Mark size={30} /></Link>
          <PortalSearch role={role} placeholder={role === 'student' ? 'Search subjects, homework, library' : role === 'bursar' ? 'Search learners and invoices' : role === 'parent' ? 'Search reports, fees and messages' : role === 'teacher' || role === 'hod' ? 'Search pages and learners' : 'Search learners and applications'} />
          <div className="ml-auto flex items-center gap-1">
            <Menu trigger={(_, t) => (
              <IconButton label="Appearance" onClick={t} className="hidden sm:inline-flex"><SunMoon className="h-5 w-5" /></IconButton>
            )}>
              {(close) => (<>
                <MenuItem icon={<Monitor className="h-4 w-4" />} onClick={() => { setTheme('system'); close() }}><span className="flex-1">Match my device</span>{theme === 'system' && <Check className="h-4 w-4 text-nile" />}</MenuItem>
                <MenuItem icon={<Sun className="h-4 w-4" />} onClick={() => { setTheme('light'); close() }}><span className="flex-1">Light</span>{theme === 'light' && <Check className="h-4 w-4 text-nile" />}</MenuItem>
                <MenuItem icon={<Moon className="h-4 w-4" />} onClick={() => { setTheme('dark'); close() }}><span className="flex-1">Dark</span>{theme === 'dark' && <Check className="h-4 w-4 text-nile" />}</MenuItem>
              </>)}
            </Menu>
            <Menu trigger={(_, t) => (
              <IconButton label={`Notifications, ${unread} unread`} onClick={t} className="relative">
                <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-bad" />}
              </IconButton>
            )}>
              {(close) => (
                <div className="w-[min(340px,calc(100vw-32px))]">
                  <p className="px-3 pb-1 pt-2 text-[13px] font-semibold">Notifications</p>
                  {notifications.map((n) => (
                    <Link key={n.id} to={n.to} onClick={close} className="flex gap-3 rounded-lg px-3 py-2.5 hover:bg-sunken">
                      <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.unread ? 'bg-nile' : 'bg-transparent')} />
                      <span className="min-w-0"><span className="block text-[13.5px] text-ink">{n.text}</span><span className="text-[12px] text-muted">{relative(n.time)}</span></span>
                    </Link>
                  ))}
                </div>
              )}
            </Menu>
            <Menu trigger={(_, t) => (
              <button type="button" onClick={t} className="ml-1 flex items-center gap-2.5 rounded-ctl py-1 pl-1 pr-2 hover:bg-sunken" aria-label="Account menu">
                <Avatar name={user.name} size={34} />
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[13.5px] font-semibold text-ink">{user.name}</span>
                  <span className="block text-[12px] text-muted">{roleLabel[role]}</span>
                </span>
              </button>
            )}>
              {(close) => (<>
                <div className="px-3 pb-2 pt-2"><p className="text-[14px] font-semibold">{user.name}</p><p className="truncate text-[12.5px] text-muted">{user.email}</p></div>
                <MenuItem icon={<UserRound className="h-4 w-4" />} to={`/${routeRole}/profile`} onClick={close}>Profile and settings</MenuItem>
                <div className="sm:hidden"><MenuItem icon={<SunMoon className="h-4 w-4" />} onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); close() }}>{theme === 'dark' ? 'Use light mode' : 'Use dark mode'}</MenuItem></div>
                <div className="my-1.5 border-t border-line" />
                <p className="px-3 pb-1 pt-1 text-[12px] font-semibold text-faint">Switch demo account</p>
                {roleOrder.filter((r) => r !== role).map((r) => (
                  <MenuItem key={r} icon={<Repeat2 className="h-4 w-4" />} onClick={() => { close(); switchTo(r) }}>{roleLabel[r]}</MenuItem>
                ))}
                <div className="my-1.5 border-t border-line" />
                <MenuItem icon={<LogOut className="h-4 w-4" />} to="/login" onClick={close} danger>Sign out</MenuItem>
              </>)}
            </Menu>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1240px] focus:outline-none px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pb-16">
        <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading"><span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-nile" /></div>}>
          <Outlet />
        </Suspense>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} aria-label="Quick">
        <div className="grid grid-cols-5">
          {primary.map((it) => {
            const Icon = it.icon
            return (
              <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cn('relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold', isActive ? 'text-nile' : 'text-muted')}>
                <Icon className="h-5 w-5" strokeWidth={1.9} />
                <span className="max-w-full truncate px-1">{shortLabel[it.to] ?? it.label}</span>
                {it.badge ? <span className="num absolute right-[22%] top-2 rounded-full bg-crane px-1 text-[10px] font-bold text-[#2a1c02]">{it.badge}</span> : null}
              </NavLink>
            )
          })}
          <button type="button" onClick={() => setDrawer(true)} className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted">
            <MoreHorizontal className="h-5 w-5" /> More
          </button>
        </div>
      </nav>
    </div>
  )
}
