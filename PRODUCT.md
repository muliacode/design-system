# Product

<!-- impeccable:product-schema 1 -->

This record covers v2, `@muliacode/ui` on `main`. v1 (`@muliacode/tokens`, `@muliacode/tokens-tailwind`) is maintained on the `v1` branch and is out of scope here.

## Platform

web

A Vue 3 component library published on npm.

## Users

- **Primary: developers building Mulia Code apps.** They import components, supply an app theme as design tokens, and need every component to be accessible without extra work. Abonemen is the first consumer.
- **Welcome: anyone else under the EUPL**, including outside apps and the NL Design System community, who want Vue components on Utrecht CSS. They can use and theme the library, but Mulia Code's apps come first when priorities conflict.
- **Indirect: the end users of those apps**, including people on screen readers, keyboards, 400% zoom and Windows high contrast. Every component is judged by whether they can use it.

## Product Purpose

A brand-neutral Vue 3 component library for Mulia Code software. Every component renders the class names of the Utrecht CSS components and takes all its styling from design tokens, so each app themes the whole library by setting tokens. The library ships a neutral default theme. Success means an app gets accessible, consistent components and only has to write a theme.

## Positioning

Vue wrappers around the stable Utrecht CSS components, which are owned and tested by Mulia Code, instead of depending on NL Design System's alpha Vue library. It adds the behaviour and the components Utrecht lacks, keeps Utrecht's class names and token contract unchanged, and enforces WCAG 2.2 AA in CI.

## Operating Context

- Developers work in Storybook (neutral theme, with a toolbar for light, dark and high-contrast schemes) and run tests with Vitest, Testing Library and vitest-axe.
- Apps load `@muliacode/ui/styles.css` (the Utrecht CSS) and then a theme stylesheet that sets `--utrecht-*` and `--mc-*` tokens. Colour schemes switch through `data-color-scheme`, and the nearest one wins.
- Releases are tagged, changelogged, and published over npm trusted publishing with provenance.

## Capabilities and Constraints

- **Components so far:** Button, ButtonLink, Heading, Link, SkipLink (0.1.0, with more in progress).
- **Utrecht first.** Where Utrecht has a component, ours renders its class names and adds behaviour. Components Utrecht lacks follow the same patterns under `--mc-<component>-*` tokens.
- **Tokens only.** A raw colour or an off-grid size inside a component is a defect.
- **Native elements before ARIA.**
- **Brand-neutral.** Components carry no Mulia Code or app branding. App looks live in app themes; the Abonemen theme is the worked example.
- **Definition of done:** a story per state in every theme, a keyboard test, an automated accessibility check that passes in every theme, roles and names checked with a screen reader, and a usage note.
- **Build checks:** the theme build fails on undefined variables or on Utrecht tokens that the CSS never reads, and contrast pairs are checked in every scheme.
- **Semantic versioning.** A renamed or removed prop, slot, event or class name, or a changed meaning or default behaviour, is a major bump.
- **Open question:** whether duit (Wails desktop app, now on v1 with Tailwind and shadcn) moves to v2 is undecided.

## Brand Commitments

- **The library is brand-neutral by design.** Its neutral theme is brand-free on purpose and must stay that way.
- **Built on NL Design System:** Utrecht CSS components (`@utrecht/component-library-css`, EUPL-1.2) and the Utrecht token naming.
- **Licence:** EUPL-1.2 for code, documentation and stories.
- **Contributing tone:** accessibility reports are prioritised and don't need to cite a WCAG criterion; describing the barrier is enough.

## Evidence on Hand

- Published `@muliacode/ui` 0.1.0 on npm, plus Storybook stories, component tests and a CHANGELOG in `packages/ui/`.
- The neutral theme in `packages/ui/themes/`; the Abonemen theme in the abonemen repository at `docs/design/design-system/abonemen-theme.css`.
- No adoption numbers, outside users or audits are recorded; future work must not invent them.

## Product Principles

1. **Accessible for everyone, enforced.** WCAG 2.2 AA is the floor and CI is the gate; a component that fails axe in any theme does not ship.
2. **The token contract is the API.** Apps change the look only through tokens, never by restyling components, so a theme stays stable across releases.
3. **Utrecht first, ours only for gaps.** Stay compatible with NL Design System instead of forking it.
4. **Mulia Code apps first, open to all.** Their needs set priorities; anything built stays general enough for outside users.

## Accessibility & Inclusion

WCAG 2.2 AA in every theme and colour scheme, including the contrast scheme (text at 7:1). Focus rings must stay visible under `forced-colors`. Themes carry part of the responsibility: text needs 4.5:1 and boundaries and focus rings need 3:1, which are checked in tests. Disabled and loading states use `aria-disabled`, so controls stay focusable.
