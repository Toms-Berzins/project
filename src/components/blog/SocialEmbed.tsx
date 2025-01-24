import { useEffect, useRef } from 'react';

interface SocialEmbedProps {
  platform: 'tiktok' | 'instagram';
  embedCode: string;
  className?: string;
}

export default function SocialEmbed({ platform, embedCode, className = '' }: SocialEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadEmbed = () => {
      if (platform === 'tiktok') {
        // Reload TikTok embed script
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      } else if (platform === 'instagram') {
        // Reload Instagram embed script
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        } else {
          const script = document.createElement('script');
          script.src = '//www.instagram.com/embed.js';
          script.async = true;
          document.body.appendChild(script);
          return () => {
            document.body.removeChild(script);
          };
        }
      }
    };

    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadEmbed();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [platform, embedCode]);

  return (
    <div ref={containerRef} className={`social-embed ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: embedCode }} />
    </div>
  );
} 