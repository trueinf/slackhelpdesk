import React, { useMemo } from 'react';
import { KB_ARTICLES } from '../../kb/mock-data';
import { KBArticle } from '../../kb/types';
import { ArrowLeft } from 'lucide-react';

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

interface KBArticlePageProps {
  article?: KBArticle;
  onBack?: () => void;
}

export const KBArticlePage = ({ article: propArticle, onBack }: KBArticlePageProps = {}) => {
  const q = useQuery();
  const id = q.get('kb') || '';
  const urlArticle = KB_ARTICLES.find(a => a.id === id);
  const article = propArticle || urlArticle;

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('kb');
      window.history.pushState({}, '', url.toString());
      window.location.reload();
    }
  };

  return (
    <div className="h-full bg-white text-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="text-xs uppercase tracking-wide text-gray-500">Knowledge Base</div>
          </div>
        </div>
        <h1 className="text-xl font-bold mt-2">{article.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-6 whitespace-pre-wrap">{article.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


