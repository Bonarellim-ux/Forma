# Forma Architecture

This document is a permanent architecture rule for Forma. Read it before making future code changes.

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
```

## File Responsibilities

### index.html
Owns the static HTML shell, app metadata, script loading order, global constants/state that have not yet been split out, and remaining legacy view/setup code. Keep it small over time. Do not add new feature logic here unless there is no better owner.

### css/styles.css
Owns all visual styling, responsive layout rules, PWA safe-area fixes, component classes, and visual polish. Do not put app logic here.

### js/app.js
Owns app initialization, render control, navigation/routing, app-level event handlers, shared UI input helpers, service worker registration, and startup orchestration. The app should start only once from here.

### js/ai.js
Owns AI coach behavior, API constants, API key helpers, prompt/context building, AI chat UI, quick AI, inline AI, response parsing, AI action handling, and AI-related voice flows.

### js/workout.js
Owns active workout state, workout start/resume/finish/cancel behavior, workout logging UI, exercise cards, set logging, warm-up sets, rest timer behavior, workout exercise editing/reordering, cardio logging, and workout-related panels.

### js/recommendations.js
Owns in-workout recommendation logic, progressive overload suggestions, double-progression rules, exercise substitution recommendations, and recommendation-specific helper functions.

### js/stats.js
Owns progress/statistics screens and calculations, PRs/records, e1RM calculations, charts, calendar/heatmap stats, streaks, strength scores, and trend/volume calculations.

### js/onboarding.js
Owns onboarding quiz flow, onboarding step rendering, profile setup from onboarding, onboarding unit selection, feature tour logic, demo tour state, tour restoration, and replaying the feature tour.

### js/storage.js
Owns localStorage loading/saving, persistence helpers, import/export backup logic, and data restoration/sanitization. Do not store API keys in exports.

### js/utils.js
Owns generic utility helpers that are broadly reusable and not specific to AI, workout logging, stats, onboarding, or storage.

## Automatic Architecture Check Rule

Before making any future code change, Codex should ask internally:

- Which file owns this feature?
- Am I about to mix unrelated logic into the wrong file?
- Is the file becoming too large?
- Should this be a new file instead?
- Will this change affect app initialization, storage, AI, workout logging, stats, or onboarding?

## Split Rules

Create a new file when:

- A file is over 700-900 lines.
- A file has more than one major responsibility.
- A feature can be isolated cleanly.
- A change requires touching too many unrelated areas.
- A bug in one feature risks breaking another feature.

## Future Possible Splits

- js/aiPromptBuilder.js
- js/aiActions.js
- js/aiChat.js
- js/workoutSession.js
- js/setLogger.js
- js/exerciseEditor.js
- js/featureTour.js
- js/onboardingQuiz.js
- js/charts.js
- js/records.js
- js/heatmap.js

## Required Instruction For Future Codex Sessions

At the start of every future coding task, read docs/architecture.md first and decide whether the change belongs in an existing file or a new file.
