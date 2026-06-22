# AI / Recommendation Consistency Tester

Generated: 2026-06-22T00:38:28.216Z

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
Forma's recommendation engine is suggesting **60 lbs as a calibration load** for 5–10 clean reps on Bench Press — not as a strength prediction, but as a conservative starting point. Since you have no logged working sets yet, the engine is using your bodyweight, training experience (beginner, under 6 months), height/build context, and general population baselines to set a safe first-session load. The goal is to get you a real data point, not to guess your max. After you log your first set, Forma will immediately adjust based on your actual performance. Confidence is currently Low by design — that's expected at baseline before any working sets exist.
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
| reasoningOverlap | 51% |
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
| Engine signal line | Bench Press: trying 70 lbs for 6-8 reps. Medium confidence. Engine state: early_progression. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 10; Jun 12: 60 lbs x 10. You reached the top of the 6-10 target range at 60 lbs with stable performance. The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 10; Jun 12: 60 lbs x 10. You reached the top of the 6-10 target range at 60 lbs with stable performance. The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting **70 lbs for 6–8 reps** on Bench Press. Here's the reasoning behind it:

- **You've hit 60 lbs × 10 three sessions in a row** (Jun 12, 15, 18) — that's the top of the 6–10 target rep range, held consistently.
- Under double progression, once you repeatedly hit the top of the rep range at a given weight, the next step is a weight increase and a rep reset.
- The engine applied a **10 lb jump** as an early calibration step — not because the trend is fully confirmed, but because you're in an early phase where finding your true working range is the priority.
- The target drops to 6–8 reps to account for the added load and give you room to build back up.

**Confidence: Medium** — only 3 sessions logged, so this is a calibration move, not a locked-in progression. If 70 lbs feels too heavy to hit 6 reps with good form, drop back to 65 lbs and build from there.
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
| reasoningOverlap | 29% |
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
| Engine signal line | Bench Press: reducing slightly to 55 lbs and aiming for 6-10 reps. Medium confidence. Engine state: early_guidance. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 5; Jun 15: 60 lbs x 4; Jun 12: 60 lbs x 4. Recent top sets stayed below the 6-10 target range at 60 lbs. Reduce slightly to keep reps in target range. The goal is to rebuild clean reps before progressing. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 5; Jun 15: 60 lbs x 4; Jun 12: 60 lbs x 4. Recent top sets stayed below the 6-10 target range at 60 lbs. Reduce slightly to keep reps in target range. The goal is to rebuild clean reps before progressing. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is suggesting you drop slightly to **55 lbs** and aim for **6–10 reps** on Bench Press. Here's the reasoning behind it:

- **You're in early calibration** — only 3 logged sessions exist, so the engine isn't trying to maximize load yet; it's trying to find your clean working range.
- **Your top sets have stayed below the 6–10 rep target** — you hit 60 lbs x 4, 4, and 5 across those sessions, which keeps you in the lower end of a beginner rep range.
- **A small load reduction is the fix** — dropping to 55 lbs should let you hit 6–10 clean reps consistently, which is the foundation before any weight increase.
- **Confidence is Medium** — three sessions is a start, but not enough to be fully decisive; once you're consistently hitting the top of that rep range at 55 lbs, the engine will flag a weight increase.

The goal right now is clean reps in range, not heavier singles.
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
| Engine signal line | Bench Press: repeating 60 lbs for 6-10 clean reps. Medium confidence. Engine state: early_guidance. Evidence: Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 5; Jun 12: 60 lbs x 8. Your recent reps at this weight have varied quite a bit (8 → 5 → 10). Repeat this load to confirm baseline before increasing weight or reps. |
| Why | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 5; Jun 12: 60 lbs x 8. Your recent reps at this weight have varied quite a bit (8 → 5 → 10). Repeat this load to confirm baseline before increasing weight or reps. |

#### 2. AI question

```
Why did Forma recommend this for Bench Press?
```

#### 3. AI response

```
Forma's recommendation engine is currently suggesting you **repeat 60 lbs for 6–10 clean reps** on Bench Press. Here's why:

- **Only 3 sessions logged** — that's not enough data to confidently establish your baseline, so the engine is in an early calibration phase rather than pushing you to increase load.
- **Your rep counts have varied a lot** across those sessions: 8 → 5 → 10. That kind of inconsistency signals the baseline isn't stable yet.
- **The goal right now is confirmation, not progression** — repeating the same load one more time lets the engine verify where your true working range sits before recommending a weight increase.

Confidence: Medium — once you hit 60 lbs for a consistent 10 reps across 2 sessions, the engine will have enough signal to recommend moving up.
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
| reasoningOverlap | 31% |
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
Forma's recommendation engine is currently suggesting you **repeat 135 lbs** and aim to rebuild your rep range back to 6–10 clean reps before adding weight.

Here's why:

- **Your reps have dropped across 5 consecutive sessions** at the same weight: 135 lbs × 10 → 8 → 7 → 6 → 5. That's a clear downward trend, not random variation.
- **The engine flagged a plateau/regression state**, meaning you haven't consolidated strength at this load yet — progressing the weight now would likely make it worse.
- **The logic is double progression**: rebuild reps first (back to 6–10), then earn the weight increase. Jumping to 140 lbs before stabilizing at 135 lbs would likely stall you further.
- The engine's goal is to set you up for a clean, confident increase rather than forcing progress prematurely.

**Confidence: High** — five sessions of consecutive rep decline at the same load is a strong, clear signal.

Once you hit 135 lbs × 10 cleanly for 1–2 sessions, that's your green light to move to 140 lbs.
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
| reasoningOverlap | 12% |
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
Forma's recommendation engine suggested **15 lbs per hand** for DB Shoulder Press as a calibration load, not a strength prediction. Since you have no prior working sets logged yet, the engine defaulted to a conservative starting point based on your training experience (under 6 months) and general beginner context. The goal is to hit **8–12 clean reps** with good form on your first session, then Forma will adjust from your actual performance. The engine's confidence is **Low** for exactly this reason — one logged set changes everything and gives real data to work from.
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
| reasoningOverlap | 45% |
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
Forma's recommendation engine suggested **15 lbs for 8–12 reps** as a conservative calibration load for Custom Strength Drill. Here's why:

- **No prior working sets exist** for this exercise, so the engine has no performance history to build from.
- With no exercise-category match strong enough to borrow a starting point from, it defaulted to a general conservative baseline rather than risk recommending too heavy a load.
- The engine is in **baseline state**, meaning 15 lbs is not a strength prediction — it's a safe starting point to collect your first real data point.
- **Confidence is Low** by design here. Once you log your first working set, Forma will recalibrate from your actual performance and future suggestions will be much more accurate.

Bottom line: no data in → conservative starting load out. Log the set and the engine will adjust from there.
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

## Review guide

- **Weight/rep/action match:** AI should describe the same next step the engine chose.
- **Reasoning overlap:** AI should reuse engine evidence (history, target range, trend) rather than generic coaching.
- **Calibration language:** baseline/early paths should mention limited history or conservative calibration.
- **No contradiction:** AI must not recommend the opposite action or a different load as Forma's recommendation.
- **No invented causes:** avoid sleep, injury, nutrition explanations unless present in profile/history.
