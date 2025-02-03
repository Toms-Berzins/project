import { motion, Variants } from 'framer-motion';
import { PortfolioItem, RippleEffect } from '../types';
import { KeyboardEvent, MouseEvent } from 'react';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem, e: MouseEvent<HTMLDivElement>) => void;
  ripples: RippleEffect[];
  variants?: Variants;
}

export const PortfolioCard = ({ item, onClick, ripples, variants }: PortfolioCardProps) => {
  return (
    <motion.div
      variants={variants}
      className="glass-panel hover-lift aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative"
      onClick={(e) => onClick(item, e)}
      role="button"
      aria-label={`View details for ${item.title}`}
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item, e as unknown as MouseEvent<HTMLDivElement>);
        }
      }}
    >
      <img 
        src={item.image} 
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent 
          opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 
          transition-transform duration-300 flex flex-col gap-2"
      >
        <h3 className="title-card text-lg md:text-xl lg:text-2xl">{item.title}</h3>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
            {item.category}
          </span>
        </div>
        <p className="subtitle-card line-clamp-2 mt-1 text-sm md:text-base">
          {item.description.split('.')[0]}.
        </p>
      </div>

      {/* Ripple effects */}
      {ripples.map(({ x, y, id }) => (
        <motion.span
          key={id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ scale: 0, width: 100, height: 100, x: x - 50, y: y - 50 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => {
            // Cleanup ripple after animation
            const element = document.querySelector(`[data-ripple-id="${id}"]`);
            if (element) element.remove();
          }}
          data-ripple-id={id}
        />
      ))}
    </motion.div>
  );
}; 