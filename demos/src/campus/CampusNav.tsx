import { Layers, LocateFixed, MapPin, Search, X } from 'lucide-react'
import { Field, Menu, Popover, Stage, Window, type Act } from '../ui'
import './campus.css'

// Featured-project card: CSUF Campus Navigator, Anthony's Next.js rebuild.
// Told as how it feels to use: search a building, pick it, and the route
// draws from where you are, computed in the browser (haversine, no API key).
// Framed as the pinned bottom bleed layout for a feature card: the window is
// inset at the top and sides and runs off the bottom of the card's media.
//
// Beats: the cursor clicks the search field and types "Pollak"; suggestions
// open; it picks Pollak Library North; the building lights, a pin drops on
// it, the walking route draws from the You dot along the paths, and a small
// popup by the pin gives the walk. A 2.4s hold, then the cursor clears the
// search with its ×: the popup, route and pin leave in reverse, and the map
// is back where it began.
//
// Real strings: the placeholder, what's typed, the two suggestions, and the
// walk time and distance. The map itself is drawn, not a tile layer: quiet
// building footprints on a dark ground, the target the only lit one.

type S = { focused: boolean; query: string; menu: boolean; picked: boolean; route: boolean; popup: boolean }

const initial: S = { focused: false, query: '', menu: false, picked: false, route: false, popup: false }
const poster: S = { focused: false, query: 'Pollak Library North', menu: false, picked: true, route: true, popup: true }

async function script(a: Act<S>) {
  await a.wait(700)
  await a.click('search')
  a.put({ focused: true })
  await a.wait(250)
  await a.type('query', 'Pollak', { interval: 70 })
  a.put({ menu: true })
  await a.wait(550)
  a.mark('pick')
  await a.click('pln')
  a.put({ menu: false, query: 'Pollak Library North', focused: false, picked: true })
  // The cursor steps off the field onto empty map while the route draws
  void a.move('rest')
  await a.wait(350)
  a.mark('route')
  a.put({ route: true })
  await a.wait(950)
  a.put({ popup: true })
  await a.wait(2400)
  // The visible cause of the reset: the search is cleared with its ×
  await a.click('clear')
  a.put({ popup: false })
  await a.wait(80)
  a.put({ route: false })
  await a.wait(80)
  a.put({ picked: false, query: '' })
  void a.move('rest')
  await a.wait(900)
}

// Building footprints in map pixels: [x, y, width, height], in the blocks
// between the walkways; the last row runs off the window's foot.
const BUILDINGS: [number, number, number, number][] = [
  [20, 60, 58, 34], [108, 64, 34, 32], [246, 58, 40, 40], [296, 64, 32, 30], [350, 60, 24, 36],
  [16, 112, 44, 46], [66, 118, 22, 30], [106, 112, 60, 26], [172, 116, 48, 40], [246, 112, 80, 26], [350, 112, 24, 48],
  [20, 176, 64, 36], [108, 178, 40, 44], [160, 176, 60, 30], [246, 180, 36, 34], [350, 176, 24, 40],
]
const PLN = { x: 150, y: 60, w: 70, h: 38 }
const YOU = { x: 300, y: 168 }
// Where the search field's text starts, in map pixels (the field's 12px
// inset, its padding and the search icon). On a phone the walk popup hangs
// its words on this same line.
const SEARCH_TEXT_X = 45
const WALK_PAD = 12
// The walk: from the You dot along the walkways to the library's south side
const ROUTE = `${YOU.x},${YOU.y} 232,168 232,104 185,104 185,${PLN.y + PLN.h}`

export default function CampusNav() {
  return (
    <Stage<S>
      width={448}
      height={272}
      compact={{ below: 420, width: 342, height: 260 }}
      fill
      theme="dark"
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: 'rest' }}
      className="pf cn"
    >
      {(s, _rect, layout) => (
        <Window
          title="Campus Navigator"
          className="cn-win"
          toolbar={
            <span className="cn-tools">
              <LocateFixed size={14} strokeWidth={2} />
              <Layers size={14} strokeWidth={2} />
            </span>
          }
        >
          <div className="cn-map">
            <svg className="cn-paths" width="376" height="282" viewBox="0 0 376 282" aria-hidden>
              <path className="cn-walks" d="M0 104H376M0 168H376M96 50V282M232 50V282M340 50V282" />
              <polyline className="cn-route" data-on={s.route || undefined} points={ROUTE} pathLength={1} />
            </svg>
            {BUILDINGS.map(([x, y, w, h], i) => (
              <span key={i} className="cn-bldg" style={{ left: x, top: y, width: w, height: h }} />
            ))}
            <span className="cn-bldg cn-bldg--target" data-on={s.picked || undefined} style={{ left: PLN.x, top: PLN.y, width: PLN.w, height: PLN.h }} />
            <span className="cn-you" style={{ left: YOU.x, top: YOU.y }} />
            <span className="cn-pin" data-on={s.picked || undefined} style={{ left: PLN.x + PLN.w / 2, top: PLN.y + PLN.h / 2 }}>
              <MapPin size={22} strokeWidth={1.75} />
            </span>
            {/* Beside the building, never over the route it explains. On the
                card: to its right, level with it, clear of the route's turn at
                (232, 104). On a phone, where the window runs off the right
                edge: to its left, its words on the search text's column rather
                than a few px off the title's. */}
            <Popover
              show={s.popup}
              origin={layout === 'compact' ? 'right center' : 'left center'}
              className="cn-walk"
              style={layout === 'compact' ? { left: SEARCH_TEXT_X - WALK_PAD, top: PLN.y + 12 } : { left: 240, top: PLN.y - 8 }}
            >
              <span className="cn-walk__time">4 min walk</span>
              <span className="cn-walk__dist">0.2 mi</span>
            </Popover>
            {/* Empty map the cursor rests on between beats */}
            <span className="cn-rest" data-target="rest" />

            <Field
              className="cn-search"
              value={s.query}
              placeholder="Search 63 buildings"
              focused={s.focused}
              leading={<Search size={14} strokeWidth={2} className="cn-search__icon" />}
              trailing={
                <span className="cn-clear" role="button" aria-label="Clear search" data-on={s.query.length > 6 || undefined} data-target="clear" data-cursor="pointer">
                  <X size={12} strokeWidth={2.25} />
                </span>
              }
              box={{ 'data-target': 'search' }}
            />
            <Popover show={s.menu} className="cn-menu">
              <Menu
                items={[
                  <span className="cn-opt" key="n"><span>Pollak Library North</span><span className="cn-opt__code">PLN</span></span>,
                  <span className="cn-opt" key="s"><span>Pollak Library South</span><span className="cn-opt__code">PLS</span></span>,
                ]}
                targets={['pln', 'pls']}
              />
            </Popover>
          </div>
        </Window>
      )}
    </Stage>
  )
}
