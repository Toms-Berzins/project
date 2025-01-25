import { useState, useEffect } from 'react';
import BlogPost from './BlogPost';
import SocialFeed from './SocialFeed';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
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
    <div className={`blog-container ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Latest Updates</h1>
            <div className="space-y-8">
              {posts.map((post) => (
                <BlogPost key={post._id} {...post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Latest TikTok Updates */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Latest TikToks</h2>
                <SocialFeed platform="tiktok" limit={2} />
              </div>

              {/* Latest Instagram Updates */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Latest Instagram Posts</h2>
                <SocialFeed platform="instagram" limit={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 