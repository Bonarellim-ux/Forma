# Forma Coaching QA Tester

Generated: 2026-06-22T00:41:43.719Z

Purpose: test whether Forma feels like a real coach across common user questions — beyond deterministic exercise recommendations.

Mode: **live AI via production proxy**

## Summary

- Scenarios: 10
- Coaching pass: 9/9
- Coaching fail: 0
- API/runtime failures: 1 (separate from coaching quality)

### Top failure patterns

| Pattern | Count |
|---|---:|
| no_actionable_next_step | 1 |

### API/runtime failures (not coaching failures)

- **Should I add another training day?**: API HTTP 529: {"type":"error","error":{"type":"overloaded_error","message":"Overloaded"},"request_id":"req_011CcHNJ5BD5fRV95TouboXG"}

| # | Scenario | Pass | Overall | Failed checks | Patterns | API |
|---:|---|:---:|:---:|:---:|---|:---:|
| 1 | What should I do next workout? | yes | 10 | 0 | — | no |
| 2 | Why did my squat go down? | yes | 8 | 1 | no_actionable_next_step | no |
| 3 | Should I deload? | yes | 10 | 0 | — | no |
| 4 | What is my biggest weakness? (low-data beginner) | yes | 10 | 0 | — | no |
| 5 | What is my biggest weakness? (intermediate mixed data) | yes | 9 | 1 | — | no |
| 6 | Should I add another training day? | API error | — | — | — | yes |
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
Tomorrow is **Monday — Push day**. Here's your session:

**1. Bench Press**
225 lbs — aim for 7 reps
Last time: 225 × 6. Same weight, one more rep before moving up.

**2. Overhead Press**
115 lbs — aim for 3–7 clean reps
Last time: 115 × 8. Repeat this weight once more before increasing.

**3. Incline Dumbbell Press**
90 lbs — aim for 5–9 clean reps
Last time: 90 × 9. Repeat before moving up.

**4. Tricep Pushdown**
37.5 lbs — aim for 10–15 reps
First logged session — calibration load.

**5. Lateral Raise**
15 lbs — aim for 12–20 reps
First logged session — calibration load.

---

**One thing to watch:** Bench has dipped two sessions in a row while OHP is climbing. Nothing to change yet, but pay attention to how your setup and bar path feel tomorrow. Confidence: Low (early data, only 2 sessions each).
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
- May 29: 280 lbs × 5
- Jun 8: 275 lbs × 4
- Estimated 1RM dropped ~7 lbs over two sessions

**Interpretation:**
With only 2 logged sessions, this is too early to call a trend. A single-session dip of this size is common and can reflect any of these:

- **Normal variation** — day-to-day fluctuations in strength are typical, especially on a heavy compound
- **Fatigue timing** — your squat falls on Wednesday after Monday push work; accumulated fatigue may be affecting output
- **Technique or setup** — bar position, depth, or bracing inconsistencies can drop reps without the weight changing
- **Recovery factors** — sleep, nutrition, or stress in the days before Jun 8

**What the broader data says:**
Your Leg Press improved and Romanian Deadlift improved on the same Jun 8 session, so it's unlikely you were globally fatigued across the board. That makes squat-specific factors — technique, setup, or normal variance — more plausible than a systemic issue.

**Confidence: Low** — two data points, mixed signals, no clear root cause yet.

**Next step:**
Forma has you at 275 lbs × 5 on your next Legs day. Hit that cleanly and we'll have a third data point to actually evaluate. If it drops again with good execution, that's worth digging into further.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 8/10 |
| Context use | 8/10 |
| Intent understanding | 8/10 |
| Data grounding | 8/10 |
| Recommendation quality | 8/10 |
| Uncertainty calibration | 8/10 |
| Actionability | 5/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 8/10 |

**Failed checklist items:** Gives monitoring or action step

**Failure patterns:** no_actionable_next_step

| Checklist item | Pass |
|---|---|
| Separates observation from interpretation | yes |
| Does not blame sleep unless provided | yes (critical) |
| Mentions mixed or non-squat signals | yes |
| Gives monitoring or action step | no |

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
**Observation:**
Your last two leg sessions show declining numbers — Back Squat dropped from 280×6 to 275×5, and Leg Press from 330×12 to 325×11. Both squat-pattern movements are moving in the same direction across multiple sessions.

**Interpretation:**
This *may* signal accumulated fatigue, but it's still a possible trend, not a confirmed one. Pull work (Deadlift, Row) looks stable, and push data is limited to one session. The decline is concentrated in lower-body compounds specifically.

**Confidence: Medium** — two signals pointing the same way, but only 3 leg sessions logged and no readiness, sleep, or stress data to confirm recovery is the root cause.

---

**My take:**

A full deload isn't clearly warranted yet. I'd lean toward a lighter step first:

1. **Next leg day (Wed) — reduced intensity**: drop squat and leg press by ~10%, focus on form and feel. If you bounce back, it was likely short-term fatigue.
2. **If decline continues another session** — then a proper deload week (40–50% load reduction across all sessions) makes more sense.

A preemptive full deload on 2 data points risks interrupting progress that might just need one good recovery week naturally.

**How has sleep and stress been lately?** That would sharpen this call significantly.
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
Honest answer: I don't have enough data yet to call anything a real weakness.

**What I can see:**
- 2 sessions total — Jun 3 Lower, Jun 7 Upper
- Both sessions logged cleanly with reasonable beginner numbers across the board

**Observation:**
Nothing stands out as dramatically off relative to your other lifts. Your squat (115×8), bench (95×8), and pulls (85×10) are proportional for someone early in training.

**Why I won't name a "biggest weakness" yet:**
One session per split is a snapshot, not a pattern. A weakness requires 2–3 sessions of the same movement lagging, or a muscle group clearly falling behind others. Neither is visible yet.

**What to watch over the next 4–6 weeks:**
- Are your **pushing** and **pulling** lifts progressing at a similar rate?
- Is your **squat** keeping pace with your **leg press**? A big gap there can hint at technique or quad/posterior chain imbalance.
- Any movement that *feels* consistently harder than the others is worth flagging.

**Confidence: Low** — not enough history to make a real call.

Keep logging consistently and I'll have a real answer for you in 3–4 more sessions per split. Want me to flag anything specific to watch next session?
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
**Observation:** Your push session is actually a mixed picture — not a uniform weakness. Two exercises are improving while one is declining:

- Bench Press: down from 230×7 → 215×5 (e1RM -33 lbs)
- Incline DB Press: up from 85×9 → 95×10 (e1RM +15 lbs)
- Overhead Press: up from 110×8 → 120×8 (e1RM +13 lbs)

**Interpretation:** The issue appears to be **Bench Press specifically**, not a chest or triceps weakness overall — because those muscles are progressing just fine on incline and OHP. That points toward something exercise-specific: technique, setup, bar path, or how it falls in your session.

It may not be a true weakness so much as a **Bench Press-specific regression** worth investigating.

**Other possibilities:**
- Bar path or setup inconsistency
- Bench placed early in Push when fatigue is lower — but something still off
- A recent PR (estimated ~284 lbs) followed by a pullback is common; short-term regression after a peak

**Confidence:** Medium — only 3 logged Push sessions, but the pattern across all three is consistent.

**Next step:** Before changing programming, I'd want to know — has anything changed about your bench setup, grip, or how it feels lately? That'll tell us if this is technical or just normal post-PR fluctuation.
```

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | pass |
| Overall | 9/10 |
| Context use | 9/10 |
| Intent understanding | 9/10 |
| Data grounding | 9/10 |
| Recommendation quality | 9/10 |
| Uncertainty calibration | 9/10 |
| Actionability | 9/10 |
| No fabrication | 10/10 |
| Conversation naturalness | 9/10 |

**Failed checklist items:** Confidence medium or lower

**Failure patterns:** none

| Checklist item | Pass |
|---|---|
| Identifies likely pattern or area | yes |
| Confidence medium or lower | no |
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

_API/runtime error:_ API HTTP 529: {"type":"error","error":{"type":"overloaded_error","message":"Overloaded"},"request_id":"req_011CcHNJ5BD5fRV95TouboXG"}

#### Evaluation

| Field | Value |
|---|---|
| Pass/fail | API error |

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
Going from 5 to 4 days, here are the reasonable structural paths:

**Option 1 — Upper/Lower x2**
Mon: Upper | Tue: Lower | Thu: Upper | Fri: Lower
2x frequency per muscle group, strong hypertrophy evidence for intermediates.

**Option 2 — Push/Pull/Legs + Full Body**
Mon: Push | Tue: Pull | Thu: Legs | Fri: Full Body
Keeps the PPL feel, adds a full-body catch-all day.

**Option 3 — Drop one current day, keep 4**
Remove Thu Upper (most overlap with Push/Pull). Leaves Push/Pull/Legs/Lower but lower body hits twice while upper hits less evenly.

---

**I'd lean toward Option 1 (Upper/Lower x2).**

Reasons:
- Best muscle frequency balance for hypertrophy at intermediate level
- Clean structure — each muscle trained twice weekly with adequate recovery
- Easiest to manage volume per session within your 60-min / 5-exercise preference

Confidence: Medium (no session history yet to confirm weak points or frequency needs)

---

Want me to update your schedule to Upper/Lower x2 and build out the four sessions?
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
Done. Your new schedule is set.

— Mon: Upper
— Tue: Lower
— Wed: Rest
— Thu: Upper
— Fri: Lower
— Sat: Rest
— Sun: Rest

Each Upper day hits chest, back, shoulders, and arms. Each Lower day hits quads, hamstrings, glutes, and calves. Want me to build out the actual workouts for each session?
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
Forma's recommendation engine is suggesting **70 lbs for 6-8 reps** for your next Bench Press. Here's the reasoning:

**Observation:** You've hit 60 lbs × 10 for three straight sessions (Jun 5, Jun 8, Jun 11) — that's consistent performance at the top of the 6-10 rep target range.

**Why 70 lbs:** Double progression logic — once you repeatedly hit the top of your rep range with stable performance, the next step is to add weight and reset reps slightly lower. Three sessions at the same weight and reps is enough to justify a load increase.

**Why only 10 lbs:** You're in an early calibration phase with just 3 logged sessions. The goal right now is finding your working range, not pushing load aggressively. It's a conservative step to test how you respond to added weight.

**Confidence: Medium** — The progression signal is clear, but 3 sessions is still a short window. If 70 lbs feels too heavy to hit 6 clean reps, drop back to 65 lbs and build from there.

Want to log today or have questions about the target rep range?
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
**Observation:**
Your bench has dropped from 230×7 → 220×6 → 215×5 over three sessions (~33 lbs e1RM). Meanwhile OHP went from 110×8 → 120×8 (+13 lbs e1RM) and incline went from 85×9 → 95×10 (+15 lbs e1RM).

**Interpretation:**
This pattern matters — your shoulders, triceps, and upper chest are clearly working. The issue appears to be bench-specific, not a push muscle breakdown. A few possibilities:

- **Setup or technique drift** — flat bench has a more precise arch, leg drive, and scapular setup than OHP or incline. Small form changes compound quickly.
- **Position-specific weakness** — flat bench loads the pec at a longer muscle length and demands more shoulder stability at the bottom. If your anterior shoulder or lower pec is a limiting factor, OHP and incline can still progress around it.
- **Normal post-PR regression** — your e1RM peak was ~284 lbs. A short dip after a PR push is common before consolidating.

**Confidence: Medium** — only 3 sessions logged, so this isn't a crisis yet, but the pattern is real.

**Next step:**
On your next Push day, treat bench as a technique reset. Keep it at 215 lbs, focus on setup — tight scapulae, leg drive, controlled descent — and aim for 6 clean reps. One more session will tell us a lot more.

Want me to cue the specific setup points to check?
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
