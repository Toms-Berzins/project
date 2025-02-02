import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { ArrowRight, Loader2 } from 'lucide-react';
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

interface InteractiveButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function InteractiveButton({ onClick, className = "", disabled = false, children }: InteractiveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClick?.();
    }, 1000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden transform-gpu touch-manipulation ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
        animate={{
          opacity: loading || disabled ? 0.7 : 1,
        }}
      />
      
      {ripple && (
        <motion.span
          className="absolute bg-white/30 rounded-full"
          initial={{ scale: 0, width: 100, height: 100, x: ripple.x - 50, y: ripple.y - 50 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <motion.div 
        className="relative flex items-center justify-center gap-2 py-3 px-6"
        animate={{
          opacity: loading ? 0 : 1,
        }}
      >
        {children}
        <motion.div
          animate={{ x: loading ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.div>
      )}
    </motion.button>
  );
}

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [visibleItems, setVisibleItems] = useState(6);
  const [showScroll, setShowScroll] = useState(false);
  const nextRippleId = useRef(0);

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  // Reset visible items when category changes
  useEffect(() => {
    setVisibleItems(6);
  }, [selectedCategory]);

  // Handle scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 6);
  };

  const handleItemClick = useCallback((item: PortfolioItem, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { x: rippleX, y: rippleY, id: nextRippleId.current }]);
    nextRippleId.current += 1;
    
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
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2 className="title-primary mb-4">
            Our Portfolio
          </motion.h2>
          <p className="subtitle-primary">
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
            <InteractiveButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${selectedCategory === category ? 'button-secondary-active' : 'button-secondary'}`}
            >
              {category}
            </InteractiveButton>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid-layout"
        >
          {filteredItems.slice(0, visibleItems).map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="glass-panel hover-lift aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={(e) => handleItemClick(item, e)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent 
                opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 
                transition-transform duration-300 flex flex-col gap-2">
                <h3 className="title-card">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
                    {item.category}
                  </span>
                </div>
                <p className="subtitle-card line-clamp-2 mt-1">
                  {item.description.split('.')[0]}.
                </p>
              </div>
              <AnimatePresence>
                {ripples.map(ripple => (
                  <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute rounded-full bg-orange-500/20"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 50,
                      height: 50,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {visibleItems < filteredItems.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-16"
          >
            <InteractiveButton
              onClick={handleLoadMore}
              className="button-primary px-8"
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
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="button-primary fixed bottom-6 right-6 p-4 rounded-full z-50 backdrop-blur-sm"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-5 h-5" />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 md:p-8 rounded-2xl max-w-3xl w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="title-card mb-2">{selectedItem.title}</h3>
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
                      {selectedItem.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>
                <p className="subtitle-card leading-relaxed">
                  {selectedItem.description}
                </p>
                <div className="pt-4">
                  <InteractiveButton
                    onClick={() => setSelectedItem(null)}
                    className="button-primary px-6"
                  >
                    Close
                  </InteractiveButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio; 