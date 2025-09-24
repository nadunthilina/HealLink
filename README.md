# HealLink – Caretaker Management System (CMS)

This repository contains a two-tier scaffold for the CMS:

- `client/`: React + Tailwind (mobile-first) frontend
- `server/`: Node.js + Express backend

Note: This commit includes only directory structure and placeholder files (no code or config). Use this as a starting point to initialize your packages.

## Folder structure

- client/
  - public/
  - src/
    - assets/
    - components/
    - pages/
    - routes/
    - hooks/
    - context/
    - services/
    - utils/
    - styles/
    - store/
    - types/
    - layouts/
  - tests/
- server/
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

## Next steps (optional)
- Initialize git and your package managers in `client/` and `server/`.
- Add your chosen frameworks, linters, and CI.
- Create `.env.example` files documenting required environment variables.
