import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import { X } from 'lucide-react';
import Card from './ui/Card';
import { CardContent } from './ui/Card';

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

const SocialFeed: React.FC<SocialFeedProps> = ({ className }) => {
  // Sample social media posts - replace with actual data from your backend
  const socialPosts: SocialPost[] = [
    {
      platform: 'instagram',
      postId: 'SAMPLE_INSTAGRAM_POST_ID_1',
      embedCode: 'https://www.instagram.com/p/SAMPLE_INSTAGRAM_POST_ID_1/embed',
      caption: 'Check out this amazing powder coating transformation! 🎨✨',
      hashtags: ['powdercoating', 'transformation', 'metalwork'],
      timestamp: new Date('2024-03-15'),
      mediaUrl: '/images/samples/powder-coating-1.jpg',
      authorUsername: 'powdercoating_pro'
    },
    {
      platform: 'tiktok',
      postId: 'SAMPLE_TIKTOK_POST_ID_1',
      embedCode: 'https://www.tiktok.com/embed/v2/SAMPLE_TIKTOK_POST_ID_1',
      caption: 'Behind the scenes of our powder coating process 🔧',
      hashtags: ['process', 'behindthescenes', 'coating'],
      timestamp: new Date('2024-03-14'),
      mediaUrl: '/images/samples/powder-coating-2.jpg',
      authorUsername: 'powdercoating_pro'
    },
    {
      platform: 'instagram',
      postId: 'SAMPLE_INSTAGRAM_POST_ID_2',
      embedCode: 'https://www.instagram.com/p/SAMPLE_INSTAGRAM_POST_ID_2/embed',
      caption: 'Custom automotive finish with our signature metallic coat 🚗',
      hashtags: ['automotive', 'metallic', 'custom'],
      timestamp: new Date('2024-03-13'),
      mediaUrl: '/images/samples/powder-coating-3.jpg',
      authorUsername: 'powdercoating_pro'
    }
  ];

  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* Modal for expanded view */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-gray-900 rounded-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                title="Close modal"
                aria-label="Close post preview"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-square w-full">
                <iframe
                  src={selectedPost.embedCode}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title={`${selectedPost.platform} post by ${selectedPost.authorUsername}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Feed Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {socialPosts.map((post, index) => (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <button
              onClick={() => setSelectedPost(post)}
              className="w-full text-left"
              aria-label={`View ${post.platform} post by ${post.authorUsername}`}
            >
              <Card 
                className="group overflow-hidden bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-md border border-white/10 
                  transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer"
              >
                {/* Card Header */}
                <div className="p-4 flex items-center gap-3 border-b border-white/10">
                  <div className={`p-2 rounded-lg ${
                    post.platform === 'instagram' 
                      ? 'bg-gradient-to-br from-purple-600/20 to-pink-500/20 text-pink-500'
                      : 'bg-black/20 text-white'
                  }`}>
                    {post.platform === 'instagram' ? (
                      <FaInstagram className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <FaTiktok className="w-5 h-5" aria-hidden="true" />
                    )}
                  </div>
                  <span className="font-medium text-white">@{post.authorUsername}</span>
                </div>

                {/* Card Media */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square transform transition-transform duration-700 group-hover:scale-105">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 
                    group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Card Content */}
                <CardContent className="relative z-10 p-4 space-y-3">
                  <p className="text-white/90 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {post.caption}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.slice(0, 3).map((tag: string) => (
                      <span 
                        key={tag}
                        className="text-sm px-3 py-1 rounded-full bg-orange-500/10 text-orange-400
                          hover:bg-orange-500/20 transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-white/10">
                    <time dateTime={post.timestamp.toISOString()}>
                      {post.timestamp.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="uppercase tracking-wider">{post.platform}</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SocialFeed; 