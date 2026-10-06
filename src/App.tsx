import { lazy, Suspense, type ComponentType } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from 'react-router-dom'

// Clean URLs (/student/grades) on the real site. The single-file demo build runs inside a viewer
// frame that cannot serve deep links, so only that build keeps hash URLs.
const Router = import.meta.env.MODE === 'demo' ? HashRouter : BrowserRouter
import { SessionProvider } from './lib/session'
import { ToastProvider } from './components/ui'
import { PreviewBadge } from './components/PreviewBadge'
import { PublicLayout } from './layouts/PublicLayout'
import { PortalLayout } from './layouts/PortalLayout'
import Home from './pages/public/Home'
import { Login, ForgotPassword } from './pages/public/Auth'
import { Academics, Admissions, OnlineLearning, About, Contact, Credits } from './pages/public/Pages'
import { Apply, Track } from './pages/public/Apply'
import { Privacy, Safeguarding, NotFound } from './pages/public/Policies'
import { useDocumentTitle } from './lib/useTitle'
import { y10Timetable, okelloTimetable } from './data/school'


// Portals load on demand, so visitors to the public website only download the website.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lz = (load: () => Promise<any>, name: string) => lazy(() => load().then((m) => ({ default: m[name] as ComponentType<any> })))
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const Courses = lz(() => import('./pages/student/Learning'), 'Courses')
const CourseDetail = lz(() => import('./pages/student/Learning'), 'CourseDetail')
const LessonView = lz(() => import('./pages/student/Learning'), 'LessonView')
const LibraryPage = lz(() => import('./pages/student/Learning'), 'LibraryPage')
const Forums = lz(() => import('./pages/student/Learning'), 'Forums')
const Assignments = lz(() => import('./pages/student/Work'), 'Assignments')
const AssignmentDetail = lz(() => import('./pages/student/Work'), 'AssignmentDetail')
const Quiz = lz(() => import('./pages/student/Work'), 'Quiz')
const Grades = lz(() => import('./pages/student/Progress'), 'Grades')
const StudentReport = lz(() => import('./pages/student/Progress'), 'StudentReport')
const Attendance = lz(() => import('./pages/student/Progress'), 'Attendance')
const StudentFees = lz(() => import('./pages/student/Progress'), 'StudentFees')
const Tutor = lz(() => import('./pages/student/Progress'), 'Tutor')
const TimetablePage = lz(() => import('./pages/shared/Timetable'), 'TimetablePage')
const LiveClassroom = lazy(() => import('./pages/shared/LiveClassroom'))
const Messages = lz(() => import('./pages/shared/Comms'), 'Messages')
const Announcements = lz(() => import('./pages/shared/Comms'), 'Announcements')
const Profile = lz(() => import('./pages/shared/Comms'), 'Profile')
const TeacherDashboard = lz(() => import('./pages/teacher/Teacher'), 'TeacherDashboard')
const TeacherClasses = lz(() => import('./pages/teacher/Teacher'), 'TeacherClasses')
const ClassDetail = lz(() => import('./pages/teacher/Teacher'), 'ClassDetail')
const Planner = lz(() => import('./pages/teacher/Teacher'), 'Planner')
const Materials = lz(() => import('./pages/teacher/Teacher'), 'Materials')
const TeacherPay = lz(() => import('./pages/teacher/Teacher'), 'TeacherPay')
const Approvals = lz(() => import('./pages/teacher/Teacher'), 'Approvals')
const ParentDashboard = lz(() => import('./pages/parent/Parent'), 'ParentDashboard')
const ChildPage = lz(() => import('./pages/parent/Parent'), 'ChildPage')
const ParentReports = lz(() => import('./pages/parent/Parent'), 'ParentReports')
const ParentFees = lz(() => import('./pages/parent/Parent'), 'ParentFees')
const RegistrarDashboard = lz(() => import('./pages/staff/Registrar'), 'RegistrarDashboard')
const ApplicationsList = lz(() => import('./pages/staff/Registrar'), 'ApplicationsList')
const ApplicationDetail = lz(() => import('./pages/staff/Registrar'), 'ApplicationDetail')
const StudentRecords = lz(() => import('./pages/staff/Registrar'), 'StudentRecords')
const StudentRecord = lz(() => import('./pages/staff/Registrar'), 'StudentRecord')
const BursarDashboard = lz(() => import('./pages/staff/Bursar'), 'BursarDashboard')
const InvoicesPage = lz(() => import('./pages/staff/Bursar'), 'InvoicesPage')
const PaymentsPage = lz(() => import('./pages/staff/Bursar'), 'PaymentsPage')
const AccessPage = lz(() => import('./pages/staff/Bursar'), 'AccessPage')
const FeeStructure = lz(() => import('./pages/staff/Bursar'), 'FeeStructure')
const Payroll = lz(() => import('./pages/staff/Bursar'), 'Payroll')
const FinanceReports = lz(() => import('./pages/staff/Bursar'), 'FinanceReports')
const AdminDashboard = lz(() => import('./pages/staff/Admin'), 'AdminDashboard')
const UsersRoles = lz(() => import('./pages/staff/Admin'), 'UsersRoles')
const CalendarAdmin = lz(() => import('./pages/staff/Admin'), 'CalendarAdmin')
const AdminAcademics = lz(() => import('./pages/staff/Admin'), 'Academics')
const TimetableBuilder = lz(() => import('./pages/staff/Admin'), 'TimetableBuilder')
const Settings = lz(() => import('./pages/staff/Admin'), 'Settings')
const AuditLog = lz(() => import('./pages/staff/Admin'), 'AuditLog')
const TeacherAssignments = lz(() => import('./pages/teacher/Marking'), 'TeacherAssignments')
const NewAssignment = lz(() => import('./pages/teacher/Marking'), 'NewAssignment')
const MarkingView = lz(() => import('./pages/teacher/Marking'), 'MarkingView')
const Gradebook = lz(() => import('./pages/teacher/Marking'), 'Gradebook')
const ReportComments = lz(() => import('./pages/teacher/Marking'), 'ReportComments')

function PageLoading() {
  return <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading"><span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-nile" /></div>
}

function TitleSync() { useDocumentTitle(); return null }

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <Router>
          <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="academics" element={<Academics />} />
              <Route path="admissions" element={<Admissions />} />
              <Route path="online-learning" element={<OnlineLearning />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="credits" element={<Credits />} />
              <Route path="apply" element={<Apply />} />
              <Route path="apply/track" element={<Track />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="safeguarding" element={<Safeguarding />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="live/:role" element={<LiveClassroom />} />
            <Route path="student" element={<PortalLayout role="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="timetable" element={<TimetablePage slots={y10Timetable} viewer="student" classPath="/live/student" description="Year 10 · Term 3, week 4. Lessons are on Kampala time unless you choose another time zone." />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="courses/:id/lesson/:lessonId" element={<LessonView />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<AssignmentDetail />} />
              <Route path="quiz/:id" element={<Quiz />} />
              <Route path="grades" element={<Grades />} />
              <Route path="reports/:id" element={<StudentReport />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="messages" element={<Messages role="student" />} />
              <Route path="forums" element={<Forums />} />
              <Route path="announcements" element={<Announcements role="student" />} />
              <Route path="tutor" element={<Tutor />} />
              <Route path="fees" element={<StudentFees />} />
              <Route path="profile" element={<Profile role="student" />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Route>
            <Route path="parent" element={<PortalLayout role="parent" />}>
              <Route index element={<ParentDashboard />} />
              <Route path="child/:id" element={<ChildPage />} />
              <Route path="reports" element={<ParentReports />} />
              <Route path="fees" element={<ParentFees />} />
              <Route path="messages" element={<Messages role="parent" />} />
              <Route path="announcements" element={<Announcements role="parent" />} />
              <Route path="profile" element={<Profile role="parent" />} />
              <Route path="*" element={<Navigate to="/parent" replace />} />
            </Route>
            <Route path="teacher" element={<PortalLayout role="teacher" />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="timetable" element={<TimetablePage slots={okelloTimetable} viewer="teacher" classPath="/live/teacher" description="Mr Samuel Okello · Chemistry and Physics · Term 3, week 4" />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="classes/:id" element={<ClassDetail />} />
              <Route path="planner" element={<Planner />} />
              <Route path="materials" element={<Materials />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="assignments/new" element={<NewAssignment />} />
              <Route path="marking/:id" element={<MarkingView />} />
              <Route path="gradebook" element={<Gradebook />} />
              <Route path="reports" element={<ReportComments />} />
              <Route path="messages" element={<Messages role="teacher" />} />
              <Route path="announcements" element={<Announcements role="teacher" />} />
              <Route path="pay" element={<TeacherPay />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="profile" element={<Profile role="teacher" />} />
              <Route path="*" element={<Navigate to="/teacher" replace />} />
            </Route>
            <Route path="registrar" element={<PortalLayout role="registrar" />}>
              <Route index element={<RegistrarDashboard />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="students" element={<StudentRecords />} />
              <Route path="students/:id" element={<StudentRecord />} />
              <Route path="messages" element={<Messages role="registrar" />} />
              <Route path="announcements" element={<Announcements role="registrar" />} />
              <Route path="profile" element={<Profile role="registrar" />} />
              <Route path="*" element={<Navigate to="/registrar" replace />} />
            </Route>
            <Route path="bursar" element={<PortalLayout role="bursar" />}>
              <Route index element={<BursarDashboard />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="access" element={<AccessPage />} />
              <Route path="fee-structure" element={<FeeStructure />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="reports" element={<FinanceReports />} />
              <Route path="messages" element={<Messages role="bursar" />} />
              <Route path="announcements" element={<Announcements role="bursar" />} />
              <Route path="profile" element={<Profile role="bursar" />} />
              <Route path="*" element={<Navigate to="/bursar" replace />} />
            </Route>
            <Route path="admin" element={<PortalLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersRoles />} />
              <Route path="calendar" element={<CalendarAdmin />} />
              <Route path="academics" element={<AdminAcademics />} />
              <Route path="timetable" element={<TimetableBuilder />} />
              <Route path="announcements" element={<Announcements role="admin" />} />
              <Route path="admissions" element={<RegistrarDashboard />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="finance" element={<BursarDashboard />} />
              <Route path="finance/payments" element={<PaymentsPage />} />
              <Route path="finance/access" element={<AccessPage />} />
              <Route path="students" element={<StudentRecords />} />
              <Route path="students/:id" element={<StudentRecord />} />
              <Route path="settings" element={<Settings />} />
              <Route path="audit" element={<AuditLog />} />
              <Route path="profile" element={<Profile role="admin" />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
          </Suspense>
          <TitleSync />
          <PreviewBadge />
        </Router>
      </ToastProvider>
    </SessionProvider>
  )
}
