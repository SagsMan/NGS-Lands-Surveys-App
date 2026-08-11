import { Text, View } from 'react-native';

import { styles } from '@/theme';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.stateContent}>
      <View style={styles.stateIcon}>
        <Text style={styles.stateIconText}>—</Text>
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      {description ? <Text style={styles.stateDescription}>{description}</Text> : null}
    </View>
  );
}
