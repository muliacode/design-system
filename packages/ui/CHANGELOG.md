# Changelog

All notable changes to `@muliacode/ui`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the package uses [semantic versioning](https://semver.org/) as described in `CONTRIBUTING.md`.

Add changes under **Unreleased** as they are merged. A release renames that section to the version and date; the release workflow refuses a tag without a matching section.

## Unreleased

### Added

- `Button`: primary, secondary, subtle and danger variants, `type="button"` by default. `disabled` and `loading` keep it focusable with `aria-disabled`, emit no click and don't submit the form; `loadingText` shows while loading.
- `ButtonLink`: a link styled as a button, primary, secondary or subtle; `as` renders the app's router link.
- `Link`: a text link; `newTabText` opens it in a new tab and adds that text to its name, `current` marks the current page, `as` renders the app's router link.
- `SkipLink`: hidden until focused, and moves focus to its target.
- A browser check that every control is at least 44 by 44 px in every colour scheme (`npm run test:targets`).

## 0.1.0 (2026-10-18)

The first release.

### Added

- The `@muliacode/ui` package: Vue 3 components on the Utrecht CSS components, one ES module per component, with types.
- `Heading`, levels 1 to 6, with an optional `distanced` modifier.
- The theming contract, and the neutral theme with light, dark and high-contrast colour schemes (`@muliacode/ui/themes/neutral.css`).
