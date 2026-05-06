import { useEffect, useState, useRef, useCallback } from 'react';
import { useFile } from './hooks/useFile';
import { Welcome } from './components/Welcome';
import { Reader } from './components/Reader';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { useToc } from './hooks/useTOC';
import { Sidebar } from './components/Sidebar';
import { useWatcher } from './hooks/useWatcher';
import { saveScrollPos, getScrollPos } from './renderer/scroll';
import { Toast } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useSearch } from './hooks/useSearch';
import { SearchBar } from './components/SearchBar';
import { useSettings } from './hooks/useSettings';
import { StatusBar } from './components/StatusBar';
import { MENU_EVENTS } from '@package/shared-constants';




export default function App() {
const { html, filePath, error, isLoading, openFile, toc, reloadFile,recentFiles,loadFile } = useFile();  
const { theme, toggleTheme } = useTheme();
  const {activeId,scrollToHeading}=useToc(toc);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [showToast, setShowToast]=useState(false);
  const {query,matchCount,currentMatch,isSearchOpen,openSearch,closeSearch,setQuery,goToNextMatch,goToPrevMatch,getHiglightedHtml}=useSearch(html);
  const {increaseFontSize,decreaseFontSize,resetFontSize,fontSize}=useSettings();

  const contentRef=useRef<HTMLDivElement>(null);
  const debounceTimer=useRef<number | undefined>(undefined);
  const scrollTimer=useRef<number | undefined>(undefined);

useEffect(() => {
  if (!window.api?.onMenuEvent) return;
  window.api.onMenuEvent(MENU_EVENTS.OPEN_FILE,      () => void openFile());
  window.api.onMenuEvent(MENU_EVENTS.SEARCH_DOCUMENT,() => openSearch());
  window.api.onMenuEvent(MENU_EVENTS.TOGGLE_TOC,     () => setSidebarOpen(p => !p));
  window.api.onMenuEvent(MENU_EVENTS.CYCLE_THEME,    () => toggleTheme());
  window.api.onMenuEvent(MENU_EVENTS.ZOOM_IN,        () => increaseFontSize());
  window.api.onMenuEvent(MENU_EVENTS.ZOOM_OUT,       () => decreaseFontSize());
  window.api.onMenuEvent(MENU_EVENTS.ZOOM_RESET,     () => resetFontSize());
  return () => {
    if (window.api?.removeMenuListeners) {
      window.api.removeMenuListeners();
    }
  };
}, [openFile, openSearch, toggleTheme, increaseFontSize, decreaseFontSize, resetFontSize]);

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

      if((e.metaKey || e.ctrlKey) && e.key==='f'){
        e.preventDefault();
        openSearch();
      }

      if((e.metaKey||e.ctrlKey) && e.key==='='){
        e.preventDefault();
        increaseFontSize()
      }

      if((e.metaKey||e.ctrlKey) && (e.key==='-'||e.key==='+')){
        e.preventDefault();
        decreaseFontSize();
      }

      if((e.metaKey||e.ctrlKey) && e.key==='0'){
        e.preventDefault();
        resetFontSize();
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
    <>
    <div className="h-screen flex flex-col bg-bg text-text-base">
      {isLoading && <Loading />}
      {isSearchOpen && (
        <SearchBar
          query={query}
          matchCount={matchCount}
          currentMatch={currentMatch}
          onQueryChange={setQuery}
          onNext={goToNextMatch}
          onPrev={goToPrevMatch}
          onClose={closeSearch}
        />
      )}

      {error && <Error message={error} onRetry={openFile} />}

      {!filePath && !isLoading && (
        <Welcome onOpen={openFile} recentFiles={recentFiles} onOpenRecent={loadFile} />
      )}

      {html && !isLoading && !error && (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            tocItems={toc}
            activeId={activeId}
            onSelect={scrollToHeading}
            isVisible={sidebarOpen}
          />
          <main
            ref={contentRef}
            className="flex-1 overflow-y-auto"
            onScroll={scroll}
          >
            <Reader html={html} getHiglightedHtml={getHiglightedHtml} />
          </main>
        </div>
      )}

      <Toast message="File updated" show={showToast} onDone={() => setShowToast(false)} />
      <StatusBar filePath={filePath} theme={theme} fontSize={fontSize}/>
    </div>
    </>
  )}