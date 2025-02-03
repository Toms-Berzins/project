import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SocialEmbedProps {
  platform: 'instagram' | 'tiktok';
  embedId: string;
  caption?: string;
  className?: string;
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

const animationVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const SocialEmbed: React.FC<SocialEmbedProps> = ({
  platform,
  embedId,
  caption,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const renderEmbed = () => {
    if (!isVisible) {
      return <div className="w-full h-[400px] bg-gray-800/50 animate-pulse rounded-lg" />;
    }

    if (platform === 'instagram') {
      return (
        <div className="relative w-full h-auto aspect-square">
          <iframe
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.instagram.com/p/${embedId}/embed`}
            className={`w-full h-full border-0 overflow-hidden transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            allowTransparency
            allowFullScreen
            title="Instagram post embed"
            onLoad={handleLoad}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-800/50 animate-pulse rounded-lg" />
          )}
        </div>
      );
    } else if (platform === 'tiktok') {
      return (
        <div className="relative w-full h-auto aspect-[9/16]">
          <iframe
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.tiktok.com/embed/v2/${embedId}`}
            className={`w-full h-full border-0 overflow-hidden transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            allowTransparency
            allowFullScreen
            title="TikTok video embed"
            onLoad={handleLoad}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-800/50 animate-pulse rounded-lg" />
          )}
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center p-4 text-red-500 dark:text-red-400">
          <p>⚠️ Unsupported platform: {platform}</p>
        </div>
      );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      <div className="overflow-hidden rounded-xl w-full h-auto">
        {renderEmbed()}
      </div>
      {caption && (
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">{caption}</p>
        </div>
      )}
    </motion.div>
  );
};

export const SocialEmbedGrid: React.FC<{
  embeds: Array<SocialEmbedProps>;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}> = ({
  embeds,
  columns = 3,
  gap = 4,
  className
}) => {
  return (
    <div 
      className={`grid gap-${gap} ${gridCols[columns] || gridCols[3]} ${className || ''} grid-cols-1 sm:${gridCols[2]} md:${gridCols[columns]}`}
    >
      {embeds.map((embed, index) => (
        <motion.div
          key={`${embed.platform}-${embed.embedId}-${index}`}
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          transition={{ delay: index * 0.1 }}
        >
          <SocialEmbed {...embed} />
        </motion.div>
      ))}
    </div>
  );
};

export default SocialEmbed; 