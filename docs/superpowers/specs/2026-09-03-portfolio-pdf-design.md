# Portfolio PDF Generator — Design

**Date:** 2026-09-03
**Status:** Approved design, pending implementation plan

## Purpose

Generate a print-ready portfolio PDF from the project data already in
`src/data/user.js`, for use as a supplement alongside Colin's resume in job and
graduate-school applications.

The audience is a reviewer skimming many applications. That drives every decision
below: the document is short, visual, selective, and legible in a single pass. It is
explicitly **not** an archive of the whole site.

## Constraints

- The site remains the single source of truth. The PDF is derived, never authored
  separately, so it cannot drift from the site's content.
- No new runtime dependencies. `google-chrome` and `ffmpeg` are already installed on
  the build machine; Puppeteer is deliberately avoided because it would download a
  second ~150MB Chromium for a task Chrome already does.
- Nothing about the generator may change how the site renders or what visitors
  download.

## Data contract

Two new optional fields on entries in the `INFO.projects` array. Both are additive;
projects without them are unaffected.

| Field | Type | Meaning |
|---|---|---|
| `pdf` | `true` | Include this project in the PDF. |
| `pdfFeatured` | `true` | Render it as a full page. Implies `pdf`. Without it, an included project goes in the back grid. |

Ordering follows the existing `projects` array order, so the PDF inherits the
ranking already expressed on the site. No separate ordering config exists to drift.

All other content is read from existing fields — `title`, `tagline`, `description`,
`photo`. No PDF-specific copy is authored, so there is no third copy of each
description to maintain.

### Initially featured (5)

1. Saranga — `[Science Robotics 2026]`
2. ActiveNav — `[Under Review — ICRA 2027]`
3. AttentionSeeker — `[Under Review — RA-L 2026]`
4. Learning to Chase
5. Einstein Vision

All five have `tagline`, `photo`, and `description` present. The MQP (Agile
Event-based Flight) is **excluded entirely for now** at the user's request — it gets
neither `pdf` nor `pdfFeatured`. Re-including it later is a one-field change.

The back grid is populated by whichever remaining projects get `pdf: true`; that set
is the user's call and can start empty.

## Architecture

A single Node script, `scripts/build-portfolio-pdf.mjs`, invoked via `npm run pdf`.
Four stages. The first three are pure or filesystem-only and are unit-testable
without launching a browser; only the fourth shells out to Chrome.

```
INFO.projects
   │
   ▼
[1] select ── partition into { featured[], grid[] }, validate
   │
   ▼
[2] posters ── any .mp4/.webm photo → still frame via ffmpeg → .pdf-cache/
   │
   ▼
[3] render ── build one standalone HTML string with print CSS
   │
   ▼
[4] print ── google-chrome --headless --print-to-pdf
   │
   ▼
public/ColinBalfourPortfolio.pdf
```

### [1] select

Imports `INFO` and partitions projects into `featured` and `grid`. Pure function over
the projects array — no I/O — so it tests directly.

Aborts with a non-zero exit if nothing is flagged, rather than emitting an empty
document.

### [2] posters

A PDF cannot embed video, and six projects site-wide use an `.mp4` as their `photo` —
two of them (AttentionSeeker, Learning to Chase) are in the initial featured set, so
this stage runs on real data from the first build. For each such project, `ffmpeg`
extracts a single frame to `.pdf-cache/<basename>.jpg`.

- Default seek point: **40% into the clip's duration**, which avoids fade-ins at the
  start and end cards at the end.
- Optional per-project override `pdfPosterAt: "0:02"` for clips where the default
  frame lands badly.
- Cached by source file mtime, so repeat runs skip extraction.

`.pdf-cache/` is gitignored — it is derived from committed media and reproducible.

### [3] render

Builds a standalone HTML document (inline `<style>`, no bundler involvement). The
print layout is authored for paper and is intentionally unrelated to the site's
screen CSS, which is dark, scroll-driven, and video-first — none of which serves a
printed page.

**Page 1 masthead** (the approved "option B"): a dark band above the first featured
project carrying name, tagline, contact links, and a one-line affiliations summary
(WPI · NVIDIA · PeAR) drawn from `INFO.education` and `INFO.work`. No dedicated cover
page — the PDF travels next to a resume that already states contact details and
education, so a full cover would mostly repeat what the reader just read. This keeps
page one carrying both identity and the strongest project.

**Featured project page:** title, tagline, hero image at roughly half the page,
description. One project per page.

**Back grid:** remaining included projects in a 2-column x 3-row grid, so **6 per
page**, each cell carrying a thumbnail, title, and tagline.

**Every page footer:** name, email, and page number, so a page forwarded on its own
is still attributable.

Page geometry: **US Letter**, 0.6in margins, `print-color-adjust: exact` so the dark
masthead survives printing. Letter is correct for US applications; A4 was considered
and deferred — it is a one-constant change if programs abroad need it.

All interpolated content is HTML-escaped. This matters concretely: several project
titles contain `[`, `]`, `—`, and `&`.

### [4] print

```
google-chrome --headless --disable-gpu --no-pdf-header-footer \
              --print-to-pdf=<out> <file://...>
```

The exact flag set is verified against the installed Chrome during implementation;
`--headless=new` is used if the installed build requires it.

Writes to `public/ColinBalfourPortfolio.pdf`, beside the existing
`BalfourResume.pdf`, so it ships with the site and can be linked from the nav the
same way the resume is. It is a committed build artifact, consistent with how the
resume PDF is already handled.

## Error handling

Every failure is loud. The dominant risk with a generated document is that it
succeeds while producing something subtly wrong, and a bad portfolio PDF reaches an
admissions committee before anyone notices.

| Condition | Behavior |
|---|---|
| `ffmpeg` or `google-chrome` not on PATH | Abort with the missing binary and an install hint. |
| No projects flagged `pdf`/`pdfFeatured` | Abort; do not emit an empty PDF. |
| A `photo` path does not exist on disk | Warn naming the project, render that card text-only, continue. |
| `ffmpeg` fails on one clip | Warn naming the project, fall back to text-only for that card, continue. |
| Chrome exits non-zero, or output is missing/under 1KB | Abort, reporting Chrome's stderr. Note Chrome writes harmless snap/libproxy warnings to stderr **on success**, so success is judged by exit code plus output size, never by stderr being empty. |

## Testing

Vitest, matching the repo's existing pattern (`src/utils/**/*.test.js`). Tests are
written before implementation, per the project's TDD workflow.

**Unit — pure logic, no browser:**
- `select` partitions correctly: `pdfFeatured` implies featured; `pdf` alone lands in
  the grid; unflagged projects are excluded; array order is preserved.
- `select` throws when nothing is flagged.
- Poster path mapping: `.mp4`/`.webm` map into `.pdf-cache/`; `.jpg`/`.png` pass
  through untouched.
- HTML escaping handles the real titles containing `[`, `—`, and `&`.
- Missing-photo entries produce a text-only card rather than a broken image.

**Integration — the real pipeline, marked slow:**
- Running the generator produces a PDF whose page count equals
  `featured.length + ceil(grid.length / 6)`. Page count is read as the maximum
  `/Count <n>` value in the PDF bytes. (Counting `/Type /Page` does **not** work:
  Chrome compresses page objects into object streams, verified returning 0 on a
  known 3-page document.)
- The PDF is non-trivially sized (>10KB), guarding against Chrome emitting a blank
  document.

The suite currently takes ~51s, dominated by the RL training tests; the integration
test adds a few seconds and does not meaningfully change that.

## Out of scope

- Rendering the long-form `page.description` write-ups. Featured pages use the short
  `description`; the deep content stays on the site, where the videos work.
- Auto-summarizing or extracting highlights from the markdown bodies. Heuristic
  extraction risks separating a claim from its caveat — a real hazard given that the
  Learning to Chase write-up is deliberately full of retractions and negative results.
- A4 output, publications, and education/work detail pages.

## Open questions

None blocking. Two defaults are chosen and easily revisited: Letter page size, and
the 40% poster seek point.
