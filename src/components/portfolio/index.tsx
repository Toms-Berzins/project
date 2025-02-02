import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem, RippleEffect } from './types';
import { containerVariants, itemVariants } from './animations';
import { FloatingBackground } from './components/FloatingBackground';
import { PortfolioCard } from './components/PortfolioCard';
import { PortfolioModal } from './components/PortfolioModal';
import { ScrollToTop } from './components/ScrollToTop';
import { usePortfolio } from './hooks/usePortfolio';
import Button from '../ui/Button';
import '@styles/components/portfolio.css';

const Portfolio = () => {
  const {
    selectedCategory,
    selectedItem,
    displayedItems,
    categories,
    isLoading,
    hasMore,
    handleCategoryChange,
    handleLoadMore,
    handleItemSelect,
    handleItemDeselect,
  } = usePortfolio();

  // Ripple effect state
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const nextRippleId = useRef(0);

  // Handle scroll for Back to Top button
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (item: PortfolioItem, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { x: rippleX, y: rippleY, id: nextRippleId.current }]);
    nextRippleId.current += 1;
    
    handleItemSelect(item);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-overlay" />
      <div className="portfolio-noise" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <h2 className="portfolio-title">Our Portfolio</h2>
          </motion.div>
          <p className="portfolio-subtitle">
            Explore our diverse range of custom furniture and designs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16 px-2"
        >
          {categories.map(category => (
            <Button
              key={category}
              variant="primary"
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={`category-button ${
                selectedCategory === category
                  ? 'category-button-active'
                  : 'category-button-inactive'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="portfolio-grid"
        >
          {displayedItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={handleItemClick}
              ripples={ripples}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-16"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleLoadMore}
              className="load-more-button"
            >
              <span className="load-more-content">
                Load More Projects
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </span>
            </Button>
          </motion.div>
        )}

        <FloatingBackground />
      </div>

      <AnimatePresence>
        {showScroll && <ScrollToTop onClick={scrollToTop} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <PortfolioModal
            item={selectedItem}
            onClose={handleItemDeselect}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio; 