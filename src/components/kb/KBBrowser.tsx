import React, { useMemo, useState } from 'react';
import { KB_ARTICLES } from '../../kb/mock-data';
import { KBCard } from './KBCard';

export const KBBrowser = () => {
  const [tag, setTag] = useState<string>('all');
  const [q, setQ] = useState('');
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


