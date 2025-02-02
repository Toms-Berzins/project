import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaTiktok, FaInstagram, FaHeart, FaShare, FaTwitter, FaLinkedin, FaFacebook, FaCheck } from 'react-icons/fa';
import confetti from 'canvas-confetti';

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

interface SocialPost {
  platform: 'tiktok' | 'instagram';
  postId: string;
  embedCode: string;
  caption: string;
  hashtags: string[];
  timestamp: Date;
  mediaUrl: string;
  authorUsername: string;
  likes: number;
}

interface SocialFeedProps {
  platform?: 'tiktok' | 'instagram' | 'all';
  limit?: number;
  className?: string;
}

const PlatformIcon = ({ platform }: { platform: 'tiktok' | 'instagram' }) => {
  return platform === 'instagram' ? (
    <FaInstagram className="w-5 h-5" />
  ) : (
    <FaTiktok className="w-5 h-5" />
  );
};

interface ShareOptionsProps {
  onShare: (platform: string) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isMobile: boolean;
}

const socialPlatforms = [
  { icon: <FaTwitter className="text-[#1DA1F2]" />, name: 'Twitter', color: 'hover:bg-[#1DA1F2]/10' },
  { icon: <FaLinkedin className="text-[#0A66C2]" />, name: 'LinkedIn', color: 'hover:bg-[#0A66C2]/10' },
  { icon: <FaFacebook className="text-[#1877F2]" />, name: 'Facebook', color: 'hover:bg-[#1877F2]/10' }
];

const ShareOptions = ({ onShare, onClose, buttonRef, isMobile }: ShareOptionsProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Calculate position based on available space
    const calculatePosition = () => {
      if (buttonRef.current && popupRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const popupHeight = popupRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // If there's not enough space below and more space above, show above
        if (spaceBelow < popupHeight + 20 && spaceAbove > spaceBelow) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }
    };

    calculatePosition();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', calculatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [onClose, buttonRef]);

  const handleShare = (platform: string) => {
    onShare(platform);
  };

  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={popupRef}
          className="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-6 space-y-4"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) onClose();
          }}
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this post</h3>
          <div className="grid grid-cols-3 gap-4">
            {socialPlatforms.map(({ icon, name, color }) => (
              <motion.button
                key={name}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} transition-colors`}
                onClick={() => handleShare(name.toLowerCase())}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl">{icon}</div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={popupRef}
      className={`absolute ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'} right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-3 z-10 min-w-[200px]`}
      initial={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      <div className="space-y-1">
        {socialPlatforms.map(({ icon, name, color }) => (
          <motion.button
            key={name}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 ${color} rounded-lg transition-colors`}
            onClick={() => handleShare(name.toLowerCase())}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{icon}</span>
            <span>{name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.4,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
      exit={{ 
        opacity: 0, 
        y: 20, 
        scale: 0.95,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: "easeIn"
        }
      }}
      role="alert"
      aria-live="polite"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FaCheck className="text-white text-lg" />
      </motion.span>
      <span className="font-medium">{message}</span>
      <motion.button
        className="ml-2 opacity-80 hover:opacity-100 focus:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Dismiss notification"
      >
        ×
      </motion.button>
    </motion.div>
  );
};

const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FF9800', '#FF5722', '#FFC107'],
    ticks: 200,
    gravity: 0.8,
    scalar: 1.2,
    shapes: ['circle', 'square'],
  });

  // Second burst with delay for more natural effect
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#4CAF50', '#2196F3', '#9C27B0'],
      ticks: 150,
      gravity: 0.7,
      scalar: 0.9,
      shapes: ['circle'],
    });
  }, 150);
};

const textStyles = {
  title: "text-4xl font-extrabold tracking-tight text-white/90 font-inter",
  subtitle: "text-lg font-medium text-gray-400/90 font-inter leading-relaxed",
  username: "font-semibold text-white/90 hover:text-white transition-colors duration-200",
  date: "text-sm font-medium text-gray-500/90",
  caption: "text-base text-white/90 leading-relaxed font-inter",
  hashtag: "text-sm font-medium px-3 py-1 bg-orange-500/10 text-orange-400 hover:text-orange-300 rounded-full cursor-pointer transition-all duration-200 hover:bg-orange-500/15",
  shareText: "text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors duration-200",
};

export default function SocialFeed({ platform = 'all', limit = 4, className = '' }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeShare, setActiveShare] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const shouldReduceMotion = useReducedMotion();
  const shareButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: shouldReduceMotion ? {} : { 
      scale: 1.02,
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  };

  const hashtagVariants = {
    hover: shouldReduceMotion ? {} : { 
      scale: 1.05,
      color: "#f97316",
      transition: { duration: 0.2 }
    }
  };

  const handleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
        // Trigger haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
      return newLiked;
    });

    setPosts(prev => prev.map(post => {
      if (post.postId === postId) {
        return {
          ...post,
          likes: post.likes + (likedPosts.has(postId) ? -1 : 1)
        };
      }
      return post;
    }));
  }, [likedPosts]);

  const handleShare = useCallback(async (postId: string, platform: string) => {
    try {
      // Simulate share API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger success feedback
      if ('vibrate' in navigator) {
        // Double pulse for more engaging feedback
        navigator.vibrate([50, 100, 50]);
      }
      
      // Trigger confetti with slight delay after vibration
      setTimeout(() => {
        triggerConfetti();
      }, 100);

      setShareSuccess(postId);
      setToastMessage(`Successfully shared to ${platform}!`);
      
      // Reset success state after animation
      setTimeout(() => {
        setShareSuccess(null);
      }, 2000);
      
      setActiveShare(null);
    } catch (err: unknown) {
      console.error('Error sharing post:', err);
      setToastMessage('Failed to share. Please try again.');
    }
  }, []);

  const likeButtonVariants = {
    initial: { scale: 1 },
    hover: shouldReduceMotion ? {} : { scale: 1.1 },
    tap: shouldReduceMotion ? {} : { scale: 0.9 },
    liked: shouldReduceMotion ? {} : {
      scale: [1, 1.3, 1],
      transition: { duration: 0.3 }
    }
  };

  const shareButtonVariants = {
    initial: { 
      scale: 1, 
      boxShadow: "0px 0px 0px rgba(255, 152, 0, 0)",
      backgroundColor: "rgba(0, 0, 0, 0)"
    },
    success: { 
      scale: [1, 1.2, 1],
      boxShadow: [
        "0px 0px 0px rgba(255, 152, 0, 0)",
        "0px 0px 30px rgba(255, 152, 0, 0.8)",
        "0px 0px 0px rgba(255, 152, 0, 0)"
      ],
      backgroundColor: [
        "rgba(0, 0, 0, 0)",
        "rgba(255, 152, 0, 0.1)",
        "rgba(0, 0, 0, 0)"
      ],
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        times: [0, 0.4, 1]
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      {loading ? (
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {[...Array(limit)].map((_, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="rounded-xl aspect-video animate-pulse bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : !posts.length ? (
        <div className="text-center">
          <p className="text-gray-400 text-lg">No social media posts to display</p>
        </div>
      ) : (
        <div 
          className={`${isMobile ? 'flex overflow-x-auto snap-x snap-mandatory' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8 ${className}`}
          role="region"
          aria-label="Latest from our workshop"
        >
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div 
                key={post.postId}
                className={`rounded-xl overflow-hidden shadow-lg
                  ${isMobile ? 'flex-shrink-0 w-[85vw] snap-center' : ''}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => setExpandedPost(expandedPost === post.postId ? null : post.postId)}
                tabIndex={0}
                role="button"
                aria-expanded={expandedPost === post.postId}
                aria-label={`Social media post from ${post.platform} by ${post.authorUsername}`}
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`p-2 rounded-lg ${
                        post.platform === 'instagram' ? 'bg-purple-500/10' : 'bg-white/5'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center ${
                        post.platform === 'instagram' ? 'text-purple-500' : 'text-white'
                      }`}>
                        <PlatformIcon platform={post.platform} />
                      </div>
                    </motion.div>
                    <span className={textStyles.username}>@{post.authorUsername}</span>
                  </div>
                  <time className={textStyles.date}>
                    {new Date(post.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                {/* Post Content */}
                <div className="relative">
                  <div className={`${expandedPost === post.postId ? 'aspect-auto' : 'aspect-square'}`}>
                    <img 
                      src={post.mediaUrl} 
                      alt={post.caption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                </div>
                
                {/* Post Footer */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <motion.button
                      className="flex items-center gap-2 focus:outline-none"
                      variants={likeButtonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      animate={likedPosts.has(post.postId) ? "liked" : "initial"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.postId);
                      }}
                      aria-label={likedPosts.has(post.postId) ? "Unlike post" : "Like post"}
                    >
                      <FaHeart 
                        className={`text-xl transition-colors ${
                          likedPosts.has(post.postId) ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                      <motion.span
                        key={post.likes}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={textStyles.date}
                      >
                        {post.likes}
                      </motion.span>
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        ref={el => shareButtonRefs.current[post.postId] = el}
                        className="flex items-center gap-2 focus:outline-none group"
                        variants={shareButtonVariants}
                        initial="initial"
                        animate={shareSuccess === post.postId ? "success" : "initial"}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveShare(activeShare === post.postId ? null : post.postId);
                        }}
                        aria-label="Share post"
                        aria-expanded={activeShare === post.postId}
                      >
                        <AnimatePresence mode="wait">
                          {shareSuccess === post.postId ? (
                            <motion.span
                              key="success"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="text-green-500"
                            >
                              <FaCheck className="text-lg" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="share"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <FaShare className="text-lg" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className={textStyles.shareText}>Share</span>
                      </motion.button>

                      <AnimatePresence>
                        {activeShare === post.postId && (
                          <ShareOptions 
                            onShare={(platform) => handleShare(post.postId, platform)}
                            onClose={() => setActiveShare(null)}
                            buttonRef={{ current: shareButtonRefs.current[post.postId] }}
                            isMobile={isMobile}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className={`${textStyles.caption} ${expandedPost === post.postId ? '' : 'line-clamp-2'}`}>
                    {post.caption}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <motion.span 
                        key={tag}
                        variants={hashtagVariants}
                        whileHover="hover"
                        className={textStyles.hashtag}
                        role="button"
                        tabIndex={0}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
} 