import { createContext, useMemo, type PropsWithChildren } from 'react';

export type AppState = {
  isReady: boolean;
};

export const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const value = useMemo<AppState>(() => ({ isReady: true }), []);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
