import { Pressable, Text, type PressableProps } from 'react-native';

import { styles } from '@/theme';

type ButtonProps = PressableProps & {
  label: string;
};

export function Button({ label, disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        typeof style === 'function' ? style({ pressed, hovered: false }) : style,
      ]}
      {...props}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}
