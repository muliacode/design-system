# @muliacode/tokens-tailwind

Tailwind CSS v4 theme layer. Import this *instead of* `@muliacode/tokens/css`.

```css
@import "@muliacode/tokens-tailwind";
```

```html
<button class="h-control rounded-sm bg-primary px-3 text-base
               font-medium text-primary-fg hover:bg-primary-hover">
  Deploy
</button>
```

Colour tokens are mapped with `@theme inline`, not plain `@theme`. Plain
`@theme` copies the value into the generated utility, freezing whichever theme
was active at build time — runtime `data-theme` switching would silently stop
working. `@theme inline` emits `var(--token)`, so utilities resolve live.

Our 4px spacing grid and Tailwind's default scale already agree exactly
(`p-4` = 16px), so no spacing mapping is needed.

## Form control borders

Interactive controls (input, select, stepper) use `border-line-control`, not
`border-line`. It's a separate token because a plain `1px solid` border at the
general `border` colour measured only 1.14:1 against the raised surface — well
under the 3:1 WCAG 1.4.11 requires for a UI component boundary.
`border-line-control` is calibrated to clear 3:1 in both themes.

```html
<input class="h-control rounded-sm border border-line-control bg-raised px-3" />
```

## shadcn / shadcn-vue

Import the `/shadcn` entrypoint instead. It pulls in everything above and
adds the colour names shadcn's vendored components compile against.

```css
@import "@muliacode/tokens-tailwind/shadcn";
```

shadcn isn't a library you theme through configuration — it copies component
source into your repo with class names baked in: `bg-background`,
`text-muted-foreground`, `border-input`, `ring-ring`. That set is a fixed
contract and it doesn't overlap ours.

The failure mode is quiet. Tailwind v4 generates no rule at all for a utility
whose theme variable is undefined — no warning, no fallback, the class is just
absent from the stylesheet. So shadcn on the bare theme layer renders
components that are *mostly* unstyled while `bg-primary` works fine, because
`--color-primary` is the one name both vocabularies already had. Anyone hitting
that half-working state is missing this import.

Every mapping is an alias onto a token that already exists, so shadcn
components inherit the same WCAG-validated palette and follow `data-theme`
switching without special handling. Two mappings are worth knowing about:

- `--color-input` resolves to `--border-control`, not `--border-default`.
  shadcn's stock theme uses one colour for both, which puts input borders
  under the 3:1 WCAG 1.4.11 requires. Ours are calibrated to clear it, so
  every vendored control gets the accessible border for free.
- `--color-secondary` resolves to a surface, not to kencana. shadcn's
  "secondary" is its quiet neutral button, not a second brand colour — reach
  for `bg-brand` when you want the gold.

Set `data-theme` on `<html>`, not the `.dark` class shadcn's docs assume; the
`dark:` variant is pointed at the data attribute so one switch drives the whole
system. Because `:root` carries the dark values, a document with no `data-theme`
renders dark — set it explicitly rather than relying on that.

Both vocabularies stay live, so they compose in the same markup:

```html
<Button class="h-control">Deploy</Button>
<div class="rounded-md border border-line bg-raised p-4">…</div>
```

## Staying in sync with @muliacode/tokens

Every mapping in `index.css` is checked against the real, built output of
`@muliacode/tokens` — not against memory of what that package should contain.

```bash
npm run test -w @muliacode/tokens-tailwind
```

`scripts/verify.mjs` extracts every `var(--token)` `index.css` and `shadcn.css`
reference and confirms each one actually exists in `@muliacode/tokens`'s
generated `tokens.css`. It also checks the shadcn contract in the other
direction — every colour name shadcn hardcodes must be mapped in `shadcn.css`,
so a name we've missed fails the build instead of shipping as a component that
renders unstyled. This exists because an earlier draft of this file was written
against a different, informal naming scheme (`--bg-app`, `--text-primary`,
`--ctrl-md`) that never matched what the token package actually ships
(`--surface-app`, `--font-size-base`, `--control-md`) — nearly every utility
in the file was silently broken. The check runs in CI on every change to
either package, so that class of drift fails the build instead of shipping.
