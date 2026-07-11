# Eduversal MathQuest

**Play. Explore. Master Maths.**
_Managed by Eduversal Indonesia_

A secure, interactive Mathematics learning platform for **Cambridge Early Years** and
**Cambridge Primary** learners (approximately ages 3–12). MathQuest brings together three
curriculum-aligned content libraries — **Games**, **Simulations** and interactive **Books** —
inside one professional, role-based platform for admins, school managers, teachers, students
and parents.

> This is a fully working front-end prototype built with realistic mock data and
> `localStorage` persistence. It is architected so a real database (Supabase/PostgreSQL) and
> secure authentication can replace the demo layer with minimal changes.

---

## ✨ Features

- **Three content libraries** — 30+ mock resources across Early Years and Primary Stages 1–6:
  MathQuest Games, Simulations (interactive manipulatives) and digital Books.
- **Five user roles**, each with tailored navigation, dashboards and route protection:
  Admin, School Manager, Teacher, Student, Parent.
- **Curriculum alignment** — every resource is mapped to a programme, stage/age band, strand,
  sub-strand, original Eduversal learning-objective summary (teacher / student "I can" / parent
  versions), a configurable curriculum reference code and a _Thinking & Working Mathematically_
  characteristic.
- **Interactive activity player** — a working quiz game, a tappable ten-frame simulation and a
  paged book reader with checkpoint questions (no dead buttons).
- **Teacher workflow** — filterable library, one-click assignments, a multi-step assignment
  builder (with auto-generated student/parent objective versions), and a Quest Path builder.
- **Analytics** — responsive Recharts dashboards for every role (trends, coverage, mastery,
  completion, radar, donut, gauges).
- **Reusable design system** — buttons, inputs, selects, search, tabs, cards, badges, avatars,
  data tables, charts, modals, toasts, progress bars, empty/loading/error states, confirmation
  dialogs and dashboard stat cards.
- **Accessible & responsive** — semantic HTML, keyboard-friendly interaction, visible focus
  rings, `prefers-reduced-motion` support, and desktop/tablet/mobile layouts.

---

## 🧰 Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Charts | Recharts |
| State | Zustand (auth, UI, favourites, parent child selection) |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion (subtle, accessible) |

---

## 🚀 Getting started

**Prerequisites:** Node.js 18.18+ (Node 20/22/24 recommended) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open the app
#    http://localhost:3000
```

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler with no emit |

---

## 🔐 Demo accounts

Open **/login** and use the **Demo Accounts** panel (click a role to auto-fill), or sign in
manually. All demo passwords are `demo1234`.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@eduversal.org` | `demo1234` |
| School Manager | `manager@eduversal.org` | `demo1234` |
| Teacher | `teacher@eduversal.org` | `demo1234` |
| Student | `student@eduversal.org` | `demo1234` |
| Parent | `parent@eduversal.org` | `demo1234` |

After login you are redirected to the role's dashboard. In **demo mode** you can switch roles
from the profile menu in the top-right. Public sign-up is available for School Manager, Teacher,
Student and Parent — **Admin is not a public sign-up role**.

> Demo mode (the role switcher and the "demo" banner) can be turned off by setting
> `NEXT_PUBLIC_DEMO_MODE="false"`.

---

## 🗺️ Route map

**Public:** `/` · `/explore` · `/about` · `/features` · `/for-schools` · `/contact` · `/terms` · `/privacy`
**Auth:** `/login` · `/sign-up` · `/forgot-password` · `/reset-password` · `/access-denied` · `/session-expired`

| Role | Key routes |
| --- | --- |
| **Admin** | `/admin/dashboard`, `/users`, `/schools`, `/content`, `/games`, `/simulations`, `/books`, `/curriculum`, `/badges`, `/reports`, `/announcements`, `/settings`, `/profile` |
| **School Manager** | `/school-manager/dashboard`, `/teachers`, `/classes`, `/students`, `/parents`, `/curriculum-coverage`, `/reports`, `/teacher-activity`, `/announcements`, `/settings` |
| **Teacher** | `/teacher/dashboard`, `/classes`, `/students`, `/library`, `/games`, `/simulations`, `/books`, `/assignments`, `/assignments/create`, `/quest-paths`, `/progress`, `/reports`, `/resources`, `/messages`, `/settings` |
| **Student** | `/student/dashboard`, `/my-quest`, `/todays-quest`, `/games`, `/simulations`, `/books`, `/assignments`, `/achievements`, `/progress`, `/profile` |
| **Parent** | `/parent/dashboard`, `/children`, `/progress`, `/assignments`, `/achievements`, `/home-learning`, `/messages`, `/settings` |

Resource detail pages live at `/{admin|teacher|student}/library/[id]`.

---

## 📁 Project structure

```
src/
  app/
    (public)/        Landing, explore, marketing & legal pages
    (auth)/          Login, sign-up, password reset
    admin/           Admin dashboard & management pages
    school-manager/  School oversight pages
    teacher/         Planning, assignment & monitoring pages
    student/         Learner-facing pages
    parent/          Parent monitoring pages
    access-denied/   403 state
    session-expired/ Session timeout state
  components/
    ui/              Design-system primitives (Button, Card, Modal, …)
    layout/          Public header/footer, marketing hero, legal, status screens
    dashboards/      Role shell, guard, panels (settings/messages/reports/…), charts card
    content/         Resource cards, library browser, detail, activity player, assign modal
    charts/          Recharts wrappers
  config/            Brand + navigation + curriculum config
  data/              Mock data (users, resources, school, analytics, avatars)
  hooks/             (reserved for future hooks)
  lib/               Utilities & content helpers
  stores/            Zustand stores (auth, ui, parent)
  types/             Shared TypeScript types
```

---

## 🔄 Replacing mock data with a real backend

The prototype is intentionally decoupled from its data source:

- **Data** lives in `src/data/*` and is imported through small helper functions
  (`getResource`, `getStudent`, `findDemoAccount`, …). Swap these for API/Supabase calls.
- **Auth** is a Zustand store (`src/stores/auth.ts`) with a `login`/`logout` contract.
  Replace the demo lookup with a real session; keep the same interface and the UI is unchanged.
- **Route protection** is handled by `RoleGuard` (`src/components/dashboards/RoleGuard.tsx`).
  In production, move this to Next.js middleware backed by a verified session.
- **Curriculum config** (framework names, grade→stage mapping, reference codes) is in
  `src/config/brand.ts` and is Admin-editable in the UI — ready to be persisted.
- Copy `.env.example` to `.env.local` and fill in Supabase / database / email values.

---

## 📝 Content & curriculum note

All learning-objective summaries are **original Eduversal-written content** and do not reproduce
copyrighted Cambridge framework text. Curriculum reference codes (e.g. `EDV-P2-N.11`) are
placeholder, configurable fields intended to be aligned to your school's own scheme of work.

UI text and content use **British English** throughout (including "Maths").

---

## ♿ Accessibility

- Semantic landmarks, skip-to-content link and labelled controls.
- Visible keyboard focus rings and `aria-*` attributes on interactive components.
- Colour choices meet contrast expectations; charts include tooltips and legends.
- `prefers-reduced-motion` disables non-essential animation.

---

© 2026 Eduversal Indonesia. Built for Cambridge Early Years & Cambridge Primary Mathematics.
