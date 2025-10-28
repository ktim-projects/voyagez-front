import type { Article } from '~/types/article';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 12;
  const category = query.category as string;
  const tag = query.tag as string;
  
  const client = await serverSupabaseClient(event);
  
  let queryBuilder = client
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false });
  
  // Filtrer par catégorie si spécifié
  if (category) {
    queryBuilder = queryBuilder.eq('category', category);
  }
  
  // Filtrer par tag si spécifié
  if (tag) {
    queryBuilder = queryBuilder.contains('tags', [tag]);
  }
  
  // Pagination
  const offset = (page - 1) * limit;
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);
  
  const { data: articles, error, count } = await queryBuilder;
  
  if (error) {
    setResponseStatus(event, 500)
    return {
      statusCode: 500,
      message: 'Error fetching articles',
    };
  }
  
  return {
    articles: articles || [],
    _meta: {
      total: count || 0,
      page,
      limit
    }
  };
});
