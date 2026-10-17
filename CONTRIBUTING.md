# Contributing

This is v2 of the design system: `@muliacode/ui`, Vue components on the Utrecht CSS components and NL Design System tokens. Changes to v1 (`@muliacode/tokens`, `@muliacode/tokens-tailwind`) go to the `v1` branch; see the README.

## Principles

- **Brand-neutral.** Components carry no Mulia Code or app branding. Apps theme them by setting design tokens.
- **Utrecht first.** Where Utrecht CSS has a component, ours renders its class names and adds behaviour; we build our own only where Utrecht has none, following the same patterns.
- **Tokens only.** Styling comes from design tokens. A raw colour or an off-grid size in a component is a defect.
- **Native elements before ARIA.** A `<button>` beats a `<div role="button">`.

## Adding a component

A component is done when it has:

- a story per state (default, hover, focus, disabled, error, and loading where it applies), in every theme;
- a test for keyboard use: every action reachable, no traps, visible focus;
- an automated accessibility check that passes in every theme;
- correct roles, names and descriptions, checked with a screen reader;
- a short usage note: what it is for, what the consumer must provide, what not to do with it.

## Versioning

Semantic versioning on `@muliacode/ui`:

| Change | Bump |
| --- | --- |
| New component, or a new optional prop | minor |
| Fix that keeps the API | patch |
| Prop, slot, event or class name renamed or removed | **major** |
| A component's meaning or default behaviour changed | **major** |
