import { StyleSheet } from 'react-native';

import { colors, radii, spacing, typography } from './tokens';

export { colors, radii, spacing, typography };

export const lightTheme = { colors, mode: 'light' as const };
export const darkTheme = { colors, mode: 'dark' as const };

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  foundationMarker: {
    width: spacing.sm,
    height: spacing.sm,
    alignSelf: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    opacity: 0.45,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
    transform: [{ scale: 0.98 }],
  },
  buttonLabel: {
    color: colors.onAccent,
    fontSize: typography.button,
    fontWeight: '600',
  },
  stateContent: {
    flexGrow: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  stateIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  stateIconText: {
    color: colors.accent,
    fontSize: typography.title,
    fontWeight: '700',
  },
  stateTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateDescription: {
    maxWidth: 320,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
