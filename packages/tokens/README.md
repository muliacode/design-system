# @muliacode/tokens

Design tokens for Mulia Code software — web, mobile, and command line.
WCAG 2.2 AA, verified in CI.

```bash
npm install @muliacode/tokens
```

## Web

```css
@import "@muliacode/tokens/css";

.panel {
  padding: var(--space-4);
  border: 1px solid var(--border-control);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: var(--gray-950);
}
```

Theme switching is one attribute on the root element:
`<html data-theme="light">`. No component needs to know which theme it is in.

Using Tailwind v4? Install `@muliacode/tokens-tailwind` instead.

## JavaScript

```js
import { theme, shared, cli } from '@muliacode/tokens';

theme.dark['accent-solid'];   // '#2DD4BF'
shared['space-4'];            // '16px'
cli.status.error.mark;        // '✗'
```

Fully typed — `ColorToken` and `SharedToken` are string unions of every real
token name, so a typo is a compile error rather than a silent `undefined`.

## Other targets

| Import | Target |
|---|---|
| `@muliacode/tokens/css` | CSS custom properties |
| `@muliacode/tokens/scss` | SCSS variables |
| `@muliacode/tokens/json` | Resolved JSON, any language |
| `@muliacode/tokens/cli` | ANSI names and marks for terminal output |
| `@muliacode/tokens/swift` | SwiftUI `Color` constants |
| `@muliacode/tokens/kotlin` | Compose `Color` constants |

The CLI target carries **ANSI colour names, not hex**, so a user's terminal
theme still applies. Every status also carries a mark, because colour is
stripped in CI logs.

## Build

Zero dependencies. A token package sits at the root of every other repository,
so its own supply chain should be as close to empty as possible.

```bash
npm run build      # regenerate dist/
npm run validate   # check every contrast pairing
npm test           # both
```

## Contrast is enforced, not documented

`contrast.config.json` lists every pairing the system promises. CI computes
each one against both themes and fails the build below threshold. A palette
change that would quietly drop text below 4.5:1 cannot merge.

This is not theoretical — it caught a real defect on its first run: the input
border sat at 1.14:1 against its own surface, failing WCAG 1.4.11. The fix is
the `border-control` token, which is now checked on every commit.
