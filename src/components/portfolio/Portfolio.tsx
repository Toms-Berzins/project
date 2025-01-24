import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ProjectDetails from './ProjectDetails';
import { useInView } from 'react-intersection-observer';

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
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');
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
      (selectedFinish === 'All' || project.finishType === selectedFinish) &&
      (selectedColor === 'All' || project.color === selectedColor)
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio – See Our Work in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our recent powder coating projects and transformations. From automotive parts to industrial equipment, 
            our expert finishes speak for themselves.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <motion.select
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            <option value="Automotive">Automotive</option>
            <option value="Industrial">Industrial</option>
            <option value="Furniture">Furniture</option>
            <option value="Custom Projects">Custom Projects</option>
          </motion.select>

          <motion.select
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={selectedFinish}
            onChange={(e) => setSelectedFinish(e.target.value as FinishType | 'All')}
            aria-label="Filter by finish type"
          >
            <option value="All">All Finishes</option>
            <option value="Glossy">Glossy</option>
            <option value="Matte">Matte</option>
            <option value="Metallic">Metallic</option>
            <option value="Textured">Textured</option>
            <option value="Custom">Custom</option>
          </motion.select>

          <motion.select
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            aria-label="Filter by color"
          >
            <option value="All">All Colors</option>
            <option value="Gunmetal Gray">Gunmetal Gray</option>
            <option value="Gloss Black">Gloss Black</option>
            <option value="Pearl White">Pearl White</option>
            <option value="Candy Red">Candy Red</option>
            <option value="Electric Blue">Electric Blue</option>
            <option value="Bronze">Bronze</option>
            <option value="Custom">Custom</option>
          </motion.select>
        </div>

        {/* Masonry Grid */}
        <AnimatePresence>
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {filteredProjects.slice(0, visibleProjects).map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-4 relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedProject(project);
                  setIsLightboxOpen(true);
                }}
              >
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={project.imageBefore} alt="Before" />}
                  itemTwo={<ReactCompareSliderImage src={project.imageAfter} alt="After" />}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                    <p className="text-gray-200 text-sm">{project.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded">
                        {project.category}
                      </span>
                      <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded">
                        {project.finishType}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </AnimatePresence>

        {/* Load More Trigger */}
        {visibleProjects < filteredProjects.length && (
          <div ref={ref} className="text-center mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            />
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

        {/* Call to Action Section */}
        <div className="mt-16 text-center space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/quote'}
          >
            Get a Quote for Your Project
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 mx-auto text-gray-600 hover:text-gray-800"
            onClick={handleDownloadPortfolio}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download Portfolio PDF
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio; 