import React,{ useEffect, useState, useRef } from 'react';
import { useFile } from './hooks/useFile';
import { Welcome } from './components/Welcome';
import { Reader } from './components/Reader';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { useToc } from './hooks/useTOC';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useSearch } from './hooks/useSearch';
import { SearchBar } from './components/SearchBar';
import { useSettings } from './hooks/useSettings';
import { StatusBar } from './components/StatusBar';
import { FileBrowser } from './components/FileBrowser';
import { TabBar } from './components/TabBar';
import { useTabStore } from './hooks/useTabStore';
import { Icons } from './utils/constants/icon-contants';
import { useShortcuts } from './hooks/useShortcuts';
import { useMenuEvents } from './hooks/useMenuEvents';
import { UpdateBanner } from './components/UpdateBanner';
import { useExport } from './hooks/useExport';
import { useDragDrop } from './hooks/useDragDrop';
import { useTabNavigation } from './hooks/useTabNavigation';
import { DragDrop } from './components/DragDrop';
import { useLayout } from './hooks/useLayout';
import { useFileActions } from './hooks/useFileActions';
import { useOpenFilePath } from './hooks/useOpenFilePath';
import { useFilePersistence } from './hooks/useFilePersistence';
import { ReaderToolbar } from './components/ReaderToolbar';
import { SettingsPanel } from './components/SettingsPanel';

export default function App() {
  const {  error, isLoading, openFile, toc,recentFiles,loadFile } =useFile();
  const { state, dispatch } = useTabStore();
  const activeTab = state.tabs.find((tab) => tab.id === state.activeTabId) ?? null;
  const activeToc=activeTab?.toc?? toc;
  const { theme, toggleTheme,setTheme} = useTheme();
  const {activeId,scrollToHeading}=useToc(activeToc);
  const {settings,increaseFontSize,decreaseFontSize,resetFontSize,fontSize,updateSettings}=useSettings();
  const {query,matchCount,currentMatch,isSearchOpen,openSearch,closeSearch,setQuery,goToNextMatch,goToPrevMatch,getHiglightedHtml} = useSearch(activeTab?.html ?? '');
  const [showToast, setShowToast] = useState(false);
  const contentRef=useRef<HTMLDivElement>(null);
  const {exportHtml,exportPdf,exportDocx}=useExport(activeTab);
  const {goToNextTab,goToPreviousTab,closeActiveTab}=useTabNavigation(state.tabs,state.activeTabId,dispatch);
  const {sidebarOpen,setSidebarOpen,fileBrowserOpen,setFileBrowserOpen,focusMode,toggleFocusMode,toggleSidebar,toggleFileBrowser}=useLayout();
  const {folderTree,openFolder,loadFileInTab,openFileDialog}=useFileActions({loadFile,dispatch});
  const {isDraggingFile,handleDragEnter,handleDragOver,handleDragLeave,handleDrop}=useDragDrop(loadFileInTab);
  useOpenFilePath(loadFileInTab);
  const {scroll}=useFilePersistence({activeTab,loadFile,dispatch,contentRef,setShowToast});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(()=>{
    if(!window.api?.getAppVersion) return;
    void window.api.getAppVersion().then(setAppVersion).catch(()=>{});
  })
  
  useEffect(()=>{
    if(folderTree){
      setFileBrowserOpen(true);
    }
  },[folderTree,setFileBrowserOpen]);

  useMenuEvents({
  onOpenFile: openFileDialog,
  onOpenFolder: openFolder,
  onSearchDocument: openSearch,
  onToggleToc: toggleSidebar,
  onToggleBrowser: toggleFileBrowser,
  onFocusMode: toggleFocusMode,
  onCycleTheme: toggleTheme,
  onZoomIn: increaseFontSize,
  onZoomOut: decreaseFontSize,
  onZoomReset: resetFontSize,
  onNextTab: goToNextTab,
  onPreviousTab: goToPreviousTab,
  onCloseTab: closeActiveTab,
  onExportHtml:exportHtml,
  onExportPdf:exportPdf,
  onExportDocx:exportDocx,
  onOpenSettings:()=>setSettingsOpen(true),
  onSetTheme:setTheme
});

useShortcuts({
  onOpenFile: openFileDialog,
  onOpenFolder: openFolder,
  onToggleFocusMode: toggleFocusMode,
  onToggleTheme: toggleTheme,
  onOpenSearch: openSearch,
  onCloseSearch: closeSearch,
  onZoomIn: increaseFontSize,
  onZoomOut: decreaseFontSize,
  onZoomReset: resetFontSize,
  onToggleSidebar: toggleSidebar,
  onToggleFileBrowser: toggleFileBrowser,
  onOpenSettings:()=>setSettingsOpen(true)
});
  

  return (
    <>
      <div className="h-screen flex flex-col bg-bg text-text-base"  onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {isDraggingFile &&(
          <DragDrop/>
        )}
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
        {!focusMode && (
          <TabBar
            tabs={state.tabs}
            activeTabId={state.activeTabId}
            onSwitch={(id) => dispatch({ type: 'SWITCH_TAB', payload: { tabId: id } })}
            onClose={(id) => dispatch({ type: 'CLOSE_TAB', payload: { tabId: id } })}
          />
        )}
        <UpdateBanner/>

        {error && <Error message={error} onRetry={openFile} />}

        {!activeTab && !isLoading && (
          <Welcome onOpen={openFileDialog}
            recentFiles={recentFiles}
            onOpenRecent={loadFileInTab}
          />
        )}

        {activeTab && !isLoading && !error && (
          <div className="flex flex-1 overflow-hidden relative">
            {!focusMode && (
              <FileBrowser
                tree={folderTree}
                activeFilePath={activeTab?.filePath ?? ''}
                onOpenFile={loadFileInTab}
                isVisible={fileBrowserOpen}
              />
            )}
            {!sidebarOpen && !focusMode && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 left-4 z-20 p-2 text-text-muted hover:text-text-base transition-colors"
                aria-label="Open sidebar"
              >
                <Icons.Hamburger size={16} />
              </button>
            )}
            {!focusMode && (
              <Sidebar
                tocItems={activeToc}
                activeId={activeId}
                onSelect={scrollToHeading}
                isVisible={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}
            {!focusMode && (
              <ReaderToolbar fontSize={fontSize} theme={theme} onZoomIn={increaseFontSize} onZoomOut={decreaseFontSize} onZoomReset={resetFontSize} onToggleTheme={toggleTheme}/>
            )}
            <main 
            ref={contentRef} 
            className="flex-1 overflow-y-auto" 
            onScroll={scroll}
            >
              <Reader html={activeTab.html} getHiglightedHtml={getHiglightedHtml} />
            </main>
          </div>
        )}

        <Toast message="File updated" show={showToast} onDone={() => setShowToast(false)} />
        {!focusMode && (
          <StatusBar filePath={activeTab?.filePath ?? ''} theme={theme} fontSize={fontSize} />
        )}
        <SettingsPanel settings={settings} isOpen={settingsOpen} onClose={()=>setSettingsOpen(false)} onChange={(partial)=>void updateSettings(partial)} appVersion={appVersion}/>
      </div>
    </>
  )}
