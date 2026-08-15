import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#1BB53D';

export function FigmaTabBar({ state, descriptors, navigation }: {
  state: { routes: { key: string; name: string }[]; index: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptors: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={[styles.btn, focused && styles.activeBtn]}
            >
              {options.tabBarIcon?.({
                focused,
                color: focused ? '#FFFFFF' : 'rgba(0,0,0,0.5)',
                size: 18,
              })}
              <Text
                style={[styles.label, focused ? styles.activeLabel : styles.inactiveLabel]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    height: 68,
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  activeBtn: {
    backgroundColor: PRIMARY,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 8,
    lineHeight: 8,
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  inactiveLabel: {
    color: 'rgba(0,0,0,0.5)',
  },
});
