import React from 'react';
import { KBArticle } from '../../kb/types';

export const KBCard = ({ article, onSelect }: { article: KBArticle; onSelect?: (id: string) => void }) => {
  return (
    <button
      onClick={() => {
        onSelect?.(article.id);
        const url = new URL(window.location.href);
        url.searchParams.set('kb', article.id);
        window.history.pushState({}, '', url.toString());
        window.location.reload();
      }}
      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="font-semibold text-gray-900">{article.title}</div>
      <div className="text-sm text-gray-600 mt-1">{article.summary}</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {article.tags.map(t => (
          <span key={t} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
};


