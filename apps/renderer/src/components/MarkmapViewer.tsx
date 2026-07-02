import { useEffect, useRef, useState,useCallback } from "react";
import type { Markmap } from 'markmap-view';
import { MarkmapViewerProps } from "../types/component-types";
import { Icons } from "../utils/constants/icon-contants";
import { browserDownload } from "../utils/helpers/extension-export-helper";
import { logger } from "../utils/helpers/logger";

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
        const { root } = transformer.transform(markdown);
        const walkAndSanitize = (node: any) => {
          if (node.content) {
            node.content = DOMPurify.sanitize(node.content);
          }
          if (node.children) {
            node.children.forEach(walkAndSanitize);
          }
        };
        walkAndSanitize(root);

        if (!markmapRef.current) {
          markmapRef.current = Markmap.create(svgElement, {
            scrollForPan: true
          });
        }
        
        markmapRef.current.setData(root);
        markmapRef.current.fit();
      } catch (e) {
        logger.error('Failed to render markmap:', e);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    void renderMarkmap();

    return () => {
      isMounted = false;
      if (markmapRef.current) {
        markmapRef.current.destroy();
        markmapRef.current = null;
      }
    };
  }, [markdown]);

  const handleDownloadSvg = useCallback(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    const g = svgElement.querySelector('g');
    const clonedG = clone.querySelector('g');
    
    if (g && clonedG) {
      const bbox = g.getBBox();
      const padding = 20;
      clone.setAttribute(
        'viewBox', 
        `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
      );
      clone.setAttribute('width', String(bbox.width + padding * 2));
      clone.setAttribute('height', String(bbox.height + padding * 2));
      clonedG.removeAttribute('transform');
    }
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(clone);
    if (!source.match(/^<\?xml[^>]+>/)) {
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }
    const styleMatch = source.match(/<style>[\s\S]*?<\/style>/);
    if (!styleMatch) {
      const styles = `
        <style>
          svg text { fill: #c9d1d9; }
          svg foreignObject { color: #c9d1d9; }
          svg foreignObject pre, svg foreignObject code { background-color: #0d1117; color: #c9d1d9; }
          .markmap-node { stroke: #3b82f6; }
          .markmap-link { stroke: #3b82f6; }
        </style>
      `;
      source = source.replace(/<svg[^>]*>/, `$&${styles}`);
    }

    browserDownload(source, 'mindmap.svg', 'image/svg+xml;charset=utf-8');
  }, []);
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
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center bg-surface p-4 text-text-base markmap-wrapper relative group">
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-md hover:bg-hover hover:text-primary transition-colors text-sm shadow-sm"
          title="Download SVG"
        >
          <Icons.Download size={16} />
          <span>Download SVG</span>
        </button>
      </div>
      <svg 
        ref={svgRef} 
        className="w-full h-full flex-1 markmap-svg" 
        style={{ minHeight: '600px' }} 
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
