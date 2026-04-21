import React,{createContext,useState} from "react";
import { ThemeContextType } from "../types/component-types";



export const ThemeContext=createContext<ThemeContextType|undefined>(undefined);

export const ThemeProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [themeSource,setThemeSource]=useState('System');
    const toggleTheme=async()=>{
        const darkMode=await window.theme.toggle();
        setThemeSource(darkMode ?'Dark':'Light');
    }

    const resetToSystem= async()=>{
        await window.theme.reset();
        setThemeSource('System')
    }

    return(
        <ThemeContext.Provider value={{themeSource,toggleTheme,resetToSystem}}>
            {children}
        </ThemeContext.Provider>
    );
};