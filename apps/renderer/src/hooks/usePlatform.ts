import { useContext } from 'react';
import { PlatformAdapter } from '@package/platform-adapters';
import { PlatformContext } from '../context/PlatformProvider';

export function usePlatformAPI(): PlatformAdapter {
  const platform = useContext(PlatformContext);
  if (!platform) {
    throw new Error('usePlatform must be used inside PlatformProvider.');
  }

  return platform;
}
