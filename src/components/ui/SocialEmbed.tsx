import React from 'react';
import Card from './Card';

interface SocialEmbedProps {
  platform: 'instagram' | 'tiktok';
  embedId: string;
  caption?: string;
  className?: string;
}

const SocialEmbed: React.FC<SocialEmbedProps> = ({
  platform,
  embedId,
  caption,
  className
}) => {
  const renderEmbed = () => {
    switch (platform) {
      case 'instagram':
        return (
          <iframe
            src={`https://www.instagram.com/p/${embedId}/embed`}
            className="w-full aspect-square border-0 overflow-hidden"
            allowTransparency
            allowFullScreen
            title="Instagram post embed"
          />
        );
      case 'tiktok':
        return (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${embedId}`}
            className="w-full aspect-[9/16] border-0 overflow-hidden"
            allowTransparency
            allowFullScreen
            title="TikTok video embed"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card variant="hover" padding="none" className={className}>
      <div className="overflow-hidden rounded-xl">
        {renderEmbed()}
      </div>
      {caption && (
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">{caption}</p>
        </div>
      )}
    </Card>
  );
};

export const SocialEmbedGrid: React.FC<{
  embeds: Array<SocialEmbedProps>;
  columns?: number;
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
      className={`grid gap-${gap} grid-cols-${columns} ${className}`}
    >
      {embeds.map((embed, index) => (
        <SocialEmbed key={`${embed.platform}-${embed.embedId}-${index}`} {...embed} />
      ))}
    </div>
  );
};

export default SocialEmbed; 