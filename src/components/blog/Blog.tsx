import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
  featured?: boolean;
}

const categories = [
  'Powder Coating Tips & Maintenance',
  'Behind-the-Scenes & Workshop Showcases',
  'Project Spotlights',
  'Industry News & Innovations'
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsResponse, featuredResponse] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/blog/featured')
        ]);

        if (!postsResponse.ok || !featuredResponse.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await postsResponse.json();
        const featuredData = await featuredResponse.json();

        if (!Array.isArray(postsData.posts)) {
          throw new Error('Invalid posts data received');
        }
        if (!Array.isArray(featuredData)) {
          throw new Error('Invalid featured posts data received');
        }

        setPosts(postsData.posts);
        setFeaturedPosts(featuredData);
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with Featured Posts */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
        {featuredPosts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Featured Post */}
            <Link
              to={`/blog/${featuredPosts[0].slug}`}
              className="lg:col-span-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-lg overflow-hidden shadow-lg h-[500px]"
              >
                <img
                  src={featuredPosts[0].imageUrl}
                  alt={featuredPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block px-4 py-2 bg-primary-500 text-white rounded-full text-sm mb-4">
                    Featured Post
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4">{featuredPosts[0].title}</h2>
                  <p className="text-gray-200 text-lg mb-4 line-clamp-2">{featuredPosts[0].excerpt}</p>
                  <div className="flex items-center text-white">
                    <span>{new Date(featuredPosts[0].date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPosts[0].category}</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Secondary Featured Posts */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-8">
              {featuredPosts.slice(1, 3).map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-lg overflow-hidden shadow-lg h-[235px]"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                      <div className="flex items-center text-gray-200 text-sm">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{post.category}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Search and Filter Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-lg shadow-md">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block h-full"
            >
              <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-primary-600 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="text-primary-600 font-medium">Read More →</span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </section>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h2>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
} 