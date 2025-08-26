import { KBArticle } from './types';

export interface KBSearchResult extends KBArticle {
  score: number;
}

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s#\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

export function searchKB(articles: KBArticle[], query: string, max = 8): KBSearchResult[] {
  if (!query.trim()) return [];
  const qTokens = tokenize(query);

  const scored = articles.map(a => {
    const haystack = tokenize(
      [a.title, a.summary, a.tags.join(' '), (a.keywords || []).join(' '), a.body].join(' ') || ''
    );
    // Simple term frequency match
    let score = 0;
    for (const t of qTokens) {
      score += haystack.includes(t) ? 3 : 0;
      score += haystack.some(h => h.startsWith(t)) ? 1 : 0;
    }
    // Tag boost
    score += a.tags.some(t => qTokens.includes(t)) ? 2 : 0;
    return { ...a, score } as KBSearchResult;
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}

export function relatedKB(articles: KBArticle[], text: string, tags: string[] = [], max = 5) {
  const q = [text || '', ...(tags || [])].join(' ');
  return searchKB(articles, q, max);
}


