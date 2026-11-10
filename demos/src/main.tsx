import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './look.css'
import { DEMOS } from './demos'

// Site entry. Mounts each demo into its slot: <div data-demo="pipeline">.
// The page reserves each slot's space in CSS, so mounting never shifts the
// layout. Mounting waits for the site's web fonts (with a short cap), so the
// kit measures text in the font it will be drawn in. Stages pause and reset
// themselves while offscreen and show their poster frame under reduced
// motion.
function mountAll() {
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach((slot) => {
    const demo = DEMOS[slot.dataset.demo ?? '']
    if (!demo || slot.dataset.mounted) return
    slot.dataset.mounted = 'true'
    const Demo = demo.component
    createRoot(slot).render(
      <StrictMode>
        <Demo />
      </StrictMode>,
    )
    slot.classList.add('is-live')
  })
}

const fontsReady = document.fonts?.ready ?? Promise.resolve()
Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(mountAll)
