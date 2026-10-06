import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Role } from '../data/school'

type Theme = 'system' | 'light' | 'dark'
type Session = { role: Role; setRole: (r: Role) => void; theme: Theme; setTheme: (t: Theme) => void }
const Ctx = createContext<Session>(null!)

const read = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* storage blocked: keep in memory */ } }

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>((read('rc-role') as Role) || 'student')
  const [theme, setThemeState] = useState<Theme>((read('rc-theme') as Theme) || 'system')
  useEffect(() => {
    const el = document.documentElement
    if (theme === 'system') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', theme)
  }, [theme])
  const setRole = (r: Role) => { setRoleState(r); write('rc-role', r) }
  const setTheme = (t: Theme) => { setThemeState(t); write('rc-theme', t) }
  return <Ctx.Provider value={{ role, setRole, theme, setTheme }}>{children}</Ctx.Provider>
}
export const useSession = () => useContext(Ctx)
