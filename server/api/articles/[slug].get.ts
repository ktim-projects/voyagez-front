import { serverSupabaseClient } from '#supabase/server'
import type { Article } from '~/types/article'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    });
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
    // Un vrai 404 : la page rend error.vue et le statut HTTP est correct
    // pour les moteurs de recherche.
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found'
    });
  }

  // Incrément atomique côté base : évite de perdre des vues en cas d'accès
  // simultanés et n'exige pas de droit d'écriture sur la table
  // (cf. supabase/migrations/enable_rls.sql).
  const { error: viewsError } = await client.rpc('increment_article_views', {
    article_id: article.id
  });

  if (viewsError) {
    // Le compteur de vues ne doit jamais empêcher la lecture de l'article
    console.warn('⚠️ [Articles] Incrément des vues impossible:', viewsError.message);
  }

  return {
    article: {
      ...article,
      views: (article.views || 0) + 1
    }
  };
});
