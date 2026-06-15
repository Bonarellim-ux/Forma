# Forma Coaching QA Tester

Generated: 2026-06-15T02:53:59.447Z

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
Tomorrow is your **Monday Push** session. Here's what to hit:

**Bench Press** — 225 lbs x 7 reps
Last session you got 6 at 225. Same weight, chase one more rep before moving up.

**Overhead Press** — 115 lbs x 9 reps
Hit 8 last time. Same weight, add a rep.

**Incline Dumbbell Press** — 90 lbs x 10 reps
Got 9 last session. Same weight, add a rep.

**Tricep Pushdown** — 37.5 lbs x 10–15 reps
First logged session — treat this as a calibration set. Hit clean reps and we'll dial in from there.

**Lateral Raise** — 15 lbs x 12–20 reps
Same deal — first session, find your clean working range.

---

**One thing to watch:** Bench has dipped from 8 to 6 reps at 225 over the last two sessions while your OHP is climbing. Too early to call it a trend, but worth noting. Focus on setup and control today — no need to force weight jumps yet.

Confidence: Medium (early calibration phase across most lifts — 2 sessions or fewer on each).

Want a warm-up plan or any adjustments before you go in?
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
- May 29: 280 lbs x 5
- Jun 8: 275 lbs x 4
- That's a small drop in both load and reps across 2 sessions.

**Interpretation:**
With only 2 data points, this isn't a trend yet — it's worth monitoring. A few possible contributors:

- **Normal session-to-session variation** — single-session dips are common and often mean nothing
- **Fatigue or recovery** — how you slept, ate, or how hard the previous days hit you can shift squat performance noticeably
- **Technique or setup drift** — squats are skill-dependent; small form changes (bar position, depth, bracing) can affect output
- **Leg Press is improving** — your quad work isn't collapsing overall, which suggests this may be squat-specific rather than a general leg strength issue

**Confidence: Low** — two sessions isn't enough to name a real cause.

**Next step:**
Stick with the plan. Forma's engine has you at **275 lbs, targeting 5–10 clean reps** next Legs day. If you hit 5+ with solid form, you're back on track. If it drops again, that's when we dig deeper.

Anything feel off last session — sleep, soreness going in, form issues?
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
**Observation:** Two of your main compounds dropped over the past few sessions:
- Back Squat: 280 × 6 → 275 × 5 (–13 lbs e1RM)
- Leg Press: 330 × 12 → 325 × 11 (–20 lbs e1RM)

Pull work (Deadlift, Cable Row) is holding steady, and you're still in an early calibration phase overall — only 3 leg sessions logged.

**Interpretation:** The squat-pattern decline *may* reflect accumulated fatigue, but it could also be normal session-to-session variation. Two sessions of minor drops isn't a confirmed trend yet — it's a possible signal, not a clear deload trigger.

**Confidence: Medium** (converging signals, but limited history)

**My take:** A full deload isn't clearly justified yet. A few questions worth honestly answering first:
- Sleep and stress been off lately?
- Are you feeling beat up in sessions, or just the numbers dipped?
- Any sessions at lower effort or after a rough night?

If you feel genuinely run down — heavy legs, motivation low, joints achy — a deload week makes sense and costs little. If it's just two off sessions and you feel fine, I'd run this week's plan normally and monitor. The hinge work (RDL) is still holding, which suggests it's not full-system fatigue.

**Next step:** How are you actually feeling physically going into this week?
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
Honest answer: I don't have enough data to identify a real weakness yet.

**Observation:** I have 2 sessions on record — one upper, one lower. That's a starting point, not a trend.

**What I can see:**
- Upper: Bench 95×8, Lat Pulldown 85×10, DB Shoulder Press 30×10
- Lower: Squat 115×8, RDL 95×10, Leg Press 160×10

Numbers look reasonable for a beginner. Nothing is clearly lagging relative to anything else at this stage.

**Confidence: Low** — one session per split is not enough to spot a weakness. A weakness requires multiple sessions, ideally 3+, showing a pattern across related exercises.

**Next step:** Train consistently for 3–4 more weeks. After that, I can compare upper vs. lower progress, pushing vs. pulling strength, and flag anything that's falling behind. That's when a real answer becomes possible.

Check back after a few more logged sessions and I'll give you something meaningful.
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
**Observation:** Your bench press has dropped from 230×7 to 215×5 over three sessions, while your overhead press (+13 lbs e1RM) and incline dumbbell press (+15 lbs e1RM) are both moving in the right direction. Horizontal pressing is the one pattern declining while other pressing angles improve.

**Interpretation:** This looks exercise-specific rather than a chest or triceps weakness — your incline press and OHP are progressing, which means the muscles are working. The issue is more likely tied to bench-specific setup, technique, or pacing (e.g., coming off a near-PR and dropping too fast, bar path, arch stability, or touch point).

**Other possibilities:**
- Bench may be placed early in your push session when fatigue or warm-up quality matters most
- You may have pushed a heavy attempt recently and are in a short regression window
- Your best e1RM was ~284 lbs; current is ~251 — a meaningful drop worth addressing, not just noise

**Confidence: Medium** — only 3 logged push sessions, so this is a possible trend, not a confirmed weakness. The other pressing improvements prevent me from calling it a muscle-group problem yet.

**Next step:** On Monday's push session, keep bench at 215 lbs and focus on hitting 6–8 clean reps with solid setup before chasing weight. If it stays flat or drops over the next 2 sessions, we dig deeper into setup or programming position.
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
Your current split — Push, Pull, Legs, Upper, Lower — is already a solid 5-day hypertrophy structure with built-in variety and two rest days. Before recommending a specific sixth day, here's what makes sense structurally:

**Current structure:**
- 5 training days, 2 full rest days (Sat/Sun)
- Good push/pull/legs balance with upper and lower overlap
- No obvious gap without knowing your weekly set counts per muscle

**Reasonable options for a 6th day:**

1. **Arms/Accessories day** — if direct bicep/tricep volume feels light after your push and pull days
2. **Weak-point isolation day** — if one muscle group is clearly lagging (e.g., rear delts, calves, abs)
3. **Low-intensity full-body pump session** — extra volume without heavy CNS demand, works well on Saturday

**My lean:** A low-fatigue Saturday accessories/weak-point day is the safest add. It fills your one open day, adds volume without stacking heavy load next to rest, and keeps Sunday fully clear.

That said, I'd ask: do you feel like you're leaving gains on the table right now, or is recovery feeling good? If recovery is solid and you want more volume, a 6th day makes sense. If you're fatigued, more volume may not be the answer yet.

Confidence: Low — no workout history yet to identify a clear gap. Once you log a few weeks, I can give a much sharper recommendation.

Want me to design a Saturday session around a specific target?
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
Good time to simplify. Your current 5-day split is Push / Pull / Legs / Upper / Lower. Dropping to 4 days means consolidating or restructuring without losing too much weekly volume.

**Reasonable options:**

1. **Upper / Lower × 2** — Mon/Tue/Thu/Fri. High frequency per muscle, great for hypertrophy, easy to manage fatigue. Most evidence-backed 4-day structure for your goal.

2. **Push / Pull / Legs / Upper** — Drop the Lower day, absorb lower-body volume into Legs and add a second upper day. Works if upper body is the priority.

3. **Push / Pull / Legs / Full Body** — Keep PPL intact, add a full-body day hitting weak points or low-fatigue accessories. More flexible but harder to program consistently.

**I'd lean toward Upper / Lower × 2.** It gives every muscle group twice-weekly frequency, fits your hypertrophy goal well, and maps cleanly onto your preference for 60-min / 5-exercise sessions. Schedule would look like:

- Mon: Upper A
- Tue: Lower A
- Wed: Rest
- Thu: Upper B
- Fri: Lower B
- Sat/Sun: Rest

**Confidence: Medium** — solid structural fit for your goal, but I don't have session history yet to confirm which current days or volume you'd want to preserve.

Want me to build out the 4-day schedule and workouts?
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
Done. Here's your new schedule:

- **Mon:** Upper
- **Tue:** Lower
- **Wed:** Rest
- **Thu:** Upper
- **Fri:** Lower
- **Sat:** Rest
- **Sun:** Rest

Each Upper day hits chest, back, shoulders, and arms. Each Lower day hits quads, hamstrings, glutes, and calves. You still get two hits per muscle group per week, which keeps frequency solid for hypertrophy.

Want me to build out the exercises for each day?
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
**Forma's engine is suggesting 70 lbs for 6–8 reps.** Here's why:

**Observation:** You've hit 60 lbs × 10 in three straight sessions — Jun 5, Jun 8, and Jun 11. That's the top of the 6–10 rep target range, held consistently.

**Logic:** Double progression: once you repeatedly hit the top of your rep range, the next step is to add weight and reset reps. Three sessions at the ceiling is enough to justify a small load increase.

**Why 10 lbs?** You're in early calibration — only 3 logged sessions. The goal right now is to find your working range, not grind near your max. A 10 lb jump moves you into a heavier stimulus while keeping the movement safe and technically sound.

**Why 6–8 reps?** Stepping up 10 lbs means you'll likely drop a few reps. That's expected and intentional. From there, you build back up to 10 before increasing again.

**Confidence: Medium** — solid logic, but 3 sessions is still early. If 70 lbs feels like too big a jump, 65 lbs for 8–10 reps is a reasonable conservative alternative.

Want to log today's set or adjust the target?
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
Your last 3 Push sessions show bench dropping from 230×7 → 220×6 → 215×5, while OHP went 110×8 → 115×8 → 120×8 and incline went 85×9 → 90×10 → 95×10.

**Interpretation:**
The pattern is specific to the flat bench — your shoulders, triceps, and chest are clearly working fine across the other pressing movements. That makes a systemic strength or muscle issue unlikely. The more probable culprits:

- **Technique/setup on flat bench** — arch, leg drive, grip width, or bar path. Small breakdowns here hit flat bench harder than OHP or incline.
- **Fatigue at that specific moment in the session** — if bench always goes first and you've been pushing it harder, accumulated fatigue may be masking fitness.
- **Post-PR regression** — your e1RM recently peaked around 284 lbs and has since dropped ~33 lbs. Short dips after a PR effort are common before restabilizing.

**Confidence: Medium** — only 3 logged sessions, so this is a possible trend, not a confirmed one.

**Next step:**
Don't change anything yet. On your next Push day, treat bench as a technique check — 215 lbs, controlled descent, full leg drive, and aim for 6–7 clean reps. If it's still dropping in 2 more sessions, we dig deeper into setup or session order.
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
