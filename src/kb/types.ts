export interface KBArticle {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  keywords?: string[];
  body: string;
  successRatePercent?: number; // 0-100
  frequentFollowUps?: string[];
}


