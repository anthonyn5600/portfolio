# Rehearsal notes

How the two illustrations were checked, following the Stageshow skill's rehearse step. Filmed with the skill's `scripts/film.mjs` and `scripts/jumps.mjs` (headless Chrome) on 2026-11-10. A second pass went through every warning the tools printed and fixed its cause instead of accepting it.

## Result

| Check | Pipeline hero | Campus card |
|---|---|---|
| `film.mjs --gate`, preview, 1280 and 390, two full loops each | passed, **0 findings** | passed, 1 manual item (below) |
| Same, slowed 3x for denser sampling | passed, 0 findings | passed, same manual item |
| Real page, `film.mjs --gate` | passed, 0 findings at 1440 and 390 | passed at 1440, 1 page-motion line (below) |
| Real page, `jumps.mjs` 24s motion scan | 0 findings at 1440 and 390 | 0 findings at 1440 and 390 |
| Missing-resource errors | none (favicon added) | none |

## What each warning was, and what changed

### Pipeline hero (`src/pipeline/`)

- **`jump` / `settle snap` on digit strips (±11 and ±120px), `appears with no entrance: ss-count`, `handoff shift: ss-count__strip`, `near-empty frames`.**
  - **Cause:** the row count and run time used the kit's `Count`. It keeps a strip of 30 digits per column and snaps the strip back to its middle after every roll. That snap was the jump, and the hundreds of strip spans dropping out at the loop seam made the frame read as near-empty.
  - **Fix:** both values now use `Roll`, which animates only the changed characters.
- **`lopsided: ss-badge "Running"` (5–6px left, 9px right).**
  - **Cause:** the spinner rotated its whole svg, and a rotated 8px box measures 10.8px, so the pill's left inset kept changing as it spun.
  - **Fix:** only the arc rotates now; the spinner's box holds still.
- **`settle snap: ss-roll` 2px.**
  - **Cause:** the first frame of the row count's width ease pushed its left edge 2px at once, just after the row had landed.
  - **Fix:** the count and time columns reserve the width of their longest value ("52,318 rows", "14m 08s"), so the value eases inside fixed room and no edge moves.
- **Hidden rewind found while tracing.**
  - **Cause:** after the row closed, its status pill snapped 19px narrower and its numbers rolled back from 52,318 to 0 out of sight.
  - **Fix:** the new run's row is now removed once it has closed and mounted fresh for the next loop, so nothing ever rewinds.
- **Found by eye on the real page:** the status pill went blank for an instant while "Running" faded out before "Succeeded" faded in.
  - **Fix:** the word now rolls through, the old one sliding out as the new one rises.

### Campus card (`src/campus/`)

- **`jump: ss-field__chars width +8.3px` (once per keystroke).**
  - **Cause:** typed text grows one character at a time, as a real input does.
  - **Fix:** the typed characters carry `data-snap`, the kit's mark for an intentional step. This is set inside `src/kit/controls/Field.tsx`, the only change made to the kit, and commented there.
- **`manual: cn-paths changes drawing` (the route).**
  - The tool asks a person to watch this in motion, so I filmed it frame by frame. That review found two real faults:
    - The resting cursor sat on the "You" dot, covering where the route starts. It now waits beside the search field, near its next move.
    - The walk popup covered the route's corner at (232, 104). It now sits beside the building, clear of the route.
  - The route itself draws smoothly from the dot along the walkways to the library. This line still prints because it is a request for review, not a fault.
- **`steps in its box: ss-menu__item`.**
  - **Cause:** the suggestion menu shrinks a touch as it closes.
  - **Fix:** the menu has a lasting layer (`will-change: transform`), so its words scale smoothly.
- **`near aligned: title / "4 min walk"` (phone layout, real page).**
  - **Cause:** the popup's words started 11–13px from the window title's.
  - **Fix:** on a phone the popup's words now start on the search text's column, exactly.
- **`scale: 1.05, grown past the design size` (preview at 390).**
  - **Cause:** the preview page's 16px side padding made the card 358 wide instead of the site's 342.
  - **Fix:** the preview now pads 24px, like the site.

### Page level

- **`Failed to load resource: 404`:** the browser asking for `/favicon.ico`. The site now has `favicon.svg` (the nav's "AN." mark), and the preview page sets an empty icon.
- **`steps in its box: ss-field__box`, Campus card on the real page at 1440 only.** A frame-by-frame trace shows the box doesn't move inside the page at all (its document position stays fixed). Its screen position changes for two reasons that belong to the page:
  - the smooth scroll to the `#campus-navigator` anchor the recorder loads;
  - the card's existing scroll-reveal slide-in.
  - The card's media area now has a lasting layer, so the illustration rides those moves as one image. The line still prints because the recorder can't start after the scroll settles (with `--delay` its screenshot area goes stale).

## Coverage

Every run reports `coverage … (inconclusive)`, which means some gaps between sampled frames were longer than 11ms. These gaps come from the recorder, not the page:

- With nothing attached, the page runs steadily at about 144fps: median frame 6.9ms, worst 7–14ms, no frame over 20ms.
- The skill's own gold example (`dark-hero`) shows the same gaps on this machine.
- To make up for it:
  - The 3x-slowed recordings sample every real-time moment at least once per ~19ms, and they are clean.
  - The low-overhead `jumps.mjs` scans are clean.
  - Every beat (row opening, each tick, the status change, the close, typing, picking, the route, the clear) was watched frame by frame.

## Not checked

- The recorder fails with "clipped area outside the image" when it tries to screenshot the Campus card on the phone-width real page, because the card sits about 7000px down the page. That combination was covered instead by:
  - the motion scan on the real page (clean);
  - the preview at the same width (clean).
- No independent fresh-eye review (the skill's `references/review.md`) has been run.
- Safari and Firefox weren't tested. Filming used Chrome only.
- The 4-minute / 0.2-mile walk is illustrative, not computed from real campus coordinates.
