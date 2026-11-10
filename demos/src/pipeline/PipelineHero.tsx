import { Clock, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge, Bar, Collapse, Roll, Spinner, Stage, Window, type Act } from '../ui'
import './pipeline.css'

// Hero: a data pipeline run, the work Anthony did at Optum, told as what the
// system does. Copied from the kit's dark-hero gold (a deploy going live) and
// re-cast as a pipeline orchestrator; framed as the fade-crop layout because
// the stage sits on the page's own dark ground, where a hard stage edge would
// cut the window at an arbitrary line.
//
// Beats: an S3 event lands a new claims_daily_etl run at the top of the runs
// list, pushing the list down; Running with a spinner; the row count and the
// run time climb together; the status rolls to Succeeded on its own pill and
// the time settles at 14m 08s. A 2.6s hold, then the new row closes the way
// it opened and its numbers reset while it is closed.
//
// One lit color: the success green, once, on the new row. The older run's
// Succeeded is dimmed so the new one leads.
//
// Real strings: the title, the two pipelines, the trigger, the row counts,
// the statuses and the times. Everything here is invented and generic: no
// employer branding, no real product's UI, no record that looks like a
// person's data.

// live: the new run's row exists. It is mounted just before it opens and
// unmounted once it has closed, so every loop's run is a fresh row starting
// at zero; nothing on it ever rewinds, even out of sight.
type S = { live: boolean; open: boolean; done: boolean; rows: number; secs: number }

const initial: S = { live: false, open: false, done: false, rows: 0, secs: 0 }
const poster: S = { live: true, open: true, done: true, rows: 52318, secs: 848 }

const TICKS: [number, number][] = [
  [11204, 187],
  [24960, 391],
  [38517, 604],
  [52318, 802],
]

async function script(a: Act<S>) {
  await a.wait(700)
  // The row is in place, still closed, before it opens: it arrives full
  a.put({ live: true })
  await a.wait(100)
  a.mark('run')
  a.put({ open: true })
  await a.wait(500)
  for (const [rows, secs] of TICKS) {
    await a.wait(720)
    a.put({ rows, secs })
  }
  await a.wait(220)
  // A mark just ahead of the status change, so film --at can watch it land
  a.mark('pre-done')
  await a.wait(300)
  a.mark('done')
  a.put({ done: true, secs: 848 })
  await a.wait(2600)
  // The list loses what the loop added in one motion. Once closed, the row
  // is removed rather than rewound, and the next loop's run is a new one
  a.put({ open: false })
  await a.wait(700)
  await a.snap({ live: false, done: false, rows: 0, secs: 0 })
}

// The climbing figures roll with Roll, not Count. Count keeps a strip of
// digits per column and re-centres it after every roll, a jump the film
// rightly reports; it also pops new columns in whole. Roll animates only the
// characters that changed ("0" to "11,204" in "0 rows"), slides them in from
// below, and eases its own box to the new width. The column reserves the
// longest value's width (pipeline.css), so that ease happens inside fixed
// room and no edge in the row moves.
const duration = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
const rowCount = (n: number) => `${Math.round(n).toLocaleString('en-US')} rows`

export default function PipelineHero() {
  return (
    <Stage<S>
      width={620}
      height={400}
      compact={{ below: 560, width: 358, height: 280 }}
      theme="dark"
      initial={initial}
      poster={poster}
      script={script}
      className="pf ph"
    >
      {(s, _rect, layout) => (
        <div className="ph-mask">
          <Window url="orchestrator.internal/runs" className="ph-win" sidebarWidth={112} sidebar={layout === 'compact' ? undefined : <Side />}>
            <div className="ph-body">
              <header className="ph-head">
                <div className="ph-title">Pipeline runs</div>
                <span className="ph-env">prod</span>
              </header>
              <div className="ph-list">
                <Collapse open={s.open} reveal="drop">
                  {s.live && <Run
                    lead
                    name="claims_daily_etl"
                    trigger={<><Zap size={12} strokeWidth={2} />s3 event</>}
                    rows={<Roll align="end">{rowCount(s.rows)}</Roll>}
                    status={
                      <Badge tone={s.done ? 'success' : 'neutral'} className="ph-badge" icon={<Mark done={s.done} />}>
                        {/* Rolls (the default), not a crossfade: a fade left the
                            pill blank for a moment between the two words */}
                        <Roll>{s.done ? 'Succeeded' : 'Running'}</Roll>
                      </Badge>
                    }
                    time={<Roll align="end">{duration(s.secs)}</Roll>}
                  />}
                </Collapse>
                <Run
                  name="enrollment_sync"
                  trigger={<><Clock size={12} strokeWidth={2} />schedule</>}
                  rows={rowCount(18204)}
                  status={<Badge tone="neutral" className="ph-badge ph-badge--old" icon={<Mark done />}>Succeeded</Badge>}
                  time="9m 41s"
                />
                {[
                  [132, 96],
                  [104, 120],
                  [148, 84],
                ].map(([a, b], i) => (
                  <div key={i} className="ph-row ph-row--filler">
                    <span className="ph-lines">
                      <Bar w={a} h={8} r={4} tone={2} />
                      <Bar w={b} h={7} r={3.5} tone={1} />
                    </span>
                    <Bar w={[44, 36, 48][i]} h={7} r={3.5} tone={1} className="ph-fill-rows" />
                    <Bar w={76} h={20} r={10} tone={1} />
                    <Bar w={40} h={7} r={3.5} tone={1} />
                  </div>
                ))}
              </div>
            </div>
          </Window>
        </div>
      )}
    </Stage>
  )
}

// The status mark: spinner and dot share one 8px cell and crossfade, so the
// word beside it never moves
function Mark({ done }: { done: boolean }) {
  return (
    <span className="ph-mark" data-done={done || undefined}>
      <Spinner size={8} />
      <i className="ph-dot" />
    </span>
  )
}

function Run({ lead, name, trigger, rows, status, time }: { lead?: boolean; name: string; trigger: ReactNode; rows: ReactNode; status: ReactNode; time: ReactNode }) {
  return (
    <div className="ph-row" data-lead={lead || undefined}>
      <span className="ph-lines">
        <span className="ph-name">{name}</span>
        <span className="ph-meta">
          <span className="ph-meta__item">{trigger}</span>
        </span>
      </span>
      {/* Numbers sit in right-aligned columns, so a figure that gains a
          digit grows to the left and nothing beside it moves */}
      <span className="ph-rows">{rows}</span>
      {status}
      <span className="ph-time">{time}</span>
    </div>
  )
}

function Side() {
  return (
    <nav className="ph-side">
      {[56, 72, 48, 64, 52].map((w, i) => (
        <span key={i} className="ph-nav" data-active={i === 1 || undefined}>
          <Bar w={12} h={12} r={3} tone={i === 1 ? 4 : 2} />
          <Bar w={w} h={6} tone={i === 1 ? 4 : 2} />
        </span>
      ))}
    </nav>
  )
}
