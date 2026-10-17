# @muliacode/ui

Brand-neutral Vue 3 components for Mulia Code software. Each component renders the class names of the [Utrecht CSS components](https://nl-design-system.github.io/utrecht/) and takes its look from [NL Design System](https://nldesignsystem.nl/) design tokens, so an app themes the whole library by setting tokens.

## Install

```bash
npm install @muliacode/ui
```

`vue` 3.5 or newer is a peer dependency.

## Use

Import the Utrecht CSS once, then the app's theme, then use the components:

```ts
import '@muliacode/ui/styles.css';
import './my-theme.css';
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

## Components

| Component | Utrecht component | Notes |
| --- | --- | --- |
| `Heading` | Heading 1 to 6 | `level` (1 to 6) sets both the element and the style |

## Licence

MIT. The Utrecht CSS components are a dependency under the EUPL-1.2; see `THIRD-PARTY-NOTICES.md`.
