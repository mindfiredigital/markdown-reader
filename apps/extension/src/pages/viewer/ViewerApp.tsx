import { CSSProperties, useEffect, useRef, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { MarkdownView } from '../../components/MarkdownView';
import { TocPanel } from '../../components/TocPanel';
import { Toolbar } from '../../components/Toolbar';
import { useDocumentSearch } from '../../hooks/useDocumentSearch';
import { useMarkdownDocument } from '../../hooks/useMarkdownDocument';
import { readMarkdownFile } from '../../platform/fileAccess';
import { OpenedMarkdownDocument } from '../../types';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';

export function ViewerApp() {
  const [openedFile, setOpenedFile] = useState<OpenedMarkdownDocument | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const { theme, fontSize, setFontSize, toggleTheme } = useExtensionSettings();
  const { document, isRendering, error: renderError } = useMarkdownDocument(openedFile);
  const search = useDocumentSearch(document.html);
  const error = fileError || renderError;
  const viewerStyle = { '--reader-font-size': `${fontSize}px` } as CSSProperties;

  useEffect(() => {
    if (!search.query || search.currentMatch === 0) return;

    requestAnimationFrame(() => {
      const matches = contentRef.current?.querySelectorAll('mark.search-match');
      matches?.[search.currentMatch - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [search.currentMatch, search.highlightedHtml, search.query]);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setFileError('');
    try {
      setOpenedFile(await readMarkdownFile(file));
      search.clearSearch();
    } catch (error: unknown) {
      setFileError(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <main className={`viewer viewer-${theme}`} style={viewerStyle}>
      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <Toolbar
        fileName={openedFile?.name}
        query={search.query}
        matchCount={search.matchCount}
        currentMatch={search.currentMatch}
        onOpenFile={() => fileInputRef.current?.click()}
        onQueryChange={search.setQuery}
        onPreviousMatch={search.goToPreviousMatch}
        onNextMatch={search.goToNextMatch}
        onToggleTheme={toggleTheme}
        onFontSizeChange={setFontSize}
      />
      <div className="workspace">
        <TocPanel items={document.toc} scrollRoot={contentRef.current} />
        <section ref={contentRef} className="content" tabIndex={-1}>
          {isRendering && <div className="state">Rendering...</div>}
          {error && <div className="state state-error">{error}</div>}
          {!isRendering && !error && !openedFile && (
            <EmptyState onChooseFile={() => fileInputRef.current?.click()} />
          )}
          {!isRendering && !error && openedFile && <MarkdownView html={search.highlightedHtml} />}
        </section>
      </div>
    </main>
  );
}
