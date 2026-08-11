/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#0a0a0a',
    tint: '#0c3a25',

    // Core surfaces
    background: '#f7faf7',
    foreground: '#0b2418',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#0b2418',

    // Primary action color (buttons, links, active states)
    primary: '#13bf43',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#e8f0e9',
    secondaryForeground: '#173a26',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#e5ece6',
    mutedForeground: '#66726b',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#dcebdd',
    accentForeground: '#0b2418',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#dbe5dc',
    input: '#dbe5dc',

    // Brand-specific surfaces used by the onboarding composition.
    deepGreen: '#0b3d26',
    imageWash: 'rgba(247, 250, 247, 0.78)',
    imageWashStrong: 'rgba(247, 250, 247, 0.9)',
    buttonShadow: 'rgba(8, 64, 28, 0.22)',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 24,
};

export default colors;
