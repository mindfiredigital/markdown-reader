import { useEffect, useRef } from "react";
import { MarkmapViewerProps } from "../types/component-types";

// It converts the markdown content to a map using markmap library dynamically
export function MarkmapViewer({ markdown }: MarkmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<any>(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if (!markdown) {
      if (markmapRef.current) {
        markmapRef.current.destroy();
        markmapRef.current = null;
      }
      svgElement.innerHTML = '';
      return;
    }

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
      }
    };

    void renderMarkmap();

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  if (!markdown) {
    return (
      <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-muted">
        <p>No content to display in Mind Map</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-base markmap-wrapper">
      <style>{`
        .markmap-wrapper svg text {
          fill: var(--color-text) !important;
        }
        .markmap-wrapper svg foreignObject,
        .markmap-wrapper svg foreignObject * {
          color: var(--color-text) !important;
        }
        .markmap-wrapper svg foreignObject pre,
        .markmap-wrapper svg foreignObject code {
          background-color: var(--color-surface) !important;
          color: var(--color-text) !important;
          text-shadow: none !important;
        }
      `}</style>
      <svg 
        ref={svgRef} 
        className="w-full h-full flex-1" 
        style={{ minHeight: '600px' }} 
      />
    </div>
  );
}
