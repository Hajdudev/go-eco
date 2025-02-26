'use client';

import { AppProvider } from './AppProvider';
import React from 'react';

export function Provider({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
