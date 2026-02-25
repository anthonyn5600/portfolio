# Anthony Ngon — Portfolio

Personal portfolio site showcasing my projects, experience, and skills.

## Live Site

Hosted on GitHub Pages: [anthonyn5600.github.io/portfolio](https://anthonyn5600.github.io/portfolio/)

## Features

- Dark theme with gradient accents and scroll-reveal animations
- **Dynamic project dates** — fetches last-updated timestamps from the GitHub API so project cards always reflect the latest push
- **Auto-sorted projects** — cards reorder themselves by most recently updated, with a subtle glow highlight on active projects
- **Version toggle** — Virtual Piano card lets you switch between v2 and v1 to see both iterations
- Responsive layout (desktop 3-col grid, tablet/mobile single column)
- Mobile hamburger menu

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- Font Awesome 6 icons
- Inter + JetBrains Mono fonts
- GitHub REST API (unauthenticated, for repo metadata)

## Project Structure

```
index.html    — single-page markup
style.css     — all styles + responsive breakpoints
app.js        — scroll reveals, nav highlight, version toggle, GitHub API fetch
```

## Run Locally

Open `index.html` in a browser. No build step required.
