import { blogPosts } from '../../../data';

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug');
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    throw createError({
      statusCode: 404,
      message: `Article non trouvé`
    });
  }

  return post;
});