---
description: Audit and improve the portfolio's UI/UX against a fixed checklist of design rules
---

# Improve UI/UX

Audit the portfolio against the rules below and apply fixes. Touch only what violates a rule — do not edit sections that already comply with every rule.

## Scope

Default targets: `index.html`, `css/styles.css`, `js/app.js`.

If the user passes arguments after `/improve-ui`, treat them as a focus area (e.g. `/improve-ui hero`, `/improve-ui projects`, `/improve-ui mobile`) and limit the audit to that area. With no arguments, audit the whole portfolio.

A focus area narrows the *surface* inspected, not the *rule set* — every rule below still applies within that surface.

## Rules to enforce

### 1. Clear visual hierarchy
- Hero title → largest
- Section titles → medium
- Body text → normal
- Metadata (duration pills, dates, role tags) → small
- Each level must be visually distinct in size **and** weight, not just one or the other.

### 2. Readability
- Maximum 2 font families across the whole site
- Body text ≥ 16px (desktop and mobile)
- Line-height ≥ 1.5 on prose
- Paragraphs ≤ ~4 visual lines; fix via CSS only (e.g. `max-width`, line-height). Do **not** rewrite or split the prose itself.
- Never center-align long paragraphs (left-align prose)

### 3. Consistent spacing scale
- Use only multiples of 8 (commonly 8/16/24/32/48px)
- Replace any odd values (e.g. 10px, 13px, 22px) with the nearest scale value
- Same spacing between sibling elements of the same type

### 4. Don't overcrowd
- Flag any section with too many cards, colors, or animations
- Prefer one accent color + neutrals; avoid more than ~3 hues total
- Animations should be subtle (≤ 300ms, ease-out); remove decorative motion that adds no information

### 5. Information priority (above the fold)
- Who you are → name + role
- What you do → one-line summary
- Where your work is → CTA or projects link
- Verify the hero markup contains all three elements before any secondary content

### 6. Project cards
- Every project card must show: **what it does**, **tech stack**, **your contribution/role**
- Card layout identical across all cards (same title size, same chip style, same role placement)
- Do **not** reorder project cards — ordering is editorial; if order seems wrong, flag it in the report but do not change it.

### 7. Layout consistency
- Same button styles everywhere (primary/secondary defined once, reused)
- Same card padding, border-radius, shadow
- Same alignment per section (don't mix centered + left-aligned arbitrarily)
- Same color tokens (no one-off hex values)

### 8. Contrast
- Headings: strong contrast against background (WCAG AA ≥ 4.5:1)
- Body descriptions: slightly softer
- Metadata: muted/secondary color
- Never put light gray text on white

### 9. Mobile responsiveness
- Inspect `@media` rules for 375px and 768px breakpoints
- Tap targets (buttons, links, nav items) have computed size ≥ 44px
- Hero, project grid, and nav have explicit reflow rules at both breakpoints
- Body text stays ≥ 16px on mobile; metadata/labels may drop to 14px but no lower
- Flag any fixed widths or `overflow-x` patterns that risk horizontal scroll, but note these as runtime checks for the user to confirm in a browser

## Process

1. **Audit.** Read the target files and print a short findings list grouped by rule number. For each finding, cite the file and line.
2. **Apply fixes.** In the same turn as the findings list, proceed directly to minimal, targeted edits — do not stop and wait for approval. The only exceptions, where you should pause and ask:
   - **Judgment call** — e.g. "replace one of two competing accent colors with a neutral?"
   - **Deliberate existing choice** — the violation looks intentional, not accidental
   - **Out of scope** — the violation lives in any file not in the default targets (`index.html`, `css/styles.css`, `js/app.js`); list the file and ask before editing
3. **Verify.** Confirm every finding from step 1 is either fixed or explicitly deferred (with reason). Then re-check that your edits didn't introduce new violations (e.g. a new font, off-scale spacing, or one-off color token).
4. **Report.** End with a concise summary: what you changed, grouped by rule. Note anything you flagged but did not change, and why.

## Constraints

- Do not introduce new dependencies, frameworks, or build tooling.
- Do not launch a browser or dev server — this audit is static (read files, inspect `@media` rules).
- Do not restructure the HTML semantics unless a rule explicitly requires it. The only rules that may add/modify markup are Rule 1 (heading order for hierarchy) and Rule 5 (adding a missing hero element: name, role, summary, or CTA). All other rules are CSS-only.
- Preserve existing content (project copy, metrics, social links) — this command is about *presentation*, not editorial changes.

Arguments: $ARGUMENTS
