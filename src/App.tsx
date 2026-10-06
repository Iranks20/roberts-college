import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
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
import StudentDashboard from './pages/student/Dashboard'
import { Courses, CourseDetail, LessonView, LibraryPage, Forums } from './pages/student/Learning'
import { Assignments, AssignmentDetail, Quiz } from './pages/student/Work'
import { Grades, StudentReport, Attendance, StudentFees, Tutor } from './pages/student/Progress'
import { TimetablePage } from './pages/shared/Timetable'
import LiveClassroom from './pages/shared/LiveClassroom'
import { Messages, Announcements, Profile } from './pages/shared/Comms'
import { y10Timetable, okelloTimetable } from './data/school'
import { TeacherDashboard, TeacherClasses, ClassDetail, Planner, Materials, TeacherPay, Approvals } from './pages/teacher/Teacher'
import { ParentDashboard, ChildPage, ParentReports, ParentFees } from './pages/parent/Parent'
import { RegistrarDashboard, ApplicationsList, ApplicationDetail, StudentRecords, StudentRecord } from './pages/staff/Registrar'
import { BursarDashboard, InvoicesPage, PaymentsPage, AccessPage, FeeStructure, Payroll, FinanceReports } from './pages/staff/Bursar'
import { AdminDashboard, UsersRoles, CalendarAdmin, Academics as AdminAcademics, TimetableBuilder, Settings, AuditLog } from './pages/staff/Admin'
import { TeacherAssignments, NewAssignment, MarkingView, Gradebook, ReportComments } from './pages/teacher/Marking'

function TitleSync() { useDocumentTitle(); return null }

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <HashRouter>
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
          <TitleSync />
          <PreviewBadge />
        </HashRouter>
      </ToastProvider>
    </SessionProvider>
  )
}
