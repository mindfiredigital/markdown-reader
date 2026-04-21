export interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export interface ReaderProps {
  html: string;
}

export interface WelcomeProps {
  onOpen: () => void;
}

export interface ThemeContextType {
  themeSource: string;
  toggleTheme: () => Promise<void>;
  resetToSystem: () => Promise<void>;
}
