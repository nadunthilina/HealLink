# HealLink – Caretaker Management System (CMS)

HealLink is a mobile‑responsive web application for Harshi Nursing Service (working with Badulla Hospital) to manage caretakers and patients end‑to‑end: digitize records, schedule assignments with conflict checks, streamline communications, accept caretaker requests from patients/families, and produce actionable reports.

This repository is organized as a two-tier project:
- `client/`: React + Vite frontend (mobile-first; Tailwind can be added next)
- `server/`: Node.js + Express backend (scaffold only for now)

Note: The frontend is already scaffolded with Vite and builds successfully. The backend contains structure only (no code yet).

## Objectives
- Streamline caretaker records and patient management.
- Improve scheduling and caretaker assignment to reduce conflicts.
- Enhance communication between admin, caretakers, and patients/families.
- Provide patients and families with an easy way to request caretakers.
- Generate reports and analytics for better decision-making.

## Stakeholders
- Admin (Harshi Staff) – manage caretakers, patients, schedules, and reports.
- Caretakers – update availability, view assignments, submit care notes.
- Patients/Families – request caretakers, view availability, provide feedback.

## Core modules
1. User Management – registration, login, role-based access control.
2. Caretaker & Patient Management – caretaker profiles, patient records.
3. Scheduling & Assignment – caretaker scheduling, conflict detection.
4. Notifications & Communication – email/SMS/in-app alerts.
5. Reports & Feedback – performance reports, feedback collection.

## Tech stack
- Frontend: React + Vite (Tailwind CSS planned)
- Backend: Node.js + Express (to be implemented)
- Database (planned): PostgreSQL/MySQL (or MongoDB alternative)
- Auth/Security: JWT, role-based access, HTTPS/SSL
- Hosting: AWS / Render / Vercel / Firebase (TBD)

## Project structure

- client/
  - index.html
  - vite.config.js
  - package.json
  - src/
    - main.jsx
    - App.jsx
    - styles/
      - index.css
    - assets/
    - components/
    - pages/
    - routes/
    - hooks/
    - context/
    - services/
    - utils/
    - store/
    - types/
    - layouts/
  - public/
  - tests/
- server/
  - package.json
  - src/
    - api/           (controllers)
    - routes/        (HTTP routes)
    - services/      (business logic)
    - models/        (DB models/ORM)
    - middleware/
    - utils/
    - config/
    - jobs/          (background tasks)
    - events/        (pub/sub hooks)
    - db/
      - migrations/
      - seeders/
  - tests/
  - scripts/

## Getting started

### Prerequisites
- Node.js 18+ (required by Vite v5)

### Install dependencies
Run these from the repository root in PowerShell:

```powershell
# Frontend
cd "d:\intern projects\HealLink\client"
npm install

# Backend (scaffolded only; installs lockfile for future deps)
cd "d:\intern projects\HealLink\server"
npm install
```

### Run the app (client only for now)

```powershell
cd "d:\intern projects\HealLink\client"
npm run dev
```

Open the printed local URL (typically http://localhost:5173) to see the React app.

### Build and preview (client)

```powershell
cd "d:\intern projects\HealLink\client"
npm run build
npm run preview
```

### Environment variables
- Frontend (Vite): variables must start with `VITE_` to be exposed to the client.
- Add a `.env` file in `client/` if needed (e.g., `VITE_API_BASE_URL=https://api.example.com`).
- We will add `.env.example` files in a future step.

## Development roadmap (high level)
- Backend: implement Express server, routing, and API contracts (auth, caretakers, patients, schedules, requests, notifications).
- Database & ORM: choose Postgres/MySQL + Prisma/Sequelize; add migrations and seeders.
- Auth: JWT with role-based access; secure cookie or header strategy.
- Frontend: Tailwind CSS, routing, layouts, basic pages and API client.
- CI/CD: linting, formatting, test workflows, and deployment targets.

## Risks and mitigations
- Scheduling complexity → constraint checks + unit/integration tests.
- Security → strict RBAC, encryption in transit, secrets management, audit logs.
- Adoption → simple UX, clear flows, responsive mobile design.
- Scale → DB indexing, background jobs, horizontal scalability.

## License
TBD

