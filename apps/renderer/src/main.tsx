

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./index.css";
import { ThemeProvider } from './context/ThemeProvider'
import 'katex/dist/katex.min.css';
import { TabProvider } from './context/TabProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <ThemeProvider>
      <TabProvider>
        <App />
      </TabProvider>
    </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
