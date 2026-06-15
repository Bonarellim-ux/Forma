# Calibration → Full Engine Handoff Test

Generated: 2026-06-15T01:12:37.636Z

Purpose: verify that exercises with 4 logged sessions do not regress after 1–3 session calibration logic. **No production code was modified for this report.**

Exercise: **Bench Press** (minTarget 6, maxTarget 10). Threshold: `< 4` sessions → calibration, `≥ 4` → full engine.

## Summary

**Session-4 expectation pass rate:** 5/5

| # | Scenario | Session 3 (calibration) | Session 4 (full engine) | Consistent? | Pass |
|---:|---|---|---|:---:|:-:|
| 1 | Too hard continues | ↓ 55 lb × 6-10 (reduce_or_recover) | ↓ 55 lb × 6-10 (reduce_or_recover) | ✓ | ✓ |
| 2 | Overestimated continues | ↓ 45 lb × 6-10 (reduce_or_recover) | ↓ 45 lb × 6-10 (reduce_or_recover) | ✓ | ✓ |
| 3 | Inconsistent continues | 60 lb × 6-10 (early_repeat) | 60 lb × 6-10 (hold) | ✓ | ✓ |
| 4 | Too easy continues | ↑ 70 lb × 6-8 (early_add_weight) | ↑ 70 lb × 6-10 (add_weight) | ✓ | ✓ |
| 5 | Appropriate continues | 60 lb × 9 (early_add_reps) | 60 lb × 9 (add_reps) | ✓ | ✓ |

## Guard recommendation

**No urgent `add_reps`-below-`minTarget` guard needed** based on these scenarios.

All five handoff scenarios behave consistently with calibration-phase intent.

---

## Detailed results

### Scenario 1: Too hard continues

**History (recent → older):** 60×5 → 60×4 → 60×4 → 60×4

**Expected at session 4:** Should not suddenly recommend add_reps after calibration reduced or held load.

| Sessions | Engine | Recommendation | Action | Dir |
|---:|---|---|---|---|
| 3 | calibration (starterOverloadSuggestion) | 55 lb × 6-10 | reduce_or_recover | down |
| 4 | full engine (4+ sessions) | 55 lb × 6-10 | reduce_or_recover | down |

<details>
<summary>Full session-4 recommendation detail</summary>

```
I'd recommend reducing slightly to 55 lbs and aiming for 6-10 reps.

Why:
Recent top sets stayed below the 6-10 target range at 60 lbs.
Reduce slightly to keep reps in target range.
Your estimated 1RM is trending up.
```

</details>

### Scenario 2: Overestimated continues

**History (recent → older):** 50×4 → 50×3 → 50×3 → 50×3

**Expected at session 4:** Should not suddenly recommend add_reps when still below minTarget.

| Sessions | Engine | Recommendation | Action | Dir |
|---:|---|---|---|---|
| 3 | calibration (starterOverloadSuggestion) | 45 lb × 6-10 | reduce_or_recover | down |
| 4 | full engine (4+ sessions) | 45 lb × 6-10 | reduce_or_recover | down |

<details>
<summary>Full session-4 recommendation detail</summary>

```
I'd recommend reducing slightly to 45 lbs and aiming for 6-10 reps.

Why:
Recent top sets stayed below the 6-10 target range at 50 lbs.
Reduce slightly to keep reps in target range.
Your estimated 1RM is trending up.
```

</details>

### Scenario 3: Inconsistent continues

**History (recent → older):** 60×10 → 60×5 → 60×8 → 60×7

**Expected at session 4:** Should repeat or hold — not null and not aggressive progression.

| Sessions | Engine | Recommendation | Action | Dir |
|---:|---|---|---|---|
| 3 | calibration (starterOverloadSuggestion) | 60 lb × 6-10 | early_repeat | same |
| 4 | full engine (4+ sessions) | 60 lb × 6-10 | hold | same |

**Handoff notes:**
- Action changed: early_repeat (session 3) → hold (session 4).

<details>
<summary>Full session-4 recommendation detail</summary>

```
I'd recommend repeating 60 lbs for 6-10 clean reps.

Why:
Performance has been inconsistent across recent sessions.
Repeat the current load to collect more data before progressing.
```

</details>

### Scenario 4: Too easy continues

**History (recent → older):** 60×10 → 60×10 → 60×10 → 70×8

**Expected at session 4:** Should continue sensible progression or repeat after weight increase.

| Sessions | Engine | Recommendation | Action | Dir |
|---:|---|---|---|---|
| 3 | calibration (starterOverloadSuggestion) | 70 lb × 6-8 | early_add_weight | up |
| 4 | full engine (4+ sessions) | 70 lb × 6-10 | add_weight | up |

**Handoff notes:**
- Action changed: early_add_weight (session 3) → add_weight (session 4).

<details>
<summary>Full session-4 recommendation detail</summary>

```
I'd recommend returning to 70 lbs and aiming for 6-10 reps.

Why:
You have already performed that higher working weight successfully.
Since it is working, I would not move the target lower unless performance clearly declines.
```

</details>

### Scenario 5: Appropriate continues

**History (recent → older):** 60×8 → 60×8 → 60×7 → 60×8

**Expected at session 4:** Should recommend small rep progression or repeat.

| Sessions | Engine | Recommendation | Action | Dir |
|---:|---|---|---|---|
| 3 | calibration (starterOverloadSuggestion) | 60 lb × 9 | early_add_reps | same |
| 4 | full engine (4+ sessions) | 60 lb × 9 | add_reps | same |

**Handoff notes:**
- Action changed: early_add_reps (session 3) → add_reps (session 4).

<details>
<summary>Full session-4 recommendation detail</summary>

```
I'd recommend keeping 60 lbs and aiming for 9 reps.

Why:
You've moved from 7 to 8 reps over your recent sessions.
You are still below the top of the target range, so the next progression is another rep.
Your estimated 1RM has stayed about the same.
```

</details>
