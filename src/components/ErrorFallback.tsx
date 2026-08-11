import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from './ui/Button';
import { Screen } from './ui/Screen';
import { styles } from '@/theme';

type ErrorFallbackProps = {
  onRetry: () => void;
};

export function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const insets = useSafeAreaInsets();

  return (
    <Screen
      contentContainerStyle={{
        ...styles.stateContent,
        paddingTop: insets.top + styles.stateContent.padding,
        paddingBottom: insets.bottom + styles.stateContent.padding,
      }}
    >
      <View style={styles.stateIcon}>
        <Text style={styles.stateIconText}>!</Text>
      </View>
      <Text style={styles.stateTitle}>Something went wrong</Text>
      <Text style={styles.stateDescription}>
        The app could not load this area. Try again to continue.
      </Text>
      <Button label="Try again" onPress={onRetry} />
    </Screen>
  );
}
