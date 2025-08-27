import React, { useMemo, useState, useEffect } from 'react';
import { KB_ARTICLES } from '../../kb/mock-data';
import { KBCard } from './KBCard';
import { KBArticlePage } from './KBArticlePage';

export const KBBrowser = () => {
  const [tag, setTag] = useState<string>('all');
  const [q, setQ] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const allTags = useMemo(() => {
    const t = new Set<string>();
    KB_ARTICLES.forEach(a => a.tags.forEach(x => t.add(x)));
    return ['all', ...Array.from(t).sort()];
  }, []);

  const items = useMemo(() => {
    return KB_ARTICLES.filter(a => (tag === 'all' ? true : a.tags.includes(tag))).filter(a =>
      q.trim()
        ? [a.title, a.summary, a.tags.join(' '), (a.keywords || []).join(' ')].join(' ').toLowerCase().includes(q.toLowerCase())
        : true
    );
  }, [tag, q]);

  // Check for selected article from sessionStorage
  useEffect(() => {
    const selectedId = sessionStorage.getItem('selectedKBArticle');
    if (selectedId) {
      setSelectedArticleId(selectedId);
      sessionStorage.removeItem('selectedKBArticle'); // Clear after use
    }
  }, []);

  // If an article is selected, show the article page
  if (selectedArticleId) {
    const selectedArticle = KB_ARTICLES.find(a => a.id === selectedArticleId);
    if (selectedArticle) {
      return (
        <div className="h-full">
          <KBArticlePage 
            article={selectedArticle} 
            onBack={() => setSelectedArticleId(null)} 
          />
        </div>
      );
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 flex items-center gap-2">
        <select
          value={tag}
          onChange={e => setTag(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          {allTags.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filter articles…"
          className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="p-3 space-y-2 overflow-y-auto">
        {items.map(a => (
          <KBCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
};


