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
