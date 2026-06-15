# AI / Recommendation Consistency Tester

Generated: 2026-06-15T02:41:10.066Z

Purpose: verify that when Forma's deterministic engine recommends something, the AI coach explains the same recommendation and does not invent a different one.

Mode: **live AI via production proxy**
Profile: male, 28y, 5'10", 170 lb, Just starting out (< 6 months).

## Summary

- Scenarios: 7
- Automated pass: 7/7
- AI errors: 0

_All scenarios passed automated consistency checks._

| Scenario | Exercise | Engine action | Weight | Reps | AI pass | Issues |
|---|---|---|---:|---|:---:|---|
| First-time calibration | Bench Press | baseline | 60 | 5-10 | yes | — |
| Too easy calibration | Bench Press | early_add_weight | 70 | 6-8 | yes | — |
| Too hard calibration | Bench Press | reduce_or_recover | 55 | 6-10 | yes | — |
| Inconsistent early data | Bench Press | early_repeat | 60 | 6-10 | yes | — |
| Declining established performance | Bench Press | hold | 135 | 6-10 | yes | — |
| Dumbbell per-hand | DB Shoulder Press | baseline | 15 | 8-12 | yes | — |
| Unknown/category fallback | Custom Strength Drill | baseline | 15 | 8-12 | yes | — |

---

## Detailed cases

### First-time calibration

**Exercise:** Bench Press

**Session history (recent → older):** (none)

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | baseline |
| Weight | 60 lb |
| Rep target | 5-10 |
| Confidence | low |
| Workout action | Using 60 lbs as a calibration load for 5-10 clean reps |
| Engine signal line | Bench Press: using 60 lbs as a calibration load for 5-10 clean reps. Low confidence. Engine state: baseline. Evidence: No prior working sets yet. I'm using a conservative barbell bench press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |
| Why | No prior working sets yet. I'm using a conservative barbell bench press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine suggested **60 lbs as a calibration load** for Bench Press because you have no prior working sets logged yet — so there's no actual performance data to build from. Without history, the engine falls back to a conservative starting estimate informed by general context like training experience (under 6 months) and a beginner-appropriate load range. The goal isn't to predict your strength — it's to give you a safe, manageable starting point where you can hit **5–10 clean reps** and generate real data. Once you log your first working set, Forma will immediately recalibrate from your actual performance instead of this estimate.

**Confidence: Low** — by design at this stage, which is exactly why it's treated as a calibration load, not a prescription.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 43% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Too easy calibration

**Exercise:** Bench Press

**Session history (recent → older):** 60×10 → 60×10 → 60×10

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | early_add_weight |
| Weight | 70 lb |
| Rep target | 6-8 |
| Confidence | medium |
| Workout action | Trying 70 lbs for 6-8 reps |
| Engine signal line | Bench Press: trying 70 lbs for 6-8 reps. Medium confidence. Engine state: early_progression. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 10; Jun 5: 60 lbs x 10. You reached the top of the 6-10 target range at 60 lbs with stable performance. The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 10; Jun 5: 60 lbs x 10. You reached the top of the 6-10 target range at 60 lbs with stable performance. The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting **70 lbs for 6–8 reps** on Bench Press. Here's the reasoning behind it:

- **You've hit 60 lbs × 10 three sessions in a row** (Jun 5, Jun 8, Jun 11) — that's the top of the 6–10 rep target range, held consistently.
- **Double progression rule:** once you repeatedly hit the top of your rep range at a given weight, the next step is a load increase, then resetting reps to the lower end of the range.
- **The 10 lb jump is an early calibration step**, not a confirmed long-term trend. With only 3 logged sessions, the engine is still finding your working range rather than maximizing load.
- **Confidence: Medium** — the pattern is consistent, but the short history limits certainty. If 70 lbs feels too heavy or your form breaks down, dropping to 65 lbs is a reasonable alternative.

Next check: how 70 lbs feels for 6–8 clean reps on your next Push day (Monday).
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 27% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Too hard calibration

**Exercise:** Bench Press

**Session history (recent → older):** 60×5 → 60×4 → 60×4

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | reduce_or_recover |
| Weight | 55 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Workout action | Reducing slightly to 55 lbs and aiming for 6-10 reps |
| Engine signal line | Bench Press: reducing slightly to 55 lbs and aiming for 6-10 reps. Medium confidence. Engine state: early_guidance. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 5; Jun 8: 60 lbs x 4; Jun 5: 60 lbs x 4. Recent top sets stayed below the 6-10 target range at 60 lbs. Reduce slightly to keep reps in target range. The goal is to rebuild clean reps before progressing. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 5; Jun 8: 60 lbs x 4; Jun 5: 60 lbs x 4. Recent top sets stayed below the 6-10 target range at 60 lbs. Reduce slightly to keep reps in target range. The goal is to rebuild clean reps before progressing. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting you **drop slightly to 55 lbs and aim for 6–10 reps**. Here's the reasoning behind it:

- **Early calibration phase** — you only have 3 logged sessions, so the engine isn't trying to push load yet. The priority right now is finding your working range and building clean reps.
- **Reps are below the target range** — your recent sets landed at 60 lbs × 4, 4, then 5. That's below the 6–10 rep target the engine uses for beginners building a base.
- **Small reduction to hit the range** — dropping to 55 lbs gives you a realistic path to 6–10 clean reps, which sets you up for proper double progression: build reps first, then add weight once you consistently hit the top of that range.

**Confidence: Medium** — only 3 sessions logged, so this is early guidance, not a firm long-term prescription. Once you have more sessions in the 6–10 rep range at a given weight, the engine will have stronger data to work with.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 40% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Inconsistent early data

**Exercise:** Bench Press

**Session history (recent → older):** 60×10 → 60×5 → 60×8

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | early_repeat |
| Weight | 60 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Workout action | Repeating 60 lbs for 6-10 clean reps |
| Engine signal line | Bench Press: repeating 60 lbs for 6-10 clean reps. Medium confidence. Engine state: early_guidance. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 5; Jun 5: 60 lbs x 8. Your recent reps at this weight have varied quite a bit (8 → 5 → 10). Repeat this load to confirm baseline before increasing weight or reps. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 5; Jun 5: 60 lbs x 8. Your recent reps at this weight have varied quite a bit (8 → 5 → 10). Repeat this load to confirm baseline before increasing weight or reps. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting you **repeat 60 lbs for 6–10 clean reps** on Bench Press. Here's why:

- **Only 3 sessions logged** — that's not enough to confidently set a baseline or progress load yet.
- **Your reps have varied a lot**: 8 → 5 → 10 across those three sessions. That inconsistency signals the weight isn't fully dialed in yet.
- The engine is in **early calibration mode**, meaning the priority right now is confirming your working range, not chasing heavier weight.
- Once you hit the **top of that range (10 reps) consistently**, the engine will signal a weight increase.

Confidence: Medium — based on early-stage data with limited sessions.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 37% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Declining established performance

**Exercise:** Bench Press

**Session history (recent → older):** 135×5 → 135×6 → 135×7 → 135×8 → 135×10

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | hold |
| Weight | 135 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Workout action | Repeating 135 lbs for 6-10 clean reps |
| Engine signal line | Bench Press: repeating 135 lbs for 6-10 clean reps. Medium confidence. Engine state: plateaued. Evidence: Recent performance is trending down (135 lbs x 7 -> 135 lbs x 6 -> 135 lbs x 5), so repeating 135 lbs is safer than progressing. The goal is to rebuild clean reps before increasing. |
| Why | Recent performance is trending down (135 lbs x 7 -> 135 lbs x 6 -> 135 lbs x 5), so repeating 135 lbs is safer than progressing. The goal is to rebuild clean reps before increasing. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting you **repeat 135 lbs** and aim to rebuild reps in the 6–10 range before adding weight.

**Why:** Your reps have dropped across five straight sessions at the same weight — 135 × 10 → 8 → 7 → 6 → 5. That's a clear downward rep trend, not a plateau. Because performance is moving in the wrong direction, the engine flagged the state as **plateaued/regressing** and chose to hold weight rather than progress it.

**The logic:** Double progression means you build reps first, then add weight. Right now the priority is reversing that rep decline and hitting clean, consistent reps again before bumping the load.

**Confidence: High** — five consecutive sessions of declining reps at the same weight is strong evidence to hold and rebuild rather than increase.

Once you hit the top of your rep range (around 10 clean reps) consistently, the engine will signal a weight increase.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 14% |
| reasoningMatch | partial |
| calibrationLanguage | n/a |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Dumbbell per-hand

**Exercise:** DB Shoulder Press

**Session history (recent → older):** (none)

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | baseline |
| Weight | 15 lb per hand |
| Rep target | 8-12 |
| Confidence | low |
| Workout action | Using 15 lbs per hand as a calibration load for 8-12 clean reps |
| Engine signal line | DB Shoulder Press: using 15 lbs per hand as a calibration load for 8-12 clean reps. Low confidence. Engine state: baseline. Evidence: No prior working sets yet. I'm using a conservative dumbbell press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. Load is per dumbbell/hand, not combined. After your first logged set, Forma will adjust from your actual performance. |
| Why | No prior working sets yet. I'm using a conservative dumbbell press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. Load is per dumbbell/hand, not combined. After your first logged set, Forma will adjust from your actual performance. |

#### 2. AI question

```
Why did Forma recommend this for DB Shoulder Press?
```

#### 3. AI response

```
Forma's recommendation engine suggested **15 lbs per hand** as your starting load for DB Shoulder Press because you have no prior working sets logged yet — so there's no actual performance data to build from. Instead, the engine used a conservative calibration approach, factoring in your training experience (under 6 months) and general beginner context to set a safe, manageable starting point. The goal isn't to predict your strength — it's to give you a load where you can hit **8–12 clean reps** and establish a real baseline. Once you log your first working set, Forma will adjust from your actual performance rather than the estimate. Confidence on this is **Low** by design — that's expected before any sets are recorded.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | yes |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 46% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

### Unknown/category fallback

**Exercise:** Custom Strength Drill

**Session history (recent → older):** (none)

#### 1. Deterministic engine

| Field | Value |
|---|---|
| Action | baseline |
| Weight | 15 lb |
| Rep target | 8-12 |
| Confidence | low |
| Workout action | Using 15 lbs as a calibration load for 8-12 clean reps |
| Engine signal line | Custom Strength Drill: using 15 lbs as a calibration load for 8-12 clean reps. Low confidence. Engine state: baseline. Evidence: No prior working sets yet. I'm using a conservative general starting point because there is no strong exercise-category match and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |
| Why | No prior working sets yet. I'm using a conservative general starting point because there is no strong exercise-category match and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |

#### 2. AI question

```
Why did Forma recommend this for Custom Strength Drill?
```

#### 3. AI response

```
Forma's recommendation engine suggested **15 lbs for 8–12 reps** as your starting load for Custom Strength Drill. Since you have no logged working sets for this exercise yet, the engine has no performance data to build from — so it defaulted to a conservative general calibration load rather than a strength-based prediction. There's also no strong exercise-category match in your history to pull a smarter estimate from, which is why confidence is marked **Low**. The 15 lb figure is essentially a safe starting point: once you log your first real working set, Forma will recalibrate from your actual performance and confidence will improve from there.
```

#### 4. Consistency checks

| Check | Result |
|---|---|
| enginePresent | yes |
| aiResponded | yes |
| weightMatch | yes |
| perHandMention | n/a |
| repMatch | yes |
| actionMatch | yes |
| reasoningOverlap | 44% |
| reasoningMatch | yes |
| calibrationLanguage | yes |
| noContradiction | yes |
| noInventedCauses | yes |

#### Manual review

| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |
|:---:|:---:|:---:|:---:|---|
| | | | |  |

## Review guide

- **Weight/rep/action match:** AI should describe the same next step the engine chose.
- **Reasoning overlap:** AI should reuse engine evidence (history, target range, trend) rather than generic coaching.
- **Calibration language:** baseline/early paths should mention limited history or conservative calibration.
- **No contradiction:** AI must not recommend the opposite action or a different load as Forma's recommendation.
- **No invented causes:** avoid sleep, injury, nutrition explanations unless present in profile/history.
