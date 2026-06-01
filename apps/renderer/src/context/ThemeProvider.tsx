import React,{createContext,useState,useEffect,useCallback} from "react";
import { ThemeContextType,Theme } from "../types/component-types";
import { APPTHEMES } from "../utils/constants/theme-constants";
import { getSystemTheme } from "../utils/helpers/theme-helper";

export const ThemeContext=createContext<ThemeContextType|undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('github-light');

  useEffect(()=>{
    const saved=localStorage.getItem('app-theme');
    if(saved && APPTHEMES.includes(saved as Theme)){
        setTheme(saved as Theme);
    }
  },[])

  useEffect(()=>{
    const media=window.matchMedia('(prefers-color-scheme:dark)');
    const onChange=()=>{
      if(!localStorage.getItem('app-theme')){
        setThemeState(getSystemTheme());
      }
    };
    media.addEventListener('change',onChange);
    return ()=>media.removeEventListener('change',onChange);
  },[]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem('app-theme',t);
    setThemeState(t);
  }, []);

  const toggleTheme = () => {
    const currentIdx=APPTHEMES.indexOf(theme);
    const nextTheme=APPTHEMES[(currentIdx + 1) % APPTHEMES.length] as Theme;
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}