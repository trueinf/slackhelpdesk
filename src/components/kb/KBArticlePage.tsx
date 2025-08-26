import React, { useMemo } from 'react';
import { KB_ARTICLES } from '../../kb/mock-data';

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

export const KBArticlePage = () => {
  const q = useQuery();
  const id = q.get('kb') || '';
  const article = KB_ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold">Article not found</h1>
          <p className="text-gray-600 mt-2">The requested knowledge base article could not be located.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Knowledge Base</div>
            <h1 className="text-2xl font-bold mt-1">{article.title}</h1>
          </div>
          <button onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('kb');
            window.history.pushState({}, '', url.toString());
            window.location.reload();
          }} className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-2 py-1">Back</button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {article.tags.map(t => (
            <span key={t} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
              {t}
            </span>
          ))}
        </div>

        {/* Analytics */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Success rate</div>
            <div className="text-lg font-semibold text-gray-900">{article.successRatePercent ?? 0}%</div>
            <div className="text-xs text-gray-500 mt-1">Resolved without additional steps</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Frequently added follow-ups</div>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {(article.frequentFollowUps || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
              {(!article.frequentFollowUps || article.frequentFollowUps.length === 0) && (
                <li className="text-gray-500">No common follow-ups recorded.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="prose prose-sm max-w-none mt-6">
          <p className="text-gray-700 leading-6 whitespace-pre-wrap">{article.body}</p>
        </div>
      </div>
    </div>
  );
};


