import React, { useEffect, useRef, useState } from 'react';
import { SearchBarProps } from '../types/component-types';
import { btnClass } from '../utils/constants/style-constants';
import { Icons } from '../utils/constants/icon-contants';
// search bar component
export function SearchBar({
  query,
  matchCount,
  currentMatch,
  onQueryChange,
  onNext,
  onPrev,
  onClose,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery,setLoacalQuery]=useState(query);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(()=>{
    const handler=setTimeout(()=>{
      onQueryChange(localQuery);
    },300);
    return ()=>clearTimeout(handler)
  },[localQuery,onQueryChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onPrev();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-2 p-2 bg-surface border border-border-theme rounded-bl-lg shadow-lg">
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        className="w-56 px-3 py-1.5 text-sm rounded border border-border-theme bg-bg text-text-base placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow"
        onChange={(e) => setLoacalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search in the document"
        aria-label="Search in document"
      />

     {query && (
        <div className="flex items-center gap-2">
          {matchCount > 0 ? (
            <span className="min-w-15 font-mono text-sm text-text-muted">
              {currentMatch} / {matchCount}
            </span>
          ) : (
            <span className="min-w-15 text-sm text-error">No results</span>
          )}
        </div>
      )}

      <div className="flex gap-1">
        <button onClick={onPrev} aria-label="Previous match" className={btnClass}><Icons.ArrowUp size={18} /></button>
        <button onClick={onNext} aria-label="Next match" className={btnClass}><Icons.ArrowDown size={18} /></button>
        <button onClick={onClose} aria-label="Close search" className={btnClass}><Icons.X size={18} /></button>
      </div>
    </div>
  );
}
