import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary, ErrorFallback } from '@/components';
import { queryClient } from '@/services/api';
import { AppStateProvider } from '@/state';

export { ErrorFallback as ErrorBoundaryFallback };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <KeyboardProvider>
              <ErrorBoundary>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }} />
              </ErrorBoundary>
            </KeyboardProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
