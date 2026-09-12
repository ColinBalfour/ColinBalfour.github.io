# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` (or `npm start`) — Vite dev server at http://localhost:3000
- `npm run build` — production build into `build/` (Vite)
- `npm run preview` — serve the production build locally to sanity-check it
- `npm test` — Vitest in watch mode
- `npx vitest run` — run the suite once (CI-style, non-interactive)
- `npx vitest run src/App.test.jsx` — run a single test file
- `npm run deploy` — build and publish `build/` to GitHub Pages via `gh-pages` (this is what makes the live site at https://colinbalfour.github.io update; `predeploy` runs the build automatically)
- `npm run pdf` — regenerate `public/ColinBalfourPortfolio.pdf` from `src/data/user.js` (optional `--out <path>` to write elsewhere instead)

No linter is configured. Formatting uses the Prettier config in `package.json` (tabs, width 4).

## Architecture

This is a **React + Vite** single-page portfolio, originally scaffolded from the "Reactfolio" (Create React App) template and customized for Colin Balfour, then migrated to Vite. The `README.md` is the upstream template's generic README and does not describe this site's actual content.

**Build tooling** (`vite.config.js`): `@vitejs/plugin-react`, `base: "/"` (user/org site served from the domain root), and `outDir: "build"` so the `gh-pages` deploy is unchanged. The entry HTML is the **root `index.html`** (not `public/index.html`), which loads `/src/index.jsx`. Files that contain JSX must use the `.jsx` extension (esbuild won't parse JSX in `.js`). `package.json` sets `"type": "module"`, so all `.js` files are ESM. Tests run on **Vitest** (jsdom, config lives in the `test` block of `vite.config.js`; setup in `src/setupTests.js`).

**Content is data-driven, not hardcoded in components.** Almost all editable content lives in `src/data/`, and pages/components read from it. When asked to update portfolio content, edit the data files, not the JSX:

- `src/data/user.js` — the single source of truth for site content. Exports one `INFO` object with `main`, `socials`, `homepage`, `about`, `robotics`, `work`, `education`, and a `projects` array. This is the file to edit for almost any content change.
- `src/data/seo.js` — exports a `SEO` array of `{ page, description, keywords }` objects, one per page name (`home`, `about`, `robotics`, `projects`, `contact`), consumed via `Helmet` in the page components. Keep descriptions distinct and under ~160 chars.
- `src/data/tracking.js` — Google Analytics `TRACKING_ID` (empty disables GA; wired up in `src/App.js`).

The base link-preview / crawler metadata (title, description, Open Graph, Twitter card) lives in the root `index.html` — this is a client-rendered SPA, so that static HTML is what crawlers that don't run JS see. Update it if the tagline or default description changes.

**Routing** (`src/App.jsx`, react-router-dom v6, wrapped in a `BrowserRouter` in `src/index.jsx`): static routes for `/`, `/about`, `/robotics`, `/projects`, `/publications`, `/learning`, `/contact`, plus dynamic `/projects/:slug`. `/playground` redirects (`<Navigate replace />`) to `/#event-camera`, since the event camera demo it used to host now lives on the homepage. Everything else falls through to the 404 page. (The upstream template's Articles feature was removed — it only ever held placeholder content.)

Because GitHub Pages has no server-side SPA fallback, deep links (e.g. `/publications`) are handled by the rafgraph redirect shim: `public/404.html` encodes the path into a query string and bounces to `/`, and an inline script at the top of the root `index.html` `<head>` restores it before the app boots. Keep both in sync if the scheme changes.

### Internal project detail pages (slug convention)

A project entry with an inline `page` field renders as an **internal** detail page; a project with an external `link` (e.g. a GitHub URL) opens in a new tab instead. `readProject.jsx` renders the project's `page` content with `react-markdown`.

Internal projects use the sentinel `link: "/projects/"` plus a `slug` field:

- `src/components/projects/project.jsx` turns the sentinel into `/projects/<slug>` (falling back to the 1-based index if no `slug` is set).
- `src/pages/readProject.jsx` resolves the project by `slug`, falling back to `INFO.projects[Number(slug) - 1]` for legacy numeric URLs, and renders the 404 page if nothing matches.

**When adding a new internal project page, always give it a unique `slug`.** Historically these pages were addressed purely by array position, so reordering `projects` broke every internal URL; the `slug` field decouples the URL from array order. Do not reintroduce index-based internal links.

### Interactive demos (`src/components/playground/`)

Self-contained interactive demos, each with its own pure "engine" module under
`src/utils/` and a thin canvas component under `src/components/playground/`:

- **Event camera** — `src/utils/eventSensor.js` (per-pixel DVS model) + `eventCamera.jsx`.
  Embedded directly on the homepage (`src/pages/homepage.jsx`, `id="event-camera"`),
  not on its own route. It defaults to sample footage, starts only once the section
  scrolls into view (`IntersectionObserver`) and pauses when it scrolls back out, and
  never requests the webcam without an explicit "Use my own camera" click.
- **RL lab** — `rlLab.jsx` + `sparkline.jsx`, backed by `src/utils/rl/`: a
  planar-quadrotor env, a hand-written MLP with manual backprop and Adam, and the PPO
  maths (GAE, clipped surrogate, diagnostics). `trainWorker.js` runs training in a
  **Web Worker** — an iteration takes ~200ms and would freeze the page inline; the
  component animates the robot against the last policy snapshot the worker posted.
  The code is intentionally kept in the repo but currently unrouted (no page imports
  `rlLab.jsx`); it previously lived on the removed `/playground` page.

The engines are deliberately separate from the components so they can be unit-tested:
`nn.test.js` includes a **finite-difference gradient check**, and `trainer.test.js`
asserts the agent actually converges (and that the critic stays calibrated — value
targets reach ~250, so the critic is trained on normalized returns; without that it
underfits ~7x and explained variance collapses to zero). Those training tests take
~40s, which dominates the suite runtime.

### Portfolio PDF (`npm run pdf`)

`scripts/build-portfolio-pdf.mjs` renders `src/data/user.js` into a standalone
HTML document (`scripts/pdf/render.mjs`) and prints it to
`public/ColinBalfourPortfolio.pdf` via headless `google-chrome`. This file is
committed and deployed like any other asset in `public/` — it is what the
résumé/portfolio PDF link on the live site serves.

Per-project data fields (`src/data/user.js`) control what lands in the PDF:

- `pdf: true` — include the project in the back grid (six per page).
- `pdfFeatured: true` — give the project its own full page instead.
- `pdfPosterAt: "m:ss"` (or `"h:mm:ss"`) — override which frame is extracted
  as the thumbnail for a video `photo`; without it, the frame is taken 40%
  into the clip. Frames are cached in `.pdf-cache/` (gitignored, derived —
  never commit it), keyed by both the source video and the seek point, so
  changing `pdfPosterAt` always produces a fresh frame.

**After editing any project flagged `pdf`/`pdfFeatured` (or its photo,
tagline, or description), re-run `npm run pdf` and commit the regenerated
PDF** — nothing regenerates it automatically.

Requires `google-chrome`, `ffmpeg`, and `ffprobe` (ships with `ffmpeg`) on
`PATH`. See `docs/superpowers/specs/2026-09-03-portfolio-pdf-design.md` and
`docs/superpowers/plans/2026-09-03-portfolio-pdf.md` for the design rationale
and error-handling contract.

### Component layout

`src/components/` is grouped by feature area (`about/`, `projects/`, `homepage/`, `common/`). `src/pages/` holds one component per route. Styling is plain CSS colocated per component/page in `styles/` subfolders. Static assets (images, gifs, videos, resume PDF) live in `public/` and are referenced by absolute path (e.g. `/logo.png`).

The `robotics`, `learning`, and `contact` pages are built and routed but currently unlinked from the nav (their `<li>`s are commented out in `src/components/common/navBar.jsx`); they hold real content and are reachable by direct URL.

## Deployment notes

- Live site is served from GitHub Pages via the `gh-pages` branch, published by `npm run deploy`. Vite's `base: "/"` and `outDir: "build"` keep asset paths and the deploy command unchanged.
- Everything in `public/` (images, PDFs, `robots.txt`, `sitemap.xml`, favicons, the Google verification file) is copied verbatim to the `build/` root by Vite.
- **Package manager: npm** (`package-lock.json`). Don't reintroduce `yarn.lock`.
- Routing uses `BrowserRouter` (clean `/publications`-style URLs, fully crawlable) backed by the `public/404.html` + `index.html` redirect shim described above.
