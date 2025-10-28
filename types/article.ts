export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  published_at: string;
  reading_time: number; // en minutes
  views?: number;
}

export interface ArticleListResponse {
  articles: Article[];
  _meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ArticleDetailResponse {
  article: Article;
}
