import { useEffect, useRef, useState } from "react";
import type { Markmap } from 'markmap-view';
import { MarkmapViewerProps } from "../types/component-types";

// It converts the markdown content to a map using markmap library dynamically
export function MarkmapViewer({ markdown }: MarkmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    return () => {
      if (markmapRef.current) {
        markmapRef.current.destroy();
        markmapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setHasError(false);

    if (!markdown) {
      if (markmapRef.current) {
        markmapRef.current.destroy();
        markmapRef.current = null;
      }
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
      }
      return;
    }

    const svgElement = svgRef.current;
    if (!svgElement) return;

    let isMounted = true;

    const renderMarkmap = async () => {
      try {
        const { Transformer } = await import('markmap-lib');
        const { Markmap } = await import('markmap-view');
        const DOMPurify = (await import('dompurify')).default;

        if (!isMounted) return;

        const transformer = new Transformer();
        const sanitizedMarkdown = DOMPurify.sanitize(markdown);
        const { root } = transformer.transform(sanitizedMarkdown);

        if (!markmapRef.current) {
          markmapRef.current = Markmap.create(svgElement, {
            scrollForPan: true
          });
        }
        
        markmapRef.current.setData(root);
        markmapRef.current.fit();
      } catch (e) {
        console.error('Failed to render markmap', e);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    void renderMarkmap();

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  if (hasError) {
    return (
      <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-muted">
        <p className="text-error">Failed to load mindmap view</p>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-muted">
        <p>No content to display in Mind Map</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-base markmap-wrapper">
      <svg 
        ref={svgRef} 
        className="w-full h-full flex-1 markmap-svg" 
        style={{ minHeight: '600px' }} 
      />
    </div>
  );
}
