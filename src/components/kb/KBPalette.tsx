import React, { useEffect, useMemo, useState } from 'react';
import { KB_ARTICLES } from '../../kb/mock-data';
import { searchKB } from '../../kb/search';
import { KBCard } from './KBCard';

export const KBPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchKB(KB_ARTICLES, query, 10), [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search knowledge base…"
            className="w-full outline-none text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slack-accent focus:border-transparent"
          />
          <div className="text-[11px] text-gray-500 mt-1">Type to search. Esc to close.</div>
        </div>
        <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 && (
            <div className="text-sm text-gray-500">No results yet. Try keywords like "okta figma".</div>
          )}
          {results.map(r => (
            <KBCard key={r.id} article={r} onSelect={() => onClose()} />
          ))}
        </div>
      </div>
    </div>
  );
};


