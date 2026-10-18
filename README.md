# Mulia Code Design System

`@muliacode/ui` is a brand-neutral Vue 3 component library for Mulia Code software. It is built on [NL Design System](https://nldesignsystem.nl/): every component renders the class names of the [Utrecht CSS components](https://nl-design-system.github.io/utrecht/), and all styling comes from design tokens. Each app supplies its own theme by setting those tokens; the library ships a neutral default.

Every component is meant to be usable by everyone, including people on screen readers, keyboards, 400% zoom and Windows high contrast. WCAG 2.2 AA is the floor, enforced by tests in CI.

## v1 and v2

This repository holds two generations of the design system.

| | v1 | v2 (this branch) |
| --- | --- | --- |
| What | `@muliacode/tokens` and `@muliacode/tokens-tailwind`: the batik-inspired tokens, a Tailwind and shadcn layer, and an HTML styleguide | `@muliacode/ui`: Vue components on Utrecht CSS and NL Design System tokens, themed per app |
| Where | The [`v1`](../../tree/v1) branch, from tag `v1-final` | `main` |
| Status | Maintained: fixes are made on `v1` and released from there. Published versions stay on npm unchanged | In development |

v1 keeps its full history on the `v1` branch; nothing was rewritten. Apps that use `@muliacode/tokens` can keep doing so.

## Layout

| Path | What |
| --- | --- |
| `packages/ui` | `@muliacode/ui`: the components, their tests and stories |

## Licence

Copyright 2026 Mulia Code. Licensed under the **EUPL**, version 1.2: the code, the documentation and the stories alike. See `LICENSE` for the text. The EUPL is a copyleft licence written for EU law: changes to the library itself stay open, while apps that use it keep their own licence.

The Utrecht CSS components that `@muliacode/ui` depends on are licensed under the EUPL-1.2 as well; their notice ships with the package. v1 (`@muliacode/tokens`, `@muliacode/tokens-tailwind`) stays MIT, with CC BY 4.0 for its styleguide, on the `v1` branch.

## Contributing

See `CONTRIBUTING.md`. Accessibility reports are prioritised and do not need to cite a WCAG criterion: describing what got in your way is enough.
