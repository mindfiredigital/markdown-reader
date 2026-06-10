import { useEffect, useState } from 'react';
import { extractTOC, renderMarkdown, sanitizeHtml } from '@package/markdown-core';
import { OpenedMarkdownDocument, RenderedMarkdownDocument } from '../types';

const emptyDocument: RenderedMarkdownDocument = {
  html: '',
  toc: [],
};

export function useMarkdownDocument(openedFile: OpenedMarkdownDocument | null) {
  const [document, setDocument] = useState<RenderedMarkdownDocument>(emptyDocument);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!openedFile) {
      setDocument(emptyDocument);
      return;
    }

    setIsRendering(true);
    setError('');
    void renderMarkdown(openedFile.markdown)
      .then((html) => {
        setDocument({
          html: sanitizeHtml(html),
          toc: extractTOC(openedFile.markdown),
        });
      })
      .catch((renderError: unknown) => {
        setError(renderError instanceof Error ? renderError.message : String(renderError));
      })
      .finally(() => setIsRendering(false));
  }, [openedFile]);

  return { document, isRendering, error };
}
