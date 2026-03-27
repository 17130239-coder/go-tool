/**
 * App-wide constants.
 * Centralised here so they are easy to find and change when reusing this project template.
 */

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------

export const APP_TITLE = 'Go Tool';

/** Theme-aware asset paths for logos and favicons. */
export const ASSETS = {
  logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
  favicon: { light: '/favicon-light.svg', dark: '/favicon-dark.svg' },
  logoMark: { light: '/favicon-light.svg', dark: '/favicon-dark.svg' },
} as const;

// ---------------------------------------------------------------------------
// Layout dimensions
// ---------------------------------------------------------------------------

/** Sidebar expanded width in pixels. */
export const SIDEBAR_WIDTH = 260;

/** Height of the header and logo container in pixels. */
export const HEADER_HEIGHT = 64;

/** Default modal widths used across the app. */
export const MODAL_WIDTH = {
  commandPalette: 720,
  keyboardShortcuts: 620,
} as const;
