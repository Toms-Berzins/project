import { Router, RequestHandler } from 'express';
import { SocialMediaService } from '../../services/socialMediaService';
import { BlogPost } from '../models/BlogPost';
import { generateSlug } from '../utils/slugify';

const router = Router();
const socialMediaService = new SocialMediaService();

interface GenerateBlogRequest {
  platform: 'tiktok' | 'instagram';
  postId: string;
}

// Get latest TikTok posts
router.get('/tiktok', async (_req, res) => {
  try {
    const posts = await socialMediaService.getLatestTikTokPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching TikTok posts:', error);
    res.status(500).json({ error: 'Failed to fetch TikTok posts' });
  }
});

// Get latest Instagram posts
router.get('/instagram', async (_req, res) => {
  try {
    const posts = await socialMediaService.getLatestInstagramPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

// Auto-generate blog post from social media post
router.post('/generate-blog', (async (req, res) => {
  try {
    const { platform, postId } = req.body as GenerateBlogRequest;
    
    let posts;
    if (platform === 'tiktok') {
      posts = await socialMediaService.fetchLatestTikToks();
    } else if (platform === 'instagram') {
      posts = await socialMediaService.fetchLatestInstagramPosts();
    } else {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const post = posts.find(p => p.postId === postId);
    if (!post) {
      return res.status(404).json({ error: 'Social media post not found' });
    }

    const blogPostData = await socialMediaService.generateBlogPostFromSocial(post);
    const slug = await generateSlug(blogPostData.title);

    const blogPost = await BlogPost.create({
      ...blogPostData,
      slug,
      date: new Date(),
    });

    res.status(201).json(blogPost);
  } catch (error) {
    console.error('Error generating blog post:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
}) as RequestHandler);

// Sync latest social media posts to blog
router.post('/sync', (async (_req, res) => {
  try {
    const [tiktokPosts, instagramPosts] = await Promise.all([
      socialMediaService.fetchLatestTikToks(),
      socialMediaService.fetchLatestInstagramPosts(),
    ]);

    const allPosts = [...tiktokPosts, ...instagramPosts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const newBlogPosts = [];
    for (const post of allPosts) {
      // Check if blog post already exists for this social post
      const existingPost = await BlogPost.findOne({
        $or: [
          { 'socialMedia.tiktokEmbed': { $regex: post.postId } },
          { 'socialMedia.instagramEmbed': { $regex: post.postId } },
        ],
      });

      if (!existingPost) {
        const blogPostData = await socialMediaService.generateBlogPostFromSocial(post);
        const slug = await generateSlug(blogPostData.title);

        const blogPost = await BlogPost.create({
          ...blogPostData,
          slug,
          date: new Date(),
        });

        newBlogPosts.push(blogPost);
      }
    }

    res.json({
      message: `Successfully synced ${newBlogPosts.length} new posts`,
      newPosts: newBlogPosts,
    });
  } catch (error) {
    console.error('Error syncing social media posts:', error);
    res.status(500).json({ error: 'Failed to sync social media posts' });
  }
}) as RequestHandler);

export default router; 