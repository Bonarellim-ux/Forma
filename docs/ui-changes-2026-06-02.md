# UI Changes Handoff — 2026-06-02

Handoff for Codex (or any agent) continuing the Forma UI work. Read
`docs/handoff.md` and `docs/architecture.md` first for the hard constraints
(no frameworks / npm / build tools, relative paths, kg internally, don't
rename `ll_` localStorage keys, API key never committed). Everything below
respects those.

## What happened today

Two focused passes on the **home screen**, plus a new strategic design doc.
Both passes were committed to `main`:

| Commit | Title |
| --- | --- |
| `ee098e0` | Home screen: bold-athletic pass + legibility fixes |
| `80dcc17` | Home screen: motion + interaction pass |

A new root file **`PRODUCT.md`** was added — it is the strategic design
brief (register, users, brand personality, anti-references, design
principles, a11y target). Treat it as the source of truth for *why* the UI
looks the way it does. Key facts from it:

- Register: **product** (app UI; design serves the task).
- Personality: **confident, precise, athletic** — bold but earned, never
  hype/bro, never cluttered, never gamified. Strava-like, not "transform
  your body".
- Principles: one clear next action; show the reasoning; built for the gym
  moment (legible mid-set, one-handed); honest restraint; athletic
  confidence in form.
- A11y target: **WCAG 2.1 AA**.

> Note: an earlier nav fix from this session (`position:fixed` scroll-hide
> removal) was superseded when the shared `main` history advanced. The
> current nav is already a slim fixed 40px bar — no action needed.

---

## New design-system conventions (FOLLOW THESE going forward)

These are now in `css/styles.css :root` and used across the home screen.
**Reuse them; do not reintroduce the old patterns.**

### Color / text tokens

- `--muted: #5A7388` — secondary text. **Darkened from the old `#8AA4BC`**
  to clear WCAG AA (~4.6:1 on `--bg`). Use this for secondary/label text.
- `--sub: #476A84` — slightly stronger secondary (passes AA). Body-ish.
- `--dim: #E4EEF7` — **hairlines / faint fills ONLY. Never use as text**
  (it fails contrast badly; this was the old "first time" bug).
- When adding secondary text, default to `--muted` or `--sub`, never `--dim`.

### Monospace data

- `--mono: ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace`
- **`Courier New` is banned.** All weights / e1RM / timers / dates-as-data
  use `font-family:var(--mono)` (often with `font-variant-numeric:tabular-nums`
  via the `.mono` class). The global replace already removed every
  `'Courier New',monospace` from `index.html`, `js/workout.js`, `js/stats.js`,
  `css/styles.css`.
  - Exception: SVG `font-family=""` *presentation attributes* can't read CSS
    vars — use a literal `ui-monospace,Menlo,monospace` there (see
    `js/stats.js` score ring).

### Motion tokens (Emil Kowalski easing — built-in easings are too weak)

```css
--ease-out:    cubic-bezier(.23,1,.32,1);   /* entering UI: fast start */
--ease-in-out: cubic-bezier(.77,0,.175,1);  /* on-screen movement */
--ease-drawer: cubic-bezier(.32,.72,0,1);   /* iOS-style sheets/drawers */
```

Rules: UI animations stay **under 300ms**; never `ease-in`; never
`transition: all` (name the properties). Only animate `transform`/`opacity`.

### Reusable motion classes (in `css/styles.css`)

- **`.press`** — put on any pressable button/element. Gives
  `transform:scale(.97)` on `:active` with `--ease-out`. The hero CTA,
  "Set up", "Preview workout", and header "Ask AI" now use it. **Add it to
  new buttons** instead of leaving them with no press feedback.
- **`.sheet-overlay`** — on a bottom-sheet's full-screen backdrop div.
  Renders a dim+blur scrim and fades it in.
- **`.sheet-panel`** — on the sheet's panel div. Slides up from
  `translateY(100%)` with `--ease-drawer` (.38s). Plays once on mount
  (it's fine with the existing `sheetTouch*` drag handlers, which take over
  via inline `transform` after entrance).
- A global `@media (prefers-reduced-motion: reduce)` block collapses
  movement to near-instant — keep new motion compatible with it.

### Touch / hover

- This is a touch-first PWA. Gate any `:hover` rule behind
  `@media (hover:hover) and (pointer:fine)` so taps don't trigger sticky
  hover. (The lone `.btn-dashed:hover` is already wrapped.)

### Banned patterns (we removed these; don't reintroduce)

- **Side-stripe accents** (`border-left`/a 3px colored bar on a card). The
  recent-session cards were rewritten to a split-tinted background + full
  border instead.
- **Eyebrow spam** — stacked tiny uppercase tracked kickers. The hero had
  two (`TODAY` + `TODAY'S PLAN`); now one informative kicker (the weekday).
  One deliberate kicker per region is fine; one above every block is not.
- **`Courier New`**, **`--dim` as text**, **`transition:all`**, **`ease-in`**.

---

## Detailed changes by file

### `PRODUCT.md` (new)
Strategic brief (see summary above).

### `css/styles.css`
- `:root`: darkened `--muted`; added `--mono`, `--ease-out`, `--ease-in-out`,
  `--ease-drawer`; added explanatory comments on `--dim`.
- `.mono`: now `var(--mono)` + `tabular-nums` + `-.01em` (was `Courier New`).
- `.num-row input`, `.set-chip-txt`, `.set-chip-e`, `.e1rm-preview`,
  `.plate-text`, `.rest-timer .rt-time`: `Courier New` → `var(--mono)`.
- Added `.press` / `.press:active`.
- Added `.sheet-overlay`, `.sheet-panel` + `@keyframes scrimIn`, `sheetUp`.
- Added `@media (prefers-reduced-motion: reduce)` block.
- `.home-week-tile`: easing → `var(--ease-out)`; added
  `.home-week-day:active .home-week-tile{transform:scale(.94)}` press feedback.
- `.btn-dashed:hover` wrapped in `@media (hover:hover) and (pointer:fine)`.

### `index.html` (home view = `vHome()`, sheet = `vDayPreviewPanel()`)
- **Hero card**: kicker is now the weekday (`DAY_FULL[today]`) instead of a
  generic `TODAY`; removed the second `TODAY'S PLAN` eyebrow; title bumped
  to 33px/850 with tighter tracking (scoreboard feel); replaced the floating
  decorative dot with a **split-type badge pill** in the split color
  (`hexA(col,.24)` bg / `hexA(col,.5)` border, white label).
- Hero subtitle color nudged to `#9CC0D8` for contrast on the dark card.
- **"First time"** labels: `--dim` → `--muted` + weight 600, capitalized
  (were effectively invisible). Two spots in `vHome` selected-day list;
  the `vDayPreviewPanel` one still uses `--dim` (see TODO).
- **Recent-session cards**: removed the 3px side-stripe; now split-tinted
  bg (`hexA(wc,.05)`) + full border (`hexA(wc,.22)`), bold day title, mono
  date, correct singular/plural ("1 exercise" vs "N exercises").
- `class="press"` added to hero CTA (only when not a rest day), "Preview …
  Workout", and "Set up" buttons.
- `vDayPreviewPanel`: overlay div got `class="sheet-overlay"`; panel div got
  `class="sheet-panel"` (scrim + slide-up).
- Inline `Courier New` → `var(--mono)` throughout (last-weight displays,
  set inputs).

### `js/app.js`
- Header "Ask AI" button: `class="press"` added; `transition:all .15s` →
  `transition:background .15s var(--ease-out),transform .14s var(--ease-out)`.

### `js/workout.js`, `js/stats.js`
- `Courier New` → `var(--mono)` for all inline data text; the stats score-ring
  SVG presentation attribute uses the literal `ui-monospace,Menlo,monospace`.

---

## Why the home screen has NO entrance/stagger animation (important)

`render()` rebuilds the view's DOM on **every** interaction — including
tapping a day tile in the week strip. A CSS entrance/stagger on the home
cards would **replay on every tap**, which feels slow and broken. Per the
motion philosophy (frequency framework): things seen tens of times a day
should have motion *reduced*, not added. So home motion is intentionally
limited to press feedback + the occasional bottom sheet. **If you add
entrance animation, gate it so it does not replay on every `render()`**
(e.g., only on first view-enter, or refactor day-selection to toggle a class
instead of re-rendering).

---

## Suggested next steps (not yet done)

1. **Propagate sheet motion app-wide.** The other bottom sheets are still
   un-animated and scrim-less. Add `class="sheet-overlay"` / `class="sheet-panel"`
   to:
   - `js/workout.js` — `exHistory` sheet (~L563), `exInstruct` sheet (~L623)
   - `js/stats.js` — `scoreDetail` sheet (~L360)
2. **`vDayPreviewPanel` "first time"** still uses `--dim` (~`index.html` L554)
   — change to `--muted` for consistency with the rest.
3. **`.tour-spotlight`** still uses `transition:all .18s ease` (`styles.css`)
   — make the properties explicit.
4. **Add `.press`** to remaining primary buttons across workout/stats/setup
   for consistent tactile feedback.
5. Consider exit animation for sheets (currently they vanish instantly on
   tap-scrim dismiss; drag-to-dismiss already feels right).

## Dev / verification gotcha

Python's `http.server` (the local preview) sends **no cache headers**, so
browsers serve stale `app.js`/`styles.css` after edits. To verify changes
live, hard-refresh or load from a fresh port. On GitHub Pages, hard-refresh
after deploy to clear cached assets.

## Status

Both commits are on local `main` and **not yet pushed** (push via GitHub
Desktop). Design context lives in `PRODUCT.md`. Skills used: `impeccable`
(visual/UX) and `emil-design-eng` (motion) — both installed under
`~/.claude/skills/`, not in the repo.
