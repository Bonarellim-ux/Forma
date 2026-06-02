# Forma Decision Log

## 2026-05: Use first-person AI coaching

**Reason:**
The coach should feel personal and direct.

**Decision:**
Use language like "I'd recommend..." instead of "Forma recommends..."

## 2026-05: No recommendation is better than a weak recommendation

**Reason:**
User trust is more important than showing advice constantly.

**Decision:**
Only show recommendations when there is meaningful evidence.

## 2026-05: Protect successful training patterns

**Reason:**
If an exercise is progressing, changing it just for novelty can hurt progress.

**Decision:**
Do not recommend swaps just because an exercise is frequent.

## 2026-05: Store weights internally in kg

**Reason:**
Keeps calculations consistent across metric and imperial users.

**Decision:**
All internal weight data stays in kg. Display converts based on user preference.

## 2026-05: Keep Forma brand visible in partnerships

**Reason:**
Forma is the product asset.

**Decision:**
Prefer co-branding like "Powered by Forma" over fully replacing the Forma brand.

## 2026-06: Establish a shared UI design system (tokens + conventions)

**Reason:**
Inline styles were drifting (low-contrast `--muted`/`--dim` text, dated
`Courier New`, inconsistent/absent press feedback, no motion or
reduced-motion standards). Forma's brief is "confident, precise, athletic"
and WCAG 2.1 AA, captured in the new root `PRODUCT.md`.

**Decision:**
Adopt shared tokens and classes (in `css/styles.css :root`): darkened
`--muted` (AA), a `--mono` stack (no `Courier New`), `--ease-out/-in-out/
-drawer` easing curves, a `.press` press-feedback class, `.sheet-overlay`/
`.sheet-panel` for bottom sheets, and a `prefers-reduced-motion` block.
`--dim` is hairlines-only, never text. Banned: side-stripe card accents,
eyebrow spam, `transition:all`, `ease-in`. Full detail and follow-ups in
`docs/ui-changes-2026-06-02.md`.
