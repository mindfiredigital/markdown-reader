import { useEffect } from 'react';
import { useFile } from './hooks/useFile';
import { useTheme } from './hooks/useTheme';
import { Welcome } from './components/Welcome';
import { Reader } from './components/Reader';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import './App.css';


export default function App() {
  const { html, filePath, error, isLoading, openFile } = useFile();
  const { themeSource, toggleTheme, resetToSystem } = useTheme();

  //key board shorcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        openFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openFile]);

  return (
    <div className="app">
      {isLoading && <Loading/>}
      <p>Theme: {themeSource}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={resetToSystem}>Reset</button>


      {error && <Error message={error} onRetry={openFile}/>}

      {!filePath && !isLoading && <Welcome onOpen={openFile} />}

      {html && !isLoading && !error && <Reader html={html} />}
    </div>
  );
}
