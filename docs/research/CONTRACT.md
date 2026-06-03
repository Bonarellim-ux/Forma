# Forma — Research Data Contract (v1)

This document is the single source of truth shared by two systems that never
communicate directly:

- **ChatGPT** reads this to PRODUCE research output in the exact required format.
- **Codex** reads this to PARSE that output and build the coaching engine around it.

If a value, field, or rule is not in this document, it does not exist. ChatGPT
must never invent fields or vocabulary terms. When unsure, ChatGPT flags rather
than guesses (see §9).

---

## 0. The core model: a 4-link traceability chain

Every recommendation Forma makes must be traceable back to evidence:

    SOURCE  →  EVIDENCE STATEMENT  →  DECISION RULE  →  RECOMMENDATION

- A **source** is a verified study.
- An **evidence statement** is a FACT drawn from sources ("higher weekly volume
  generally increases hypertrophy").
- A **decision rule** is an ACTION ("if chest volume is below effective range and
  recovery is adequate, add 2 sets/week"). Rules cite evidence statements.
- A **recommendation** is a fired rule applied to a specific user, explained by
  walking back up the chain.

These are THREE separate stored layers (sources, evidence, rules). They are kept
separate on purpose: one evidence statement can feed many rules; one rule can
draw on several evidence statements. Fusing them destroys explainability.

The AI does NOT invent decision logic. Rules fire deterministically (§7). The AI
only explains, personalizes communication, and answers questions.

---

## 1. What ChatGPT produces & where it lives

The repository is the permanent source of truth — NOT ChatGPT memory, Claude
memory, or chat history. Per research section, ChatGPT produces machine-readable
JSON files plus an optional human companion:

    docs/research/
      CONTRACT.md                         (this file — never auto-generated)
      sources/sources.json                (append-only library of all studies)
      evidence/<phase_id>.json            (evidence statements for the section)
      rules/<phase_id>.json               (decision rules for the section)
      flags/<phase_id>.md                 (anything flagged, not turned into data)
      notes/<phase_id>.md                 (optional human-readable narrative)

- JSON files contain ONLY their JSON array — no prose, no markdown fences.
- `phase1-master.md` (the human "living document") is AUTO-GENERATED from the
  JSON by Codex. It is a VIEW, never the source of truth. ChatGPT does not write it.

---

## 2. Controlled vocabularies (USE VERBATIM — do not invent)

### domain
`volume` | `frequency` | `progression` | `intensity` | `rest` | `training_age` |
`recovery` | `adherence`

### phase_id  (Phase 1 = Foundations of Resistance Training)
- phase1a.volume
- phase1b.frequency
- phase1c.progressive_overload
- phase1d.intensity_rir_failure
- phase1e.rest_intervals
- phase1f.training_age
- phase1g.recovery_fatigue
- phase1h.adherence

### goal
`hypertrophy` | `strength` | `endurance` | `general_fitness` | `any`

### population  (training experience)
`novice` | `intermediate` | `advanced` | `any`

### muscle_group  (when applicable; else null)
`biceps` | `triceps` | `forearms` | `chest` | `upper_back` | `lats` | `traps` |
`front_delts` | `side_delts` | `rear_delts` | `quads` | `hamstrings` | `glutes` |
`calves` | `abs` | `obliques` | `full_body` | null

### study_type  (evidence hierarchy, strongest first)
`meta_analysis` | `systematic_review` | `position_stand` | `consensus_statement` |
`rct` | `expert_opinion`

### tier  (evidence quality — integer, derived from best supporting study_type)
- `1` = meta_analysis or systematic_review
- `2` = position_stand or consensus_statement
- `3` = rct or other controlled/observational study
- `4` = expert_opinion only — no usable study support (FLAGGED)

### unit
`sets_per_week` | `sets_per_session` | `reps` | `percent_1rm` | `rir` |
`seconds` | `minutes` | `hours` | `days_per_week` | `sessions_per_week`

---

## 3. SOURCES schema  (sources/sources.json)

Append-only. Every source verified before entry. No invented citations, no
unverified metadata, no influencer/blog content.

```json
{
  "source_id": "S0001",
  "title": "Dose-response relationship between weekly resistance training volume and increases in muscle mass",
  "authors": "Schoenfeld BJ, Ogborn D, Krieger JW",
  "year": 2017,
  "journal": "Journal of Sports Sciences",
  "study_type": "meta_analysis",
  "sample_size": null,
  "doi": "10.1080/02640414.2016.1210197",
  "pmid": "27433992",
  "verified": true
}
```

Rules:
- `source_id` — `S` + 4-digit zero-padded, unique across the whole library.
- `doi` required when one exists; `pmid` required when available.
- `verified` must be true — if metadata cannot be confirmed, do not add the
  source and flag it (§9).

---

## 4. EVIDENCE STATEMENT schema  (evidence/<phase_id>.json)

A FACT. Does not tell the app what to do — that is the rule layer's job.

```json
{
  "id": "phase1a.volume.E0001",
  "phase_id": "phase1a.volume",
  "domain": "volume",
  "goal": "hypertrophy",
  "population": "intermediate",
  "muscle_group": null,
  "statement": "Within a moderate range, higher weekly set volume produces greater hypertrophy, with diminishing returns at high volumes.",
  "parameters": { "value_min": 10, "value_max": 20, "unit": "sets_per_week" },
  "tier": 1,
  "confidence": 0.9,
  "source_ids": ["S0001"],
  "evidence_note": "",
  "version": 1,
  "date": "2026-06-03"
}
```

Rules:
- `id` — `<phase_id>.E` + 4-digit, unique within the file.
- `parameters` — required when the statement carries a number; always a range
  (set both equal if single) with a `unit`. Qualitative statement → `null`.
- `confidence` — 0–1, banded by tier (T1 .85–1.0, T2 .7–.9, T3 .4–.7, T4 .1–.4).
- `source_ids` — ≥1 required. Only a tier-4 expert-opinion statement may use `[]`,
  and then `evidence_note` is REQUIRED.
- A statement is tiered by its BEST supporting source. Never inflate a tier.

---

## 5. DECISION RULE schema  (rules/<phase_id>.json)

An ACTION. Cites evidence statements. Fires deterministically (§7).

```json
{
  "id": "phase1a.volume.R0001",
  "phase_id": "phase1a.volume",
  "domain": "volume",
  "goal": "hypertrophy",
  "population": "intermediate",
  "conditions": [
    { "field": "weekly_sets.<muscle>", "op": "<", "ref": "evidence_range.hypertrophy.low" },
    { "field": "recovery_status", "op": "==", "value": "adequate" }
  ],
  "condition_label": "Volume for this muscle is in the lower part of the evidence-supported hypertrophy range and recovery is adequate.",
  "action": { "type": "increase_volume", "target": "<muscle>", "amount": 2, "unit": "sets_per_week" },
  "action_label": "Add 2 weekly sets for this muscle.",
  "priority": 100,
  "evidence_ids": ["phase1a.volume.E0001"],
  "rule_note": "",
  "version": 1,
  "date": "2026-06-03"
}
```

Rules:
- `id` — `<phase_id>.R` + 4-digit, unique within the file.
- `conditions` — list of structured tests; ALL must be true for the rule to fire
  (logical AND). Each test: `field` (from the user-model vocabulary §6), `op`
  (`==` `!=` `<` `<=` `>` `>=` `in`), and either a literal `value` or a `ref` to
  another user-model/landmark field. `<muscle>` is a placeholder Codex binds per
  muscle.
- `condition_label` / `action_label` — plain-English, used by the AI to explain.
- `action.type` — one of: `increase_volume` | `decrease_volume` | `change_frequency`
  | `change_split` | `adjust_intensity` | `add_rest` | `deload` | `hold` | `flag_for_review`.
- `priority` — integer; higher wins when rules conflict (Codex resolves; you tune later).
- `evidence_ids` — ≥1 required. NO rule without evidence backing.

### Landmark policy (MEV / MAV / MRV) — READ THIS
Volume landmarks (MEV, MAV, MRV) are practitioner constructs, NOT values
validated by meta-analysis. The literature supports the volume dose-response
RELATIONSHIP and approximate effective RANGES, not exact per-muscle thresholds.
Therefore:
- Rules MUST prefer evidence-supported ranges (`evidence_range.*.low/high`,
  derived from tier-1/2 evidence statements) over hard landmark numbers.
- A rule condition may reference `landmark.*` ONLY if it cites a tier-4 evidence
  statement that explicitly stores that landmark as a flagged practitioner
  construct — and even then it should usually be a soft/secondary condition, not
  the sole trigger.
- Never write a rule whose firing depends on an invented exact threshold.

---

## 6. USER-MODEL vocabulary (the only fields a rule condition may reference)

A rule condition's `field` MUST be one of these. If a needed field is missing,
FLAG it (§9) — do not invent one.

- `weekly_sets.<muscle>`        number, sets_per_week
- `sessions_per_week.<muscle>`  number
- `training_age`                one of: novice | intermediate | advanced
- `goal`                        one of the goal vocabulary
- `recovery_status`             one of: adequate | impaired | unknown
- `avg_rir_last_session`        number
- `performance_trend`           one of: improving | stalled | declining
- `adherence_rate`              number 0–1
- `landmark.mev.<muscle>`       number — STORE ONLY IF a tier-4 flagged evidence statement defines it; practitioner construct, not validated
- `landmark.mav.<muscle>`       number — same caveat as mev
- `landmark.mrv.<muscle>`       number — same caveat as mev
- `evidence_range.<goal>.low`   number — lower bound of the evidence-supported volume range (from tier-1/2 evidence); PREFER THIS in rules
- `evidence_range.<goal>.high`  number — upper bound of the evidence-supported range (from tier-1/2 evidence)
- `sleep_hours`                 number  (USE SPARINGLY — do not over-weight sleep)

Note on sleep: a known failure mode is over-attributing poor performance to sleep.
Rules may reference `sleep_hours` only with a strong evidence statement behind them.

---

## 7. How a rule fires (deterministic — no AI in this step)

1. Codex loads the user model.
2. For each rule whose `goal`/`population` match the user (or are `any`), it
   evaluates every condition with the literal `op`. Placeholders like `<muscle>`
   expand across the user's tracked muscles.
3. A rule fires only if ALL its conditions are true.
4. If multiple rules fire with conflicting actions, the highest `priority` wins.
5. The AI then explains the fired rule using `condition_label`, `action_label`,
   the cited evidence `statement`s, and the source citations — walking the chain.

The AI never decides whether a rule fires. That removes the "plausible but
unsupported" failure mode.

---

## 8. Weak / absent and conflicting evidence

- WEAK/ABSENT: if coverage is needed but evidence is thin, produce a tier-4
  evidence statement with low confidence and a clear `evidence_note`. Do NOT skip
  it (silent gap) and do NOT inflate the tier. Any rule built on it inherits the
  caution and should carry a low `priority`.
- CONFLICTING: produce ONE evidence statement per credible position, each tiered
  with its own sources, noting the disagreement in `evidence_note`. Do not average
  positions into one vague statement. Rules resolve via tier/priority, not by you.

---

## 9. When to FLAG instead of producing data

Emit a flag (in `flags/<phase_id>.md`, one line each:
`[FLAG] <finding> — <why it could not become data>`) when:
- a source's metadata cannot be verified,
- no controlled-vocabulary value fits,
- a needed user-model field does not exist in §6,
- the topic is out of v1 scope (§10),
- the finding would require medical / injury / diagnostic judgment.

---

## 10. v1 scope — explicitly OUT (flag, never answer)

Future phases (do NOT produce data for these in Phase 1):
exercise selection, periodization, hypertrophy specialization, dedicated strength
programming, nutrition, supplements, cardio, body composition, behavior-change
methods beyond general adherence findings, and anything medical, injury-diagnostic,
rehab, or pharmacological.

---

## 11. Versioning

Every record carries `version` and `date`. Re-running a section reuses the same
filenames with incremented `version` and a new `date`. Codex treats a higher
version of the same `phase_id` as a REPLACEMENT, not a duplicate. Stable records
keep their ids; new records get new ids. `sources.json` is append-only and shared
across all phases.

---

## 12. ChatGPT self-check before returning a section

- [ ] Files: sources.json updated; evidence/<phase_id>.json and rules/<phase_id>.json present; pure JSON arrays.
- [ ] Every vocabulary value is from §2 verbatim.
- [ ] Every source is verified with real, checkable metadata (DOI/PMID where available).
- [ ] Every evidence statement cites ≥1 source (or is tier-4 expert_opinion with an evidence_note).
- [ ] Every numeric statement has parameters with a unit and a range.
- [ ] Every decision rule cites ≥1 evidence statement and uses only §6 user-model fields.
- [ ] Tiers follow §2; no inflation. Conflicts split into separate statements (§8).
- [ ] Out-of-scope and unverifiable items flagged (§9, §10), not invented.
