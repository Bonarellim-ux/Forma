# Research Data Schemas

These schemas define the current shape of Forma's evidence database. They are intentionally simple JSON objects so the data can remain static-site friendly and GitHub Pages compatible.

## Source

```json
{
  "id": "src_001",
  "title": "Source title",
  "authors": ["Author One", "Author Two"],
  "year": 2024,
  "doi": "10.0000/example",
  "url": "https://example.com",
  "evidenceLevel": "systematic_review",
  "verified": false,
  "tags": ["hypertrophy", "frequency"]
}
```

## Evidence Statement

```json
{
  "id": "ev_001",
  "statement": "Plain-language evidence claim.",
  "evidenceLevel": "placeholder",
  "confidence": "medium",
  "sourceIds": ["src_001"],
  "citations": ["src_001"],
  "tags": ["hypertrophy", "frequency"]
}
```

`evidenceLevel` and `citations` may duplicate source-level metadata when useful for search or export. `sourceIds` remains the canonical reference.

## User Model Variable

```json
{
  "id": "USER_MODEL_RECOVERY_CAPACITY",
  "description": "Estimated ability to recover from weekly training stress.",
  "rawInputs": ["sleepQuality", "stressLevel", "daysAvailable", "sessionLength", "trainingAge"],
  "values": ["low", "moderate", "high"],
  "inferenceLogic": [
    "IF sleepQuality = poor OR stressLevel = high THEN recoveryCapacity = low",
    "IF sleepQuality = good AND stressLevel = low AND trainingAge != beginner THEN recoveryCapacity = high"
  ],
  "confidence": "medium",
  "evidenceIds": ["ev_001"],
  "relatedDecisionRuleIds": ["rule_001"]
}
```

## Principle

```json
{
  "id": "pr_001",
  "statement": "Reusable coaching principle.",
  "evidenceIds": ["ev_001"],
  "confidence": "medium"
}
```

## Decision Rule

```json
{
  "id": "rule_001",
  "condition": "IF daysAvailable = 3 AND recoveryCapacity != low THEN Full Body x3 is eligible.",
  "action": "Prefer a full-body split with repeated weekly movement practice.",
  "userModelVariableIds": ["USER_MODEL_RECOVERY_CAPACITY"],
  "principleIds": ["pr_001"],
  "confidence": "medium"
}
```

## Traceability Requirement

Every decision rule must be traceable:

1. `decision-rules.json` references `userModelVariableIds` and `principleIds`.
2. `user-modeling.json` references `evidenceIds`.
3. `principles.json` references `evidenceIds`.
4. `evidence-statements.json` references `sourceIds`.
5. `sources.json` stores the source metadata.

If a reference is missing, the rule should be considered invalid.
