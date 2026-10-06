import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { navFor } from './nav'

const pub: Record<string, string> = {
  '/': 'Online Cambridge school in Kampala', '/academics': 'Academics', '/admissions': 'Admissions and fees', '/online-learning': 'Online learning',
  '/about': 'About', '/contact': 'Contact', '/apply': 'Apply', '/apply/track': 'Track an application', '/login': 'Sign in', '/forgot-password': 'Reset password',
  '/credits': 'Photo credits', '/privacy': 'Privacy notice', '/safeguarding': 'Safeguarding',
}
const allNav = Object.values(navFor).flat().flatMap((g) => g.items)

/** Keeps the browser tab title in step with the page, e.g. "Grades and reports · Roberts College". */
export function useDocumentTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const exact = pub[pathname] ?? allNav.find((n) => n.to === pathname)?.label
    const near = exact ?? allNav.filter((n) => pathname.startsWith(n.to + '/')).sort((a, b) => b.to.length - a.to.length)[0]?.label
    const t = pathname.startsWith('/live') ? 'Live lesson' : near
    document.title = t ? `${t} · Roberts College` : 'Roberts College'
  }, [pathname])
}
