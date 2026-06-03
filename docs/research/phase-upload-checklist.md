# Research Phase Upload Checklist

Use this checklist each time a phase document is uploaded.

## Files Expected

- `docs/research/sources/sources.json`
- `docs/research/evidence/<phase_id>.json`
- `docs/research/rules/<phase_id>.json`
- `docs/research/flags/<phase_id>.md`
- `docs/research/notes/<phase_id>.md` optional

## Before Accepting A Phase

- Confirm the `phase_id` is one of the contract-approved values.
- Confirm JSON files contain arrays only.
- Confirm sources use `source_id`, not `id`.
- Confirm every source has `verified: true`.
- Confirm every evidence statement cites known `source_ids`, except allowed tier-4 exceptions.
- Confirm every rule cites known `evidence_ids`.
- Confirm every rule condition uses only the user-model fields allowed in `CONTRACT.md`.
- Confirm all flagged findings are placed in `flags/<phase_id>.md`.

## Validation Command

```bash
node dev/research-validate.js
```

The phase is not ready for app integration until validation passes.
