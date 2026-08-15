import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused, color }: { name: IoniconsName; focused: boolean; color: string }) {
  return <Ionicons name={focused ? name : `${name}-outline` as IoniconsName} size={24} color={color} />;
}

export default function StaffLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon name="home" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused, color }) => <TabIcon name="checkmark-circle" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inspections"
        options={{
          title: 'Inspections',
          tabBarIcon: ({ focused, color }) => <TabIcon name="search" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications',
          tabBarIcon: ({ focused, color }) => <TabIcon name="clipboard" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => <TabIcon name="person" focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}
