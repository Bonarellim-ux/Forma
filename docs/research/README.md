# Forma Research Database

`CONTRACT.md` is the source of truth for research data. When it conflicts with any other note, the contract wins.

This folder is prepared for phase-by-phase uploads from ChatGPT:

```text
docs/research/
  CONTRACT.md
  sources/sources.json
  evidence/<phase_id>.json
  rules/<phase_id>.json
  flags/<phase_id>.md
  notes/<phase_id>.md
```

JSON files must contain pure JSON arrays only. No markdown fences, prose, comments, or trailing commas.

## Phase Upload Workflow

For each phase upload:

1. Save new or updated source records into `sources/sources.json`.
2. Save evidence statements into `evidence/<phase_id>.json`.
3. Save decision rules into `rules/<phase_id>.json`.
4. Save flags into `flags/<phase_id>.md`.
5. Save optional narrative notes into `notes/<phase_id>.md`.
6. Run the validator:

```bash
node dev/research-validate.js
```

Do not wire phase data into the app until the JSON validates.

## Phase IDs

Phase 1 uses these exact IDs:

- `phase1a.volume`
- `phase1b.frequency`
- `phase1c.progressive_overload`
- `phase1d.intensity_rir_failure`
- `phase1e.rest_intervals`
- `phase1f.training_age`
- `phase1g.recovery_fatigue`
- `phase1h.adherence`

## Important Boundary

The research database is not the app logic. It is the durable evidence and rule library that future Forma intelligence will consume.
