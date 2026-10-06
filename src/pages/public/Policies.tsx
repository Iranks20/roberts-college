import type { ReactNode } from 'react'
import { Button } from '../../components/ui'

function Policy({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="h-display text-[40px] leading-tight">{title}</h1>
      <p className="mt-2 text-[14px] text-muted">Last updated {updated}</p>
      <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/85 [&_h2]:!mt-10 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>
    </article>
  )
}

export function Privacy() {
  return (
    <Policy title="Privacy notice" updated="1 October 2026">
      <p>Roberts College processes personal data in line with Uganda’s Data Protection and Privacy Act, 2019. This notice explains what we collect, why, and the choices families have.</p>
      <h2>What we collect</h2>
      <ul><li>Learner and parent details given in the application, including identity documents and school reports.</li><li>Attendance, marks, homework and teacher comments created during schooling.</li><li>Recordings of live lessons, kept for learners who miss a class.</li><li>Payment records. Card details are handled by our payment provider and never stored by the school.</li></ul>
      <h2>Why we use it</h2>
      <p>To admit and teach learners, report progress to parents, keep learners safe online, and manage fees. We never sell personal data or use it for advertising.</p>
      <h2>Children’s data</h2>
      <p>For learners under 18 we ask a parent or guardian’s consent at application. Parents can see everything the school holds about their child.</p>
      <h2>How long we keep it</h2>
      <p>Lesson recordings are deleted at the end of each academic year. Academic records are kept for seven years after a learner leaves, for transcripts and references.</p>
      <h2>Your rights</h2>
      <p>You can ask to see, correct or delete your data by writing to the Data Protection Officer at privacy@robertscollege.ac.ug. We reply within 30 days.</p>
    </Policy>
  )
}

export function Safeguarding() {
  return (
    <Policy title="Safeguarding online" updated="1 October 2026">
      <p>Every learner deserves to feel safe in an online classroom. These are the commitments every member of staff signs.</p>
      <h2>In live lessons</h2>
      <ul><li>Only enrolled learners and their teacher can enter a class; visitors are never admitted.</li><li>Lessons are recorded, and recordings are reviewed whenever a concern is raised.</li><li>Teachers never meet a learner one-to-one without another adult present or a recording.</li></ul>
      <h2>Messages</h2>
      <p>Staff and learners communicate only through the school portal, never on personal phones or social media. Parents can read their child’s messages with teachers.</p>
      <h2>Raising a concern</h2>
      <p>Learners and parents can contact the Designated Safeguarding Lead at safeguarding@robertscollege.ac.ug. Every concern is acknowledged within one working day.</p>
    </Policy>
  )
}

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-start justify-center px-4 py-16 sm:px-6">
      <p className="num text-[14px] font-semibold text-muted">Error 404</p>
      <h1 className="h-display mt-2 text-[40px] leading-tight">We couldn’t find that page</h1>
      <p className="mt-3 text-[16px] text-muted">The link may be old or mistyped. Try the home page, or sign in to your portal.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button to="/">Go to the home page</Button><Button to="/login" variant="secondary">Sign in</Button></div>
    </div>
  )
}
