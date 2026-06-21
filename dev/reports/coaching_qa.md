# Forma Coaching QA Tester

Generated: 2026-06-21T22:42:24.338Z

Purpose: test whether Forma feels like a real coach across common user questions — beyond deterministic exercise recommendations.

Mode: **live AI via production proxy**

## Summary

- Scenarios: 10
- Coaching pass: 10/10
- Coaching fail: 0
- API/runtime failures: 0 (separate from coaching quality)

| # | Scenario | Pass | Overall | Failed checks | Patterns | API |
|---:|---|:---:|:---:|:---:|---|:---:|
| 1 | What should I do next workout? | yes | 10 | 0 | — | no |
| 2 | Why did my squat go down? | yes | 10 | 0 | — | no |
| 3 | Should I deload? | yes | 10 | 0 | — | no |
| 4 | What is my biggest weakness? (low-data beginner) | yes | 10 | 0 | — | no |
| 5 | What is my biggest weakness? (intermediate mixed data) | yes | 10 | 0 | — | no |
| 6 | Should I add another training day? | yes | 10 | 0 | — | no |
| 7 | I want to reduce to 4 days. | yes | 10 | 0 | — | no |
| 8 | User says yes after coach asks to apply change | yes | 10 | 0 | — | no |
| 9 | Why did Forma recommend this weight? | yes | 10 | 0 | — | no |
| 10 | Bench down, OHP and incline up | yes | 10 | 0 | — | no |

---

## Detailed scenarios

### 1. What should I do next workout?

**Prompt:** What should I do next workout?

**Mock context:** Intermediate, stable recent performance

- Profile: {"name":"Alex","goal":"Hypertrophy with strength progress","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 6

#### AI response

```
Monday is Push day. Here's what the recommendation engine has for you:

**Bench Press**
225 lbs × 7 reps — you hit 6 last session, so the goal is one more rep before adding weight.

**Overhead Press**
115 lbs × 9 reps — you hit 8 last session, building toward the top of your range.

**Incline Dumbbell Press**
90 lbs × 10 reps — hit 9 last session, one more rep to go.

**Tricep Pushdown**
~37.5 lbs × 10–15 reps — calibration load, first logged session so I'll adjust after you record it.

**Lateral Raise**
~15 lbs × 12–20 reps — same deal, first baseline set.

---

**One thing to watch:** Bench has dropped from 8 to 6 reps at 225 while OHP is climbing. Not a major alarm yet — only two sessions logged and it could be normal day-to-day variation — but worth paying attention to today's bench quality. If reps keep slipping over the next 2–3 sessions, we'll dig into it.

Confidence: Medium (early calibration phase across most lifts).

Ready to start the session when you are.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Uses current program or schedule | yes |
| Gives specific next workout guidance | yes |
| Does not invent missing data | yes (critical) |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 2. Why did my squat go down?

**Prompt:** Why did my squat go down?

**Mock context:** Squat slightly down; RDL and leg press up (no sleep in profile)

- Profile: {"name":"Alex","goal":"Get stronger","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym","injuries":"","preferences":""}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 4

#### AI response

```
**Observation:**
Your last two squat sessions:
- May 29: 280 lbs × 5
- Jun 8: 275 lbs × 4

That's a small drop in both load and reps — roughly a -7 lb e1RM change across 2 sessions.

**Interpretation:**
A drop this small over 2 sessions is more likely normal day-to-day variation than a true regression. That said, a few possible contributors worth considering:

- **Fatigue timing** — Legs day is Wednesday. Depending on how Monday Push and Tuesday Pull felt, accumulated fatigue could blunt squat performance
- **Technique or setup shift** — Small changes in bar position, depth, or bracing can affect output session to session
- **Insufficient baseline** — With only 2 sessions logged, it's hard to separate a real trend from noise

**What the broader data shows:**
Your Romanian Deadlift and Leg Press are both moving up. That means your legs and posterior chain aren't generally fatigued or undertrained — the squat specifically dipped while the rest of leg work improved.

**Confidence: Low** — 2 data points isn't enough to name a cause.

**Next step:**
Repeat 275 lbs on your next Legs day and aim for 5+ clean reps. If it comes back up, this was likely normal variation. If it drops again, we look deeper.

Anything feel off during the last session — depth, fatigue, or setup?
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Separates observation from interpretation | yes |
| Does not blame sleep unless provided | yes (critical) |
| Mentions mixed or non-squat signals | yes |
| Gives monitoring or action step | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 3. Should I deload?

**Prompt:** Should I deload?

**Mock context:** Minor fluctuation only — not broad decline

- Profile: {"name":"Alex","goal":"Hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 5

#### AI response

```
**Observation:** Two major lower-body compounds have dropped across recent sessions — Back Squat down ~13 lbs e1RM and Leg Press down ~20 lbs e1RM. Pull work is holding steady, so this isn't a full-body crash.

**Interpretation:** This *may* point to accumulated fatigue — particularly in the lower body — rather than a technique or programming issue. Squat-pattern work declining together is a meaningful signal. That said, we're still in early calibration (3 sessions on squats/leg press), so some of this could be normal session-to-session variation.

**Confidence: Medium** — two exercises moving the same direction across multiple sessions supports it, but it's not yet 3+ consecutive clear drops or a total performance collapse.

**My take:**
- A full deload isn't clearly justified yet — Pull is stable and push data is limited.
- A **targeted lower-body deload** makes more sense: drop squat and leg press intensity ~10% this week, keep reps moderate, treat it as an active recovery week.
- If squat and leg press bounce back next week, it was likely fatigue. If they keep dropping, we dig into sleep, stress, or nutrition.

**Next check:** How has sleep and stress been the past 1–2 weeks? That'll help confirm whether this is accumulated fatigue or something else worth adjusting.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Does not recommend deload aggressively | yes (critical) |
| Explains limited or mixed evidence | yes |
| Suggests monitoring or conservative next step | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 4. What is my biggest weakness? (low-data beginner)

**Prompt:** What is my biggest weakness?

**Mock context:** Beginner with 2 workouts

- Profile: {"name":"Sam","goal":"Build muscle and consistency","experience":"Beginner","session_duration":45,"equipment":"Full commercial gym"}
- Schedule: mon:upper, tue:rest, wed:lower, thu:rest, fri:upper, sat:rest, sun:rest
- Logged workouts: 2

#### AI response

```
Honest answer: I don't have enough data to name a real weakness yet.

**Observation:** Two sessions logged — one upper, one lower. Every lift is at a beginner baseline, which is completely normal and expected.

**Interpretation:** Nothing is standing out as lagging because there's no progression history to compare against yet. One session per split isn't enough to separate a weak point from normal day-to-day variation.

**Confidence: Low** — any weakness I named right now would be a guess, not a coaching insight.

**What I need to give you a real answer:**
— 4–6 weeks of consistent sessions
— Progress data across multiple lifts in the same pattern (e.g., push vs. pull)
— Rep ranges hitting top-end consistently so we can see where you stall first

**Next step:** Train your next two cycles as planned. After your next upper and lower session, I'll have comparison points and can start identifying where you're progressing fastest vs. slowest. That's where real weakness analysis begins.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Says not enough data or limited history | yes |
| Avoids inventing a definite weakness | yes (critical) |
| Gives a next step | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 5. What is my biggest weakness? (intermediate mixed data)

**Prompt:** What is my biggest weakness?

**Mock context:** Intermediate mixed pressing signals

- Profile: {"name":"Alex","goal":"Strength and hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 4

#### AI response

```
**Observation:** Your push session has a split signal — Bench Press has dropped from 230×7 to 215×5 (e1RM down ~33 lbs), while Overhead Press and Incline Dumbbell Press are both trending up.

**Interpretation:** This looks exercise-specific to the Bench Press rather than a true chest or triceps weakness — if those muscles were the problem, your Incline and OHP would likely be stalling too. Something specific to horizontal pressing may be off: setup, bar path, technique, or just normal short-term regression after a near-PR.

**Confidence: Medium** — only 3 logged push sessions, so this is a possible trend, not a confirmed weakness.

**Other possibilities:**
- Fatigue timing on Push day affecting bench specifically
- Technique or setup inconsistency on flat bench
- Your recent best was ~284 e1RM, current is ~251 — could be post-PR consolidation

**Next step:** Don't force load on bench right now. Forma's engine recommends repeating 215 lbs and hitting 6–10 clean reps to re-establish your baseline before progressing. How the next 2–3 sessions trend will tell us a lot more.

Want me to look at your bench technique cues or check if recovery timing on Push day could be a factor?
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Identifies likely pattern or area | yes |
| Confidence medium or lower | yes |
| Gives hypotheses not certainty | yes |
| Does not claim single definite cause | yes (critical) |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 6. Should I add another training day?

**Prompt:** Should I add another training day?

**Mock context:** Current 5-day PPL + Upper/Lower

- Profile: {"name":"Alex","goal":"Hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 0

#### AI response

```
You're already running a solid 5-day push/pull/legs + upper/lower structure with 2 rest days. That's a high-frequency hypertrophy setup — adding a 6th day can work, but let me break it down before recommending one.

**Current structure**
- 5 training days, 2 full rest days
- Good frequency: most muscles hit 2x/week
- Recovery buffer is moderate, not excessive

**Reasonable options for a 6th day**

1. **Accessories/weak-point day** — lower fatigue, isolation-focused (arms, shoulders, calves, whatever's lagging). Easiest to recover from.
2. **Extra pull/back volume** — if pulling progress or back thickness is a priority, a second dedicated pull session on Saturday works well.
3. **Full-body GPP/pump day** — light compounds + isolation, moderate volume. Adds total work without heavy CNS cost.

**My lean**
Without workout history showing a clear weak point yet, I'd lean toward a **Saturday accessories/weak-point day** — it adds volume with minimal recovery cost and keeps Sunday free. Once you've logged a few weeks, a specific target will become more obvious.

Worth asking yourself: are you recovering well from 5 days currently? If sleep and energy are solid, a 6th day makes sense. If you're dragging by Friday, more rest may beat more training.

**Confidence: Low** — no session history yet to confirm where volume is actually low.

Want me to design that Saturday session?
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Program-level reasoning first | yes |
| Does not jump straight to workout generation | yes (critical) |
| Gives options if confidence is medium | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 7. I want to reduce to 4 days.

**Prompt:** I want to reduce to 4 days.

**Mock context:** Current 5-day PPL + Upper/Lower

- Profile: {"name":"Alex","goal":"Hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 0

#### AI response

```
Going from 5 to 4 days means dropping one session and likely restructuring the split to keep muscle frequency intact.

**Your current structure:**
Push | Pull | Legs | Upper | Lower — 5 days, each muscle hit ~1.5–2x/week.

**Reasonable options:**

1. **Upper/Lower x2** — Mon Upper / Tue Lower / Thu Upper / Fri Lower. Clean 2x frequency for everything, well-supported for hypertrophy at intermediate level.

2. **Push/Pull x2** — Mon Push / Tue Pull / Thu Push / Fri Pull. Simple, good frequency, but legs become accessory work only — not ideal if leg hypertrophy matters.

3. **PPL + Full Body** — Push / Pull / Legs / Full Body. Covers everything but the full-body day can feel congested at 5 exercises.

**I'd lean toward Upper/Lower x2.**

It preserves full leg training, keeps 2x weekly frequency for all major muscles, and fits your 60-min / 5-exercise preference cleanly. The structure is straightforward to program and well-matched to your hypertrophy goal.

Suggested days: **Mon / Tue / Thu / Fri** with Wed, Sat, Sun off.

Want me to update your schedule and build out the 4-day Upper/Lower workouts?

Confidence: Medium (no performance data yet, but structure is well-supported for your goal and experience level).
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Recommends sensible structure | yes |
| Preserves training frequency or explains tradeoff | yes |
| Can ask or offer to apply change | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 8. User says yes after coach asks to apply change

**Prompt:** Yes

**Mock context:** Current 5-day PPL + Upper/Lower

- Profile: {"name":"Alex","goal":"Hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 0
- Conversation: user: I want to reduce from 5 days to 4. \| ai: I would move you to an Upper/Lower four-day schedule (Upper/Lower/Rest/Upper/Lower/Rest/Rest). Want me to apply that schedule?

#### AI response

```
Done. New schedule applied.

**Mon: Upper | Tue: Lower | Wed: Rest | Thu: Upper | Fri: Lower | Sat: Rest | Sun: Rest**

This keeps two full upper and lower sessions per week with a mid-week rest for recovery. Want me to build out the workouts for each day?
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Resolves yes as confirmation | yes |
| Does not ask what yes means | yes (critical) |
| Mentions pending 4-day change | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 9. Why did Forma recommend this weight?

**Prompt:** Why did Forma recommend this weight for Bench Press?

**Mock context:** Bench early_add_weight engine case

- Profile: {"sex":"male","age":28,"height":"5'10\"","bodyweight":170,"experience":"Just starting out (< 6 months)","goal":"General fitness","equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 3
- Engine snapshot: early_add_weight @ 70 lb, reps 6-8, medium confidence

#### AI response

```
Here's the reasoning behind the recommendation:

**Forma's engine is suggesting 70 lbs for 6–8 reps.**

Here's why:

- **Your last 3 sessions:** 60 lbs × 10 — Jun 5, Jun 8, Jun 11
- **You hit the top of the target rep range (10 reps) three times in a row.** That's the trigger for a weight increase under double progression — build reps first, then add load once you've consistently hit the ceiling.
- **+10 lbs** is a standard early-stage calibration jump. At this point in training, the goal is finding your true working range, not grinding small increments.
- **Rep target resets to 6–8** at the new weight, giving you room to grow into it again.

**Confidence: Medium**
Only 3 logged sessions, so this is still early calibration. The increase is reasonable, not aggressive — if 70 lbs feels too heavy to hit 6 reps with good form, dropping back to 65 lbs is a valid option.

**Next check:** After your next Push session at 70 lbs, I'll have a clearer picture of where your actual working range sits.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| References engine or recommendation | yes |
| Uses history context | yes |
| Gives confidence or calibration framing | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

### 10. Bench down, OHP and incline up

**Prompt:** My bench is down but OHP and incline are up. What's wrong?

**Mock context:** Intermediate mixed pressing signals

- Profile: {"name":"Alex","goal":"Strength and hypertrophy","experience":"Intermediate","session_duration":60,"equipment":"Full commercial gym"}
- Schedule: mon:push, tue:pull, wed:legs, thu:upper, fri:lower, sat:rest, sun:rest
- Logged workouts: 4

#### AI response

```
**Observation:** Your bench has dropped from 230 lbs x 7 → 215 lbs x 5 over three sessions. Meanwhile OHP went from 110 → 120 lbs and incline from 85 → 95 lbs, both improving.

**Interpretation:** The pattern points to a bench-specific issue, not a general pressing or chest problem. If your shoulders, triceps, or pecs were the limiter, you'd expect all three lifts to stall — but OHP and incline are both climbing. That makes a broad muscle weakness unlikely here.

Most probable causes (not facts):
- **Technique or setup drift** — arch, grip width, bar path, or leg drive breaking down under load. This is the most common cause of exercise-specific regression while related lifts improve.
- **Fatigue timing** — if bench always runs first on Push day, accumulated fatigue from recent loading could hit it harder than OHP or incline later in the session. Paradoxically, the reverse is also worth checking: if you recently reordered exercises.
- **Post-PR regression** — your best estimated 1RM was around 284 lbs, your current estimate is ~251 lbs. Short-term drops after a recent peak are common and often self-correct.

**Confidence: Medium** — the pattern is clear across three sessions but the root cause is still uncertain.

**Next step:** On your next Push day, film a set at 215 lbs and check your setup — specifically bar path, elbow angle, and whether your leg drive is consistent. Don't chase load yet. Forma's engine also suggests repeating 215 lbs for 6–10 clean reps to re-establish your baseline before going heavier. If the regression continues past two more sessions, we'll dig into technique or programming adjustments.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 10/10 |
| Context use | 10/10 |
| Intent understanding | 10/10 |
| Data grounding | 10/10 |
| Recommendation quality | 10/10 |
| Uncertainty calibration | 10/10 |
| Actionability | 10/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 10/10 |

**Failed checklist items:** none

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Recognizes conflicting signals | yes |
| Does not collapse to one cause | yes (critical) |
| Gives hypotheses and next check | yes |

#### Manual review

| clear? | trustworthy? | actionable? | notes |
|:---:|:---:|:---:|---|
| | | | |

## Review guide

- **API/runtime failures** mean the proxy or network failed — not a coaching quality score.
- **Pass** requires overall ≥ 7, no critical checklist failures, and at most one non-critical failure.
- Use manual review columns for tone, nuance, and false positives in automated checks.
