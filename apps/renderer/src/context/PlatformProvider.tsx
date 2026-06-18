import React, { createContext} from 'react';
import type { PlatformAdapter } from '@package/platform-adapters';

export const PlatformContext = createContext<PlatformAdapter | null>(null);

export function PlatformProvider({
  platform,
  children,
}: {
  platform: PlatformAdapter;
  children: React.ReactNode;
}) {
  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>;
}

