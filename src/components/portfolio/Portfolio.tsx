import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ProjectDetails from './ProjectDetails';
import { useInView } from 'react-intersection-observer';
import '../../styles/sections.css';

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
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedFinish, setSelectedFinish] = useState<FinishType | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<number>(6);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  // Sample project data - replace with actual data from your backend
  const projects: Project[] = [
    {
      id: '1',
      title: 'Custom Car Rims',
      description: 'Professional powder coating for car rims and wheels. Complete wheel restoration with premium metallic finish, including surface preparation, sandblasting, and multi-layer coating for maximum durability.',
      category: 'Automotive',
      finishType: 'Metallic',
      color: 'Gunmetal Gray',
      imageBefore: '/images/portfolio/rims-before.jpg',
      imageAfter: '/images/portfolio/rims-after.jpg',
      clientType: 'Automotive Enthusiast',
      material: 'Aluminum Alloy',
      duration: '3 days',
      specialTechniques: ['Surface preparation', 'Multi-layer coating', 'Wheel restoration', 'Sandblasting'],
      testimonial: {
        author: 'John D.',
        text: 'Exceptional finish quality. My rims look better than new! The attention to detail in the restoration process was impressive.',
        rating: 5
      },
      videoUrl: '/videos/rim-coating-process.mp4'
    },
    // Add more sample projects here
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

  const handleDownloadPortfolio = () => {
    // Implement PDF download functionality
    window.open('/api/download-portfolio', '_blank');
  };

  return (
    <section className="relative py-24 overflow-hidden section-pattern portfolio-section">
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 hero-title">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto hero-description">
            Explore our diverse collection of powder coating transformations, showcasing our expertise in bringing new life to various surfaces.
          </p>
          <button
            onClick={handleDownloadPortfolio}
            className="mt-8 hero-buttons inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download Portfolio
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
            className="portfolio-filter"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {Object.values(projects.reduce((acc, project) => ({ ...acc, [project.category]: true }), {})).map((category) => (
              <option key={category as string} value={category as string}>{category as string}</option>
            ))}
          </select>

          <select
            value={selectedFinish}
            onChange={(e) => setSelectedFinish(e.target.value as FinishType | 'All')}
            className="portfolio-filter"
            aria-label="Filter by finish type"
          >
            <option value="All">All Finishes</option>
            {Object.values(projects.reduce((acc, project) => ({ ...acc, [project.finishType]: true }), {})).map((finish) => (
              <option key={finish as string} value={finish as string}>{finish as string}</option>
            ))}
          </select>
        </motion.div>

        {/* Project Grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-transparent"
        >
          {filteredProjects.slice(0, visibleProjects).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <div 
                onClick={() => {
                  setSelectedProject(project);
                  setIsLightboxOpen(true);
                }}
                className="portfolio-card"
              >
                <div className="portfolio-image-container">
                  <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={project.imageBefore} alt="Before" />}
                    itemTwo={<ReactCompareSliderImage src={project.imageAfter} alt="After" />}
                    className="w-full h-full object-cover"
                  />
                  <div className="portfolio-image-overlay" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="portfolio-tag portfolio-tag-primary">{project.category}</span>
                    <span className="portfolio-tag portfolio-tag-secondary">{project.finishType}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>

        {/* Load More Trigger */}
        {visibleProjects < filteredProjects.length && (
          <div ref={ref} className="portfolio-load-more">
            <div className="portfolio-spinner" />
          </div>
        )}

        {/* Lightbox Modal */}
        <Dialog
          open={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />
            <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              {selectedProject && <ProjectDetails project={selectedProject} />}
            </div>
          </div>
        </Dialog>
      </div>
    </section>
  );
};

export default Portfolio; 