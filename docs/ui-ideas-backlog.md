# UI Improvement Ideas — Backlog (for Matias + Codex)

Synthesized from the `impeccable` (visual/UX) and `emil-design-eng` (motion)
skills + `PRODUCT.md`. Ground rules that gate every idea here:

- **Brand:** confident, precise, athletic. Bold but earned. NOT hype/bro,
  NOT cluttered-tracker, NOT gamified (no confetti/mascots/badge spam).
- **Constraints:** vanilla HTML/CSS/JS, no build, GitHub Pages, relative
  paths, mobile-first PWA, WCAG 2.1 AA, weights stored in kg.
- **Architecture gotcha:** `render()` rebuilds the view's DOM on every
  interaction. So any animation that isn't gated will **replay on every
  tap**. Entrance/stagger must be one-time (sessionStorage flag) or scoped
  to the element that actually changed (see the `S._justSet` pattern).
- **Reuse what exists:** tokens (`--ease-out/-in-out/-drawer`, `--mono`,
  AA `--muted`), `.press`, `.sheet-overlay`/`.sheet-panel`,
  `restTimerMarkup()`. Don't reinvent.

Effort legend: **S** ≈ <1hr, **M** ≈ a few hrs, **L** ≈ a day+.
Priority: ⭐ = highest wow-per-effort.

---

## A. Signature "wow" moments (pick a few; don't do all)

1. ⭐ **Living hero stat on home (M).** The hero is static. Add ONE beautiful
   data object: a weekly training-load/volume **ring or 7-day tonnage bar**
   that animates in *once per app open* (count-up + fill, ~600ms `--ease-out`,
   gated by `sessionStorage`). This is the "the app is tracking me" beat.
   Keep it to one object — resist a stats grid (that's the cluttered-tracker
   anti-reference).
2. **One-time orchestrated home entrance (M).** On the first render of a
   session only, stagger hero → week strip → cards at 40–60ms each. Gate with
   `sessionStorage` so tapping a day never replays it. Done right per Emil's
   frequency rule.
3. **Finish-workout summary moment (M–L).** When a session ends, a focused
   "session recap" screen: total tonnage, PRs hit, est. 1RM moves, a single
   line of coach takeaway. This is the emotional payoff of the whole session
   and currently underbuilt. Restrained, data-forward (think Strava activity
   summary, not a trophy screen).
4. **Material depth on the dark hero (S).** Cheap craft that reads premium:
   faint grain/noise texture, a soft top specular highlight, a barely-there
   gradient sheen. Static, no perf cost. Separates "nice card" from "designed".

## B. Per-screen improvements

### Home
5. ⭐ **Situational greeting (S).** "Good evening" is generic. Make it earned
   and specific: "3 days strong this week", "Last Pull: +5kg deadlift", "2
   sessions to a weekly PR". One real line; pull from existing data.
6. **Week strip: tighten the pastels (S).** The resting tiles are very pale
   (`hexA(dc,.09)`). For "athletic" they can read washed-out/rainbow. Slightly
   raise fill/border alpha, and double-check split-color *text on pale tile*
   contrast (legs-green / lower-gold on near-white can fail AA). Don't rely on
   color alone — labels already help, keep them.
7. **Card rhythm (S).** Home is a stack of same-radius white cards on grey.
   Vary it: the selected-day panel could be flatter/lighter than the hero so
   the hero clearly wins the hierarchy. Avoid nested cards (always wrong).

### Workout logging (Pass 3 shipped the ring + set feedback)
8. ⭐ **Live session tally (S–M).** A small, sticky "today" line that ticks up
   as you log: total sets · tonnage · est. top-set 1RM. Uses `--mono`
   tabular-nums, animates the number on change (scoped, not full-rerender).
9. **Number stepper press feel (S).** The `.num-row` +/- buttons: add `.press`
   /scale feedback and maybe press-and-hold to repeat. High-frequency control,
   should feel instant.
10. **Plate calculator as a real object (M).** You already compute plates —
    render them as crisp colored plates on a bar that updates as weight
    changes. A satisfying, glanceable, physical detail.
11. **Rest-timer presets feedback (S).** The 1m/90s/2m/3m buttons get `.press`;
    the active duration highlights.

### Stats / Progress
12. **Chart polish (M).** Make one chart the hero (est. 1RM trend per lift)
    with a clean axis, a "PR" marker, and a smooth draw-in on first view
    (once). Quieter gridlines, stronger line. Tabular-nums everywhere.
13. **PR / records wall (M).** A calm, premium list of bests per lift —
    earned-confidence, not a trophy case. Sort by recency or e1RM.
14. **Heatmap/calendar contrast (S).** Verify the activity colors clear AA and
    read at a glance; label intensity, don't rely on hue alone.

### AI coach / chat
15. ⭐ **Streaming + thinking states (M).** If the proxy supports streaming,
    stream tokens; otherwise a calm "thinking" shimmer (not the generic 3-dot
    bounce). The coach should feel responsive and considered — that's the core
    differentiator. (Note: proxy deploy is still the production blocker.)
16. **Recommendation "why" reveal (S).** When the coach proposes a change, the
    reasoning expands with a smooth height+opacity transition. "Show the
    reasoning" is principle #2 — make it feel deliberate.
17. **Quick-action chips (S).** The suggested follow-ups already exist; give
    them `.press`, consistent shape, and a subtle stagger on first appearance.

### Setup / Onboarding / Empty states
18. **Onboarding as a confident first impression (M).** First launch is the
    one place "rare/first-time → can add delight" applies. A composed,
    paced intro (one idea per step, strong type, the split being built shown
    live) sets the tone.
19. **Empty states that teach (S).** "No sessions yet / Start above" is fine
    but flat. Make each empty state point at the one next action with a touch
    of personality (still restrained).

## C. Global craft / design-system (compounding, low-risk)

20. ⭐ **Propagate the sheet motion (S).** Apply `sheet-overlay`/`sheet-panel`
    (scrim + slide-up) to the other bottom sheets: `exHistory`, `exInstruct`
    (`js/workout.js`), `scoreDetail` (`js/stats.js`). Consistency = craft.
21. ⭐ **`.press` everywhere (S).** Every pressable surface across workout/
    stats/setup should confirm the tap. Cheap, huge aggregate "feels alive".
22. **Kill remaining anti-patterns (S).** `.tour-spotlight` still uses
    `transition:all`; a few `border-left:3px` side-stripes remain in non-home
    components (`.rec-row`, `.inline-ai-reply`, `.tour-coach-example`) — these
    are flagged bans. Rewrite with full borders / tints.
23. **Focus-visible states (S).** Add visible `:focus-visible` rings on
    interactive elements (keyboard + a11y). Currently mostly absent.
24. **Type scale discipline (S).** Lots of one-off inline font sizes. Settle on
    a small rem-based scale (e.g., 11/12/13/15/18/24/33) and a couple of
    reusable text classes; reduces drift and the "AI inline-style soup" feel.
25. **Iconography consistency (S).** Standardize stroke-width and size on the
    inline SVGs (some are 1.5, some 2, some 2.5). Small but it shows.

## D. Accessibility & performance (non-negotiable, mostly S)

26. **Contrast audit pass (S).** We fixed `--muted`/`first time`; sweep the
    rest (muted text on tinted/dark surfaces, placeholders, split-color text).
27. **Touch targets ≥44px (S).** The tiny dismiss `×` buttons and some icon
    buttons are under 44px — pad their hit area.
28. **Only animate transform/opacity (ongoing).** Audit for any height/width/
    margin transitions; move to transform. (Ring already does this.)
29. **`prefers-reduced-motion` coverage (S).** Block exists globally; just keep
    new motion compatible (no movement-only meaning).

---

## Suggested sequencing (credit-aware)

1. **Cheap wins first (all S):** #20 sheet motion, #21 `.press` everywhere,
   #5 situational greeting, #22 kill anti-patterns, #26 contrast sweep. These
   are low-risk, compounding, and make the whole app feel considered.
2. **One signature beat:** #1 living hero stat (entry wow) OR #3 finish-workout
   summary (payoff wow). Pick one.
3. **Then:** #8 live session tally, #12 chart hero, #15 coach streaming.

Codex can take the **C/D global items** in parallel safely (they're
mechanical and scoped); reserve the **A signature moments** for a focused
session with live preview iteration.
