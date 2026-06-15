

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChromeAdapter,ElectronAdapter,isChromeExtensionRuntime,isElectronRuntime ,type PlatformAdapter} from '@package/platform-adapters';
import App from './App'
import "./index.css";
import { ThemeProvider } from './context/ThemeProvider'
import 'katex/dist/katex.min.css';
import { TabProvider } from './context/TabProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import {PlatformProvider} from './context/PlatformProvider';

function createPlatformAdapter(): PlatformAdapter {
  if (isElectronRuntime()) {
    return new ElectronAdapter();
  }

  if (isChromeExtensionRuntime()) {
    return new ChromeAdapter();
  }

  throw new Error('No supported platform adapter was detected.');
}

const platform = createPlatformAdapter();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <PlatformProvider platform={platform}>
    <ThemeProvider>
      <TabProvider>
        <App />
      </TabProvider>
    </ThemeProvider>
    </PlatformProvider>
    </ErrorBoundary>
  </StrictMode>
)
