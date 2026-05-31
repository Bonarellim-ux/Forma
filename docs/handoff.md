# Forma Handoff

## Project Summary

Forma is a static GitHub Pages PWA built with vanilla HTML, CSS, and JavaScript. It is an evidence-based AI workout coach that uses workout history to make explainable recommendations.

## Project Root

```text
iCloud Drive/Documents/GitHub/Forma
```

## Live URL

```text
https://bonarellim-ux.github.io/Forma/
```

## Current Architecture

| File | Purpose |
| --- | --- |
| `index.html` | Static shell, metadata, script loading, and remaining legacy globals/view code. |
| `css/styles.css` | Visual styling, layout, mobile/PWA safe-area behavior, component styling. |
| `js/app.js` | App initialization, render orchestration, navigation, global handlers. |
| `js/ai.js` | AI coach, API key handling, prompts, chat, response parsing, AI actions. |
| `js/workout.js` | Workout sessions, logging UI, sets, warm-ups, rest timer, exercise editing. |
| `js/recommendations.js` | In-workout recommendations, progression logic, exercise substitutions. |
| `js/stats.js` | Stats, charts, PRs, records, calendar, heatmap, e1RM, trends. |
| `js/onboarding.js` | Onboarding quiz, profile setup, unit setup, feature tour, demo state. |
| `js/storage.js` | localStorage persistence, import/export, restoration, sanitization. |
| `js/utils.js` | Shared helpers, formatting, unit conversion, dates, escaping. |

## Must-Read Files

Before any code change, read:

- `docs/architecture.md`
- `docs/training-principles.md`
- `docs/FORMA_MASTER_DOCUMENT.md` if product direction matters

## Important Technical Rules

- No frameworks.
- No npm.
- No build tools.
- Use relative paths.
- Keep GitHub Pages compatibility.
- Do not rename localStorage keys.
- Do not hardcode API keys.
- API key is stored in localStorage only.
- Do not export API key.
- All weights are stored internally in kg.
- Warm-ups use `warmup:true`.
- Do not break existing user data.
- After JavaScript edits, run syntax checks.

## Important Product Rules

- Evidence-based coaching.
- Explain recommendations.
- No recommendation is better than a weak recommendation.
- Protect successful patterns.
- Use workout data before asking questions.
- Use first-person AI.
- Do not overwhelm users.
- Avoid generic advice.
- Exercise substitutions must match muscle, movement pattern, joint function/angle, and workout role.

## Current Features

- Onboarding.
- Feature tour.
- Home.
- Weekly schedule.
- Workout logging.
- Warm-ups.
- Rest timer.
- In-workout recommendations.
- Exercise substitutions.
- Ask AI coach.
- AI action logging/starting flows.
- Stats, charts, PRs, calendar, and heatmap.
- Setup.
- Import/export backup JSON.

## Known Issues / Current Concerns

- Recommendation engine refinement.
- Feature tour refinement.
- iPhone bottom nav safe-area polish.
- Future account/cloud sync needed.
- localStorage API key approach is prototype-only.
- AI action handling should be tested carefully.

## Development Workflow

1. Make change locally.
2. Check GitHub Desktop.
3. Review changed files.
4. Commit to `main`.
5. Push `origin`.
6. Wait for deployment.
7. Test live site.
8. For PWA cache issues, delete/re-add Home Screen app if needed.

## Immediate Next Tasks

Priority:

1. Improve in-workout recommendation engine so it suggests reps/weight/hold only when useful.
2. Improve feature tour examples and real-app walkthrough.
3. Polish iPhone bottom nav safe-area.
4. Test AI action handling for workout/cardio logging.
5. Prepare for real user testing.
6. Plan accounts/cloud sync later.

## Notes For Future Sessions

This project can contain uncommitted local changes. Do not revert user or previous-session changes unless explicitly asked. If a task is documentation-only, do not modify app code.
