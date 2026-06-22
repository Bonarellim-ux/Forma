# Calibration Recommendation Tester

Generated: 2026-06-22T00:37:09.851Z

Purpose: stress-test Forma recommendations during the **calibration phase** (1–3 logged sessions). Uses production `getOverloadSuggestion` / `starterOverloadSuggestion`.

Exercise: **Bench Press** (upper compound; minTarget 6, maxTarget 10, jump 5 lb).
Profile: male, 28y, 5'10", 170 lb, Just starting out (< 6 months).

## Weakness analysis

Calibration path: `getOverloadSuggestion` routes to `starterOverloadSuggestion` when `sessions.length < 4` (i.e. **1–3 sessions**). At **4+ sessions**, the established full engine runs unchanged.

### Scenario pass rate (3 sessions)

| Scenario | Pass | Recommendation | Issue |
|---|---|---|---|
| A: Too easy | ✓ | ↑ 70 lb × 6-8 (early_add_weight) | — |
| B: Appropriate | ✓ | 60 lb × 9 (early_add_reps) | — |
| C: Too hard | ✓ | 55 lb × 6-10 (reduce_or_recover) | — |
| D: Very inconsistent | ✓ | 60 lb × 6-10 (early_repeat) | — |
| E: Strong beginner | ✓ | ↑ 105 lb × 6-8 (early_add_weight) | — |
| F: Overestimated novice | ✓ | 45 lb × 6-10 (reduce_or_recover) | — |

### Calibration vs established engine (3 sessions → 4 sessions)

| Scenario | At 3 sessions | At 4 sessions (same history + duplicate) | Divergence |
|---|---|---|---|
| A | 70 lb, early_add_weight (up) | 65 lb, add_weight (up) | Different engine path / outcome |
| B | 60 lb, early_add_reps (same) | 60 lb, add_reps (same) | Different engine path / outcome |
| C | 55 lb, reduce_or_recover (down) | 55 lb, reduce_or_recover (down) | Same outcome |
| D | 60 lb, early_repeat (same) | 60 lb, hold (same) | Different engine path / outcome |
| E | 105 lb, early_add_weight (up) | 100 lb, add_weight (up) | Different engine path / outcome |
| F | 45 lb, reduce_or_recover (down) | 45 lb, reduce_or_recover (down) | Same outcome |

### Identified weaknesses in current calibration logic

- _All six calibration scenarios pass at 3 sessions with current heuristics._

### Failure count by session count

- **1 session(s):** 0/6 scenarios failed expectations
- **2 session(s):** 0/6 scenarios failed expectations
- **3 session(s):** 0/6 scenarios failed expectations

**Total expectation failures:** 0/18

---

## Detailed results

### Scenario A: Too easy

**Expected:** Increase more aggressively when reps exceed target range at stable weight.

**Known risk flags:** May only add one standard jump (+5 lb) despite 3 sessions well above maxTarget

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 60×10 | calibration (starterOverloadSuggestion) | same | early_repeat | 60 lb | 6-10 | ✓ | — |
| 2 | 60×10 → 60×10 | calibration (starterOverloadSuggestion) | up | early_add_weight | 65 lb | 6-8 | ✓ | — |
| 3 | 60×10 → 60×10 → 60×10 | calibration (starterOverloadSuggestion) | up | early_add_weight | 70 lb | 6-8 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend trying 70 lbs for 6-8 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 10; Jun 12: 60 lbs x 10.
You reached the top of the 6-10 target range at 60 lbs with stable performance.
The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet.
```

</details>

### Scenario B: Appropriate

**Expected:** Small progression or repeat at same weight.

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 60×8 | calibration (starterOverloadSuggestion) | same | early_add_reps | 60 lb | 9 | ✓ | — |
| 2 | 60×8 → 60×8 | calibration (starterOverloadSuggestion) | same | early_add_reps | 60 lb | 9 | ✓ | — |
| 3 | 60×8 → 60×8 → 60×7 | calibration (starterOverloadSuggestion) | same | early_add_reps | 60 lb | 9 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend keeping 60 lbs and aiming for 9 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 60 lbs x 8; Jun 15: 60 lbs x 8; Jun 12: 60 lbs x 7.
Last time you hit 60 lbs x 8. Since that is below the top of your 6-10 target range, the next step is 9 reps at the same weight before increasing.
```

</details>

### Scenario C: Too hard

**Expected:** Repeat or reduce load when reps stay below minimum target and decline.

**Known risk flags:** Should not push rep progression when below minTarget with declining performance

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 60×5 | calibration (starterOverloadSuggestion) | same | hold | 60 lb | 6-10 | ✓ | — |
| 2 | 60×5 → 60×4 | calibration (starterOverloadSuggestion) | down | reduce_or_recover | 55 lb | 6-10 | ✓ | — |
| 3 | 60×5 → 60×4 → 60×4 | calibration (starterOverloadSuggestion) | down | reduce_or_recover | 55 lb | 6-10 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend reducing slightly to 55 lbs and aiming for 6-10 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 60 lbs x 5; Jun 15: 60 lbs x 4; Jun 12: 60 lbs x 4.
Recent top sets stayed below the 6-10 target range at 60 lbs.
Reduce slightly to keep reps in target range.
The goal is to rebuild clean reps before progressing.
```

</details>

### Scenario D: Very inconsistent

**Expected:** Repeat at same weight to gather more data; avoid progression on noisy signal.

**Known risk flags:** Should detect rep variance and hold rather than progress

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 60×10 | calibration (starterOverloadSuggestion) | same | early_repeat | 60 lb | 6-10 | ✓ | — |
| 2 | 60×10 → 60×5 | calibration (starterOverloadSuggestion) | same | early_repeat | 60 lb | 6-10 | ✓ | — |
| 3 | 60×10 → 60×5 → 60×8 | calibration (starterOverloadSuggestion) | same | early_repeat | 60 lb | 6-10 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend repeating 60 lbs for 6-10 clean reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 60 lbs x 10; Jun 15: 60 lbs x 5; Jun 12: 60 lbs x 8.
Your recent reps at this weight have varied quite a bit (8 → 5 → 10).
Repeat this load to confirm baseline before increasing weight or reps.
```

</details>

### Scenario E: Strong beginner

**Expected:** Faster calibration upward when load is clearly submaximal across sessions.

**Known risk flags:** May treat strong beginner same as moderate overload (+5 lb only)

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 95×10 | calibration (starterOverloadSuggestion) | same | early_repeat | 95 lb | 6-10 | ✓ | — |
| 2 | 95×10 → 95×10 | calibration (starterOverloadSuggestion) | up | early_add_weight | 100 lb | 6-8 | ✓ | — |
| 3 | 95×10 → 95×10 → 95×10 | calibration (starterOverloadSuggestion) | up | early_add_weight | 105 lb | 6-8 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend trying 105 lbs for 6-8 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 95 lbs x 10; Jun 15: 95 lbs x 10; Jun 12: 95 lbs x 10.
You reached the top of the 6-10 target range at 95 lbs with stable performance.
The 10 lbs increase is an early calibration step, not a confirmed long-term trend yet.
```

</details>

### Scenario F: Overestimated novice

**Expected:** Reduce load safely when reps are well below minimum and trending down.

**Known risk flags:** Should reduce or hold, not add reps, when load was overestimated

| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |
|---:|---|---|---|---|---:|---|:---:|---|
| 1 | 50×4 | calibration (starterOverloadSuggestion) | down | reduce_or_recover | 45 lb | 6-10 | ✓ | — |
| 2 | 50×4 → 50×3 | calibration (starterOverloadSuggestion) | down | reduce_or_recover | 45 lb | 6-10 | ✓ | — |
| 3 | 50×4 → 50×3 → 50×3 | calibration (starterOverloadSuggestion) | down | reduce_or_recover | 45 lb | 6-10 | ✓ | — |

<details>
<summary>Full recommendation detail (3 sessions)</summary>

```
I'd recommend reducing slightly to 45 lbs and aiming for 6-10 reps.

Why:
Early calibration phase — this is based on only 3 logged sessions.
The goal is to find your working range, not maximize load yet.
Recent working sets: Jun 18: 50 lbs x 4; Jun 15: 50 lbs x 3; Jun 12: 50 lbs x 3.
Recent top sets stayed below the 6-10 target range at 50 lbs.
Reduce slightly to keep reps in target range.
The goal is to rebuild clean reps before progressing.
```

</details>

## Appendix: calibration decision tree (sessions 1–3)

1. **High rep variance at same weight (range ≥ 3)** → `early_repeat` (stabilize).
2. **Below minTarget** → `hold` (repeat) or `reduce_or_recover` if well below min.
3. **Stable at/above maxTarget** → `early_add_weight` (1× jump; 2× for stable compound triples).
4. **In range below maxTarget** → `early_add_reps`.
5. **At maxTarget but not confirmed** → `early_repeat`.

At **4+ sessions**, the established full engine runs unchanged.
