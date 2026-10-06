# Roberts College — UI prototype

Clickable front end for the Roberts College online school: public website, online applications, and portals for
students, parents, teachers, heads of department, the registrar, the bursar and the administrator.
Everything runs on **sample data** in the browser. Nothing is saved or sent yet; that is the backend's job.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run build:demo   # one self-contained HTML file in dist-demo/ (used for the client test link)
```

Requires Node 20 or newer.

## Deploy to Netlify

The project is ready for Netlify; `netlify.toml` holds the settings.

1. Push this folder to a GitHub repository.
2. In Netlify choose **Add new site → Import an existing project** and pick the repository.
3. Netlify reads `netlify.toml` automatically: build command `npm run build`, publish folder `dist`, Node 22.
4. Deploy. Every page has a clean address (for example `/student/grades`), and the redirect rule in
   `netlify.toml` / `public/_redirects` makes refreshing or sharing any address work.

Without GitHub: run `npm run build` and drag the `dist` folder onto https://app.netlify.com/drop.

`netlify.toml` also sets long-term caching for the hashed files in `/assets` and basic security headers.

## How the client should test it

1. Open the test link and look around the public website: Home, Academics, Admissions and fees, How online school works, About, Contact.
2. Click **Apply now** and go through the 5-step application (it is pre-filled with a sample learner). Pay the application fee with "MTN Mobile Money" to see the confirmation.
3. Open **Track an application** and try `APP-2026-0415` (documents requested) or `APP-2026-0409` (accepted).
4. Go to **Sign in** and use **Try the prototype as** to open each portal. No password is needed.
   - **Student (Amani, Year 10):** Today → *Join lesson* opens the live classroom inside the site. Try the whiteboard, chat, raise hand. Then homework → hand in a file; take the *Moles and molar mass quiz*; Grades → Report cards.
   - **Parent (Mrs Nakato, two children):** overview of both children, report cards, Fees → *Pay USD 300* by Mobile Money.
   - **Teacher (Mr Okello):** *Start lesson* (teacher view with attendance and recording), mark homework, gradebook, set a quiz, lesson plans, report comments, My pay.
   - **Head of Department:** the teacher portal plus *Approvals*.
   - **Registrar:** applications → open one → verify documents, request documents, book an interview, offer a place.
   - **Bursar:** confirm bank transfers, *Access and reminders* (final notice → pause → restore), fee structure, payroll → approve → publish payslips.
   - **Administrator:** school overview, users and permissions, calendar, subjects and classes, timetable builder, settings, activity log.
5. Use the account menu (top right) to switch between people at any time, and the screen icon to try light and dark mode.

The prototype runs on a fixed clock: **Tuesday 6 October 2026, 09:20 Kampala time**, so a lesson is always live.

## Decisions already reflected (from the client's answers)

| Topic | Decision |
| --- | --- |
| Year groups | Year 4 to Year 13 to start |
| Live lessons | Inside the website, no new tab (built as our own classroom page) |
| Fees | Primary USD 400, Secondary USD 600 per term; two equal instalments |
| Payment methods | MTN Mobile Money, Airtel Money, Visa/Mastercard, bank transfer. **No PayPal** |
| Unpaid fees | Reminder → written final notice → access paused → restored on payment |
| Student ranking | Not shown |
| Payroll | Run by the bursar; payslips appear in each teacher's account |
| Library | Cambridge materials under the school's licence, for enrolled learners only |
| Mobile | Responsive website now; mobile app later |

Still to confirm with the client: the application fee amount (shown as USD 50), real contact and bank details, salary
and tax figures, and the school's own photos to replace the openly licensed ones.

## Project structure

```
src/
  data/school.ts        All sample data. Each export maps to a future API endpoint.
  lib/                  Date/money formatting, session (role + theme), navigation per role
  components/ui.tsx     Design system: buttons, forms, tables, tabs, modals, toasts, file upload
  components/Charts.tsx Small SVG charts (bar, line, sparkline, ring)
  components/Payment.tsx Payment step (Mobile Money, card hand-off, bank transfer)
  layouts/              Public website layout and the portal layout (sidebar, top bar, phone bottom bar)
  pages/public/         Website, application form, tracking, sign-in
  pages/student/        Student portal
  pages/teacher/        Teacher and head-of-department portal
  pages/parent/         Parent portal
  pages/staff/          Registrar, bursar, administrator
  pages/shared/         Timetable, live classroom, messages, announcements, profile, report card
```

Design tokens (colours, fonts) live in `src/index.css` and `tailwind.config.js`. Fonts are bundled locally.

### Photos and artwork

- Photos live in `src/assets/photos/` and are listed, with their credits, in `src/lib/photos.ts`. All come from
  Wikimedia Commons under CC0, CC BY or CC BY-SA licences; the **Photo credits** page (`/credits`, linked in the
  footer) gives the required attribution. Replace them with the school's own photos before launch by dropping new
  files in with the same names (or editing `photos.ts`).
- Subject covers (`src/components/SubjectArt.tsx`) and the school mark are original artwork drawn in SVG.

## Notes for the backend phase

- Routing uses clean URLs (`BrowserRouter`). Only the single-file demo build (`npm run build:demo`) uses `#` URLs,
  because it runs inside a viewer frame.
- Portal pages are code-split: the public website loads first and each portal downloads when it is opened.
- Replace imports from `data/school.ts` with API calls, keeping the same shapes.
- Live classroom: the UI is ready for an embeddable video engine (e.g. BigBlueButton, Jitsi, or a Zoom/Agora SDK).
  The video tiles, whiteboard canvas and chat panel are where that engine plugs in.
- Payments: use a gateway such as Flutterwave or Pesapal. Card numbers must only be entered on the gateway's hosted page.
- Every change to marks, payments, access and users should write to the activity log.
