import { ActivityIndicator, Text, View } from 'react-native';

import { colors, styles } from '@/theme';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <View style={styles.stateContent} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={styles.stateDescription}>{label}</Text>
    </View>
  );
}
