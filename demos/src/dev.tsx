import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './look.css'
import { DEMOS } from './demos'

// Dev preview. ?capture=<name> shows one demo alone in #example at its slot
// width (or the viewport's, if narrower), for scripts/film.mjs. Without it,
// every demo is shown at its slot width.
const capture = new URLSearchParams(location.search).get('capture')
const names = capture ? [capture] : Object.keys(DEMOS)

function App() {
  return (
    <>
      {names.map((name) => {
        const demo = DEMOS[name]
        if (!demo) return <p key={name} role="alert">Unknown demo: {name}</p>
        const Demo = demo.component
        return (
          <section key={name}>
            {!capture && <h2>{name}</h2>}
            <div id={capture ? 'example' : undefined} className={`slot${demo.card ? ' card-ground' : ''}`} style={{ maxWidth: demo.width }}>
              <Demo />
            </div>
          </section>
        )
      })}
    </>
  )
}

document.fonts.ready.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
