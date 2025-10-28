import { serverSupabaseClient } from '#supabase/server'
import type { Article } from '~/types/article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  
  if (!slug) {
    setResponseStatus(event, 400)
    return {
      statusCode: 400,
      message: 'Slug is required'
    };
  }
  
  const client = await serverSupabaseClient(event);
  
  const { data, error } = await client
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  const article = data as Article | null;
  
  if (error || !article) {
    setResponseStatus(event, 404)
    return {
      statusCode: 404,
      message: 'Article not found'
    };
  }
  
  await (client as any)
    .from('articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', article.id);
  
  return {
    article: {
      ...article,
      views: (article.views || 0) + 1
    }
  };
});
