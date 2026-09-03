# Mulia Code Design System

One visual and interaction language for web, mobile, and command-line software.
Dense, technical, quiet. Dark-first, light-equal. WCAG 2.2 AA, enforced in CI.

Palette drawn from *batik pesisir*: **toska** (sea-green) for everything
interactive, **kencana** (gold prada) for the mark, on **kain** (undyed cloth)
in light and **malam** (batik wax, also "night") in dark.

## Layout

| Path | What |
|---|---|
| `packages/tokens` | The source of truth. Builds to CSS, SCSS, JSON, JS/TS, Swift, Kotlin, and CLI. |
| `packages/tokens-tailwind` | Tailwind v4 theme layer. |
| `docs/design-system.html` | The styleguide — 31 sections, every component live. Open it in a browser. |

## Quick start

```bash
npm install
npm run build      # generate every token target
npm run validate   # verify contrast in both themes
npm run docs       # serve the styleguide at :8080
```

## Using it downstream

```bash
npm install @muliacode/tokens
```

```css
@import "@muliacode/tokens/css";
```

Consume tokens, never literals. A raw hex or an off-grid pixel value in a
stylesheet is a defect — lint for it.

## Licences

- Code in `packages/` — **MIT** (`LICENSE`)
- Documentation in `docs/` — **CC BY 4.0** (`LICENSE-docs`)
- Inter and JetBrains Mono — SIL OFL 1.1, not redistributed here. Self-host
  them; a Google Fonts CDN call is a GDPR exposure and a needless dependency.

## Contributing

See `CONTRIBUTING.md`. Accessibility reports are prioritised and do not need to
cite a WCAG criterion — describing what got in your way is enough.
