import {
  LayoutDashboard, CalendarDays, BookOpen, ClipboardList, BarChart3, Library, MessagesSquare, Wallet, Sparkles,
  Megaphone, Users, GraduationCap, FileCheck2, NotebookPen, UploadCloud, ListChecks, Banknote, CheckSquare,
  Inbox, FolderOpen, Receipt, ShieldOff, Landmark, PieChart, Settings, ScrollText, Shapes, Clock, UserCog, MessageCircleQuestion, CalendarCheck,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '../data/school'

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number; end?: boolean }
export type NavGroup = { label?: string; items: NavItem[] }

export const navFor: Record<Role, NavGroup[]> = {
  student: [
    { items: [
      { to: '/student', label: 'Today', icon: LayoutDashboard, end: true },
      { to: '/student/timetable', label: 'Timetable', icon: CalendarDays },
      { to: '/student/courses', label: 'My subjects', icon: BookOpen },
      { to: '/student/assignments', label: 'Homework and quizzes', icon: ClipboardList, badge: 3 },
      { to: '/student/grades', label: 'Grades and reports', icon: BarChart3 },
      { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
    ] },
    { label: 'School', items: [
      { to: '/student/library', label: 'Library', icon: Library },
      { to: '/student/messages', label: 'Messages', icon: MessagesSquare, badge: 4 },
      { to: '/student/forums', label: 'Discussion forums', icon: MessageCircleQuestion },
      { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/student/tutor', label: 'Study assistant', icon: Sparkles },
      { to: '/student/fees', label: 'Fees', icon: Wallet },
    ] },
  ],
  parent: [
    { items: [
      { to: '/parent', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/parent/child/s-amani', label: 'Amani', icon: GraduationCap },
      { to: '/parent/child/s-daniel', label: 'Daniel', icon: GraduationCap },
      { to: '/parent/reports', label: 'Report cards', icon: FileCheck2 },
      { to: '/parent/fees', label: 'Fees and payments', icon: Wallet },
    ] },
    { label: 'School', items: [
      { to: '/parent/messages', label: 'Messages', icon: MessagesSquare, badge: 1 },
      { to: '/parent/announcements', label: 'Announcements', icon: Megaphone },
    ] },
  ],
  teacher: [
    { items: [
      { to: '/teacher', label: 'Today', icon: LayoutDashboard, end: true },
      { to: '/teacher/timetable', label: 'Timetable', icon: CalendarDays },
      { to: '/teacher/classes', label: 'My classes', icon: Users },
      { to: '/teacher/planner', label: 'Lesson plans', icon: NotebookPen },
      { to: '/teacher/materials', label: 'Lesson materials', icon: UploadCloud },
      { to: '/teacher/assignments', label: 'Assignments and marking', icon: ListChecks, badge: 7 },
      { to: '/teacher/gradebook', label: 'Gradebook', icon: BarChart3 },
      { to: '/teacher/reports', label: 'Report comments', icon: FileCheck2 },
    ] },
    { label: 'School', items: [
      { to: '/teacher/messages', label: 'Messages', icon: MessagesSquare, badge: 2 },
      { to: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/teacher/pay', label: 'My pay', icon: Banknote },
    ] },
  ],
  hod: [],
  registrar: [
    { items: [
      { to: '/registrar', label: 'Admissions', icon: LayoutDashboard, end: true },
      { to: '/registrar/applications', label: 'Applications', icon: Inbox, badge: 3 },
      { to: '/registrar/students', label: 'Student records', icon: FolderOpen },
    ] },
    { label: 'School', items: [
      { to: '/registrar/messages', label: 'Messages', icon: MessagesSquare },
      { to: '/registrar/announcements', label: 'Announcements', icon: Megaphone },
    ] },
  ],
  bursar: [
    { items: [
      { to: '/bursar', label: 'Finance overview', icon: LayoutDashboard, end: true },
      { to: '/bursar/invoices', label: 'Fee invoices', icon: Receipt },
      { to: '/bursar/payments', label: 'Payments', icon: Banknote, badge: 2 },
      { to: '/bursar/access', label: 'Access and reminders', icon: ShieldOff },
      { to: '/bursar/fee-structure', label: 'Fee structure', icon: Landmark },
      { to: '/bursar/payroll', label: 'Payroll', icon: Wallet },
      { to: '/bursar/reports', label: 'Finance reports', icon: PieChart },
    ] },
    { label: 'School', items: [
      { to: '/bursar/messages', label: 'Messages', icon: MessagesSquare },
      { to: '/bursar/announcements', label: 'Announcements', icon: Megaphone },
    ] },
  ],
  admin: [
    { items: [
      { to: '/admin', label: 'School overview', icon: LayoutDashboard, end: true },
      { to: '/admin/users', label: 'Users and roles', icon: UserCog },
      { to: '/admin/calendar', label: 'Academic calendar', icon: CalendarDays },
      { to: '/admin/academics', label: 'Subjects and classes', icon: Shapes },
      { to: '/admin/timetable', label: 'Timetable builder', icon: Clock },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    ] },
    { label: 'Departments', items: [
      { to: '/admin/admissions', label: 'Admissions', icon: Inbox },
      { to: '/admin/finance', label: 'Finance', icon: Wallet },
      { to: '/admin/students', label: 'Student records', icon: FolderOpen },
    ] },
    { label: 'System', items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/audit', label: 'Activity log', icon: ScrollText },
    ] },
  ],
}
navFor.hod = [
  navFor.teacher[0],
  { label: 'Head of Sciences', items: [{ to: '/teacher/approvals', label: 'Approvals', icon: CheckSquare, badge: 4 }] },
  navFor.teacher[1],
]

/** Short labels for the phone bottom bar, where space allows one word. */
export const shortLabel: Record<string, string> = {
  '/student': 'Today', '/student/assignments': 'Homework', '/student/messages': 'Messages', '/student/timetable': 'Timetable',
  '/parent': 'Overview', '/parent/reports': 'Reports', '/parent/fees': 'Fees', '/parent/messages': 'Messages',
  '/teacher': 'Today', '/teacher/timetable': 'Timetable', '/teacher/assignments': 'Marking', '/teacher/messages': 'Messages', '/teacher/approvals': 'Approvals',
  '/registrar': 'Overview', '/registrar/applications': 'Applications', '/registrar/students': 'Records', '/registrar/messages': 'Messages',
  '/bursar': 'Overview', '/bursar/payments': 'Payments', '/bursar/invoices': 'Invoices', '/bursar/payroll': 'Payroll',
  '/admin': 'Overview', '/admin/users': 'Users', '/admin/calendar': 'Calendar', '/admin/audit': 'Activity',
}

/** Bottom bar on phones: the four most-used destinations, the rest go under "More". */
export const mobilePrimary: Record<Role, string[]> = {
  student: ['/student', '/student/timetable', '/student/assignments', '/student/messages'],
  parent: ['/parent', '/parent/reports', '/parent/fees', '/parent/messages'],
  teacher: ['/teacher', '/teacher/timetable', '/teacher/assignments', '/teacher/messages'],
  hod: ['/teacher', '/teacher/approvals', '/teacher/assignments', '/teacher/messages'],
  registrar: ['/registrar', '/registrar/applications', '/registrar/students', '/registrar/messages'],
  bursar: ['/bursar', '/bursar/payments', '/bursar/invoices', '/bursar/payroll'],
  admin: ['/admin', '/admin/users', '/admin/calendar', '/admin/audit'],
}

export const roleFromPath = (path: string): Role | null => {
  const seg = path.split('/')[1]
  if (seg === 'student' || seg === 'parent' || seg === 'registrar' || seg === 'bursar' || seg === 'admin') return seg
  if (seg === 'teacher') return 'teacher'
  return null
}
