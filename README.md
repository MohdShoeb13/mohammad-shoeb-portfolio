# Mohammad Shoeb portfolio

A one-page portfolio for Mohammad Shoeb, Agentic AI engineer and senior Java full-stack
developer. Static single-page app, no backend. Deployed to Vercel.

The page opens on a cinematic video with a faint 3D network over it. Its centrepiece is
the Work section: a live 3D graph that takes the shape of each project's architecture
(a router, a pipeline, or a loop) as you scroll through the project cards.

The page uses two grounds. Night (dark) holds the live systems: hero, statement, work,
method. Paper (warm stone) holds the record: outcomes, roles, skills and certifications,
set as a ledger with hairline rules instead of cards. Night returns for contact.

Three type voices: Fraunces (serif) for statements and big figures, IBM Plex Sans for
structure, IBM Plex Mono for data such as dates and stacks.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS 4 (design tokens in `src/index.css`)
- framer-motion for scroll-linked and interaction motion
- three.js + React Three Fiber for the two 3D scenes, loaded lazily
- oxlint for linting

## Scripts

```bash
npm install
npm run dev       # local dev server
npm run lint      # oxlint
npm run build     # type-check, then production build into dist/
npm run preview   # serve the production build
```

## Structure

| Path | What it holds |
|---|---|
| `src/data/portfolio-data.ts` | All page content: contact details, hero line, opening statement, metrics, projects, migration stages, experience, skills, education, certifications |
| `src/App.tsx` | Section order, and the paper sheet that wraps Experience and Expertise |
| `src/components/site-nav.tsx` | Fixed nav, active-section highlight, scroll progress bar, skip link |
| `src/components/ui/prisma-hero.tsx` | Hero: video, 3D overlay, name |
| `src/components/projects-section.tsx` | Work section: pinned graph and project cards |
| `src/components/three/` | 3D scenes (`hero-network`, `agent-graph`), the shared `graph-layout`, and the SVG fallback |
| `src/components/intro-section.tsx` | Opening statement (brightens word by word on scroll), quick facts, technology ribbon |
| `src/components/metrics-section.tsx` | `OutcomesLedger`, the figures at the top of the Experience section |
| `src/components/*-section.tsx` | The other sections |
| `src/lib/motion.ts` | Shared easing and hooks: `useCanRender3D`, `useInViewport` |
| `public/assets/` | Hero video (desktop and mobile cuts), poster, resume PDF |

## Editing content

Change text in `src/data/portfolio-data.ts`, not in components. The contact terminal,
the nav and the footer all read from it.

To add a project, add an entry to `projectsData` with a `topology`:

- `router`: a hub that sends each request to one specialist
- `pipeline`: steps in a fixed order
- `loop`: steps in order with one bounded return edge, set in `flow.loop`

The graph supports up to seven nodes per project. Projects without a public repo or demo
leave out `githubUrl` and `liveUrl` and set `affiliation` and `privateNote` instead.

## Motion and accessibility

- With reduced motion turned on, no WebGL loads, the graph shows as a static SVG, the
  video stays paused, and nothing moves on scroll.
- Both 3D canvases stop rendering when they are offscreen or the tab is hidden.
- three.js loads in its own chunk and never blocks the first paint.

## Hero video

The video files are encoded with ffmpeg (H.264, no audio, `+faststart`):

```bash
ffmpeg -i source.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart public/assets/hero.mp4
ffmpeg -i source.mp4 -an -vf "scale=960:-2"  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart public/assets/hero-mobile.mp4
```

## Deploy

`.github/workflows/deploy.yml` lints and builds every push and pull request to `main`.
With the `VERCEL_TOKEN` secret set, a push to `main` deploys to production and a pull
request gets a preview deploy.
