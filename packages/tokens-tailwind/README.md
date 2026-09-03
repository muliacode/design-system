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
