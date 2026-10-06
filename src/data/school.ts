/*
  Sample data for the UI prototype. Every name and figure here is invented demo data.
  When the backend is built, each export maps to an API endpoint of the same shape.
*/

export type Role = 'student' | 'parent' | 'teacher' | 'hod' | 'registrar' | 'bursar' | 'admin'
export type LevelId = 'primary' | 'lower' | 'igcse' | 'alevel'

/* ---------- Calendar ---------- */
// The prototype runs on a fixed clock so the demo always shows a lesson in progress.
export const DEMO_NOW = new Date('2026-10-06T09:20:00+03:00') // Tuesday, 09:20 Kampala time
export const SCHOOL_TZ = 'Africa/Kampala'
export const term = { name: 'Term 3, 2026', start: '2026-09-14', end: '2026-12-04', midterm: '2026-10-23', week: 4, weeks: 12 }
export const academicYear = {
  name: '2026',
  terms: [
    { name: 'Term 1', start: '2026-02-02', end: '2026-04-24', status: 'Closed' },
    { name: 'Term 2', start: '2026-05-25', end: '2026-08-14', status: 'Closed' },
    { name: 'Term 3', start: '2026-09-14', end: '2026-12-04', status: 'Current' },
  ],
  holidays: [
    { name: 'Independence Day', date: '2026-10-09' },
    { name: 'Mid-term break', date: '2026-10-23' },
    { name: 'Cambridge exam series begins', date: '2026-10-26' },
  ],
}

/* ---------- Levels and subjects ---------- */
export const levels: { id: LevelId; name: string; short: string; years: number[]; fee: number; choice: boolean; grading: string; blurb: string; exam: string }[] = [
  { id: 'primary', name: 'Cambridge Primary', short: 'Primary', years: [4, 5, 6], fee: 400, choice: false, grading: 'Percentages and stage reports', exam: 'Cambridge Primary Checkpoint at the end of Year 6', blurb: 'Confident readers, careful thinkers and curious young scientists, taught in small live classes.' },
  { id: 'lower', name: 'Cambridge Lower Secondary', short: 'Lower Secondary', years: [7, 8, 9], fee: 600, choice: false, grading: 'Percentages and stage reports', exam: 'Cambridge Lower Secondary Checkpoint at the end of Year 9', blurb: 'A broad, rigorous foundation across sciences, languages and the humanities before subject choices.' },
  { id: 'igcse', name: 'Cambridge IGCSE', short: 'IGCSE', years: [10, 11], fee: 600, choice: true, grading: 'A* to G', exam: 'Cambridge IGCSE examinations at the end of Year 11', blurb: 'Learners choose their subjects and work towards internationally recognised IGCSE qualifications.' },
  { id: 'alevel', name: 'Cambridge AS & A Level', short: 'AS & A Level', years: [12, 13], fee: 600, choice: true, grading: 'AS a to e, A Level A* to E', exam: 'AS at the end of Year 12, A Level at the end of Year 13', blurb: 'Specialist study in three or four subjects, preparing learners for universities worldwide.' },
]
export const levelOfYear = (y: number) => levels.find((l) => l.years.includes(y))!

export const subjectsByLevel: Record<LevelId, { core: string[]; options: string[] }> = {
  primary: { core: ['Mathematics', 'English', 'Science', 'Computing', 'Global Perspectives', 'Humanities', 'Modern Foreign Language'], options: [] },
  lower: { core: ['Mathematics', 'English', 'Science', 'Computing', 'Global Perspectives', 'Geography', 'Modern Foreign Language'], options: [] },
  igcse: {
    core: ['Mathematics', 'English (First or Second Language)'],
    options: ['Biology', 'Chemistry', 'Physics', 'Economics', 'Business Studies', 'Accounting', 'Geography', 'Information and Communication Technology', 'Global Perspectives', 'French', 'Chinese', 'Spanish'],
  },
  alevel: {
    core: [],
    options: ['Mathematics', 'Further Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Business', 'Accounting', 'Geography', 'Information Technology', 'Computer Science', 'Global Perspectives & Research', 'French', 'Chinese', 'Spanish'],
  },
}
export const foreignLanguages = ['French', 'Chinese (Mandarin)', 'Spanish']
export const minOptions: Record<LevelId, number> = { primary: 0, lower: 0, igcse: 5, alevel: 3 }
export const maxOptions: Record<LevelId, number> = { primary: 0, lower: 0, igcse: 7, alevel: 4 }

/* ---------- Fees ---------- */
export const fees = {
  currency: 'USD',
  applicationFee: 50,
  instalments: 2,
  instalmentRule: 'Pay in full, or in two equal instalments: the first by the start of term and the second by mid-term.',
  methods: ['MTN Mobile Money', 'Airtel Money', 'Visa / Mastercard', 'Bank transfer'],
  bank: { name: 'Stanbic Bank Uganda', account: 'Roberts College Ltd', number: '9030 0123 4567 8', swift: 'SBICUGKX', branch: 'Kampala Road' },
}

/* ---------- People ---------- */
export type Teacher = { id: string; name: string; title: string; subjects: string[]; email: string; phone: string; hod?: string; bio: string; salary: number; joined: string }
export const teachers: Teacher[] = [
  { id: 't-okello', name: 'Mr Samuel Okello', title: 'Head of Sciences', subjects: ['Chemistry', 'Physics'], hod: 'Sciences', email: 's.okello@robertscollege.ac.ug', phone: '+256 772 410 221', bio: 'Chemistry teacher and Cambridge examiner experience, 14 years in the classroom.', salary: 1450, joined: '2025-01-06' },
  { id: 't-nambi', name: 'Ms Sarah Nambi', title: 'Mathematics teacher', subjects: ['Mathematics', 'Further Mathematics'], email: 's.nambi@robertscollege.ac.ug', phone: '+256 701 552 908', bio: 'Teaches IGCSE and A Level Mathematics; leads the maths olympiad club.', salary: 1300, joined: '2025-01-06' },
  { id: 't-mwesigwa', name: 'Mr David Mwesigwa', title: 'Head of English', subjects: ['English', 'English Language'], hod: 'Languages', email: 'd.mwesigwa@robertscollege.ac.ug', phone: '+256 782 113 640', bio: 'English language and literature, with a focus on academic writing.', salary: 1350, joined: '2025-01-06' },
  { id: 't-nalwoga', name: 'Ms Aisha Nalwoga', title: 'Biology and Science teacher', subjects: ['Biology', 'Science'], email: 'a.nalwoga@robertscollege.ac.ug', phone: '+256 753 870 112', bio: 'Biology at IGCSE and A Level, combined Science in Lower Secondary.', salary: 1250, joined: '2025-02-03' },
  { id: 't-tumusiime', name: 'Mr Brian Tumusiime', title: 'Head of Business', subjects: ['Economics', 'Business Studies', 'Business', 'Accounting'], hod: 'Business', email: 'b.tumusiime@robertscollege.ac.ug', phone: '+256 774 902 334', bio: 'Former auditor, now teaching Economics, Business and Accounting.', salary: 1300, joined: '2025-01-06' },
  { id: 't-dubois', name: 'Ms Claire Dubois', title: 'Languages teacher', subjects: ['French', 'Spanish', 'Modern Foreign Language', 'Global Perspectives', 'Global Perspectives & Research'], email: 'c.dubois@robertscollege.ac.ug', phone: '+256 709 334 187', bio: 'French and Spanish; teaches from Kampala with learners across three continents.', salary: 1300, joined: '2025-03-02' },
  { id: 't-kiggundu', name: 'Mr Joseph Kiggundu', title: 'Geography and Humanities teacher', subjects: ['Geography', 'Humanities'], email: 'j.kiggundu@robertscollege.ac.ug', phone: '+256 772 645 019', bio: 'Geography fieldwork enthusiast; Humanities for Primary.', salary: 1200, joined: '2025-01-06' },
  { id: 't-raman', name: 'Ms Priya Raman', title: 'Computing and ICT teacher', subjects: ['Computing', 'Information and Communication Technology', 'Information Technology', 'Computer Science'], email: 'p.raman@robertscollege.ac.ug', phone: '+256 700 218 556', bio: 'Software engineer turned teacher; Computing, ICT and Computer Science.', salary: 1300, joined: '2025-01-06' },
  { id: 't-atim', name: 'Ms Ruth Atim', title: 'Primary class teacher', subjects: ['Mathematics', 'English', 'Science'], email: 'r.atim@robertscollege.ac.ug', phone: '+256 784 300 771', bio: 'Primary specialist teaching Years 4 to 6.', salary: 1100, joined: '2025-01-06' },
  { id: 't-liwei', name: 'Mr Li Wei', title: 'Chinese and Mathematics teacher', subjects: ['Chinese', 'Mathematics'], email: 'l.wei@robertscollege.ac.ug', phone: '+256 706 991 245', bio: 'Mandarin Chinese at every level and Lower Secondary Mathematics.', salary: 1200, joined: '2025-04-07' },
]
export const teacherById = (id: string) => teachers.find((t) => t.id === id)!

export const staff = {
  registrar: { id: 'u-achieng', name: 'Ms Ruth Achieng', title: 'Registrar' },
  bursar: { id: 'u-kato', name: 'Mr Peter Kato', title: 'Bursar' },
  admin: { id: 'u-namuli', name: 'Ms Esther Namuli', title: 'School Administrator' },
}

const first = ['Amani', 'Daniel', 'Leah', 'Ethan', 'Kirabo', 'Noah', 'Zara', 'Ivan', 'Precious', 'Samuel', 'Talia', 'Brian', 'Ayesha', 'Joel', 'Nia', 'Ryan', 'Esther', 'Mark', 'Imani', 'Peter', 'Sophia', 'Isaac', 'Grace', 'Liam', 'Hana', 'Elijah', 'Faith', 'Omar', 'Maya', 'Jonah', 'Ruth', 'Arjun', 'Bella', 'Caleb', 'Deborah', 'Felix', 'Gloria', 'Hassan', 'Irene', 'Jamal', 'Keza', 'Lucas', 'Mercy', 'Nathan', 'Olivia', 'Pius', 'Queen', 'Rahul', 'Sandra', 'Tendo']
const last = ['Nakato', 'Nakato', 'Achieng', 'Mugisha', 'Namutebi', 'Okot', 'Hassan', 'Ssemakula', 'Atuhaire', 'Kizza', 'Mensah', 'Byaruhanga', 'Patel', 'Ssebunya', 'Akello', 'Otieno', 'Nansubuga', 'Wamala', 'Kagame', 'Lubega', 'Martins', 'Opio', 'Nabirye', 'Kamau', 'Tanaka', 'Mukasa', 'Nyakato', 'Farouk', 'Singh', 'Kato', 'Apio', 'Mehta', 'Lwanga', 'Ochieng', 'Namagembe', 'Oryem', 'Nalubega', 'Abdi', 'Kemigisha', 'Musoke', 'Uwase', 'Ferreira', 'Auma', 'Tumwine', 'Bennett', 'Kasozi', 'Nankya', 'Sharma', 'Kyomuhendo', 'Mutebi']
const countries = ['Uganda', 'Uganda', 'Uganda', 'Kenya', 'United Kingdom', 'Uganda', 'United Arab Emirates', 'Uganda', 'Rwanda', 'Uganda', 'South Sudan', 'Uganda', 'India']
const yearPlan = [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13]
// Fixed order so Amani is in Year 10 and Daniel is in Year 6.
const order = [2, 8, 9, 10, 11, 12, 13, 14, 1, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 0, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 3, 4, 5, 6, 7]

export type FeeStatus = 'Paid' | 'Part paid' | 'Overdue' | 'Suspended'
export type Student = { id: string; name: string; year: number; level: LevelId; className: string; country: string; admissionNo: string; dob: string; attendance: number; average: number; feeStatus: FeeStatus; guardian: string; subjects: string[] }

function subjectsFor(level: LevelId, i: number): string[] {
  if (level === 'primary' || level === 'lower') return subjectsByLevel[level].core.map((s) => (s === 'Modern Foreign Language' ? ['French', 'Chinese', 'Spanish'][i % 3] : s))
  if (level === 'igcse') {
    const sets = [
      ['Biology', 'Chemistry', 'Physics', 'Economics', 'Information and Communication Technology', 'Geography'],
      ['Biology', 'Chemistry', 'Business Studies', 'Accounting', 'French'],
      ['Physics', 'Chemistry', 'Information and Communication Technology', 'Economics', 'Global Perspectives'],
    ]
    return ['Mathematics', 'English (First Language)', ...sets[i % 3]]
  }
  const sets = [['Mathematics', 'Physics', 'Chemistry'], ['Biology', 'Chemistry', 'Mathematics'], ['Economics', 'Business', 'Accounting'], ['Computer Science', 'Mathematics', 'Further Mathematics', 'Physics']]
  return sets[i % 4]
}

export const students: Student[] = order.map((nameIdx, i) => {
  const year = yearPlan[i]
  const level = levelOfYear(year).id
  const feeStatus: FeeStatus = nameIdx === 0 ? 'Part paid' : i % 11 === 3 ? 'Overdue' : i % 17 === 5 ? 'Suspended' : i % 4 === 1 ? 'Part paid' : 'Paid'
  return {
    id: nameIdx === 0 ? 's-amani' : nameIdx === 1 ? 's-daniel' : `s-${i}`,
    name: `${first[nameIdx]} ${last[nameIdx]}`,
    year, level,
    className: `Year ${year}`,
    country: nameIdx < 2 ? 'Uganda' : countries[i % countries.length],
    admissionNo: `RC/${year >= 10 ? '25' : '26'}/${String(101 + i).padStart(4, '0')}`,
    dob: `20${String(26 - year - 5).padStart(2, '0')}-0${(i % 9) + 1}-1${i % 9}`,
    attendance: nameIdx === 0 ? 96 : 82 + ((i * 7) % 17),
    average: nameIdx === 0 ? 78 : 58 + ((i * 13) % 35),
    feeStatus,
    guardian: nameIdx <= 1 ? 'Mrs Grace Nakato' : `${['Mr', 'Mrs', 'Ms'][i % 3]} ${['Joseph', 'Mary', 'Annet', 'Robert', 'Fatuma', 'Moses', 'Diana'][i % 7]} ${last[nameIdx]}`,
    subjects: subjectsFor(level, i),
  }
})
export const studentById = (id: string) => students.find((s) => s.id === id)!
export const amani = studentById('s-amani')
export const daniel = studentById('s-daniel')

export const parent = { id: 'p-grace', name: 'Mrs Grace Nakato', email: 'grace.nakato@gmail.com', phone: '+256 772 908 114', children: ['s-amani', 's-daniel'] }

/* ---------- Demo accounts ---------- */
export const demoUsers: Record<Role, { name: string; title: string; email: string; home: string }> = {
  student: { name: 'Amani Nakato', title: 'Year 10 · IGCSE', email: 'amani.nakato@student.robertscollege.ac.ug', home: '/student' },
  parent: { name: 'Mrs Grace Nakato', title: 'Parent of Amani and Daniel', email: parent.email, home: '/parent' },
  teacher: { name: 'Mr Samuel Okello', title: 'Chemistry and Physics', email: 's.okello@robertscollege.ac.ug', home: '/teacher' },
  hod: { name: 'Mr Samuel Okello', title: 'Head of Sciences', email: 's.okello@robertscollege.ac.ug', home: '/teacher/approvals' },
  registrar: { name: staff.registrar.name, title: 'Registrar', email: 'admissions@robertscollege.ac.ug', home: '/registrar' },
  bursar: { name: staff.bursar.name, title: 'Bursar', email: 'bursar@robertscollege.ac.ug', home: '/bursar' },
  admin: { name: staff.admin.name, title: 'School Administrator', email: 'admin@robertscollege.ac.ug', home: '/admin' },
}
export const roleLabel: Record<Role, string> = { student: 'Student', parent: 'Parent', teacher: 'Teacher', hod: 'Head of Department', registrar: 'Registrar', bursar: 'Bursar', admin: 'Administrator' }

/* ---------- Timetable ---------- */
export const periods = [
  { id: 1, start: '08:00', end: '08:50' },
  { id: 2, start: '09:00', end: '09:50' },
  { id: 3, start: '10:10', end: '11:00' },
  { id: 4, start: '11:10', end: '12:00' },
  { id: 5, start: '13:00', end: '13:50' },
  { id: 6, start: '14:00', end: '14:50' },
]
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
export type Slot = { day: number; period: number; subject: string; teacherId: string; className: string; room: string }

const y10week: [string, string][][] = [
  [['Mathematics', 't-nambi'], ['English (First Language)', 't-mwesigwa'], ['Physics', 't-okello'], ['Biology', 't-nalwoga'], ['Geography', 't-kiggundu'], ['Information and Communication Technology', 't-raman']],
  [['Mathematics', 't-nambi'], ['Chemistry', 't-okello'], ['English (First Language)', 't-mwesigwa'], ['Biology', 't-nalwoga'], ['Economics', 't-tumusiime'], ['Information and Communication Technology', 't-raman']],
  [['Physics', 't-okello'], ['Mathematics', 't-nambi'], ['Chemistry', 't-okello'], ['Economics', 't-tumusiime'], ['English (First Language)', 't-mwesigwa'], ['Geography', 't-kiggundu']],
  [['Biology', 't-nalwoga'], ['Mathematics', 't-nambi'], ['English (First Language)', 't-mwesigwa'], ['Physics', 't-okello'], ['Information and Communication Technology', 't-raman'], ['Economics', 't-tumusiime']],
  [['Chemistry', 't-okello'], ['Geography', 't-kiggundu'], ['Mathematics', 't-nambi'], ['Biology', 't-nalwoga'], ['English (First Language)', 't-mwesigwa'], ['Form time and clubs', 't-okello']],
]
export const y10Timetable: Slot[] = y10week.flatMap((d, day) => d.map(([subject, teacherId], p) => ({ day, period: p + 1, subject, teacherId, className: 'Year 10', room: `Room ${subject.split(' ')[0]}-10` })))

const y6week: [string, string][][] = [
  [['Mathematics', 't-atim'], ['English', 't-atim'], ['Science', 't-atim'], ['Humanities', 't-kiggundu'], ['Computing', 't-raman'], ['French', 't-dubois']],
  [['English', 't-atim'], ['Mathematics', 't-atim'], ['Global Perspectives', 't-dubois'], ['Science', 't-atim'], ['Humanities', 't-kiggundu'], ['Reading club', 't-atim']],
  [['Mathematics', 't-atim'], ['Science', 't-atim'], ['English', 't-atim'], ['French', 't-dubois'], ['Computing', 't-raman'], ['Art and design', 't-atim']],
  [['English', 't-atim'], ['Mathematics', 't-atim'], ['Humanities', 't-kiggundu'], ['Science', 't-atim'], ['Global Perspectives', 't-dubois'], ['Sports and movement', 't-atim']],
  [['Mathematics', 't-atim'], ['English', 't-atim'], ['Science', 't-atim'], ['Computing', 't-raman'], ['French', 't-dubois'], ['Assembly', 't-atim']],
]
export const y6Timetable: Slot[] = y6week.flatMap((d, day) => d.map(([subject, teacherId], p) => ({ day, period: p + 1, subject, teacherId, className: 'Year 6', room: '' })))

// Mr Okello's week across his classes.
export const okelloTimetable: Slot[] = [
  { day: 0, period: 1, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 11', room: '' },
  { day: 0, period: 3, subject: 'Physics', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 0, period: 5, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 12', room: '' },
  { day: 1, period: 2, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 1, period: 4, subject: 'Physics', teacherId: 't-okello', className: 'Year 11', room: '' },
  { day: 1, period: 6, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 13', room: '' },
  { day: 2, period: 1, subject: 'Physics', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 2, period: 3, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 2, period: 5, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 11', room: '' },
  { day: 3, period: 2, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 12', room: '' },
  { day: 3, period: 4, subject: 'Physics', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 3, period: 5, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 13', room: '' },
  { day: 4, period: 1, subject: 'Chemistry', teacherId: 't-okello', className: 'Year 10', room: '' },
  { day: 4, period: 3, subject: 'Physics', teacherId: 't-okello', className: 'Year 11', room: '' },
  { day: 4, period: 6, subject: 'Form time and clubs', teacherId: 't-okello', className: 'Year 10', room: '' },
]

/* ---------- Courses (subject offerings) ---------- */
export type Lesson = { id: string; title: string; date: string; duration: string; recording: boolean; notes: string[]; watched: boolean }
export type Topic = { id: string; title: string; lessons: Lesson[] }
export type Course = { id: string; subject: string; className: string; teacherId: string; progress: number; nextTopic: string; topics: Topic[]; colour: number }

const L = (id: string, title: string, date: string, watched: boolean, notes: string[] = ['Lesson slides (PDF)']): Lesson => ({ id, title, date, duration: '50 min', recording: true, notes, watched })
export const courses: Course[] = [
  {
    id: 'c-chem10', subject: 'Chemistry', className: 'Year 10', teacherId: 't-okello', progress: 34, nextTopic: 'Moles and molar mass', colour: 0,
    topics: [
      { id: 'tp1', title: 'States of matter and atomic structure', lessons: [L('l1', 'Kinetic particle theory', '2026-09-15', true), L('l2', 'Atoms, protons and isotopes', '2026-09-18', true, ['Lesson slides (PDF)', 'Isotopes worksheet (PDF)'])] },
      { id: 'tp2', title: 'Bonding and structure', lessons: [L('l3', 'Ionic bonding', '2026-09-22', true), L('l4', 'Covalent bonding and giant structures', '2026-09-25', true), L('l5', 'Metallic bonding', '2026-09-29', true, ['Lesson slides (PDF)', 'Bonding summary sheet (PDF)'])] },
      { id: 'tp3', title: 'Stoichiometry', lessons: [L('l6', 'Formulae and equations', '2026-10-02', true), L('l7', 'Relative masses', '2026-10-05', false), { id: 'l8', title: 'Moles and molar mass', date: '2026-10-06', duration: '50 min', recording: false, notes: ['Mole calculations practice (PDF)'], watched: false }] },
      { id: 'tp4', title: 'Electrochemistry', lessons: [] },
    ],
  },
  { id: 'c-math10', subject: 'Mathematics', className: 'Year 10', teacherId: 't-nambi', progress: 41, nextTopic: 'Simultaneous equations', colour: 1, topics: [{ id: 'm1', title: 'Number', lessons: [L('m-l1', 'Fractions, decimals and percentages', '2026-09-14', true), L('m-l2', 'Standard form', '2026-09-16', true)] }, { id: 'm2', title: 'Algebra', lessons: [L('m-l3', 'Expanding and factorising', '2026-09-28', true), L('m-l4', 'Linear equations', '2026-10-01', true), L('m-l5', 'Simultaneous equations', '2026-10-06', false)] }] },
  { id: 'c-eng10', subject: 'English (First Language)', className: 'Year 10', teacherId: 't-mwesigwa', progress: 30, nextTopic: 'Directed writing', colour: 2, topics: [{ id: 'e1', title: 'Reading for meaning', lessons: [L('e-l1', 'Explicit and implicit meaning', '2026-09-15', true), L('e-l2', 'Writer’s effects', '2026-09-22', true)] }, { id: 'e2', title: 'Directed writing', lessons: [L('e-l3', 'Writing a persuasive letter', '2026-10-05', false)] }] },
  { id: 'c-bio10', subject: 'Biology', className: 'Year 10', teacherId: 't-nalwoga', progress: 38, nextTopic: 'Enzymes', colour: 3, topics: [{ id: 'b1', title: 'Cells', lessons: [L('b-l1', 'Cell structure', '2026-09-14', true), L('b-l2', 'Diffusion and osmosis', '2026-09-24', true)] }, { id: 'b2', title: 'Biological molecules', lessons: [L('b-l3', 'Enzymes', '2026-10-06', false)] }] },
  { id: 'c-phy10', subject: 'Physics', className: 'Year 10', teacherId: 't-okello', progress: 36, nextTopic: 'Turning effect of forces', colour: 4, topics: [{ id: 'p1', title: 'Motion, forces and energy', lessons: [L('p-l1', 'Speed and velocity', '2026-09-14', true), L('p-l2', 'Mass, weight and density', '2026-09-21', true), L('p-l3', 'Turning effect of forces', '2026-10-05', false)] }] },
  { id: 'c-econ10', subject: 'Economics', className: 'Year 10', teacherId: 't-tumusiime', progress: 33, nextTopic: 'Price elasticity', colour: 5, topics: [{ id: 'ec1', title: 'The basic economic problem', lessons: [L('ec-l1', 'Scarcity and choice', '2026-09-15', true), L('ec-l2', 'Demand and supply', '2026-09-29', true)] }] },
  { id: 'c-ict10', subject: 'Information and Communication Technology', className: 'Year 10', teacherId: 't-raman', progress: 40, nextTopic: 'Spreadsheets: functions', colour: 6, topics: [{ id: 'i1', title: 'Spreadsheets', lessons: [L('i-l1', 'Cell referencing', '2026-09-22', true), L('i-l2', 'Functions and formulae', '2026-10-06', false)] }] },
  { id: 'c-geo10', subject: 'Geography', className: 'Year 10', teacherId: 't-kiggundu', progress: 29, nextTopic: 'River landforms', colour: 7, topics: [{ id: 'g1', title: 'Population and settlement', lessons: [L('g-l1', 'Population growth', '2026-09-16', true)] }, { id: 'g2', title: 'Rivers', lessons: [L('g-l2', 'River processes', '2026-10-02', true)] }] },
]
export const courseById = (id: string) => courses.find((c) => c.id === id)!
export const courseBySubject = (s: string) => courses.find((c) => c.subject === s)

/* ---------- Assignments ---------- */
export type AStatus = 'To do' | 'Submitted' | 'Marked' | 'Late' | 'Missing'
export type Assignment = { id: string; title: string; courseId: string; subject: string; className: string; type: 'Homework' | 'Quiz' | 'Test' | 'Project'; set: string; due: string; maxMark: number; status: AStatus; mark?: number; feedback?: string; instructions: string; submissions?: number; classSize?: number }
export const assignments: Assignment[] = [
  { id: 'a1', title: 'Mole calculations practice', courseId: 'c-chem10', subject: 'Chemistry', className: 'Year 10', type: 'Homework', set: '2026-10-02', due: '2026-10-08T17:00', maxMark: 30, status: 'To do', instructions: 'Answer questions 1 to 12 on the worksheet. Show every step of your working, including units. Upload a clear photo or PDF of your answers.', submissions: 3, classSize: 7 },
  { id: 'a2', title: 'Moles and molar mass quiz', courseId: 'c-chem10', subject: 'Chemistry', className: 'Year 10', type: 'Quiz', set: '2026-10-06', due: '2026-10-09T20:00', maxMark: 8, status: 'To do', instructions: 'Eight questions, 15 minutes. The quiz must be finished in one sitting.', submissions: 1, classSize: 7 },
  { id: 'a3', title: 'Persuasive letter: school uniform', courseId: 'c-eng10', subject: 'English (First Language)', className: 'Year 10', type: 'Homework', set: '2026-10-05', due: '2026-10-12T17:00', maxMark: 40, status: 'To do', instructions: 'Write a letter of 350 to 450 words to your head teacher arguing for or against school uniform in an online school.' },
  { id: 'a4', title: 'Simultaneous equations exercise 4B', courseId: 'c-math10', subject: 'Mathematics', className: 'Year 10', type: 'Homework', set: '2026-10-01', due: '2026-10-05T17:00', maxMark: 20, status: 'Submitted', instructions: 'Exercise 4B, questions 1 to 10.' },
  { id: 'a5', title: 'Diffusion and osmosis lab write-up', courseId: 'c-bio10', subject: 'Biology', className: 'Year 10', type: 'Project', set: '2026-09-24', due: '2026-10-01T17:00', maxMark: 25, status: 'Marked', mark: 21, feedback: 'Clear method and a well-labelled results table. Your conclusion should refer back to the concentration gradient explicitly.', instructions: 'Write up the potato-cylinder osmosis practical using the template.' },
  { id: 'a6', title: 'Bonding end-of-topic test', courseId: 'c-chem10', subject: 'Chemistry', className: 'Year 10', type: 'Test', set: '2026-09-29', due: '2026-09-30T10:00', maxMark: 50, status: 'Marked', mark: 41, feedback: 'Strong dot-and-cross diagrams. Revise why giant covalent structures have high melting points (question 7).', instructions: 'Timed test, 45 minutes.' },
  { id: 'a7', title: 'Demand and supply diagrams', courseId: 'c-econ10', subject: 'Economics', className: 'Year 10', type: 'Homework', set: '2026-09-29', due: '2026-10-02T17:00', maxMark: 20, status: 'Late', instructions: 'Draw and explain four shifts of demand or supply.' },
  { id: 'a8', title: 'Spreadsheet: school tuck-shop budget', courseId: 'c-ict10', subject: 'Information and Communication Technology', className: 'Year 10', type: 'Project', set: '2026-09-22', due: '2026-09-29T17:00', maxMark: 30, status: 'Marked', mark: 27, feedback: 'Excellent use of absolute references.', instructions: 'Build the budget spreadsheet using the brief.' },
  { id: 'a9', title: 'Speed–time graphs worksheet', courseId: 'c-phy10', subject: 'Physics', className: 'Year 10', type: 'Homework', set: '2026-09-21', due: '2026-09-25T17:00', maxMark: 20, status: 'Marked', mark: 15, feedback: 'Remember that the area under a speed–time graph is distance travelled.', instructions: 'Complete the worksheet.' },
]

/* ---------- Quiz ---------- */
export const quiz = {
  id: 'a2', title: 'Moles and molar mass quiz', minutes: 15,
  questions: [
    { q: 'What is the relative formula mass (Mr) of water, H₂O? (H = 1, O = 16)', options: ['17', '18', '19', '34'], answer: 1 },
    { q: 'One mole of any substance contains how many particles?', options: ['6.02 × 10²³', '6.02 × 10²²', '3.01 × 10²³', '1.00 × 10²³'], answer: 0 },
    { q: 'How many moles are in 44 g of carbon dioxide, CO₂? (C = 12, O = 16)', options: ['0.5 mol', '1 mol', '2 mol', '44 mol'], answer: 1 },
    { q: 'What is the mass of 0.25 mol of sodium chloride, NaCl? (Na = 23, Cl = 35.5)', options: ['14.6 g', '29.3 g', '58.5 g', '234 g'], answer: 0 },
    { q: 'Which unit is used for molar mass?', options: ['g', 'mol', 'g/mol', 'mol/dm³'], answer: 2 },
    { q: 'What is the Mr of calcium carbonate, CaCO₃? (Ca = 40, C = 12, O = 16)', options: ['68', '84', '100', '116'], answer: 2 },
    { q: '2 mol of magnesium atoms have a mass of: (Mg = 24)', options: ['12 g', '24 g', '48 g', '96 g'], answer: 2 },
    { q: 'Which has the most particles?', options: ['1 g of hydrogen gas, H₂', '1 g of oxygen gas, O₂', '1 g of helium, He', 'They are all the same'], answer: 2 },
  ],
}

/* ---------- Grades and reports ---------- */
export type SubjectGrade = { subject: string; teacherId: string; coursework: number; tests: number; overall: number; predicted: string; effort: 'Excellent' | 'Good' | 'Needs focus'; trend: number[]; comment: string }
export const amaniGrades: SubjectGrade[] = [
  { subject: 'Mathematics', teacherId: 't-nambi', coursework: 84, tests: 79, overall: 81, predicted: 'A', effort: 'Excellent', trend: [72, 76, 79, 81], comment: 'Amani works accurately and explains her reasoning well. Next step: practise multi-step algebra problems under time pressure.' },
  { subject: 'English (First Language)', teacherId: 't-mwesigwa', coursework: 74, tests: 70, overall: 72, predicted: 'B', effort: 'Good', trend: [66, 69, 70, 72], comment: 'Thoughtful reader. Her writing will improve further with more varied sentence structures.' },
  { subject: 'Chemistry', teacherId: 't-okello', coursework: 83, tests: 82, overall: 82, predicted: 'A', effort: 'Excellent', trend: [74, 78, 80, 82], comment: 'Excellent progress in bonding. Keep practising mole calculations with units.' },
  { subject: 'Biology', teacherId: 't-nalwoga', coursework: 85, tests: 78, overall: 81, predicted: 'A', effort: 'Excellent', trend: [77, 79, 80, 81], comment: 'Careful practical work and clear write-ups.' },
  { subject: 'Physics', teacherId: 't-okello', coursework: 72, tests: 68, overall: 70, predicted: 'B', effort: 'Good', trend: [64, 66, 69, 70], comment: 'Good understanding of motion. Graph skills need more practice.' },
  { subject: 'Economics', teacherId: 't-tumusiime', coursework: 68, tests: 74, overall: 71, predicted: 'B', effort: 'Needs focus', trend: [70, 72, 70, 71], comment: 'Strong in class discussion; homework must be handed in on time.' },
  { subject: 'Information and Communication Technology', teacherId: 't-raman', coursework: 91, tests: 86, overall: 89, predicted: 'A*', effort: 'Excellent', trend: [82, 85, 87, 89], comment: 'Outstanding practical skills.' },
  { subject: 'Geography', teacherId: 't-kiggundu', coursework: 77, tests: 75, overall: 76, predicted: 'A', effort: 'Good', trend: [71, 73, 75, 76], comment: 'Good use of case studies.' },
]
export const danielGrades: SubjectGrade[] = [
  { subject: 'Mathematics', teacherId: 't-atim', coursework: 88, tests: 84, overall: 86, predicted: '—', effort: 'Excellent', trend: [80, 82, 85, 86], comment: 'Daniel is quick with mental arithmetic and enjoys problem solving.' },
  { subject: 'English', teacherId: 't-atim', coursework: 76, tests: 72, overall: 74, predicted: '—', effort: 'Good', trend: [70, 71, 73, 74], comment: 'Reads widely. Spelling of longer words needs care.' },
  { subject: 'Science', teacherId: 't-atim', coursework: 80, tests: 78, overall: 79, predicted: '—', effort: 'Excellent', trend: [74, 76, 78, 79], comment: 'Asks excellent questions during investigations.' },
  { subject: 'Humanities', teacherId: 't-kiggundu', coursework: 75, tests: 70, overall: 73, predicted: '—', effort: 'Good', trend: [69, 70, 72, 73], comment: 'Enjoyed the topic on East African trade routes.' },
  { subject: 'Computing', teacherId: 't-raman', coursework: 82, tests: 80, overall: 81, predicted: '—', effort: 'Excellent', trend: [75, 78, 80, 81], comment: 'Writes tidy, working programs in Scratch.' },
  { subject: 'French', teacherId: 't-dubois', coursework: 70, tests: 66, overall: 68, predicted: '—', effort: 'Good', trend: [60, 63, 66, 68], comment: 'Growing confidence speaking French.' },
  { subject: 'Global Perspectives', teacherId: 't-dubois', coursework: 78, tests: 74, overall: 76, predicted: '—', effort: 'Good', trend: [70, 72, 74, 76], comment: 'Good teamwork on the water project.' },
]
export const reportCards = [
  { id: 'r-t2', term: 'Term 2, 2026', published: '2026-08-21', status: 'Published' },
  { id: 'r-t1', term: 'Term 1, 2026', published: '2026-05-04', status: 'Published' },
  { id: 'r-t3', term: 'Term 3, 2026', published: '', status: 'Due 11 December' },
]

export const attendanceBySubject = [
  { subject: 'Mathematics', attended: 15, total: 15 },
  { subject: 'English (First Language)', attended: 14, total: 15 },
  { subject: 'Chemistry', attended: 11, total: 11 },
  { subject: 'Biology', attended: 12, total: 12 },
  { subject: 'Physics', attended: 11, total: 12 },
  { subject: 'Economics', attended: 10, total: 11 },
  { subject: 'Information and Communication Technology', attended: 11, total: 11 },
  { subject: 'Geography', attended: 7, total: 8 },
]
export const absences = [
  { date: '2026-09-23', subject: 'English (First Language)', reason: 'Internet outage, notified by parent', status: 'Excused' },
  { date: '2026-09-30', subject: 'Physics', reason: 'Medical appointment', status: 'Excused' },
  { date: '2026-10-01', subject: 'Economics', reason: 'No reason given', status: 'Unexcused' },
  { date: '2026-09-21', subject: 'Geography', reason: 'Joined 20 minutes late', status: 'Late' },
]

/* ---------- Finance ---------- */
export type Invoice = { id: string; studentId: string; term: string; amount: number; paid: number; dueFirst: string; dueSecond: string; status: FeeStatus }
export const invoices: Invoice[] = students.map((s, i) => {
  const amount = levelOfYear(s.year).fee
  const paid = s.feeStatus === 'Paid' ? amount : s.feeStatus === 'Part paid' ? amount / 2 : s.feeStatus === 'Overdue' ? (i % 2 ? amount / 2 : 0) : 0
  return { id: `INV-26T3-${String(1001 + i)}`, studentId: s.id, term: term.name, amount, paid, dueFirst: '2026-09-14', dueSecond: '2026-10-23', status: s.feeStatus }
})
export type Payment = { id: string; studentId: string; payer: string; amount: number; method: string; ref: string; date: string; status: 'Confirmed' | 'Awaiting confirmation' | 'Failed' }
export const payments: Payment[] = [
  { id: 'PAY-30871', studentId: 's-amani', payer: 'Grace Nakato', amount: 300, method: 'MTN Mobile Money', ref: 'MP260912.1043.A61552', date: '2026-09-12', status: 'Confirmed' },
  { id: 'PAY-30870', studentId: 's-daniel', payer: 'Grace Nakato', amount: 400, method: 'Visa •••• 4417', ref: 'FLW-TX-8812093', date: '2026-09-12', status: 'Confirmed' },
  { id: 'PAY-30902', studentId: students[30].id, payer: students[30].guardian, amount: 300, method: 'Bank transfer', ref: 'STB/TT/260929/772', date: '2026-10-05', status: 'Awaiting confirmation' },
  { id: 'PAY-30903', studentId: students[42].id, payer: students[42].guardian, amount: 600, method: 'Bank transfer', ref: 'ABSA/UG/88120044', date: '2026-10-05', status: 'Awaiting confirmation' },
  { id: 'PAY-30899', studentId: students[12].id, payer: students[12].guardian, amount: 200, method: 'Airtel Money', ref: 'AM.2610.0412.88', date: '2026-10-04', status: 'Confirmed' },
  { id: 'PAY-30897', studentId: students[25].id, payer: students[25].guardian, amount: 300, method: 'MTN Mobile Money', ref: 'MP261003.0911.C11902', date: '2026-10-03', status: 'Failed' },
  { id: 'PAY-30894', studentId: students[7].id, payer: students[7].guardian, amount: 400, method: 'Mastercard •••• 2210', ref: 'FLW-TX-8821177', date: '2026-10-02', status: 'Confirmed' },
  { id: 'PAY-30890', studentId: students[47].id, payer: students[47].guardian, amount: 600, method: 'Visa •••• 9031', ref: 'FLW-TX-8819920', date: '2026-10-01', status: 'Confirmed' },
  { id: 'PAY-30886', studentId: students[19].id, payer: students[19].guardian, amount: 300, method: 'MTN Mobile Money', ref: 'MP260930.1530.D77341', date: '2026-09-30', status: 'Confirmed' },
  { id: 'PAY-30881', studentId: students[35].id, payer: students[35].guardian, amount: 300, method: 'Bank transfer', ref: 'STB/TT/260926/510', date: '2026-09-28', status: 'Confirmed' },
]
export const collectionsByWeek = [
  { week: 'Wk 1', amount: 9800 }, { week: 'Wk 2', amount: 5400 }, { week: 'Wk 3', amount: 2900 }, { week: 'Wk 4', amount: 1800 },
]
export type Payslip = { id: string; teacherId: string; month: string; gross: number; paye: number; nssf: number; net: number; status: 'Paid' | 'Scheduled' | 'Draft'; paidOn?: string }
export const payrollMonths = ['September 2026', 'August 2026', 'July 2026']
export const payslips: Payslip[] = payrollMonths.flatMap((month, mi) => teachers.map((t) => {
  const gross = t.salary
  const nssf = Math.round(gross * 0.05)
  const paye = Math.round(Math.max(0, gross - 110) * 0.3 * 0.6) // illustrative only
  return { id: `PS-${mi}-${t.id}`, teacherId: t.id, month, gross, paye, nssf, net: gross - paye - nssf, status: 'Paid' as const, paidOn: ['2026-09-28', '2026-08-28', '2026-07-28'][mi] }
}))
export const octoberPayroll = teachers.map((t) => ({ teacherId: t.id, gross: t.salary, allowances: t.hod ? 100 : 0, deductions: 0 }))

/* ---------- Admissions ---------- */
export type AppStatus = 'Submitted' | 'Under review' | 'Documents requested' | 'Interview' | 'Accepted' | 'Rejected' | 'Enrolled'
export type Application = { id: string; applicant: string; dob: string; year: number; country: string; guardian: string; guardianEmail: string; guardianPhone: string; subjects: string[]; submitted: string; status: AppStatus; feePaid: boolean; docs: { name: string; verified: boolean | null }[]; previousSchool: string; notes?: string }
const D = (names: string[], v: (boolean | null)[]) => names.map((name, i) => ({ name, verified: v[i] ?? null }))
export const applications: Application[] = [
  { id: 'APP-2026-0418', applicant: 'Keza Uwimana', dob: '2011-03-14', year: 10, country: 'Rwanda', guardian: 'Mrs Alice Uwimana', guardianEmail: 'alice.uwimana@gmail.com', guardianPhone: '+250 788 210 455', subjects: ['Mathematics', 'English (Second Language)', 'Biology', 'Chemistry', 'Physics', 'French', 'Geography'], submitted: '2026-10-05', status: 'Submitted', feePaid: true, docs: D(['Birth certificate', 'Year 9 report', 'Passport photo', 'Passport'], [null, null, null, null]), previousSchool: 'Green Hills Academy, Kigali' },
  { id: 'APP-2026-0417', applicant: 'Tomás Ferreira', dob: '2009-07-02', year: 12, country: 'Portugal', guardian: 'Mr Rui Ferreira', guardianEmail: 'rui.ferreira@outlook.com', guardianPhone: '+351 912 004 812', subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Computer Science'], submitted: '2026-10-04', status: 'Under review', feePaid: true, docs: D(['Birth certificate', 'IGCSE results', 'Passport photo', 'Passport'], [true, true, true, null]), previousSchool: 'Oeiras International School' },
  { id: 'APP-2026-0415', applicant: 'Joanita Nalwanga', dob: '2016-11-20', year: 4, country: 'Uganda', guardian: 'Ms Prossy Nalwanga', guardianEmail: 'prossy.n@yahoo.com', guardianPhone: '+256 772 551 090', subjects: subjectsByLevel.primary.core, submitted: '2026-10-03', status: 'Documents requested', feePaid: true, docs: D(['Birth certificate', 'Year 3 report', 'Passport photo'], [true, false, true]), previousSchool: 'Kampala Parents School', notes: 'Year 3 report is unsigned. Asked parent for a signed copy on 4 October.' },
  { id: 'APP-2026-0412', applicant: 'Arjun Mehta', dob: '2012-05-09', year: 9, country: 'United Arab Emirates', guardian: 'Mr Vikram Mehta', guardianEmail: 'vikram.mehta@gmail.com', guardianPhone: '+971 50 118 2290', subjects: subjectsByLevel.lower.core, submitted: '2026-10-01', status: 'Interview', feePaid: true, docs: D(['Birth certificate', 'Year 8 report', 'Passport photo', 'Passport'], [true, true, true, true]), previousSchool: 'GEMS Wellington, Dubai', notes: 'Online interview booked for 8 October, 10:00 Kampala time.' },
  { id: 'APP-2026-0409', applicant: 'Shanice Akinyi', dob: '2010-01-28', year: 11, country: 'Kenya', guardian: 'Mrs Ruth Akinyi', guardianEmail: 'ruth.akinyi@gmail.com', guardianPhone: '+254 722 300 118', subjects: ['Mathematics', 'English (First Language)', 'Biology', 'Chemistry', 'Business Studies', 'Accounting', 'Global Perspectives'], submitted: '2026-09-29', status: 'Accepted', feePaid: true, docs: D(['Birth certificate', 'Year 10 report', 'Passport photo', 'Passport'], [true, true, true, true]), previousSchool: 'Brookhouse School, Nairobi' },
  { id: 'APP-2026-0406', applicant: 'Elijah Mukasa', dob: '2014-08-17', year: 7, country: 'Uganda', guardian: 'Mr Henry Mukasa', guardianEmail: 'h.mukasa@gmail.com', guardianPhone: '+256 701 223 908', subjects: subjectsByLevel.lower.core, submitted: '2026-09-26', status: 'Enrolled', feePaid: true, docs: D(['Birth certificate', 'Year 6 report', 'Passport photo'], [true, true, true]), previousSchool: 'Kabojja Junior School' },
  { id: 'APP-2026-0401', applicant: 'Hana Tanaka', dob: '2008-12-02', year: 13, country: 'Japan', guardian: 'Mrs Yuki Tanaka', guardianEmail: 'yuki.tanaka@icloud.com', guardianPhone: '+81 90 4412 0081', subjects: ['Biology', 'Chemistry', 'Mathematics'], submitted: '2026-09-22', status: 'Rejected', feePaid: true, docs: D(['Birth certificate', 'AS results', 'Passport photo', 'Passport'], [true, true, true, true]), previousSchool: 'Seisen International School', notes: 'Year 13 entry not possible mid-course for this subject combination; family advised to apply for January.' },
  { id: 'APP-2026-0399', applicant: 'Ibrahim Ssali', dob: '2015-04-11', year: 5, country: 'Uganda', guardian: 'Mrs Zainab Ssali', guardianEmail: 'zainab.ssali@gmail.com', guardianPhone: '+256 752 991 120', subjects: subjectsByLevel.primary.core, submitted: '2026-10-05', status: 'Submitted', feePaid: false, docs: D(['Birth certificate', 'Year 4 report', 'Passport photo'], [null, null, null]), previousSchool: 'Aga Khan Primary School' },
  { id: 'APP-2026-0398', applicant: 'Grace Achan', dob: '2010-06-30', year: 10, country: 'South Sudan', guardian: 'Mr Peter Achan', guardianEmail: 'peter.achan@gmail.com', guardianPhone: '+211 922 104 556', subjects: ['Mathematics', 'English (Second Language)', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Geography'], submitted: '2026-09-30', status: 'Under review', feePaid: true, docs: D(['Birth certificate', 'Year 9 report', 'Passport photo', 'Passport'], [true, null, true, true]), previousSchool: 'Juba Diplomat School' },
  { id: 'APP-2026-0395', applicant: 'Oliver Bennett', dob: '2012-02-14', year: 8, country: 'United Kingdom', guardian: 'Ms Laura Bennett', guardianEmail: 'laura.bennett@gmail.com', guardianPhone: '+44 7700 900 412', subjects: subjectsByLevel.lower.core, submitted: '2026-09-24', status: 'Accepted', feePaid: true, docs: D(['Birth certificate', 'Year 7 report', 'Passport photo', 'Passport'], [true, true, true, true]), previousSchool: 'St Mary’s Primary, Bristol' },
]
export const appStatusTone: Record<AppStatus, 'neutral' | 'info' | 'warn' | 'crane' | 'good' | 'bad' | 'nile'> = {
  Submitted: 'info', 'Under review': 'crane', 'Documents requested': 'warn', Interview: 'nile', Accepted: 'good', Rejected: 'bad', Enrolled: 'good',
}

/* ---------- Communication ---------- */
export type Announcement = { id: string; title: string; body: string; from: string; date: string; audience: string; pinned?: boolean }
export const announcements: Announcement[] = [
  { id: 'n1', title: 'Independence Day: no classes on Friday 9 October', body: 'Uganda celebrates Independence Day on 9 October. There are no live lessons that day. Recordings and homework deadlines move to Monday 12 October.', from: 'Ms Esther Namuli', date: '2026-10-05', audience: 'Everyone', pinned: true },
  { id: 'n2', title: 'Second fee instalment due by 23 October', body: 'Families paying in two instalments should pay the second half by Friday 23 October. Pay from the Fees page by Mobile Money, card or bank transfer.', from: 'Mr Peter Kato', date: '2026-10-02', audience: 'Parents' },
  { id: 'n3', title: 'IGCSE mock examinations: timetable published', body: 'Year 11 mock examinations run from 2 to 13 November. The full timetable is in the Library under Exams.', from: 'Mr Samuel Okello', date: '2026-09-30', audience: 'Year 11 students and parents' },
  { id: 'n4', title: 'Science club: build a water filter', body: 'Join the Thursday science club at 15:00 to design a low-cost water filter. Materials list in the club page.', from: 'Ms Aisha Nalwoga', date: '2026-09-28', audience: 'Years 7 to 10' },
]

export type Thread = { id: string; with: string; withRole: string; subject: string; unread: number; messages: { from: 'me' | 'them'; text: string; time: string }[] }
export const threads: Thread[] = [
  { id: 'm1', with: 'Mr Samuel Okello', withRole: 'Chemistry teacher', subject: 'Question about molar mass', unread: 1, messages: [
    { from: 'me', text: 'Good morning sir, in question 6 do we use 35.5 for chlorine or round it to 35?', time: '2026-10-05T19:12' },
    { from: 'them', text: 'Good question, Amani. Always use 35.5 unless the question gives a different value. The mark scheme expects it.', time: '2026-10-05T19:40' },
  ] },
  { id: 'm2', with: 'Ms Sarah Nambi', withRole: 'Mathematics teacher', subject: 'Exercise 4B submitted', unread: 0, messages: [
    { from: 'me', text: 'I have uploaded exercise 4B. Question 9 was tricky!', time: '2026-10-04T16:02' },
    { from: 'them', text: 'Thank you. We will go through question 9 together on Wednesday.', time: '2026-10-04T18:21' },
  ] },
  { id: 'm3', with: 'Year 10 Chemistry', withRole: 'Class group · 8 members', subject: 'Lab safety video', unread: 3, messages: [
    { from: 'them', text: 'Mr Okello: Please watch the lab safety video before Friday’s practical demonstration.', time: '2026-10-03T08:10' },
  ] },
  { id: 'm4', with: 'Mr David Mwesigwa', withRole: 'English teacher', subject: 'Persuasive letter feedback', unread: 0, messages: [
    { from: 'them', text: 'Remember to plan your three main arguments before you start writing.', time: '2026-10-02T11:30' },
  ] },
]

export const forumPosts = [
  { id: 'f1', course: 'Chemistry · Year 10', title: 'Why is the mole number so large?', author: 'Felix Oryem', replies: 6, last: '2026-10-05', solved: true },
  { id: 'f2', course: 'Mathematics · Year 10', title: 'Elimination vs substitution: which is faster?', author: 'Amani Nakato', replies: 4, last: '2026-10-05', solved: false },
  { id: 'f3', course: 'Biology · Year 10', title: 'Osmosis practical: our results were odd', author: 'Gloria Nalubega', replies: 9, last: '2026-10-03', solved: true },
]

export const notifications = [
  { id: 'x1', text: 'Mr Okello replied to your question about molar mass', time: '2026-10-05T19:40', unread: true, to: '/student/messages' },
  { id: 'x2', text: 'New quiz: Moles and molar mass, due Friday 9 October', time: '2026-10-06T07:30', unread: true, to: '/student/assignments' },
  { id: 'x3', text: 'Your Bonding end-of-topic test has been marked: 41/50', time: '2026-10-02T15:00', unread: false, to: '/student/grades' },
]

export const notificationsFor: Record<Role, { id: string; text: string; time: string; unread: boolean; to: string }[]> = {
  student: notifications,
  parent: [
    { id: 'p1', text: 'Mr Okello replied about Amani’s progress in Chemistry', time: '2026-10-05T08:15', unread: true, to: '/parent/messages' },
    { id: 'p2', text: 'Reminder: Amani’s second instalment of USD 300 is due by 23 October', time: '2026-10-02T09:00', unread: true, to: '/parent/fees' },
    { id: 'p3', text: 'Amani’s Bonding test was marked: 41/50', time: '2026-10-02T15:00', unread: false, to: '/parent/child/s-amani' },
  ],
  teacher: [
    { id: 't1', text: 'Mrs Grace Nakato sent you a message about Amani', time: '2026-10-04T20:05', unread: true, to: '/teacher/messages' },
    { id: 't2', text: '3 new submissions for Mole calculations practice', time: '2026-10-06T08:01', unread: true, to: '/teacher/marking/a1' },
    { id: 't3', text: 'Your lesson plan “Moles and molar mass” was approved', time: '2026-10-05T16:40', unread: false, to: '/teacher/planner' },
  ],
  hod: [
    { id: 'h1', text: '4 items are waiting for your approval', time: '2026-10-06T07:30', unread: true, to: '/teacher/approvals' },
    { id: 'h2', text: '3 new submissions for Mole calculations practice', time: '2026-10-06T08:01', unread: true, to: '/teacher/marking/a1' },
  ],
  registrar: [
    { id: 'r1', text: 'New application from Keza Uwimana (Year 10)', time: '2026-10-05T18:44', unread: true, to: '/registrar/applications/APP-2026-0418' },
    { id: 'r2', text: 'Interview with Arjun Mehta is on Thursday at 10:00', time: '2026-10-06T07:00', unread: true, to: '/registrar/applications/APP-2026-0412' },
  ],
  bursar: [
    { id: 'b1', text: '2 bank transfers are waiting for confirmation', time: '2026-10-05T17:10', unread: true, to: '/bursar/payments' },
    { id: 'b2', text: 'October payroll is ready to approve', time: '2026-10-06T08:00', unread: true, to: '/bursar/payroll' },
    { id: 'b3', text: 'Final notice period ends for 1 account on 6 October', time: '2026-10-06T06:00', unread: false, to: '/bursar/access' },
  ],
  admin: [
    { id: 'a1', text: 'Timetable clash: Mr Okello, Monday 08:00', time: '2026-10-06T07:45', unread: true, to: '/admin/timetable' },
    { id: 'a2', text: 'Mr Li Wei has not accepted his invitation yet', time: '2026-10-05T12:00', unread: false, to: '/admin/users' },
    { id: 'a3', text: 'Daily backup completed', time: '2026-10-06T03:00', unread: false, to: '/admin/settings' },
  ],
}

/* ---------- Library ---------- */
export type LibItem = { id: string; title: string; kind: 'E-book' | 'Past paper' | 'Revision notes' | 'Video' | 'Journal'; level: string; subject: string; by: string; size?: string; year?: string }
export const library: LibItem[] = [
  { id: 'lb1', title: 'Cambridge IGCSE Chemistry Coursebook', kind: 'E-book', level: 'IGCSE', subject: 'Chemistry', by: 'Cambridge University Press', size: '412 pages' },
  { id: 'lb2', title: 'Chemistry 0620 Paper 4, May/June 2025', kind: 'Past paper', level: 'IGCSE', subject: 'Chemistry', by: 'Cambridge International', year: '2025' },
  { id: 'lb3', title: 'Chemistry 0620 Paper 4 mark scheme, May/June 2025', kind: 'Past paper', level: 'IGCSE', subject: 'Chemistry', by: 'Cambridge International', year: '2025' },
  { id: 'lb4', title: 'Stoichiometry in one page', kind: 'Revision notes', level: 'IGCSE', subject: 'Chemistry', by: 'Mr Samuel Okello', size: '2 pages' },
  { id: 'lb5', title: 'Cambridge IGCSE Mathematics Core and Extended', kind: 'E-book', level: 'IGCSE', subject: 'Mathematics', by: 'Cambridge University Press', size: '590 pages' },
  { id: 'lb6', title: 'Mathematics 0580 Paper 2, Oct/Nov 2025', kind: 'Past paper', level: 'IGCSE', subject: 'Mathematics', by: 'Cambridge International', year: '2025' },
  { id: 'lb7', title: 'Algebra toolkit: worked examples', kind: 'Revision notes', level: 'IGCSE', subject: 'Mathematics', by: 'Ms Sarah Nambi', size: '8 pages' },
  { id: 'lb8', title: 'How enzymes work (animation)', kind: 'Video', level: 'IGCSE', subject: 'Biology', by: 'Ms Aisha Nalwoga', size: '6 min' },
  { id: 'lb9', title: 'Cambridge Primary Science Learner’s Book 6', kind: 'E-book', level: 'Primary', subject: 'Science', by: 'Cambridge University Press', size: '168 pages' },
  { id: 'lb10', title: 'Primary Checkpoint Mathematics, specimen paper', kind: 'Past paper', level: 'Primary', subject: 'Mathematics', by: 'Cambridge International', year: '2024' },
  { id: 'lb11', title: 'Economics: demand and supply flashcards', kind: 'Revision notes', level: 'IGCSE', subject: 'Economics', by: 'Mr Brian Tumusiime', size: '24 cards' },
  { id: 'lb12', title: 'Young Scientists Journal, issue 31', kind: 'Journal', level: 'All', subject: 'Science', by: 'Young Scientists Journal', size: '64 pages' },
]

/* ---------- Teacher-side data ---------- */
export const okelloClasses = [
  { id: 'k-chem10', subject: 'Chemistry', className: 'Year 10', students: 7, avg: 74, attendance: 95, toMark: 4 },
  { id: 'k-phy10', subject: 'Physics', className: 'Year 10', students: 4, avg: 69, attendance: 93, toMark: 0 },
  { id: 'k-chem11', subject: 'Chemistry', className: 'Year 11', students: 5, avg: 71, attendance: 92, toMark: 2 },
  { id: 'k-phy11', subject: 'Physics', className: 'Year 11', students: 3, avg: 66, attendance: 90, toMark: 0 },
  { id: 'k-chem12', subject: 'Chemistry', className: 'Year 12', students: 3, avg: 68, attendance: 94, toMark: 1 },
  { id: 'k-chem13', subject: 'Chemistry', className: 'Year 13', students: 2, avg: 73, attendance: 97, toMark: 0 },
]
export const y10Students = students.filter((s) => s.year === 10)
export const submissionsToMark = [
  { id: 'sb1', studentId: y10Students[1].id, assignmentId: 'a1', submitted: '2026-10-05T20:14', files: ['mole-calcs-q1-12.pdf'], late: false },
  { id: 'sb2', studentId: y10Students[2].id, assignmentId: 'a1', submitted: '2026-10-06T06:42', files: ['IMG_2041.jpg', 'IMG_2042.jpg'], late: false },
  { id: 'sb3', studentId: y10Students[4].id, assignmentId: 'a1', submitted: '2026-10-06T08:01', files: ['homework chemistry.docx'], late: false },
  { id: 'sb4', studentId: students.find((s) => s.year === 11)!.id, assignmentId: 'a1', submitted: '2026-10-04T21:30', files: ['electrolysis-answers.pdf'], late: true },
]
export const lessonPlans = [
  { id: 'lp1', title: 'Moles and molar mass', className: 'Year 10 Chemistry', date: '2026-10-06', status: 'Approved', objectives: ['Define the mole and the Avogadro constant', 'Calculate molar mass from relative atomic masses', 'Convert between mass and moles'] },
  { id: 'lp2', title: 'Reacting masses', className: 'Year 10 Chemistry', date: '2026-10-08', status: 'Submitted', objectives: ['Use balanced equations to find reacting masses', 'Identify the limiting reactant'] },
  { id: 'lp3', title: 'Electrolysis of brine', className: 'Year 11 Chemistry', date: '2026-10-07', status: 'Draft', objectives: ['Predict products at each electrode', 'Write half-equations'] },
  { id: 'lp4', title: 'Turning effect of forces', className: 'Year 10 Physics', date: '2026-10-07', status: 'Changes requested', objectives: ['Define moment of a force', 'Apply the principle of moments'], note: 'Add a worked example with two forces on one side of the pivot. — Head of Sciences' },
]
export const hodApprovals = [
  { id: 'ap1', kind: 'Lesson plan', title: 'Enzymes and temperature', by: 'Ms Aisha Nalwoga', className: 'Year 10 Biology', date: '2026-10-05' },
  { id: 'ap2', kind: 'Lesson plan', title: 'Reacting masses', by: 'Mr Samuel Okello', className: 'Year 10 Chemistry', date: '2026-10-05' },
  { id: 'ap3', kind: 'Test paper', title: 'Year 11 Physics mock, paper 4', by: 'Mr Samuel Okello', className: 'Year 11 Physics', date: '2026-10-04' },
  { id: 'ap4', kind: 'Report comments', title: 'Term 3 mid-term comments, Year 9 Science', by: 'Ms Aisha Nalwoga', className: 'Year 9 Science', date: '2026-10-03' },
]

/* ---------- Admin data ---------- */
export const auditLog = [
  { id: 'au1', when: '2026-10-06T08:58', who: 'Mr Peter Kato', action: 'Confirmed bank transfer PAY-30881 (USD 300)', area: 'Finance' },
  { id: 'au2', when: '2026-10-06T08:41', who: 'Mr Samuel Okello', action: 'Changed mark for Bonding test, Felix Oryem: 36 → 38', area: 'Grades' },
  { id: 'au3', when: '2026-10-05T17:20', who: 'Ms Ruth Achieng', action: 'Requested documents for APP-2026-0415', area: 'Admissions' },
  { id: 'au4', when: '2026-10-05T15:02', who: 'Ms Esther Namuli', action: 'Published announcement “Independence Day: no classes on Friday 9 October”', area: 'Communication' },
  { id: 'au5', when: '2026-10-05T11:47', who: 'Mr Peter Kato', action: 'Suspended portal access for 2 accounts after 14-day notice', area: 'Finance' },
  { id: 'au6', when: '2026-10-04T09:15', who: 'Ms Esther Namuli', action: 'Added user Mr Li Wei (Teacher)', area: 'Users' },
  { id: 'au7', when: '2026-10-03T14:30', who: 'System', action: 'Daily backup completed (2.1 GB)', area: 'System' },
]
export const DEMO_NOTE = 'Prototype with sample data. Nothing you do here is saved or sent.'
