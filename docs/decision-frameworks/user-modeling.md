# User Modeling Framework

Forma should not apply decision rules directly to raw onboarding answers.

Raw answers are useful, but they are not always coaching variables. For example:

- "3 days per week" is an availability input.
- `daysAvailable = 3` is a normalized variable.
- `recoveryCapacity = low` is an inferred coaching variable.
- `Full Body x3 is eligible` is a decision rule output.

## Why User Modeling Exists

User modeling gives Forma a stable layer between user inputs and recommendations. This matters because onboarding labels, UI copy, and question formats can change over time. Decision rules should not break just because a button label changes from "45-60 minutes" to "About an hour."

The user modeling layer also prevents brittle rules like:

Bad:

```text
IF user selected 6 days/week THEN recommend PPL x2
```

Better:

```text
IF daysAvailable = 6
AND trainingAgeCategory != beginner
AND recoveryCapacity != low
AND sessionLengthCategory != short
THEN PPL x2 is eligible
```

## Conversion Flow

The future onboarding intelligence flow should be:

1. Collect raw onboarding answers.
2. Normalize them into user model variables.
3. Apply evidence-backed decision rules to the user model.
4. Generate recommendations and explanations from the winning rules.
5. Keep traceability back to evidence and sources.

## Adding New Variables

When adding a new user model variable:

1. Add an entry to `/data/user-modeling.json`.
2. List the raw inputs used.
3. Define possible values.
4. Write clear inference logic.
5. Link to evidence statements where possible.
6. Link related decision rules if they already exist.

Do not add a variable just because it is convenient. Add it when it makes recommendations more stable, explainable, or evidence-aligned.

## Avoiding Fragile Assumptions

Avoid:

- Exact UI labels as rule conditions.
- One-input decisions for complex recommendations.
- Hidden assumptions with no model variable.
- Rules that cannot be traced to evidence.

Prefer:

- Normalized categories.
- Multiple supporting variables.
- Explicit confidence.
- Traceable evidence chains.

## Current Status

The current user model entries are placeholder examples. They define the architecture for Phase 2, but they are not yet wired into onboarding or recommendation logic.
