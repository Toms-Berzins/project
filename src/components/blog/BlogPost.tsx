import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTiktok, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SocialEmbed from './SocialEmbed';

interface BlogPost {
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  slug: string;
  excerpt: string;
  socialMedia?: {
    tiktokEmbed?: string;
    instagramEmbed?: string;
  };
  relatedPosts?: BlogPost[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const text = `Check out this awesome article: ${post.title}`;
    const hashtags = 'powdercoating,customfinish,metalwork';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${text}\n\n${url}\n\n#${hashtags.split(',').join(' #')}`);
        alert('Caption copied! Open Instagram to share.');
        break;
      case 'tiktok':
        navigator.clipboard.writeText(`${text}\n\n${url}\n\n#${hashtags.split(',').join(' #')}`);
        alert('Caption copied! Open TikTok to share.');
        break;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Post not found'}
        </h1>
        <button
          onClick={() => navigate('/blog')}
          className="text-primary-600 hover:text-primary-700"
        >
          ← Back to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          {post.category} • {new Date(post.date).toLocaleDateString()} • By {post.author}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-[500px] object-cover rounded-lg shadow-lg"
        />
      </header>

      {/* Sticky Social Share Sidebar */}
      <div className="hidden lg:flex flex-col fixed left-8 top-1/2 transform -translate-y-1/2 gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('tiktok')}
          className="p-3 rounded-full bg-black text-white shadow-lg"
        >
          <FaTiktok size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('instagram')}
          className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg"
        >
          <FaInstagram size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('facebook')}
          className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
        >
          <FaFacebook size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('twitter')}
          className="p-3 rounded-full bg-blue-400 text-white shadow-lg"
        >
          <FaTwitter size={24} />
        </motion.button>
      </div>

      {/* Mobile Social Share */}
      <div className="flex lg:hidden gap-4 mb-8 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('tiktok')}
          className="p-2 rounded-full bg-black text-white"
        >
          <FaTiktok size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('instagram')}
          className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white"
        >
          <FaInstagram size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('facebook')}
          className="p-2 rounded-full bg-blue-600 text-white"
        >
          <FaFacebook size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => handleShare('twitter')}
          className="p-2 rounded-full bg-blue-400 text-white"
        >
          <FaTwitter size={20} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Social Media Embeds */}
      {post.socialMedia && (post.socialMedia.tiktokEmbed || post.socialMedia.instagramEmbed) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {post.socialMedia.tiktokEmbed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SocialEmbed
                platform="tiktok"
                embedCode={post.socialMedia.tiktokEmbed}
                className="aspect-video"
              />
            </motion.div>
          )}
          {post.socialMedia.instagramEmbed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SocialEmbed
                platform="instagram"
                embedCode={post.socialMedia.instagramEmbed}
                className="aspect-square"
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Enhanced Call to Action */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-8 text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Transform Your Project Today!</h2>
        <p className="text-lg mb-6">Experience the durability and beauty of professional powder coating.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/quote"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Get Your Free Quote
          </a>
          <a
            href="https://www.tiktok.com/@yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg flex items-center justify-center gap-2"
          >
            <FaTiktok /> Follow on TikTok
          </a>
        </div>
      </motion.div>

      {/* Related Posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {post.relatedPosts.map((relatedPost) => (
              <motion.div
                key={relatedPost.title}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/blog/${relatedPost.slug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden h-full"
                >
                  <img
                    src={relatedPost.imageUrl}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm text-primary-600">{relatedPost.category}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-3">{relatedPost.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
} 