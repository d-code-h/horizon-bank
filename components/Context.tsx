'use client';

import { createContext, ReactNode } from 'react';

export const GlobalContext = createContext();

export default function contextProvider({ children }: { children: ReactNode }) {
  return (
    <GlobalContext.Provider
      value={{
        id: '',
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
