import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FigmaTabBar } from '@/components/FigmaTabBar';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused, color, size }: { name: IoniconsName; focused: boolean; color: string; size: number }) {
  return <Ionicons name={focused ? name : `${name}-outline` as IoniconsName} size={size} color={color} />;
}

export default function CitizenLayout() {
  return (
    <Tabs
      tabBar={(props) => <FigmaTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="home" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="globe" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="document-text" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="mail" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="person" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="service-detail"
        options={{ href: null }}
      />
    </Tabs>
  );
}
