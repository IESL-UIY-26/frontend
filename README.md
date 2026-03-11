# IESL UIY 2026 — Undergraduate Inventor of the Year

The official website for the **IESL Undergraduate Inventor of the Year (UIY) 2026** competition, organised by the Institution of Engineers Sri Lanka (IESL). This site serves as the main digital presence for the competition, providing information about the competition, eligibility criteria, the application process, awards, gallery, and an online application portal for Sri Lankan engineering undergraduates.

## Tech Stack

- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible component library (Radix UI primitives)
- **Framer Motion** — Animations
- **React Router v6** — Client-side routing
- **React Hook Form + Zod** — Form handling & validation
- **Husky + Commitlint** — Git commit message validation (Conventional Commits)

## Getting Started

### Prerequisites

Make sure you have one of the following installed:

- [Node.js](https://nodejs.org/) (v18+) with npm, **or**
- [Bun](https://bun.sh/) (recommended — the project uses `bun.lockb`)

### Installation & Running Locally

```sh
# 1. Clone the repository
git clone https://github.com/IESL-UIY-26/frontend.git

# 2. Navigate into the project directory
cd frontend

# 3. Install dependencies
npm install
# or with npm:
bun install

# 4. Start the development server
npm run dev
# or with npm:
bun run dev
```

The app will be available at `http://localhost:8080` by default.

### Other Useful Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `bun run build`   | Build for production                 |
| `bun run preview` | Preview the production build locally |
| `bun run lint`    | Run ESLint                           |

## Project Structure

```
src/
├── components/       # Page sections (Hero, About, FAQ, etc.) & shared UI
│   └── ui/           # shadcn/ui components
├── pages/            # Route-level page components
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
public/               # Static assets (images, documents, sitemap)
```

## Contributing

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) spec (enforced by Husky + Commitlint).

```
feat: add new section
fix: correct typo in FAQ
chore: update dependencies
```

### Branching & Pull Requests

This repository uses **branch protection rules** on `main`. Direct pushes are not allowed — all changes must go through a pull request.

**1. Create a branch** from `main` using a descriptive, prefixed name:

```sh
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

Common prefixes:

```
feat/     → new feature or content
fix/      → bug fix
chore/    → maintenance, config, tooling
docs/     → documentation only
refactor/ → code restructure, no behaviour change
```

**2. Make your changes**, then commit following the Conventional Commits format above.

**3. Push your branch** and open a Pull Request against `main`:

```sh
git push origin feat/your-feature-name
```

Then go to the repository on GitHub → **Pull requests** → **New pull request**, set the base branch to `main`, and submit your PR for review.
