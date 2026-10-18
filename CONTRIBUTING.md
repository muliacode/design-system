# Contributing

This is v2 of the design system: `@muliacode/ui`, Vue components on the Utrecht CSS components and NL Design System tokens. Changes to v1 (`@muliacode/tokens`, `@muliacode/tokens-tailwind`) go to the `v1` branch; see the README.

## Principles

- **Brand-neutral.** Components carry no Mulia Code or app branding. Apps theme them by setting design tokens.
- **Utrecht first.** Where Utrecht CSS has a component, ours renders its class names and adds behaviour; we build our own only where Utrecht has none, following the same patterns.
- **Tokens only.** Styling comes from design tokens. A raw colour or an off-grid size in a component is a defect.
- **Native elements before ARIA.** A `<button>` beats a `<div role="button">`.

## Working on components

```bash
npm install
npm run storybook -w @muliacode/ui   # http://localhost:6006
```

`npm test -w @muliacode/ui` runs the contrast check and the component tests (Vitest, Testing Library and vitest-axe). Every story is also run through axe automatically, so a component with an accessibility violation fails CI; `src/test/keyboard.ts` has a `tabOrder` helper for keyboard tests.

Storybook shows every story in the neutral theme. Its toolbar switches between the light, dark and high-contrast schemes, which changes only token values; the Accessibility panel runs axe on the story you're looking at.

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

## Releasing

1. Move the **Unreleased** entries in `packages/ui/CHANGELOG.md` under a new heading `## <version> (<date>)`, and set the same version in `packages/ui/package.json`. Merge that.
2. Tag the merge commit and push the tag:

   ```bash
   git tag '@muliacode/ui@0.1.0' && git push origin '@muliacode/ui@0.1.0'
   ```

The release workflow checks that the tag matches `package.json` and that the changelog has the section, builds and tests the package, publishes it to npm with a provenance statement, and creates a GitHub release with that changelog section as its notes. If a run fails part-way, re-run it: it skips the npm publish and the GitHub release when they already exist.

**One-time setup.** npm only lets a package use trusted publishing once it exists. For the very first release, add an `NPM_TOKEN` repository secret: a granular access token that can publish `@muliacode/ui`. After that release, add this repository's `release.yml` as a trusted publisher on npmjs.com, then delete the secret; later releases authenticate over OIDC with no token at all.

## Licence

The code is licensed under the EUPL, version 1.2, and the documentation and stories under CC BY 4.0. By opening a pull request you agree that your contribution is licensed the same way.
