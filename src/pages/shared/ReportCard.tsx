import { Download, Share2 } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { Button, Card, useToast } from '../../components/ui'
import { levelOfYear, teacherById, type Student, type SubjectGrade } from '../../data/school'

const short = (s: string) => s.replace('Information and Communication Technology', 'ICT').replace(' (First Language)', '')

/** Term report card. Ranking is deliberately left out, as the school decided. */
export function ReportCardDoc({ student, grades, term = 'Term 2, 2026', attendance = 95 }: { student: Student; grades: SubjectGrade[]; term?: string; attendance?: number }) {
  const toast = useToast()
  const level = levelOfYear(student.year)
  const showPredicted = level.id === 'igcse' || level.id === 'alevel'
  const avg = Math.round(grades.reduce((a, g) => a + g.overall, 0) / grades.length)
  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />} onClick={() => toast('Report emailed to the parent')}>Email to parent</Button>
        <Button size="sm" icon={<Download className="h-4 w-4" />} onClick={() => toast('Downloading report card (PDF)', 'info')}>Download PDF</Button>
      </div>
      <Card pad={false} className="mx-auto max-w-[880px] overflow-hidden">
        <div className="flex flex-col gap-4 border-b-4 border-nile p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <Logo />
          <div className="sm:text-right"><p className="font-display text-[22px]">Report card</p><p className="text-[14px] text-muted">{term}</p></div>
        </div>
        <div className="grid gap-4 border-b border-line p-6 text-[14px] sm:grid-cols-4 sm:p-8">
          <div><p className="text-muted">Learner</p><p className="font-semibold">{student.name}</p></div>
          <div><p className="text-muted">Admission number</p><p className="num font-semibold">{student.admissionNo}</p></div>
          <div><p className="text-muted">Class</p><p className="font-semibold">{student.className} · {level.short}</p></div>
          <div><p className="text-muted">Attendance</p><p className="num font-semibold">{attendance}%</p></div>
        </div>
        <div className="scroll-x p-6 sm:p-8">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="text-[12.5px] text-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-3 font-semibold">Subject</th><th className="px-3 py-2 text-right font-semibold">Coursework</th><th className="px-3 py-2 text-right font-semibold">Tests</th><th className="px-3 py-2 text-right font-semibold">Overall</th>
                {showPredicted && <th className="px-3 py-2 text-center font-semibold">Predicted grade</th>}<th className="px-3 py-2 font-semibold">Effort</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.subject} className="border-b border-line align-top last:border-0">
                  <td className="py-3 pr-3"><p className="font-semibold">{short(g.subject)}</p><p className="text-[12.5px] text-muted">{teacherById(g.teacherId).name}</p><p className="mt-1.5 max-w-sm text-[13px] text-ink/80">{g.comment}</p></td>
                  <td className="num px-3 py-3 text-right">{g.coursework}%</td><td className="num px-3 py-3 text-right">{g.tests}%</td><td className="num px-3 py-3 text-right font-semibold">{g.overall}%</td>
                  {showPredicted && <td className="px-3 py-3 text-center font-display text-[18px]">{g.predicted}</td>}<td className="px-3 py-3">{g.effort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-6 border-t border-line bg-sunken/50 p-6 sm:grid-cols-2 sm:p-8">
          <div><p className="text-[13px] font-semibold text-muted">Class teacher’s comment</p><p className="mt-1 text-[14.5px]">{student.name.split(' ')[0]} has had a strong term, with an overall average of {avg}%. {student.name.split(' ')[0]} is organised, contributes thoughtfully in live lessons and supports classmates in the forums.</p><p className="mt-2 text-[13px] text-muted">Mr Samuel Okello, form tutor</p></div>
          <div><p className="text-[13px] font-semibold text-muted">Head of school’s comment</p><p className="mt-1 text-[14.5px]">A well-earned report. Keep building on this consistency next term.</p><p className="mt-2 text-[13px] text-muted">Ms Esther Namuli, School Administrator</p></div>
        </div>
        <p className="px-6 py-4 text-[12.5px] text-muted sm:px-8">{showPredicted ? `Predicted grades use the Cambridge ${level.grading} scale and are teachers’ professional estimates.` : 'Cambridge Primary and Lower Secondary report achievement as percentages.'} Next term starts 2 February 2027.</p>
      </Card>
    </>
  )
}
