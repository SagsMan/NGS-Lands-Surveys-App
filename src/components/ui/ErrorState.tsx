import { Text, View } from 'react-native';

import { Button } from './Button';
import { styles } from '@/theme';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Unable to load',
  description = 'Please check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.stateContent}>
      <View style={styles.stateIcon}>
        <Text style={styles.stateIconText}>!</Text>
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateDescription}>{description}</Text>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}
