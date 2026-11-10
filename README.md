# Anthony Ngon — Portfolio

Personal portfolio site showcasing my projects, experience, and skills.

## Live Site

Hosted on GitHub Pages: [anthonyn5600.github.io/portfolio](https://anthonyn5600.github.io/portfolio/)

## Features

- Dark theme with gradient accents and scroll-reveal animations
- **Animated illustrations**: the hero shows a data pipeline run going from Running to Succeeded, and the Campus Navigator card shows a building search drawing a walking route. They are built with the [Stageshow](https://github.com/benjitaylor/skills/tree/main/stageshow) React kit, pause offscreen, and show a still frame when the visitor prefers reduced motion
- **Featured projects**: Streets Alive (real screenshot) and CSUF Campus Navigator lead the Projects section, with the rest in a grid below
- **Dynamic project dates** — fetches last-updated timestamps from the GitHub API so project cards always reflect the latest push
- **Auto-sorted projects** — cards reorder themselves by most recently updated, with a subtle glow highlight on active projects
- **Version toggle** — Campus Navigator and Virtual Piano cards let you switch between v2 and v1 to see both iterations
- **Count-up metrics** in the Experience section (skipped under reduced motion)
- Responsive layout (desktop 3-col grid, tablet/mobile single column)
- Mobile hamburger menu

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- React 18 + Vite for the illustrations only (prebuilt into `assets/demos/`)
- Font Awesome 6 icons
- Syne, Plus Jakarta Sans + JetBrains Mono fonts
- GitHub REST API (unauthenticated, for repo metadata)

## Project Structure

```
index.html          — single-page markup
style.css           — all styles + responsive breakpoints
app.js              — scroll reveals, nav highlight, version toggle, metric count-up, GitHub API fetch
assets/demos/       — built illustration bundle (demos.js, demos.css); generated, don't edit
assets/projects/    — project screenshots
demos/              — source for the illustrations (React + the Stageshow kit)
  src/pipeline/     — hero: pipeline run
  src/campus/       — Campus Navigator card
  src/kit/          — Stageshow kit (MIT, see src/kit/LICENSE-stageshow)
  REHEARSAL.md      — how the illustrations were checked
```

## Run Locally

Open `index.html` in a browser. No build step is needed to view the site; the illustrations are already built.

## Editing the illustrations

Requires Node 20.19 or later.

```sh
cd demos
npm install
npm run dev      # preview at http://127.0.0.1:5174 (?capture=pipeline or ?capture=campus shows one)
npm run build    # typecheck, then rebuild ../assets/demos — commit the result
```

GitHub Pages serves the committed files, so rebuild and commit `assets/demos/` after any change in `demos/`.
