# @muliacode/ui

Brand-neutral Vue 3 components for Mulia Code software. Each component renders the class names of the [Utrecht CSS components](https://nl-design-system.github.io/utrecht/) and takes its look from [NL Design System](https://nldesignsystem.nl/) design tokens, so an app themes the whole library by setting tokens.

## Install

```bash
npm install @muliacode/ui
```

`vue` 3.5 or newer is a peer dependency.

## Use

Import the Utrecht CSS once, then a theme, then use the components:

```ts
import '@muliacode/ui/styles.css';
import '@muliacode/ui/themes/neutral.css'; // or your app's own theme
```

```vue
<script setup lang="ts">
import { Heading } from '@muliacode/ui';
</script>

<template>
    <Heading :level="1">Subscriptions</Heading>
</template>
```

Every component is its own module, so a bundler includes only the ones you import.

## Theming

The components take every colour, size and font from **Utrecht component tokens**: CSS custom properties named `--utrecht-<component>-<property>`, such as `--utrecht-button-primary-action-background-color`. That is the whole contract: a theme is a stylesheet that sets those tokens, and nothing else is needed.

- **Where:** on `:root`, or on a theme class to scope it, for example `.my-app-theme`.
- **Colour schemes:** switch them by changing token values only, for example under `[data-color-scheme='dark']`. Don't restyle components per scheme.
- **Which tokens:** the ones the Utrecht CSS reads for the components you use; the [Utrecht documentation](https://nl-design-system.github.io/utrecht/) lists them per component. Unset tokens fall back to Utrecht's defaults, which are rarely what you want, so set at least the document, typography, focus, link, button and form-control tokens.
- **Components Utrecht doesn't have** (marked "ours" in the table below) follow the same pattern with their own `--mc-<component>-*` tokens. Each one documents its tokens and defaults to the closest Utrecht ones.
- **Accessibility is the theme's job too:** text needs 4.5:1 contrast against its background, boundaries and focus rings 3:1 (WCAG 1.4.3 and 1.4.11). Keep focus rings visible under `forced-colors`.

### The neutral theme

`@muliacode/ui/themes/neutral.css` is the default: brand-free, with three colour schemes. It applies to `:root` (or `.mc-neutral-theme`); set `data-color-scheme` to `light` (the default), `dark` or `contrast` on the theme element or any ancestor, for example `html`. The contrast scheme raises text to 7:1 and draws controls heavier.

It is built from `themes/neutral.tokens.json` (the palette and scale) and `themes/neutral.mapping.css` (the mapping onto Utrecht tokens). `npm run build` fails if the mapping uses a variable the palette doesn't define, or sets a Utrecht token the Utrecht CSS never reads. `npm test` checks every colour pair in `contrast.config.json`, in every scheme.

To write your own theme, copy the neutral one as a starting point. The Abonemen theme ([`docs/design/design-system/abonemen-theme.css`](https://github.com/muliacode/abonemen/blob/main/docs/design/design-system/abonemen-theme.css) in muliacode/abonemen) is a worked example of an app theme.

## Components

| Component | Utrecht component | Notes |
| --- | --- | --- |
| `Heading` | Heading 1 to 6 | `level` (1 to 6) sets both the element and the style. No outer margin by default; `distanced` spaces it as in running text |

## Licence

MIT. The Utrecht CSS components are a dependency under the EUPL-1.2; see `THIRD-PARTY-NOTICES.md`.
