# Decision Frameworks

Decision frameworks translate research-backed principles into product decisions.

Examples:

- Which split should onboarding recommend?
- When should Forma suggest adding weight?
- When should Forma recommend monitoring instead of changing programming?
- When should recovery be mentioned as a hypothesis?
- When should the AI avoid making a strong claim?

## Framework Requirements

Every framework should:

- Define the user context it applies to.
- List the decision inputs.
- Reference decision rules from `/data/decision-rules.json`.
- Avoid unsupported certainty.
- Keep recommendations traceable back to evidence.

## Traceability Example

If a framework recommends a full-body split for a beginner training three days per week, the chain should look like:

Decision Framework -> Decision Rule -> Principle -> Evidence Statement -> Source

That chain lets Forma explain what it is doing without pretending the AI created the reasoning from scratch.

## Future Frameworks

Planned framework documents:

- `split-selection.md`
- `progression-recommendations.md`
- `recovery-recommendations.md`
- `ai-coaching-explanations.md`

These should be added only after the corresponding data entries exist in `/data`.
