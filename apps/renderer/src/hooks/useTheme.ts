import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('use theme must be used within a ThemeProvider');
  }
  return context;
};
