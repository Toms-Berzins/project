import { Router, RequestHandler } from 'express';
import { z } from 'zod';
import { BlogPost } from '../models/BlogPost';
import { generateSlug } from '../utils/slugify';

const router = Router();

interface BlogQuery {
  category?: string;
  tags?: string;
  $or?: Array<{
    title: { $regex: string; $options: string };
  } | {
    content: { $regex: string; $options: string };
  }>;
}

// Get all blog posts with pagination and filtering
const getAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const QuerySchema = z.object({
      page: z.string().transform(Number).default('1'),
      limit: z.string().transform(Number).default('10'),
      category: z.string().optional(),
      tag: z.string().optional(),
      search: z.string().optional(),
    });

    const { page, limit, category, tag, search } = QuerySchema.parse(req.query);

    const query: BlogQuery = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    next(error);
  }
};

// Get featured blog posts
const getFeaturedPosts: RequestHandler = async (_req, res, next) => {
  try {
    const posts = await BlogPost.find({ featured: true })
      .sort({ date: -1 })
      .limit(4)
      .lean();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    next(error);
  }
};

// Get a single blog post by slug
const getPostBySlug: RequestHandler<{ slug: string }> = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).lean();

    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    next(error);
  }
};

// Create a new blog post
const createPost: RequestHandler = async (req, res, next) => {
  try {
    const BlogPostSchema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string().min(1),
      author: z.string().min(1),
      category: z.enum([
        'Powder Coating Tips',
        'Project Spotlights',
        'Industry News',
        'Behind the Scenes'
      ]),
      imageUrl: z.string().url(),
      featured: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      socialMedia: z.object({
        tiktokEmbed: z.string().optional(),
        instagramEmbed: z.string().optional(),
        tiktokUsername: z.string().optional(),
        instagramUsername: z.string().optional(),
      }).optional(),
      seo: z.object({
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
      }).optional(),
    });

    const data = BlogPostSchema.parse(req.body);
    const slug = await generateSlug(data.title);

    const post = await BlogPost.create({
      ...data,
      slug,
      date: new Date(),
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

// Update a blog post
const updatePost: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const UpdateBlogPostSchema = z.object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      category: z.enum([
        'Powder Coating Tips',
        'Project Spotlights',
        'Industry News',
        'Behind the Scenes'
      ]).optional(),
      imageUrl: z.string().url().optional(),
      featured: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      socialMedia: z.object({
        tiktokEmbed: z.string().optional(),
        instagramEmbed: z.string().optional(),
        tiktokUsername: z.string().optional(),
        instagramUsername: z.string().optional(),
      }).optional(),
      seo: z.object({
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
      }).optional(),
    });

    const data = UpdateBlogPostSchema.parse(req.body);
    
    // If title is being updated, generate new slug
    const slug = data.title ? await generateSlug(data.title) : undefined;

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        ...(slug && { slug }),
      },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    next(error);
  }
};

// Delete a blog post
const deletePost: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting blog post:', error);
    next(error);
  }
};

router.get('/', getAllPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:slug', getPostBySlug);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router; 