import { useState, useCallback, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { InteractiveButton } from './ui/InteractiveButton';
import '../styles/components.css';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 'automotive-1',
    title: 'Classic Car Wheels',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1623861397259-55dd5eb79958?auto=format&fit=crop&q=80&w=800',
    description: 'Complete powder coating restoration of vintage car wheels. Process involved chemical stripping, media blasting, and multi-stage coating application. Achieved showroom-quality finish with enhanced durability using our premium ceramic-infused coating system. The wheels received a UV-resistant clear coat for long-lasting protection against brake dust and road debris.'
  },
  {
    id: 'automotive-2',
    title: 'Engine Components',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800',
    description: 'High-temperature powder coating for critical engine components. Utilized specialized ceramic-based coating rated for 2000°F. Process included ultrasonic cleaning, phosphate treatment, and precision masking of critical surfaces. Multiple quality control checks ensured perfect coverage while maintaining strict tolerances. Final result combines superior heat resistance with excellent surface finish.'
  },
  {
    id: 'industrial-1',
    title: 'Manufacturing Equipment',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'Industrial machinery coating project requiring exceptional chemical and wear resistance. Implemented a three-layer coating system: zinc-rich primer for corrosion protection, high-build intermediate coat, and TGIC-free polyester topcoat. Extensive surface preparation included abrasive blasting to SSPC-SP10 standard. Result provides 10+ years of protection in harsh industrial environments.'
  },
  {
    id: 'industrial-2',
    title: 'Steel Framework',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1565939974240-455934b1e88d?auto=format&fit=crop&q=80&w=800',
    description: 'Large-scale structural steel coating project for marine environment application. Treatment included zinc thermal spraying followed by epoxy primer and marine-grade powder coating. Rigorous testing performed including salt spray resistance (ASTM B117) and adhesion testing. Coating system provides 25+ years of corrosion protection even in saltwater exposure.'
  },
  {
    id: 'custom-1',
    title: 'Modern Furniture',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    description: 'Custom furniture coating with designer color matching and texture development. Created unique metallic finish through specialized application techniques and custom powder formulation. Process involved multiple test panels to achieve perfect color and texture match. Final pieces feature exceptional durability while maintaining sophisticated aesthetic appeal.'
  },
  {
    id: 'custom-2',
    title: 'Decorative Elements',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800',
    description: 'Artistic powder coating for high-end architectural installations. Developed custom color-shifting effect through innovative application methods and specialized powder selection. Process required precise temperature control and custom masking techniques. Achieved unique visual effects while maintaining excellent weather resistance and color stability.'
  },
  {
    id: 'automotive-3',
    title: 'Motorcycle Parts',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    description: 'Custom motorcycle components featuring candy-coat finish over chrome-like base. Multi-stage process included specialized base coat, candy translucent layer, and high-gloss clear coat. Extensive preparation ensured perfect surface finish. Final result provides exceptional depth and clarity while maintaining excellent chip and scratch resistance.'
  },
  {
    id: 'industrial-3',
    title: 'Heavy Equipment',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy machinery coating project requiring maximum abrasion resistance. Implemented innovative dual-coat system with high-build epoxy base and ultra-durable polyester topcoat. Surface preparation included aggressive grit blasting and phosphate treatment. Coating system tested to withstand extreme impact and abrasion while maintaining excellent edge coverage.'
  },
  {
    id: 'custom-3',
    title: 'Architectural Details',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800',
    description: 'Precision architectural elements requiring perfect finish quality. Utilized advanced pre-treatment system and custom powder formulation for optimal flow and leveling. Process included specialized racking methods and controlled cooling. Achieved Class A finish quality with excellent UV stability and weather resistance for exterior applications.'
  }
];

const FloatingBackground = () => {
  return (
    <div className="floating-background">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="floating-background"
          style={{
            top: `${20 + i * 30}%`,
            left: `${20 + i * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

// Lazy load the modal component
const PortfolioModal = lazy(() => import('../components/portfolio/PortfolioModal'));

// Loading spinner component for modal
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-orange-500"
    >
      <Loader2 className="w-8 h-8 animate-spin" />
    </motion.div>
  </div>
);

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [visibleItems, setVisibleItems] = useState(6);
  const [showScroll, setShowScroll] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalCloseTimeoutRef = useRef<NodeJS.Timeout>();

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    setVisibleItems(6);
  }, [selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle modal keyboard interactions with debounce
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedItem) {
        // Clear any existing timeout
        if (modalCloseTimeoutRef.current) {
          clearTimeout(modalCloseTimeoutRef.current);
        }
        // Set new timeout for delayed close
        modalCloseTimeoutRef.current = setTimeout(() => {
          setSelectedItem(null);
        }, 150);
      }
    };

    if (selectedItem) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setTimeout(() => previousFocusRef.current?.focus(), 100);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (modalCloseTimeoutRef.current) {
        clearTimeout(modalCloseTimeoutRef.current);
      }
    };
  }, [selectedItem]);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 6);
  };

  const handleItemClick = useCallback((item: PortfolioItem) => {
    setSelectedItem(item);
  }, []);

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="portfolio" className="section-container">
      <div className="section-grid-pattern" />
      <div className="section-gradient-overlay" />
      <div className="section-border-top" />
      <div className="section-border-bottom" />

      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <motion.h2 className="title-primary mb-4">
            Our Portfolio
          </motion.h2>
          <p className="subtitle-primary max-w-2xl mx-auto">
            Explore our diverse range of custom furniture and designs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12 lg:mb-16 px-2"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {categories.map(category => (
            <InteractiveButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`glass-panel px-4 py-2 rounded-xl transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10' 
                  : 'bg-gray-900/50 hover:bg-gray-800/70 text-gray-400 hover:text-gray-300'} 
                backdrop-blur-lg border border-gray-800 hover:border-orange-500/30 
                min-w-[90px] md:min-w-[100px] text-sm font-medium`}
              aria-selected={selectedCategory === category}
              role="tab"
            >
              {category}
            </InteractiveButton>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          style={{ gridAutoRows: 'minmax(200px, auto)' }}
        >
          {filteredItems.slice(0, visibleItems).map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="glass-panel hover-lift aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => handleItemClick(item)}
              role="button"
              aria-label={`View details for ${item.title}`}
              aria-expanded={selectedItem?.id === item.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
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
            </motion.div>
          ))}
        </motion.div>

        {visibleItems < filteredItems.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-8 md:mt-12 lg:mt-16"
          >
            <InteractiveButton
              onClick={handleLoadMore}
              className="glass-panel bg-orange-500/20 hover:bg-orange-500/30
                backdrop-blur-lg shadow-lg shadow-orange-500/10 text-orange-400
                border border-gray-800 hover:border-orange-500/30
                min-w-[160px] px-6 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-300"
            >
              Load More Projects
            </InteractiveButton>
          </motion.div>
        )}

        <FloatingBackground />
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.2, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="button-primary fixed bottom-4 md:bottom-6 right-4 md:right-6 p-3 md:p-4 rounded-full z-50 
              backdrop-blur-[5px] shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            <motion.div
              className="absolute -inset-1 bg-orange-500 rounded-full opacity-20 z-0"
              animate={{ scale: [0.85, 1.1, 0.85] }}
              transition={{ 
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              closeButtonRef={closeButtonRef}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio; 