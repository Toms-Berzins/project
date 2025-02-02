import { useState, useEffect } from 'react';
import BlogPostPreview from './BlogPostPreview';
import SocialFeed from '../SocialFeed';
import axios from 'axios';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
  featured?: boolean;
}

interface BlogProps {
  className?: string;
}

export default function Blog({ className = '' }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<{ posts: BlogPost[] }>('/api/blog');
        setPosts(response.data.posts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
        setError(errorMessage);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg p-6 h-48"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg p-4 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error}
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="text-primary-600 hover:text-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`blog-container py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Latest Updates</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {posts.map((post) => (
                <BlogPostPreview key={post._id} {...post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Latest TikToks</h2>
              <SocialFeed platform="tiktok" limit={2} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Latest Instagram Posts</h2>
              <SocialFeed platform="instagram" limit={2} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 