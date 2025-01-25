import axios from 'axios';
import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  TIKTOK_ACCESS_TOKEN: z.string().optional(),
  INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
  TIKTOK_HASHTAGS: z.string().optional(),
});

interface SocialPost {
  platform: 'tiktok' | 'instagram';
  postId: string;
  embedCode: string;
  caption: string;
  hashtags: string[];
  timestamp: Date;
  mediaUrl: string;
  authorUsername: string;
}

interface TikTokVideo {
  id: string;
  title: string;
  create_time: number;
  embed_link: string;
  hashtags: string[];
  author: {
    username: string;
  };
}

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  username: string;
}

export class SocialMediaService {
  private tiktokHashtags: string[];

  // Mock data for testing
  private mockTikTokPosts: SocialPost[] = [
    {
      platform: 'tiktok',
      postId: '7123456789',
      embedCode: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@username/video/7123456789" data-video-id="7123456789"><section></section></blockquote>',
      caption: 'Check out this amazing powder coating transformation! 🎨 #powdercoating #metalwork',
      hashtags: ['powdercoating', 'metalwork'],
      timestamp: new Date('2024-03-15'),
      mediaUrl: 'https://example.com/tiktok1.mp4',
      authorUsername: 'powdercoating_pro'
    },
    {
      platform: 'tiktok',
      postId: '7123456790',
      embedCode: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@username/video/7123456790" data-video-id="7123456790"><section></section></blockquote>',
      caption: 'Before and after: Rusty wheels to showroom finish ✨ #restoration #powdercoating',
      hashtags: ['restoration', 'powdercoating'],
      timestamp: new Date('2024-03-14'),
      mediaUrl: 'https://example.com/tiktok2.mp4',
      authorUsername: 'powdercoating_pro'
    }
  ];

  private mockInstagramPosts: SocialPost[] = [
    {
      platform: 'instagram',
      postId: '123456789',
      embedCode: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/123456789/"><div></div></blockquote>',
      caption: 'Custom color match on this vintage car part 🚗 #powdercoating #classic',
      hashtags: ['powdercoating', 'classic'],
      timestamp: new Date('2024-03-15'),
      mediaUrl: 'https://example.com/insta1.jpg',
      authorUsername: 'powdercoating_pro'
    },
    {
      platform: 'instagram',
      postId: '123456790',
      embedCode: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/123456790/"><div></div></blockquote>',
      caption: 'New colors just arrived! Which one is your favorite? 🎨 #powdercoating #colors',
      hashtags: ['powdercoating', 'colors'],
      timestamp: new Date('2024-03-14'),
      mediaUrl: 'https://example.com/insta2.jpg',
      authorUsername: 'powdercoating_pro'
    }
  ];

  constructor() {
    const env = envSchema.parse(process.env);
    this.tiktokHashtags = env.TIKTOK_HASHTAGS?.split(',').map(tag => tag.trim()) || [];
  }

  async fetchLatestTikToks(): Promise<SocialPost[]> {
    const env = envSchema.parse(process.env);
    if (!env.TIKTOK_ACCESS_TOKEN) {
      console.log('TikTok integration not configured');
      return [];
    }

    try {
      // Fetch TikToks using TikTok API
      const response = await axios.get<{ data: { videos: TikTokVideo[] } }>(
        `https://open.tiktokapis.com/v2/video/list/`,
        {
          headers: {
            'Authorization': `Bearer ${env.TIKTOK_ACCESS_TOKEN}`,
          },
          params: {
            max_count: 10,
          }
        }
      );

      return response.data.data.videos
        .filter(video => 
          video.hashtags?.some(tag => 
            this.tiktokHashtags.includes(tag.replace('#', ''))
          )
        )
        .map((video) => ({
          platform: 'tiktok' as const,
          postId: video.id,
          embedCode: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${video.author.username}/video/${video.id}">
            <section><a target="_blank" href="https://www.tiktok.com/@${video.author.username}/video/${video.id}">Loading TikTok...</a></section>
          </blockquote>`,
          caption: video.title,
          hashtags: video.hashtags || [],
          timestamp: new Date(video.create_time * 1000),
          mediaUrl: video.embed_link,
          authorUsername: video.author.username,
        }));
    } catch (error) {
      console.error('Error fetching TikToks:', error);
      return [];
    }
  }

  async fetchLatestInstagramPosts(): Promise<SocialPost[]> {
    const env = envSchema.parse(process.env);
    if (!env.INSTAGRAM_ACCESS_TOKEN) {
      console.log('Instagram integration not configured');
      return [];
    }

    try {
      // Fetch Instagram posts using Graph API
      const response = await axios.get<{ data: InstagramPost[] }>(
        `https://graph.instagram.com/me/media`,
        {
          params: {
            access_token: env.INSTAGRAM_ACCESS_TOKEN,
            fields: 'id,caption,media_type,media_url,permalink,timestamp,username',
            limit: 10,
          }
        }
      );

      return response.data.data.map((post) => ({
        platform: 'instagram' as const,
        postId: post.id,
        embedCode: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${post.id}/">
          <a href="https://www.instagram.com/p/${post.id}/" target="_blank">Loading Instagram...</a>
        </blockquote>`,
        caption: post.caption || '',
        hashtags: (post.caption || '').match(/#[\w]+/g) || [],
        timestamp: new Date(post.timestamp),
        mediaUrl: post.media_url,
        authorUsername: post.username,
      }));
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }

  async generateBlogPostFromSocial(post: SocialPost) {
    const title = this.generateTitle(post);
    const content = this.generateContent(post);
    
    return {
      title,
      content,
      excerpt: post.caption.slice(0, 150) + '...',
      category: this.determineCategory(post),
      imageUrl: post.mediaUrl,
      socialMedia: {
        [`${post.platform}Embed`]: post.embedCode,
        [`${post.platform}Username`]: post.authorUsername,
      },
      tags: post.hashtags,
      seo: {
        metaTitle: title,
        metaDescription: post.caption.slice(0, 155) + '...',
        keywords: post.hashtags,
      },
    };
  }

  private generateTitle(post: SocialPost): string {
    // Extract meaningful title from caption or generate based on content
    const caption = post.caption.split('\n')[0].slice(0, 60);
    return caption || `Latest ${post.platform === 'tiktok' ? 'TikTok' : 'Instagram'} Update`;
  }

  private generateContent(post: SocialPost): string {
    return `
${post.caption}

${post.embedCode}

Follow us on ${post.platform === 'tiktok' ? 'TikTok' : 'Instagram'} [@${post.authorUsername}] for more updates!
    `.trim();
  }

  private determineCategory(post: SocialPost): string {
    const hashtags = post.hashtags.map(tag => tag.toLowerCase());
    
    if (hashtags.some(tag => tag.includes('tip') || tag.includes('maintenance'))) {
      return 'Powder Coating Tips & Maintenance';
    }
    if (hashtags.some(tag => tag.includes('behindthescenes') || tag.includes('workshop'))) {
      return 'Behind-the-Scenes & Workshop Showcases';
    }
    if (hashtags.some(tag => tag.includes('project') || tag.includes('spotlight'))) {
      return 'Project Spotlights';
    }
    return 'Industry News & Innovations';
  }

  async getLatestTikTokPosts(): Promise<SocialPost[]> {
    // For testing, return mock data instead of making API calls
    return this.mockTikTokPosts;
  }

  async getLatestInstagramPosts(): Promise<SocialPost[]> {
    // For testing, return mock data instead of making API calls
    return this.mockInstagramPosts;
  }
}

export default new SocialMediaService(); 