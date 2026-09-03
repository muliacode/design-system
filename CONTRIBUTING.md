# Contributing

## Repository layout

```
packages/tokens/           the source of truth
  src/*.json               hand-edited token definitions (DTCG format)
  scripts/build.mjs        generates every output target
  scripts/validate-contrast.mjs   fails CI on a contrast regression
  contrast.config.json     the pairings we promise to keep
  dist/                    generated — never hand-edit, but committed
packages/tokens-tailwind/  Tailwind v4 theme layer
docs/design-system.html    the styleguide and reference implementation
```

## Changing a token

1. Edit the relevant file in `packages/tokens/src/`. Never edit `dist/`.
2. `npm run build -w @muliacode/tokens`
3. `npm run validate` — every declared contrast pairing must still pass.
4. Commit both the source change **and** the regenerated `dist/`.

`dist/` is committed on purpose. A palette change should be readable as a diff
in the pull request, by a reviewer who has not checked the branch out.

## Adding a token

Add it to `src/`, and if it is a colour that text or a boundary will sit
against, add the pairing to `contrast.config.json` in the same commit. A colour
with no declared pairing is a colour nobody is checking.

## Versioning

Semantic versioning, on the token package only.

| Change | Bump |
|---|---|
| New token | minor |
| Value changed, meaning unchanged | patch |
| Token renamed or removed | **major** |
| Meaning of an existing token changed | **major** |

Never silently repurpose a token. Downstream code reads `--accent-solid`
expecting "the colour of a primary action"; changing what that means is a
breaking change even though the name is identical.

Release by tagging: `git tag '@muliacode/tokens@2.2.0' && git push --tags`.

## Adding a component

Components live in `docs/design-system.html` first. A component is not done
until it has:

- All six states rendered: default, hover, active, focus, disabled, loading
- A keyboard-only pass — every action reachable, no traps, visible focus
- Correct roles and names; native elements preferred over ARIA
- An entry in the coverage table (§30), including if it was **declined**

## What we decline

Declining is a normal outcome. Record the reason in the coverage table so the
same proposal does not return every six months.
