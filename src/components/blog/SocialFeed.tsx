import { useEffect, useState } from 'react';
import SocialEmbed from './SocialEmbed';
import axios from 'axios';

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

interface SocialFeedProps {
  platform?: 'tiktok' | 'instagram' | 'all';
  limit?: number;
  className?: string;
}

export default function SocialFeed({ platform = 'all', limit = 4, className = '' }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoints = [];
        if (platform === 'all' || platform === 'tiktok') {
          endpoints.push('/api/social/tiktok');
        }
        if (platform === 'all' || platform === 'instagram') {
          endpoints.push('/api/social/instagram');
        }

        const responses = await Promise.all(
          endpoints.map(endpoint => axios.get<SocialPost[]>(endpoint))
        );

        const allPosts = responses
          .flatMap(response => response.data)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);

        setPosts(allPosts);
      } catch (err) {
        console.error('Error fetching social posts:', err);
        setError('Failed to load social media posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [platform, limit]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-video w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-500 text-center text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500 text-center text-lg">No social media posts to display</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => (
          <div 
            key={post.postId}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 lg:p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ED8936] to-[#DD7926] flex items-center justify-center text-white text-base font-medium">
                  {post.platform === 'instagram' ? 'IG' : 'TT'}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 text-lg">@{post.authorUsername}</span>
              </div>
              
              <div className="relative w-full aspect-square overflow-hidden">
                <div className={`${post.platform === 'tiktok' ? 'scale-[1.7] origin-top' : ''} w-full h-full`}>
                  <SocialEmbed
                    platform={post.platform}
                    embedCode={post.embedCode}
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2">{post.caption}</p>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-sm font-medium text-[#ED8936] bg-orange-50 dark:bg-orange-900/20 dark:text-orange-200 px-3 py-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <time className="text-sm">{new Date(post.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</time>
                  <span className="text-sm font-medium uppercase tracking-wider">{post.platform}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 