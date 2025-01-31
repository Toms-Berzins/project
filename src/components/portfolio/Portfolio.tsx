import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, StarIcon, ArrowDownTrayIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ProjectDetails from './ProjectDetails';
import { useInView } from 'react-intersection-observer';
import Button from '../ui/Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './styles/Ripple.module.css';

type FinishType = 'Glossy' | 'Matte' | 'Metallic' | 'Textured' | 'Custom';
type Category = 'Automotive' | 'Industrial' | 'Furniture' | 'Custom Projects';

interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  finishType: FinishType;
  color: string;
  imageBefore: string;
  imageAfter: string;
  clientType: string;
  material: string;
  duration: string;
  specialTechniques: string[];
  testimonial?: {
    author: string;
    text: string;
    rating: number;
  };
  videoUrl?: string;
}

const Portfolio: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedFinish, setSelectedFinish] = useState<FinishType | 'All'>('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFinishOpen, setIsFinishOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<number>(6);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Ripple effect state
  const [rippleMap, setRippleMap] = useState<{ [key: string]: { x: number; y: number; timestamp: number } }>({});

  // Sample project data - replace with actual data from your backend
  const projects: Project[] = [
    {
      id: '1',
      title: 'Custom Car Rims',
      description: 'Professional powder coating for car rims and wheels. Complete wheel restoration with premium metallic finish.',
      category: 'Automotive',
      finishType: 'Metallic',
      color: 'Gunmetal Gray',
      imageBefore: '/images/portfolio/rims-before.jpg',
      imageAfter: '/images/portfolio/rims-after.jpg',
      clientType: 'Automotive Enthusiast',
      material: 'Aluminum Alloy',
      duration: '3 days',
      specialTechniques: ['Surface preparation', 'Multi-layer coating'],
      testimonial: {
        author: 'John D.',
        text: 'Exceptional finish quality. My rims look better than new!',
        rating: 5
      }
    }
  ];

  const filteredProjects = projects.filter(project => {
    return (
      (selectedCategory === 'All' || project.category === selectedCategory) &&
      (selectedFinish === 'All' || project.finishType === selectedFinish)
    );
  });

  useEffect(() => {
    if (inView) {
      setVisibleProjects(prev => Math.min(prev + 6, filteredProjects.length));
    }
  }, [inView, filteredProjects.length]);

  // Enhanced click outside handler with touch events
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsCategoryOpen(false);
        setIsFinishOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Handle ripple effect
  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent, id: string) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    let x, y;
    if ('touches' in event) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    setRippleMap(prev => ({
      ...prev,
      [id]: { x, y, timestamp: Date.now() }
    }));

    setTimeout(() => {
      setRippleMap(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }, 1000);
  }, []);

  const handleDownloadPortfolio = () => {
    // Implement PDF download functionality
    window.open('/api/download-portfolio', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  const mobileDropdownVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.2
      }
    }
  };

  const DropdownButton: React.FC<{
    value: string;
    isOpen: boolean;
    onClick: () => void;
    className?: string;
  }> = ({ value, isOpen, onClick, className }) => (
    <button
      onClick={onClick}
      className={`relative w-full min-h-[56px] px-6 py-4 text-left rounded-xl focus:ring-2 focus:ring-orange-500/50 
        focus:outline-none transition-all duration-300
        bg-gray-900/50 backdrop-blur-xl text-gray-200 border border-gray-700
        hover:border-orange-500/50 cursor-pointer transform-gpu active:scale-[0.98]
        ${isOpen ? 'border-orange-500/50 shadow-lg shadow-orange-500/20' : ''}
        ${className}`}
    >
      <span className="flex items-center justify-between">
        <span className="text-base sm:text-sm">{value}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUpIcon className="w-5 h-5 text-orange-500" />
        </motion.span>
      </span>
    </button>
  );

  const DropdownList: React.FC<{
    items: string[];
    selectedItem: string;
    onSelect: (item: string) => void;
    isOpen: boolean;
    onClose: () => void;
  }> = ({ items, selectedItem, onSelect, isOpen, onClose }) => {
    const handleSelect = (item: string) => {
      onSelect(item);
      onClose();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
              />
            )}
            
            <motion.ul
              variants={isMobile ? mobileDropdownVariants : dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${isMobile 
                ? 'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[80vh] pb-safe'
                : 'absolute z-50 w-full mt-2 rounded-xl max-h-[300px]'}
                bg-gray-900/90 backdrop-blur-xl border border-gray-700
                shadow-xl shadow-black/20 transform-gpu overflow-y-auto
                scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent`}
              drag={isMobile ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) onClose();
              }}
            >
              {isMobile && (
                <div className="sticky top-0 w-full p-4 text-center bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
                  <div className="w-12 h-1 mx-auto bg-gray-700 rounded-full" />
                </div>
              )}
              
              {items.map((item, index) => {
                const ripple = rippleMap[`${item}-${index}`];
                return (
                  <motion.li
                    key={item}
                    variants={itemVariants}
                    custom={index}
                    className={`relative overflow-hidden
                      ${isMobile ? 'py-4 px-6' : 'py-3 px-6'}
                      cursor-pointer transition-all duration-200
                      hover:bg-orange-500/20 active:bg-orange-500/30
                      ${selectedItem === item ? 'bg-orange-500/30 text-white' : 'text-gray-300'}`}
                    onClick={(e) => {
                      createRipple(e, `${item}-${index}`);
                      handleSelect(item);
                    }}
                  >
                    {ripple && (
                      <span
                        className={styles.rippleContainer}
                        style={{ '--ripple-x': `${ripple.x}px`, '--ripple-y': `${ripple.y}px` } as React.CSSProperties}
                      />
                    )}
                    <span className="relative z-10">{item}</span>
                  </motion.li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    );
  };

  const PortfolioGrid: React.FC<{ projects: Project[], onProjectClick: (project: Project) => void }> = ({ projects, onProjectClick }) => {
    return (
      <Masonry
        breakpointCols={{
          default: 3,
          1100: 2,
          700: 1
        }}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-transparent"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            className="mb-4 transform-gpu"
          >
            <div 
              onClick={() => onProjectClick(project)}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm
                border border-gray-800/50 hover:border-orange-500/50 transition-all duration-300
                shadow-lg hover:shadow-orange-500/10"
            >
              <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 transform-gpu">
                  <img
                    src={project.imageBefore}
                    alt={`${project.title} - Before`}
                    loading="lazy"
                    className="object-cover w-full h-full rounded-t-xl"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Before
                  </div>
                </div>
                <div className="absolute inset-0 transition-transform duration-700 transform-gpu translate-x-full group-hover:translate-x-0">
                  <img
                    src={project.imageAfter}
                    alt={`${project.title} - After`}
                    loading="lazy"
                    className="object-cover w-full h-full rounded-t-xl"
                  />
                  <div className="absolute top-4 left-4 bg-orange-500/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    After
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent
                  opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300" />
              </div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-orange-500/20 text-orange-400
                    backdrop-blur-sm border border-orange-500/20">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-800/40 text-gray-300
                    backdrop-blur-sm">
                    {project.finishType}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400
                  transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
                
                {project.testimonial && (
                  <div className="mt-4 flex items-center space-x-1">
                    {[...Array(project.testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-orange-400" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>
    );
  };

  return (
    <section id="portfolio" className="relative py-24 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={cardVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent 
              bg-gradient-to-r from-orange-400 to-orange-600
              [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]"
          >
            Our Portfolio
          </motion.h2>
          <motion.p 
            variants={cardVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8
              [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]"
          >
            Explore our diverse collection of powder coating transformations, showcasing our 
            expertise in bringing new life to various surfaces.
          </motion.p>
          <motion.div variants={cardVariants}>
            <Button
              onClick={handleDownloadPortfolio}
              variant="primary"
              icon={<ArrowDownTrayIcon className="w-5 h-5" />}
              className="mt-8 hover-lift glass-effect bg-orange-500/20 hover:bg-orange-500/30
                backdrop-blur-lg shadow-lg shadow-orange-500/10"
            >
              Download Portfolio
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <div className="relative dropdown-container min-w-[200px] w-full sm:w-auto">
            <DropdownButton
              value={selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              isOpen={isCategoryOpen}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            />
            <DropdownList
              items={['All', ...Array.from(new Set(projects.map(project => project.category)))]}
              selectedItem={selectedCategory}
              onSelect={(category) => setSelectedCategory(category as Category | 'All')}
              isOpen={isCategoryOpen}
              onClose={() => setIsCategoryOpen(false)}
            />
          </div>

          <div className="relative dropdown-container min-w-[200px] w-full sm:w-auto">
            <DropdownButton
              value={selectedFinish === 'All' ? 'All Finishes' : selectedFinish}
              isOpen={isFinishOpen}
              onClick={() => setIsFinishOpen(!isFinishOpen)}
            />
            <DropdownList
              items={['All', ...Array.from(new Set(projects.map(project => project.finishType)))]}
              selectedItem={selectedFinish}
              onSelect={(finish) => setSelectedFinish(finish as FinishType | 'All')}
              isOpen={isFinishOpen}
              onClose={() => setIsFinishOpen(false)}
            />
          </div>
        </motion.div>

        {/* Enhanced Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + selectedFinish}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <PortfolioGrid projects={filteredProjects.slice(0, visibleProjects)} onProjectClick={(project) => {
              setSelectedProject(project);
              setIsLightboxOpen(true);
            }} />
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Load More Trigger */}
        {visibleProjects < filteredProjects.length && (
          <motion.div 
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <div className="relative">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 
                rounded-full animate-spin" />
              <div className="absolute inset-0 border-4 border-orange-500/10 rounded-full 
                animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Enhanced Lightbox Modal */}
        <AnimatePresence>
          {isLightboxOpen && selectedProject && (
            <Dialog
              as={motion.div}
              static
              open={isLightboxOpen}
              onClose={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="min-h-screen px-4 text-center">
                <Dialog.Overlay
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                />

                <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform
                    bg-gray-900/90 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-800/50"
                >
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setIsLightboxOpen(false)}
                      className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400
                        hover:text-white transition-colors duration-200"
                      aria-label="Close dialog"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <ProjectDetails project={selectedProject} />
                </motion.div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio; 