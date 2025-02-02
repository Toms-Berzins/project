import styles from '../styles/components/portfolio.module.css';
import { useRipple } from '../hooks/useRipple';
import { useState } from 'react';

interface PortfolioItem {
  id: string;
  // Add other item properties as needed
}

const Portfolio: React.FC = () => {
  const { rippleMap, createRipple } = useRipple();
  const [portfolioItems] = useState<PortfolioItem[]>([
    // Add your portfolio items here
    { id: 'item1' },
    { id: 'item2' },
    // ...
  ]);
  
  const RippleEffect: React.FC<{ id: string }> = ({ id }) => {
    const ripple = rippleMap[id];
    if (!ripple) return null;

    return (
      <span
        className={styles.rippleContainer}
        data-x={ripple.x}
        data-y={ripple.y}
      />
    );
  };

  return (
    <div className={styles.portfolioGrid}>
      {portfolioItems.map((item, index) => (
        <div
          key={item.id}
          className={styles.portfolioItem}
          onClick={(e) => createRipple(e, `${item.id}-${index}`)}
        >
          {/* Portfolio item content */}
          <RippleEffect id={`${item.id}-${index}`} />
        </div>
      ))}
    </div>
  );
};

export default Portfolio; 