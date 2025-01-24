import { BlogPost } from '../models/BlogPost';

export async function generateSlug(title: string): Promise<string> {
  // Convert to lowercase and replace spaces and special characters with hyphens
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

  // Check if slug already exists
  const existingSlugs = await BlogPost.find({
    slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
  })
    .select('slug')
    .lean();

  if (existingSlugs.length === 0) {
    return baseSlug;
  }

  // If slug exists, append a number
  const slugNumbers = existingSlugs
    .map((post: { slug: string }) => {
      const match = post.slug.match(new RegExp(`^${baseSlug}(-\\d+)?$`));
      if (!match) return 0;
      const num = match[1] ? parseInt(match[1].slice(1)) : 0;
      return num;
    })
    .filter((num: number) => !isNaN(num));

  const maxNumber = Math.max(0, ...slugNumbers);
  return `${baseSlug}-${maxNumber + 1}`;
} 