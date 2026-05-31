# Forma Architecture

## Purpose

This document controls how Forma stays modular as the product grows. Read it before future code changes and use it to decide which file owns a change.

Forma is currently a static GitHub Pages PWA built with vanilla HTML, CSS, and JavaScript. It must remain compatible with GitHub Pages unless the architecture is explicitly changed.

## Current File Structure

```text
index.html
css/styles.css
js/app.js
js/ai.js
js/workout.js
js/recommendations.js
js/stats.js
js/onboarding.js
js/storage.js
js/utils.js
docs/architecture.md
docs/FORMA_MASTER_DOCUMENT.md
docs/training-principles.md
docs/handoff.md
```

## File Responsibilities

| File | Responsibility |
| --- | --- |
| `index.html` | Static HTML shell, meta tags, CSS link, script loading order, global constants/state that have not yet been split out, and remaining legacy view/setup code. No new major feature logic should live here unless there is no better owner. |
| `css/styles.css` | All visual styling, responsive layout, mobile/PWA safe-area behavior, bottom nav, cards, component classes, and tour styling. No app logic. |
| `js/app.js` | App initialization, main render orchestration, navigation/view switching, app-level event handlers, shared UI input helpers, service worker registration, and startup flow. |
| `js/ai.js` | AI chat, API constants, API key handling, prompt/context building, quick AI, inline AI, response parsing, AI action handling, and AI-related voice flows. |
| `js/workout.js` | Starting/resuming/finishing/canceling workouts, active session state, workout logging UI, exercise cards, set logging, warm-up handling, rest timer, exercise editing/reordering, cardio/simple workout logging, and workout panels. |
| `js/recommendations.js` | In-workout recommendations, progressive overload logic, double progression, rep vs weight recommendations, plateau/decline detection, and exercise substitution rules. |
| `js/stats.js` | PRs, records, e1RM calculations, charts, calendar/heatmap stats, streaks, strength scores, progress indicators, volume/trend calculations, and exercise history stats. |
| `js/onboarding.js` | Onboarding quiz, unit setup, profile setup, feature tour, demo tour state, tour restoration, and replay tour. |
| `js/storage.js` | localStorage load/save, persistence helpers, import/export, data restoration, sanitization, and localStorage compatibility. |
| `js/utils.js` | Shared helpers, formatting, unit conversion, date helpers, HTML escaping, markdown rendering, and generic utilities. |

## Architecture Rules

> Before editing code, decide which file owns the change.

- Read this file before future code changes.
- Keep changes small and targeted.
- Do not mix unrelated logic into the wrong file.
- Do not refactor unless explicitly asked or required to safely complete a change.
- Keep GitHub Pages compatibility.
- Use relative paths only.
- Do not use npm, frameworks, build tools, React, or Vite.
- Keep the app static unless explicitly changing architecture.
- Do not change UI or behavior unless requested.
- After editing JavaScript, check syntax.

## Data Rules

- Do not rename localStorage keys.
- Do not break existing user data.
- All weights are stored internally in kg.
- Display weight depends on selected unit.
- Warm-up sets use `warmup:true`.
- Warm-up sets must remain visible as warm-ups in history.
- Working-set calculations should ignore warm-ups unless a feature explicitly intends otherwise.
- API key must stay in localStorage only.
- API key must never be hardcoded, exported, logged, committed, or included in prompts.

## Split Rules

Create a new file when:

- A file exceeds roughly 700-900 lines.
- A file has multiple major responsibilities.
- A feature can be isolated cleanly.
- A change risks touching too many unrelated systems.
- A bug in one feature could easily break another feature.

## Possible Future Splits

- `js/aiPromptBuilder.js`
- `js/aiActions.js`
- `js/aiChat.js`
- `js/workoutSession.js`
- `js/setLogger.js`
- `js/exerciseEditor.js`
- `js/featureTour.js`
- `js/onboardingQuiz.js`
- `js/charts.js`
- `js/records.js`
- `js/heatmap.js`
- `js/exerciseDatabase.js`

## Deployment Workflow

1. Codex edits local repo files.
2. GitHub Desktop detects changes.
3. Review changed files.
4. Commit to `main`.
5. Push `origin`.
6. Wait for GitHub Pages deployment.
7. Test live URL: `https://bonarellim-ux.github.io/Forma/`

## Required Instruction For Future Codex Sessions

At the start of every future coding task, read `docs/architecture.md` first and decide whether the change belongs in an existing file or a new file.
