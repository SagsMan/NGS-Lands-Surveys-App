import {
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, styles } from '@/theme';

type ScreenProps = ScrollViewProps & {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, contentContainerStyle, ...props }: ScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={[styles.screenContent, contentContainerStyle]}
      style={styles.screen}
      contentInsetAdjustmentBehavior="never"
      scrollIndicatorInsets={{ right: 1 }}
      {...props}
    >
      <View style={{ backgroundColor: colors.background }}>{children}</View>
    </ScrollView>
  );
}
