import { z } from 'zod';

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  author: z.string().min(1),
  date: z.string(),
  category: z.enum([
    'Powder Coating Tips',
    'Project Spotlights',
    'Industry News',
    'Behind the Scenes'
  ]),
  imageUrl: z.string().url(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()),
  socialMedia: z.object({
    tiktokEmbed: z.string().optional(),
    instagramEmbed: z.string().optional(),
    tiktokUsername: z.string().optional(),
    instagramUsername: z.string().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export const CreateBlogPostSchema = BlogPostSchema.omit({ id: true });
export const UpdateBlogPostSchema = BlogPostSchema.partial(); 