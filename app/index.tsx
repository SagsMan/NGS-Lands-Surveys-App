import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components';
import { styles } from '@/theme';

export default function FoundationRoute() {
  const insets = useSafeAreaInsets();

  return (
    <Screen
      contentContainerStyle={{
        ...styles.screenContent,
        paddingTop: insets.top + styles.screenContent.padding,
        paddingBottom: insets.bottom + styles.screenContent.padding,
      }}
    >
      <StatusBar style="auto" />
      <View style={styles.foundationMarker} />
    </Screen>
  );
}
