import React, { useEffect, useRef, useState } from 'react';
import { SearchBarProps } from '../types/component-types';

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
    <div className="search-bar" role="search">
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        className="search-input"
        onChange={(e) => setLoacalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search in the document"
        aria-label="Search in document"
      />

      {query && (
        <div className="flex items-center gap-2">
          {matchCount > 0 ? (
            <span className="match-counter">
              {currentMatch} / {matchCount}
            </span>
          ) : (
            <span className="no-matches">No results</span>
          )}
        </div>
      )}

      <div className="flex gap-1">
        <button onClick={onPrev} aria-label="Previous match">
          Prev
        </button>
        <button onClick={onNext} aria-label="Next match">
          Next
        </button>
        <button onClick={onClose} aria-label="Close search">
          Close
        </button>
      </div>
    </div>
  );
}
