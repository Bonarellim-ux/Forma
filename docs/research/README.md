# Forma Research Infrastructure

Forma's coaching intelligence should be grounded in a traceable evidence hierarchy instead of one-off prompt wording or hardcoded opinions.

This research layer is intentionally separated from product logic. It does not generate programs by itself. It stores the evidence, principles, and decision rules that future onboarding, workout generation, progression, recovery, and AI coaching systems can cite.

## Evidence Hierarchy

The hierarchy is:

Decision Rule -> User Model Variable -> Evidence Statement -> Source

Decision Rule -> Principle -> Evidence Statement -> Source

Each layer has a different job:

- Source: a paper, textbook, consensus statement, expert resource, or internal Forma analysis.
- Evidence Statement: a plain-language claim supported by one or more sources.
- User Model Variable: a derived coaching variable inferred from raw onboarding answers.
- Principle: a reusable coaching principle derived from evidence statements.
- Decision Rule: a product-facing rule that can guide recommendations.

This keeps Forma from saying "because science" without being able to show the underlying chain.

User modeling is the layer between raw answers and rules. Onboarding answers like "4 days per week" or "45-60 minutes" should not be treated as coaching variables by themselves. Forma should first infer structured variables such as `sessionLengthCategory`, `recoveryCapacity`, `goalPriority`, and `equipmentAccessLevel`, then run decision rules against those variables.

## Data Files

The canonical data lives in `/data`:

- `sources.json`: source metadata.
- `evidence-statements.json`: evidence claims linked to sources.
- `user-modeling.json`: derived user variables inferred from raw onboarding inputs.
- `principles.json`: coaching principles linked to evidence statements.
- `decision-rules.json`: product rules linked to principles.

## Confidence

Confidence is stored at each layer because uncertainty changes as evidence is translated into product decisions.

Suggested levels:

- `high`: supported by multiple reliable sources or strong agreement.
- `medium`: plausible and useful, but with limited scope, mixed evidence, or context dependence.
- `low`: early, speculative, or mainly useful as a hypothesis.

Confidence should never be used as decoration. If Forma exposes confidence to users later, it should only do so when the underlying research library is mature enough to justify it.

## Citation Maintenance

Every source should include enough metadata to be found again:

- title
- authors
- year
- DOI when available
- URL when useful
- evidence level
- verification status
- tags

When a source is reviewed, set `verified` to `true`. Dummy data and placeholders must remain `verified:false`.

## Adding Future Research

Research should be added in phases:

1. Add or verify sources.
2. Extract evidence statements from those sources.
3. Add or update user model variables when raw onboarding inputs need interpretation.
4. Connect evidence statements to principles.
5. Create or update decision rules that consume user model variables.
6. Add product logic only after the chain is traceable.

Do not add a decision rule unless it can point to at least one principle. Do not add a principle unless it can point to at least one evidence statement. Do not add an evidence statement unless it points to at least one source.

Decision rules should use user model variables whenever possible. Avoid rules that directly depend on fragile raw strings from onboarding, such as exact button labels or text-entry phrasing.

## Current Status

The current entries are dummy examples for architecture and readability. They are not a finalized research review and should not be treated as production evidence.
