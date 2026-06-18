

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import 'katex/dist/katex.min.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlatformInitializer } from './components/PlatformInitializer';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <PlatformInitializer/>
    </ErrorBoundary>
  </StrictMode>
);
