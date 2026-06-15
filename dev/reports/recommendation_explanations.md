# Recommendation Explanation Tester

Generated: 2026-06-15T02:32:53.633Z

Purpose: evaluate whether Forma recommendation explanations are clear, trustworthy, and understandable. Uses production `getOverloadSuggestion` and the same UI text helpers as the app (`homeRecommendationLine`, `recommendationActionText`, `recommendationWhyText`). No AI API.

Profile: male, 28y, 5'10", 170 lb, Just starting out (< 6 months).

## Automated issue summary

_No automated explanation issues flagged across the ten scenarios._

---

## Scenario overview

| # | Scenario | Exercise | Action | Home card | Workout action | Auto flags | clear? | trustworthy? | too verbose? | notes |
|---:|---|---|---|---|---|---|:---:|:---:|:---:|---|
| 1 | First-time no-history calibration | Bench Press | baseline | Start around 60 lbs | Using 60 lbs as a calibration load for 5-10 clean reps | — |  |  |  |  |
| 2 | Early calibration too easy | Bench Press | early_add_weight | Increase to 70 lbs | Trying 70 lbs for 6-8 reps | — |  |  |  |  |
| 3 | Early calibration too hard | Bench Press | reduce_or_recover | Reduce to 55 lbs | Reducing slightly to 55 lbs and aiming for 6-10 reps | — |  |  |  |  |
| 4 | Early inconsistent performance | Bench Press | early_repeat | Repeat 60 lbs | Repeating 60 lbs for 6-10 clean reps | — |  |  |  |  |
| 5 | Appropriate rep progression | Bench Press | early_add_reps | Stay at 60 lbs | Keeping 60 lbs and aiming for 9 reps | — |  |  |  |  |
| 6 | Established steady progression | Bench Press | add_weight | Increase to 140 lbs | Increasing to 140 lbs and aiming for 6-8 reps | — |  |  |  |  |
| 7 | Plateau | Bench Press | add_reps | Stay at 75 lbs | Keeping 75 lbs and aiming for 9 reps | — |  |  |  |  |
| 8 | Declining performance | Bench Press | hold | Repeat 135 lbs | Repeating 135 lbs for 6-10 clean reps | — |  |  |  |  |
| 9 | Unknown/category fallback | Custom Strength Drill | baseline | Start around 15 lbs | Using 15 lbs as a calibration load for 8-12 clean reps | — |  |  |  |  |
| 10 | Dumbbell per-hand recommendation | DB Shoulder Press | baseline | Start around 15 lbs per hand | Using 15 lbs per hand as a calibration load for 8-12 clean reps | — |  |  |  |  |

---

## Detailed scenarios

### 1. First-time no-history calibration

**Exercise:** Bench Press

**Session history (recent → older):** (none)

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** Zero logged sessions; baseline calibration load.

| Field | Value |
|---|---|
| Recommendation action | baseline |
| Direction | same |
| State | baseline |
| Weight | 60 lb |
| Rep target | 5-10 |
| Confidence | low |
| Source / load basis | exact_match / total load |
| Home card text | Start around 60 lbs |
| Home plan line | Bench Press: start around 60 lbs |
| Workout action text | Using 60 lbs as a calibration load for 5-10 clean reps |
| Why / explanation | No prior working sets yet. I'm using a conservative barbell bench press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend using 60 lbs as a calibration load for 5-10 clean reps.

Why:
No prior working sets yet.
I'm using a conservative barbell bench press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction.
After your first logged set, Forma will adjust from your actual performance.
```

</details>

### 2. Early calibration too easy

**Exercise:** Bench Press

**Session history (recent → older):** 60×10 → 60×10 → 60×10

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** Three sessions above max target at same weight.

| Field | Value |
|---|---|
| Recommendation action | early_add_weight |
| Direction | up |
| State | early_progression |
| Weight | 70 lb |
| Rep target | 6-8 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Increase to 70 lbs |
| Home plan line | Bench Press: increase to 70 lbs |
| Workout action text | Trying 70 lbs for 6-8 reps |
| Why / explanation | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 10; Jun 5: 60 lbs x 10. You reached the top of the 6-10 target range at 60 lbs with stable performance. The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend trying 70 lbs for 6-8 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 10; Jun 5: 60 lbs x 10.
You reached the top of the 6-10 target range at 60 lbs with stable performance.
The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet.
```

</details>

### 3. Early calibration too hard

**Exercise:** Bench Press

**Session history (recent → older):** 60×5 → 60×4 → 60×4

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** Reps below min target and declining.

| Field | Value |
|---|---|
| Recommendation action | reduce_or_recover |
| Direction | down |
| State | early_guidance |
| Weight | 55 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Reduce to 55 lbs |
| Home plan line | Bench Press: reduce to 55 lbs |
| Workout action text | Reducing slightly to 55 lbs and aiming for 6-10 reps |
| Why / explanation | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 5; Jun 8: 60 lbs x 4; Jun 5: 60 lbs x 4. Recent top sets stayed below the 6-10 target range at 60 lbs. Reduce slightly to keep reps in target range. The goal is to rebuild clean reps before progressing. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend reducing slightly to 55 lbs and aiming for 6-10 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 11: 60 lbs x 5; Jun 8: 60 lbs x 4; Jun 5: 60 lbs x 4.
Recent top sets stayed below the 6-10 target range at 60 lbs.
Reduce slightly to keep reps in target range.
The goal is to rebuild clean reps before progressing.
```

</details>

### 4. Early inconsistent performance

**Exercise:** Bench Press

**Session history (recent → older):** 60×10 → 60×5 → 60×8

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** High rep variance at same weight during calibration.

| Field | Value |
|---|---|
| Recommendation action | early_repeat |
| Direction | same |
| State | early_guidance |
| Weight | 60 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Repeat 60 lbs |
| Home plan line | Bench Press: repeat 60 lbs |
| Workout action text | Repeating 60 lbs for 6-10 clean reps |
| Why / explanation | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 5; Jun 5: 60 lbs x 8. Your recent reps at this weight have varied quite a bit (8 → 5 → 10). Repeat this load to confirm baseline before increasing weight or reps. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend repeating 60 lbs for 6-10 clean reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 11: 60 lbs x 10; Jun 8: 60 lbs x 5; Jun 5: 60 lbs x 8.
Your recent reps at this weight have varied quite a bit (8 → 5 → 10).
Repeat this load to confirm baseline before increasing weight or reps.
```

</details>

### 5. Appropriate rep progression

**Exercise:** Bench Press

**Session history (recent → older):** 60×8 → 60×8 → 60×7

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** In-range reps below max; should add reps before weight.

| Field | Value |
|---|---|
| Recommendation action | early_add_reps |
| Direction | same |
| State | early_guidance |
| Weight | 60 lb |
| Rep target | 9 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Stay at 60 lbs |
| Home plan line | Bench Press: aim for 9 reps |
| Workout action text | Keeping 60 lbs and aiming for 9 reps |
| Why / explanation | Early calibration phase — this is based on only 3 logged sessions. The goal is to find your working range, not maximize load yet. Recent working sets: Jun 11: 60 lbs x 8; Jun 8: 60 lbs x 8; Jun 5: 60 lbs x 7. Last time you hit 60 lbs x 8. Since that is below the top of your 6-10 target range, the next step is 9 reps at the same weight before increasing. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend keeping 60 lbs and aiming for 9 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 11: 60 lbs x 8; Jun 8: 60 lbs x 8; Jun 5: 60 lbs x 7.
Last time you hit 60 lbs x 8. Since that is below the top of your 6-10 target range, the next step is 9 reps at the same weight before increasing.
```

</details>

### 6. Established steady progression

**Exercise:** Bench Press

**Session history (recent → older):** 135×10 → 135×10 → 135×10 → 135×10 → 135×10

**Engine phase:** established (full engine)

**Scenario notes:** Four-plus sessions at top of target range; full engine weight increase.

| Field | Value |
|---|---|
| Recommendation action | add_weight |
| Direction | up |
| State | ready_to_increase |
| Weight | 140 lb |
| Rep target | 6-8 |
| Confidence | high |
| Source / load basis | — / — |
| Home card text | Increase to 140 lbs |
| Home plan line | Bench Press: increase to 140 lbs |
| Workout action text | Increasing to 140 lbs and aiming for 6-8 reps |
| Why / explanation | You've hit 135 lbs x 10 for 3 sessions: 135 lbs x 10 -> 135 lbs x 10 -> 135 lbs x 10. Performance has stayed stable at the top of the target range. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | n/a |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend increasing to 140 lbs and aiming for 6-8 reps.

Why:
You've hit 135 lbs x 10 for 3 sessions: 135 lbs x 10 -> 135 lbs x 10 -> 135 lbs x 10.
Performance has stayed stable at the top of the target range.
```

</details>

### 7. Plateau

**Exercise:** Bench Press

**Session history (recent → older):** 75×8 → 75×8 → 75×8 → 75×8 → 75×8

**Engine phase:** established (full engine)

**Scenario notes:** Same weight and reps for multiple sessions without reaching max target.

| Field | Value |
|---|---|
| Recommendation action | add_reps |
| Direction | same |
| State | plateaued |
| Weight | 75 lb |
| Rep target | 9 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Stay at 75 lbs |
| Home plan line | Bench Press: aim for 9 reps |
| Workout action text | Keeping 75 lbs and aiming for 9 reps |
| Why / explanation | You've repeated 75 lbs x 8 for 3 sessions. Because the top set has not moved yet, the next useful target is adding a rep before increasing. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | n/a |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend keeping 75 lbs and aiming for 9 reps.

Why:
You've repeated 75 lbs x 8 for 3 sessions.
Because the top set has not moved yet, the next useful target is adding a rep before increasing.
```

</details>

### 8. Declining performance

**Exercise:** Bench Press

**Session history (recent → older):** 135×5 → 135×6 → 135×7 → 135×8 → 135×10

**Engine phase:** established (full engine)

**Scenario notes:** Rep trend declining at working weight across established history.

| Field | Value |
|---|---|
| Recommendation action | hold |
| Direction | same |
| State | plateaued |
| Weight | 135 lb |
| Rep target | 6-10 |
| Confidence | medium |
| Source / load basis | — / — |
| Home card text | Repeat 135 lbs |
| Home plan line | Bench Press: repeat 135 lbs |
| Workout action text | Repeating 135 lbs for 6-10 clean reps |
| Why / explanation | Recent performance is trending down (135 lbs x 7 -> 135 lbs x 6 -> 135 lbs x 5), so repeating 135 lbs is safer than progressing. The goal is to rebuild clean reps before increasing. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | n/a |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend repeating 135 lbs for 6-10 clean reps.

Why:
Recent performance is trending down (135 lbs x 7 -> 135 lbs x 6 -> 135 lbs x 5), so repeating 135 lbs is safer than progressing.
The goal is to rebuild clean reps before increasing.
```

</details>

### 9. Unknown/category fallback

**Exercise:** Custom Strength Drill

**Session history (recent → older):** (none)

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** No history and no exact exercise match; category or unknown fallback.

| Field | Value |
|---|---|
| Recommendation action | baseline |
| Direction | same |
| State | baseline |
| Weight | 15 lb |
| Rep target | 8-12 |
| Confidence | low |
| Source / load basis | unknown_fallback / total load |
| Home card text | Start around 15 lbs |
| Home plan line | Custom Strength Drill: start around 15 lbs |
| Workout action text | Using 15 lbs as a calibration load for 8-12 clean reps |
| Why / explanation | No prior working sets yet. I'm using a conservative general starting point because there is no strong exercise-category match and treating this as a calibration load, not a strength prediction. After your first logged set, Forma will adjust from your actual performance. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend using 15 lbs as a calibration load for 8-12 clean reps.

Why:
No prior working sets yet.
I'm using a conservative general starting point because there is no strong exercise-category match and treating this as a calibration load, not a strength prediction.
After your first logged set, Forma will adjust from your actual performance.
```

</details>

### 10. Dumbbell per-hand recommendation

**Exercise:** DB Shoulder Press

**Session history (recent → older):** (none)

**Engine phase:** calibration (starterOverloadSuggestion)

**Scenario notes:** First-time dumbbell exercise; load basis should be per hand.

| Field | Value |
|---|---|
| Recommendation action | baseline |
| Direction | same |
| State | baseline |
| Weight | 15 lb |
| Rep target | 8-12 |
| Confidence | low |
| Source / load basis | exact_match / per hand |
| Home card text | Start around 15 lbs per hand |
| Home plan line | DB Shoulder Press: start around 15 lbs per hand |
| Workout action text | Using 15 lbs per hand as a calibration load for 8-12 clean reps |
| Why / explanation | No prior working sets yet. I'm using a conservative dumbbell press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction. Load is per dumbbell/hand, not combined. After your first logged set, Forma will adjust from your actual performance. |

#### Explanation checks

| Check | Result |
|---|---|
| Data observation | yes |
| Interpretation | yes |
| Action rationale | yes |
| Uncertainty / calibration language (when needed) | yes |
| No contradiction | yes |
| No overclaiming | yes |

#### Manual review

| clear? | trustworthy? | too verbose? | notes |
|:---:|:---:|:---:|---|
| | | |  |

<details>
<summary>Full recommendation detail</summary>

```
I'd recommend using 15 lbs per hand as a calibration load for 8-12 clean reps.

Why:
No prior working sets yet.
I'm using a conservative dumbbell press starting point informed by bodyweight, training experience, height/build context and treating this as a calibration load, not a strength prediction.
Load is per dumbbell/hand, not combined.
After your first logged set, Forma will adjust from your actual performance.
```

</details>

## Review guide

- **Data observation:** cites logged sets, reps, weights, or recent session pattern.
- **Interpretation:** explains what the data means (in/out of range, stable, inconsistent, declining).
- **Action rationale:** ties the recommended next step to the interpretation.
- **Uncertainty language:** baseline and early calibration should say conservative / limited history / not a strength prediction.
- **No contradiction:** action line, home card, and why text should agree on hold vs progress vs reduce.
- **No overclaiming:** avoid definite progression claims when confidence is low or history is short.
