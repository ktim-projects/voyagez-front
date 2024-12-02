import { blogPosts } from '../../data';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 25;
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedPosts = blogPosts.slice(start, end);
  
  return {
    posts: paginatedPosts,
    total: blogPosts.length,
    page,
    totalPages: Math.ceil(blogPosts.length / limit)
  };
});