/**
 * Token di design condivisi tra web e mobile.
 *
 * Solo valori puri (colori, font, spaziature, ombre, ecc.).
 * Nessun componente — web e mobile hanno superfici di rendering diverse
 * (Piano_Sviluppo_App.md §3 — nota su packages/ui).
 */

// ---------------------------------------------------------------------------
// Colori — palette
// ---------------------------------------------------------------------------
export const colors = {
  /**
   * Verde oliva scuro — unico accento del brand su tutta la piattaforma.
   * Non introdurre un secondo accento (redesign audit 30/07/2026): la
   * famiglia "earth" (bronzo/ocra) qui presente in precedenza non era
   * utilizzata in nessuna pagina ed è stata rimossa.
   */
  green: {
    50: '#f0f7f0',
    100: '#d9eed9',
    200: '#b5ddb5',
    300: '#85c485',
    400: '#52a652',
    500: '#2e7d32',
    600: '#1b5e20',
    700: '#145214',
    800: '#0d3b0d',
    900: '#082408',
  },

  /** Grigio caldo — testi e superfici neutre. */
  gray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },

  /** Bianco e nero. */
  white: '#ffffff',
  black: '#000000',

  /** Rosso per errori e scadenze urgenti. */
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#dc2626',
    600: '#b91c1c',
    700: '#991b1b',
    800: '#7f1d1d',
    900: '#450a0a',
  },

  /** Giallo/ambra per avvisi. */
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#d97706',
    600: '#b45309',
    700: '#92400e',
  },
} as const;

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },

  /** Pesi disponibili (Inter). */
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  /** Scala tipografica. */
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },

  /** Altezza di riga. */
  leading: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// ---------------------------------------------------------------------------
// Spaziature
// ---------------------------------------------------------------------------
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------
export const radius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// ---------------------------------------------------------------------------
// Ombre
// ---------------------------------------------------------------------------
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// ---------------------------------------------------------------------------
// Breakpoint (solo riferimento — usati in CSS via media query)
// ---------------------------------------------------------------------------
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ---------------------------------------------------------------------------
// Z-index
// ---------------------------------------------------------------------------
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;
