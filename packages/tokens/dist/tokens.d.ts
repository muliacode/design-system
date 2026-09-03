/* @muliacode/tokens v2.2.0 — GENERATED, do not edit.
   Source: packages/tokens/src/*.json   Build: npm run build */
export type ThemeName = 'light' | 'dark';
export type ColorToken = 'gray-50' | 'gray-100' | 'gray-200' | 'gray-300' | 'gray-400' | 'gray-500' | 'gray-600' | 'gray-700' | 'gray-800' | 'gray-900' | 'gray-950' | 'accent-bg' | 'accent-border' | 'accent-solid' | 'accent-solid-hover' | 'accent-on-solid' | 'accent-text' | 'brand-bg' | 'brand-border' | 'brand-solid' | 'brand-on-solid' | 'brand-text' | 'success-solid' | 'success-text' | 'success-bg' | 'success-on-solid' | 'warning-solid' | 'warning-text' | 'warning-bg' | 'warning-on-solid' | 'danger-solid' | 'danger-text' | 'danger-bg' | 'danger-on-solid' | 'info-solid' | 'info-text' | 'info-bg' | 'info-on-solid' | 'surface-app' | 'surface-surface' | 'surface-raised' | 'surface-hover' | 'surface-active' | 'surface-shadow-color' | 'border-control' | 'border-default' | 'border-strong' | 'text-primary' | 'text-secondary' | 'text-muted' | 'text-disabled' | 'chart-categorical-1' | 'chart-categorical-2' | 'chart-categorical-3' | 'chart-categorical-4' | 'chart-categorical-5' | 'chart-categorical-6' | 'chart-categorical-7' | 'chart-categorical-8' | 'chart-sequential-1' | 'chart-sequential-2' | 'chart-sequential-3' | 'chart-sequential-4' | 'chart-sequential-5' | 'chart-sequential-6' | 'chart-diverging-1' | 'chart-diverging-2' | 'chart-diverging-3' | 'chart-diverging-4' | 'chart-diverging-5' | 'chart-diverging-6' | 'chart-diverging-7';
export type SharedToken = 'font-family-ui' | 'font-family-mono' | 'font-size-xs' | 'font-size-sm' | 'font-size-base' | 'font-size-md' | 'font-size-lg' | 'font-size-xl' | 'font-size-2xl' | 'font-size-3xl' | 'font-lineHeight-xs' | 'font-lineHeight-sm' | 'font-lineHeight-base' | 'font-lineHeight-md' | 'font-lineHeight-lg' | 'font-lineHeight-xl' | 'font-lineHeight-2xl' | 'font-lineHeight-3xl' | 'font-weight-regular' | 'font-weight-medium' | 'font-weight-semibold' | 'font-weight-bold' | 'space-1' | 'space-2' | 'space-3' | 'space-4' | 'space-5' | 'space-6' | 'space-8' | 'space-10' | 'space-12' | 'space-16' | 'space-20' | 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-full' | 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'control-sm' | 'control-md' | 'control-lg' | 'touchMin' | 'duration-micro' | 'duration-panel' | 'easing-out' | 'easing-in';
export declare const theme: Record<ThemeName, Record<ColorToken, string>>;
export declare const shared: Record<SharedToken, string>;
export declare const cli: {
  status: Record<string, { ansi: string; mark: string }>;
  exitCode: Record<string, number>;
  rules: string[];
};
declare const _default: { theme: typeof theme; shared: typeof shared; cli: typeof cli };
export default _default;
