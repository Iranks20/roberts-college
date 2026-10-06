/** Colours come from CSS variables in src/index.css so light and dark themes share one palette. */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:not([data-theme=light] *) }', '&:is([data-theme=dark] *)']],
  theme: {
    extend: {
      colors: {
        paper: v('paper'), surface: v('surface'), sunken: v('sunken'),
        ink: v('ink'), muted: v('muted'), faint: v('faint'), line: v('line'),
        nile: { DEFAULT: v('nile'), deep: v('nile-deep'), tint: v('nile-tint'), on: v('nile-on') },
        crane: { DEFAULT: v('crane'), tint: v('crane-tint'), ink: v('crane-ink') },
        good: { DEFAULT: v('good'), tint: v('good-tint') },
        warn: { DEFAULT: v('warn'), tint: v('warn-tint') },
        bad: { DEFAULT: v('bad'), tint: v('bad-tint') },
        info: { DEFAULT: v('info'), tint: v('info-tint') },
        band: v('band'), 'on-band': v('on-band'),
      },
      fontFamily: {
        display: ['"Young Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: { ctl: '10px', card: '14px', panel: '20px' },
      boxShadow: {
        lift: '0 1px 2px rgb(var(--shadow) / 0.06), 0 8px 24px -12px rgb(var(--shadow) / 0.18)',
        pop: '0 12px 40px -12px rgb(var(--shadow) / 0.35)',
      },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
}
