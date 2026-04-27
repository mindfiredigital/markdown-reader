import { useEffect, useState, useRef, useCallback } from 'react';
import { useFile } from './hooks/useFile';
import { Welcome } from './components/Welcome';
import { Reader } from './components/Reader';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { useTOC } from './hooks/useTOC';
import { Sidebar } from './components/Sidebar';
import { useWatcher } from './hooks/useWatcher';
import { saveScrollPos, getScrollPos } from './renderer/scroll';
import { Toast } from './components/Toast';
import { useTheme } from './hooks/useTheme';



export default function App() {
const { html, filePath, error, isLoading, openFile, toc, reloadFile } = useFile();  const { theme, toggleTheme } = useTheme();
  const {activeId,scrollToHeading}=useTOC(toc);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [showToast, setShowToast]=useState(false);

  const contentRef=useRef<HTMLDivElement>(null);

  const debounceTimer=useRef<number | undefined>(undefined);
  const scrollTimer=useRef<number | undefined>(undefined);

  //key board shorcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        openFile();
      }

      if (e.key==='[') {
        setSidebarOpen(prev=>!prev)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openFile,toggleTheme]);
  const handleFileChange = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(async () => {
      const currentScroll = contentRef.current?.scrollTop ?? 0;
      await reloadFile();
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = currentScroll;
        }
      });
      setShowToast(true);
    }, 150);
  }, [reloadFile]);
  const scroll = () => {
    if (!filePath || !contentRef.current) return;
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = window.setTimeout(() => {
      saveScrollPos(filePath, contentRef.current!.scrollTop);
    }, 100);
  };
  useWatcher(filePath, handleFileChange);
  useEffect(() => {
    if (!filePath || !html) return;
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = getScrollPos(filePath);
      }
    });
  }, [html, filePath]);
  

  return (
    <div className="h-screen flex flex-col app-bg">
      {isLoading && <Loading />}
      <div className='flex justify-between items-center px-4 py-2 border-b border-theme'>
        <span className='text-sm font-medium'>Markdown Reader</span>
        <button onClick={toggleTheme} className='flex items-center gap-1.5 px-2.5 py-1 rounded text-sm text-secondary sidebar-bg border border-theme hover:opacity-80'>
          {theme}
        </button>
      </div>

      {error && <Error message={error} onRetry={openFile} />}
      {!filePath && !isLoading && <Welcome onOpen={openFile} />}

      {html && !isLoading && !error && (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            tocItems={toc}
            activeId={activeId}
            onSelect={scrollToHeading}
            isVisible={sidebarOpen}
          />

          <main ref={contentRef} className="flex-1 overflow-y-auto px-8 py-6" onScroll={scroll}>
            <Reader html={html} />
          </main>
        </div>
      )}

      <Toast message="File updated" show={showToast} onDone={() => setShowToast(false)} />
    </div>
  );
}
